import Link from 'next/link';
import { PRIMARY_CATEGORIES, PrimaryCategory } from '@/lib/taxonomy/categories';

interface CategoryNavProps {
  currentState: string;
  currentCity: string;
  currentCategory?: string;
  currentSubcategory?: string;
  parentCategorySlug?: string;
}

export function CategoryNav({
  currentState,
  currentCity,
  currentCategory,
  currentSubcategory,
  parentCategorySlug,
}: CategoryNavProps) {
  // Find the active primary category (either current or parent of current subcategory)
  const activePrimarySlug = parentCategorySlug || currentCategory;
  const activePrimary = PRIMARY_CATEGORIES.find(
    (c) => c.slug === activePrimarySlug
  );

  return (
    <nav className="border-b border-gray-200 pb-4 mb-6">
      {/* Primary Categories */}
      <div className="flex flex-wrap gap-2">
        {PRIMARY_CATEGORIES.map((category) => {
          const isActive = category.slug === activePrimarySlug;
          return (
            <Link
              key={category.slug}
              href={`/${currentState}/${currentCity}/${category.slug}`}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.nameEn}
            </Link>
          );
        })}
      </div>

      {/* Subcategories - show when we have an active primary category */}
      {activePrimary && activePrimary.subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          {activePrimary.subcategories.map((sub) => {
            const isActiveSub = currentSubcategory === sub.slug;
            return (
              <Link
                key={sub.slug}
                href={`/${currentState}/${currentCity}/${sub.slug}`}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  isActiveSub
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {sub.nameEn}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

interface CategorySidebarProps {
  currentState: string;
  currentCity: string;
  currentCategory?: string;
}

export function CategorySidebar({
  currentState,
  currentCity,
  currentCategory,
}: CategorySidebarProps) {
  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <ul className="space-y-1">
        {PRIMARY_CATEGORIES.map((category) => (
          <CategorySidebarItem
            key={category.slug}
            category={category}
            currentState={currentState}
            currentCity={currentCity}
            currentCategory={currentCategory}
          />
        ))}
      </ul>
    </aside>
  );
}

function CategorySidebarItem({
  category,
  currentState,
  currentCity,
  currentCategory,
}: {
  category: PrimaryCategory;
  currentState: string;
  currentCity: string;
  currentCategory?: string;
}) {
  const isActive = currentCategory === category.slug;
  const hasActiveSubcategory = category.subcategories.some(
    (s) => s.slug === currentCategory
  );

  return (
    <li>
      <Link
        href={`/${currentState}/${currentCity}/${category.slug}`}
        className={`block px-3 py-2 rounded-md text-sm transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span className="mr-2">{category.nameKo}</span>
        <span className="text-gray-500">{category.nameEn}</span>
      </Link>

      {(isActive || hasActiveSubcategory) && category.subcategories.length > 0 && (
        <ul className="ml-4 mt-1 space-y-0.5">
          {category.subcategories.map((sub) => (
            <li key={sub.slug}>
              <Link
                href={`/${currentState}/${currentCity}/${sub.slug}`}
                className={`block px-3 py-1 text-xs rounded transition-colors ${
                  currentCategory === sub.slug
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {sub.nameEn}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
