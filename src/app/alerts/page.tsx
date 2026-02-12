import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/db/prisma';

export const revalidate = 3600; // 1 hour

const BASE_URL = 'https://www.haninmap.com';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '한인 생활 알림 | 한인맵',
    description:
      '미국 한인을 위한 비자 불러틴, 이민 뉴스, FDA 리콜, IRS 세금 소식을 한국어로 제공합니다. Korean-American community alerts for immigration, FDA recalls, and IRS news.',
    robots: 'index,follow',
    openGraph: {
      title: '한인 생활 알림 | 한인맵',
      description:
        '미국 한인을 위한 비자 불러틴, 이민 뉴스, FDA 리콜, IRS 세금 소식을 한국어로 제공합니다.',
      type: 'website',
      siteName: '한인맵 HaninMap',
      url: `${BASE_URL}/alerts`,
    },
    alternates: {
      canonical: `${BASE_URL}/alerts`,
    },
  };
}

// Filter tabs configuration
const FILTER_TABS = [
  { key: 'all', label: '전체', sources: null },
  { key: 'immigration', label: '이민/비자', sources: ['visa_bulletin', 'uscis'] },
  { key: 'tax', label: '세금', sources: ['irs'] },
  { key: 'food-safety', label: '식품안전', sources: ['fda_recall'] },
] as const;

type FilterKey = (typeof FILTER_TABS)[number]['key'];

function isValidFilter(value: string | undefined): value is FilterKey {
  return FILTER_TABS.some((tab) => tab.key === value);
}

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const activeFilter = isValidFilter(searchParams.filter)
    ? searchParams.filter
    : 'all';

  const activeTab = FILTER_TABS.find((tab) => tab.key === activeFilter)!;

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: 'published' };
  if (activeTab.sources) {
    where.source = { in: [...activeTab.sources] };
  }

  const alerts = await prisma.alertFeed.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: 50,
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          한인 생활 알림
        </h1>
        <p className="text-lg text-gray-600">
          미국 한인에게 중요한 이민, 세금, 식품안전 소식을 한국어로 전해드립니다.
          비자 불러틴, USCIS 뉴스, FDA 리콜, IRS 소식을 확인하세요.
        </p>
      </header>

      {/* Filter Tabs */}
      <nav className="flex flex-wrap gap-2 mb-8" aria-label="Alert category filters">
        {FILTER_TABS.map((tab) => {
          const isActive = tab.key === activeFilter;
          return (
            <Link
              key={tab.key}
              href={tab.key === 'all' ? '/alerts' : `/alerts?filter=${tab.key}`}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Alert Cards */}
      {alerts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">등록된 알림이 없습니다.</p>
          <p className="text-gray-400 text-sm mt-2">
            곧 새로운 알림이 업데이트됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </main>
  );
}

// ─── Sub-components ───

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    urgent: 'bg-red-50 text-red-700 border-red-200',
  };

  const labels: Record<string, string> = {
    info: '정보',
    warning: '주의',
    urgent: '긴급',
  };

  const style = styles[severity] || styles.info;
  const label = labels[severity] || labels.info;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${style}`}
    >
      {label}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const labels: Record<string, string> = {
    visa_bulletin: '비자 불러틴',
    uscis: 'USCIS',
    fda_recall: 'FDA 리콜',
    irs: 'IRS',
  };

  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
      {labels[source] || source}
    </span>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

function AlertCard({
  alert,
}: {
  alert: {
    id: number;
    titleKo: string;
    summaryKo: string;
    source: string;
    severity: string;
    sourceUrl: string;
    publishedAt: Date;
  };
}) {
  return (
    <article className="block p-5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      {/* Badges row */}
      <div className="flex items-center gap-2 mb-3">
        <SeverityBadge severity={alert.severity} />
        <SourceBadge source={alert.source} />
        <span className="text-xs text-gray-400 ml-auto">
          {formatDate(alert.publishedAt)}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        {alert.titleKo}
      </h2>

      {/* Summary */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {alert.summaryKo}
      </p>

      {/* Source link */}
      <a
        href={alert.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
      >
        원문 보기 &rarr;
      </a>
    </article>
  );
}
