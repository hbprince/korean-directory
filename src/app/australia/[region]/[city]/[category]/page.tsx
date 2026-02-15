import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db/prisma';
import {
  generateIntlMetadata,
  InternationalCategoryPage,
} from '@/lib/pages/international-listing';
import { isMalformedCity } from '@/lib/seo/slug-utils';

export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

const MIN_STATIC_COUNT = 10;

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true, level: true },
  });
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  const counts = await prisma.business.groupBy({
    by: ['city', 'state', 'primaryCategoryId'],
    _count: { _all: true },
    where: { countryCode: 'AU' },
  });

  const params: Array<{ region: string; city: string; category: string }> = [];
  const added = new Set<string>();

  for (const item of counts) {
    if (!item.city || !item.state || !item.primaryCategoryId) continue;
    if (item._count._all < MIN_STATIC_COUNT) continue;
    if (isMalformedCity(item.city)) continue;

    const cat = categoryMap.get(item.primaryCategoryId);
    if (!cat || cat.level !== 'primary') continue;

    const key = `${item.state}|${item.city}|${cat.slug}`;
    if (added.has(key)) continue;
    added.add(key);

    params.push({
      region: item.state.toLowerCase(),
      city: item.city.toLowerCase().replace(/\s+/g, '-'),
      category: cat.slug,
    });
  }

  console.log(`[generateStaticParams] Australia pages: ${params.length} paths`);
  return params;
}

interface PageProps {
  params: Promise<{
    region: string;
    city: string;
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { region, city, category } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10) || 1;
  return generateIntlMetadata('australia', region, city, category, page);
}

export default async function AustraliaCategoryPage({ params, searchParams }: PageProps) {
  const { region, city, category } = await params;
  const { page: pageParam } = await searchParams;

  const page = parseInt(pageParam || '1', 10);
  if (isNaN(page) || page < 1) notFound();

  return (
    <InternationalCategoryPage
      countrySlug="australia"
      region={region}
      city={city}
      category={category}
      page={page}
    />
  );
}
