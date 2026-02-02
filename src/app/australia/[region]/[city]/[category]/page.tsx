import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  generateIntlMetadata,
  InternationalCategoryPage,
} from '@/lib/pages/international-listing';

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, city, category } = await params;
  return generateIntlMetadata('australia', region, city, category);
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
