const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

const OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";
const ANTHROPIC_TEXT_MODEL = process.env.ANTHROPIC_TEXT_MODEL || "claude-3-5-haiku-latest";

export class OpenAIRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export class ClaudeRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export class AIGenerationError extends Error {
  constructor(
    message: string,
    readonly openAIError?: unknown,
    readonly claudeError?: unknown,
  ) {
    super(message);
  }
}

async function openAIErrorMessage(response: Response, fallback: string) {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
  return data?.error?.message ?? fallback;
}

async function claudeErrorMessage(response: Response, fallback: string) {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
  return data?.error?.message ?? fallback;
}

async function requestOpenAI(apiKey: string, systemPrompt: string, userPrompt: string) {
  const response = await fetch(OPENAI_CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: OPENAI_TEXT_MODEL,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
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

async function requestClaude(apiKey: string, systemPrompt: string, userPrompt: string) {
  const response = await fetch(ANTHROPIC_MESSAGES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: ANTHROPIC_TEXT_MODEL,
      max_tokens: 2048,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new ClaudeRequestError(
      await claudeErrorMessage(response, `Claude messages API returned ${response.status}`),
      response.status,
    );
  }
  const data = (await response.json()) as { content?: { type: string; text?: string }[] };
  return (data.content ?? [])
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

/**
 * OpenAI로 텍스트 생성을 먼저 시도하고, 실패하면 Claude로 대체합니다.
 */
export async function generateTextWithFallback(systemPrompt: string, userPrompt: string) {
  const openAIKey = process.env.OPENAI_API_KEY?.trim();
  const claudeKey = process.env.ANTHROPIC_API_KEY?.trim();

  if (!openAIKey && !claudeKey) {
    throw new AIGenerationError("AI API 키가 설정되지 않았습니다.");
  }

  let openAIError: unknown;
  if (openAIKey) {
    try {
      const content = await requestOpenAI(openAIKey, systemPrompt, userPrompt);
      if (content) return { content, provider: "openai" as const };
      openAIError = new Error("OpenAI returned an empty response.");
    } catch (error) {
      openAIError = error;
    }
  }

  if (claudeKey) {
    try {
      const content = await requestClaude(claudeKey, systemPrompt, userPrompt);
      if (content) return { content, provider: "claude" as const };
      throw new AIGenerationError("Claude returned an empty response.", openAIError);
    } catch (error) {
      if (error instanceof AIGenerationError) throw error;
      throw new AIGenerationError("OpenAI와 Claude API 모두 실패했습니다.", openAIError, error);
    }
  }

  throw openAIError;
}
