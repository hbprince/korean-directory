# haninmap.com SEO 종합 감사 보고서

**감사 일자:** 2026-02-15
**대상 사이트:** https://www.haninmap.com
**사업 유형:** 한인 업소록 (Korean Business Directory)
**등록 업체:** ~78,673개 (미국 69,887 / 캐나다 4,956 / 호주 1,735)
**카테고리:** 15개 주요 카테고리
**기술 스택:** Next.js 14.2.35, React 18, Prisma ORM, Vercel + Cloudflare

---

## 1. 요약 (Executive Summary)

### 전체 SEO 점수: **68 / 100**

| 영역 | 점수 | 등급 |
|------|------|------|
| 온페이지 SEO (On-Page) | 80/100 | A- |
| 스키마/구조화 데이터 (Schema) | 72/100 | B |
| 기술 SEO (Technical) | 78/100 | B+ |
| 콘텐츠 품질 (Content Quality) | 75/100 | B |
| 프로그래매틱 SEO | 70/100 | B |
| 성능 (Performance/CWV) | 60/100 | C |
| 이미지 (Images) | 45/100 | D |
| AI 검색 대비 (GEO) | 41/100 | D |

### 이슈 요약

| 등급 | 수 |
|------|---|
| 🔴 치명적 (Critical) | 14개 |
| 🟡 주요 (Major) | 18개 |
| 🟢 개선 권장 (Minor) | 12개 |

---

## 2. 카테고리별 상세 분석

---

### 2-1. 기술 SEO (Technical SEO) -- 78/100

#### robots.txt

현재 설정 (`src/app/robots.txt/route.ts`):
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /*?
Sitemap: https://www.haninmap.com/sitemap.xml
```

| 등급 | 이슈 | 현재 상태 | 권장 조치 | 예상 효과 |
|------|------|----------|----------|----------|
| 🔴 Critical | `Disallow: /*?` 가 Pagination 크롤링 차단 | `?page=2`, `?sort=rating` 등 모든 쿼리 URL 차단. 2페이지 이후 콘텐츠가 Google에 미노출 | `Disallow: /*?` 제거. 대신 `Disallow: /api/`만 유지 | 2페이지 이후 수천 개 업체의 인덱싱 가능 |
| 🟡 Major | AI 크롤러 명시적 규칙 없음 | wildcard(`*`)에만 의존. 학습용 크롤러(CCBot, Bytespider)도 허용 | GPTBot, ClaudeBot, PerplexityBot 명시적 Allow + CCBot, Bytespider 차단 | AI 검색 노출 향상, 불필요한 크롤링 차단 |
| 🟢 Minor | API 엔드포인트 차단 | 적절 | 유지 | - |

#### Sitemap

| 등급 | 이슈 | 현재 상태 | 권장 조치 | 예상 효과 |
|------|------|----------|----------|----------|
| 🔴 Critical | 카테고리 sitemap에 `<lastmod>` 누락 | `sitemap-us-categories.xml` (~1,000 URL), `sitemap-intl-categories.xml` (~368 URL)에 lastmod 없음 | 각 카테고리의 최신 비즈니스 updatedAt 기반으로 lastmod 추가 | Google 크롤링 우선순위 개선 |
| 🟡 Major | Sitemap Index `<lastmod>`가 매번 오늘 날짜 | `new Date().toISOString()` -- 매 요청마다 변경 | 각 sub-sitemap 내 최신 lastmod 값 기반으로 설정 | Google의 sitemap 신뢰도 향상 |
| 🟡 Major | 잘못된 도시 슬러그 포함 | `/ca/pacifice-view-dr-corona-del-mar/professional` 등 도로명이 도시로 사용된 URL 포함 | `isMalformedCity()` 필터를 sitemap 생성에도 적용 | 크롤 낭비 제거 |
| 🟢 Minor | `<changefreq>`, `<priority>` 사용 | Google이 완전히 무시하는 태그. XML 크기만 증가 | 모든 sitemap에서 제거, `<loc>` + `<lastmod>`만 유지 | 사이트맵 파일 크기 감소 |

#### 인덱싱 & 보안

| 등급 | 이슈 | 현재 상태 | 권장 조치 | 예상 효과 |
|------|------|----------|----------|----------|
| 🔴 Critical | `<html lang="en">` 오류 | 주요 콘텐츠가 한국어인데 `lang="en"` 설정 (`layout.tsx:35`) | `lang="ko"` 로 변경 | 한국어 검색 노출 개선, 접근성 향상 |
| 🔴 Critical | 보안 헤더 미설정 | CSP, X-Frame-Options, X-Content-Type-Options 모두 없음 | `next.config.mjs`에 `headers()` 함수 추가 | 보안 점수 향상, Google 신뢰도 |
| 🟢 Minor | hreflang이 모두 동일 URL | `ko`, `en`, `x-default` 모두 같은 URL 가리킴. 별도 언어 페이지 없음 | hreflang 제거하거나 `ko` + `x-default`만 유지 | 혼란 제거 |

---

### 2-2. 주요 페이지별 심층 분석 (On-Page SEO) -- 80/100

#### 홈페이지 (https://www.haninmap.com) -- 62/100

| 등급 | 이슈 | 현재 상태 | 권장 조치 |
|------|------|----------|----------|
| 🔴 Critical | Schema 마크업 부재 | JSON-LD 전혀 없음. WebSite, Organization, SearchAction 누락 | `page.tsx`에 WebSite + Organization + ItemList JSON-LD 추가 |
| 🔴 Critical | og:image / twitter:image 미설정 | SNS 공유 시 썸네일 없음. CTR 심각 저하 | 1200x630px OG 이미지 생성. `opengraph-image.tsx` 활용 |
| 🔴 Critical | `force-dynamic` 설정 | 매 요청마다 5+ DB 쿼리 실행. 캐싱 불가 (`page.tsx:7`) | `revalidate = 3600` (ISR 1시간)으로 변경 |
| 🟡 Major | "Unknown" 도시 링크 노출 | `/ca/unknown/medical` 내부 링크 존재 | `isMalformedCity` 필터를 CityCard 렌더링에 적용 |
| 🟡 Major | 외부 링크 0개 | E-E-A-T 신호 약함 | 권위 있는 외부 링크 추가 (BBB, 한인회 등) |

#### 카테고리 페이지 (/ca/los-angeles/food 등) -- 74/100

| 등급 | 이슈 | 현재 상태 | 권장 조치 |
|------|------|----------|----------|
| 🔴 Critical | og:image 미설정 | 모든 카테고리 페이지에 OG 이미지 없음 | 카테고리별 동적 OG 이미지 생성 |
| 🟡 Major | Title 60자 초과 | `로스앤젤레스 식당 한인업소 | Los Angeles Korean...` ~80자. Google에서 잘림 | `로스앤젤레스 한인 식당 2778곳 | HaninMap` (~35자)로 축소 |
| 🟡 Major | Meta Description 160자 초과 | ~190자. SERP에서 뒷부분 잘림 | 160자 이내로 축소 |
| 🟡 Major | H2에 업체명 사용 | 20개 업체 = 20개 H2. Heading hierarchy 오염 | `BusinessCard`에서 H2를 H3으로 변경 |
| 🟡 Major | BreadcrumbList URL 중복 | 3번째(도시), 4번째(카테고리) 항목이 동일 URL | 도시 허브 페이지 생성 후 URL 분리 |

#### 도시 페이지 (/ca/los-angeles) -- 5/100

| 등급 | 이슈 | 현재 상태 | 권장 조치 |
|------|------|----------|----------|
| 🔴 Critical | 404 반환 | `[state]/[city]/page.tsx` 라우트 미존재 | 도시 허브 페이지 생성. 해당 도시의 카테고리별 업체 수/인기 업체 표시 |

#### NJ Fort Lee Food (/nj/fort-lee/food) -- 73/100

| 등급 | 이슈 | 현재 상태 | 권장 조치 |
|------|------|----------|----------|
| 🟡 Major | Footer 내부 링크가 CA 중심 | NJ 페이지에서도 CA 도시만 표시 | 지역별 Footer 차별화 (NJ 인근 도시 링크) |
| 🟡 Major | 지역 고유 콘텐츠 부족 | Fort Lee 한인타운 특성이 반영 안 됨 | CategoryIntro에 Bergen County 한인 밀집 지역 등 고유 텍스트 추가 |

---

### 2-3. 스키마 마크업 검증 (Schema/Structured Data) -- 72/100

#### 페이지별 Schema 구현 현황

| 페이지 타입 | WebSite | Organization | LocalBusiness | ItemList | BreadcrumbList | FAQPage | Article |
|------------|---------|-------------|---------------|----------|---------------|---------|---------|
| 홈페이지 | 없음 | 없음 | N/A | 없음 | N/A | 없음 | N/A |
| 카테고리 (L1/L2) | N/A | N/A | N/A | 있음 | 있음 | 있음 | N/A |
| 업체 상세 (L3) | N/A | N/A | 있음 | N/A | 있음 | 있음 | N/A |
| 가이드 | N/A | N/A | N/A | N/A | 있음 | 조건부 | 없음 |
| 국제 리스팅 | N/A | N/A | N/A | 있음 | 있음 | 있음 | N/A |

#### 주요 이슈

| 등급 | 이슈 | 현재 상태 | 권장 조치 | 예상 효과 |
|------|------|----------|----------|----------|
| 🔴 Critical | WebSite Schema 누락 | 홈페이지에 WebSite + SearchAction 없음 | JSON-LD 추가 (layout.tsx 또는 page.tsx) | Sitelinks Search Box 노출, AI 사이트 인식 |
| 🔴 Critical | Organization Schema 누락 | 사이트 전체에서 부재 | layout.tsx에 Organization JSON-LD 추가 | Knowledge Panel, E-E-A-T 신호 |
| 🟡 Major | LocalBusiness `@type` 미세분화 | 모든 업체가 `LocalBusiness`로 통일 (`meta.ts:271`) | 카테고리별 매핑: medical→MedicalBusiness, food→Restaurant, legal→LegalService 등 | Rich Result 확장, AI 업종 분류 정확도 |
| 🟡 Major | 가이드 Article Schema 누락 | OG type은 `article`이나 JSON-LD Article 없음 | Article/BlogPosting JSON-LD 추가 (headline, author, datePublished) | Google Discover, AI Overview 인용 |
| 🟡 Major | FAQPage Schema 효용 제한 | 2023.8월부터 Google이 상업 사이트 FAQ rich results 제한 | 유지 가능하나 리치 결과 기대 불가. HTML FAQ는 유지 | - |
| 🟢 Minor | ItemList에 item entity 미중첩 | ListItem에 name/url만 포함. `item` 속성으로 엔티티 미포함 | ListItem 내 LocalBusiness entity 중첩 | Rich Results 정밀도 |

---

### 2-4. 프로그래매틱 SEO -- 70/100

#### 라우트 구조 분석

| Route | generateStaticParams | noindex 로직 | 비고 |
|-------|---------------------|-------------|------|
| `/[state]/[city]/[category]` | 있음 (50+ 업체) | count < 3 이면 noindex | 양호 |
| `/biz/[slug]` | 있음 (rating>=4.2, reviews>=10) | 미충족 시 noindex | 양호 |
| `/canada/[region]/[city]/[category]` | **없음** | **항상 index** | 문제 |
| `/australia/[region]/[city]/[category]` | **없음** | **항상 index** | 문제 |
| `/guides/[slug]` | **없음** | 항상 index | 경미 |

| 등급 | 이슈 | 현재 상태 | 권장 조치 | 예상 효과 |
|------|------|----------|----------|----------|
| 🔴 Critical | 국제 페이지 Thin Content noindex 미적용 | `international-listing.tsx:99` -- 항상 `index,follow`. 업체 1~2개 페이지도 인덱싱 | US와 동일하게 `count >= 3` 조건 추가 | 저품질 페이지 제거, 크롤 버짓 절약 |
| 🟡 Major | 국제 라우트 `generateStaticParams` 없음 | Canada/Australia 368 URL이 모두 on-demand SSR | 인기 경로에 대해 추가 | TTFB 개선, 크롤링 효율 |
| 🟡 Major | Pagination canonical 처리 부재 | `?page=2`에서도 기본 경로 canonical. Self-referencing canonical 아님 | `?page=N` 포함 self-referencing canonical 설정 | 인덱싱 정확도 |
| 🟡 Major | FAQ 템플릿 동일 (중복 콘텐츠 위험) | 모든 카테고리의 FAQ가 도시/카테고리명만 변경된 4개 동일 질문 | 카테고리별 고유 FAQ 차별화 | 고유 콘텐츠 비율 향상 |
| 🟢 Minor | `generateStaticParams` MIN_COUNT 50 vs Sitemap MIN 3 불일치 | 의도적 설계(인기 페이지만 사전 빌드). 3~49개 업체 페이지는 첫 방문 느림 | 허용 가능. `dynamicParams = true`로 on-demand 생성 | - |

#### 긍정적 요소
- `isMalformedCity()` 필터로 잘못된 도시명 제거
- `CategoryIntro` 컴포넌트로 카테고리별 고유 콘텐츠
- ISR 적절 설정 (카테고리 24h, 비즈니스 7일)
- 빵크루즈(Breadcrumbs) 모든 페이지에 시각적 + JSON-LD 구현

---

### 2-5. 이미지 최적화 -- 45/100

| 등급 | 이슈 | 현재 상태 | 권장 조치 | 예상 효과 |
|------|------|----------|----------|----------|
| 🔴 Critical | `next/image` 미사용 | 사이트 전체에서 native `<img>` 태그만 사용. `eslint-disable @next/next/no-img-element`로 경고 무시 | PhotoGallery.tsx를 `next/image`로 전환 | WebP 자동 변환, responsive srcset, CLS 방지 |
| 🔴 Critical | og:image 전 페이지 미설정 | 어떤 페이지에서도 `og:image`, `twitter:image` 없음 | Next.js `opengraph-image.tsx` 동적 생성 | SNS 공유 CTR 대폭 향상 |
| 🟡 Major | 사이트 전반 이미지 극히 적음 | 홈페이지/카테고리 페이지에 이미지 거의 없음 (텍스트 기반 카드 UI) | 카테고리별 대표 이미지, 아이콘 추가 | 사용자 체류시간 향상 |
| 🟡 Major | Twitter Card type이 `summary` | `summary_large_image`가 아닌 `summary` 사용 | `summary_large_image`로 변경 | SNS 미리보기 크기 향상 |
| 🟢 Minor | alt 태그 양호 | `${businessName} - 사진 ${idx+1}` 패턴 | 카테고리명 추가 가능 | 이미지 검색 노출 |

---

### 2-6. AI 검색 최적화 (GEO) -- 41/100

#### GEO Readiness Score: 41/100

| 평가 항목 | 점수 |
|-----------|------|
| Citability Score (인용 가능성) | 8/25 |
| Structural Readability (구조적 가독성) | 14/20 |
| Multi-Modal Content (멀티모달) | 3/15 |
| Authority & Brand Signals (권위/브랜드) | 5/20 |
| Technical Accessibility (기술적 접근성) | 11/20 |

#### Platform별 최적화 현황

| 플랫폼 | 점수 | 핵심 문제 |
|--------|------|----------|
| Google AI Overviews | 38/100 | 질문형 Heading 없음, Answer Block 부족 |
| ChatGPT Web Search | 28/100 | Wikipedia/Reddit 존재감 0, Entity 미인식 |
| Perplexity | 32/100 | Reddit 멘션 0, 고유 데이터/리서치 없음 |

#### 주요 이슈

| 등급 | 이슈 | 현재 상태 | 권장 조치 | 예상 효과 |
|------|------|----------|----------|----------|
| 🔴 Critical | llms.txt 미존재 | 404 반환 | `/llms.txt` route handler 생성. 사이트 구조/카테고리/데이터 규모 안내 | AI 크롤러의 사이트 이해도 향상 |
| 🔴 Critical | 질문형 Heading 전무 | 모든 H2가 서술형 | "로스앤젤레스에서 한인 병원은 어떻게 찾나요?" 등 질문형 H2 추가 | AI Overview passage 선택 확률 대폭 향상 |
| 🔴 Critical | 자기완결적 Answer Block 부족 | CategoryIntro만 부분 충족. 최적 134-167 단어 미달 | CategoryIntro를 자기완결적 answer block으로 리팩토링 | AI Overview 인용 가능성 |
| 🔴 Critical | Brand Mention Score ~3/100 | YouTube/Reddit/Wikipedia/LinkedIn 모두 존재감 0 | Reddit(r/koreanamerican, r/losangeles) 자연스러운 멘션, LinkedIn 회사 페이지, YouTube 콘텐츠 | 브랜드 멘션은 AI 인용과 백링크보다 3배 강한 상관관계 |
| 🔴 Critical | 저자/전문성 정보 없음 | 가이드에 Author byline, Person Schema 모두 없음 | 저자 바이라인 + Person Schema 추가, About 페이지에 팀 정보 | E-E-A-T Expertise 신호 |
| 🟡 Major | 발행일/수정일 미표시 | 가이드에 publishedAt만. lastUpdated 없음 | 최종 업데이트 날짜 표시 | 시의성 신호 강화 |

#### AI Crawler 접근성

| Crawler | 소유사 | 현재 상태 |
|---------|--------|----------|
| GPTBot | OpenAI | 허용 (wildcard) |
| ClaudeBot | Anthropic | 허용 (wildcard) |
| PerplexityBot | Perplexity | 허용 (wildcard) |
| CCBot | Common Crawl | 허용 -- **차단 권장** |
| Bytespider | ByteDance | 허용 -- **차단 권장** |

---

### 2-7. 모바일 SEO -- 65/100

| 등급 | 이슈 | 현재 상태 | 권장 조치 |
|------|------|----------|----------|
| 🔴 Critical | 모바일 네비게이션 없음 | `hidden md:flex`로 숨김. 모바일에서 메뉴 접근 불가 (`layout.tsx:55`) | 햄버거 메뉴 구현 |
| 🟢 Minor | viewport 메타 태그 | 올바르게 설정 | 유지 |
| 🟢 Minor | 반응형 디자인 | Tailwind CSS 기반 반응형 | 유지 |

---

### 2-8. 신뢰도 (Trust & Legal) -- 55/100

| 등급 | 이슈 | 현재 상태 | 권장 조치 |
|------|------|----------|----------|
| 🔴 Critical | 개인정보처리방침 없음 | 사용자 리뷰/로그인(NextAuth) 기능이 있어 법적으로 필수 | Privacy Policy 페이지 생성 |
| 🔴 Critical | 이용약관 없음 | Terms of Service 미존재 | Terms 페이지 생성 |
| 🟡 Major | 연락처 정보 없음 | 이메일, 전화번호, 물리적 주소 모두 부재 | Contact 정보 Footer에 추가 |
| 🟡 Major | About 정보 불충분 | 운영자/팀 정보 없음 | About 페이지 보강 |

---

## 3. 우선순위 액션 플랜

### 🔴 즉시 수정 (Week 1) -- 영향 높음, 난이도 낮음~중간

| 우선순위 | 이슈 | 영향 | 난이도 | 파일 위치 |
|---------|------|------|--------|----------|
| 1 | `<html lang="ko">` 로 변경 | 인덱싱/접근성 | 쉬움 | `src/app/layout.tsx:35` |
| 2 | `robots.txt`에서 `Disallow: /*?` 제거 | 크롤링 | 쉬움 | `src/app/robots.txt/route.ts` |
| 3 | 홈페이지 WebSite + Organization JSON-LD 추가 | 스키마/AI | 쉬움 | `src/app/page.tsx` |
| 4 | 홈페이지 `force-dynamic` → ISR 변경 | 성능 | 쉬움 | `src/app/page.tsx:7` |
| 5 | 국제 페이지 thin content noindex 적용 | 인덱싱 | 쉬움 | `src/lib/pages/international-listing.tsx:99` |
| 6 | 보안 헤더 추가 (CSP, X-Frame, HSTS) | 보안 | 쉬움 | `next.config.mjs` |
| 7 | `llms.txt` 생성 | AI 검색 | 쉬움 | 신규 route handler |

### 🟡 단기 수정 (Week 2-3) -- 영향 높음, 난이도 중간

| 우선순위 | 이슈 | 영향 | 난이도 | 파일 위치 |
|---------|------|------|--------|----------|
| 8 | og:image 동적 생성 구현 | 소셜 CTR | 중간 | `src/app/opengraph-image.tsx` (신규) |
| 9 | 모바일 네비게이션 추가 | UX/모바일 | 중간 | `src/app/layout.tsx` Header() |
| 10 | 도시 허브 페이지 생성 | URL 구조 | 중간 | `src/app/[state]/[city]/page.tsx` (신규) |
| 11 | Title 60자 이내로 축소 | SERP | 쉬움 | `src/lib/seo/meta.ts` |
| 12 | Meta Description 160자 이내로 축소 | SERP | 쉬움 | `src/lib/seo/meta.ts` |
| 13 | BusinessCard H2 → H3 변경 | Heading 구조 | 쉬움 | `src/components/BusinessCard.tsx` |
| 14 | 카테고리 sitemap에 `<lastmod>` 추가 | 크롤링 | 쉬움 | `src/app/sitemap-*-categories.xml/route.ts` |
| 15 | 가이드 Article JSON-LD + 저자 정보 추가 | E-E-A-T | 중간 | `src/app/guides/[slug]/page.tsx` |
| 16 | 개인정보처리방침 + 이용약관 페이지 | 신뢰도/법적 | 중간 | 신규 페이지 |
| 17 | LocalBusiness `@type` 카테고리별 세분화 | 스키마 | 중간 | `src/lib/seo/meta.ts:271` |
| 18 | PhotoGallery `next/image` 전환 | 이미지/성능 | 중간 | `src/components/PhotoGallery.tsx` |

### 🟢 중기 개선 (Month 2) -- 영향 중간, 난이도 높음

| 우선순위 | 이슈 | 영향 | 난이도 |
|---------|------|------|--------|
| 19 | 질문형 Heading + Answer Block 리팩토링 | AI 검색 | 중간 |
| 20 | FAQ 콘텐츠 카테고리별 차별화 | 콘텐츠 품질 | 중간 |
| 21 | 국제 라우트 `generateStaticParams` 추가 | 성능 | 중간 |
| 22 | Pagination canonical self-referencing 처리 | 인덱싱 | 중간 |
| 23 | BreadcrumbList URL 중복 수정 | 스키마 | 쉬움 |
| 24 | 검색 기능 구현 | UX/크롤 | 높음 |
| 25 | hreflang 전략 재정립 (제거 또는 다국어 분리) | 국제화 | 중간 |
| 26 | Brand Mention 구축 (Reddit, YouTube, LinkedIn) | AI 검색 | 높음 (지속적) |
| 27 | 사이트맵 `changefreq`/`priority` 제거 | 정리 | 쉬움 |
| 28 | Twitter Card `summary_large_image`로 변경 | 소셜 | 쉬움 |

---

## 4. 경쟁사 대비 포지셔닝

| 항목 | haninmap.com | radiokorea.com | heykorean.com | koreadaily.com |
|------|-------------|----------------|---------------|----------------|
| 업체 수 | ~78,673 | ~수천 (추정) | ~수만 (추정) | ~수천 (추정) |
| 기술 스택 | Next.js 14 + Vercel | 전통적 CMS | PHP 기반 | 전통적 CMS |
| 구조화 데이터 | LocalBusiness, ItemList, BreadcrumbList, FAQ | 제한적 | 제한적 | 제한적 |
| 모바일 대응 | 반응형 (메뉴 문제) | 반응형 | 반응형 | 반응형 |
| 콘텐츠 깊이 | 업소록 + 가이드 11개 + 알림 | 뉴스 + 업소록 + 커뮤니티 | 생활정보 + 업소록 + 구인 | 뉴스 + 업소록 |
| 도메인 권위 | 낮음 (신규) | 높음 (오래된 브랜드) | 중간 | 높음 (언론사) |
| AI 검색 대비 | 구조적으로 유리 (SSR, JSON-LD) | 불리 (레거시) | 불리 | 불리 |

**경쟁 우위:**
- 구조화 데이터 구현이 경쟁사 대비 월등히 우수
- Next.js SSR + ISR로 성능/크롤링 효율 우수
- 프로그래매틱 SEO 기반 대규모 페이지 자동 생성
- 이중언어(한/영) 콘텐츠 체계적 구현

**경쟁 열위:**
- 도메인 권위(DA) 및 브랜드 인지도 절대 열세
- 외부 멘션/백링크 거의 없음
- 커뮤니티/사용자 참여 콘텐츠 부족

---

## 5. 한인맵 특화 권장사항

### 5-1. 한국어/영어 이중 콘텐츠

- **현재:** `lib/i18n/labels.ts`에 100+ 도시 한글 매핑, `formatBilingual()` 유틸리티로 일관된 이중언어 표시. 매우 양호.
- **개선:** `<html lang="ko">`로 주 언어 명시. 영어 부분에 `<span lang="en">` 적용. hreflang은 단일 URL이므로 `ko` + `x-default`만 유지.

### 5-2. 한인 비즈니스 디렉토리 특화 스키마

- LocalBusiness `@type` 세분화: `medical`→`MedicalBusiness`, `dental`→`Dentist`, `food`→`Restaurant`, `legal`→`LegalService`, `beauty`→`BeautySalon`, `real-estate`→`RealEstateAgent`
- `alternateName`에 한국어 업체명 유지 (현재 잘 구현됨)
- `knowsLanguage: ["ko", "en"]` 속성 추가 -- 한국어 진료/상담 가능 업체 식별에 활용

### 5-3. 지역별 롱테일 키워드 전략

| 지역 | 주요 키워드 | 업체 수 | 우선순위 |
|------|-----------|---------|---------|
| CA (캘리포니아) | 한인 병원 LA, 한인 치과 어바인 | ~45,000+ | 최우선 |
| NY (뉴욕) | 한인 식당 플러싱, 한인 변호사 뉴욕 | ~5,000+ | 높음 |
| NJ (뉴저지) | 한인 식당 포트리, 한인 부동산 팰리세이즈파크 | ~3,000+ | 높음 |
| TX (텍사스) | 한인 병원 달라스, 한인 식당 휴스턴 | ~2,000+ | 중간 |

- CategoryIntro를 지역별로 차별화: CA는 K-Town 언급, NJ는 Bergen County 한인 밀집 지역, NY는 플러싱 한인타운 등
- Footer 내부 링크를 지역별로 동적 변경

### 5-4. GSC 인덱싱 현황 연계

- 현재: 매일 200개 URL 자동 GSC 제출 (launchd 스케줄)
- `urls-l1.txt` offset 1,167 / 전체 URL 진행 중
- **권장:** GSC 인덱싱 현황(indexed vs not-indexed)을 sitemap 전략과 연계. noindex 페이지가 GSC에 제출되지 않도록 필터링 확인.

---

## 6. 핵심 코드 수정 위치 요약

| 파일 | 수정 사항 |
|------|----------|
| `src/app/layout.tsx:35` | `lang="en"` → `lang="ko"` |
| `src/app/layout.tsx:48-78` | 모바일 햄버거 메뉴 추가 |
| `src/app/page.tsx:7` | `force-dynamic` → `revalidate = 3600` |
| `src/app/page.tsx` | WebSite + Organization + ItemList JSON-LD 추가 |
| `src/app/robots.txt/route.ts` | `Disallow: /*?` 제거, AI 크롤러 명시적 규칙 추가 |
| `src/lib/seo/meta.ts` | Title/Description 길이 축소, LocalBusiness @type 세분화, BreadcrumbList URL 수정 |
| `src/lib/pages/international-listing.tsx:99` | thin content noindex 로직 추가 |
| `src/components/BusinessCard.tsx` | H2 → H3 변경 |
| `src/components/PhotoGallery.tsx` | `<img>` → `next/image` 전환 |
| `src/app/guides/[slug]/page.tsx` | Article JSON-LD + 저자 정보 추가 |
| `src/app/sitemap-*-categories.xml/route.ts` | `<lastmod>` 추가, `changefreq`/`priority` 제거 |
| `src/app/sitemap.xml/route.ts` | Index lastmod를 실제 데이터 기반으로 변경 |
| `next.config.mjs` | 보안 헤더 추가 |
| 신규: `src/app/[state]/[city]/page.tsx` | 도시 허브 페이지 |
| 신규: `src/app/opengraph-image.tsx` | OG 이미지 동적 생성 |
| 신규: `src/app/llms.txt/route.ts` | llms.txt |
| 신규: `src/app/privacy/page.tsx` | 개인정보처리방침 |
| 신규: `src/app/terms/page.tsx` | 이용약관 |

---

**다음 감사 권장 일자: 2026-03-15 (치명적 이슈 수정 후)**
