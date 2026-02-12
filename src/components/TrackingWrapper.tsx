'use client';

import { useEffect } from 'react';
import { useTrackEvent } from '@/hooks/useTrackEvent';

interface TrackingWrapperProps {
  businessId: string;
  phone?: string | null;
  phoneDisplay?: string | null;
  phoneLabel?: string;
  website?: string | null;
  websiteLabel?: string;
  children: React.ReactNode;
}

export function TrackingWrapper({
  businessId,
  phone,
  phoneDisplay,
  phoneLabel,
  website,
  websiteLabel,
  children,
}: TrackingWrapperProps) {
  const { trackEvent } = useTrackEvent();

  // Auto-track "view" on mount
  useEffect(() => {
    trackEvent(businessId, 'view');
  }, [businessId, trackEvent]);

  const handlePhoneClick = () => {
    trackEvent(businessId, 'phone_click');
  };

  const handleWebsiteClick = () => {
    trackEvent(businessId, 'website_click');
  };

  return (
    <>
      {children}

      {phone && (
        <div>
          {phoneLabel && (
            <dt className="text-sm text-gray-500">{phoneLabel}</dt>
          )}
          <dd>
            <a
              href={`tel:${phone}`}
              onClick={handlePhoneClick}
              className="text-blue-600 hover:text-blue-800"
            >
              {phoneDisplay || phone}
            </a>
          </dd>
        </div>
      )}

      {website && (
        <div>
          {websiteLabel && (
            <dt className="text-sm text-gray-500">{websiteLabel}</dt>
          )}
          <dd>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWebsiteClick}
              className="text-blue-600 hover:text-blue-800"
            >
              {(() => {
                try {
                  return new URL(website).hostname;
                } catch {
                  return website;
                }
              })()}
            </a>
          </dd>
        </div>
      )}
    </>
  );
}
