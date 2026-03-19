'use client';

/*
  Fix: Near-me panel spacing and mobile readability
  Issue: Radius controls and result cards felt dense on phone-sized screens
  Solution: Tightened padding, card spacing, and tap targets while keeping route filtering intact
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
// Responsive near-me results panel with radius, sorting, and manual city fallback.
import React from 'react';
import type { TempleMarkerData } from '@/lib/types';

type SortOption = 'nearest' | 'famous' | 'visited';

interface NearMePanelProps {
  isOpen: boolean;
  loadingLocation: boolean;
  locationLabel?: string;
  radiusKm: number;
  sortBy: SortOption;
  temples: TempleMarkerData[];
  locationMode: 'idle' | 'loading' | 'ready' | 'denied' | 'unsupported';
  cityQuery: string;
  cityError?: string;
  onClose: () => void;
  onRadiusChange: (radius: number) => void;
  onSortChange: (sort: SortOption) => void;
  onCityQueryChange: (value: string) => void;
  onUseCity: () => void;
  onSelectTemple: (slug: string) => void;
}

const RADIUS_OPTIONS = [25, 50, 100, 250];

export default function NearMePanel({
  isOpen,
  loadingLocation,
  locationLabel,
  radiusKm,
  sortBy,
  temples,
  locationMode,
  cityQuery,
  cityError,
  onClose,
  onRadiusChange,
  onSortChange,
  onCityQueryChange,
  onUseCity,
  onSelectTemple,
}: NearMePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-[calc(100%-32px)] max-w-md md:inset-auto md:top-6 md:right-6 md:bottom-6 md:left-auto md:mx-0 md:w-[380px] z-[80] flex max-h-[80vh] flex-col rounded-t-3xl md:rounded-[1.75rem] bg-white/95 backdrop-blur-2xl border border-primary/10 shadow-2xl overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-4 py-4 border-b border-outline-variant/10 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Near Me</p>
          <h3 className="mt-1 text-lg font-serif font-black text-on-surface">Temples Near You</h3>
          <p className="text-xs text-on-surface-variant">
            {loadingLocation
              ? 'Finding your location...'
              : locationMode === 'ready'
                ? locationLabel || 'Location set'
                : 'Use GPS or enter a city'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface-variant hover:text-primary shadow-sm touch-manipulation"
          aria-label="Close near me panel"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {RADIUS_OPTIONS.map((radius) => (
            <button
              key={radius}
              type="button"
              onClick={() => onRadiusChange(radius)}
              className={`rounded-2xl px-3 py-3 text-sm font-black transition-all border touch-manipulation min-h-12 ${
                radiusKm === radius
                  ? 'bg-primary text-white border-primary shadow-lg'
                  : 'bg-white text-on-surface-variant border-outline-variant/10 hover:bg-gray-50'
              }`}
            >
              {radius} km
            </button>
          ))}
        </div>

        <div className="relative">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/40">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="mt-2 w-full rounded-2xl border border-outline-variant/10 bg-white px-4 py-3 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10"
          >
            <option value="nearest">Nearest</option>
            <option value="famous">Most famous</option>
            <option value="visited">Most visited</option>
          </select>
        </div>

        {(locationMode === 'denied' || locationMode === 'unsupported') && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
            <p className="text-sm font-black text-amber-900">Location permission not available</p>
            <p className="mt-1 text-xs text-amber-700">Enter a city name to find temples around that area.</p>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={cityQuery}
                onChange={(e) => onCityQueryChange(e.target.value)}
                placeholder="Enter city"
                className="min-w-0 flex-1 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-200/60"
              />
              <button
                type="button"
                onClick={onUseCity}
            className="min-w-12 min-h-12 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-black text-white shadow-lg touch-manipulation"
          >
                Use
              </button>
            </div>
            {cityError && (
              <p className="mt-2 text-xs font-semibold text-red-600">{cityError}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/40">
            Nearby temples
          </p>
          <p className="text-xs font-black text-secondary">
            {temples.length} found
          </p>
        </div>

        <div className="space-y-3">
          {loadingLocation ? (
            <div className="rounded-2xl border border-dashed border-outline-variant/20 p-6 text-center text-sm text-on-surface-variant">
              Waiting for location access...
            </div>
          ) : temples.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-outline-variant/20 p-6 text-center text-sm text-on-surface-variant">
              No temples found within the selected radius.
            </div>
          ) : (
            temples.map((temple) => (
              <button
                key={temple.id}
                type="button"
                onClick={() => onSelectTemple(temple.slug)}
              className="w-full rounded-3xl border border-outline-variant/10 bg-white p-4 text-left shadow-sm hover:shadow-md hover:border-primary/20 transition-all touch-manipulation"
            >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-black text-on-surface truncate">{temple.name}</p>
                    <p className="text-sm text-on-surface-variant truncate">
                      {temple.city}, {temple.state}
                    </p>
                  </div>
                  <span className="flex h-8 items-center justify-center rounded-full bg-primary/10 px-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
                    {temple.distanceKm?.toFixed(1)} km
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-on-surface-variant">
                  {temple.deity && (
                    <span className="inline-flex rounded-full bg-secondary/10 px-2.5 py-1 font-black uppercase tracking-[0.18em] text-secondary">
                      {temple.deity}
                    </span>
                  )}
                  <span>Distance: {temple.distanceKm?.toFixed(1)} km</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
