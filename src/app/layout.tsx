import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Korean Business Directory',
    default: 'Korean Business Directory | Find Korean-Speaking Businesses',
  },
  description:
    'Find Korean-speaking doctors, dentists, lawyers, restaurants, and more. The most comprehensive directory of Korean businesses.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white min-h-screen`}>
        <GoogleAnalytics />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          한인맵
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/ca/los-angeles/medical" className="text-gray-600 hover:text-gray-900">
            Medical
          </Link>
          <Link href="/ca/los-angeles/dental" className="text-gray-600 hover:text-gray-900">
            Dental
          </Link>
          <Link href="/ca/los-angeles/legal" className="text-gray-600 hover:text-gray-900">
            Legal
          </Link>
          <Link href="/ca/los-angeles/food" className="text-gray-600 hover:text-gray-900">
            Dining
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-12 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">한인맵</h3>
            <p className="text-sm text-gray-600">
              Find Korean-speaking professionals and businesses in your area.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ca/los-angeles/medical" className="text-gray-600 hover:text-gray-900">Medical</Link></li>
              <li><Link href="/ca/los-angeles/dental" className="text-gray-600 hover:text-gray-900">Dental</Link></li>
              <li><Link href="/ca/los-angeles/legal" className="text-gray-600 hover:text-gray-900">Legal</Link></li>
              <li><Link href="/ca/los-angeles/insurance" className="text-gray-600 hover:text-gray-900">Insurance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Popular Cities</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ca/los-angeles/medical" className="text-gray-600 hover:text-gray-900">Los Angeles</Link></li>
              <li><Link href="/ca/irvine/medical" className="text-gray-600 hover:text-gray-900">Irvine</Link></li>
              <li><Link href="/ca/garden-grove/medical" className="text-gray-600 hover:text-gray-900">Garden Grove</Link></li>
              <li><Link href="/ca/fullerton/medical" className="text-gray-600 hover:text-gray-900">Fullerton</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sitemap.xml" className="text-gray-600 hover:text-gray-900">Sitemap</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} 한인맵. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
