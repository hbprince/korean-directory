/**
 * Google Analytics 4 Helper Functions
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-05ZHHTXMZF';

// Check if gtag is available
function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

// Generic event tracking
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (!isGtagAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[GA4 Dev] Event: ${eventName}`, params);
    }
    return;
  }

  window.gtag!('event', eventName, params);

  if (process.env.NODE_ENV === 'development') {
    console.info(`[GA4] Event: ${eventName}`, params);
  }
}

// Track page view
export function trackPageView(url: string) {
  if (!isGtagAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[GA4 Dev] page_view: ${url}`);
    }
    return;
  }

  window.gtag!('event', 'page_view', {
    page_path: url,
  });

  if (process.env.NODE_ENV === 'development') {
    console.info(`[GA4] page_view: ${url}`);
  }
}

// Track call click
export function trackCallClick(params: {
  phone?: string;
  businessId?: number | string;
  businessName?: string;
  city?: string;
  category?: string;
}) {
  trackEvent('click_call', {
    phone_number: params.phone,
    business_id: params.businessId,
    business_name: params.businessName,
    city: params.city,
    category: params.category,
  });
}

// Track directions click
export function trackDirectionsClick(params: {
  businessId?: number | string;
  businessName?: string;
  city?: string;
  category?: string;
  destination?: string;
}) {
  trackEvent('click_directions', {
    business_id: params.businessId,
    business_name: params.businessName,
    city: params.city,
    category: params.category,
    destination: params.destination,
  });
}
