'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/temples?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear after search
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-md transition-all duration-300 border-b border-primary/10">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>
            temple_hindu
          </span>
          <span className="text-2xl font-serif font-black text-secondary tracking-tight">
            Ghumo<span className="text-primary-container">India</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-bold tracking-tight">
          <Link href="/" className="text-primary hover:opacity-80 transition-opacity">
            Home
          </Link>
          <a href="/#map-section" className="text-on-surface-variant hover:text-primary transition-colors">
            Temple Map
          </a>
          <Link href="/temples" className="text-on-surface-variant hover:text-primary transition-colors">
            All Temples
          </Link>
          <Link href="/festivals" className="text-on-surface-variant hover:text-primary transition-colors">
            Festivals
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <form 
            onSubmit={handleSearch}
            className="hidden lg:flex items-center bg-surface-container-high px-4 py-2 rounded-xl border border-outline-variant/30 shadow-inner"
          >
            <button type="submit" className="flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">search</span>
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search temples..."
              className="bg-transparent border-none focus:ring-0 text-sm w-48 font-semibold placeholder:text-on-surface-variant/40"
            />
          </form>
          <button className="material-symbols-outlined text-secondary p-2 bg-secondary/5 hover:bg-secondary/10 rounded-xl transition-all border border-secondary/10">
            account_circle
          </button>
        </div>
      </nav>
    </header>
  );
}
