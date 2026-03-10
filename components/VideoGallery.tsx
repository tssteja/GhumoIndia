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
        <div>
          <YouTubeEmbed
            videoId={videos[0].youtubeVideoId}
            title={videos[0].title}
          />
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
            <span>{videos[0].channel}</span>
            <div className="flex items-center gap-3">
              <span>👁 {formatCount(videos[0].viewCount)}</span>
              <span>👍 {formatCount(videos[0].likeCount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Additional videos grid */}
      {videos.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.slice(1).map((video) => (
            <div key={video.youtubeVideoId || video.id}>
              <YouTubeEmbed
                videoId={video.youtubeVideoId}
                title={video.title}
              />
              <div className="mt-1.5 flex items-center justify-between text-xs text-gray-500">
                <span className="truncate mr-2">{video.channel}</span>
                <span className="shrink-0">
                  👁 {formatCount(video.viewCount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
