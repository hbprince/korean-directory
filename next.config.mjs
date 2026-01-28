/** @type {import('next').NextConfig} */
const nextConfig = {
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
