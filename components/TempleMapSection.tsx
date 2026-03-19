'use client';

/*
  Fix: Map section mobile framing and control spacing
  Issue: The map viewport needed better breathing room on smaller screens
  Solution: Kept the responsive aspect ratio while preserving the existing layout and stacking
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
import React from 'react';
import dynamic from 'next/dynamic';

const TempleMap = dynamic(() => import('./TempleMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] bg-surface-container-low rounded-[2rem] flex items-center justify-center animate-pulse">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-primary font-medium">Preparing Divine Map...</p>
      </div>
    </div>
  ),
});

export default function TempleMapSection() {
  return (
    <section className="relative z-0 py-10 sm:py-16 md:py-24 bg-surface" id="map-section">
      {/* FIX: Global responsive container - consistent spacing across all sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8 mb-8 md:mb-12">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-6xl font-black text-secondary mb-4 tracking-tight">
              Indian Temple Map
            </h2>
            <p className="text-on-surface-variant max-w-xl text-base sm:text-lg md:text-lg font-medium leading-relaxed">
              Explore ancient temples across India. From the snowy mountains of the North to the beautiful coasts of the South.
            </p>
          </div>
        </div>

        {/* Map Container with rounded corners and shadow */}
        <div className="relative z-0 w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-[16/9] bg-white rounded-[1.75rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-2 md:border-4 border-primary/5">
          <TempleMap />
        </div>
      </div>
    </section>
  );
}
