"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categories, keywords, type Category, type Keyword } from "@/data/keywords";

const badgeLabels = { hot: "🔥 급상승", highcpc: "💰 고CPC", new: "🆕 신규" };
const levelLabels = { high: "높음", medium: "중간", low: "낮음" };
type Metrics = Record<string, { pc: number | string; mobile: number | string; competition: string }>;
type MetricsResponse = { metrics: Metrics; ranking?: string[]; updatedAt?: string };
const numberFormat = new Intl.NumberFormat("ko-KR");
const formatCount = (count: number | string) => typeof count === "number" ? numberFormat.format(count) : count;
const formatUpdatedAt = (value?: string) => value
  ? new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
  : null;

function KeywordCard({ keyword, metrics }: { keyword: Keyword; metrics: Metrics }) {
  const metric = metrics[keyword.name];

  return (
    <Link className="keyword-card" href={`/keyword/${keyword.slug}`}>
      <div className="card-topline">
        <span className="category-label">{categories.find((category) => category.id === keyword.category)?.name}</span>
        <span className="arrow">↗</span>
      </div>
      <h2>{keyword.name}</h2>
      <div className="badges">
        {keyword.badges.map((badge) => <span key={badge} className={`badge ${badge}`}>{badgeLabels[badge]}</span>)}
      </div>
      <p>{keyword.description}</p>
      <dl className="metrics">
        <div><dt>월간 검색량</dt><dd className={keyword.searchVolume}>{metric ? `PC ${formatCount(metric.pc)} / 모바일 ${formatCount(metric.mobile)}` : levelLabels[keyword.searchVolume]}</dd></div>
        <div><dt>경쟁도</dt><dd className={keyword.competition}>{metric?.competition ?? levelLabels[keyword.competition]}</dd></div>
      </dl>
    </Link>
  );
}

export default function KeywordBrowser() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [metrics, setMetrics] = useState<Metrics>({});
  const [ranking, setRanking] = useState<string[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | undefined>();
  const visibleKeywords = activeCategory === "all" ? keywords : keywords.filter((keyword) => keyword.category === activeCategory);
  const topKeywords = (ranking.length
    ? ranking.map((name) => keywords.find((keyword) => keyword.name === name)).filter((keyword): keyword is Keyword => Boolean(keyword))
    : keywords.filter((keyword) => keyword.badges.includes("hot")).slice(0, 5));

  useEffect(() => {
    fetch("/api/keyword-metrics")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: MetricsResponse) => {
        setMetrics(data.metrics);
        setRanking(data.ranking ?? []);
        setUpdatedAt(data.updatedAt);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <nav className="category-nav" aria-label="키워드 분야">
        {categories.map((category) => (
          <button key={category.id} className={activeCategory === category.id ? "active" : ""} onClick={() => setActiveCategory(category.id)}>
            {category.name}
          </button>
        ))}
      </nav>
      <div className="content-grid">
        <section aria-live="polite">
          <div className="section-heading"><p>EDITOR&apos;S PICK</p><h1>{activeCategory === "all" ? "주목할 키워드" : `${categories.find((category) => category.id === activeCategory)?.name} 키워드`}</h1></div>
          <div className="keyword-grid">{visibleKeywords.map((keyword) => <KeywordCard key={keyword.id} keyword={keyword} metrics={metrics} />)}</div>
        </section>
        <aside>
          <div className="top-five">
            <p className="eyebrow">EDITOR&apos;S RANKING</p>
            <h2>검색량 기준 TOP 5</h2>
            <ol>
              {topKeywords.map((keyword, index) => (
                <li key={keyword.id}><span>{String(index + 1).padStart(2, "0")}</span><Link href={`/keyword/${keyword.slug}`}>{keyword.name}</Link></li>
              ))}
            </ol>
          </div>
          <p className="sidebar-note">
            네이버 검색광고 API의 월간 PC·모바일 검색량 합계로 순위를 갱신합니다.
            {formatUpdatedAt(updatedAt) ? ` 마지막 조회: ${formatUpdatedAt(updatedAt)}` : " API 연결 전에는 편집 순위를 표시합니다."}
          </p>
        </aside>
      </div>
    </>
  );
}
