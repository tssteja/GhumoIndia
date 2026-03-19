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
      {/* Backdrop for click-outside closure */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[55]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-surface/95 backdrop-blur-3xl z-[60] shadow-[-20px_0_80px_-20px_rgba(0,0,0,0.3)] transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto border-l border-outline-variant/10`}
      >
        {/* Header with image */}
        <div className="relative h-72 md:h-80 overflow-hidden">
          {temple.photos?.[0] ? (
            <img
              src={temple.photos[0]}
              alt={temple.name}
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-8xl text-on-primary-container opacity-20">temple_hindu</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-white/60 transition-all border border-white/40 shadow-lg group/close"
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
          </button>

          {/* Temple name overlay */}
          <div className="absolute bottom-10 left-8 right-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-secondary text-xs font-black tracking-[0.2em] uppercase">Temple Details</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-on-surface leading-tight mb-4 drop-shadow-sm">{temple.name}</h2>
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
                <span className="text-on-surface-variant text-[10px] font-black tracking-widest uppercase opacity-60 flex items-center gap-1 group-hover/location:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[10px]">location_on</span>
                  {temple.city}, {temple.state}
                </span>
                <span className="text-on-surface-variant text-[10px] font-black tracking-widest uppercase opacity-40">
                  {formatCount(temple.ratingCount)} Devotees
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-4 space-y-10 pb-20">
          {/* Action buttons */}
          <div className="flex gap-4">
            <Link
              href={`/temple/${temple.slug}`}
              className="flex-1 bg-secondary text-white rounded-2xl py-4 px-6 font-black text-center hover:bg-primary transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-secondary/20"
            >
              See Details
              <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">east</span>
            </Link>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${temple.latitude},${temple.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center hover:bg-surface-container transition-colors border-2 border-primary/10 shadow-lg text-secondary"
              title="Get Directions"
            >
              <span className="material-symbols-outlined text-3xl font-black">directions</span>
            </a>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/10">
              <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Best Visit</span>
              </div>
              <p className="font-bold text-sm">Oct — Mar</p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-3xl border border-outline-variant/10">
              <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Timings</span>
              </div>
              <p className="font-bold text-sm truncate">{temple.timings?.open || '4:00 AM'} - {temple.timings?.close || '9:00 PM'}</p>
            </div>
          </div>

          {/* Description */}
          {temple.description && (
            <div>
              <h4 className="font-serif font-black text-xl mb-4 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">history_edu</span>
                About Temple
              </h4>
              <p className="text-on-surface-variant text-sm leading-relaxed text-justify">
                {temple.description}
              </p>
            </div>
          )}

          {/* Top Videos */}
          {temple.videos && temple.videos.length > 0 && (
            <div>
              <h4 className="font-serif font-black text-xl mb-6 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">play_circle</span>
                Videos
              </h4>
              <div className="space-y-4">
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
