'use client';

import React from 'react';
import Link from 'next/link';
import type { Temple } from '@/lib/types';
import { formatCount } from '@/lib/utils';
import YouTubeEmbed from './YouTubeEmbed';

interface TempleSidebarProps {
  temple: Temple | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TempleSidebar({
  temple,
  isOpen,
  onClose,
}: TempleSidebarProps) {
  if (!temple) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white z-40 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        {/* Header with image */}
        <div className="relative h-56 md:h-64 overflow-hidden">
          {temple.photos?.[0] ? (
            <img
              src={temple.photos[0]}
              alt={temple.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-7xl">🛕</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Temple name overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-1">{temple.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-amber-300 text-sm">
                {'★'.repeat(Math.round(temple.rating))}
              </span>
              <span className="text-white/90 text-sm">
                {temple.rating} ({formatCount(temple.ratingCount)} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Location</p>
              <p className="text-gray-800">{temple.address || `${temple.city}, ${temple.state}`}</p>
            </div>
          </div>

          {/* Description */}
          {temple.description && (
            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100">
              <p className="text-gray-700 text-sm leading-relaxed">
                {temple.description}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Link
              href={`/temple/${temple.slug}`}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl py-3 px-4 font-semibold text-center hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
            >
              View Temple Page
            </Link>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${temple.latitude},${temple.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors border border-blue-200"
              title="Get Directions"
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </a>
          </div>

          {/* Top Videos */}
          {temple.videos && temple.videos.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🎥 Top Travel Videos
              </h3>
              <div className="space-y-3">
                {temple.videos.slice(0, 3).map((video, i) => (
                  <YouTubeEmbed
                    key={video.youtubeVideoId || i}
                    videoId={video.youtubeVideoId}
                    title={video.title}
                    compact
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
