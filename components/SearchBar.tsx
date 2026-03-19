'use client';

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
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setQuery(result.name);
    setIsOpen(false);
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
        />
        {loading && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-4 w-full bg-surface/90 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-outline-variant/10 overflow-hidden z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-2">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-primary/5 rounded-2xl transition-all text-left group/item"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center shrink-0 group-hover/item:bg-primary-container/40 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">temple_hindu</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif font-bold text-on-surface group-hover/item:text-primary transition-colors truncate">
                    {result.name}
                  </p>
                  <p className="text-xs font-bold text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {result.city}{result.state ? `, ${result.state}` : ''}
                    <span className="mx-1 opacity-30">•</span>
                    <span className="text-secondary flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {result.rating}
                    </span>
                  </p>
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
        <div className="absolute top-full mt-4 w-full bg-surface/90 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-outline-variant/10 p-10 text-center z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-5xl text-primary/30 mb-4 block">search_off</span>
          <p className="text-on-surface-variant font-bold">No results for "{query}"</p>
          <p className="text-xs text-on-surface-variant/60 mt-2 lowercase tracking-wider italic">Try searching for a different deity or city</p>
        </div>
      )}
    </div>
  );
}
