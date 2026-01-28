'use client';

import Link from 'next/link';

export interface BusinessCardProps {
  id: number;
  nameKo: string;
  nameEn?: string | null;
  addressRaw: string;
  city: string;
  state: string;
  phoneRaw?: string | null;
  phoneE164?: string | null;
  slug: string;
  rating?: number | null;
  reviewCount?: number | null;
  categorySlug: string;
  categoryNameEn: string;
}

export function BusinessCard({
  nameKo,
  nameEn,
  addressRaw,
  phoneRaw,
  phoneE164,
  slug,
  rating,
  reviewCount,
}: BusinessCardProps) {
  const displayName = nameEn || nameKo;
  const koreanName = nameEn ? nameKo : null;

  return (
    <article className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <Link href={`/biz/${slug}`} className="block">
        <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
          {displayName}
        </h2>
        {koreanName && (
          <p className="text-sm text-gray-500 mt-0.5">{koreanName}</p>
        )}
      </Link>

      <p className="text-sm text-gray-600 mt-2">{addressRaw}</p>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          {rating !== null && rating !== undefined && reviewCount !== null && reviewCount !== undefined && (
            <div className="flex items-center text-sm">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-medium">{rating.toFixed(1)}</span>
              <span className="text-gray-400 ml-1">({reviewCount})</span>
            </div>
          )}
        </div>

        {phoneRaw && (
          <a
            href={`tel:${phoneE164 || phoneRaw}`}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            📞 Call
          </a>
        )}
      </div>
    </article>
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mt-3"></div>
      <div className="flex justify-between mt-3">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}
