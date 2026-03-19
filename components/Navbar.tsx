'use client';

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
  const router = useRouter();
  const searchRef = useRef<HTMLFormElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/temples?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); 
      setResults([]);
      setShowResults(false);
      setIsMenuOpen(false);
    }
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
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/temples/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowResults(true);
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
    { name: 'All Temples', href: '/temples' },
    { name: 'Festivals', href: '/festivals' },
  ];

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
            className="hidden lg:flex relative items-center bg-gray-50 px-4 py-2 rounded-2xl border border-outline-variant/10 shadow-inner focus-within:ring-4 focus-within:ring-primary/10 transition-all"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search temples..."
              className="bg-transparent border-none focus:ring-0 text-sm w-40 font-bold placeholder:text-on-surface-variant/30 text-secondary"
              onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
            />
            <button type="submit" className="flex items-center justify-center ml-2">
              <span className="material-symbols-outlined text-primary text-xl font-black">search</span>
            </button>

            {showResults && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[120] max-h-80 overflow-y-auto">
                {results.slice(0, 6).map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      setSearchQuery(result.name);
                      setShowResults(false);
                      router.push(`/temple/${result.slug}`);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-primary">temple_hindu</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-secondary truncate">{result.name}</span>
                      <span className="block text-[11px] font-semibold text-on-surface-variant/60 truncate">
                        {result.city}{result.state ? `, ${result.state}` : ''}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {showResults && loading && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 px-4 py-3 z-[120] text-sm font-bold text-on-surface-variant">
                Searching...
              </div>
            )}
          </form>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary active:scale-90 transition-all"
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
        <div className="flex flex-col min-h-full pt-24 px-5 pb-10 gap-8">
          <form 
            onSubmit={handleSearch}
            className="flex items-center bg-gray-50 px-5 py-4 rounded-[2rem] border border-outline-variant/10"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Sacred India..."
              className="bg-transparent border-none focus:ring-0 text-lg w-full font-black text-secondary"
            />
            <button type="submit" className="ml-2 bg-primary text-white p-2 rounded-2xl shadow-lg">
              <span className="material-symbols-outlined font-black">search</span>
            </button>
          </form>

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
              href="/temples"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 bg-secondary text-white w-full p-5 rounded-[2rem] shadow-xl font-black justify-center"
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
