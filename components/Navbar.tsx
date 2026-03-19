'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/temples?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); 
      setIsMenuOpen(false);
    }
  };

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
            onSubmit={handleSearch}
            className="hidden lg:flex items-center bg-gray-50 px-4 py-2 rounded-2xl border border-outline-variant/10 shadow-inner focus-within:ring-4 focus-within:ring-primary/10 transition-all"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search temples..."
              className="bg-transparent border-none focus:ring-0 text-sm w-40 font-bold placeholder:text-on-surface-variant/30 text-secondary"
            />
            <button type="submit" className="flex items-center justify-center ml-2">
              <span className="material-symbols-outlined text-primary text-xl font-black">search</span>
            </button>
          </form>

          <button className="hidden md:flex material-symbols-outlined text-secondary p-2.5 bg-secondary/5 hover:bg-secondary/10 rounded-2xl transition-all border border-secondary/5">
            account_circle
          </button>

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
      <div className={`fixed inset-0 bg-white z-[105] md:hidden transition-all duration-500 ease-in-out ${
        isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="flex flex-col h-full pt-24 px-6 gap-8">
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
                className="text-3xl font-serif font-black text-secondary hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-auto pb-12">
            <p className="text-xs font-black text-on-surface-variant/30 uppercase tracking-[0.3em] mb-4">Account</p>
            <button className="flex items-center gap-4 bg-secondary text-white w-full p-5 rounded-[2rem] shadow-xl font-black">
              <span className="material-symbols-outlined">account_circle</span>
              Sign In to Your Journey
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
