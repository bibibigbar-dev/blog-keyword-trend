import { NextResponse } from "next/server";
import { generateTextWithFallback } from "@/lib/ai-text";

const MAX_TOPIC_LENGTH = 200;

const TOPIC_SYSTEM_PROMPT =
  "당신은 명확하고 신뢰할 수 있는 한국어 콘텐츠 작가입니다. 마크다운 기호 없이 순수 텍스트로 작성하고, 문단 사이는 빈 줄로 구분하세요.";

export async function POST(request: Request) {
  if (
    !process.env.OPENAI_API_KEY?.trim() &&
    !process.env.GITHUB_MODELS_TOKEN?.trim() &&
    !process.env.ANTHROPIC_API_KEY?.trim()
  ) {
    return NextResponse.json(
      {
        error:
          "AI API 키가 설정되지 않았습니다. OPENAI_API_KEY, GITHUB_MODELS_TOKEN, ANTHROPIC_API_KEY 중 하나 이상을 등록해 주세요.",
      },
      { status: 503 },
    );
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
    const { content } = await generateTextWithFallback(
      TOPIC_SYSTEM_PROMPT,
      `"${topic}" 주제로 독자가 바로 이해할 수 있는 700~1000자 분량의 글을 작성하세요. 짧은 도입, 핵심 내용 3개, 실용적인 마무리를 포함하고 확인할 수 없는 사실이나 과장된 표현은 피하세요.`,
    );

    return NextResponse.json({ content });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    return NextResponse.json(
      {
        error: `OpenAI, GitHub Models, Claude 순서로 모두 시도했지만 콘텐츠 생성에 실패했습니다.${detail ? ` (${detail})` : ""}`,
      },
      { status: 502 },
    );
  }
}
