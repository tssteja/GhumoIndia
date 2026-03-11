'use client';

import React from 'react';
import Link from 'next/link';
import type { Temple, TempleVideo } from '@/lib/types';
import { formatCount } from '@/lib/utils';
import VideoGallery from '@/components/VideoGallery';
import NearbyTemples from '@/components/NearbyTemples';

interface TempleDetailClientProps {
  temple: Temple;
  videos: TempleVideo[];
}

export default function TempleDetailClient({
  temple,
  videos,
}: TempleDetailClientProps) {
  const allVideos = videos.length > 0 ? videos : (temple.videos as TempleVideo[]) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
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

        {/* Back button - Better tap target for mobile */}
        <Link
          href="/"
          className="absolute top-4 left-4 md:top-6 md:left-8 flex items-center gap-2 bg-white/25 backdrop-blur-md rounded-full px-5 py-2.5 md:px-4 md:py-2 text-white hover:bg-white/30 transition-all active:scale-95 shadow-lg border border-white/20 z-20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-semibold">Back to Map</span>
        </Link>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-5xl font-extrabold text-white mb-2 md:mb-3 leading-tight drop-shadow-lg">
              {temple.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <div className="flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm">★</span>
                <span className="text-white font-semibold text-sm">
                  {temple.rating}
                </span>
                <span className="text-white/80 text-xs">
                  ({formatCount(temple.ratingCount)})
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-white text-sm">
                  {temple.city}
                  {temple.state ? `, ${temple.state}` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">
        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* About Card */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Plan Your Visit
            </h2>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${temple.latitude},${temple.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-3 transition-colors group"
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

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${temple.latitude},${temple.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full bg-green-50 hover:bg-green-100 rounded-xl p-3 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-800 text-sm group-hover:underline">
                  View on Map
                </p>
                <p className="text-xs text-green-600">
                  {temple.latitude.toFixed(4)}, {temple.longitude.toFixed(4)}
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Video Gallery */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              🎥 Travel Videos
            </h2>
            {allVideos.length > 0 && (
              <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                {allVideos.length} videos
              </span>
            )}
          </div>
          <VideoGallery videos={allVideos} />
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

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <p>
          TempleMap — Explore India&apos;s Sacred Temples •{' '}
          <Link href="/" className="text-amber-600 hover:underline">
            Back to Map
          </Link>
        </p>
      </footer>
    </div>
  );
}
