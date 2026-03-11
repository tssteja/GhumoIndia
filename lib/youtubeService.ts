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
 * Search YouTube for temple travel videos (Offline Discovery Layer)
 * Optimized to use a single query (100 units) to save quota.
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

  // Layer 1: Optimized single query
  const cityPart = city ? ` ${city}` : '';
  const statePart = state ? ` ${state}` : '';
  const searchQuery = `${templeName}${cityPart}${statePart} temple`;

  console.log(`YouTube Pipeline: Using single optimized query for "${templeName}":`);
  console.log(`  Query: "${searchQuery}"`);

  try {
    // Fetch 15 videos (maxQuota efficiency)
    const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(
      searchQuery
    )}&type=video&maxResults=15&key=${apiKey}`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      console.error(`YouTube API search error (${searchRes.status}):`, JSON.stringify(searchData.error));
      return [];
    }

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    const videoIds = searchData.items
      .map((item: any) => item.id.videoId)
      .join(',');

    // Get video statistics and full snippet
    const statsUrl = `${YOUTUBE_API_BASE}/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`;
    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();

    if (!statsRes.ok) {
      console.error(`YouTube API stats error (${statsRes.status}):`, JSON.stringify(statsData.error));
      return [];
    }

    const results: Partial<TempleVideo>[] = [];
    if (statsData.items) {
      statsData.items.forEach((item: any) => {
        results.push({
          youtubeVideoId: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          channel: item.snippet.channelTitle,
          viewCount: parseInt(item.statistics.viewCount || '0', 10),
          likeCount: parseInt(item.statistics.likeCount || '0', 10),
          commentCount: parseInt(item.statistics.commentCount || '0', 10),
          publishedAt: item.snippet.publishedAt,
        });
      });
    }

    console.log(`YouTube Pipeline: Fetched ${results.length} total videos for "${templeName}"`);
    return results;
  } catch (error) {
    console.error(`YouTube discovery error for "${templeName}":`, error);
    return [];
  }
}
