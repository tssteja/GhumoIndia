'use client';

/*
  Fix: Temple directory mobile filters and card rhythm
  Issue: Filter controls and cards needed more consistent spacing on small screens
  Solution: Tightened drawer layout, reduced card density, and improved mobile text clamp
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
// Temple directory with collapsible mobile filters and SEO-friendly card previews.
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Temple } from '@/lib/types';
import { formatCount, isTempleOpen, getInferredState, getInferredDeity } from '@/lib/utils';

interface TempleDirectoryProps {
  initialTemples: Temple[];
  initialQuery?: string;
  initialDeity?: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
].sort();

export default function TempleDirectory({
  initialTemples,
  initialQuery = '',
  initialDeity = '',
}: TempleDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedDeity, setSelectedDeity] = useState<string>(() => {
    if (initialDeity) return initialDeity;
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('deity') || 'All Deities';
    }
    return 'All Deities';
  });
  const [minRating, setMinRating] = useState<number>(0);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const normalizedTemples = useMemo(() => {
    return initialTemples.map((t) => ({
      ...t,
      state: getInferredState(t),
      deity: getInferredDeity(t),
    }));
  }, [initialTemples]);

  const states = useMemo(() => ['All States', ...INDIAN_STATES], []);

  const deities = useMemo(() => {
    const known = [
      'All Deities',
      'Shiva',
      'Vishnu',
      'Krishna',
      'Rama',
      'Hanuman',
      'Ganesha',
      'Durga',
      'Laxmi',
      'Saraswati',
    ];

    const customDeities = normalizedTemples
      .map((temple) => temple.deity?.trim())
      .filter((deity): deity is string => Boolean(deity))
      .filter(
        (deity) =>
          !known.some((item) => item.toLowerCase() === deity.toLowerCase())
      )
      .sort((a, b) => a.localeCompare(b));

    return [...known, ...customDeities];
  }, [normalizedTemples]);

  const filteredTemples = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return normalizedTemples.filter((temple) => {
      const matchQuery =
        !query ||
        temple.name.toLowerCase().includes(query) ||
        temple.city.toLowerCase().includes(query) ||
        (temple.deity && temple.deity.toLowerCase().includes(query));

      const matchState =
        selectedState === 'All States' || temple.state === selectedState;
      const matchDeity =
        selectedDeity === 'All Deities' ||
        temple.deity?.toLowerCase() === selectedDeity.toLowerCase();
      const matchRating = temple.rating >= minRating;
      const isOpen = openNowOnly
        ? isTempleOpen(temple.timings?.open, temple.timings?.close)
        : true;

      return matchQuery && matchState && matchDeity && matchRating && isOpen;
    });
  }, [
    normalizedTemples,
    searchQuery,
    selectedState,
    selectedDeity,
    minRating,
    openNowOnly,
  ]);

  const groupedTemples = useMemo(() => {
    const groups: Record<string, Temple[]> = {};
    filteredTemples.forEach((t) => {
      const state = t.state || 'Other';
      if (!groups[state]) groups[state] = [];
      groups[state].push(t);
    });
    return groups;
  }, [filteredTemples]);

  const sortedStates = useMemo(
    () => Object.keys(groupedTemples).sort(),
    [groupedTemples]
  );

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedState !== 'All States' ||
    selectedDeity !== 'All Deities' ||
    minRating > 0 ||
    openNowOnly;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('All States');
    setSelectedDeity('All Deities');
    setMinRating(0);
    setOpenNowOnly(false);
    setIsMobileFiltersOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Mobile Filters */}
      <div className="md:hidden -mx-4 px-4">
        <div className="relative z-30 bg-white/90 backdrop-blur-2xl p-3 rounded-[1.75rem] border border-white/70 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40">
              Filters
            </p>
            <p className="text-sm font-black text-secondary">
              {filteredTemples.length} results
            </p>
          </div>
          <button
            onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
            className="flex items-center justify-center gap-2 min-h-12 px-4 py-2.5 rounded-2xl bg-primary text-white font-black text-sm shadow-lg touch-manipulation"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isMobileFiltersOpen ? 'expand_less' : 'tune'}
            </span>
            {isMobileFiltersOpen ? 'Close' : 'Filter'}
          </button>
        </div>

        {isMobileFiltersOpen && (
          <div className="mt-3 bg-white/95 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/70 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/40">
                search
              </span>
              <input
                type="text"
                placeholder="Filter by name, city or deity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-outline-variant/10 rounded-2xl text-sm sm:text-base font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-white border border-outline-variant/10 rounded-2xl text-sm sm:text-base font-black appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm cursor-pointer"
                >
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-primary/40">
                  expand_more
                </span>
              </div>

              <div className="relative">
                <select
                  value={selectedDeity}
                  onChange={(e) => setSelectedDeity(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-white border border-outline-variant/10 rounded-2xl text-sm sm:text-base font-black appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm cursor-pointer"
                >
                  {deities.map((deity) => (
                    <option key={deity} value={deity}>
                      {deity}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-primary/40">
                  expand_more
                </span>
              </div>

              <div className="flex bg-gray-50/50 p-1.5 rounded-2xl border border-outline-variant/10 overflow-x-auto">
                {[0, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap min-h-11 ${
                      minRating === r
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-on-surface-variant hover:bg-white'
                    }`}
                  >
                    {r === 0 ? 'Any Rating' : `${r}+ ★`}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setOpenNowOnly(!openNowOnly)}
                className={`flex items-center justify-center gap-2 min-h-12 px-5 py-3 rounded-2xl text-sm font-black transition-all border ${
                  openNowOnly
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-white text-on-surface-variant border-outline-variant/10 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    openNowOnly ? 'bg-white' : 'bg-emerald-500'
                  }`}
                />
                Open Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block sticky top-20 z-40 -mx-4 md:mx-0 px-4 md:px-0">
        <div className="bg-white/80 backdrop-blur-2xl p-4 md:p-6 rounded-[2rem] border border-white/60 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/40 group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              placeholder="Filter by name, city or deity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-outline-variant/10 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group min-w-[160px]">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-white border border-outline-variant/10 rounded-2xl text-sm font-black appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm cursor-pointer"
              >
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-primary/40">
                expand_more
              </span>
            </div>

            <div className="relative group min-w-[160px]">
              <select
                value={selectedDeity}
                onChange={(e) => setSelectedDeity(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-white border border-outline-variant/10 rounded-2xl text-sm font-black appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm cursor-pointer"
              >
                {deities.map((deity) => (
                  <option key={deity} value={deity}>
                    {deity}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-primary/40">
                expand_more
              </span>
            </div>

            <div className="flex bg-gray-50/50 p-1.5 rounded-2xl border border-outline-variant/10">
              {[0, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                    minRating === r
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-on-surface-variant hover:bg-white'
                  }`}
                >
                  {r === 0 ? 'Any Rating' : `${r}+ ★`}
                </button>
              ))}
            </div>

            <button
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all border ${
                openNowOnly
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-white text-on-surface-variant border-outline-variant/10 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  openNowOnly ? 'bg-white' : 'bg-emerald-500'
                }`}
              />
              Open Now
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-black text-on-surface-variant/60 uppercase tracking-widest">
          Found {filteredTemples.length} Sacred Locations
        </p>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-black text-primary hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* State-wise Listing */}
      <div className="space-y-10 sm:space-y-12 pb-20">
        {sortedStates.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-outline-variant/10 shadow-sm animate-in fade-in zoom-in duration-700">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl text-primary/40">
                temple_hindu
              </span>
            </div>
            <h3 className="text-2xl font-serif font-black text-secondary mb-2">
              No Temples Found
            </h3>
            <p className="text-on-surface-variant max-w-sm mx-auto font-medium">
              Try adjusting your filters or search keywords to find sacred sites.
            </p>
          </div>
        ) : (
          sortedStates.map((state) => (
            <section
              key={state}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/20">
                  {state.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-secondary tracking-tight">
                    {state}
                  </h2>
                  <p className="text-[10px] text-on-surface-variant font-black tracking-[0.2em] uppercase opacity-50">
                    {groupedTemples[state].length} Sacred Destinations
                  </p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/20 to-transparent ml-4" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {groupedTemples[state].map((temple) => (
                  <Link
                    key={temple.id}
                    href={`/temple/${temple.slug}`}
                    className="group bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm border border-outline-variant/5 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500"
                  >
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      {temple.photos?.[0] ? (
                        <img
                          src={temple.photos[0]}
                          alt={temple.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                          <span className="material-symbols-outlined text-6xl text-primary/20">
                            temple_hindu
                          </span>
                        </div>
                      )}

                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl px-3 py-1.5 flex items-center gap-1 shadow-xl border border-white/50">
                        <span
                          className="material-symbols-outlined text-primary text-sm font-black"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="text-sm font-black text-secondary">
                          {temple.rating}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <div
                          className={`px-4 py-1.5 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-2 ${
                            isTempleOpen(temple.timings?.open, temple.timings?.close)
                              ? 'bg-emerald-500/80 text-white border-emerald-400/50'
                              : 'bg-red-500/80 text-white border-red-400/50'
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isTempleOpen(temple.timings?.open, temple.timings?.close)
                                ? 'bg-white animate-pulse'
                                : 'bg-white/50'
                            }`}
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {isTempleOpen(temple.timings?.open, temple.timings?.close)
                              ? 'Open Now'
                              : 'Closed'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col h-full">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
                        {temple.name}
                      </h3>
                      <div className="flex items-center gap-2 text-on-surface-variant/70 mb-4">
                        <span className="material-symbols-outlined text-primary text-lg">
                          location_on
                        </span>
                        <span className="text-sm font-bold truncate text-stone-700">
                          {temple.city}
                          {temple.state ? `, ${temple.state}` : ''}
                        </span>
                      </div>

                      {temple.description && (
                        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed line-clamp-2 sm:line-clamp-3 opacity-80 mb-4">
                          {temple.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                        <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-40">
                          {formatCount(temple.ratingCount)} Reviews
                        </span>
                        {temple.videos && temple.videos.length > 0 && (
                          <div className="flex items-center gap-1 text-secondary">
                            <span className="material-symbols-outlined text-lg">
                              play_circle
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {temple.videos.length} Videos
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
