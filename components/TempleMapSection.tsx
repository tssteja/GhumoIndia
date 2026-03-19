'use client';

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
    <section className="py-24 bg-surface" id="map-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="font-serif text-4xl md:text-6xl font-black text-secondary mb-4 tracking-tight">
              Indian Temple Map
            </h2>
            <p className="text-on-surface-variant max-w-xl text-lg font-medium">
              Explore ancient temples across India. From the snowy mountains of the North to the beautiful coasts of the South.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-3 rounded-xl border-2 border-primary text-sm font-black hover:bg-primary hover:text-white transition-all text-primary shadow-sm bg-white">
              By State
            </button>
            <button className="px-8 py-3 rounded-xl bg-secondary text-white text-sm font-black shadow-lg hover:bg-secondary-container transition-all border-2 border-secondary">
              All India
            </button>
          </div>
        </div>

        {/* Map Container with rounded corners and shadow */}
        <div className="relative w-full aspect-[16/9] bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-primary/5">
          <TempleMap />
        </div>
      </div>
    </section>
  );
}
