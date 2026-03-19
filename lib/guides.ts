// Shared guide content used by the guides index and guide detail pages.
export type GuideArticle = {
  slug: string;
  title: string;
  summary: string;
  heroImage: string;
  category: string;
  readTime: string;
  relatedTempleQueries: string[];
  sections: Array<{
    heading: string;
    body: string;
    tips?: string[];
  }>;
};

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: 'best-time-to-visit-major-temples-in-india',
    title: 'Best Time to Visit Major Temples in India',
    summary: 'Season-by-season advice for planning a comfortable and auspicious temple journey.',
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80',
    category: 'Planning',
    readTime: '8 min read',
    relatedTempleQueries: ['Tirupati', 'Kashi Vishwanath', 'Somnath', 'Badrinath'],
    sections: [
      {
        heading: 'Why timing matters',
        body: 'Temple trips are smoother when you plan around weather, festival crowds, and local darshan windows. Winter is often the most comfortable season for long multi-city pilgrimages across India.',
        tips: ['Carry water and footwear-friendly socks', 'Check local festival calendars before booking'],
      },
      {
        heading: 'North India',
        body: 'Hill shrines such as Kedarnath and Badrinath are best visited during their open season. Plains cities like Varanasi and Ayodhya are easier to explore in cooler months.',
        tips: ['Book early for peak holiday periods', 'Keep buffer days for weather delays in the Himalayas'],
      },
      {
        heading: 'South India',
        body: 'Tamil Nadu and Karnataka temple circuits work well in the cooler part of the year, especially when you want to combine rituals with sightseeing.',
      },
    ],
  },
  {
    slug: 'top-10-shiva-temples-in-india',
    title: 'Top 10 Shiva Temples in India',
    summary: 'A fast, SEO-friendly guide to the most visited Shiva temples and how to plan them together.',
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80',
    category: 'Temple Lists',
    readTime: '7 min read',
    relatedTempleQueries: ['Kashi Vishwanath', 'Somnath', 'Mahakaleshwar', 'Rameshwaram'],
    sections: [
      {
        heading: 'The classic Shiva circuit',
        body: 'The best known Shiva temples spread across north, west, east, and south India. Visiting them in one trip is possible if you group them by geography.',
        tips: ['Combine nearby shrines to reduce travel time', 'Use the route planner to build a sequence'],
      },
      {
        heading: 'What devotees look for',
        body: 'Timings, crowd levels, and festival dates matter most. Many visitors also want hotel and train links right from the temple page.',
      },
      {
        heading: 'How to use this list',
        body: 'Open each temple page for timings, nearby temples, travel options, and videos before you lock your route.',
      },
    ],
  },
  {
    slug: 'hidden-temples-in-south-india',
    title: 'Hidden Temples in South India',
    summary: 'Discover calmer, lesser-known temples with strong local character and rich history.',
    heroImage: 'https://images.unsplash.com/photo-1524492514790-5a8f058f6f2d?auto=format&fit=crop&w=1600&q=80',
    category: 'Hidden Gems',
    readTime: '6 min read',
    relatedTempleQueries: ['Rameshwaram', 'Srirangam', 'Madurai', 'Tiruvananthapuram'],
    sections: [
      {
        heading: 'Beyond the headline shrines',
        body: 'Smaller temples often offer a more peaceful darshan and better opportunities for photography outside the sanctum. They are also great for families and older devotees.',
      },
      {
        heading: 'Planning tips',
        body: 'Pair hidden temples with a bigger nearby destination so your trip still feels complete. That makes hotel, cab, and train planning much easier.',
      },
      {
        heading: 'Why these pages rank',
        body: 'Long-form guides build topical authority and send internal traffic to temple pages, which helps both SEO and monetization.',
      },
    ],
  },
  {
    slug: 'pilgrimage-routes-every-devotee-should-visit',
    title: 'Pilgrimage Routes Every Devotee Should Visit',
    summary: 'A practical route-based guide for multi-temple trips and family pilgrimages.',
    heroImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1600&q=80',
    category: 'Routes',
    readTime: '9 min read',
    relatedTempleQueries: ['Badrinath', 'Kedarnath', 'Tirupati', 'Dwarka'],
    sections: [
      {
        heading: 'Route planning first',
        body: 'Route-based trip planning is more useful than a random temple list because it reduces travel friction and increases conversion to hotel and transport bookings.',
      },
      {
        heading: 'Classic routes',
        body: 'Char Dham, 12 Jyotirlinga, Navagraha, and Divya Desam circuits are the strongest pillars for a pilgrimage planner.',
      },
      {
        heading: 'Use this with the planner',
        body: 'The route planner page helps visitors save temple sequences, share them, and estimate distance and travel time before booking.',
      },
    ],
  },
];

export function getGuideArticle(slug: string) {
  return GUIDE_ARTICLES.find((article) => article.slug === slug) || null;
}
