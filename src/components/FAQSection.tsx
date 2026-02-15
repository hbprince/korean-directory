import { UI_LABELS } from '@/lib/i18n/labels';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs.length) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-semibold mb-6">
        {UI_LABELS.frequentlyAskedQuestions.ko} ({UI_LABELS.frequentlyAskedQuestions.en})
      </h2>
      <dl className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx}>
            <dt className="text-base font-medium text-gray-900">{faq.question}</dt>
            <dd className="mt-2 text-sm text-gray-600">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// Category-specific FAQ questions (unique per category to avoid duplicate content)
const CATEGORY_SPECIFIC_FAQS: Record<string, (cityKo: string, cityDisplay: string) => FAQItem[]> = {
  medical: (cityKo, cityDisplay) => [
    {
      question: `${cityKo} 한인 병원에서 보험 상담이 가능한가요?`,
      answer: `대부분의 ${cityKo} 한인 병원은 주요 보험을 취급하며, 한국어로 보험 관련 상담을 받을 수 있습니다. 방문 전 전화로 본인의 보험 적용 여부를 확인하시는 것을 권장합니다.`,
    },
    {
      question: `한국어로 진료 상담이 가능한 의사를 어떻게 찾나요?`,
      answer: `한인맵에서 ${cityKo} 지역의 한인 병원 목록을 확인하세요. 모든 등록 업체는 한국어 상담이 가능하며, 평점과 리뷰를 참고하여 선택할 수 있습니다.`,
    },
  ],
  dental: (cityKo, cityDisplay) => [
    {
      question: `${cityKo}에서 한국어가 통하는 치과를 찾으려면?`,
      answer: `한인맵에서 ${cityKo} 한인 치과 목록을 확인하세요. 임플란트, 교정, 일반 치료 등 한국어로 상세한 설명을 들을 수 있는 치과를 찾을 수 있습니다.`,
    },
    {
      question: `한인 치과에서 보험 처리가 되나요?`,
      answer: `대부분의 한인 치과는 PPO, HMO 등 주요 치과 보험을 취급합니다. 보험 미가입자를 위한 할인 프로그램을 운영하는 치과도 있으니 직접 문의하세요.`,
    },
  ],
  legal: (cityKo, cityDisplay) => [
    {
      question: `${cityKo}에서 한국어 상담 가능한 변호사는 어디서 찾나요?`,
      answer: `한인맵에서 ${cityKo} 한인 변호사 목록을 확인하세요. 이민법, 사업법, 가정법, 형사법 등 전문 분야별로 한국어 상담이 가능한 변호사를 찾을 수 있습니다.`,
    },
    {
      question: `이민 관련 법률 상담은 어떤 변호사에게 받아야 하나요?`,
      answer: `이민법 전문 한인 변호사에게 상담하시면 비자, 영주권, 시민권 신청 등의 절차를 한국어로 정확하게 안내받을 수 있습니다. 한인맵에서 전문 분야를 확인하세요.`,
    },
  ],
  food: (cityKo, cityDisplay) => [
    {
      question: `${cityKo}에서 맛있는 한식당을 어떻게 찾나요?`,
      answer: `한인맵에서 ${cityKo} 한인 식당 목록을 확인하세요. Google 평점과 리뷰 수를 기반으로 정렬되어 인기 있는 식당을 쉽게 찾을 수 있습니다.`,
    },
    {
      question: `${cityKo} 근처 한국 식재료를 살 수 있는 곳은?`,
      answer: `한인맵의 식품/쇼핑 카테고리에서 한인 마트와 식품점을 찾을 수 있습니다. 한국 식재료, 반찬, 냉동식품 등을 구매할 수 있는 매장을 확인하세요.`,
    },
  ],
  insurance: (cityKo, cityDisplay) => [
    {
      question: `${cityKo}에서 한국어로 보험 상담 받을 수 있는 곳은?`,
      answer: `한인맵에서 ${cityKo} 한인 보험 에이전트 목록을 확인하세요. 건강보험, 자동차보험, 생명보험, 사업자보험 등 다양한 보험을 한국어로 상담받을 수 있습니다.`,
    },
    {
      question: `미국 보험이 처음인데 어떤 보험부터 알아봐야 하나요?`,
      answer: `건강보험과 자동차보험이 가장 기본입니다. 한인 보험 에이전트는 미국 보험 제도를 한국어로 쉽게 설명해 드리며, 본인 상황에 맞는 최적의 플랜을 추천합니다.`,
    },
  ],
  'real-estate': (cityKo, cityDisplay) => [
    {
      question: `${cityKo}에서 한인 부동산 에이전트를 찾으려면?`,
      answer: `한인맵에서 ${cityKo} 한인 부동산 목록을 확인하세요. 매매, 임대, 투자 등 한국어로 상담 가능한 부동산 에이전트가 등록되어 있습니다.`,
    },
    {
      question: `한인이 많이 사는 동네는 어디인가요?`,
      answer: `한인 부동산 에이전트는 한인 커뮤니티가 밀집한 지역에 대한 깊은 이해를 가지고 있습니다. 학군, 생활 편의시설, 한인 마트 접근성 등을 고려한 추천을 받을 수 있습니다.`,
    },
  ],
};

/**
 * Generate category-specific FAQs (bilingual)
 */
export function generateCategoryFAQs(params: {
  categoryNameEn: string;
  categoryNameKo: string;
  city: string;
  cityKo: string;
  state: string;
  count: number;
}): FAQItem[] {
  const { categoryNameEn, categoryNameKo, city, cityKo, state, count } = params;
  const cityDisplay = toTitleCase(city);
  const stateDisplay = state.toUpperCase();
  const catKey = categoryNameEn.toLowerCase().replace(/\s+/g, '-');

  // Category-specific FAQs (unique per category)
  const specificFaqs = CATEGORY_SPECIFIC_FAQS[catKey]?.(cityKo, cityDisplay) || [];

  // Common FAQs (always included)
  const commonFaqs: FAQItem[] = [
    {
      question: `${cityKo}에 한인 ${categoryNameKo}가 몇 곳 있나요?`,
      answer: `${cityKo}(${cityDisplay}, ${stateDisplay})에 ${count}곳의 한인 ${categoryNameKo}가 한인맵에 등록되어 있습니다. 평점, 리뷰 수, 신뢰도 점수를 기준으로 정렬하여 확인할 수 있습니다.`,
    },
    {
      question: `한인맵의 업체 정보는 어떻게 검증되나요?`,
      answer: `한인맵은 여러 한인 커뮤니티 디렉토리에서 수집한 정보를 Google Places 데이터로 교차 검증합니다. 전화번호, 주소, 영업시간, 평점이 최신 상태인지 주기적으로 업데이트합니다.`,
    },
  ];

  return [...specificFaqs, ...commonFaqs];
}

/**
 * Generate business-specific FAQs
 */
export function generateBusinessFAQs(params: {
  businessName: string;
  categoryNameEn: string;
  city: string;
  hasHours: boolean;
  hasRating: boolean;
}): FAQItem[] {
  const { businessName, categoryNameEn, city, hasHours, hasRating } = params;
  const cityDisplay = toTitleCase(city);

  const faqs: FAQItem[] = [
    {
      question: `Where is ${businessName} located?`,
      answer: `${businessName} is located in ${cityDisplay}. See the address above for exact location and directions.`,
    },
    {
      question: `Does ${businessName} serve Korean-speaking customers?`,
      answer: `Yes, ${businessName} is listed in the Korean ${categoryNameEn.toLowerCase()} directory and serves the Korean-speaking community in ${cityDisplay}.`,
    },
  ];

  if (hasHours) {
    faqs.push({
      question: `What are the hours for ${businessName}?`,
      answer: `Check the hours section above for current business hours. We recommend calling ahead to confirm hours on holidays.`,
    });
  }

  if (hasRating) {
    faqs.push({
      question: `What do customers say about ${businessName}?`,
      answer: `See the rating above based on Google reviews. Click through to Google Maps for detailed customer reviews.`,
    });
  }

  return faqs;
}

function toTitleCase(str: string): string {
  return str
    .replace(/-/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
