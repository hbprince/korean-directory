# Korean Business Directory

캘리포니아 한인 비즈니스 SEO 최적화 디렉토리

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Vercel Postgres
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Vercel 프로젝트 설정

1. [Vercel Dashboard](https://vercel.com/dashboard)에서 새 프로젝트 생성
2. GitHub 레포지토리 연결
3. **Storage** → **Create Database** → **Postgres** 선택
4. 데이터베이스 생성 (환경변수 자동 설정됨)

### 3. 로컬 개발용 환경변수 설정

Vercel CLI로 환경변수 가져오기:

```bash
npm i -g vercel
vercel link
vercel env pull .env
```

또는 `.env.example`을 `.env`로 복사하고 Vercel 대시보드에서 값 복사:

```bash
cp .env.example .env
```

### 4. 데이터베이스 스키마 적용

```bash
npm run db:push
```

### 5. 데이터 Ingestion

```bash
npm run ingest
```

이 스크립트가 하는 일:
- 카테고리 taxonomy 생성
- RadioKorea 비즈니스 (~41k) 임포트
- KoreaDaily 비즈니스 (~17k) 임포트
- 중복 레코드 병합

### 6. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 열기

## Project Structure

```
korean-directory/
├── prisma/
│   └── schema.prisma         # Database schema
├── scripts/
│   ├── ingest.ts             # Data ingestion script
│   └── seed-enrichment.ts    # Seed enrichment queue
├── src/
│   ├── app/
│   │   ├── [state]/[city]/[category]/  # L1/L2 category pages
│   │   ├── biz/[slug]/                 # L3 business detail pages
│   │   ├── api/
│   │   │   ├── enrich/                 # Enrichment API
│   │   │   └── cron/enrich/            # Cron job endpoint
│   │   ├── sitemap.xml/                # Dynamic sitemap
│   │   └── robots.txt/                 # Robots.txt
│   ├── components/                      # React components
│   └── lib/
│       ├── db/                         # Database client
│       ├── dedupe/                     # Deduplication logic
│       ├── enrichment/                 # Google Places enrichment
│       ├── ingestion/                  # Data normalization
│       ├── seo/                        # SEO utilities
│       └── taxonomy/                   # Category mapping
└── vercel.json                         # Vercel config with cron
```

## URL Structure

- **L1**: `/{state}/{city}/{primary-category}` - e.g., `/ca/los-angeles/dental`
- **L2**: `/{state}/{city}/{subcategory}` - e.g., `/ca/los-angeles/orthodontist`
- **L3**: `/biz/{name-slug}-{id}` - e.g., `/biz/kim-family-dental-12345`

## Google Places Enrichment

Google Places에서 평점, 리뷰, 영업시간을 가져오는 시스템

### Budget Control

환경변수로 월간 예산 설정:
- `GOOGLE_ENRICHMENT_MONTHLY_BUDGET_USD` - 월 최대 지출 (기본: $100)
- `GOOGLE_PLACE_DETAILS_COST_PER_CALL` - API 호출당 비용 (기본: $0.017)

### Trigger Enrichment

1. **Seed**: `npm run seed:enrich` 실행하여 상위 비즈니스 큐에 추가
2. **Traffic**: 높은 트래픽 페이지 자동 큐 추가
3. **User click**: "상세보기" 클릭 시 해당 비즈니스 큐 추가

### Process Queue

`/api/cron/enrich` 크론 작업이 매시간 큐 처리

## SEO Features

- **Metadata**: 모든 페이지 동적 title/description
- **JSON-LD**: LocalBusiness, ItemList 스키마
- **Sitemap**: 동적 XML 사이트맵
- **Robots**: 크롤링 지침
- **Indexing**: 평점 4.2+ & 리뷰 10개+ L3 페이지만 인덱싱

## Deployment

### Vercel 배포

1. GitHub 레포지토리를 Vercel에 연결
2. Storage에서 Postgres 데이터베이스 생성
3. 추가 환경변수 설정 (GOOGLE_MAPS_API_KEY 등)
4. Deploy

크론 작업은 `vercel.json`에 설정되어 매시간 실행됩니다.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 시작 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 시작 |
| `npm run lint` | ESLint 실행 |
| `npm run db:generate` | Prisma client 생성 |
| `npm run db:push` | 스키마를 DB에 적용 |
| `npm run db:migrate` | 마이그레이션 실행 |
| `npm run db:studio` | Prisma Studio 열기 |
| `npm run ingest` | 데이터 ingestion 실행 |
| `npm run seed:enrich` | Enrichment 큐 시드 |

## Vercel Postgres 무료 티어 제한

- 256MB 스토리지
- 월 60 compute hours
- 1개 데이터베이스

~58k 비즈니스 데이터로 시작하기에 충분합니다.
