import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/db/prisma';
import { PRIMARY_CATEGORIES } from '@/lib/taxonomy/categories';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.haninmap.com';

export const metadata: Metadata = {
  title: '한인맵 HaninMap | Korean Business Directory 한인 업소록',
  description:
    '한인 병원, 치과, 변호사, 식당 찾기. Find Korean-speaking doctors, dentists, lawyers, restaurants and more. 미국 한인 업소 디렉토리.',
  alternates: {
    canonical: BASE_URL,
    languages: {
      'ko': BASE_URL,
      'en': BASE_URL,
      'x-default': BASE_URL,
    },
  },
  openGraph: {
    title: '한인맵 HaninMap | Korean Business Directory',
    description: '한인 병원, 치과, 변호사, 식당 찾기. Find Korean-speaking businesses in the United States.',
    url: BASE_URL,
    siteName: '한인맵 HaninMap',
    type: 'website',
  },
};

export default async function HomePage() {
  // Get top cities by business count
  const topCities = await prisma.business.groupBy({
    by: ['city', 'state'],
    _count: true,
    orderBy: { _count: { city: 'desc' } },
    take: 12,
  });

  // Get total business count
  const totalBusinesses = await prisma.business.count();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <header className="text-center py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          한인맵 HaninMap
        </h1>
        <h2 className="text-xl text-gray-700 mb-4">
          Korean Business Directory | 한인 업소록
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          한인 병원, 치과, 변호사, 식당 등 {totalBusinesses.toLocaleString()}개 업체 정보.
          <br />
          Find Korean-speaking doctors, dentists, lawyers, restaurants and more.
        </p>
      </header>

      {/* Quick Search by Category */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">카테고리별 찾기 (Browse by Category)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRIMARY_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.slug}
              slug={category.slug}
              nameEn={category.nameEn}
              nameKo={category.nameKo}
            />
          ))}
        </div>
      </section>

      {/* Top Cities */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">주요 도시 (Popular Cities)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topCities.map((loc) => (
            <CityCard
              key={`${loc.state}-${loc.city}`}
              city={loc.city}
              state={loc.state}
              count={loc._count}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories by City */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">인기 검색 (Popular Searches)</h2>
        <div className="flex flex-wrap gap-2">
          <QuickLink href="/ca/los-angeles/medical">Korean Doctors in Los Angeles</QuickLink>
          <QuickLink href="/ca/los-angeles/dental">Korean Dentists in Los Angeles</QuickLink>
          <QuickLink href="/ca/los-angeles/legal">Korean Lawyers in Los Angeles</QuickLink>
          <QuickLink href="/ca/irvine/medical">Korean Doctors in Irvine</QuickLink>
          <QuickLink href="/ca/garden-grove/food">Korean Restaurants in Garden Grove</QuickLink>
          <QuickLink href="/ca/fullerton/dental">Korean Dentists in Fullerton</QuickLink>
          <QuickLink href="/ca/torrance/medical">Korean Doctors in Torrance</QuickLink>
          <QuickLink href="/ca/los-angeles/real-estate">Korean Real Estate in Los Angeles</QuickLink>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 rounded-lg p-6 mt-12">
        <h2 className="text-lg font-semibold mb-4">한인맵 소개 (About HaninMap)</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          한인맵은 미국 내 한인 업소를 쉽게 찾을 수 있는 종합 디렉토리입니다.
          한인 병원, 치과, 변호사, 식당 등 다양한 업종의 정보를 제공합니다.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          HaninMap is the most comprehensive directory of Korean-speaking businesses in the United States.
          Our listings include verified contact information, Google ratings, and business hours.
        </p>
      </section>
    </main>
  );
}

function CategoryCard({
  slug,
  nameEn,
  nameKo,
}: {
  slug: string;
  nameEn: string;
  nameKo: string;
}) {
  return (
    <Link
      href={`/ca/los-angeles/${slug}`}
      className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <p className="font-medium text-gray-900">{nameEn}</p>
      <p className="text-sm text-gray-500">{nameKo}</p>
    </Link>
  );
}

function CityCard({
  city,
  state,
  count,
}: {
  city: string;
  state: string;
  count: number;
}) {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const stateSlug = state.toLowerCase();
  const cityDisplay = city
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return (
    <Link
      href={`/${stateSlug}/${citySlug}/medical`}
      className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
    >
      <p className="font-medium text-gray-900">{cityDisplay}</p>
      <p className="text-sm text-gray-500">
        {state.toUpperCase()} - {count.toLocaleString()} businesses
      </p>
    </Link>
  );
}

function QuickLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
    >
      {children}
    </Link>
  );
}
