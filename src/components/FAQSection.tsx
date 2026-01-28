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

  return [
    {
      question: `${cityKo}에 한인 ${categoryNameKo}가 몇 곳 있나요? (How many Korean ${categoryNameEn.toLowerCase()} are in ${cityDisplay}?)`,
      answer: `${cityKo}(${cityDisplay}, ${stateDisplay})에 ${count}곳의 한인 ${categoryNameKo}(${categoryNameEn.toLowerCase()})가 등록되어 있습니다. There are ${count} Korean-speaking ${categoryNameEn.toLowerCase()} businesses listed.`,
    },
    {
      question: `한국어 상담이 가능한가요? (Do they speak Korean?)`,
      answer: `네, 이 디렉토리에 등록된 모든 ${categoryNameKo}(${categoryNameEn.toLowerCase()})는 한인 커뮤니티를 위한 서비스를 제공합니다. Yes, all listings serve the Korean-speaking community.`,
    },
    {
      question: `어떻게 연락할 수 있나요? (How do I contact them?)`,
      answer: `각 업체를 클릭하면 전화번호와 주소를 확인할 수 있습니다. 모바일에서는 "전화" 버튼을 눌러 바로 통화할 수 있습니다. Click any listing to see contact info. On mobile, tap "Call" to dial directly.`,
    },
    {
      question: `정보가 정확한가요? (Are these listings verified?)`,
      answer: `여러 한인 커뮤니티 디렉토리에서 수집한 정보이며, Google Places 데이터로 검증합니다. 가능한 경우 평점과 리뷰를 표시합니다. Listings are sourced from Korean community directories and verified with Google Places data.`,
    },
  ];
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
