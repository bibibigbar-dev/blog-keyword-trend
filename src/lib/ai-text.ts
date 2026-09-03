const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const GITHUB_MODELS_CHAT_URL = "https://models.github.ai/inference/chat/completions";
const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

const OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";
const GITHUB_MODELS_MODEL = process.env.GITHUB_MODELS_MODEL || "openai/gpt-4o-mini";
const ANTHROPIC_TEXT_MODEL = process.env.ANTHROPIC_TEXT_MODEL || "claude-3-5-haiku-latest";

export class AIGenerationError extends Error {
  constructor(
    message: string,
    readonly failures: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

async function extractErrorMessage(response: Response, fallback: string) {
  const data = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
  return data?.error?.message ?? fallback;
}

async function requestOpenAICompatible(
  url: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, `Chat completion returned ${response.status}`));
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
    throw new Error(await extractErrorMessage(response, `Claude messages API returned ${response.status}`));
  }
  const data = (await response.json()) as { content?: { type: string; text?: string }[] };
  return (data.content ?? [])
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

type Provider = {
  name: "openai" | "github" | "claude";
  run: () => Promise<string>;
};

/**
 * OpenAI → GitHub Models → Claude 순서로 텍스트 생성을 시도합니다.
 */
export async function generateTextWithFallback(systemPrompt: string, userPrompt: string) {
  const openAIKey = process.env.OPENAI_API_KEY?.trim();
  const githubToken = process.env.GITHUB_MODELS_TOKEN?.trim();
  const claudeKey = process.env.ANTHROPIC_API_KEY?.trim();

  const providers: Provider[] = [];
  if (openAIKey) {
    providers.push({
      name: "openai",
      run: () => requestOpenAICompatible(OPENAI_CHAT_URL, openAIKey, OPENAI_TEXT_MODEL, systemPrompt, userPrompt),
    });
  }
  if (githubToken) {
    providers.push({
      name: "github",
      run: () =>
        requestOpenAICompatible(GITHUB_MODELS_CHAT_URL, githubToken, GITHUB_MODELS_MODEL, systemPrompt, userPrompt),
    });
  }
  if (claudeKey) {
    providers.push({
      name: "claude",
      run: () => requestClaude(claudeKey, systemPrompt, userPrompt),
    });
  }

  if (providers.length === 0) {
    throw new AIGenerationError("AI API 키가 설정되지 않았습니다.");
  }

  const failures: Record<string, unknown> = {};
  for (const provider of providers) {
    try {
      const content = await provider.run();
      if (content) return { content, provider: provider.name };
      failures[provider.name] = new Error(`${provider.name} returned an empty response.`);
    } catch (error) {
      failures[provider.name] = error;
    }
  }

  throw new AIGenerationError("모든 AI 제공자(OpenAI, GitHub Models, Claude) 호출에 실패했습니다.", failures);
}
