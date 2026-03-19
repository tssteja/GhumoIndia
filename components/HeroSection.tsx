'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SearchResult } from '@/lib/types';

export default function HeroSection() {
  const [templeQuery, setTempleQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search Logic
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (templeQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/temples/search?q=${encodeURIComponent(templeQuery)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [templeQuery]);

  const handleSelectTemple = (slug: string, name: string) => {
    setTempleQuery(name);
    setIsOpen(false);
    
    // Dispatch event to TempleMap
    const event = new CustomEvent('select-temple', { detail: { slug } });
    window.dispatchEvent(event);

    // Scroll to map
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center z-10 overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0 text-white">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQP6Yrm01UWW9UeGU6L2J0oSwNyfLPvbBw9aWgePSR2nChp0373T8lYV4t4fGnrZ2zC74BfL-i-T1ZlajrEwcle978DPsN1KZP9_xrPKd5RZbkI-DNkMxzfvKaLWXg0Cre5Gki-YN3uvMYLNuGGs8vKoUQp2RAGkOJQX5E0tyJPsfXflSF_dJiaGbAvXeTKvHCI7MKUP9wO7sbagWab9lHBuTDNgmkao6Ph-YcEQz9KOopMTFRIu27iFzEyqrxByMbr1-5j47SGyI"
          alt="Ancient Indian Temple Sunrise"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white"></div>
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-6xl mx-auto px-4 md:px-8 pt-32 pb-24 md:pt-40 md:pb-20 text-center">
        <span className="inline-block px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-primary/20 backdrop-blur-md text-white font-black text-[10px] md:text-xs mb-6 md:mb-8 tracking-[0.2em] uppercase border border-white/20 shadow-2xl">
          🌸 Welcome to GhumoIndia 🌸
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 md:mb-8 tracking-tight drop-shadow-2xl leading-[1.1]">
          Explore the <span className="text-amber-200 decoration-amber-300/40 underline decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8 italic">Sacred</span> Heritage
        </h1>
        <p className="text-white/90 text-sm sm:text-base md:text-xl font-medium mb-12 md:mb-16 max-w-2xl mx-auto drop-shadow-md leading-relaxed">
          Journey through India&apos;s ancient temples. From the majestic Himalayas to the serene coasts of the South.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto mb-8 md:mb-10">
          <Link
            href="/#map-section"
            className="group rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-3 text-left hover:bg-white/15 transition-all touch-manipulation"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-amber-200/20 flex items-center justify-center text-amber-100">
                <span className="material-symbols-outlined text-lg">map</span>
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Live Map</p>
            </div>
            <p className="text-sm md:text-base font-black text-white group-hover:translate-x-1 transition-transform">Find temples nearby</p>
          </Link>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-temple-list'));
              const mapSection = document.getElementById('map-section');
              if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="group rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-3 text-left hover:bg-white/15 transition-all touch-manipulation"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-amber-200/20 flex items-center justify-center text-amber-100">
                <span className="material-symbols-outlined text-lg">temple_hindu</span>
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Temple Guide</p>
            </div>
            <p className="text-sm md:text-base font-black text-white group-hover:translate-x-1 transition-transform">Browse by state</p>
          </button>
          <Link
            href="/festivals"
            className="group rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-3 text-left hover:bg-white/15 transition-all touch-manipulation"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-amber-200/20 flex items-center justify-center text-amber-100">
                <span className="material-symbols-outlined text-lg">festival</span>
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Plan Ahead</p>
            </div>
            <p className="text-sm md:text-base font-black text-white group-hover:translate-x-1 transition-transform">See festivals</p>
          </Link>
        </div>

        {/* Search Experience */}
        <div className="max-w-xl mx-auto relative z-[120]">
          
          {/* Find on Map */}
          <div className="relative group" ref={containerRef}>
            <div className="bg-white/95 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined text-xl md:text-2xl font-black">temple_hindu</span>
                </div>
                <div className="text-left">
                  <h3 className="font-black text-secondary text-sm md:text-base tracking-tight leading-none mb-1">Search Sacred Places</h3>
                  <p className="text-[10px] md:text-xs text-on-surface-variant font-black uppercase tracking-widest opacity-40">Find it on the Divine Map</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={templeQuery}
                    onChange={(e) => setTempleQuery(e.target.value)}
                    placeholder="Search temple or deity..."
                    className="w-full bg-gray-50/50 border border-outline-variant/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-2xl px-4 py-3.5 md:px-5 md:py-4 font-bold text-secondary placeholder:text-gray-300 transition-all outline-none text-sm md:text-base"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && results.length > 0) {
                        handleSelectTemple(results[0].slug, results[0].name);
                      }
                    }}
                  />
                  {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (results.length > 0) {
                      handleSelectTemple(results[0].slug, results[0].name);
                    }
                  }}
                  className="bg-primary text-white p-3.5 md:p-4 rounded-xl md:rounded-2xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-lg active:scale-95 shrink-0 flex items-center justify-center font-black"
                >
                  <span className="material-symbols-outlined font-black">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4)] border border-gray-100 overflow-hidden z-[130] max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="p-2 pb-4">
                  <p className="px-5 pt-3 pb-2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">Suggestions</p>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectTemple(result.slug, result.name)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 rounded-2xl transition-all text-left group/item"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-secondary group-hover/item:text-primary transition-colors truncate">{result.name}</p>
                        <p className="text-xs text-on-surface-variant/50 font-bold">{result.city}, {result.state}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results state */}
            {isOpen && results.length === 0 && templeQuery.length >= 2 && !loading && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4)] border border-gray-100 p-10 text-center z-[130] animate-in fade-in slide-in-from-top-4 duration-300">
                <span className="material-symbols-outlined text-5xl text-amber-300 mb-4 block">search_off</span>
                <p className="text-gray-600 font-bold">No results for &ldquo;{templeQuery}&rdquo;</p>
                <p className="text-xs text-gray-400 mt-2 italic">Try searching for a different temple or deity</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Transitional Element */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent z-[1]"></div>
    </section>
  );
}
