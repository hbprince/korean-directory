import { ImageResponse } from 'next/og';
import prisma from '@/lib/db/prisma';

export const alt = '한인맵 업체 정보';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      nameKo: true,
      nameEn: true,
      city: true,
      state: true,
      primaryCategory: { select: { nameKo: true, nameEn: true } },
      googlePlace: { select: { rating: true, userRatingsTotal: true } },
    },
  });

  const name = business?.nameEn || business?.nameKo || slug;
  const category = business?.primaryCategory?.nameKo || '';
  const city = business?.city
    ? business.city.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : '';
  const rating = business?.googlePlace?.rating;
  const reviews = business?.googlePlace?.userRatingsTotal;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: 60,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 24, opacity: 0.7, marginBottom: 16 }}>
            한인맵 HaninMap
          </div>
          <div style={{ fontSize: 52, fontWeight: 'bold', lineHeight: 1.2, maxWidth: 900 }}>
            {name}
          </div>
          {business?.nameKo && business?.nameEn && (
            <div style={{ fontSize: 32, opacity: 0.8, marginTop: 8 }}>
              {business.nameKo}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {category && (
            <div
              style={{
                fontSize: 20,
                background: 'rgba(255,255,255,0.15)',
                padding: '8px 20px',
                borderRadius: 20,
              }}
            >
              {category}
            </div>
          )}
          {city && (
            <div style={{ fontSize: 20, opacity: 0.8 }}>
              {city}, {business?.state?.toUpperCase()}
            </div>
          )}
          {rating && (
            <div style={{ fontSize: 20, opacity: 0.9 }}>
              ★ {rating.toFixed(1)} ({reviews}개 리뷰)
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
