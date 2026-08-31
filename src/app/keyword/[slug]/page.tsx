import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getKeywordBySlug, keywords } from "@/data/keywords";

export function generateStaticParams() {
  return keywords.map((keyword) => ({ slug: keyword.slug }));
}

export default function KeywordDetailPage({ params }: { params: { slug: string } }) {
  const keyword = getKeywordBySlug(params.slug);
  if (!keyword) notFound();
  const category = categories.find((item) => item.id === keyword.category);

  return (
    <main className="detail-page">
      <Link className="back-link" href="/">← 모든 키워드 보기</Link>
      <p className="eyebrow">{category?.name} · KEYWORD BRIEF</p>
      <h1>{keyword.name}</h1>
      <p className="lead">{keyword.description}</p>
      <div className="detail-meta"><span>검색량 <strong>{keyword.searchVolume === "high" ? "높음" : keyword.searchVolume === "medium" ? "중간" : "낮음"}</strong></span><span>경쟁도 <strong>{keyword.competition === "high" ? "높음" : keyword.competition === "medium" ? "중간" : "낮음"}</strong></span></div>
      <section><h2>롱테일 키워드</h2><ul className="tag-list">{keyword.longtailKeywords.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section><h2>바로 쓰는 블로그 제목 템플릿</h2><ol className="template-list">{keyword.titleTemplates.map((item) => <li key={item}>{item}</li>)}</ol></section>
      <section><h2>관련 키워드 추천</h2><div className="related-list">{keyword.relatedKeywords.map((item) => { const related = keywords.find((candidate) => candidate.name === item); return related ? <Link key={item} href={`/keyword/${related.slug}`}>{item} →</Link> : null; })}</div></section>
    </main>
  );
}
