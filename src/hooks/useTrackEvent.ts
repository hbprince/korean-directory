'use client';

import { useCallback } from 'react';

type EventType = 'view' | 'phone_click' | 'website_click' | 'guide_click';

function getSessionKey(businessId: string, eventType: EventType): string {
  return `track:${businessId}:${eventType}`;
}

function isDuplicate(businessId: string, eventType: EventType): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return sessionStorage.getItem(getSessionKey(businessId, eventType)) === '1';
  } catch {
    // sessionStorage may be unavailable (e.g. private browsing in some browsers)
    return false;
  }
}

function markSent(businessId: string, eventType: EventType): void {
  try {
    sessionStorage.setItem(getSessionKey(businessId, eventType), '1');
  } catch {
    // Silently ignore storage errors
  }
}

export function useTrackEvent() {
  const trackEvent = useCallback(
    (businessId: string, eventType: EventType) => {
      if (isDuplicate(businessId, eventType)) return;

      const payload = JSON.stringify({ businessId, eventType });

      // Use sendBeacon for reliability (survives page navigation/close)
      const sent =
        typeof navigator !== 'undefined' &&
        typeof navigator.sendBeacon === 'function' &&
        navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));

      // Fallback to fetch if sendBeacon is unavailable or fails
      if (!sent) {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // Silently ignore tracking failures
        });
      }

      markSent(businessId, eventType);
    },
    []
  );

  return { trackEvent };
}
