import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { searchTempleVideos } from './youtubeService';
import { calculateVideoScore, calculateRelevanceScore } from './utils';
import type { Temple, TempleVideo } from './types';

const TOP_VIDEOS_COUNT = 5;

/**
 * Rank and store videos for a single temple
 */
export async function rankVideosForTemple(temple: Temple, forceRefresh = false): Promise<number> {
  const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
  
  // 1. Caching check
  if (!forceRefresh && temple.videos && temple.videos.length > 0) {
    const lastUpdated = temple.lastUpdated ? new Date(temple.lastUpdated).getTime() : 0;
    const now = Date.now();
    if (now - lastUpdated < CACHE_DURATION_MS) {
      console.log(`YouTube Pipeline: Using cached videos for "${temple.name}" (last updated ${Math.round((now - lastUpdated) / 3600000)}h ago)`);
      return temple.videos.length;
    }
  }

  console.log(`YouTube Pipeline: Fetching new videos for "${temple.name}"...`);

  // 2. Fetch videos with multiple queries
  let videos = await searchTempleVideos(temple.name, temple.city, temple.state);

  // 3. Filter and Score
  const getScoredVideos = (vList: Partial<TempleVideo>[]) => vList.map((video) => {
    const relevanceMultiplier = calculateRelevanceScore(
      video.title || '',
      temple.name,
      temple.city,
      temple.state,
      video.description
    );

    const score = calculateVideoScore(
      video.viewCount || 0,
      video.likeCount || 0,
      video.commentCount || 0,
      video.publishedAt || new Date().toISOString(),
      relevanceMultiplier
    );

    return { ...video, relevanceMultiplier, score };
  });

  let scoredVideos = getScoredVideos(videos);
  let filteredVideos = scoredVideos.filter(v => v.relevanceMultiplier > 0);

  // 4. Fallback search if no relevant videos found
  if (filteredVideos.length === 0) {
    console.log(`YouTube Pipeline: No specific videos for "${temple.name}". Trying fallback search...`);
    const fallbackVideos = await searchTempleVideos(`${temple.name} temple india`);
    const scoredFallback = getScoredVideos(fallbackVideos);
    filteredVideos = scoredFallback.filter(v => v.relevanceMultiplier > 0);
  }

  if (filteredVideos.length === 0) {
    console.log(`YouTube Pipeline: Discarded all videos after fallback for "${temple.name}"`);
    return 0;
  }

  // 4. Sort and Take Top 5
  filteredVideos.sort((a, b) => (b.score || 0) - (a.score || 0));
  const topVideos = filteredVideos.slice(0, TOP_VIDEOS_COUNT);

  if (topVideos.length === 0) {
    console.log(`YouTube Pipeline: Discarded all ${filteredVideos.length} videos as irrelevant for "${temple.name}"`);
    return 0;
  }

  console.log(`YouTube Pipeline: Selected top ${topVideos.length} videos for "${temple.name}"`);
  topVideos.forEach((v, i) => {
    console.log(`  ${i+1}. [Score: ${v.score}] ${v.title} (${v.channel})`);
  });

  // 5. Update Firestore
  // Delete existing videos for this temple in the sub-collection
  const videosRef = collection(db, 'templeVideos');
  const existingQuery = query(videosRef, where('templeId', '==', temple.id));
  const existing = await getDocs(existingQuery);
  for (const docSnap of existing.docs) {
    await deleteDoc(docSnap.ref);
  }

  // Store new ranked videos in sub-collection
  for (const video of topVideos) {
    const videoDoc = doc(collection(db, 'templeVideos'));
    const videoData: TempleVideo = {
      id: videoDoc.id,
      templeId: temple.id,
      youtubeVideoId: video.youtubeVideoId || '',
      title: video.title || '',
      description: video.description || '',
      thumbnail: video.thumbnail || '',
      channel: video.channel || '',
      viewCount: video.viewCount || 0,
      likeCount: video.likeCount || 0,
      commentCount: video.commentCount || 0,
      score: video.score || 0,
      publishedAt: video.publishedAt || '',
      lastUpdated: new Date().toISOString(),
    };
    await setDoc(videoDoc, videoData);
  }

  // Update the temple document's videos array and timestamp
  const templeRef = doc(db, 'temples', temple.id);
  await setDoc(
    templeRef,
    {
      videos: topVideos.map((v) => ({
        youtubeVideoId: v.youtubeVideoId,
        title: v.title,
        thumbnail: v.thumbnail,
        channel: v.channel,
        viewCount: v.viewCount,
        likeCount: v.likeCount,
        score: v.score,
      })),
      lastUpdated: new Date().toISOString(),
    },
    { merge: true }
  );

  return topVideos.length;
}

/**
 * Run video ranking for all temples
 */
export async function runVideoRankingForAll(): Promise<{
  processed: number;
  totalVideos: number;
}> {
  const templesRef = collection(db, 'temples');
  const snapshot = await getDocs(templesRef);

  let processed = 0;
  let totalVideos = 0;

  for (const docSnap of snapshot.docs) {
    const temple = { id: docSnap.id, ...docSnap.data() } as Temple;
    console.log(`Processing videos for: ${temple.name}`);
    const videosStored = await rankVideosForTemple(temple);
    totalVideos += videosStored;
    processed++;

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return { processed, totalVideos };
}
