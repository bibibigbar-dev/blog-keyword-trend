# 키워드 트렌드

분야별 블로그 수익화 핫 이슈 키워드를 뉴스·매거진 스타일로 보여주는 Next.js 웹사이트입니다. 금융, 건강, IT, 여행 등 8개 분야의 키워드를 둘러보고, 상세 화면에서 롱테일 키워드와 제목 템플릿을 확인할 수 있습니다.

## 네이버 검색광고 API

홈 화면의 월간 검색량과 경쟁도는 네이버 검색광고 키워드 도구 API에서 조회합니다. Vercel 환경 변수에 다음 값을 등록해야 합니다.

- `API_KEY`
- `SECRET_KEY`
- `CUSTOMER_ID`

키는 서버의 `/api/keyword-metrics` 경로에서만 사용하며 브라우저에 노출되지 않습니다.

## 로컬 실행

Node.js 18.17 이상이 필요합니다.

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 검증 및 배포

```bash
npm run lint
npm run build
```

Vercel에서 이 저장소를 Import하면 별도 설정 없이 배포할 수 있습니다.
