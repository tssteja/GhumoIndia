'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    <section className="relative min-h-[90vh] flex items-center justify-center z-10">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0 text-white">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQP6Yrm01UWW9UeGU6L2J0oSwNyfLPvbBw9aWgePSR2nChp0373T8lYV4t4fGnrZ2zC74BfL-i-T1ZlajrEwcle978DPsN1KZP9_xrPKd5RZbkI-DNkMxzfvKaLWXg0Cre5Gki-YN3uvMYLNuGGs8vKoUQp2RAGkOJQX5E0tyJPsfXflSF_dJiaGbAvXeTKvHCI7MKUP9wO7sbagWab9lHBuTDNgmkao6Ph-YcEQz9KOopMTFRIu27iFzEyqrxByMbr1-5j47SGyI"
          alt="Ancient Indian Temple Sunrise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-white"></div>
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-6xl mx-auto px-6 text-center pt-24 pb-12">
        <span className="inline-block px-5 py-2 rounded-full bg-primary/20 backdrop-blur-md text-white font-bold text-xs mb-8 tracking-[0.2em] uppercase border border-white/30 shadow-2xl">
          🌸 Welcome to GhumoIndia 🌸
        </span>
        <h1 className="font-serif text-5xl md:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)] leading-[1.1]">
          Explore the <span className="text-secondary decoration-secondary/30 underline decoration-8 underline-offset-8 italic">Sacred</span> Heritage
        </h1>
        <p className="text-white/90 text-lg md:text-2xl font-medium mb-16 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
          Journey through India&apos;s ancient temples. From the majestic Himalayas to the serene coasts of the South.
        </p>

        {/* Search Experience */}
        <div className="max-w-2xl mx-auto relative z-[70]">
          
          {/* Find on Map */}
          <div className="relative group" ref={containerRef}>
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/20 transition-all hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined text-2xl font-black">temple_hindu</span>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 leading-none mb-1">Search Temples & Deities</h3>
                  <p className="text-xs text-gray-400 font-medium">Find it on the Divine Map</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={templeQuery}
                    onChange={(e) => setTempleQuery(e.target.value)}
                    placeholder="Search for temples or deities..."
                    className="w-full bg-gray-50 border-2 border-gray-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 rounded-2xl px-5 py-4 font-bold text-gray-900 placeholder:text-gray-300 transition-all outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && results.length > 0) {
                        handleSelectTemple(results[0].slug, results[0].name);
                      }
                    }}
                  />
                  {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (results.length > 0) {
                      handleSelectTemple(results[0].slug, results[0].name);
                    }
                  }}
                  className="bg-amber-500 text-white p-4 rounded-2xl hover:bg-amber-600 transition-all shadow-lg active:scale-95 shrink-0"
                >
                  <span className="material-symbols-outlined font-black">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4)] border border-gray-100 overflow-hidden z-[80] max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="p-2">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectTemple(result.slug, result.name)}
                      className="w-full flex items-center gap-4 px-4 py-4 hover:bg-amber-50 rounded-2xl transition-all text-left group/item"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-amber-600">location_on</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 group-hover/item:text-amber-700 truncate line-clamp-1">{result.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{result.city}, {result.state}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results state */}
            {isOpen && results.length === 0 && templeQuery.length >= 2 && !loading && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.4)] border border-gray-100 p-10 text-center z-[80] animate-in fade-in slide-in-from-top-4 duration-300">
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
