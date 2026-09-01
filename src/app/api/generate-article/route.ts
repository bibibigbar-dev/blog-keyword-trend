import { NextResponse } from "next/server";
import { categories, getKeywordBySlug } from "@/data/keywords";

const OPENAI_URL = "https://api.openai.com/v1";
const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "dall-e-3";
const IMAGE_COUNT = 2;

type RequestBody = { slug?: string; title?: string };

class OpenAIRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function authHeaders(apiKey: string) {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + apiKey,
  };
}

async function openAIErrorMessage(response: Response, fallback: string) {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
  return data?.error?.message ?? fallback;
}

function articleErrorResponse(error: unknown) {
  if (error instanceof OpenAIRequestError) {
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        {
          error: `OpenAI API 키가 유효하지 않거나 권한이 없습니다. Vercel의 OPENAI_API_KEY 값에 앞뒤 공백이나 줄바꿈이 포함되지 않았는지, 그리고 해당 키에 필요한 권한(모델/이미지 생성)이 있는지 확인해 주세요. (${error.message})`,
        },
        { status: 502 },
      );
    }
    if (error.status === 429) {
      return NextResponse.json(
        { error: "OpenAI 사용량 한도 또는 요청 제한에 걸렸습니다. 결제/쿼터 상태를 확인한 뒤 다시 시도해 주세요." },
        { status: 502 },
      );
    }
    if (error.status === 400) {
      return NextResponse.json(
        { error: `OpenAI 요청 설정을 확인해 주세요. ${error.message}` },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ error: "Unable to generate article content." }, { status: 502 });
}

async function generateContent(apiKey: string, prompt: string) {
  const response = await fetch(`${OPENAI_URL}/chat/completions`, {
    method: "POST",
    headers: authHeaders(apiKey),
    body: JSON.stringify({
      model: TEXT_MODEL,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "당신은 SEO에 능숙한 한국어 블로그 작가입니다. 마크다운 기호(#, *, -) 없이 순수 텍스트로만 작성하고, 문단 사이는 빈 줄로 구분하세요. 소제목이 필요하면 문장 끝에 콜론(:)을 붙여 표현하세요.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new OpenAIRequestError(
      await openAIErrorMessage(response, `OpenAI chat completion returned ${response.status}`),
      response.status,
    );
  }
  const data = (await response.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content?.trim() ?? "";
}

async function generateImage(apiKey: string, prompt: string) {
  const response = await fetch(`${OPENAI_URL}/images/generations`, {
    method: "POST",
    headers: authHeaders(apiKey),
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    }),
  });

  if (!response.ok) {
    throw new OpenAIRequestError(
      await openAIErrorMessage(response, `OpenAI image generation returned ${response.status}`),
      response.status,
    );
  }
  const data = (await response.json()) as { data: { b64_json: string }[] };
  const b64 = data.data[0]?.b64_json;
  return b64 ? `data:image/png;base64,${b64}` : null;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  const slug = body?.slug;
  const title = body?.title?.trim();
  if (!slug || !title) {
    return NextResponse.json({ error: "slug and title are required." }, { status: 400 });
  }

  const keyword = getKeywordBySlug(slug);
  if (!keyword) {
    return NextResponse.json({ error: "Unknown keyword." }, { status: 404 });
  }
  if (!keyword.titleTemplates.includes(title)) {
    return NextResponse.json({ error: "Unknown title for this keyword." }, { status: 400 });
  }

  const categoryName = categories.find((item) => item.id === keyword.category)?.name ?? keyword.category;
  const textPrompt = [
    `카테고리: ${categoryName}`,
    `핵심 키워드: ${keyword.name}`,
    `키워드 설명: ${keyword.description}`,
    `관련 롱테일 키워드: ${keyword.longtailKeywords.join(", ")}`,
    `블로그 제목: ${title}`,
    "위 정보를 참고해 서론, 소제목이 있는 본론 3~4개 문단, 결론 순서로 1200~1600자 분량의 블로그 본문을 작성하세요. 실용적인 정보와 구체적인 예시를 포함하고 과장된 광고 문구는 피하세요.",
  ].join("\n");

  const imagePrompts = [
    `${keyword.name}을(를) 표현하는 블로그 대표 이미지. 미니멀하고 깔끔한 일러스트 스타일, 텍스트 없음.`,
    `${keyword.longtailKeywords[0] ?? keyword.name}과 관련된 장면을 보여주는 보조 이미지. 사실적인 사진 스타일, 텍스트 없음.`,
  ];

  try {
    const [content, images] = await Promise.all([
      generateContent(apiKey, textPrompt),
      Promise.all(
        imagePrompts
          .slice(0, IMAGE_COUNT)
          .map((prompt) => generateImage(apiKey, prompt).catch(() => null)),
      ),
    ]);

    return NextResponse.json({
      title,
      content,
      images: images.filter((image): image is string => Boolean(image)),
    });
  } catch (error) {
    return articleErrorResponse(error);
  }
}
