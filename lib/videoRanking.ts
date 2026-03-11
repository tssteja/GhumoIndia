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

  // Step 1: Generate 5 queries (handled inside searchTempleVideos)
  // Step 2: Fetch 25 videos
  let videos = await searchTempleVideos(temple.name, temple.city, temple.state);

  const getScoredVideos = (vList: Partial<TempleVideo>[]) => vList.map((video) => {
    // Step 3 & 4: Filter and Score (handled via calculateRelevanceScore)
    const relevanceMultiplier = calculateRelevanceScore(
      video.title || '',
      temple.name,
      temple.city || '',
      temple.state || '',
      video.description
    );

    // Step 5: Sort by views + relevance + recency (handled via calculateVideoScore)
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

  console.log(`YouTube Pipeline: Found ${videos.length} total, ${filteredVideos.length} relevant after filtering.`);

  // Step 5: Fallback search if fewer than 3 relevant videos found
  if (filteredVideos.length < 3) {
    console.log(`YouTube Pipeline: Only ${filteredVideos.length} relevant found. Running broader fallback search...`);
    const fallbackVideos = await searchTempleVideos(`${temple.name} temple india`);
    const scoredFallback = getScoredVideos(fallbackVideos);
    const uniqueFallback = scoredFallback.filter(v => 
      v.relevanceMultiplier > 0 && !filteredVideos.some(fv => fv.youtubeVideoId === v.youtubeVideoId)
    );
    filteredVideos = [...filteredVideos, ...uniqueFallback];
    console.log(`YouTube Pipeline: Added ${uniqueFallback.length} unique relevant videos from fallback.`);
  }

  // Step 6: Return the top 5 videos
  filteredVideos.sort((a, b) => b.score - a.score);
  const topVideos = filteredVideos.slice(0, TOP_VIDEOS_COUNT);

  if (topVideos.length === 0) {
    console.log(`YouTube Pipeline: No relevant videos found at all for "${temple.name}"`);
    return 0;
  }

  console.log(`YouTube Pipeline: Selected top ${topVideos.length} videos:`);
  topVideos.forEach((v, i) => {
    console.log(`  ${i+1}. [Score: ${v.score.toFixed(1)}] ${v.title} (${v.channel})`);
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
