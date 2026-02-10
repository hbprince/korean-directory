'use client';

import { useState } from 'react';
import { getCityNameKo } from '@/lib/i18n/labels';

interface CityFilterProps {
  cities: Array<{ city: string; count: number }>;
  totalCount: number;
  state: string;
  currentCity: string;
  category: string;
  countrySlug?: string;
}

function toTitleCase(str: string): string {
  return str
    .replace(/-/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function CityFilter({
  cities,
  totalCount,
  state,
  currentCity,
  category,
  countrySlug,
}: CityFilterProps) {
  const [expanded, setExpanded] = useState(false);

  if (cities.length <= 1) {
    return null;
  }

  const topCities = cities.slice(0, 5);
  const remainingCities = cities.slice(5);
  const hasMore = remainingCities.length > 0;

  function buildCityHref(citySlug: string): string {
    if (countrySlug) {
      return `/${countrySlug}/${state}/${citySlug}/${category}`;
    }
    return `/${state}/${citySlug}/${category}`;
  }

  function renderCityLabel(citySlug: string): string {
    const cityKo = getCityNameKo(citySlug);
    const cityEn = toTitleCase(citySlug);
    if (cityKo === cityEn) {
      return cityEn;
    }
    return `${cityKo} (${cityEn})`;
  }

  const isAllActive = currentCity === 'all';

  return (
    <div className="mb-6">
      {/* Header */}
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        지역 선택 (Select City)
      </h3>

      {/* City pills */}
      <div className="flex flex-wrap gap-2">
        {/* "All" pill */}
        <a
          href={buildCityHref('all')}
          className={`inline-block px-3 py-1.5 text-sm rounded-full transition-colors ${
            isAllActive
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          전체 (All) ({totalCount})
        </a>

        {/* Top 5 cities */}
        {topCities.map((item) => {
          const citySlug = item.city.toLowerCase().replace(/\s+/g, '-');
          const isActive = currentCity.toLowerCase().replace(/\s+/g, '-') === citySlug;
          return (
            <a
              key={item.city}
              href={buildCityHref(citySlug)}
              className={`inline-block px-3 py-1.5 text-sm rounded-full transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {renderCityLabel(citySlug)} ({item.count})
            </a>
          );
        })}

        {/* Remaining cities - always in DOM, hidden via max-height + overflow */}
        {hasMore && (
          <div
            className="w-full transition-[max-height] duration-300 ease-in-out overflow-hidden"
            style={{ maxHeight: expanded ? '40rem' : '0' }}
          >
            <div className="flex flex-wrap gap-2 pt-2">
              {remainingCities.map((item) => {
                const citySlug = item.city.toLowerCase().replace(/\s+/g, '-');
                const isActive = currentCity.toLowerCase().replace(/\s+/g, '-') === citySlug;
                return (
                  <a
                    key={item.city}
                    href={buildCityHref(citySlug)}
                    className={`inline-block px-3 py-1.5 text-sm rounded-full transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {renderCityLabel(citySlug)} ({item.count})
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Toggle button */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          {expanded ? '접기' : `더보기 +${remainingCities.length}개 도시`}
        </button>
      )}
    </div>
  );
}
