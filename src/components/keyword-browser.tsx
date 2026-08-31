"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, keywords, type Category, type Keyword } from "@/data/keywords";

const badgeLabels = { hot: "🔥 급상승", highcpc: "💰 고CPC", new: "🆕 신규" };
const levelLabels = { high: "높음", medium: "중간", low: "낮음" };

function KeywordCard({ keyword }: { keyword: Keyword }) {
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
        <div><dt>검색량</dt><dd className={keyword.searchVolume}>{levelLabels[keyword.searchVolume]}</dd></div>
        <div><dt>경쟁도</dt><dd className={keyword.competition}>{levelLabels[keyword.competition]}</dd></div>
      </dl>
    </Link>
  );
}

export default function KeywordBrowser() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const visibleKeywords = activeCategory === "all" ? keywords : keywords.filter((keyword) => keyword.category === activeCategory);
  const topKeywords = keywords.filter((keyword) => keyword.badges.includes("hot")).slice(0, 5);

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
          <div className="section-heading"><p>EDITOR&apos;S PICK</p><h1>{activeCategory === "all" ? "오늘 주목할 키워드" : `${categories.find((category) => category.id === activeCategory)?.name} 키워드`}</h1></div>
          <div className="keyword-grid">{visibleKeywords.map((keyword) => <KeywordCard key={keyword.id} keyword={keyword} />)}</div>
        </section>
        <aside>
          <div className="top-five">
            <p className="eyebrow">TODAY&apos;S RANKING</p>
            <h2>오늘의 TOP 5</h2>
            <ol>
              {topKeywords.map((keyword, index) => (
                <li key={keyword.id}><span>{String(index + 1).padStart(2, "0")}</span><Link href={`/keyword/${keyword.slug}`}>{keyword.name}</Link></li>
              ))}
            </ol>
          </div>
          <p className="sidebar-note">검색 트렌드와 광고 효율을 바탕으로 큐레이션한 콘텐츠 아이디어입니다.</p>
        </aside>
      </div>
    </>
  );
}
