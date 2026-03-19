import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Temple } from '@/lib/types';
import TempleDirectory from '@/components/TempleDirectory';
import { getInferredDeity } from '@/lib/utils';

/*
  Fix: All temples page mobile overlap and header spacing
  Issue: The hero overlap felt heavy on small screens and the directory needed more breathing room
  Solution: Tuned header padding and overlap spacing while keeping the route structure unchanged
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
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

async function getAllTemples(): Promise<Temple[]> {
  try {
    const templesRef = collection(db, 'temples');
    const q = query(templesRef, orderBy('rating', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      deity: getInferredDeity(doc.data() as Temple),
    } as Temple));
  } catch (error) {
    console.error('Error fetching temples:', error);
    return [];
  }
}

export default async function TemplesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; l?: string; deity?: string }>;
}) {
  const params = await searchParams;
  const temples = await getAllTemples();
  const queryParam = params.q || '';
  const deityParam = params.deity || '';

  // BreadcrumbList structured data (SEO)
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
        <header className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 text-white overflow-hidden pb-24 sm:pb-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-[200px] leading-none">🛕</div>
            <div className="absolute bottom-0 right-10 text-[150px] leading-none">🕉️</div>
          </div>
          <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-20 sm:pt-24 pb-12 md:pt-32 md:pb-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium hover:bg-white/25 transition-all mb-8 relative z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Map
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-black leading-tight mb-4 drop-shadow-lg">
              Temple Directory
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              Discover over {temples.length}+ sacred destinations across the Indian subcontinent. Search, filter, and plan your divine journey.
            </p>
          </div>
        </header>

        {/* Client Component for Interactive Filtering */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 sm:-mt-24 pb-16 sm:pb-20 relative z-30">
          <TempleDirectory 
            initialTemples={temples} 
            initialQuery={queryParam}
            initialDeity={deityParam}
          />
        </main>

        {/* Footer */}
        <footer className="border-t border-primary/5 py-12 text-center text-[10px] font-black text-on-surface/40 uppercase tracking-[0.3em]">
          <p>
            GhumoIndia — Explore Sacred India •{' '}
            <Link href="/" className="text-primary hover:underline">
              Divine Map
            </Link>
          </p>
        </footer>
      </div>
    </>
  );
}
