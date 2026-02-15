import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/db/prisma';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { buildBreadcrumbList, type BreadcrumbItem } from '@/lib/seo/meta';
import { getCityNameKo, getStateNameKo } from '@/lib/i18n/labels';
import { PRIMARY_CATEGORIES } from '@/lib/taxonomy/categories';
import { isMalformedCity } from '@/lib/seo/slug-utils';

export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

const BASE_URL = 'https://www.haninmap.com';

interface PageProps {
  params: Promise<{
    state: string;
    city: string;
  }>;
}

export async function generateStaticParams() {
  const counts = await prisma.business.groupBy({
    by: ['city', 'state'],
    _count: { _all: true },
    where: { countryCode: 'US' },
    having: { city: { _count: { gte: 50 } } },
  });

  const params: Array<{ state: string; city: string }> = [];
  const added = new Set<string>();

  for (const item of counts) {
    if (!item.city || !item.state) continue;
    if (isMalformedCity(item.city)) continue;

    const key = `${item.state}|${item.city}`;
    if (added.has(key)) continue;
    added.add(key);

    params.push({
      state: item.state.toLowerCase(),
      city: item.city.toLowerCase().replace(/\s+/g, '-'),
    });
  }

  console.log(`[generateStaticParams] City hub pages: ${params.length} paths`);
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city } = await params;
  const cityKo = getCityNameKo(city);
  const cityDisplay = toTitleCase(city.replace(/-/g, ' '));
  const stateDisplay = state.toUpperCase();

  const title = `${cityKo} 한인 업소 | ${cityDisplay}, ${stateDisplay} Korean Directory`;
  const description = `${cityKo}(${cityDisplay}) 한인 업소 종합 안내. 병원, 치과, 식당, 변호사 등 카테고리별 한인 업체를 찾아보세요.`;
  const url = `${BASE_URL}/${state}/${city}`;

  return {
    title: { absolute: title },
    description,
    twitter: { card: 'summary' },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: '한인맵 HaninMap',
      url,
    },
    alternates: {
      canonical: url,
      languages: { ko: url, 'x-default': url },
    },
  };
}

export default async function CityHubPage({ params }: PageProps) {
  const { state, city } = await params;
  const cityNormalized = city.toUpperCase().replace(/-/g, ' ');
  const stateNormalized = state.toUpperCase();

  // Check if city has any businesses
  const totalCount = await prisma.business.count({
    where: { city: cityNormalized, state: stateNormalized, countryCode: 'US' },
  });

  if (totalCount === 0) notFound();

  const cityKo = getCityNameKo(city);
  const cityDisplay = toTitleCase(city.replace(/-/g, ' '));
  const stateKo = getStateNameKo(stateNormalized);

  // Get counts per primary category
  const categoryCounts = await prisma.business.groupBy({
    by: ['primaryCategoryId'],
    _count: { _all: true },
    where: { city: cityNormalized, state: stateNormalized, countryCode: 'US' },
  });

  // Map category IDs to info
  const categoryIds = categoryCounts.map(c => c.primaryCategoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds }, level: 'primary' },
    select: { id: true, slug: true, nameKo: true, nameEn: true },
  });
  const catMap = new Map(categories.map(c => [c.id, c]));

  const categoryData = categoryCounts
    .map(cc => {
      const cat = catMap.get(cc.primaryCategoryId);
      if (!cat) return null;
      return { ...cat, count: cc._count._all };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort((a, b) => b.count - a.count);

  // Top businesses
  const topBusinesses = await prisma.business.findMany({
    where: { city: cityNormalized, state: stateNormalized, countryCode: 'US' },
    include: {
      primaryCategory: { select: { nameKo: true } },
      googlePlace: { select: { rating: true, userRatingsTotal: true } },
    },
    orderBy: { qualityScore: 'desc' },
    take: 8,
  });

  // Breadcrumbs
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: '홈 (Home)', url: BASE_URL },
    { name: stateNormalized, url: `${BASE_URL}/regions` },
    { name: `${cityKo} (${cityDisplay})`, url: `${BASE_URL}/${state}/${city}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbList(breadcrumbItems);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {cityKo} 한인 업소 안내
          </h1>
          <p className="text-gray-600 mt-2">
            {stateKo} {cityKo}({cityDisplay})에 총 {totalCount.toLocaleString()}곳의 한인 업체가 등록되어 있습니다.
          </p>
        </header>

        {/* Categories Grid */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            카테고리별 한인 업소
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryData.map((cat) => (
              <Link
                key={cat.id}
                href={`/${state}/${city}/${cat.slug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{cat.nameKo}</div>
                <div className="text-sm text-gray-500">{cat.nameEn}</div>
                <div className="text-sm text-blue-600 mt-1">
                  {cat.count.toLocaleString()}곳 →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Businesses */}
        {topBusinesses.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              인기 한인 업체
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {topBusinesses.map((biz) => (
                <Link
                  key={biz.id}
                  href={`/biz/${biz.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">
                    {biz.nameEn || biz.nameKo}
                  </h3>
                  {biz.nameEn && (
                    <p className="text-sm text-gray-500">{biz.nameKo}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {biz.primaryCategory.nameKo}
                    </span>
                    {biz.googlePlace?.rating && (
                      <span>
                        <span className="text-yellow-500">★</span> {biz.googlePlace.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
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
