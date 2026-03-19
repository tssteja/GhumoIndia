'use client';

/*
  Fix: Navbar mobile menu spacing and search tap targets
  Issue: Search controls and menu actions felt tight on narrow screens
  Solution: Increased input/button sizing and standardized dropdown spacing without changing routing logic
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
// Top navigation with predictive search and quick access to core temple journeys.
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import type { SearchResult } from '@/lib/types';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef<HTMLFormElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const visibleResults = results.slice(0, 6);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-temples?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); 
      setResults([]);
      setShowResults(false);
      setActiveIndex(-1);
      setIsMenuOpen(false);
    }
  };

  const handleSuggestionSelect = (slug: string) => {
    setShowResults(false);
    setResults([]);
    setSearchQuery('');
    setActiveIndex(-1);
    setIsMenuOpen(false);

    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      window.dispatchEvent(new CustomEvent('select-temple', { detail: { slug } }));
      const mapSection = document.getElementById('map-section');
      mapSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.sessionStorage.setItem('pending-temple-slug', slug);
    router.push('/#map-section');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const query = searchQuery.trim();
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/temples/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults((data.results || []).slice(0, 6));
        setShowResults(true);
        setActiveIndex(-1);
      } catch (error) {
        console.error('Navbar search error:', error);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Temple Map', href: '/#map-section' },
    { name: 'All Temples', href: '/all-temples' },
    { name: 'Festivals', href: '/festivals' },
  ];

  const selectActiveResult = () => {
    const selected = visibleResults[activeIndex];
    if (selected) {
      handleSuggestionSelect(selected.slug);
    }
  };

  return (
    <header className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-xl shadow-lg border-b border-primary/5 transition-all duration-500">
      <nav className="flex justify-between items-center px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group relative z-[110]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              temple_hindu
            </span>
          </div>
          <span className="text-xl md:text-2xl font-serif font-black text-secondary tracking-tight">
            Ghumo<span className="text-primary">India</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-black text-sm uppercase tracking-widest text-on-surface-variant/70">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="hover:text-primary transition-colors hover:scale-105 transform active:scale-95"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions & Mobile Toggle */}
        <div className="flex items-center gap-3 md:gap-6 relative z-[110]">
          <form 
            ref={searchRef}
            onSubmit={handleSearch}
            className="hidden lg:flex relative items-center bg-gray-50 px-4 py-2.5 rounded-2xl border border-outline-variant/10 shadow-inner focus-within:ring-4 focus-within:ring-primary/10 transition-all"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search temples..."
              className="bg-transparent border-none focus:ring-0 text-sm w-44 font-bold placeholder:text-on-surface-variant/30 text-secondary"
              onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
              onKeyDown={(e) => {
                if (!showResults || visibleResults.length === 0) return;

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
                  selectActiveResult();
                }
              }}
            />
            <button type="submit" className="flex items-center justify-center ml-2">
              <span className="material-symbols-outlined text-primary text-xl font-black">search</span>
            </button>

            {showResults && visibleResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[130] max-h-80 overflow-y-auto">
                {visibleResults.map((result, index) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleSuggestionSelect(result.slug)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      activeIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary">temple_hindu</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-secondary truncate">{result.name}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-on-surface-variant/60 truncate">
                        <span>{result.city}{result.state ? `, ${result.state}` : ''}</span>
                        {result.deity && (
                          <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-primary">
                            {result.deity}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {showResults && loading && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 px-4 py-3 z-[130] text-sm font-bold text-on-surface-variant">
                Searching...
              </div>
            )}
          </form>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center min-w-11 min-h-11 rounded-xl bg-primary/10 text-primary active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined font-black">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-[105] md:hidden transition-all duration-500 ease-in-out overflow-y-auto overscroll-contain ${
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="flex flex-col min-h-full pt-20 sm:pt-24 px-4 sm:px-5 pb-10 gap-7 sm:gap-8">
          <div className="relative">
            <form 
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-gray-50 px-4 sm:px-5 py-3.5 sm:py-4 rounded-[2rem] border border-outline-variant/10"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Sacred India..."
                className="bg-transparent border-none focus:ring-0 text-base sm:text-lg w-full font-black text-secondary"
                onKeyDown={(e) => {
                  if (!showResults || visibleResults.length === 0) return;

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
                    selectActiveResult();
                  }
                }}
              />
              <button type="submit" className="bg-primary text-white min-w-11 min-h-11 px-3 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="material-symbols-outlined font-black">search</span>
              </button>
            </form>

            {showResults && visibleResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[130] max-h-80 overflow-y-auto">
                {visibleResults.map((result, index) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleSuggestionSelect(result.slug)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      activeIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary">temple_hindu</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-secondary truncate">{result.name}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-on-surface-variant/60 truncate">
                        <span>{result.city}{result.state ? `, ${result.state}` : ''}</span>
                        {result.deity && (
                          <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-primary">
                            {result.deity}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl sm:text-3xl font-serif font-black text-secondary hover:text-primary transition-colors py-2"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto pb-12">
            <Link
              href="/all-temples"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-4 bg-secondary text-white w-full px-5 py-4 rounded-[2rem] shadow-xl font-black min-h-14"
            >
              <span className="material-symbols-outlined">temple_hindu</span>
              Temple Directory
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
