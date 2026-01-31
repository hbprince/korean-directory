import Link from 'next/link';
import type { BreadcrumbItem } from '@/lib/seo/meta';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6 overflow-x-auto">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center">
              {idx > 0 && (
                <span className="mx-1.5 text-gray-300" aria-hidden="true">/</span>
              )}
              {isLast ? (
                <span className="text-gray-700 font-medium truncate max-w-[200px]" title={item.name}>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-gray-700 transition-colors truncate max-w-[160px]"
                  title={item.name}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
