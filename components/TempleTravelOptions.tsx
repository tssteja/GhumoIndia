'use client';

/*
  Fix: Travel option card spacing on mobile
  Issue: Affiliate cards could feel too dense in narrow viewport widths
  Solution: Tightened typography and button rhythm while keeping the responsive grid intact
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
// Reusable travel booking cards for hotels, flights, and trains on temple pages.
import React from 'react';
import type { Temple } from '@/lib/types';

interface TempleTravelOptionsProps {
  temple: Temple;
}

const TRAVEL_OPTIONS = [
  {
    key: 'hotels',
    title: 'Hotels near temple city',
    cta: 'Find Hotels',
    icon: 'hotel',
    getUrl: (temple: Temple) =>
      `https://www.makemytrip.com/hotels/?city=${encodeURIComponent(temple.city)}&utm_source=ghumoindia&utm_medium=affiliate&utm_campaign=temple_travel`,
    accent: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
    text: 'text-amber-900',
    subtext: 'text-amber-700',
  },
  {
    key: 'flights',
    title: 'Flights to the nearest airport',
    cta: 'Search Flights',
    icon: 'flight_takeoff',
    getUrl: (temple: Temple) =>
      `https://www.makemytrip.com/flight/search?to=${encodeURIComponent(temple.city)}&utm_source=ghumoindia&utm_medium=affiliate&utm_campaign=temple_travel`,
    accent: 'from-sky-50 to-cyan-50',
    border: 'border-sky-100',
    text: 'text-sky-900',
    subtext: 'text-sky-700',
  },
  {
    key: 'trains',
    title: 'Trains to the nearest station',
    cta: 'Check Trains',
    icon: 'train',
    getUrl: () =>
      'https://www.makemytrip.com/railways/?utm_source=ghumoindia&utm_medium=affiliate&utm_campaign=temple_travel',
    accent: 'from-emerald-50 to-green-50',
    border: 'border-emerald-100',
    text: 'text-emerald-900',
    subtext: 'text-emerald-700',
  },
];

export default function TempleTravelOptions({ temple }: TempleTravelOptionsProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-black text-on-surface">
            Travel Options
          </h3>
          <p className="text-sm sm:text-base text-on-surface-variant">
            Book stays and transport around {temple.city}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {TRAVEL_OPTIONS.map((option) => (
          <a
            key={option.key}
            href={option.getUrl(temple)}
            target="_blank"
            rel="noopener noreferrer"
            className={`group rounded-2xl md:rounded-3xl border ${option.border} bg-gradient-to-br ${option.accent} p-4 md:p-5 shadow-sm hover:shadow-lg transition-all touch-manipulation`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm ${option.text}`}>
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {option.icon}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50">
                Affiliate
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <p className={`font-black text-sm sm:text-base ${option.text}`}>{option.title}</p>
              <p className={`text-sm ${option.subtext}`}>{option.cta}</p>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 text-sm font-black text-on-surface">
              {option.cta}
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
