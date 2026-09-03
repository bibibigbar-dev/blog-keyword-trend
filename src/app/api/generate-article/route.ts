import { NextResponse } from "next/server";
import { categories, getKeywordBySlug } from "@/data/keywords";
import { generateTextWithFallback } from "@/lib/ai-text";

const OPENAI_URL = "https://api.openai.com/v1";
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "dall-e-3";
const IMAGE_COUNT = 2;

const ARTICLE_SYSTEM_PROMPT =
  "당신은 SEO에 능숙한 한국어 블로그 작가입니다. 마크다운 기호(#, *, -) 없이 순수 텍스트로만 작성하고, 문단 사이는 빈 줄로 구분하세요. 소제목이 필요하면 문장 끝에 콜론(:)을 붙여 표현하세요.";

type RequestBody = { slug?: string; title?: string };

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
  const detail = error instanceof Error ? error.message : "";

  return NextResponse.json(
    {
      error: `OpenAI, GitHub Models, Claude 순서로 모두 시도했지만 본문 생성에 실패했습니다. Render 환경 변수의 OPENAI_API_KEY, GITHUB_MODELS_TOKEN, ANTHROPIC_API_KEY 값에 앞뒤 공백이나 줄바꿈이 없는지, 각 키의 권한과 사용량 한도를 확인해 주세요.${detail ? ` (${detail})` : ""}`,
    },
    { status: 502 },
  );
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
    throw new Error(
      await openAIErrorMessage(response, `OpenAI image generation returned ${response.status}`),
    );
  }
  const data = (await response.json()) as { data: { b64_json: string }[] };
  const b64 = data.data[0]?.b64_json;
  return b64 ? `data:image/png;base64,${b64}` : null;
}

export async function POST(request: Request) {
  const openAIKey = process.env.OPENAI_API_KEY?.trim();
  if (!openAIKey && !process.env.GITHUB_MODELS_TOKEN?.trim() && !process.env.ANTHROPIC_API_KEY?.trim()) {
    return NextResponse.json(
      {
        error:
          "AI API 키가 설정되지 않았습니다. OPENAI_API_KEY, GITHUB_MODELS_TOKEN, ANTHROPIC_API_KEY 중 하나 이상을 등록해 주세요.",
      },
      { status: 503 },
    );
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
    const [textResult, images] = await Promise.all([
      generateTextWithFallback(ARTICLE_SYSTEM_PROMPT, textPrompt),
      openAIKey
        ? Promise.all(
            imagePrompts
              .slice(0, IMAGE_COUNT)
              .map((prompt) => generateImage(openAIKey, prompt).catch(() => null)),
          )
        : Promise.resolve([] as (string | null)[]),
    ]);
    const content = textResult.content;

    return NextResponse.json({
      title,
      content,
      images: images.filter((image): image is string => Boolean(image)),
    });
  } catch (error) {
    return articleErrorResponse(error);
  }
}
