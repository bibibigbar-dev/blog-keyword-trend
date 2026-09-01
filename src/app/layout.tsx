import type { Metadata } from "next";
import Link from "next/link";
import CurrentDate from "@/components/current-date";
import "./globals.css";

export const metadata: Metadata = {
  title: "키워드 트렌드 | 블로그 수익화 아이디어",
  description: "분야별 블로그 수익화 핫 이슈 키워드",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link className="brand" href="/">키워드 <em>트렌드</em></Link>
            <p><CurrentDate /> · 블로그 수익화 인사이트</p>
          </div>
        </header>
        {children}
        <footer>KEYWORD TREND · 콘텐츠를 시작하는 가장 빠른 단서</footer>
      </body>
    </html>
  );
}
