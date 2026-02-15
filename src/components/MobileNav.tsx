'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/regions', label: '전체 지역 (Regions)' },
  { href: '/ca/los-angeles/medical', label: '병원 (Medical)' },
  { href: '/ca/los-angeles/food', label: '식당 (Dining)' },
  { href: '/canada/on/toronto/medical', label: '캐나다 (Canada)' },
  { href: '/australia/nsw/sydney/medical', label: '호주 (Australia)' },
  { href: '/alerts', label: '알림 (Alerts)' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={open}
        className="p-2 text-gray-600 hover:text-gray-900"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg z-50">
          <ul className="px-4 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-gray-600 hover:text-gray-900 border-b border-gray-100 last:border-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
