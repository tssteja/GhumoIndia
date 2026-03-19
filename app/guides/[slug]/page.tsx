import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Temple } from '@/lib/types';
import { getGuideArticle } from '@/lib/guides';
import { getInferredDeity, getInferredState } from '@/lib/utils';

// SEO-friendly guide detail pages with related temple links and internal navigation.
interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

async function getTemples(): Promise<Temple[]> {
  try {
    const templesRef = collection(db, 'temples');
    const q = query(templesRef, orderBy('rating', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      state: getInferredState(doc.data() as Temple),
      deity: getInferredDeity(doc.data() as Temple),
    } as Temple));
  } catch (error) {
    console.error('Error fetching guide temples:', error);
    return [];
  }
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideArticle(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | GhumoIndia',
      description: 'The requested temple travel guide could not be found.',
    };
  }

  const title = `${guide.title} | GhumoIndia`;
  return {
    title,
    description: guide.summary,
    openGraph: {
      title,
      description: guide.summary,
      images: [guide.heroImage],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: guide.summary,
      images: [guide.heroImage],
    },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideArticle(slug);
  const temples = await getTemples();

  if (!guide) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md">
          <p className="text-5xl mb-4">🛕</p>
          <h1 className="text-3xl font-black text-slate-900">Guide not found</h1>
          <p className="mt-3 text-slate-600">Try browsing the guides index for a different article.</p>
          <Link href="/guides" className="inline-flex mt-6 px-5 py-3 rounded-full bg-orange-600 text-white font-bold">
            Back to Guides
          </Link>
        </div>
      </main>
    );
  }

  const relatedTemples = guide.relatedTempleQueries
    .map((term) => temples.find((temple) => temple.name.toLowerCase().includes(term.toLowerCase()) || temple.deity?.toLowerCase().includes(term.toLowerCase())))
    .filter(Boolean) as Temple[];

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/70 to-white">
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0">
          <Image
            src={guide.heroImage}
            alt={guide.title}
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/20" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
          <Link href="/guides" className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-bold hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            All Guides
          </Link>
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.35em] text-white/70">{guide.category}</p>
          <h1 className="mt-4 max-w-4xl text-4xl md:text-6xl font-black font-serif leading-tight">{guide.title}</h1>
          <p className="mt-4 max-w-3xl text-white/85 text-base md:text-xl leading-relaxed">{guide.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-black">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2">{guide.readTime}</span>
            <Link href="/plan-route" className="inline-flex rounded-full bg-orange-500 px-4 py-2 hover:bg-orange-600 transition-colors">
              Plan a route
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_320px] gap-6">
        <aside className="lg:sticky lg:top-28 self-start rounded-[2rem] bg-white border border-primary/10 shadow-sm p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">On this page</p>
          <ul className="mt-4 space-y-3 text-sm font-semibold text-on-surface-variant">
            {guide.sections.map((section, index) => (
              <li key={section.heading}>
                <a href={`#section-${index}`} className="hover:text-primary transition-colors">
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <article className="space-y-6">
          {guide.sections.map((section, index) => (
            <section key={section.heading} id={`section-${index}`} className="rounded-[2rem] bg-white border border-primary/10 shadow-sm p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-black font-serif text-on-surface">{section.heading}</h2>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-on-surface-variant">{section.body}</p>
              {section.tips && (
                <ul className="mt-5 space-y-2">
                  {section.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-3 text-sm md:text-base text-on-surface">
                      <span className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <aside className="space-y-6">
          <section className="rounded-[2rem] bg-white border border-primary/10 shadow-sm p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Related Temples</p>
            <div className="mt-4 space-y-3">
              {relatedTemples.map((temple) => (
                <Link
                  key={temple.slug}
                  href={`/temple/${temple.slug}`}
                  className="block rounded-2xl border border-outline-variant/10 p-4 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <p className="font-black text-secondary">{temple.name}</p>
                  <p className="text-sm text-on-surface-variant">
                    {temple.city}, {temple.state}
                  </p>
                </Link>
              ))}
              {relatedTemples.length === 0 && (
                <p className="text-sm text-on-surface-variant">Temple links will appear once the relevant temple data is available.</p>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white border border-primary/10 shadow-sm p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Internal Links</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/all-temples" className="rounded-full bg-primary/10 px-3 py-2 text-sm font-bold text-primary">Temple Directory</Link>
              <Link href="/plan-route" className="rounded-full bg-secondary/10 px-3 py-2 text-sm font-bold text-secondary">Route Planner</Link>
              <Link href="/festivals" className="rounded-full bg-orange-100 px-3 py-2 text-sm font-bold text-orange-700">Festival Calendar</Link>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
