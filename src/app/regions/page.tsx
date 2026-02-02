import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/db/prisma';
import { getAllCountries, type CountryConfig } from '@/lib/i18n/countries';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.haninmap.com';

export const metadata: Metadata = {
  title: '전체 지역 | All Regions',
  description:
    '미국, 캐나다, 호주 한인 업소를 지역별로 찾아보세요. Browse Korean businesses by region across the US, Canada, and Australia.',
  alternates: {
    canonical: `${BASE_URL}/regions`,
  },
};

interface StateData {
  state: string;
  stateName: string;
  totalCount: number;
  cities: {
    city: string;
    citySlug: string;
    count: number;
  }[];
}

interface CountryData {
  config: CountryConfig;
  totalCount: number;
  regions: {
    regionCode: string;
    regionName: string;
    regionNameKo: string;
    totalCount: number;
    cities: {
      city: string;
      citySlug: string;
      count: number;
    }[];
  }[];
}

const STATE_NAMES: Record<string, string> = {
  CA: 'California (캘리포니아)',
  NY: 'New York (뉴욕)',
  NJ: 'New Jersey (뉴저지)',
  TX: 'Texas (텍사스)',
  VA: 'Virginia (버지니아)',
  GA: 'Georgia (조지아)',
  PA: 'Pennsylvania (펜실베니아)',
  MA: 'Massachusetts (매사추세츠)',
  CT: 'Connecticut (커넥티컷)',
  NV: 'Nevada (네바다)',
  FL: 'Florida (플로리다)',
  WA: 'Washington (워싱턴)',
  IL: 'Illinois (일리노이)',
  MD: 'Maryland (메릴랜드)',
  OH: 'Ohio (오하이오)',
};

export default async function RegionsPage() {
  // ─── US data (existing) ───
  const usCityData = await prisma.business.groupBy({
    by: ['state', 'city'],
    _count: { _all: true },
    where: {
      countryCode: 'US',
      city: { not: 'Unknown' },
    },
    orderBy: [{ state: 'asc' }, { _count: { city: 'desc' } }],
  });

  const stateMap = new Map<string, StateData>();

  for (const item of usCityData) {
    const state = item.state;
    if (!stateMap.has(state)) {
      stateMap.set(state, {
        state,
        stateName: STATE_NAMES[state] || state,
        totalCount: 0,
        cities: [],
      });
    }

    const stateData = stateMap.get(state)!;
    stateData.totalCount += item._count._all;
    stateData.cities.push({
      city: item.city,
      citySlug: item.city.toLowerCase().replace(/\s+/g, '-'),
      count: item._count._all,
    });
  }

  const states = Array.from(stateMap.values()).sort((a, b) => b.totalCount - a.totalCount);

  const usTotalBusinesses = await prisma.business.count({
    where: { countryCode: 'US', city: { not: 'Unknown' } },
  });

  // ─── International data ───
  const countries = getAllCountries();
  const countryDataList: CountryData[] = [];

  for (const config of countries) {
    const intlCityData = await prisma.business.groupBy({
      by: ['state', 'city'],
      _count: { _all: true },
      where: {
        countryCode: config.code,
        city: { not: 'Unknown' },
      },
      orderBy: [{ state: 'asc' }, { _count: { city: 'desc' } }],
    });

    if (intlCityData.length === 0) continue;

    const regionMap = new Map<string, CountryData['regions'][0]>();

    for (const item of intlCityData) {
      const regionCode = item.state;
      if (!regionMap.has(regionCode)) {
        regionMap.set(regionCode, {
          regionCode,
          regionName: config.regions[regionCode] ?? regionCode,
          regionNameKo: config.regionNameKo[regionCode] ?? regionCode,
          totalCount: 0,
          cities: [],
        });
      }

      const regionData = regionMap.get(regionCode)!;
      regionData.totalCount += item._count._all;
      regionData.cities.push({
        city: item.city,
        citySlug: item.city.toLowerCase().replace(/\s+/g, '-'),
        count: item._count._all,
      });
    }

    const regions = Array.from(regionMap.values()).sort((a, b) => b.totalCount - a.totalCount);
    const totalCount = regions.reduce((sum, r) => sum + r.totalCount, 0);

    countryDataList.push({ config, totalCount, regions });
  }

  const totalAllBusinesses = usTotalBusinesses + countryDataList.reduce((s, c) => s + c.totalCount, 0);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">전체 지역 (All Regions)</h1>
        <p className="text-gray-600">
          전 세계 {totalAllBusinesses.toLocaleString()}개 한인 업소를 지역별로 찾아보세요.
          <br />
          Browse {totalAllBusinesses.toLocaleString()} Korean businesses by region.
        </p>
      </header>

      {/* US Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          미국 (United States)
          <span className="text-sm font-normal text-gray-500">
            {usTotalBusinesses.toLocaleString()} businesses
          </span>
        </h2>
        <div className="space-y-8">
          {states.map((stateData) => (
            <div key={stateData.state} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{stateData.stateName}</h3>
                <span className="text-sm text-gray-500">
                  {stateData.totalCount.toLocaleString()} businesses
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {stateData.cities.slice(0, 16).map((city) => (
                  <Link
                    key={`${stateData.state}-${city.city}`}
                    href={`/${stateData.state.toLowerCase()}/${city.citySlug}/medical`}
                    className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-medium text-gray-900 text-sm">{formatCityName(city.city)}</p>
                    <p className="text-xs text-gray-500">{city.count.toLocaleString()} businesses</p>
                  </Link>
                ))}
              </div>

              {stateData.cities.length > 16 && (
                <p className="mt-4 text-sm text-gray-500">
                  + {stateData.cities.length - 16} more cities
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* International Sections */}
      {countryDataList.map((countryData) => (
        <section key={countryData.config.code} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            {countryData.config.nameKo} ({countryData.config.nameEn})
            <span className="text-sm font-normal text-gray-500">
              {countryData.totalCount.toLocaleString()} businesses
            </span>
          </h2>
          <div className="space-y-8">
            {countryData.regions.map((region) => (
              <div key={region.regionCode} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {region.regionNameKo} ({region.regionName})
                  </h3>
                  <span className="text-sm text-gray-500">
                    {region.totalCount.toLocaleString()} businesses
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {region.cities.slice(0, 16).map((city) => (
                    <Link
                      key={`${region.regionCode}-${city.city}`}
                      href={`/${countryData.config.slug}/${region.regionCode.toLowerCase()}/${city.citySlug}/medical`}
                      className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      <p className="font-medium text-gray-900 text-sm">{formatCityName(city.city)}</p>
                      <p className="text-xs text-gray-500">{city.count.toLocaleString()} businesses</p>
                    </Link>
                  ))}
                </div>

                {region.cities.length > 16 && (
                  <p className="mt-4 text-sm text-gray-500">
                    + {region.cities.length - 16} more cities
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

function formatCityName(city: string): string {
  return city
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
