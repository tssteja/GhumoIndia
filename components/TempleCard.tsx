'use client';

import React from 'react';
import Link from 'next/link';
import type { Temple } from '@/lib/types';

interface TempleCardProps {
  temple: Temple & { distance?: number };
  compact?: boolean;
}

export default function TempleCard({ temple, compact }: TempleCardProps) {
  return (
    <Link href={`/temple/${temple.slug}`} className="block h-full">
      <div
        className={`group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-primary/10 h-full flex flex-col ${
          compact ? 'p-4 gap-4' : ''
        }`}
      >
        {/* Image Section */}
        <div
          className={`relative overflow-hidden ${
            compact ? 'h-40 rounded-2xl shrink-0' : 'h-64'
          }`}
        >
          {temple.photos?.[0] ? (
            <img
              src={temple.photos[0]}
              alt={temple.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <span className={`material-symbols-outlined ${compact ? 'text-3xl' : 'text-5xl'} text-primary opacity-50`}>
                temple_hindu
              </span>
            </div>
          )}
          
          {!compact && (
            <div className="absolute top-4 left-4 bg-secondary px-4 py-1.5 rounded-xl text-white text-[10px] font-black tracking-widest uppercase shadow-lg border border-white/20">
              {temple.heritageTag || 'Historical Temple'}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={`flex flex-col flex-1 ${compact ? 'min-w-0' : 'p-6 md:p-8'}`}>
          <div className="flex items-center gap-2 mb-2 md:mb-3 text-secondary font-black text-[10px] tracking-[0.2em] uppercase">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            <span className="text-stone-700">{temple.state || temple.city || 'India'}</span>
          </div>
          
          <h3
            className={`font-serif font-black text-on-surface group-hover:text-primary transition-colors leading-tight tracking-tight ${
              compact ? 'text-lg truncate' : 'text-xl md:text-2xl mb-3 md:mb-4'
            }`}
          >
            {temple.name}
          </h3>

          {!compact && temple.description && (
            <p className="text-on-surface-variant mb-8 line-clamp-3 leading-relaxed text-base font-medium opacity-80">
              {temple.description}
            </p>
          )}

          {/* Footer Info */}
          <div className={`mt-auto flex items-center justify-between ${!compact ? 'pt-6 border-t-2 border-primary/5' : 'mt-1'}`}>
            <span className="text-primary font-black flex items-center gap-1.5 text-xs">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              {temple.timings ? `${temple.timings.open} - ${temple.timings.close}` : '4:00 AM - 9:00 PM'}
            </span>
            
            {!compact ? (
              <div className="flex items-center gap-2 bg-secondary/5 group-hover:bg-secondary px-5 py-2.5 rounded-xl text-secondary group-hover:text-white font-black transition-all text-xs border border-secondary/10 group/btn">
                See Details <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            ) : (
              temple.distance !== undefined && (
                <span className="text-xs font-black text-secondary bg-secondary/5 px-3 py-1 rounded-lg">
                  {temple.distance} km
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
