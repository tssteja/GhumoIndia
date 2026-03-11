'use client';

import React from 'react';
import type { TempleVideo } from '@/lib/types';
import YouTubeEmbed from './YouTubeEmbed';
import { formatCount } from '@/lib/utils';

interface VideoGalleryProps {
  videos: TempleVideo[];
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <span className="text-4xl mb-3 block">🎬</span>
        <p className="text-gray-500">No videos available yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Videos will be discovered automatically
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured video */}
      {videos[0] && (
        <div className="group">
          <YouTubeEmbed
            videoId={videos[0].youtubeVideoId}
            title={videos[0].title}
            thumbnail={videos[0].thumbnail}
          />
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">{videos[0].title}</p>
              <p className="text-xs text-gray-500">{videos[0].channel}</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
              <span>👁 {formatCount(videos[0].viewCount)}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>👍 {formatCount(videos[0].likeCount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Additional videos responsive layout */}
      {videos.length > 1 && (
        <div className="relative">
          <div className="flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory">
            {videos.slice(1).map((video) => (
              <div 
                key={video.youtubeVideoId || video.id} 
                className="group flex-shrink-0 w-[280px] md:w-auto snap-center"
              >
                <YouTubeEmbed
                  videoId={video.youtubeVideoId}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  compact
                />
                <div className="mt-2 text-xs">
                  <p className="font-medium text-gray-800 line-clamp-1">{video.title}</p>
                  <div className="mt-1 flex items-center justify-between text-gray-400">
                    <span className="line-clamp-1">{video.channel}</span>
                    <span className="shrink-0 shrink-0 ml-2">👁 {formatCount(video.viewCount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Subtle mobile scroll indicator gradient */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white/80 to-transparent pointer-events-none md:hidden" />
        </div>
      )}
    </div>
  );
}
