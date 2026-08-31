"use client";

import { useState } from "react";

type GenerateResponse = { title: string; content: string; images: string[] };

export default function ArticleGenerator({
  slug,
  titleTemplates,
}: {
  slug: string;
  titleTemplates: string[];
}) {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const handleSelect = async (title: string) => {
    setSelectedTitle(title);
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "본문 생성에 실패했습니다.");
      setResult(data as GenerateResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "본문 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ol className="template-list">
      {titleTemplates.map((item) => (
        <li key={item}>
          <button
            type="button"
            className={`title-button ${selectedTitle === item ? "active" : ""}`}
            onClick={() => handleSelect(item)}
          >
            {item}
          </button>
          {selectedTitle === item && (
            <div className="article-panel">
              {loading && <p className="article-status">AI가 본문과 이미지를 생성하는 중입니다...</p>}
              {error && <p className="article-status error">{error}</p>}
              {result && (
                <>
                  {result.images.length > 0 && (
                    <div className="article-images">
                      {result.images.map((src, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={index} src={src} alt={`${result.title} 추천 이미지 ${index + 1}`} />
                      ))}
                    </div>
                  )}
                  <div className="article-body">
                    {result.content
                      .split(/\n{2,}/)
                      .filter((paragraph) => paragraph.trim().length > 0)
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph.trim()}</p>
                      ))}
                  </div>
                </>
              )}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
