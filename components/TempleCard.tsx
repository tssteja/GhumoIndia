'use client';

/*
  Fix: Temple card mobile spacing and footer alignment
  Issue: Card heights and action rows could feel uneven in tight mobile grids
  Solution: Standardized spacing, clamping, and footer stacking for small screens
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
// Reusable temple card with consistent layout for featured and nearby sections.
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
      {/* FIX: Consistent temple card layout with responsive spacing
          Primary classes: rounded-xl shadow-sm p-4 flex flex-col gap-3 */}
      <div
        className={`group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-primary/10 h-full flex flex-col ${
          compact ? 'p-3 sm:p-4 gap-2 sm:gap-3' : 'p-4 sm:p-6 gap-4 sm:gap-5'
        }`}
      >
        {/* Image Section */}
        <div
          className={`relative overflow-hidden ${
            compact ? 'h-32 sm:h-40 rounded-xl shrink-0' : 'h-48 sm:h-56 rounded-2xl'
          }`}
        >
          {temple.photos?.[0] ? (
            <img
              src={temple.photos[0]}
              alt={temple.name}
              loading="lazy"
              decoding="async"
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
        <div className={`flex flex-col flex-1 ${compact ? 'min-w-0' : ''}`}>
          <div className="flex items-center gap-2 mb-2 text-secondary font-black text-[10px] tracking-[0.2em] uppercase">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            <span className="text-stone-700 font-semibold text-xs dark:text-stone-200">{temple.state || temple.city || 'India'}</span>
          </div>
          
          <h3
            className={`font-serif font-black text-on-surface group-hover:text-primary transition-colors leading-tight tracking-tight ${
              compact ? 'text-base sm:text-lg line-clamp-2' : 'text-lg sm:text-xl mb-3 sm:mb-4'
            }`}
          >
            {temple.name}
          </h3>

          {!compact && temple.description && (
            <p className="text-on-surface-variant mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed text-sm sm:text-base font-medium opacity-80">
              {temple.description}
            </p>
          )}

          {/* Footer Info */}
          <div className={`mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 ${!compact ? 'pt-3 sm:pt-4 border-t border-primary/5' : ''}`}>
            <span className="text-primary font-black flex items-center gap-1.5 text-[10px] sm:text-xs">
              <span className="material-symbols-outlined text-sm sm:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <span className="text-xs">{temple.timings ? `${temple.timings.open} - ${temple.timings.close}` : '4:00 AM - 9:00 PM'}</span>
            </span>
            
            {!compact ? (
              <div className="inline-flex items-center justify-center gap-2 bg-secondary/5 group-hover:bg-secondary px-4 py-2 rounded-lg text-secondary group-hover:text-white font-black transition-all text-xs border border-secondary/10 group/btn w-full sm:w-auto">
                See Details <span className="material-symbols-outlined text-xs group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            ) : (
              temple.distance !== undefined && (
                <span className="flex h-7 items-center justify-center self-start sm:self-auto rounded-full bg-secondary/5 px-3 text-[10px] font-black text-secondary">
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
