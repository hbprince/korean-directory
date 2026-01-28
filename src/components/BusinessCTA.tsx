'use client';

import { trackCallClick, trackDirectionsClick } from '@/lib/analytics/ga';
import { UI_LABELS } from '@/lib/i18n/labels';

interface BusinessCTAProps {
  businessId: number;
  businessName: string;
  phone?: string | null;
  phoneE164?: string | null;
  address: string;
  city: string;
  category: string;
}

export function BusinessCTA({
  businessId,
  businessName,
  phone,
  phoneE164,
  address,
  city,
  category,
}: BusinessCTAProps) {
  const handleCallClick = () => {
    trackCallClick({
      phone: phoneE164 || phone || undefined,
      businessId,
      businessName,
      city,
      category,
    });
  };

  const handleDirectionsClick = () => {
    trackDirectionsClick({
      businessId,
      businessName,
      city,
      category,
      destination: address,
    });
  };

  return (
    <div className="flex gap-4 mb-8">
      {phone && (
        <a
          href={`tel:${phoneE164 || phone}`}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleCallClick}
        >
          📞 {UI_LABELS.call.ko} ({UI_LABELS.call.en})
        </a>
      )}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        onClick={handleDirectionsClick}
      >
        🚗 {UI_LABELS.directions.ko} ({UI_LABELS.directions.en})
      </a>
    </div>
  );
}
