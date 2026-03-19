/**
 * Generate a URL-friendly slug from a temple name.
 * Falls back to the provided ID when the name cannot be slugged cleanly.
 */
export function generateSlug(name: string, fallbackId?: string): string {
  const transliterationMap: Record<string, string> = {
    '\u0905': 'a',
    '\u0906': 'aa',
    '\u0907': 'i',
    '\u0908': 'ee',
    '\u0909': 'u',
    '\u090a': 'oo',
    '\u090f': 'e',
    '\u0910': 'ai',
    '\u0913': 'o',
    '\u0914': 'au',
    '\u0915': 'k',
    '\u0916': 'kh',
    '\u0917': 'g',
    '\u0918': 'gh',
    '\u091a': 'ch',
    '\u091b': 'chh',
    '\u091c': 'j',
    '\u091d': 'jh',
    '\u091f': 't',
    '\u0920': 'th',
    '\u0921': 'd',
    '\u0922': 'dh',
    '\u0923': 'n',
    '\u0924': 't',
    '\u0925': 'th',
    '\u0926': 'd',
    '\u0927': 'dh',
    '\u0928': 'n',
    '\u092a': 'p',
    '\u092b': 'ph',
    '\u092c': 'b',
    '\u092d': 'bh',
    '\u092e': 'm',
    '\u092f': 'y',
    '\u0930': 'r',
    '\u0932': 'l',
    '\u0935': 'v',
    '\u0936': 'sh',
    '\u0937': 'sh',
    '\u0938': 's',
    '\u0939': 'h',
    '\u0902': 'n',
    '\u0903': 'h',
    '\u093e': 'a',
    '\u093f': 'i',
    '\u0940': 'ee',
    '\u0941': 'u',
    '\u0942': 'oo',
    '\u0947': 'e',
    '\u0948': 'ai',
    '\u094b': 'o',
    '\u094c': 'au',
    '\u094d': '',
    '\u0943': 'ri',
  };

  const normalized = Array.from(name)
    .map((char) => transliterationMap[char] ?? char)
    .join('')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');

  const slug = normalized
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  if (!slug || slug === '-') {
    return fallbackId ? `temple-${fallbackId.slice(0, 8)}` : 'temple';
  }

  return slug;
}

/**
 * Calculate the Haversine distance between two coordinates in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
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
 * Strict filtering: reject if the video does not mention the temple or location.
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

  const commonWords = new Set([
    'temple',
    'mandir',
    'devalayam',
    'sri',
    'shree',
    'swamy',
    'trust',
    'of',
    'and',
    'the',
    'in',
    'india',
  ]);

  const templeKeywords = templeLower
    .replace(/[,.-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word));

  const locationKeywords = [cityLower, stateLower].filter((loc) => loc.length > 2);

  const hasTempleMatch =
    templeKeywords.length > 0
      ? templeKeywords.some((kw) => titleLower.includes(kw) || descLower.includes(kw))
      : titleLower.includes(templeLower) || descLower.includes(templeLower);

  const hasLocationMatch =
    locationKeywords.length === 0 ||
    locationKeywords.some((loc) => titleLower.includes(loc) || descLower.includes(loc));

  const majorCities = [
    'jaipur',
    'mumbai',
    'delhi',
    'kolkata',
    'chennai',
    'bangalore',
    'pune',
    'hyderabad',
    'tirupati',
    'goa',
    'hampi',
  ].filter((c) => c !== cityLower);

  if (majorCities.some((c) => titleLower.includes(c))) {
    return 0;
  }

  if (!hasTempleMatch || !hasLocationMatch) return 0;

  let score = 0;
  if (titleLower.includes(templeLower)) score += 5;
  if (cityLower && titleLower.includes(cityLower)) score += 3;
  if (descLower.includes(templeLower)) score += 2;
  if (viewCount > 100000) score += 1;

  return score;
}

/**
 * YouTube video score - combines relevance, popularity, and recency.
 */
export function calculateVideoScore(
  viewCount: number,
  likeCount: number,
  commentCount: number,
  publishedAt: string,
  relevanceScore: number = 0
): number {
  if (relevanceScore === 0) return 0;

  const publishDate = new Date(publishedAt).getTime();
  const ageInDays = (Date.now() - publishDate) / (1000 * 60 * 60 * 24);
  const recencyWeight = Math.max(0, 1 - ageInDays / 3650);

  const safeViews = Math.max(viewCount || 0, 1);
  const safeLikes = Math.max((likeCount || 0) + (commentCount || 0) * 2, 1);
  const popularityBoost = (Math.log10(safeViews) / 7) * 2;
  const engagementBoost = (Math.log10(safeLikes) / 7) * 0.5;

  return relevanceScore + popularityBoost + engagementBoost + recencyWeight * 0.1;
}

/**
 * Format large numbers for display.
 */
export function formatCount(count: number | undefined | null): string {
  const n = count ?? 0;
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'K';
  }
  return n.toString();
}

/**
 * Truncate text to a certain length with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Check if a temple is currently open based on its timings.
 */
export function isTempleOpen(openStr?: string, closeStr?: string): boolean {
  if (!openStr || !closeStr) return true;

  try {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const parseTime = (timeStr: string): number => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 0;
      const [, hours, minutes, ampm] = match;
      let h = parseInt(hours);
      const m = parseInt(minutes);
      if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
      if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const startTime = parseTime(openStr);
    const endTime = parseTime(closeStr);

    if (endTime > startTime) {
      return currentTime >= startTime && currentTime <= endTime;
    }

    return currentTime >= startTime || currentTime <= endTime;
  } catch {
    return true;
  }
}

/**
 * Infer a state for a temple based on its city or other metadata.
 */
export function getInferredState(temple: {
  city?: string;
  state?: string;
  name?: string;
}): string {
  if (temple.state && temple.state !== 'Other') return temple.state;

  const city = temple.city?.toLowerCase().trim() || '';
  const name = temple.name?.toLowerCase() || '';

  const cityMap: Record<string, string> = {
    // Uttar Pradesh
    varanasi: 'Uttar Pradesh',
    mathura: 'Uttar Pradesh',
    ayodhya: 'Uttar Pradesh',
    prayagraj: 'Uttar Pradesh',
    kushinagar: 'Uttar Pradesh',
    sarnath: 'Uttar Pradesh',
    vrindavan: 'Uttar Pradesh',
    lucknow: 'Uttar Pradesh',
    agra: 'Uttar Pradesh',
    // Uttarakhand
    rishikesh: 'Uttarakhand',
    haridwar: 'Uttarakhand',
    badrinath: 'Uttarakhand',
    kedarnath: 'Uttarakhand',
    gangotri: 'Uttarakhand',
    yamunotri: 'Uttarakhand',
    dehradun: 'Uttarakhand',
    nainital: 'Uttarakhand',
    // Odisha
    puri: 'Odisha',
    konark: 'Odisha',
    bhubaneswar: 'Odisha',
    cuttack: 'Odisha',
    // Tamil Nadu
    madurai: 'Tamil Nadu',
    thanjavur: 'Tamil Nadu',
    rameshwaram: 'Tamil Nadu',
    kanchipuram: 'Tamil Nadu',
    chidambaram: 'Tamil Nadu',
    tiruchirappalli: 'Tamil Nadu',
    chennai: 'Tamil Nadu',
    coimbatore: 'Tamil Nadu',
    mahabalipuram: 'Tamil Nadu',
    // Andhra Pradesh
    tirupati: 'Andhra Pradesh',
    srisailam: 'Andhra Pradesh',
    vijayawada: 'Andhra Pradesh',
    visakhapatnam: 'Andhra Pradesh',
    ahobilam: 'Andhra Pradesh',
    // Karnataka
    hampi: 'Karnataka',
    belur: 'Karnataka',
    halebidu: 'Karnataka',
    mysore: 'Karnataka',
    pattadakal: 'Karnataka',
    aihole: 'Karnataka',
    bengaluru: 'Karnataka',
    bangalore: 'Karnataka',
    udupi: 'Karnataka',
    murudeshwar: 'Karnataka',
    gokarna: 'Karnataka',
    // Maharashtra
    mumbai: 'Maharashtra',
    pune: 'Maharashtra',
    shirdi: 'Maharashtra',
    ellora: 'Maharashtra',
    ajanta: 'Maharashtra',
    nashik: 'Maharashtra',
    kolhapur: 'Maharashtra',
    nagpur: 'Maharashtra',
    'shani shingnapur': 'Maharashtra',
    // Gujarat
    dwarka: 'Gujarat',
    somnath: 'Gujarat',
    palitana: 'Gujarat',
    modhera: 'Gujarat',
    ahmedabad: 'Gujarat',
    vadodara: 'Gujarat',
    surat: 'Gujarat',
    ambaji: 'Gujarat',
    // Rajasthan
    jaipur: 'Rajasthan',
    udaipur: 'Rajasthan',
    jodhpur: 'Rajasthan',
    bikaner: 'Rajasthan',
    'mount abu': 'Rajasthan',
    pushkar: 'Rajasthan',
    ajmer: 'Rajasthan',
    nathdwara: 'Rajasthan',
    // Punjab
    amritsar: 'Punjab',
    ludhiana: 'Punjab',
    jalandhar: 'Punjab',
    // Assam
    guwahati: 'Assam',
    kamakhya: 'Assam',
    // West Bengal
    kolkata: 'West Bengal',
    dakshineswar: 'West Bengal',
    mayapur: 'West Bengal',
    // Bihar
    patna: 'Bihar',
    gaya: 'Bihar',
    'bodh gaya': 'Bihar',
    nalanda: 'Bihar',
    // Madhya Pradesh
    khajuraho: 'Madhya Pradesh',
    ujjain: 'Madhya Pradesh',
    gwalior: 'Madhya Pradesh',
    omkareshwar: 'Madhya Pradesh',
    sanchi: 'Madhya Pradesh',
    jabalpur: 'Madhya Pradesh',
    // Kerala
    thiruvananthapuram: 'Kerala',
    kochi: 'Kerala',
    guruvayur: 'Kerala',
    munnar: 'Kerala',
    sabarimala: 'Kerala',
    thrissur: 'Kerala',
    // Telangana
    hyderabad: 'Telangana',
    warangal: 'Telangana',
    yadadri: 'Telangana',
    // Delhi
    'new delhi': 'Delhi',
    delhi: 'Delhi',
  };

  if (cityMap[city]) return cityMap[city];

  for (const [key, val] of Object.entries(cityMap)) {
    if (city.includes(key)) return val;
  }

  if (name.includes('tirupati') || name.includes('balaji')) return 'Andhra Pradesh';
  if (name.includes('shirdi')) return 'Maharashtra';
  if (name.includes('kashi') || name.includes('vishwanath')) return 'Uttar Pradesh';
  if (name.includes('kamakhya')) return 'Assam';
  if (name.includes('jagannath')) return 'Odisha';

  return 'Other';
}
