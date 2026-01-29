import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { BusinessCard } from '@/components/BusinessCard';
import { CategoryNav } from '@/components/CategoryNav';
import { Pagination } from '@/components/Pagination';
import { FAQSection, generateCategoryFAQs } from '@/components/FAQSection';
import {
  isPrimaryCategory,
  isSubcategory,
} from '@/lib/taxonomy/categories';
import { generateL1Metadata, generateL2Metadata, generateItemListSchema } from '@/lib/seo/meta';
import { getCityNameKo, getStateNameKo, UI_LABELS } from '@/lib/i18n/labels';
import { computeOpenNow, getFirstPhotoUrl } from '@/lib/enrichment/helpers';

const ITEMS_PER_PAGE = 20;
const BASE_URL = 'https://www.haninmap.com';

interface PageProps {
  params: Promise<{
    state: string;
    city: string;
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city, category } = await params;

  // Get category info
  const categoryInfo = await getCategoryInfo(category);
  if (!categoryInfo) return {};

  const cityNormalized = city.toUpperCase().replace(/-/g, ' ');

  // Get count
  const count = await prisma.business.count({
    where: {
      city: cityNormalized,
      state: state.toUpperCase(),
      OR: [
        { primaryCategory: { slug: category } },
        { subcategory: { slug: category } },
      ],
    },
  });

  if (categoryInfo.level === 'primary') {
    return generateL1Metadata({
      city,
      state,
      categoryNameEn: categoryInfo.nameEn,
      categoryNameKo: categoryInfo.nameKo,
      count,
      categorySlug: categoryInfo.slug,
    });
  } else {
    return generateL2Metadata({
      city,
      state,
      subcategoryNameEn: categoryInfo.nameEn,
      subcategoryNameKo: categoryInfo.nameKo,
      primaryCategoryNameEn: categoryInfo.parentNameEn || categoryInfo.nameEn,
      count,
      subcategorySlug: categoryInfo.slug,
    });
  }
}

async function getCategoryInfo(slug: string): Promise<{
  id: number;
  slug: string;
  nameEn: string;
  nameKo: string;
  level: string;
  parentNameEn?: string;
  parentSlug?: string;
} | null> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { parent: true },
  });

  if (!category) return null;

  return {
    id: category.id,
    slug: category.slug,
    nameEn: category.nameEn,
    nameKo: category.nameKo,
    level: category.level,
    parentNameEn: category.parent?.nameEn,
    parentSlug: category.parent?.slug,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { state, city, category } = await params;
  const { page: pageParam } = await searchParams;

  const page = parseInt(pageParam || '1', 10);
  if (isNaN(page) || page < 1) notFound();

  // Validate category
  if (!isPrimaryCategory(category) && !isSubcategory(category)) {
    notFound();
  }

  const categoryInfo = await getCategoryInfo(category);
  if (!categoryInfo) notFound();

  const isAllCities = city.toLowerCase() === 'all';
  const cityNormalized = city.toUpperCase().replace(/-/g, ' ');
  const stateNormalized = state.toUpperCase();

  // Build where clause based on category type and city filter
  // Exclude "Unknown" cities from results
  const baseWhere = {
    state: stateNormalized,
    city: isAllCities ? { not: 'Unknown' } : cityNormalized,
  };

  const whereClause = categoryInfo.level === 'primary'
    ? {
        ...baseWhere,
        primaryCategory: { slug: category },
      }
    : {
        ...baseWhere,
        subcategory: { slug: category },
      };

  // Get total count
  const totalCount = await prisma.business.count({ where: whereClause });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (page > totalPages && totalPages > 0) notFound();

  // Fetch businesses with pagination
  const businesses = await prisma.business.findMany({
    where: whereClause,
    include: {
      googlePlace: {
        select: {
          rating: true,
          userRatingsTotal: true,
          openingHoursJson: true,
          photosJson: true,
        },
      },
      primaryCategory: true,
    },
    orderBy: [
      { googlePlace: { rating: { sort: 'desc', nulls: 'last' } } }, // Enriched first
      { qualityScore: 'desc' },
      { nameKo: 'asc' },
    ],
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  // Generate page title (Korean primary for H1)
  const cityDisplay = toTitleCase(city);
  const cityKo = getCityNameKo(city);
  const stateDisplay = stateNormalized;

  // Handle "all" city case
  const locationKo = isAllCities ? `${getStateNameKo(stateDisplay)} 전체` : cityKo;
  const locationEn = isAllCities ? `All of ${stateDisplay}` : `${cityDisplay}, ${stateDisplay}`;

  // H1: Korean primary with English in parentheses
  const h1Title = `${locationKo} 한인 ${categoryInfo.nameKo} (${categoryInfo.nameEn} in ${locationEn})`;
  // H2/subtitle: Additional context
  const koreanSubtitle = `한국어 상담 가능 | Korean-speaking ${categoryInfo.nameEn.toLowerCase()}`;

  // Only generate FAQs if there are results
  const faqs = totalCount > 0 ? generateCategoryFAQs({
    categoryNameEn: categoryInfo.nameEn,
    categoryNameKo: categoryInfo.nameKo,
    city: cityDisplay,
    cityKo: cityKo,
    state: stateDisplay,
    count: totalCount,
  }) : [];

  // Generate JSON-LD
  const jsonLd = generateItemListSchema(
    businesses.map((biz, idx) => ({
      name: biz.nameEn || biz.nameKo,
      slug: biz.slug || `business-${biz.id}`,
      position: (page - 1) * ITEMS_PER_PAGE + idx + 1,
    })),
    `${BASE_URL}/${state}/${city}/${category}`
  );

  const basePath = `/${state}/${city}/${category}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <CategoryNav
          currentState={state}
          currentCity={city}
          currentCategory={categoryInfo.level === 'primary' ? category : undefined}
          currentSubcategory={categoryInfo.level === 'sub' ? category : undefined}
          parentCategorySlug={categoryInfo.parentSlug}
        />

        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{h1Title}</h1>
          <h2 className="text-lg text-gray-700 mt-1">{koreanSubtitle}</h2>
          <p className="text-gray-600 mt-2">
            {totalCount} {UI_LABELS.businessesFound.ko} ({totalCount} {UI_LABELS.businessesFound.en})
          </p>
        </header>

        {/* City Filter - at the top for easy access */}
        <CityFilter state={state} currentCity={city} category={category} />

        {businesses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">{UI_LABELS.noListingsYet.ko}</p>
            <p className="text-gray-500 mt-1">{UI_LABELS.noListingsYet.en}</p>
            <p className="text-gray-400 mt-4">{UI_LABELS.trySearching.ko}</p>
            <p className="text-gray-400">{UI_LABELS.trySearching.en}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  id={business.id}
                  nameKo={business.nameKo}
                  nameEn={business.nameEn}
                  addressRaw={business.addressRaw}
                  city={business.city}
                  state={business.state}
                  phoneRaw={business.phoneRaw}
                  phoneE164={business.phoneE164}
                  slug={business.slug || `business-${business.id}`}
                  rating={business.googlePlace?.rating}
                  reviewCount={business.googlePlace?.userRatingsTotal}
                  categorySlug={business.primaryCategory.slug}
                  categoryNameEn={business.primaryCategory.nameEn}
                  openNow={computeOpenNow(business.googlePlace?.openingHoursJson)}
                  photoUrl={getFirstPhotoUrl(business.googlePlace?.photosJson)}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={basePath}
            />
          </>
        )}

        {faqs.length > 0 && <FAQSection faqs={faqs} />}
      </main>
    </>
  );
}

async function CityFilter({
  state,
  currentCity,
  category,
}: {
  state: string;
  currentCity: string;
  category: string;
}) {
  const cityNormalized = currentCity.toUpperCase().replace(/-/g, ' ');
  const isAllCities = currentCity === 'all';

  // Get all cities with businesses in this category, excluding Unknown
  const cities = await prisma.business.groupBy({
    by: ['city'],
    where: {
      state: state.toUpperCase(),
      city: { not: 'Unknown' },
      OR: [
        { primaryCategory: { slug: category } },
        { subcategory: { slug: category } },
      ],
    },
    _count: true,
    orderBy: { _count: { city: 'desc' } },
    take: 20,
  });

  // Get total count for "All" option
  const totalCount = await prisma.business.count({
    where: {
      state: state.toUpperCase(),
      city: { not: 'Unknown' },
      OR: [
        { primaryCategory: { slug: category } },
        { subcategory: { slug: category } },
      ],
    },
  });

  if (cities.length <= 1) return null;

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-medium text-gray-700">지역 선택 (Select City)</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {/* "All" option first */}
        <a
          href={`/${state}/all/${category}`}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            isAllCities
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          전체 (All)
          <span className="ml-1 opacity-70">({totalCount.toLocaleString()})</span>
        </a>

        {/* City chips - Korean (English) format */}
        {cities.map((c) => {
          // Skip Unknown cities
          if (c.city.toLowerCase() === 'unknown') return null;

          const citySlug = c.city.toLowerCase().replace(/\s+/g, '-');
          const cityKo = getCityNameKo(citySlug);
          const cityEn = toTitleCase(c.city);
          const isCurrentCity = c.city === cityNormalized;

          // Format: 한글 (English) or just English if no Korean mapping
          const displayName = cityKo !== cityEn ? `${cityKo} (${cityEn})` : cityEn;

          return (
            <a
              key={c.city}
              href={`/${state}/${citySlug}/${category}`}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                isCurrentCity
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {displayName}
              <span className="ml-1 opacity-70">({c._count})</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function toTitleCase(str: string): string {
  return str
    .replace(/-/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
