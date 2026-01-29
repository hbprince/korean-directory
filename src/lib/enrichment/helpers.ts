/**
 * Helper functions for enrichment data
 */

interface OpeningHoursPeriod {
  open: { day: number; time: string };
  close: { day: number; time: string };
}

interface OpeningHoursJson {
  periods?: OpeningHoursPeriod[];
  open_now?: boolean;
  weekday_text?: string[];
}

interface PhotoJson {
  url: string;
  width: number;
  height: number;
  html_attributions?: string[];
}

/**
 * Compute if business is currently open based on opening hours
 * Uses LA timezone (Pacific Time)
 */
export function computeOpenNow(openingHoursJson: unknown): boolean | null {
  if (!openingHoursJson || typeof openingHoursJson !== 'object') {
    return null;
  }

  const hours = openingHoursJson as OpeningHoursJson;

  // If open_now is directly available, use it
  if (typeof hours.open_now === 'boolean') {
    return hours.open_now;
  }

  // Otherwise compute from periods
  if (!hours.periods || !Array.isArray(hours.periods) || hours.periods.length === 0) {
    return null;
  }

  try {
    // Get current time in LA timezone
    const now = new Date();
    const laTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    );
    const currentDay = laTime.getDay(); // 0 = Sunday
    const currentTime = laTime.getHours() * 100 + laTime.getMinutes();

    // Find today's periods
    for (const period of hours.periods) {
      if (period.open.day === currentDay) {
        const openTime = parseInt(period.open.time, 10);
        const closeTime = parseInt(period.close.time, 10);

        // Handle overnight hours (close time < open time means it closes next day)
        if (closeTime < openTime) {
          // Open until closing time next day
          if (currentTime >= openTime || currentTime < closeTime) {
            return true;
          }
        } else {
          if (currentTime >= openTime && currentTime < closeTime) {
            return true;
          }
        }
      }

      // Check if we're in an overnight period from yesterday
      const yesterday = (currentDay + 6) % 7;
      if (period.open.day === yesterday) {
        const openTime = parseInt(period.open.time, 10);
        const closeTime = parseInt(period.close.time, 10);

        if (closeTime < openTime && currentTime < closeTime) {
          return true;
        }
      }
    }

    return false;
  } catch {
    return null;
  }
}

/**
 * Get the first photo URL from photos JSON
 */
export function getFirstPhotoUrl(photosJson: unknown): string | null {
  if (!photosJson || !Array.isArray(photosJson) || photosJson.length === 0) {
    return null;
  }

  const photos = photosJson as PhotoJson[];
  const firstPhoto = photos[0];

  if (firstPhoto && firstPhoto.url) {
    return firstPhoto.url;
  }

  return null;
}

/**
 * Format weekday text for display
 */
export function formatOpeningHours(openingHoursJson: unknown): string[] | null {
  if (!openingHoursJson || typeof openingHoursJson !== 'object') {
    return null;
  }

  const hours = openingHoursJson as OpeningHoursJson;

  if (hours.weekday_text && Array.isArray(hours.weekday_text)) {
    return hours.weekday_text;
  }

  return null;
}

/**
 * Get today's hours string
 */
export function getTodayHours(openingHoursJson: unknown): string | null {
  const weekdayText = formatOpeningHours(openingHoursJson);
  if (!weekdayText || weekdayText.length === 0) {
    return null;
  }

  const now = new Date();
  const laTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  );
  const dayIndex = laTime.getDay();

  // weekday_text is typically Mon-Sun (0-6), but getDay returns 0 for Sunday
  // Convert: Sunday (0) -> index 6, Monday (1) -> index 0, etc.
  const textIndex = dayIndex === 0 ? 6 : dayIndex - 1;

  return weekdayText[textIndex] || null;
}
