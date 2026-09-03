# 키워드 트렌드

분야별 블로그 수익화 핫 이슈 키워드를 뉴스·매거진 스타일로 보여주는 Next.js 웹사이트입니다. 금융, 건강, IT, 여행 등 8개 분야의 키워드를 둘러보고, 상세 화면에서 롱테일 키워드와 제목 템플릿을 확인할 수 있습니다.

## 네이버 검색광고 API

홈 화면의 월간 검색량과 경쟁도는 네이버 검색광고 키워드 도구 API에서 조회합니다. API 응답을 받을 때마다 등록된 후보 키워드를 월간 PC·모바일 검색량 합계로 다시 정렬해 TOP 5를 갱신합니다. 다만 이 API는 실시간 검색어·일간 순위 API가 아니며, 새로운 후보 키워드를 자동으로 발굴하지는 않습니다. Render 환경 변수에 다음 값을 등록해야 합니다.

- `API_KEY`
- `SECRET_KEY`
- `CUSTOMER_ID`

키는 서버의 `/api/keyword-metrics` 경로에서만 사용하며 브라우저에 노출되지 않습니다.

## AI 본문·이미지 생성

메인 화면에서 주제를 입력하거나 키워드 상세 화면에서 제목 템플릿을 클릭하면 OpenAI가 콘텐츠를 생성합니다. 각각 `/api/generate-topic`, `/api/generate-article` 경로에서 실행되며, Render 환경 변수에 다음 값을 등록해야 합니다.

- `OPENAI_API_KEY` (필수)
- `OPENAI_TEXT_MODEL` (선택, 기본값 `gpt-4o-mini`)
- `OPENAI_IMAGE_MODEL` (선택, 기본값 `dall-e-3`)

키는 서버의 `/api/generate-article` 경로에서만 사용하며 브라우저에 노출되지 않습니다.

> 같은 키를 다른 곳에서는 정상적으로 쓰고 있는데도 "API 키가 유효하지 않다"는 오류가 계속 발생한다면, Render 환경 변수 값에 앞뒤 공백이나 줄바꿈이 포함되지 않았는지, 그리고 해당 키에 이미지 생성(`dall-e-3`) 등 필요한 모델 권한이 있는지 확인해 주세요.

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

Render에서 이 저장소를 Web Service로 연결하고 다음을 설정합니다.

- Runtime: `Node`
- Build Command: `npm ci && npm run build`
- Start Command: `npm run start`
- Node.js: 18.17 이상

위 환경 변수를 Render 서비스의 **Environment**에 등록합니다. API 키는 브라우저에 노출하지 말고 Render에만 등록하세요.
