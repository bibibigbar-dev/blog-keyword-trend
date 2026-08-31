import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { keywords } from "@/data/keywords";

const API_URL = "https://api.searchad.naver.com";
const URI = "/keywordstool";
const BATCH_SIZE = 5;

type NaverKeyword = {
  relKeyword: string;
  monthlyPcQcCnt: number | string;
  monthlyMobileQcCnt: number | string;
  compIdx: "낮음" | "중간" | "높음";
};

function signature(timestamp: string, secretKey: string) {
  return createHmac("sha256", secretKey)
    .update(`${timestamp}.GET.${URI}`)
    .digest("base64");
}

async function fetchBatch(names: string[]) {
  const timestamp = Date.now().toString();
  const response = await fetch(
    `${API_URL}${URI}?hintKeywords=${encodeURIComponent(names.join(","))}&showDetail=1`,
    {
      headers: {
        "X-API-KEY": process.env.API_KEY!,
        "X-Customer": process.env.CUSTOMER_ID!,
        "X-Signature": signature(timestamp, process.env.SECRET_KEY!),
        "X-Timestamp": timestamp,
      },
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) throw new Error(`Naver SearchAd API returned ${response.status}`);
  const data = (await response.json()) as { keywordList: NaverKeyword[] };
  return data.keywordList;
}

export async function GET() {
  const { API_KEY, SECRET_KEY, CUSTOMER_ID } = process.env;
  if (!API_KEY || !SECRET_KEY || !CUSTOMER_ID) {
    return NextResponse.json({ error: "Naver API credentials are not configured." }, { status: 503 });
  }

  try {
    const names = keywords.map((keyword) => keyword.name);
    const batches = Array.from({ length: Math.ceil(names.length / BATCH_SIZE) }, (_, index) =>
      names.slice(index * BATCH_SIZE, (index + 1) * BATCH_SIZE),
    );
    const results = (await Promise.all(batches.map(fetchBatch))).flat();
    const metrics = Object.fromEntries(
      results.map((keyword) => [
        keyword.relKeyword,
        {
          pc: keyword.monthlyPcQcCnt,
          mobile: keyword.monthlyMobileQcCnt,
          competition: keyword.compIdx,
        },
      ]),
    );

    return NextResponse.json(
      { metrics, updatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    return NextResponse.json({ error: "Unable to retrieve Naver keyword metrics." }, { status: 502 });
  }
}
