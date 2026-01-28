// Mapping from RadioKorea and KoreaDaily category codes to our taxonomy

// RadioKorea category code to our primary/subcategory mapping
export const RADIOKOREA_MAPPING: Record<string, { primary: string; sub?: string }> = {
  // Medical
  'B08': { primary: 'medical', sub: 'internal-medicine' },
  'B09': { primary: 'medical', sub: 'internal-medicine' }, // Infection
  'B10': { primary: 'medical', sub: 'endocrinology' },
  'B11': { primary: 'medical', sub: 'gastroenterology' },
  'B12': { primary: 'medical', sub: 'rheumatology' },
  'B13': { primary: 'medical', sub: 'urology' },
  'B14': { primary: 'medical', sub: 'obgyn' },
  'B15': { primary: 'medical', sub: 'plastic-surgery' },
  'B16': { primary: 'medical', sub: 'pediatrics' },
  'B17': { primary: 'medical', sub: 'gastroenterology' },
  'B18': { primary: 'medical', sub: 'neurosurgery' },
  'B19': { primary: 'medical', sub: 'nephrology' },
  'B20': { primary: 'medical', sub: 'cardiology' },
  'B21': { primary: 'medical', sub: 'ophthalmology' },
  'B22': { primary: 'medical', sub: 'allergy' },
  'B23': { primary: 'medical', sub: 'oncology' },
  'B24': { primary: 'medical', sub: 'ent' },
  'B25': { primary: 'medical', sub: 'general-surgery' },
  'B26': { primary: 'medical', sub: 'rehabilitation' },
  'B27': { primary: 'medical', sub: 'psychiatry' },
  'B28': { primary: 'medical', sub: 'orthopedics' },
  'B29': { primary: 'medical', sub: 'podiatry' },
  'B30': { primary: 'medical', sub: 'diagnostics' },
  'B31': { primary: 'medical', sub: 'pain-management' },
  'B32': { primary: 'medical', sub: 'pulmonology' },
  'B33': { primary: 'medical', sub: 'dermatology' },
  'B34': { primary: 'medical', sub: 'cardiology' }, // Vascular
  'H09': { primary: 'medical', sub: 'korean-medicine' },
  'A08': { primary: 'medical', sub: 'pharmacy' },

  // Dental
  'B35': { primary: 'dental', sub: 'orthodontist' },
  'B36': { primary: 'dental', sub: 'prosthodontist' },
  'B37': { primary: 'dental', sub: 'pediatric-dentist' },
  'B38': { primary: 'dental', sub: 'dental-lab' },
  'B39': { primary: 'dental', sub: 'dental-implants' },
  'B40': { primary: 'dental', sub: 'periodontist' },

  // Legal
  'B07': { primary: 'legal' },
  'D02': { primary: 'legal', sub: 'notary' },

  // Insurance
  'B41': { primary: 'insurance' },

  // Real Estate
  'B04': { primary: 'real-estate' },
  'A15': { primary: 'real-estate', sub: 'escrow' },

  // Financial
  'K11': { primary: 'financial', sub: 'tax-preparer' },
  'K12': { primary: 'financial', sub: 'cpa' },
  'A26': { primary: 'financial', sub: 'mortgage-broker' },
  'A27': { primary: 'financial', sub: 'bank' },

  // Food & Dining
  'S12': { primary: 'food', sub: 'snack-bar' },
  'S13': { primary: 'food', sub: 'western-restaurant' },
  'S14': { primary: 'food', sub: 'japanese-restaurant' },
  'S15': { primary: 'food', sub: 'chinese-restaurant' },
  'S16': { primary: 'food', sub: 'korean-restaurant' },
  'J19': { primary: 'food', sub: 'bakery' },
  'D05': { primary: 'food', sub: 'bakery' }, // 떡집
  'M01': { primary: 'food', sub: 'grocery' },

  // Beauty
  'M06': { primary: 'beauty', sub: 'hair-salon' },
  'A30': { primary: 'beauty', sub: 'barbershop' },
  'S11': { primary: 'beauty', sub: 'skin-care' },
  'S03': { primary: 'beauty', sub: 'spa' }, // Sauna
  'H08': { primary: 'beauty', sub: 'cosmetics' },

  // Auto Services
  'J02': { primary: 'auto', sub: 'auto-repair' },
  'J03': { primary: 'auto', sub: 'car-wash' },
  'J06': { primary: 'auto', sub: 'tires' },
  'J07': { primary: 'auto', sub: 'towing' },
  'J09': { primary: 'auto', sub: 'car-dealer' },
  'J01': { primary: 'auto', sub: 'car-rental' },

  // Home Services
  'P05': { primary: 'home-services', sub: 'plumbing' },
  'N02': { primary: 'home-services', sub: 'hvac' },
  'L01': { primary: 'home-services', sub: 'roofing' },
  'C06': { primary: 'home-services', sub: 'cleaning' },
  'J14': { primary: 'home-services', sub: 'electrical' },
  'K02': { primary: 'home-services', sub: 'landscaping' },
  'A34': { primary: 'home-services', sub: 'moving' },
  'K07': { primary: 'home-services', sub: 'construction' },
  'P02': { primary: 'home-services', sub: 'painting' },
  'Q02': { primary: 'home-services', sub: 'carpet' },
  'A17': { primary: 'home-services', sub: 'locksmith' },
  'P01': { primary: 'home-services', sub: 'pest-control' },

  // Education
  'H03': { primary: 'education', sub: 'tutoring' },
  'H01': { primary: 'education', sub: 'driving-school' },
  'H02': { primary: 'education', sub: 'preschool' },
  'H04': { primary: 'education', sub: 'martial-arts' },
  'D03': { primary: 'education', sub: 'dance-school' },
  'D04': { primary: 'education', sub: 'martial-arts' },
  'A01': { primary: 'education', sub: 'music-school' },

  // Travel
  'A16': { primary: 'travel', sub: 'travel-agency' },
  'H06': { primary: 'travel', sub: 'airline' },
  'H07': { primary: 'travel', sub: 'hotel' },

  // Professional Services
  'A32': { primary: 'professional', sub: 'printing' },
  'S04': { primary: 'professional', sub: 'photography' },
  'K13': { primary: 'professional', sub: 'advertising' },
  'K05': { primary: 'professional', sub: 'signage' },
  'A23': { primary: 'professional', sub: 'wedding' },
  'J11': { primary: 'professional', sub: 'funeral' },

  // Shopping
  'J16': { primary: 'shopping', sub: 'electronics' },
  'K01': { primary: 'shopping', sub: 'furniture' },
  'A29': { primary: 'shopping', sub: 'clothing' },
  'B03': { primary: 'shopping', sub: 'jewelry' },
  'A03': { primary: 'shopping', sub: 'optical' },
  'S06': { primary: 'shopping', sub: 'bookstore' },
  'K15': { primary: 'shopping', sub: 'florist' },

  // Community
  'G04': { primary: 'community', sub: 'church' },
  'G05': { primary: 'community', sub: 'church' },
  'G06': { primary: 'community', sub: 'church' },
  'G07': { primary: 'community', sub: 'church' },
  'G08': { primary: 'community', sub: 'church' },
  'G10': { primary: 'community', sub: 'temple' },
  'G11': { primary: 'community', sub: 'temple' },
  'G01': { primary: 'community', sub: 'organization' },
  'G02': { primary: 'community', sub: 'organization' },
  'G03': { primary: 'community', sub: 'organization' },
  'G12': { primary: 'community', sub: 'organization' },
  'A09': { primary: 'community', sub: 'senior-center' },
  'A14': { primary: 'community', sub: 'media' },
};

// KoreaDaily category_id to our primary category mapping
export const KOREADAILY_PRIMARY_MAPPING: Record<number, string> = {
  1: 'community',     // 종교
  2: 'community',     // 커뮤니티
  3: 'community',     // 미디어
  4: 'shopping',      // 쇼핑
  5: 'food',          // 식당
  6: 'beauty',        // 뷰티
  7: 'medical',       // 병원
  8: 'dental',        // 치과
  9: 'legal',         // 법률
  10: 'insurance',    // 보험
  11: 'real-estate',  // 부동산
  12: 'financial',    // 금융
  13: 'auto',         // 자동차
  14: 'home-services', // 주택서비스
  15: 'education',    // 교육
  16: 'travel',       // 여행
  17: 'professional', // 전문서비스
};

// KoreaDaily sub_idx to our subcategory mapping (by primary category)
export const KOREADAILY_SUB_MAPPING: Record<string, string> = {
  // Food (category_id: 5)
  '5-13': 'korean-bbq',      // BBQ
  '5-14': 'korean-restaurant', // 한식
  '5-15': 'japanese-restaurant', // 일식
  '5-16': 'chinese-restaurant', // 중식
  '5-17': 'snack-bar',       // 분식
  '5-18': 'bakery',          // 베이커리
  '5-19': 'cafe',            // 카페

  // Medical (category_id: 7)
  '7-1': 'internal-medicine',
  '7-2': 'obgyn',
  '7-3': 'pediatrics',
  '7-4': 'dermatology',
  '7-5': 'ophthalmology',
  '7-6': 'ent',
  '7-7': 'orthopedics',
  '7-8': 'korean-medicine',
  '7-9': 'pharmacy',

  // Dental (category_id: 8)
  '8-1': 'general-dentist',
  '8-2': 'orthodontist',
  '8-3': 'pediatric-dentist',
  '8-4': 'dental-implants',

  // Add more mappings as needed based on actual data
};

// Get our category mapping from RadioKorea category code
export function mapRadioKoreaCategory(categoryCode: string): { primary: string; sub?: string } {
  return RADIOKOREA_MAPPING[categoryCode] || { primary: 'community', sub: 'organization' };
}

// Get our category mapping from KoreaDaily category
export function mapKoreaDailyCategory(categoryId: number, subIdx?: number): { primary: string; sub?: string } {
  const primary = KOREADAILY_PRIMARY_MAPPING[categoryId] || 'community';

  if (subIdx) {
    const subKey = `${categoryId}-${subIdx}`;
    const sub = KOREADAILY_SUB_MAPPING[subKey];
    if (sub) {
      return { primary, sub };
    }
  }

  return { primary };
}
