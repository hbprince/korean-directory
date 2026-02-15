/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Redirect non-www to www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'haninmap.com',
          },
        ],
        destination: 'https://www.haninmap.com/:path*',
        permanent: true,
      },
      // Redirect vercel.app to www.haninmap.com
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'korean-directory.vercel.app',
          },
        ],
        destination: 'https://www.haninmap.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
