'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 border-t-4 border-primary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <span className="material-symbols-outlined text-primary text-4xl transform group-hover:rotate-12 transition-transform">
                temple_hindu
              </span>
              <span className="text-3xl font-serif font-black text-primary tracking-tighter">
                GhumoIndia
              </span>
            </Link>
            <p className="text-on-surface-variant leading-relaxed text-base font-medium">
              Your guide to discovering the ancient temples and spiritual heritage of India.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-black text-secondary mb-6 uppercase tracking-widest text-[10px]">
              Explore
            </h4>
            <ul className="space-y-4">
              <li><Link href="/temples" className="text-on-surface hover:text-primary transition-colors font-black text-sm">Popular Cities</Link></li>
              <li><Link href="/festivals" className="text-on-surface hover:text-primary transition-colors font-black text-sm">Temple Festivals</Link></li>
              <li><Link href="/#map-section" className="text-on-surface hover:text-primary transition-colors font-black text-sm">Indian Temple Map</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-serif font-black text-secondary mb-6 uppercase tracking-widest text-[10px]">
              Guides
            </h4>
            <ul className="space-y-4">
              <li><Link href="/festivals" className="text-on-surface hover:text-primary transition-colors font-black text-sm">Aarti Timings</Link></li>
              <li><Link href="/temples" className="text-on-surface hover:text-primary transition-colors font-black text-sm">Visit Rules</Link></li>
              <li><Link href="/temples" className="text-on-surface hover:text-primary transition-colors font-black text-sm">Travel Guides</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] border-2 border-primary/5 shadow-sm">
            <h4 className="font-serif font-black text-on-surface mb-6">Stay Connected</h4>
            <div className="flex gap-4">
              <Link href="/festivals" className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg" aria-label="Temple festivals">
                <span className="material-symbols-outlined text-2xl font-black">festival</span>
              </Link>
              <a href="https://github.com/tssteja/GhumoIndia" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-on-surface flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg" aria-label="GitHub repository">
                <span className="material-symbols-outlined text-2xl font-black">code</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-on-surface-variant text-[10px] font-black tracking-widest uppercase opacity-40">
            © 2026 GhumoIndia. Built with Devotion for India.
          </p>
          <div className="flex gap-8 opacity-40">
            <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
