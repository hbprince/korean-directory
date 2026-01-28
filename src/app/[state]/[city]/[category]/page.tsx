import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import { BusinessCard } from '@/components/BusinessCard';
import { CategoryNav } from '@/components/CategoryNav';
import { Pagination } from '@/components/Pagination';
import { FAQSection, generateCategoryFAQs } from '@/components/FAQSection';
import {
  getPrimaryCategory,
  isPrimaryCategory,
  isSubcategory,
} from '@/lib/taxonomy/categories';
import { generateL1Metadata, generateL2Metadata, generateItemListSchema } from '@/lib/seo/meta';

const ITEMS_PER_PAGE = 20;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

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
    });
  } else {
    return generateL2Metadata({
      city,
      state,
      subcategoryNameEn: categoryInfo.nameEn,
      subcategoryNameKo: categoryInfo.nameKo,
      primaryCategoryNameEn: categoryInfo.parentNameEn || categoryInfo.nameEn,
      count,
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

  const cityNormalized = city.toUpperCase().replace(/-/g, ' ');
  const stateNormalized = state.toUpperCase();

  // Build where clause based on category type
  const whereClause = categoryInfo.level === 'primary'
    ? {
        city: cityNormalized,
        state: stateNormalized,
        primaryCategory: { slug: category },
      }
    : {
        city: cityNormalized,
        state: stateNormalized,
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
        },
      },
      primaryCategory: true,
    },
    orderBy: [{ qualityScore: 'desc' }, { nameKo: 'asc' }],
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  // Generate page title
  const cityDisplay = toTitleCase(city);
  const stateDisplay = stateNormalized;
  const pageTitle =
    categoryInfo.level === 'primary'
      ? `Korean ${categoryInfo.nameEn} in ${cityDisplay}, ${stateDisplay}`
      : `Korean ${categoryInfo.nameEn} in ${cityDisplay}, ${stateDisplay}`;

  // Generate FAQs
  const faqs = generateCategoryFAQs({
    categoryNameEn: categoryInfo.nameEn,
    categoryNameKo: categoryInfo.nameKo,
    city: cityDisplay,
    state: stateDisplay,
    count: totalCount,
  });

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
          currentCategory={category}
          showSubcategories={categoryInfo.level === 'primary'}
        />

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-gray-600 mt-2">
            {categoryInfo.nameKo} | {totalCount} businesses found
          </p>
        </header>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No businesses found in this category.</p>
            <p className="text-gray-400 mt-2">Try a different category or city.</p>
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

        <FAQSection faqs={faqs} />

        {/* Internal links to subcategories */}
        {categoryInfo.level === 'primary' && (
          <SubcategoryLinks state={state} city={city} primarySlug={category} />
        )}

        {/* Nearby cities */}
        <NearbyCities state={state} currentCity={city} category={category} />
      </main>
    </>
  );
}

async function SubcategoryLinks({
  state,
  city,
  primarySlug,
}: {
  state: string;
  city: string;
  primarySlug: string;
}) {
  const primary = getPrimaryCategory(primarySlug);
  if (!primary || primary.subcategories.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-lg font-semibold mb-4">
        Browse {primary.nameEn} Specialists
      </h2>
      <div className="flex flex-wrap gap-2">
        {primary.subcategories.map((sub) => (
          <a
            key={sub.slug}
            href={`/${state}/${city}/${sub.slug}`}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            {sub.nameEn}
          </a>
        ))}
      </div>
    </section>
  );
}

async function NearbyCities({
  state,
  currentCity,
  category,
}: {
  state: string;
  currentCity: string;
  category: string;
}) {
  const cityNormalized = currentCity.toUpperCase().replace(/-/g, ' ');

  // Get other cities with businesses in this category
  const cities = await prisma.business.groupBy({
    by: ['city'],
    where: {
      state: state.toUpperCase(),
      city: { not: cityNormalized },
      OR: [
        { primaryCategory: { slug: category } },
        { subcategory: { slug: category } },
      ],
    },
    _count: true,
    orderBy: { _count: { city: 'desc' } },
    take: 10,
  });

  if (cities.length === 0) return null;

  return (
    <section className="mt-8 border-t border-gray-200 pt-8">
      <h2 className="text-lg font-semibold mb-4">Nearby Cities</h2>
      <div className="flex flex-wrap gap-2">
        {cities.map((c) => (
          <a
            key={c.city}
            href={`/${state}/${c.city.toLowerCase().replace(/\s+/g, '-')}/${category}`}
            className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors"
          >
            {toTitleCase(c.city)} ({c._count})
          </a>
        ))}
      </div>
    </section>
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
