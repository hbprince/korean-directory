// Primary Categories with SEO-friendly slugs
export interface PrimaryCategory {
  slug: string;
  nameKo: string;
  nameEn: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  slug: string;
  nameKo: string;
  nameEn: string;
}

export const PRIMARY_CATEGORIES: PrimaryCategory[] = [
  {
    slug: 'medical',
    nameKo: '병원',
    nameEn: 'Medical',
    subcategories: [
      { slug: 'internal-medicine', nameKo: '내과', nameEn: 'Internal Medicine' },
      { slug: 'obgyn', nameKo: '산부인과', nameEn: 'OBGYN' },
      { slug: 'pediatrics', nameKo: '소아과', nameEn: 'Pediatrics' },
      { slug: 'dermatology', nameKo: '피부과', nameEn: 'Dermatology' },
      { slug: 'ophthalmology', nameKo: '안과', nameEn: 'Ophthalmology' },
      { slug: 'ent', nameKo: '이비인후과', nameEn: 'ENT' },
      { slug: 'orthopedics', nameKo: '정형외과', nameEn: 'Orthopedics' },
      { slug: 'neurosurgery', nameKo: '신경외과', nameEn: 'Neurosurgery' },
      { slug: 'urology', nameKo: '비뇨기과', nameEn: 'Urology' },
      { slug: 'cardiology', nameKo: '심장내과', nameEn: 'Cardiology' },
      { slug: 'gastroenterology', nameKo: '소화기내과', nameEn: 'Gastroenterology' },
      { slug: 'psychiatry', nameKo: '정신과', nameEn: 'Psychiatry' },
      { slug: 'plastic-surgery', nameKo: '성형외과', nameEn: 'Plastic Surgery' },
      { slug: 'pain-management', nameKo: '통증의학과', nameEn: 'Pain Management' },
      { slug: 'rehabilitation', nameKo: '재활의학과', nameEn: 'Rehabilitation' },
      { slug: 'general-surgery', nameKo: '외과', nameEn: 'General Surgery' },
      { slug: 'oncology', nameKo: '종양내과', nameEn: 'Oncology' },
      { slug: 'nephrology', nameKo: '신장내과', nameEn: 'Nephrology' },
      { slug: 'pulmonology', nameKo: '호흡기내과', nameEn: 'Pulmonology' },
      { slug: 'endocrinology', nameKo: '내분비내과', nameEn: 'Endocrinology' },
      { slug: 'rheumatology', nameKo: '류마티스내과', nameEn: 'Rheumatology' },
      { slug: 'allergy', nameKo: '알레르기내과', nameEn: 'Allergy' },
      { slug: 'podiatry', nameKo: '족부의학', nameEn: 'Podiatry' },
      { slug: 'diagnostics', nameKo: '진단/검진', nameEn: 'Diagnostics' },
      { slug: 'korean-medicine', nameKo: '한의원', nameEn: 'Korean Medicine' },
      { slug: 'pharmacy', nameKo: '약국', nameEn: 'Pharmacy' },
    ],
  },
  {
    slug: 'dental',
    nameKo: '치과',
    nameEn: 'Dental',
    subcategories: [
      { slug: 'general-dentist', nameKo: '일반치과', nameEn: 'General Dentist' },
      { slug: 'orthodontist', nameKo: '교정치과', nameEn: 'Orthodontist' },
      { slug: 'pediatric-dentist', nameKo: '소아치과', nameEn: 'Pediatric Dentist' },
      { slug: 'dental-implants', nameKo: '임플란트', nameEn: 'Dental Implants' },
      { slug: 'prosthodontist', nameKo: '보철치과', nameEn: 'Prosthodontist' },
      { slug: 'periodontist', nameKo: '치주과', nameEn: 'Periodontist' },
      { slug: 'dental-lab', nameKo: '치과기공소', nameEn: 'Dental Lab' },
    ],
  },
  {
    slug: 'legal',
    nameKo: '법률',
    nameEn: 'Legal',
    subcategories: [
      { slug: 'immigration-lawyer', nameKo: '이민법', nameEn: 'Immigration Lawyer' },
      { slug: 'family-lawyer', nameKo: '가정법', nameEn: 'Family Lawyer' },
      { slug: 'business-lawyer', nameKo: '비즈니스법', nameEn: 'Business Lawyer' },
      { slug: 'criminal-lawyer', nameKo: '형사법', nameEn: 'Criminal Lawyer' },
      { slug: 'personal-injury-lawyer', nameKo: '상해법', nameEn: 'Personal Injury Lawyer' },
      { slug: 'real-estate-lawyer', nameKo: '부동산법', nameEn: 'Real Estate Lawyer' },
      { slug: 'notary', nameKo: '공증', nameEn: 'Notary' },
    ],
  },
  {
    slug: 'insurance',
    nameKo: '보험',
    nameEn: 'Insurance',
    subcategories: [
      { slug: 'health-insurance', nameKo: '건강보험', nameEn: 'Health Insurance' },
      { slug: 'auto-insurance', nameKo: '자동차보험', nameEn: 'Auto Insurance' },
      { slug: 'life-insurance', nameKo: '생명보험', nameEn: 'Life Insurance' },
      { slug: 'business-insurance', nameKo: '비즈니스보험', nameEn: 'Business Insurance' },
      { slug: 'home-insurance', nameKo: '주택보험', nameEn: 'Home Insurance' },
    ],
  },
  {
    slug: 'real-estate',
    nameKo: '부동산',
    nameEn: 'Real Estate',
    subcategories: [
      { slug: 'residential-realtor', nameKo: '주거용부동산', nameEn: 'Residential Realtor' },
      { slug: 'commercial-realtor', nameKo: '상업용부동산', nameEn: 'Commercial Realtor' },
      { slug: 'property-management', nameKo: '부동산관리', nameEn: 'Property Management' },
      { slug: 'escrow', nameKo: '에스크로', nameEn: 'Escrow' },
    ],
  },
  {
    slug: 'financial',
    nameKo: '금융',
    nameEn: 'Financial',
    subcategories: [
      { slug: 'cpa', nameKo: '공인회계사', nameEn: 'CPA' },
      { slug: 'tax-preparer', nameKo: '세무사', nameEn: 'Tax Preparer' },
      { slug: 'mortgage-broker', nameKo: '모기지', nameEn: 'Mortgage Broker' },
      { slug: 'bank', nameKo: '은행', nameEn: 'Bank' },
      { slug: 'financial-advisor', nameKo: '재정상담', nameEn: 'Financial Advisor' },
    ],
  },
  {
    slug: 'food',
    nameKo: '식당',
    nameEn: 'Food & Dining',
    subcategories: [
      { slug: 'korean-bbq', nameKo: '한식BBQ', nameEn: 'Korean BBQ' },
      { slug: 'korean-restaurant', nameKo: '한식', nameEn: 'Korean Restaurant' },
      { slug: 'japanese-restaurant', nameKo: '일식', nameEn: 'Japanese Restaurant' },
      { slug: 'chinese-restaurant', nameKo: '중식', nameEn: 'Chinese Restaurant' },
      { slug: 'western-restaurant', nameKo: '양식', nameEn: 'Western Restaurant' },
      { slug: 'snack-bar', nameKo: '분식', nameEn: 'Snack Bar' },
      { slug: 'bakery', nameKo: '베이커리', nameEn: 'Bakery' },
      { slug: 'cafe', nameKo: '카페', nameEn: 'Cafe' },
      { slug: 'grocery', nameKo: '마켓', nameEn: 'Grocery' },
    ],
  },
  {
    slug: 'beauty',
    nameKo: '뷰티',
    nameEn: 'Beauty',
    subcategories: [
      { slug: 'hair-salon', nameKo: '미용실', nameEn: 'Hair Salon' },
      { slug: 'barbershop', nameKo: '이발소', nameEn: 'Barbershop' },
      { slug: 'skin-care', nameKo: '스킨케어', nameEn: 'Skin Care' },
      { slug: 'spa', nameKo: '스파', nameEn: 'Spa' },
      { slug: 'nail-salon', nameKo: '네일샵', nameEn: 'Nail Salon' },
      { slug: 'cosmetics', nameKo: '화장품', nameEn: 'Cosmetics' },
    ],
  },
  {
    slug: 'auto',
    nameKo: '자동차',
    nameEn: 'Auto Services',
    subcategories: [
      { slug: 'auto-repair', nameKo: '자동차수리', nameEn: 'Auto Repair' },
      { slug: 'body-shop', nameKo: '바디샵', nameEn: 'Body Shop' },
      { slug: 'car-dealer', nameKo: '자동차매매', nameEn: 'Car Dealer' },
      { slug: 'car-wash', nameKo: '세차', nameEn: 'Car Wash' },
      { slug: 'tires', nameKo: '타이어', nameEn: 'Tires' },
      { slug: 'towing', nameKo: '토잉', nameEn: 'Towing' },
      { slug: 'car-rental', nameKo: '렌터카', nameEn: 'Car Rental' },
    ],
  },
  {
    slug: 'home-services',
    nameKo: '주택서비스',
    nameEn: 'Home Services',
    subcategories: [
      { slug: 'plumbing', nameKo: '배관', nameEn: 'Plumbing' },
      { slug: 'hvac', nameKo: '냉난방', nameEn: 'HVAC' },
      { slug: 'roofing', nameKo: '지붕', nameEn: 'Roofing' },
      { slug: 'cleaning', nameKo: '청소', nameEn: 'Cleaning' },
      { slug: 'electrical', nameKo: '전기', nameEn: 'Electrical' },
      { slug: 'landscaping', nameKo: '조경', nameEn: 'Landscaping' },
      { slug: 'moving', nameKo: '이삿짐', nameEn: 'Moving' },
      { slug: 'construction', nameKo: '건축', nameEn: 'Construction' },
      { slug: 'painting', nameKo: '페인트', nameEn: 'Painting' },
      { slug: 'carpet', nameKo: '카펫', nameEn: 'Carpet' },
      { slug: 'locksmith', nameKo: '열쇠', nameEn: 'Locksmith' },
      { slug: 'pest-control', nameKo: '해충방제', nameEn: 'Pest Control' },
    ],
  },
  {
    slug: 'education',
    nameKo: '교육',
    nameEn: 'Education',
    subcategories: [
      { slug: 'tutoring', nameKo: '학원', nameEn: 'Tutoring' },
      { slug: 'language-school', nameKo: '어학원', nameEn: 'Language School' },
      { slug: 'sat-prep', nameKo: 'SAT학원', nameEn: 'SAT Prep' },
      { slug: 'preschool', nameKo: '유치원', nameEn: 'Preschool' },
      { slug: 'driving-school', nameKo: '운전학원', nameEn: 'Driving School' },
      { slug: 'music-school', nameKo: '음악학원', nameEn: 'Music School' },
      { slug: 'martial-arts', nameKo: '태권도', nameEn: 'Martial Arts' },
      { slug: 'dance-school', nameKo: '댄스', nameEn: 'Dance School' },
    ],
  },
  {
    slug: 'travel',
    nameKo: '여행',
    nameEn: 'Travel',
    subcategories: [
      { slug: 'travel-agency', nameKo: '여행사', nameEn: 'Travel Agency' },
      { slug: 'airline', nameKo: '항공사', nameEn: 'Airline' },
      { slug: 'hotel', nameKo: '호텔', nameEn: 'Hotel' },
    ],
  },
  {
    slug: 'professional',
    nameKo: '전문서비스',
    nameEn: 'Professional Services',
    subcategories: [
      { slug: 'printing', nameKo: '인쇄', nameEn: 'Printing' },
      { slug: 'photography', nameKo: '사진', nameEn: 'Photography' },
      { slug: 'translation', nameKo: '번역', nameEn: 'Translation' },
      { slug: 'advertising', nameKo: '광고', nameEn: 'Advertising' },
      { slug: 'signage', nameKo: '간판', nameEn: 'Signage' },
      { slug: 'wedding', nameKo: '웨딩', nameEn: 'Wedding' },
      { slug: 'funeral', nameKo: '장례', nameEn: 'Funeral' },
    ],
  },
  {
    slug: 'shopping',
    nameKo: '쇼핑',
    nameEn: 'Shopping',
    subcategories: [
      { slug: 'electronics', nameKo: '전자제품', nameEn: 'Electronics' },
      { slug: 'furniture', nameKo: '가구', nameEn: 'Furniture' },
      { slug: 'clothing', nameKo: '의류', nameEn: 'Clothing' },
      { slug: 'jewelry', nameKo: '보석', nameEn: 'Jewelry' },
      { slug: 'optical', nameKo: '안경', nameEn: 'Optical' },
      { slug: 'bookstore', nameKo: '서점', nameEn: 'Bookstore' },
      { slug: 'florist', nameKo: '꽃집', nameEn: 'Florist' },
    ],
  },
  {
    slug: 'community',
    nameKo: '커뮤니티',
    nameEn: 'Community',
    subcategories: [
      { slug: 'church', nameKo: '교회', nameEn: 'Church' },
      { slug: 'temple', nameKo: '사찰', nameEn: 'Temple' },
      { slug: 'organization', nameKo: '단체', nameEn: 'Organization' },
      { slug: 'senior-center', nameKo: '양로원', nameEn: 'Senior Center' },
      { slug: 'media', nameKo: '언론', nameEn: 'Media' },
    ],
  },
];

// Get all categories as flat list
export function getAllCategories(): { slug: string; nameKo: string; nameEn: string; level: string; parentSlug?: string }[] {
  const result: { slug: string; nameKo: string; nameEn: string; level: string; parentSlug?: string }[] = [];

  for (const primary of PRIMARY_CATEGORIES) {
    result.push({
      slug: primary.slug,
      nameKo: primary.nameKo,
      nameEn: primary.nameEn,
      level: 'primary',
    });

    for (const sub of primary.subcategories) {
      result.push({
        slug: sub.slug,
        nameKo: sub.nameKo,
        nameEn: sub.nameEn,
        level: 'sub',
        parentSlug: primary.slug,
      });
    }
  }

  return result;
}

// Get primary category by slug
export function getPrimaryCategory(slug: string): PrimaryCategory | undefined {
  return PRIMARY_CATEGORIES.find(c => c.slug === slug);
}

// Get subcategory by slug
export function getSubcategory(slug: string): { subcategory: SubCategory; primary: PrimaryCategory } | undefined {
  for (const primary of PRIMARY_CATEGORIES) {
    const sub = primary.subcategories.find(s => s.slug === slug);
    if (sub) {
      return { subcategory: sub, primary };
    }
  }
  return undefined;
}

// Check if a slug is a primary category
export function isPrimaryCategory(slug: string): boolean {
  return PRIMARY_CATEGORIES.some(c => c.slug === slug);
}

// Check if a slug is a subcategory
export function isSubcategory(slug: string): boolean {
  return PRIMARY_CATEGORIES.some(p => p.subcategories.some(s => s.slug === slug));
}
