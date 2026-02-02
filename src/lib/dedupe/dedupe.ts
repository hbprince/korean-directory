// Deduplication utilities

/**
 * Jaro-Winkler similarity score (0 to 1)
 * Higher = more similar
 */
export function jaroWinklerSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;

  const str1 = s1.toLowerCase();
  const str2 = s2.toLowerCase();

  const len1 = str1.length;
  const len2 = str2.length;

  // Calculate match window
  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
  if (matchWindow < 0) return 0;

  const matches1: boolean[] = new Array(len1).fill(false);
  const matches2: boolean[] = new Array(len2).fill(false);

  let matches = 0;
  let transpositions = 0;

  // Find matches
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, len2);

    for (let j = start; j < end; j++) {
      if (matches2[j] || str1[i] !== str2[j]) continue;
      matches1[i] = true;
      matches2[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  // Count transpositions
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!matches1[i]) continue;
    while (!matches2[k]) k++;
    if (str1[i] !== str2[k]) transpositions++;
    k++;
  }

  // Jaro similarity
  const jaro = (
    matches / len1 +
    matches / len2 +
    (matches - transpositions / 2) / matches
  ) / 3;

  // Calculate common prefix (up to 4 chars)
  let prefix = 0;
  for (let i = 0; i < Math.min(4, len1, len2); i++) {
    if (str1[i] === str2[i]) prefix++;
    else break;
  }

  // Jaro-Winkler (with scaling factor 0.1)
  return jaro + prefix * 0.1 * (1 - jaro);
}

/**
 * Check if two phone numbers match (E.164 format)
 */
export function phonesMatch(phone1: string | null, phone2: string | null): boolean {
  if (!phone1 || !phone2) return false;
  return phone1 === phone2;
}

/**
 * Check if two addresses are similar enough to be the same
 */
export function addressesSimilar(addr1: string, addr2: string, threshold = 0.85): boolean {
  if (!addr1 || !addr2) return false;

  // Extract street number for quick check
  const num1 = addr1.match(/^\d+/)?.[0];
  const num2 = addr2.match(/^\d+/)?.[0];

  // If street numbers don't match, addresses are different
  if (num1 && num2 && num1 !== num2) return false;

  return jaroWinklerSimilarity(addr1, addr2) >= threshold;
}

/**
 * Check if two business names are similar
 */
export function namesSimilar(name1: string, name2: string, threshold = 0.9): boolean {
  if (!name1 || !name2) return false;
  return jaroWinklerSimilarity(name1, name2) >= threshold;
}

export interface SourceKey {
  source:
    | 'radiokorea'
    | 'koreadaily'
    | 'koreatimes-ca'
    | 'bd-cktimes'
    | 'vanchosun'
    | 'missycanada'
    | 'ikoreatown-au'
    | 'woorimelbourne'
    | 'kcmweekly'
    | 'mokorea';
  uid: string;
}

/**
 * Merge source keys from two records
 */
export function mergeSourceKeys(keys1: SourceKey[], keys2: SourceKey[]): SourceKey[] {
  const seen = new Set<string>();
  const result: SourceKey[] = [];

  for (const key of [...keys1, ...keys2]) {
    const id = `${key.source}:${key.uid}`;
    if (!seen.has(id)) {
      seen.add(id);
      result.push(key);
    }
  }

  return result;
}

/**
 * Calculate quality score for a business record
 * Higher score = more complete/reliable data
 */
export function calculateQualityScore(record: {
  nameEn?: string | null;
  phoneE164?: string | null;
  addressNorm?: string | null;
  lat?: number | null;
  lng?: number | null;
  zip?: string | null;
  sourceKeys: SourceKey[];
}): number {
  let score = 0;

  // Name completeness
  if (record.nameEn) score += 10;

  // Phone normalized
  if (record.phoneE164) score += 20;

  // Address normalized
  if (record.addressNorm) score += 15;

  // Has coordinates
  if (record.lat && record.lng) score += 25;

  // Has zip code
  if (record.zip) score += 10;

  // Multiple sources (more trustworthy)
  if (record.sourceKeys.length > 1) score += 20;

  return score;
}

export interface DedupeMatch {
  clusterId: number;
  confidence: 'high' | 'medium' | 'low';
  matchReason: string;
}

/**
 * Find potential duplicate based on matching criteria
 */
export function findPotentialMatch(
  newRecord: {
    nameKo: string;
    nameEn?: string | null;
    phoneE164?: string | null;
    addressNorm?: string | null;
    zip?: string | null;
  },
  existingRecords: Array<{
    id: number;
    nameKo: string;
    nameEn: string | null;
    phoneE164: string | null;
    addressNorm: string | null;
    zip: string | null;
    dedupeClusterId: number | null;
  }>
): DedupeMatch | null {
  for (const existing of existingRecords) {
    // 1. Exact phone match (strongest signal)
    if (newRecord.phoneE164 && phonesMatch(newRecord.phoneE164, existing.phoneE164)) {
      return {
        clusterId: existing.dedupeClusterId || existing.id,
        confidence: 'high',
        matchReason: 'phone_match',
      };
    }

    // 2. Address + Name match
    if (
      newRecord.addressNorm &&
      existing.addressNorm &&
      addressesSimilar(newRecord.addressNorm, existing.addressNorm)
    ) {
      // Check Korean name similarity
      if (namesSimilar(newRecord.nameKo, existing.nameKo)) {
        return {
          clusterId: existing.dedupeClusterId || existing.id,
          confidence: 'high',
          matchReason: 'address_name_match',
        };
      }

      // Check English name similarity
      if (newRecord.nameEn && existing.nameEn && namesSimilar(newRecord.nameEn, existing.nameEn)) {
        return {
          clusterId: existing.dedupeClusterId || existing.id,
          confidence: 'medium',
          matchReason: 'address_name_en_match',
        };
      }
    }

    // 3. Name + Zip match (weaker signal)
    if (
      newRecord.zip &&
      existing.zip &&
      newRecord.zip === existing.zip &&
      newRecord.nameEn &&
      existing.nameEn &&
      namesSimilar(newRecord.nameEn, existing.nameEn, 0.95)
    ) {
      return {
        clusterId: existing.dedupeClusterId || existing.id,
        confidence: 'low',
        matchReason: 'name_zip_match',
      };
    }
  }

  return null;
}
