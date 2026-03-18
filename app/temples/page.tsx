import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Temple } from '@/lib/types';
import { formatCount } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'All Temples — Explore Famous Temples Across India | TempleMap',
  description:
    'Browse our complete directory of famous temples across India, organized by state. Discover sacred sites, watch travel videos, get directions, and plan your spiritual journey.',
  keywords: [
    'Indian temples list',
    'famous temples India',
    'temples by state',
    'temple directory India',
    'darshan guide India',
    'temple travel guide',
  ],
  openGraph: {
    title: 'All Temples — Explore Famous Temples Across India',
    description:
      'Browse our complete directory of famous temples across India, organized by state.',
    type: 'website',
    locale: 'en_IN',
  },
};

interface TemplesByState {
  [state: string]: Temple[];
}

async function getAllTemples(): Promise<Temple[]> {
  try {
    const templesRef = collection(db, 'temples');
    const q = query(templesRef, orderBy('rating', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Temple));
  } catch (error) {
    console.error('Error fetching temples:', error);
    return [];
  }
}

export default async function TemplesPage() {
  const temples = await getAllTemples();

  // Group by state
  const templesByState: TemplesByState = {};
  temples.forEach((temple) => {
    const state = temple.state || 'Other';
    if (!templesByState[state]) templesByState[state] = [];
    templesByState[state].push(temple);
  });

  const sortedStates = Object.keys(templesByState).sort();
  const totalTemples = temples.length;

  // BreadcrumbList structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: process.env.NEXT_PUBLIC_SITE_URL || 'https://templemap.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'All Temples',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        {/* Hero Header */}
        <header className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-[200px] leading-none">🛕</div>
            <div className="absolute bottom-0 right-10 text-[150px] leading-none">🕉️</div>
          </div>
          <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium hover:bg-white/25 transition-all mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Map
            </Link>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3 drop-shadow-lg">
              Explore {totalTemples}+ Sacred Temples
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
              Discover famous temples across India, organized by state. Watch travel videos, get
              directions, and plan your spiritual journey.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-medium">
                📍 {sortedStates.length} States & Regions
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-medium">
                🛕 {totalTemples} Temples
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Table of Contents */}
          <nav className="mb-10 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Jump to State
            </h2>
            <div className="flex flex-wrap gap-2">
              {sortedStates.map((state) => (
                <a
                  key={state}
                  href={`#${state.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm px-3 py-1.5 bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors font-medium"
                >
                  {state} ({templesByState[state].length})
                </a>
              ))}
            </div>
          </nav>

          {/* State-wise Listing */}
          <div className="space-y-10">
            {sortedStates.map((state) => (
              <section
                key={state}
                id={state.toLowerCase().replace(/\s+/g, '-')}
                className="scroll-mt-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {state.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{state}</h2>
                    <p className="text-xs text-gray-400 font-medium">
                      {templesByState[state].length}{' '}
                      {templesByState[state].length === 1 ? 'temple' : 'temples'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templesByState[state].map((temple) => (
                    <Link
                      key={temple.id}
                      href={`/temple/${temple.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative h-40 overflow-hidden">
                        {temple.photos?.[0] ? (
                          <img
                            src={temple.photos[0]}
                            alt={temple.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center">
                            <span className="text-5xl opacity-60">🛕</span>
                          </div>
                        )}
                        {temple.rating && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
                            <span className="text-amber-500 text-sm">★</span>
                            <span className="text-sm font-semibold text-gray-800">
                              {temple.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                          {temple.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span className="text-sm truncate">{temple.city}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {formatCount(temple.ratingCount)} reviews
                          </span>
                          {temple.videos && temple.videos.length > 0 && (
                            <span className="text-xs text-amber-600 font-medium">
                              🎥 {temple.videos.length} videos
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
          <p>
            TempleMap — Explore India&apos;s Sacred Temples •{' '}
            <Link href="/" className="text-amber-600 hover:underline">
              Back to Map
            </Link>
          </p>
        </footer>
      </div>
    </>
  );
}
