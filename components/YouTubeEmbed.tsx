'use client';

import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  compact?: boolean;
}

export default function YouTubeEmbed({
  videoId,
  title,
  compact,
}: YouTubeEmbedProps) {
  if (!videoId) return null;

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white ${
        compact ? '' : 'hover:shadow-md transition-shadow'
      }`}
    >
      <div className={`relative ${compact ? 'aspect-video' : 'aspect-video'}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={title || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
      {title && !compact && (
        <div className="p-3">
          <p className="text-sm font-medium text-gray-800 line-clamp-2">
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
