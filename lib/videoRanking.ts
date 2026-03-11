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
      return temple.videos.length;
    }
  }

  // Step 10: Logging temple name
  console.log(`\nYouTube Pipeline: Starting specialized search for "${temple.name}"`);

  // Step 1-5: Generate queries and Fetch videos
  const videos = await searchTempleVideos(temple.name, temple.city, temple.state);
  console.log(`YouTube Pipeline: Fetched ${videos.length} total unique videos across 5 queries.`);

  const getScoredVideos = (vList: Partial<TempleVideo>[]) => vList.map((video) => {
    // Step 7: Filter by temple keywords
    const relevanceMultiplier = calculateRelevanceScore(
      video.title || '',
      temple.name,
      temple.city || '',
      temple.state || '',
      video.description
    );

    // Step 8: Rank using views, relevance, and recency
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

  // Step 10: Log videos after filtering
  console.log(`YouTube Pipeline: ${filteredVideos.length} videos remain after keyword filtering.`);

  // Step 11: Fallback search if fewer than 3 videos remain
  if (filteredVideos.length < 3) {
    console.log(`YouTube Pipeline: Fallback triggered for "${temple.name}" (only ${filteredVideos.length} relevant videos found).`);
    const fallbackVideos = await searchTempleVideos(`${temple.name} temple india`);
    const scoredFallback = getScoredVideos(fallbackVideos);
    const uniqueFallback = scoredFallback.filter(v => 
      v.relevanceMultiplier > 0 && !filteredVideos.some(fv => fv.youtubeVideoId === v.youtubeVideoId)
    );
    filteredVideos = [...filteredVideos, ...uniqueFallback];
    console.log(`YouTube Pipeline: Added ${uniqueFallback.length} videos from fallback search.`);
  }

  // Step 9: Return the top 5 videos
  filteredVideos.sort((a, b) => b.score - a.score);
  const topVideos = filteredVideos.slice(0, TOP_VIDEOS_COUNT);

  if (topVideos.length === 0) {
    console.log(`YouTube Pipeline: No relevant videos found for "${temple.name}" after all attempts.`);
    return 0;
  }

  console.log(`YouTube Pipeline: Final selection for "${temple.name}":`);
  topVideos.forEach((v, i) => {
    console.log(`  ${i+1}. [Score: ${v.score.toFixed(1)}] ${v.title}`);
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
