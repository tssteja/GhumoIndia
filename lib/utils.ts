/**
 * Generate a URL-friendly slug from a temple name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Calculate the Haversine distance between two coordinates in kilometers
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate relevance score based on how many keywords from the temple name
 * appear in the video title.
 */
export function calculateRelevanceScore(
  title: string,
  templeName: string,
  city?: string,
  state?: string,
  description?: string
): number {
  const titleLower = title.toLowerCase();
  const descLower = (description || '').toLowerCase();
  const templeLower = templeName.toLowerCase();

  // Step 3: Extract keywords from temple name
  const commonWords = new Set(['temple', 'mandir', 'devalayam', 'sri', 'shree', 'swamy', 'trust', 'of', 'and', 'the', 'in']);
  const keywords = templeLower
    .replace(/[,.-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word));

  // Must have at least one keyword in title or description
  const hasKeyword = keywords.some(kw => titleLower.includes(kw) || descLower.includes(kw));
  if (!hasKeyword) return 0;

  // Step 4: Remove videos that contain other major locations
  const otherLocations = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'kerala', 'tamil nadu', 'karnataka', 'maharashtra']
    .filter(loc => loc !== city?.toLowerCase() && loc !== state?.toLowerCase());
  
  if (otherLocations.some(loc => titleLower.includes(loc))) {
    return 0;
  }

  // Scoring
  let score = 0;

  // Boost for exact name match
  if (titleLower.includes(templeLower)) score += 5;

  // Keyword match density
  const matchedKeywords = keywords.filter(kw => titleLower.includes(kw)).length;
  score += matchedKeywords * 2;

  // Location boost
  if (city && titleLower.includes(city.toLowerCase())) score += 2;
  if (state && titleLower.includes(state.toLowerCase())) score += 1;

  return score;
}

/**
 * Calculate YouTube video popularity score with relevance boost
 * Formula: (log10(views) * 10 + log10(likes) * 5) * relevance * recency
 */
export function calculateVideoScore(
  viewCount: number,
  likeCount: number,
  commentCount: number,
  publishedAt: string,
  relevanceMultiplier: number = 1.0
): number {
  if (relevanceMultiplier === 0) return 0;

  // views + relevance + recency
  const viewsScore = Math.log10(Math.max(viewCount, 1)) * 2;
  
  // Recency boost (last 2 years)
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  const publishDate = new Date(publishedAt);
  const recencyBoost = publishDate > twoYearsAgo ? 5 : 0;

  return relevanceMultiplier + viewsScore + recencyBoost;
}

/**
 * Format large numbers for display (e.g., 1500000 -> "1.5M")
 */
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}

/**
 * Truncate text to a certain length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
