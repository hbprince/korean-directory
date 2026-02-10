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
  if (cities.length <= 1) {
    return null;
  }

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

  const pillBase = 'shrink-0 md:shrink inline-block px-3 py-1.5 text-sm rounded-full transition-colors';
  const pillActive = 'bg-blue-600 text-white';
  const pillInactive = 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100';

  return (
    <div className="mb-4">
      {/* City pills - mobile: horizontal scroll / desktop: wrap */}
      <div className="flex flex-nowrap overflow-x-auto md:flex-wrap md:overflow-visible gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* "All" pill */}
        <a
          href={buildCityHref('all')}
          className={`${pillBase} ${isAllActive ? pillActive : pillInactive}`}
        >
          전체 ({totalCount})
        </a>

        {/* All cities */}
        {cities.map((item) => {
          const citySlug = item.city.toLowerCase().replace(/\s+/g, '-');
          const isActive = currentCity.toLowerCase().replace(/\s+/g, '-') === citySlug;
          return (
            <a
              key={item.city}
              href={buildCityHref(citySlug)}
              className={`${pillBase} ${isActive ? pillActive : pillInactive}`}
            >
              {renderCityLabel(citySlug)} ({item.count})
            </a>
          );
        })}
      </div>
    </div>
  );
}
