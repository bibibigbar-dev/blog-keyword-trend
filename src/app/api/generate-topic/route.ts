import { NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";
const MAX_TOPIC_LENGTH = 200;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { topic?: unknown } | null;
  const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
  if (!topic || topic.length > MAX_TOPIC_LENGTH) {
    return NextResponse.json(
      { error: `주제는 1~${MAX_TOPIC_LENGTH}자로 입력해 주세요.` },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "당신은 명확하고 신뢰할 수 있는 한국어 콘텐츠 작가입니다. 마크다운 기호 없이 순수 텍스트로 작성하고, 문단 사이는 빈 줄로 구분하세요.",
          },
          {
            role: "user",
            content: `"${topic}" 주제로 독자가 바로 이해할 수 있는 700~1000자 분량의 글을 작성하세요. 짧은 도입, 핵심 내용 3개, 실용적인 마무리를 포함하고 확인할 수 없는 사실이나 과장된 표현은 피하세요.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
      return NextResponse.json(
        { error: data?.error?.message ?? "AI 콘텐츠 생성에 실패했습니다." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json({ error: "AI가 콘텐츠를 생성하지 못했습니다." }, { status: 502 });
    }

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: "AI 콘텐츠 생성에 실패했습니다." }, { status: 502 });
  }
}
