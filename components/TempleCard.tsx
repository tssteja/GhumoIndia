'use client';

import React from 'react';
import Link from 'next/link';
import type { Temple } from '@/lib/types';
import { formatCount } from '@/lib/utils';

interface TempleCardProps {
  temple: Temple & { distance?: number };
  compact?: boolean;
}

export default function TempleCard({ temple, compact }: TempleCardProps) {
  return (
    <Link href={`/temple/${temple.slug}`}>
      <div
        className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200 ${
          compact ? 'flex gap-3 p-3' : ''
        }`}
      >
        {/* Image */}
        <div
          className={`relative overflow-hidden ${
            compact ? 'w-24 h-24 rounded-xl shrink-0' : 'h-48'
          }`}
        >
          {temple.photos?.[0] ? (
            <img
              src={temple.photos[0]}
              alt={temple.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center">
              <span className={compact ? 'text-3xl' : 'text-5xl'}>🛕</span>
            </div>
          )}
          {!compact && temple.rating && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <span className="text-amber-500 text-sm">★</span>
              <span className="text-sm font-semibold text-gray-800">
                {temple.rating}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={compact ? 'flex-1 min-w-0' : 'p-4'}>
          <h3
            className={`font-bold text-gray-900 group-hover:text-amber-700 transition-colors ${
              compact ? 'text-sm truncate' : 'text-lg mb-1'
            }`}
          >
            {temple.name}
          </h3>

          <div className="flex items-center gap-1 text-gray-500">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <span className={`${compact ? 'text-xs' : 'text-sm'} truncate`}>
              {temple.city}
              {temple.state ? `, ${temple.state}` : ''}
            </span>
          </div>

          {compact && temple.rating && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-amber-500 text-xs">★</span>
              <span className="text-xs font-medium text-gray-600">
                {temple.rating} ({formatCount(temple.ratingCount)})
              </span>
            </div>
          )}

          {!compact && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">
                {formatCount(temple.ratingCount)} reviews
              </span>
              {temple.videos && temple.videos.length > 0 && (
                <span className="text-xs text-amber-600 font-medium">
                  🎥 {temple.videos.length} videos
                </span>
              )}
            </div>
          )}

          {(temple as Temple & { distance?: number }).distance !== undefined && (
            <span className="inline-block mt-1 text-xs text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
              {(temple as Temple & { distance?: number }).distance} km away
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
