import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '한인맵 HaninMap - 미국·캐나다·호주 한인 업소록';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 16 }}>
          한인맵
        </div>
        <div style={{ fontSize: 36, opacity: 0.9, marginBottom: 32 }}>
          HaninMap
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.8,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          미국 · 캐나다 · 호주 한인 업소 디렉토리
        </div>
        <div
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 40,
            fontSize: 18,
            opacity: 0.7,
          }}
        >
          <span>병원</span>
          <span>·</span>
          <span>치과</span>
          <span>·</span>
          <span>식당</span>
          <span>·</span>
          <span>변호사</span>
          <span>·</span>
          <span>부동산</span>
          <span>·</span>
          <span>보험</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
