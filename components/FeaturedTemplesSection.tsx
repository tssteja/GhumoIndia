'use client';

/*
  Fix: Featured temple section mobile rhythm
  Issue: The heading and card grid felt too spacious on small screens
  Solution: Reduced mobile padding and tightened action/button spacing
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
import React, { useEffect, useState } from 'react';
import TempleCard from './TempleCard';
import type { Temple } from '@/lib/types';
import Link from 'next/link';

export default function FeaturedTemplesSection() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/temples');
        const data = await res.json();
        if (data.temples) {
          // Just take the first 3 for the featured section
          setTemples(data.temples.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured temples:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-12 w-64 bg-surface-container-high rounded-lg mb-12 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-surface-container-low rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      {/* FIX: Global responsive container - consistent max-w-7xl mx-auto with px-4 md:px-6 */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-7xl font-black text-secondary mb-4 md:mb-6 leading-tight tracking-tight">
              Popular <span className="text-primary underline decoration-primary/20 decoration-4 md:decoration-8 underline-offset-4">Temples</span> of India
            </h2>
            <p className="text-on-surface-variant text-base sm:text-lg md:text-xl font-medium leading-relaxed">
              Explore the most famous and historical temples in India, handpicked for their architecture and spiritual importance.
            </p>
          </div>
          <Link 
            href="/temples" 
            className="group w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-secondary/5 hover:bg-secondary px-5 sm:px-6 py-3 rounded-lg md:rounded-xl text-secondary hover:text-white font-black transition-all border border-secondary/10 hover:border-secondary shadow-sm text-xs sm:text-sm touch-manipulation"
          >
            See all temples 
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-sm sm:text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {temples.map((temple) => (
            <TempleCard key={temple.id} temple={temple} />
          ))}
        </div>
      </div>
    </section>
  );
}
