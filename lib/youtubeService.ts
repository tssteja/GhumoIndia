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

  const cityPart = city ? ` ${city}` : '';
  const statePart = state ? ` ${state}` : '';
  
  const queries = [
    `${templeName}${cityPart}${statePart} temple`,
    `${templeName}${cityPart} darshan`,
    `${templeName}${cityPart} temple history`,
    `${templeName}${cityPart} travel guide`,
    `${templeName}${cityPart} drone`,
    `${templeName}${statePart} temple`,
  ];

  console.log(`YouTube Pipeline: Generating 6 specific queries for "${templeName}":`);
  queries.forEach((q, i) => console.log(`  ${i+1}. ${q}`));

  const allVideos: Partial<TempleVideo>[] = [];

  for (const searchQuery of queries) {
    try {
      // Fetch up to 10 per query to reach at least 30 total across queries, 
      // but we'll cap the total processed later.
      const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&type=video&maxResults=15&key=${apiKey}`;

      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (!searchRes.ok) {
        console.error(`YouTube API search error (${searchRes.status}) for query "${searchQuery}":`, JSON.stringify(searchData.error));
        continue;
      }

      if (!searchData.items || searchData.items.length === 0) {
        continue;
      }

      console.log(`YouTube Pipeline: Found ${searchData.items.length} results for query "${searchQuery}"`);

      const videoIds = searchData.items
        .map((item: any) => item.id.videoId)
        .join(',');

      // Get video statistics
      const statsUrl = `${YOUTUBE_API_BASE}/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`;
      const statsRes = await fetch(statsUrl);
      const statsData = await statsRes.json();

      if (!statsRes.ok) {
        console.error(`YouTube API stats error (${statsRes.status}):`, JSON.stringify(statsData.error));
        continue;
      }

      const statsMap = new Map<string, any>();
      if (statsData.items) {
        statsData.items.forEach((item: any) => {
          statsMap.set(item.id, item);
        });
      }

      for (const item of searchData.items) {
        const fullData = statsMap.get(item.id.videoId);
        if (!fullData) continue;

        allVideos.push({
          youtubeVideoId: item.id.videoId,
          title: fullData.snippet.title,
          description: fullData.snippet.description,
          thumbnail: fullData.snippet.thumbnails?.high?.url || fullData.snippet.thumbnails?.default?.url,
          channel: fullData.snippet.channelTitle,
          viewCount: parseInt(fullData.statistics.viewCount || '0', 10),
          likeCount: parseInt(fullData.statistics.likeCount || '0', 10),
          commentCount: parseInt(fullData.statistics.commentCount || '0', 10),
          publishedAt: fullData.snippet.publishedAt,
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

  const finalResults = Array.from(unique.values()).slice(0, 25);
  console.log(`YouTube Pipeline: Fetched ${finalResults.length} unique videos total`);
  return finalResults;
}
