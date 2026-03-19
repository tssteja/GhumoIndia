'use client';

// Shared predictive search dropdown for temple discovery and map selection.
import React, { useState, useEffect, useRef } from 'react';
import type { SearchResult } from '@/lib/types';

interface SearchBarProps {
  onSelectTemple: (slug: string) => void;
}

export default function SearchBar({ onSelectTemple }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleResults = results.slice(0, 6);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/temples/search?q=${encodeURIComponent(query)}`
        );
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
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setQuery(result.name);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelectTemple(result.slug);
  };

  return (
    <div ref={containerRef} className="relative w-full group">
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            search_spark
          </span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for temples or deities..."
          className="w-full pl-14 pr-6 py-4 bg-surface/80 backdrop-blur-2xl rounded-full shadow-2xl border border-white/20 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all font-medium"
          onKeyDown={(e) => {
            if (!isOpen || visibleResults.length === 0) return;

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((prev) => (prev + 1) % visibleResults.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((prev) =>
                prev <= 0 ? visibleResults.length - 1 : prev - 1
              );
            } else if (e.key === 'Enter' && activeIndex >= 0) {
              e.preventDefault();
              handleSelect(visibleResults[activeIndex]);
            }
          }}
        />
        {loading && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && visibleResults.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-4 w-full bg-surface/90 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-outline-variant/10 overflow-hidden z-[150] max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-2">
            {visibleResults.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all text-left group/item cursor-pointer ${
                  activeIndex === index ? 'bg-primary/5' : 'hover:bg-primary/5'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center shrink-0 group-hover/item:bg-primary-container/40 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">temple_hindu</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif font-bold text-on-surface group-hover/item:text-primary transition-colors truncate">
                    {result.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {result.city}{result.state ? `, ${result.state}` : ''}
                    </p>
                    {result.deity && (
                      <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                        {result.deity}
                      </span>
                    )}
                    <span className="text-secondary flex items-center gap-0.5 text-xs font-black">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {result.rating}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover/item:translate-x-1 group-hover/item:text-primary transition-all opacity-0 group-hover/item:opacity-100">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && results.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute left-0 right-0 top-full mt-4 w-full bg-surface/90 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-outline-variant/10 p-10 text-center z-[150] animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-5xl text-primary/30 mb-4 block">search_off</span>
          <p className="text-on-surface-variant font-bold">No results for &quot;{query}&quot;</p>
          <p className="text-xs text-on-surface-variant/60 mt-2 lowercase tracking-wider italic">Try searching for a different deity or city</p>
        </div>
      )}
    </div>
  );
}
