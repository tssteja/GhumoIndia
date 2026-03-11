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
 * Calculate relevance score based on temple name and location matches.
 * Strict Filtering: Reject if location (city/state) doesn't match.
 * Scoring: +5 Name in Title, +3 City in Title, +2 Name in Desc, +1 Views > 100k
 */
export function calculateRelevanceScore(
  title: string,
  templeName: string,
  city?: string,
  state?: string,
  description?: string,
  viewCount: number = 0
): number {
  const titleLower = title.toLowerCase();
  const descLower = (description || '').toLowerCase();
  const templeLower = templeName.toLowerCase();
  const cityLower = city?.toLowerCase() || '';
  const stateLower = state?.toLowerCase() || '';

  // Extract core keywords from temple name (words > 2 chars, excluding common terms)
  const commonWords = new Set(['temple', 'mandir', 'devalayam', 'sri', 'shree', 'swamy', 'trust', 'of', 'and', 'the', 'in', 'india']);
  const templeKeywords = templeLower
    .replace(/[,.-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word));

  // Extract location keywords
  const locationKeywords = [cityLower, stateLower].filter(loc => loc.length > 2);
  
  // Rule: Must match AT LEAST one temple keyword AND (City OR State)
  const hasTempleMatch = templeKeywords.some(kw => titleLower.includes(kw) || descLower.includes(kw));
  const hasLocationMatch = locationKeywords.length === 0 || locationKeywords.some(loc => titleLower.includes(loc) || descLower.includes(loc));

  // Strict Rejection: If it mentions ANOTHER major city that is not our city, reject it
  const majorCities = ['jaipur', 'mumbai', 'delhi', 'kolkata', 'chennai', 'bangalore', 'pune', 'hyderabad', 'tirupati', 'goa', 'hampi']
    .filter(c => c !== cityLower);
  
  if (majorCities.some(c => titleLower.includes(c))) {
    return 0;
  }

  // Reject if critical matches are missing
  if (!hasTempleMatch || !hasLocationMatch) return 0;

  // Scoring Logic
  let score = 0;

  // +5 if temple name appears in title
  if (titleLower.includes(templeLower)) score += 5;
  
  // +3 if city appears in title
  if (cityLower && titleLower.includes(cityLower)) score += 3;

  // +2 if temple name appears in description
  if (descLower.includes(templeLower)) score += 2;

  // +1 if viewCount > 100k
  if (viewCount > 100000) score += 1;

  return score;
}

/**
 * YouTube video score wrapper - adds tiny recency boost for ties
 */
export function calculateVideoScore(
  viewCount: number,
  likeCount: number,
  commentCount: number,
  publishedAt: string,
  relevanceScore: number = 0
): number {
  if (relevanceScore === 0) return 0;
  
  // Base is the relevanceScore
  const publishDate = new Date(publishedAt).getTime();
  const ageInDays = (Date.now() - publishDate) / (1000 * 60 * 60 * 24);
  const recencyWeight = Math.max(0, 1 - (ageInDays / 3650)); // 10 years decay

  return relevanceScore + (recencyWeight * 0.1);
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
