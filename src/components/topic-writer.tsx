"use client";

import { FormEvent, useState } from "react";

export default function TopicWriter() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setError("주제를 입력해 주세요.");
      return;
    }

    setLoading(true);
    setContent(null);
    setError(null);
    try {
      const response = await fetch("/api/generate-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmedTopic }),
      });
      const data = (await response.json()) as { content?: string; error?: string };
      if (!response.ok || !data.content) throw new Error(data.error ?? "콘텐츠 생성에 실패했습니다.");
      setContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "콘텐츠 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="topic-writer" aria-labelledby="topic-writer-title">
      <p className="eyebrow">AI WRITER</p>
      <h1 id="topic-writer-title">원하는 주제로 글을 작성해 보세요</h1>
      <p>주제를 입력하면 AI가 핵심 내용을 정리한 한국어 초안을 작성합니다.</p>
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="topic">작성할 주제</label>
        <input
          id="topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="예: 직장인을 위한 효율적인 시간 관리법"
          maxLength={200}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>{loading ? "작성 중..." : "글 작성하기"}</button>
      </form>
      {error && <p className="article-status error" role="alert">{error}</p>}
      {content && (
        <div className="topic-result" aria-live="polite">
          {content.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
          ))}
        </div>
      )}
    </section>
  );
}
