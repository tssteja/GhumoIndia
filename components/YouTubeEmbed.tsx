'use client';

import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  thumbnail?: string;
  compact?: boolean;
}

export default function YouTubeEmbed({
  videoId,
  title,
  thumbnail,
  compact,
}: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  if (!videoId) return null;

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-black group/embed ${
        compact ? '' : 'hover:shadow-md transition-all duration-300'
      }`}
    >
      <div className="relative aspect-video">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 w-full h-full flex items-center justify-center group/btn"
            aria-label={`Play ${title || 'video'}`}
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title || 'Video thumbnail'}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/embed:scale-105 group-hover/embed:opacity-100 transition-all duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-gray-500">
                <span>🎬</span>
              </div>
            )}
            
            {/* Play Button Overlay - Optimized for touch */}
            <div className="relative z-10 w-14 h-14 md:w-18 md:h-18 flex items-center justify-center rounded-full bg-white/25 backdrop-blur-xl border border-white/30 group-hover/btn:scale-110 group-hover/btn:bg-red-600 group-hover/btn:border-red-500 transition-all duration-300 shadow-xl">
              <div className="w-0 h-0 border-t-[8px] md:border-t-[10px] border-t-transparent border-l-[14px] md:border-l-[18px] border-l-white border-b-[8px] md:border-b-[10px] border-b-transparent ml-1"></div>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
            title={title || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
    </div>
  );
}
