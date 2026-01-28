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
      <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
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
 * Generate category-specific FAQs
 */
export function generateCategoryFAQs(params: {
  categoryNameEn: string;
  categoryNameKo: string;
  city: string;
  state: string;
  count: number;
}): FAQItem[] {
  const { categoryNameEn, categoryNameKo, city, state, count } = params;
  const cityDisplay = toTitleCase(city);
  const stateDisplay = state.toUpperCase();

  return [
    {
      question: `How many Korean ${categoryNameEn.toLowerCase()} are in ${cityDisplay}?`,
      answer: `There are ${count} Korean-speaking ${categoryNameEn.toLowerCase()} businesses listed in ${cityDisplay}, ${stateDisplay}. Our directory is updated regularly to include new listings.`,
    },
    {
      question: `Do these ${categoryNameEn.toLowerCase()} speak Korean?`,
      answer: `Yes, all ${categoryNameEn.toLowerCase()} (${categoryNameKo}) listed in our directory serve the Korean-speaking community. Many staff members are fluent in Korean.`,
    },
    {
      question: `How do I contact a ${categoryNameEn.toLowerCase()} from this list?`,
      answer: `Click on any listing to see their full contact information including phone number and address. You can call directly by clicking the "Call" button on mobile devices.`,
    },
    {
      question: `Are these listings verified?`,
      answer: `Our listings are sourced from multiple Korean community directories and verified where possible with Google Places data. We display ratings and reviews when available.`,
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
