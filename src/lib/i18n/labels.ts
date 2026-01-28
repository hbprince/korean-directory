/**
 * Bilingual labels for Korean Business Directory
 * Format: { en: string, ko: string }
 */

export interface BilingualLabel {
  en: string;
  ko: string;
}

// UI Labels
export const UI_LABELS = {
  businessesFound: { en: 'businesses found', ko: '업체' },
  noBusinessesFound: { en: 'No businesses found', ko: '업체 없음' },
  call: { en: 'Call', ko: '전화' },
  directions: { en: 'Directions', ko: '길찾기' },
  website: { en: 'Website', ko: '웹사이트' },
  viewDetails: { en: 'View Details', ko: '상세보기' },
  showMore: { en: 'Show More', ko: '더보기' },
  reviews: { en: 'reviews', ko: '리뷰' },
  rating: { en: 'rating', ko: '평점' },
  hours: { en: 'Hours', ko: '영업시간' },
  address: { en: 'Address', ko: '주소' },
  phone: { en: 'Phone', ko: '전화번호' },
  category: { en: 'Category', ko: '카테고리' },
  relatedCategories: { en: 'Related Categories', ko: '관련 카테고리' },
  nearbyBusinesses: { en: 'Nearby Businesses', ko: '주변 업체' },
  frequentlyAskedQuestions: { en: 'Frequently Asked Questions', ko: '자주 묻는 질문' },
  trySearching: { en: 'Try searching in a nearby city or browse other categories.', ko: '인근 도시에서 검색하거나 다른 카테고리를 찾아보세요.' },
  noListingsYet: { en: 'No listings yet in this category.', ko: '이 카테고리에 아직 등록된 업체가 없습니다.' },
} as const;

// Format bilingual text: "KO (EN)" or "KO | EN"
export function formatBilingual(ko: string, en: string | null | undefined, separator: ' | ' | ' (' = ' | '): string {
  if (!en || en === ko) return ko;
  if (separator === ' (') {
    return `${ko} (${en})`;
  }
  return `${ko} | ${en}`;
}

// Format count with bilingual label
export function formatCount(count: number, label: BilingualLabel): string {
  return `${count} ${label.ko} (${count} ${label.en})`;
}

// California city names in Korean (major cities)
export const CITY_NAMES_KO: Record<string, string> = {
  'los-angeles': '로스앤젤레스',
  'la': '엘에이',
  'koreatown': '코리아타운',
  'ktown': '코리아타운',
  'irvine': '어바인',
  'fullerton': '풀러튼',
  'buena-park': '부에나파크',
  'garden-grove': '가든그로브',
  'torrance': '토렌스',
  'cerritos': '세리토스',
  'rowland-heights': '롤랜드하이츠',
  'diamond-bar': '다이아몬드바',
  'la-palma': '라팔마',
  'anaheim': '애너하임',
  'santa-ana': '산타아나',
  'westminster': '웨스트민스터',
  'san-diego': '샌디에이고',
  'san-francisco': '샌프란시스코',
  'oakland': '오클랜드',
  'palisades-park': '팰리세이즈파크',
  'fort-lee': '포트리',
  'flushing': '플러싱',
  'bayside': '베이사이드',
  'ridgewood': '리지우드',
  'atlanta': '애틀란타',
  'duluth': '덜루스',
  'suwanee': '수와니',
  'dallas': '댈러스',
  'carrollton': '캐롤턴',
  'plano': '플레이노',
  'chicago': '시카고',
  'niles': '나일스',
  'glenview': '글렌뷰',
  'seattle': '시애틀',
  'federal-way': '페더럴웨이',
  'lynnwood': '린우드',
  'las-vegas': '라스베가스',
  'henderson': '헨더슨',
  'honolulu': '호놀룰루',
  'ala-moana': '알라모아나',
};

// Get Korean city name with fallback
export function getCityNameKo(citySlug: string): string {
  const normalized = citySlug.toLowerCase().replace(/\s+/g, '-');
  return CITY_NAMES_KO[normalized] || toTitleCase(citySlug.replace(/-/g, ' '));
}

// Format city bilingual: "로스앤젤레스 (Los Angeles)"
export function formatCityBilingual(citySlug: string): string {
  const ko = getCityNameKo(citySlug);
  const en = toTitleCase(citySlug.replace(/-/g, ' '));
  if (ko === en) return en;
  return `${ko} (${en})`;
}

// State abbreviations to Korean
export const STATE_NAMES_KO: Record<string, string> = {
  'CA': '캘리포니아',
  'NY': '뉴욕',
  'NJ': '뉴저지',
  'TX': '텍사스',
  'GA': '조지아',
  'IL': '일리노이',
  'WA': '워싱턴',
  'VA': '버지니아',
  'MD': '메릴랜드',
  'NV': '네바다',
  'HI': '하와이',
  'PA': '펜실베이니아',
  'MA': '매사추세츠',
  'CO': '콜로라도',
  'AZ': '애리조나',
  'FL': '플로리다',
  'OR': '오레곤',
};

export function getStateNameKo(stateAbbr: string): string {
  return STATE_NAMES_KO[stateAbbr.toUpperCase()] || stateAbbr;
}

// Helper
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
