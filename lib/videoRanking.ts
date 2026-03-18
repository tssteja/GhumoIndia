import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  writeBatch,
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
  
  // 1. Caching check — return -1 to signal "skipped (cached)"
  if (!forceRefresh && temple.videos && temple.videos.length > 0) {
    const lastUpdated = temple.lastUpdated ? new Date(temple.lastUpdated).getTime() : 0;
    const now = Date.now();
    if (now - lastUpdated < CACHE_DURATION_MS) {
      return -1;
    }
  }

  // Logging start
  console.log(`\nYouTube Discovery: Starting offline pipeline for "${temple.name}" (${temple.city}, ${temple.state})`);

  // Layer 1: Fetch 15 videos using single optimized query
  const videos = await searchTempleVideos(temple.name, temple.city, temple.state);
  
  const getScoredVideos = (vList: Partial<TempleVideo>[]) => vList.map((video) => {
    // Stage 1: Scoring and strict filtering
    const relevanceScore = calculateRelevanceScore(
      video.title || '',
      temple.name,
      temple.city || '',
      temple.state || '',
      video.description,
      video.viewCount || 0
    );

    const score = calculateVideoScore(
      video.viewCount || 0,
      video.likeCount || 0,
      video.commentCount || 0,
      video.publishedAt || new Date().toISOString(),
      relevanceScore
    );

    return { ...video, relevanceScore, score };
  });

  const scoredVideos = getScoredVideos(videos);
  const filteredVideos = scoredVideos.filter(v => v.relevanceScore > 0);

  console.log(`YouTube Discovery: ${filteredVideos.length} videos accepted after strict location filtering.`);

  // Sort and select top 5
  filteredVideos.sort((a, b) => b.score - a.score);
  const topVideos = filteredVideos.slice(0, TOP_VIDEOS_COUNT);

  const templeRef = doc(db, 'temples', temple.id);
  
  if (topVideos.length === 0) {
    console.log(`YouTube Discovery: No relevant videos found for "${temple.name}". Clearing existing videos.`);
    await updateDoc(templeRef, {
      videos: [],
      lastUpdated: new Date().toISOString()
    });
    return 0;
  }

  console.log(`YouTube Discovery: Final selection for "${temple.name}":`);
  topVideos.forEach((v, i) => {
    console.log(`  ${i+1}. [Score: ${v.relevanceScore.toFixed(0)}] ${v.title}`);
  });

  // Layer 2: Fast Delivery (Store top 5 in temple document)
  await updateDoc(templeRef, {
    videos: topVideos.map(v => ({
      youtubeVideoId: v.youtubeVideoId,
      title: v.title,
      thumbnail: v.thumbnail,
      channel: v.channel,
      viewCount: v.viewCount ?? 0,
      likeCount: v.likeCount ?? 0,
      commentCount: v.commentCount ?? 0,
      score: v.score,
      relevanceScore: v.relevanceScore
    })),
    lastUpdated: new Date().toISOString()
  });

  // Also update templeVideos sub-collection
  const videosRef = collection(db, 'templeVideos');
  const existingQuery = query(videosRef, where('templeId', '==', temple.id));
  const existing = await getDocs(existingQuery);
  
  if (!existing.empty) {
    const batch = writeBatch(db);
    existing.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }

  for (const video of topVideos) {
    const videoDoc = doc(collection(db, 'templeVideos'));
    await setDoc(videoDoc, {
      id: videoDoc.id,
      templeId: temple.id,
      ...video,
      lastUpdated: new Date().toISOString()
    });
  }

  return topVideos.length;
}

/**
 * Run video ranking for all temples.
 * forceRefresh=true bypasses the 24h cache — use when fixing stale data.
 */
export async function runVideoRankingForAll(forceRefresh = false): Promise<{
  processed: number;
  totalVideos: number;
  skipped: number;
}> {
  const templesRef = collection(db, 'temples');
  const snapshot = await getDocs(templesRef);

  let processed = 0;
  let totalVideos = 0;
  let skipped = 0;

  for (const docSnap of snapshot.docs) {
    const temple = { id: docSnap.id, ...docSnap.data() } as Temple;
    console.log(`Processing videos for: ${temple.name}`);
    const videosStored = await rankVideosForTemple(temple, forceRefresh);
    if (videosStored === -1) {
      skipped++;
    } else {
      totalVideos += videosStored;
      processed++;
    }

    // Rate limiting — respect YouTube quota
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  return { processed, totalVideos, skipped };
}
