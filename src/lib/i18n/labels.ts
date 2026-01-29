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

// City names in Korean (comprehensive list)
export const CITY_NAMES_KO: Record<string, string> = {
  // California - LA Area
  'los-angeles': '로스앤젤레스',
  'la': '엘에이',
  'koreatown': '코리아타운',
  'ktown': '코리아타운',
  'glendale': '글렌데일',
  'burbank': '버뱅크',
  'pasadena': '패서디나',
  'arcadia': '아케이디아',
  'alhambra': '알함브라',
  'monterey-park': '몬터레이파크',
  'san-gabriel': '산가브리엘',
  'temple-city': '템플시티',
  'rosemead': '로즈미드',
  'el-monte': '엘몬테',
  'west-covina': '웨스트코비나',
  'covina': '코비나',
  'pomona': '포모나',
  'claremont': '클레어몬트',
  'walnut': '월넛',
  'rowland-heights': '롤랜드하이츠',
  'diamond-bar': '다이아몬드바',
  'hacienda-heights': '하시엔다하이츠',
  'la-puente': '라푸엔테',
  'industry': '인더스트리',

  // California - OC
  'irvine': '어바인',
  'fullerton': '풀러튼',
  'buena-park': '부에나파크',
  'garden-grove': '가든그로브',
  'anaheim': '애너하임',
  'santa-ana': '산타아나',
  'westminster': '웨스트민스터',
  'costa-mesa': '코스타메사',
  'newport-beach': '뉴포트비치',
  'huntington-beach': '헌팅턴비치',
  'tustin': '터스틴',
  'orange': '오렌지',
  'cypress': '사이프러스',
  'la-palma': '라팔마',
  'la-mirada': '라미라다',
  'cerritos': '세리토스',
  'artesia': '아테시아',
  'lakewood': '레이크우드',
  'norwalk': '노웍',
  'downey': '다우니',
  'whittier': '휘티어',
  'pico-rivera': '피코리베라',
  'paramount': '패러마운트',
  'bellflower': '벨플라워',
  'long-beach': '롱비치',
  'carson': '카슨',

  // California - South Bay
  'torrance': '토렌스',
  'gardena': '가디나',
  'redondo-beach': '레돈도비치',
  'manhattan-beach': '맨해튼비치',
  'hermosa-beach': '허모사비치',
  'palos-verdes': '팔로스버데스',
  'rancho-palos-verdes': '란초팔로스버데스',
  'rolling-hills': '롤링힐스',
  'lomita': '로미타',
  'harbor-city': '하버시티',
  'san-pedro': '산페드로',
  'wilmington': '윌밍턴',

  // California - Inland Empire
  'ontario': '온타리오',
  'rancho-cucamonga': '란초쿠카몽가',
  'fontana': '폰타나',
  'riverside': '리버사이드',
  'corona': '코로나',
  'san-bernardino': '샌버나디노',
  'chino': '치노',
  'chino-hills': '치노힐스',
  'upland': '업랜드',

  // California - San Diego
  'san-diego': '샌디에이고',
  'la-jolla': '라호야',
  'del-mar': '델마',
  'encinitas': '엔시니타스',
  'carlsbad': '칼스배드',
  'oceanside': '오션사이드',

  // California - Bay Area
  'san-francisco': '샌프란시스코',
  'oakland': '오클랜드',
  'fremont': '프리몬트',
  'san-jose': '산호세',
  'santa-clara': '산타클라라',
  'sunnyvale': '서니베일',
  'mountain-view': '마운틴뷰',
  'palo-alto': '팔로알토',
  'milpitas': '밀피타스',
  'cupertino': '쿠퍼티노',
  'hayward': '헤이워드',
  'union-city': '유니온시티',
  'daly-city': '데일리시티',
  'south-san-francisco': '사우스샌프란시스코',

  // New York
  'new-york': '뉴욕',
  'manhattan': '맨해튼',
  'flushing': '플러싱',
  'bayside': '베이사이드',
  'ridgewood': '리지우드',
  'jamaica': '자메이카',
  'brooklyn': '브루클린',
  'queens': '퀸즈',
  'bronx': '브롱스',
  'staten-island': '스태튼아일랜드',
  'little-neck': '리틀넥',
  'great-neck': '그레이트넥',
  'woodside': '우드사이드',
  'elmhurst': '엘름허스트',
  'sunnyside': '서니사이드',

  // New Jersey
  'fort-lee': '포트리',
  'palisades-park': '팰리세이즈파크',
  'edgewater': '엣지워터',
  'cliffside-park': '클리프사이드파크',
  'leonia': '레오니아',
  'englewood': '잉글우드',
  'hackensack': '해켄색',
  'teaneck': '티넥',
  'paramus': '패러머스',
  'ridgefield': '리지필드',
  'fairview': '페어뷰',
  'north-bergen': '노스버겐',
  'jersey-city': '저지시티',
  'newark': '뉴어크',
  'edison': '에디슨',

  // Texas
  'dallas': '댈러스',
  'carrollton': '캐롤턴',
  'plano': '플레이노',
  'houston': '휴스턴',
  'austin': '오스틴',
  'san-antonio': '샌안토니오',

  // Georgia
  'atlanta': '애틀란타',
  'duluth': '덜루스',
  'suwanee': '수와니',
  'lawrenceville': '로렌스빌',
  'johns-creek': '존스크릭',
  'alpharetta': '알파레타',
  'doraville': '도라빌',
  'buford': '뷰포드',
  'norcross': '노크로스',

  // Illinois
  'chicago': '시카고',
  'niles': '나일스',
  'glenview': '글렌뷰',
  'skokie': '스코키',
  'morton-grove': '모튼그로브',
  'lincolnwood': '링컨우드',

  // Washington
  'seattle': '시애틀',
  'federal-way': '페더럴웨이',
  'lynnwood': '린우드',
  'bellevue': '벨뷰',
  'tacoma': '타코마',
  'renton': '렌튼',
  'kent': '켄트',
  'auburn': '오번',

  // Nevada
  'las-vegas': '라스베가스',
  'henderson': '헨더슨',
  'north-las-vegas': '노스라스베가스',

  // Hawaii
  'honolulu': '호놀룰루',
  'ala-moana': '알라모아나',

  // Virginia
  'annandale': '애넌데일',
  'fairfax': '페어팩스',
  'centreville': '센터빌',
  'vienna': '비엔나',
  'mclean': '맥클린',
  'falls-church': '폴스처치',

  // Maryland
  'ellicott-city': '엘리콧시티',
  'baltimore': '볼티모어',
  'rockville': '록빌',
  'bethesda': '베데스다',
  'silver-spring': '실버스프링',

  // Pennsylvania
  'philadelphia': '필라델피아',
  'upper-darby': '어퍼다비',
  'cheltenham': '첼튼햄',

  // Massachusetts
  'boston': '보스턴',
  'cambridge': '케임브리지',
  'allston': '올스턴',

  // Connecticut
  'stamford': '스탬포드',
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
