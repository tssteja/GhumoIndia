'use client';

import React from 'react';
import Link from 'next/link';
import type { Temple, TempleVideo } from '@/lib/types';
import { formatCount } from '@/lib/utils';
import { getEnhancedTempleData } from '@/lib/templeData';
import VideoGallery from '@/components/VideoGallery';
import NearbyTemples from '@/components/NearbyTemples';
import ShareButtons from '@/components/ShareButtons';
import AdSlot from '@/components/AdSlot';
import TempleTimings from '@/components/TempleTimings';
import TempleGuidelines from '@/components/TempleGuidelines';
import FestivalAlert from '@/components/FestivalAlert';

interface TempleDetailClientProps {
  temple: Temple;
  videos: TempleVideo[];
}

/**
 * Temple Visit Essentials — contextual affiliate suggestions.
 * These are genuinely useful for travelers, not just filler ads.
 */
const VISIT_ESSENTIALS = [
  {
    name: 'Temple Offerings Kit',
    description: 'Flowers, incense, coconut & pooja essentials',
    emoji: '🪷',
    searchQuery: 'temple+pooja+essentials+kit',
    color: 'from-pink-50 to-rose-50',
    border: 'border-pink-100',
    textColor: 'text-pink-900',
    subColor: 'text-pink-700',
  },
  {
    name: 'Travel Guidebook',
    description: 'Maps, temple history & travel tips for India',
    emoji: '📖',
    searchQuery: 'India+temple+travel+guidebook',
    color: 'from-blue-50 to-indigo-50',
    border: 'border-blue-100',
    textColor: 'text-blue-900',
    subColor: 'text-blue-700',
  },
  {
    name: 'Comfortable Footwear',
    description: 'Easy slip-on shoes for temple visits',
    emoji: '👡',
    searchQuery: 'slip+on+shoes+temple+visit+comfortable',
    color: 'from-amber-50 to-yellow-50',
    border: 'border-amber-100',
    textColor: 'text-amber-900',
    subColor: 'text-amber-700',
  },
];

/**
 * Best Time to Visit — adds genuine value for travelers.
 * Uses the temple's state to give seasonal suggestions.
 */
function getBestTimeToVisit(state: string): { season: string; months: string; tip: string } {
  const stateGuide: Record<string, { season: string; months: string; tip: string }> = {
    'Tamil Nadu': { season: 'Winter', months: 'Oct – Mar', tip: 'Pleasant weather, major festivals like Pongal & Navratri' },
    'Karnataka': { season: 'Winter', months: 'Oct – Feb', tip: 'Cool weather ideal for Hampi & Mysore temples' },
    'Kerala': { season: 'Winter', months: 'Sep – Mar', tip: 'Post-monsoon greenery, Onam & Thrissur Pooram season' },
    'Rajasthan': { season: 'Winter', months: 'Oct – Mar', tip: 'Avoid extreme summers; desert festivals in winter' },
    'Uttar Pradesh': { season: 'Winter', months: 'Oct – Mar', tip: 'Best for Varanasi Ghat visits & Kashi Vishwanath darshan' },
    'Maharashtra': { season: 'Winter', months: 'Nov – Feb', tip: 'Comfortable for Shirdi, Trimbakeshwar & Ajanta visits' },
    'Andhra Pradesh': { season: 'Winter', months: 'Nov – Feb', tip: 'Tirupati is busiest during Brahmotsavam (Sep–Oct)' },
    'Telangana': { season: 'Winter', months: 'Oct – Feb', tip: 'Mild weather for exploring Hyderabad\'s historic temples' },
    'Gujarat': { season: 'Winter', months: 'Nov – Feb', tip: 'Perfect for Somnath, Dwarka & Rann of Kutch trips' },
    'Odisha': { season: 'Winter', months: 'Oct – Mar', tip: 'Ideal for Jagannath Puri; Rath Yatra in Jun-Jul' },
    'West Bengal': { season: 'Winter', months: 'Oct – Feb', tip: 'Durga Puja (Oct) is the biggest festival season' },
    'Madhya Pradesh': { season: 'Winter', months: 'Oct – Mar', tip: 'Great for Ujjain, Omkareshwar & Khajuraho visits' },
    'Delhi': { season: 'Winter', months: 'Oct – Mar', tip: 'Avoid summer heat; Akshardham is stunning in winter light' },
    'Uttarakhand': { season: 'Summer', months: 'May – Jun, Sep – Oct', tip: 'Char Dham Yatra season; roads may close in winter' },
    'Goa': { season: 'Winter', months: 'Nov – Feb', tip: 'Pleasant beach weather; combine temple visits with coastal trips' },
  };

  return stateGuide[state] || {
    season: 'Winter',
    months: 'Oct – Mar',
    tip: 'Most of India has pleasant weather during winter months',
  };
}

export default function TempleDetailClient({
  temple,
  videos,
}: TempleDetailClientProps) {
  const allVideos = videos.length > 0 ? videos : (temple.videos as TempleVideo[]) || [];
  const bestTime = getBestTimeToVisit(temple.state);
  const enhancedData = getEnhancedTempleData(temple);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      {/* Hero Section */}
      <div className="relative h-[34vh] sm:h-[40vh] md:h-[50vh] overflow-hidden">
        {temple.photos?.[0] ? (
          <img
            src={temple.photos[0]}
            alt={temple.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 flex items-center justify-center">
            <span className="text-[120px] opacity-50">🛕</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-4 left-4 md:top-24 md:left-8 flex items-center gap-2 bg-white/25 backdrop-blur-md rounded-full px-4 py-2.5 md:px-4 md:py-2 text-white hover:bg-white/30 transition-all active:scale-95 shadow-lg border border-white/20 z-30 touch-manipulation"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-semibold">Back</span>
        </Link>

        {/* Share buttons (top right) */}
        <div className="absolute top-4 right-4 hidden md:block md:top-28 md:right-8 z-20">
          <ShareButtons
            title={temple.name}
            slug={temple.slug}
            description={`Visit ${temple.name} in ${temple.city}, ${temple.state} — rated ${temple.rating}★ by ${formatCount(temple.ratingCount)} visitors. Discover travel videos & get directions on GhumoIndia.`}
          />
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10 bg-gradient-to-t from-black/90 to-transparent">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-5xl font-black text-white mb-2 md:mb-3 leading-tight tracking-tight drop-shadow-2xl">
              {temple.name}
            </h1>
            <div className="flex items-center gap-4">
              <a 
                href={temple.placeId ? `https://search.google.com/local/reviews?placeid=${temple.placeId}` : `https://www.google.com/search?q=${encodeURIComponent(temple.name + ' ' + temple.city + ' temple reviews')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-primary px-4 py-1 rounded-xl text-white text-xs font-black shadow-lg hover:shadow-primary/30 transition-shadow group/rating"
                title="View Google Reviews"
              >
                <span className="material-symbols-outlined text-xs group-hover/rating:scale-125 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                {temple.rating}
              </a>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.name + ' ' + temple.city + ' temple')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col group/location hover:bg-white/10 px-2 py-1 rounded-lg transition-colors"
                title="Open in Google Maps"
              >
                <span className="material-symbols-outlined text-primary text-sm font-black group-hover/location:-translate-y-1 transition-transform">location_on</span>
                <span className="text-on-surface font-black text-sm">
                  {temple.city}
                  {temple.state ? `, ${temple.state}` : ''}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-8 py-6 md:py-12 space-y-8 md:space-y-10">
        <div className="md:hidden">
          <ShareButtons
            title={temple.name}
            slug={temple.slug}
            description={`Visit ${temple.name} in ${temple.city}, ${temple.state} â€” rated ${temple.rating}â˜… by ${formatCount(temple.ratingCount)} visitors. Discover travel videos & get directions on GhumoIndia.`}
          />
        </div>
        
        {/* Important Update / Festival Alert */}
        {enhancedData.festivals && enhancedData.festivals.length > 0 && (
          <FestivalAlert festivals={enhancedData.festivals} />
        )}

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* About Card */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {temple.description ||
                  `${temple.name} is a renowned temple located in ${temple.city}, India. It is rated ${temple.rating} stars based on ${formatCount(temple.ratingCount)} visitor reviews.`}
              </p>
              {temple.address && (
                <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{temple.address}</span>
                </div>
              )}
            </div>

            {/* Timings Section */}
            <TempleTimings timings={enhancedData.timings} />
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-3">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Plan Your Visit
              </h2>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${temple.latitude},${temple.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-3 transition-colors group touch-manipulation"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-blue-800 text-sm group-hover:underline">
                    Get Directions
                  </p>
                  <p className="text-xs text-blue-600">Open in Google Maps</p>
                </div>
              </a>

            {/* Affiliate: Hotels */}
            <a
              href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(temple.name + ' ' + temple.city)}&latitude=${temple.latitude}&longitude=${temple.longitude}&aid=YOUR_BOOKING_AFFILIATE_ID`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-amber-50 hover:bg-amber-100 rounded-xl p-3 transition-colors group border border-amber-200 touch-manipulation"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-amber-900 text-sm group-hover:underline">
                  Find Hotels Nearby
                </p>
                <p className="text-xs text-amber-700">Best rates on Booking.com</p>
              </div>
            </a>

            {/* Affiliate: Travel/Cabs */}
            <a
              href={`https://www.makemytrip.com/cab-booking/?from=${encodeURIComponent(temple.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-indigo-50 hover:bg-indigo-100 rounded-xl p-3 transition-colors group border border-indigo-200 touch-manipulation"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-indigo-900 text-sm group-hover:underline">
                  Book a Cab
                </p>
                <p className="text-xs text-indigo-700">via MakeMyTrip</p>
              </div>
            </a>
          </div>

          {/* Guidelines Card */}
          <TempleGuidelines guidelines={enhancedData.guidelines} />
        </div>
      </div>

        {/* Best Time to Visit */}
        <section className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-5 sm:p-6 border border-teal-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center shrink-0 shadow-md">
              <span className="text-2xl">🗓️</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-teal-900 mb-1">
                Best Time to Visit
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-sm font-semibold">
                  ☀️ {bestTime.season}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/80 text-teal-700 rounded-full px-3 py-1 text-sm font-medium border border-teal-200">
                  📅 {bestTime.months}
                </span>
              </div>
              <p className="text-sm text-teal-700 leading-relaxed">
                {bestTime.tip}
              </p>
            </div>
          </div>
        </section>

        {/* AdSlot — between info and videos */}
        <AdSlot format="horizontal" label="Sponsored" />

        {/* Video Gallery */}
        <section>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              🎥 Travel Videos
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {allVideos.length > 0 && (
                <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                  {allVideos.length} videos
                </span>
              )}
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(temple.name + ' ' + temple.city + ' temple travel')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-medium transition-colors border border-red-200 group"
              >
                <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="group-hover:underline">Search on YouTube</span>
              </a>
            </div>
          </div>
          <VideoGallery videos={allVideos} />
        </section>

        {/* Temple Visit Essentials — Affiliate Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎒 Temple Visit Essentials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {VISIT_ESSENTIALS.map((item) => (
              <a
                key={item.name}
                href={`https://www.amazon.in/s?k=${item.searchQuery}&tag=YOUR_AMAZON_AFFILIATE_TAG`}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 border ${item.border} hover:shadow-md transition-all group`}
              >
                <span className="text-2xl block mb-2">{item.emoji}</span>
                <p className={`font-semibold text-sm ${item.textColor} group-hover:underline`}>
                  {item.name}
                </p>
                <p className={`text-xs ${item.subColor} mt-0.5`}>
                  {item.description}
                </p>
                <p className="text-[10px] text-gray-400 mt-2">Shop on Amazon →</p>
              </a>
            ))}
          </div>
        </section>

        {/* Nearby Temples */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            🛕 Nearby Temples
          </h2>
          <NearbyTemples
            latitude={temple.latitude}
            longitude={temple.longitude}
            currentTempleId={temple.id}
          />
        </section>
      </div>

      {/* Support + Footer */}
      <footer className="border-t border-gray-100">
        {/* Support GhumoIndia */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <div className="bg-white rounded-3xl p-8 border-2 border-primary/10 text-center shadow-xl">
            <span className="text-4xl block mb-4">🙏</span>
            <h3 className="font-serif font-black text-2xl text-on-surface mb-2">Support GhumoIndia</h3>
            <p className="text-base text-on-surface-variant mb-6 max-w-md mx-auto font-medium">
              GhumoIndia is a free platform built to help devotees discover India&apos;s ancient temples. Your support helps us grow.
            </p>
            <a
              href="https://buymeacoffee.com/YOUR_HANDLE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-secondary text-white rounded-2xl px-8 py-4 font-black text-base hover:bg-primary transition-all shadow-xl active:scale-95"
            >
              <span className="material-symbols-outlined">coffee</span>
              Support Our Work
            </a>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-primary/5 py-8 text-center text-sm font-black text-on-surface/40 uppercase tracking-widest">
          <p>
            GhumoIndia — Explore India&apos;s Ancient Temples •{' '}
            <Link href="/" className="text-primary hover:underline">
              Map View
            </Link>
            {' • '}
            <Link href="/temples" className="text-primary hover:underline">
              View All Temples
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
