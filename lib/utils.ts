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
/**
 * Calculate relevance score based on how many keywords from the temple name
 * and location appear in the video title.
 */
export function calculateRelevanceScore(
  title: string,
  templeName: string,
  city?: string,
  state?: string
): number {
  const titleLower = title.toLowerCase();
  const templeLower = templeName.toLowerCase();
  const cityLower = city?.toLowerCase();
  const stateLower = state?.toLowerCase();

  // Perfect match boost
  if (titleLower.includes(templeLower)) {
    return 5.0; // Massive boost for exact name match
  }

  // Check for individual keywords (filtering out common words)
  const commonWords = new Set(['temple', 'mandir', 'devalayam', 'of', 'and', 'the', 'sri', 'shree', 'visit', 'tour', 'travel']);
  const keywords = templeLower
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word));

  let matches = 0;
  for (const keyword of keywords) {
    if (titleLower.includes(keyword)) {
      matches++;
    }
  }

  // Location boost
  let locationBoost = 1.0;
  if (cityLower && titleLower.includes(cityLower)) {
    locationBoost += 1.0;
  }
  if (stateLower && titleLower.includes(stateLower)) {
    locationBoost += 0.5;
  }

  // If NO unique keywords match and it's not a perfect match, it's probably irrelevant
  if (matches === 0 && keywords.length > 0) {
    return 0.1; // Penalize heavily
  }

  // Calculate base relevance
  const keywordRatio = keywords.length > 0 ? matches / keywords.length : 1.0;
  let relevance = 1.0 + keywordRatio * 2.0;

  return relevance * locationBoost;
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
  // Use log scale for view counts to prevent viral videos from dominating
  const vScore = Math.log10(Math.max(viewCount, 1)) * 10;
  const lScore = Math.log10(Math.max(likeCount, 1)) * 5;
  
  let score = vScore + lScore;

  // Recency boost (last 1 year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const publishDate = new Date(publishedAt);

  if (publishDate > oneYearAgo) {
    score *= 1.5;
  }

  // Relevance boost is the most important factor
  score *= relevanceMultiplier;

  return Math.round(score * 100); // Scale up for integer storage
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
