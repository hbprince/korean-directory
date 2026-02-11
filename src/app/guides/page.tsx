import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/db/prisma';
import { PRIMARY_CATEGORIES } from '@/lib/taxonomy/categories';

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
  title: '미국 한인 생활 가이드 | 한인맵',
  description: '미국 한인 생활에 필요한 실용 가이드. 병원 찾기, 이민 절차, 자동차 구매, 주택 렌트 등 한인 커뮤니티를 위한 단계별 안내서를 확인하세요.',
  robots: 'index,follow',
  openGraph: {
    title: '미국 한인 생활 가이드 | 한인맵',
    description: '미국 한인 생활에 필요한 실용 가이드. 병원 찾기, 이민 절차, 자동차 구매, 주택 렌트 등 한인 커뮤니티를 위한 단계별 안내서를 확인하세요.',
    type: 'website',
    siteName: '한인맵 HaninMap',
    url: 'https://www.haninmap.com/guides',
  },
  alternates: {
    canonical: 'https://www.haninmap.com/guides',
  },
};

export default async function GuidesPage() {
  const guides = await prisma.guideContent.findMany({
    where: {
      status: 'published',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get current month to highlight seasonal guides
  const currentMonth = new Date().getMonth() + 1; // 1-12

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          미국 한인 생활 가이드
        </h1>
        <p className="text-lg text-gray-600">
          미국 생활에 필요한 실용적인 정보와 단계별 안내서를 한국어로 제공합니다.
          병원, 법률, 자동차, 교육 등 다양한 주제의 가이드를 확인하세요.
        </p>
      </header>

      {/* Guide Grid */}
      {guides.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">아직 등록된 가이드가 없습니다.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => {
            // Check if guide is seasonal and matches current month
            const isSeasonal = guide.seasonStart !== null && guide.seasonEnd !== null;
            const isCurrentSeason = isSeasonal && isInSeason(currentMonth, guide.seasonStart!, guide.seasonEnd!);

            // Get category name
            const categoryInfo = PRIMARY_CATEGORIES.find(c => c.slug === guide.categorySlug);
            const categoryNameKo = categoryInfo?.nameKo || guide.categorySlug;

            return (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="block p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {guide.titleKo}
                </h2>

                {/* Summary */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {guide.summary.length > 80
                    ? `${guide.summary.slice(0, 80)}...`
                    : guide.summary}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {categoryNameKo}
                  </span>

                  {isCurrentSeason && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      시즌 추천
                    </span>
                  )}

                  {guide.viewCount > 0 && (
                    <span className="text-xs text-gray-400">
                      조회 {guide.viewCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

/**
 * Check if current month falls within the season range
 * Handles wrap-around (e.g., Nov-Jan: 11-1)
 */
function isInSeason(currentMonth: number, seasonStart: number, seasonEnd: number): boolean {
  if (seasonStart <= seasonEnd) {
    // Normal range (e.g., Mar-May: 3-5)
    return currentMonth >= seasonStart && currentMonth <= seasonEnd;
  } else {
    // Wrap-around range (e.g., Nov-Jan: 11-1)
    return currentMonth >= seasonStart || currentMonth <= seasonEnd;
  }
}
