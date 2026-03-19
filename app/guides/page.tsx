import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GUIDE_ARTICLES } from '@/lib/guides';

// SEO-friendly guides index for long-form temple travel content.
export const metadata: Metadata = {
  title: 'Temple Travel Guides | GhumoIndia',
  description:
    'Read long-form travel guides for temple planning, pilgrimage routes, and the best time to visit major temples in India.',
};

export default function GuidesIndexPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/70 to-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 text-[180px] leading-none">🛕</div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/75 mb-4">Temple Guides</p>
          <h1 className="text-4xl md:text-6xl font-black font-serif leading-tight max-w-3xl">
            Long-form temple travel guides for better search visibility and better trip planning.
          </h1>
          <p className="mt-5 max-w-2xl text-white/90 text-base md:text-lg font-medium leading-relaxed">
            These guides are designed to bring organic traffic, answer visitor questions, and link naturally into temple pages and route planning.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {GUIDE_ARTICLES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group rounded-[2rem] bg-white border border-primary/10 shadow-sm hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={guide.heroImage}
                  alt={guide.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white">
                    {guide.category}
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">{guide.readTime}</p>
                <h2 className="mt-2 text-2xl font-serif font-black text-on-surface group-hover:text-primary transition-colors">
                  {guide.title}
                </h2>
                <p className="mt-3 text-sm md:text-base text-on-surface-variant leading-relaxed">
                  {guide.summary}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 font-black text-sm text-secondary">
                  Read guide
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
