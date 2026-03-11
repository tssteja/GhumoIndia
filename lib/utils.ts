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
  templeName: string
): number {
  const titleLower = title.toLowerCase();
  const templeLower = templeName.toLowerCase();

  // Perfect match boost
  if (titleLower.includes(templeLower)) {
    return 2.0;
  }

  // Check for individual keywords (filtering out common words)
  const commonWords = new Set(['temple', 'mandir', 'devalayam', 'of', 'and', 'the', 'sri', 'shree']);
  const keywords = templeLower
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word));

  if (keywords.length === 0) return 1.0;

  let matches = 0;
  for (const keyword of keywords) {
    if (titleLower.includes(keyword)) {
      matches++;
    }
  }

  // Return a multiplier based on matches
  // If at least half of the keywords match, give a boost
  if (matches >= keywords.length / 2) {
    return 1.2 + (matches / keywords.length) * 0.3;
  }

  return 0.8 + (matches / keywords.length) * 0.2;
}

/**
 * Calculate YouTube video popularity score with relevance boost
 * Formula: ((viewCount * 0.6) + (likeCount * 0.3) + (commentCount * 0.1)) * relevance * recency
 */
export function calculateVideoScore(
  viewCount: number,
  likeCount: number,
  commentCount: number,
  publishedAt: string,
  relevanceMultiplier: number = 1.0
): number {
  let score = viewCount * 0.6 + likeCount * 0.3 + commentCount * 0.1;

  // Recency boost
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const publishDate = new Date(publishedAt);

  if (publishDate > sixMonthsAgo) {
    score *= 1.2;
  }

  // Relevance boost
  score *= relevanceMultiplier;

  return Math.round(score);
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
