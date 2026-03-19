'use client';

// Homepage hero with conversion-focused CTAs and predictive temple search.
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SearchResult } from '@/lib/types';

export default function HeroSection() {
  const [templeQuery, setTempleQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  
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
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/temples/search?q=${encodeURIComponent(templeQuery)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results.slice(0, 6));
          setIsOpen(true);
          setActiveIndex(-1);
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
    setActiveIndex(-1);
    
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
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center z-10 overflow-visible">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto mb-8 md:mb-10">
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
          <Link
            href="/plan-route"
            className="group rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 px-4 py-3 text-left hover:bg-white/15 transition-all touch-manipulation"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-amber-200/20 flex items-center justify-center text-amber-100">
                <span className="material-symbols-outlined text-lg">route</span>
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Route Planner</p>
            </div>
            <p className="text-sm md:text-base font-black text-white group-hover:translate-x-1 transition-transform">Plan your pilgrimage</p>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('find-temples-near-me'));
            const mapSection = document.getElementById('map-section');
            if (mapSection) {
              mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="inline-flex items-center gap-3 rounded-full bg-white text-secondary px-5 py-3 md:px-6 md:py-4 font-black shadow-2xl hover:shadow-white/20 transition-all active:scale-95 touch-manipulation"
        >
          <span className="material-symbols-outlined text-primary">my_location</span>
          Find Temples Near Me
        </button>

        {/* Search Experience */}
        <div className="max-w-xl mx-auto relative z-[140]">
          
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
                      if (!isOpen || results.length === 0) return;

                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setActiveIndex((prev) => (prev + 1) % results.length);
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
                      } else if (e.key === 'Enter' && activeIndex >= 0) {
                        e.preventDefault();
                        const selected = results[activeIndex];
                        if (selected) {
                          handleSelectTemple(selected.slug, selected.name);
                        }
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
              <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-[2rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4)] border border-gray-100 overflow-hidden z-[150] max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="p-2 pb-4">
                  <p className="px-5 pt-3 pb-2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">Suggestions</p>
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleSelectTemple(result.slug, result.name)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-left group/item ${
                        activeIndex === index
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-secondary group-hover/item:text-primary transition-colors truncate">{result.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant/50 font-bold">
                          <span>{result.city}, {result.state}</span>
                          {result.deity && (
                            <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-primary">
                              {result.deity}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results state */}
            {isOpen && results.length === 0 && templeQuery.length >= 2 && !loading && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-[2rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4)] border border-gray-100 p-10 text-center z-[150] animate-in fade-in slide-in-from-top-4 duration-300">
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
