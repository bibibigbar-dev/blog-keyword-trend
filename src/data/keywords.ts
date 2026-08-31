export type Category =
  | "finance"
  | "health"
  | "it"
  | "travel"
  | "beauty"
  | "selfdev"
  | "food"
  | "life";

export type Keyword = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  badges: ("hot" | "highcpc" | "new")[];
  searchVolume: "high" | "medium" | "low";
  competition: "low" | "medium" | "high";
  description: string;
  longtailKeywords: string[];
  titleTemplates: string[];
  relatedKeywords: string[];
};

export const categories: { id: Category | "all"; name: string }[] = [
  { id: "all", name: "전체" },
  { id: "finance", name: "금융·재테크" },
  { id: "health", name: "건강·다이어트" },
  { id: "it", name: "IT·AI" },
  { id: "travel", name: "여행" },
  { id: "beauty", name: "뷰티" },
  { id: "selfdev", name: "자기계발" },
  { id: "food", name: "음식·레시피" },
  { id: "life", name: "생활·절약" },
];

type KeywordSeed = Pick<Keyword, "name" | "category" | "badges" | "searchVolume" | "competition" | "description">;

const keywordSeeds: KeywordSeed[] = [
  { name: "신용카드 추천", category: "finance", badges: ["hot", "highcpc"], searchVolume: "high", competition: "high", description: "혜택과 소비 패턴을 비교하는 카드 선택 가이드 수요가 꾸준합니다." },
  { name: "ETF 투자", category: "finance", badges: ["hot"], searchVolume: "high", competition: "high", description: "분산 투자와 장기 적립식 ETF 정보를 찾는 초보 투자자가 많습니다." },
  { name: "사회초년생 재테크", category: "finance", badges: ["new"], searchVolume: "high", competition: "medium", description: "첫 월급부터 시작하는 예산 관리와 투자 순서가 핵심입니다." },
  { name: "연금저축", category: "finance", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "세액공제와 노후 준비를 함께 살피는 대표 절세 키워드입니다." },
  { name: "IRP 계좌", category: "finance", badges: ["hot", "highcpc"], searchVolume: "high", competition: "high", description: "퇴직연금 계좌의 개설 방법과 운용 상품 비교 수요가 높습니다." },
  { name: "청약통장", category: "finance", badges: ["hot"], searchVolume: "high", competition: "high", description: "내 집 마련을 위한 청약 조건과 납입 전략을 다룹니다." },
  { name: "부동산 세금", category: "finance", badges: ["highcpc"], searchVolume: "medium", competition: "high", description: "취득·보유·양도 단계별 세금 정리 콘텐츠가 유용합니다." },
  { name: "실손보험", category: "finance", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "세대별 보장 차이와 청구 방법을 비교하는 정보성 주제입니다." },
  { name: "암보험 비교", category: "finance", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "진단비와 갱신 조건을 비교하려는 검색 의도가 뚜렷합니다." },
  { name: "주식 포트폴리오", category: "finance", badges: ["hot"], searchVolume: "high", competition: "high", description: "시장 상황에 맞춘 자산 배분과 리밸런싱에 관심이 높습니다." },
  { name: "간헐적 단식", category: "health", badges: ["hot"], searchVolume: "high", competition: "high", description: "식사 시간 관리와 지속 가능한 건강 습관을 찾는 주제입니다." },
  { name: "홈트레이닝", category: "health", badges: ["new"], searchVolume: "high", competition: "high", description: "장비 없이 집에서 실천할 수 있는 운동 루틴 수요가 큽니다." },
  { name: "마그네슘 효능", category: "health", badges: ["hot", "highcpc"], searchVolume: "high", competition: "high", description: "수면과 피로 관리 관점의 영양 정보 검색이 활발합니다." },
  { name: "오메가3 추천", category: "health", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "원료와 함량, 섭취 기준을 비교하는 구매 전환형 키워드입니다." },
  { name: "혈당 관리", category: "health", badges: ["hot"], searchVolume: "high", competition: "medium", description: "식단과 생활 습관으로 혈당을 관리하는 방법에 관심이 높습니다." },
  { name: "임플란트 비용", category: "health", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "치과 치료 비용과 보험 적용을 알아보는 수요가 꾸준합니다." },
  { name: "다이어트 식단", category: "health", badges: ["hot"], searchVolume: "high", competition: "high", description: "현실적으로 따라 할 수 있는 식단 구성과 레시피가 인기입니다." },
  { name: "면역 영양제", category: "health", badges: ["highcpc", "new"], searchVolume: "medium", competition: "high", description: "계절 변화에 맞춘 영양 성분과 섭취 정보를 찾습니다." },
  { name: "멘탈헬스", category: "health", badges: ["new"], searchVolume: "medium", competition: "medium", description: "스트레스와 마음 돌봄을 위한 일상 관리 콘텐츠 주제입니다." },
  { name: "수면 개선", category: "health", badges: ["hot"], searchVolume: "high", competition: "medium", description: "수면 환경과 루틴을 바꾸려는 실용적 검색이 늘고 있습니다." },
  { name: "챗GPT 활용법", category: "it", badges: ["hot", "highcpc"], searchVolume: "high", competition: "high", description: "업무와 일상에서 AI를 효율적으로 쓰는 프롬프트 수요가 높습니다." },
  { name: "AI 이미지 생성", category: "it", badges: ["hot", "new"], searchVolume: "high", competition: "high", description: "콘텐츠 제작에 쓰는 생성형 이미지 도구 활용이 빠르게 확산 중입니다." },
  { name: "노트북 추천", category: "it", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "용도와 예산별 사양 비교가 중요한 구매 가이드 키워드입니다." },
  { name: "생산성 앱", category: "it", badges: ["new"], searchVolume: "medium", competition: "medium", description: "시간 관리와 협업을 돕는 앱 조합을 찾는 직장인이 많습니다." },
  { name: "스마트홈", category: "it", badges: ["hot"], searchVolume: "medium", competition: "medium", description: "조명과 가전 자동화를 시작하려는 입문자에게 적합합니다." },
  { name: "클라우드 저장소", category: "it", badges: ["highcpc"], searchVolume: "medium", competition: "high", description: "용량, 보안, 공유 기능을 비교하는 정보 수요가 있습니다." },
  { name: "IT 자격증", category: "it", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "커리어 전환과 취업을 위한 자격증 로드맵 주제입니다." },
  { name: "블로그 자동화", category: "it", badges: ["hot", "new"], searchVolume: "high", competition: "medium", description: "AI와 도구를 활용해 콘텐츠 업무를 줄이는 방법이 주목받습니다." },
  { name: "유튜브 AI 편집", category: "it", badges: ["hot"], searchVolume: "high", competition: "high", description: "짧은 영상 제작 시간을 단축하는 AI 편집 도구 관심이 높습니다." },
  { name: "앱 개발 입문", category: "it", badges: ["new"], searchVolume: "medium", competition: "medium", description: "노코드와 모바일 개발을 처음 배우려는 검색자에게 유용합니다." },
  { name: "2026 해외여행지", category: "travel", badges: ["hot", "new"], searchVolume: "high", competition: "high", description: "올해 여행 계획을 위한 도시별 비용과 일정 정보가 필요합니다." },
  { name: "국내 근교 여행", category: "travel", badges: ["hot"], searchVolume: "high", competition: "high", description: "주말에 떠날 수 있는 짧은 여행 코스가 꾸준히 검색됩니다." },
  { name: "가성비 유럽여행", category: "travel", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "항공권과 숙소를 아끼는 유럽 자유여행 노하우를 다룹니다." },
  { name: "제주도 맛집", category: "travel", badges: ["hot"], searchVolume: "high", competition: "high", description: "지역과 메뉴별 실제 방문 기반 정보가 경쟁력 있는 주제입니다." },
  { name: "항공권 싸게 사는법", category: "travel", badges: ["hot", "highcpc"], searchVolume: "high", competition: "high", description: "예약 시점과 비교 사이트를 찾는 전환 의도가 높은 키워드입니다." },
  { name: "혼자 여행", category: "travel", badges: ["new"], searchVolume: "high", competition: "medium", description: "안전하고 부담 없이 떠나는 1인 여행 콘텐츠가 인기입니다." },
  { name: "캠핑 장비", category: "travel", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "초보 캠퍼를 위한 필수 장비와 예산별 추천 수요가 있습니다." },
  { name: "동남아 여행", category: "travel", badges: ["hot"], searchVolume: "high", competition: "high", description: "휴양과 가성비를 동시에 찾는 여행객의 관심이 높습니다." },
  { name: "여행 짐 싸기", category: "travel", badges: ["new"], searchVolume: "medium", competition: "low", description: "여행 기간과 계절에 맞는 체크리스트형 콘텐츠가 효과적입니다." },
  { name: "에어비앤비", category: "travel", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "숙소 예약 팁과 지역별 숙소 선택법을 찾는 키워드입니다." },
  { name: "피부타입별 스킨케어", category: "beauty", badges: ["hot"], searchVolume: "high", competition: "high", description: "피부 고민에 맞는 성분과 루틴을 탐색하는 기초 뷰티 주제입니다." },
  { name: "K-뷰티 루틴", category: "beauty", badges: ["hot", "new"], searchVolume: "high", competition: "high", description: "국내외 소비자가 한국식 단계별 관리법에 관심을 보입니다." },
  { name: "선크림 추천", category: "beauty", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "자외선 차단 지수와 사용감 비교가 핵심인 시즌성 키워드입니다." },
  { name: "탈모 샴푸", category: "beauty", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "두피 관리 성분과 사용 후기를 찾는 구매 목적 검색이 많습니다." },
  { name: "안티에이징 크림", category: "beauty", badges: ["highcpc"], searchVolume: "medium", competition: "high", description: "탄력과 주름 고민을 위한 성분 비교 콘텐츠에 적합합니다." },
  { name: "가성비 화장품", category: "beauty", badges: ["hot"], searchVolume: "high", competition: "high", description: "합리적인 가격의 검증된 제품 큐레이션이 반응을 얻습니다." },
  { name: "남자 스킨케어", category: "beauty", badges: ["new"], searchVolume: "high", competition: "medium", description: "간단하고 실용적인 남성용 관리 루틴 수요가 커지고 있습니다." },
  { name: "향수 추천", category: "beauty", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "계절과 분위기별 향을 찾는 선물·구매 전환형 키워드입니다." },
  { name: "파운데이션 추천", category: "beauty", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "피부 표현과 지속력을 비교하는 리뷰 콘텐츠가 중요합니다." },
  { name: "피부과 시술", category: "beauty", badges: ["highcpc", "hot"], searchVolume: "high", competition: "high", description: "시술별 효과와 주의 사항을 비교하려는 관심이 높습니다." },
  { name: "독서 습관", category: "selfdev", badges: ["new"], searchVolume: "medium", competition: "medium", description: "바쁜 일상에서도 꾸준히 읽는 환경과 기록법을 다룹니다." },
  { name: "영어회화 앱", category: "selfdev", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "짧은 시간에 실전 회화를 연습할 앱 비교 수요가 많습니다." },
  { name: "토익 공부법", category: "selfdev", badges: ["hot"], searchVolume: "high", competition: "high", description: "목표 점수와 기간에 맞춘 학습 계획이 필요한 키워드입니다." },
  { name: "자격증 추천", category: "selfdev", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "직무와 취업 전망을 고려한 자격증 선택 콘텐츠가 유용합니다." },
  { name: "온라인 강의", category: "selfdev", badges: ["new"], searchVolume: "high", competition: "high", description: "학습 목표에 맞는 플랫폼과 강의 활용법을 찾습니다." },
  { name: "번아웃 극복", category: "selfdev", badges: ["hot"], searchVolume: "high", competition: "medium", description: "일과 삶의 균형을 회복하는 현실적인 경험담이 공감받습니다." },
  { name: "시간관리", category: "selfdev", badges: ["hot"], searchVolume: "high", competition: "high", description: "우선순위와 집중력을 높이는 방법은 꾸준한 관심 주제입니다." },
  { name: "부업 추천", category: "selfdev", badges: ["hot", "highcpc"], searchVolume: "high", competition: "high", description: "본업과 병행 가능한 수익 활동을 탐색하는 수요가 큽니다." },
  { name: "아침 루틴", category: "selfdev", badges: ["new"], searchVolume: "high", competition: "medium", description: "하루를 안정적으로 시작하는 개인화된 루틴 콘텐츠가 인기입니다." },
  { name: "목표 설정", category: "selfdev", badges: ["new"], searchVolume: "medium", competition: "medium", description: "실행 가능한 목표를 세우고 점검하는 방법을 안내합니다." },
  { name: "에어프라이어 요리", category: "food", badges: ["hot"], searchVolume: "high", competition: "high", description: "간편하면서도 실패 없는 집밥 레시피가 꾸준히 사랑받습니다." },
  { name: "다이어트 식단 레시피", category: "food", badges: ["hot"], searchVolume: "high", competition: "high", description: "맛과 영양을 모두 챙기는 식단 레시피를 찾는 수요가 높습니다." },
  { name: "간단한 한끼", category: "food", badges: ["new"], searchVolume: "high", competition: "medium", description: "바쁜 날 빠르게 만들 수 있는 한 끼 메뉴 아이디어입니다." },
  { name: "혼밥 레시피", category: "food", badges: ["hot"], searchVolume: "high", competition: "medium", description: "1인분 기준으로 재료 낭비를 줄이는 조리법이 인기입니다." },
  { name: "단백질 식단", category: "food", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "운동과 건강 관리를 위한 고단백 식단 구성이 관심사입니다." },
  { name: "밀프렙", category: "food", badges: ["new"], searchVolume: "medium", competition: "medium", description: "주말에 미리 준비하는 효율적인 식사 관리법을 다룹니다." },
  { name: "베이킹 입문", category: "food", badges: ["new"], searchVolume: "medium", competition: "medium", description: "초보자가 필요한 도구와 쉬운 레시피를 찾는 키워드입니다." },
  { name: "술안주 레시피", category: "food", badges: ["hot"], searchVolume: "high", competition: "high", description: "집에서 즐기기 좋은 빠르고 근사한 안주가 인기입니다." },
  { name: "디저트 카페", category: "food", badges: ["hot"], searchVolume: "high", competition: "high", description: "지역별 감성 카페와 신메뉴 소개 콘텐츠에 적합합니다." },
  { name: "비건 요리", category: "food", badges: ["new"], searchVolume: "medium", competition: "medium", description: "식물성 재료로 쉽게 만드는 건강한 메뉴 관심이 늘고 있습니다." },
  { name: "짠테크", category: "life", badges: ["hot"], searchVolume: "high", competition: "high", description: "작은 지출을 관리해 저축을 늘리는 생활 재테크 키워드입니다." },
  { name: "가계부 앱", category: "life", badges: ["new"], searchVolume: "high", competition: "high", description: "자동 분류와 공유 기능을 갖춘 앱 비교 수요가 많습니다." },
  { name: "전기세 줄이기", category: "life", badges: ["hot"], searchVolume: "high", competition: "medium", description: "계절별 전기 요금을 낮추는 바로 실행 가능한 절약 팁입니다." },
  { name: "원룸 인테리어", category: "life", badges: ["new"], searchVolume: "high", competition: "high", description: "좁은 공간을 효율적으로 꾸미는 가구 배치 아이디어가 인기입니다." },
  { name: "중고 거래 팁", category: "life", badges: ["hot"], searchVolume: "high", competition: "medium", description: "안전하고 알뜰하게 거래하는 방법을 찾는 사용자가 많습니다." },
  { name: "구독 서비스 정리", category: "life", badges: ["new"], searchVolume: "medium", competition: "low", description: "새는 고정비를 발견하고 정리하는 실천형 콘텐츠입니다." },
  { name: "무지출 챌린지", category: "life", badges: ["hot"], searchVolume: "high", competition: "medium", description: "소비 습관을 되돌아보는 짧은 절약 도전이 화제입니다." },
  { name: "냉동실 정리", category: "life", badges: ["new"], searchVolume: "medium", competition: "low", description: "식재료 낭비를 줄이는 보관법과 정리 순서를 안내합니다." },
  { name: "택배 절약", category: "life", badges: ["new"], searchVolume: "medium", competition: "low", description: "배송비를 아끼는 묶음 배송과 할인 활용법을 다룹니다." },
  { name: "포인트 적립", category: "life", badges: ["highcpc"], searchVolume: "high", competition: "high", description: "일상 소비에서 포인트를 효율적으로 쌓고 쓰는 방법입니다." },
];

const slugify = (name: string, index: number) =>
  `${encodeURIComponent(name).replace(/%/g, "").toLowerCase()}-${index + 1}`;

export const keywords: Keyword[] = keywordSeeds.map((keyword, index) => ({
  ...keyword,
  id: `keyword-${index + 1}`,
  slug: slugify(keyword.name, index),
  longtailKeywords: [
    `${keyword.name} 추천`,
    `${keyword.name} 초보자 가이드`,
    `${keyword.name} 2026 최신 정보`,
    `${keyword.name} 비용 비교`,
    `${keyword.name} 쉽게 시작하는 방법`,
  ],
  titleTemplates: [
    `2026년 ${keyword.name}, 시작 전에 꼭 알아야 할 5가지`,
    `${keyword.name} 초보자 가이드: 실패 없이 시작하는 법`,
    `직접 비교한 ${keyword.name} 선택 기준과 체크리스트`,
    `${keyword.name}, 이것만 알면 시간과 비용을 아낄 수 있어요`,
    `현실적인 ${keyword.name} 활용법: 한눈에 정리`,
  ],
  relatedKeywords: keywordSeeds
    .filter((item) => item.category === keyword.category && item.name !== keyword.name)
    .slice(0, 4)
    .map((item) => item.name),
}));

export const getKeywordBySlug = (slug: string) =>
  keywords.find((keyword) => keyword.slug === slug);
