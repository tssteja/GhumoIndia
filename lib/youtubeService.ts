import type { TempleVideo } from './types';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
  };
}

interface YouTubeVideoStats {
  id: string;
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

/**
 * Search YouTube for temple travel videos
 */
export async function searchTempleVideos(
  templeName: string,
  city?: string,
  state?: string
): Promise<Partial<TempleVideo>[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('YOUTUBE_API_KEY not set');
    return [];
  }

  const locationSuffix = city ? ` ${city}` : state ? ` ${state}` : '';
  const queries = [
    `${templeName}${locationSuffix} temple travel guide`,
    `${templeName}${locationSuffix} temple darshan vlog`,
    `${templeName} temple drone view`,
  ];

  const allVideos: Partial<TempleVideo>[] = [];

  for (const searchQuery of queries) {
    try {
      const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&type=video&maxResults=10&order=viewCount&key=${apiKey}`;

      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (!searchRes.ok) {
        console.error(`YouTube API search error (${searchRes.status}):`, JSON.stringify(searchData.error));
        continue;
      }

      if (!searchData.items || searchData.items.length === 0) {
        console.log(`YouTube: No videos found for query "${searchQuery}"`);
        continue;
      }

      const videoIds = searchData.items
        .map((item: YouTubeSearchItem) => item.id.videoId)
        .join(',');

      // Get video statistics
      const statsUrl = `${YOUTUBE_API_BASE}/videos?part=statistics&id=${videoIds}&key=${apiKey}`;
      const statsRes = await fetch(statsUrl);
      const statsData = await statsRes.json();

      const statsMap = new Map<string, YouTubeVideoStats>();
      if (statsData.items) {
        statsData.items.forEach((item: YouTubeVideoStats) => {
          statsMap.set(item.id, item);
        });
      }

      for (const item of searchData.items as YouTubeSearchItem[]) {
        const stats = statsMap.get(item.id.videoId);
        if (!stats) continue;

        allVideos.push({
          youtubeVideoId: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          viewCount: parseInt(stats.statistics.viewCount || '0', 10),
          likeCount: parseInt(stats.statistics.likeCount || '0', 10),
          commentCount: parseInt(stats.statistics.commentCount || '0', 10),
          publishedAt: item.snippet.publishedAt,
        });
      }
    } catch (error) {
      console.error(`YouTube search error for "${searchQuery}":`, error);
    }
  }

  // Deduplicate by videoId
  const unique = new Map<string, Partial<TempleVideo>>();
  for (const video of allVideos) {
    if (video.youtubeVideoId && !unique.has(video.youtubeVideoId)) {
      unique.set(video.youtubeVideoId, video);
    }
  }

  return Array.from(unique.values());
}
