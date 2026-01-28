import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
          rel="prev"
          className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          ← Prev
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-gray-300">← Prev</span>
      )}

      {/* Page Numbers */}
      {pages.map((page, idx) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Link
            key={pageNum}
            href={pageNum === 1 ? basePath : `${basePath}?page=${pageNum}`}
            className={`px-3 py-2 text-sm rounded ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          rel="next"
          className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          Next →
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm text-gray-300">Next →</span>
      )}
    </nav>
  );
}

function generatePageNumbers(current: number, total: number): (number | string)[] {
  const pages: (number | string)[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  // Show pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  // Always show last page
  pages.push(total);

  return pages;
}

interface PaginationHeadProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function PaginationHead({ currentPage, totalPages, basePath }: PaginationHeadProps) {
  return (
    <>
      {currentPage > 1 && (
        <link
          rel="prev"
          href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
        />
      )}
      {currentPage < totalPages && (
        <link rel="next" href={`${basePath}?page=${currentPage + 1}`} />
      )}
    </>
  );
}
