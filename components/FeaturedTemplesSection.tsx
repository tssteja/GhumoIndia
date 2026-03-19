'use client';

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
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
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
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl md:text-7xl font-black text-secondary mb-6 leading-tight tracking-tight">
              Popular <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-4">Temples</span> of India
            </h2>
            <p className="text-on-surface-variant text-lg md:text-xl font-medium leading-relaxed">
              Explore the most famous and historical temples in India, handpicked for their architecture and spiritual importance.
            </p>
          </div>
          <Link 
            href="/temples" 
            className="group flex items-center gap-3 bg-primary/5 hover:bg-primary px-6 py-3 rounded-xl text-primary hover:text-white font-black transition-all border-2 border-primary/20 hover:border-primary shadow-sm"
          >
            See all temples 
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {temples.map((temple) => (
            <TempleCard key={temple.id} temple={temple} />
          ))}
        </div>
      </div>
    </section>
  );
}
