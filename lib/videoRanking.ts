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
export async function rankVideosForTemple(temple: Temple): Promise<number> {
  // Search with location for better relevance
  const videos = await searchTempleVideos(temple.name, temple.city, temple.state);

  if (videos.length === 0) {
    console.log(`  No videos found for ${temple.name}`);
    return 0;
  }

  // Calculate scores with relevance boost
  const scoredVideos = videos.map((video) => {
    const relevanceMultiplier = calculateRelevanceScore(
      video.title || '',
      temple.name,
      temple.city,
      temple.state
    );

    return {
      ...video,
      relevanceMultiplier,
      score: calculateVideoScore(
        video.viewCount || 0,
        video.likeCount || 0,
        video.commentCount || 0,
        video.publishedAt || new Date().toISOString(),
        relevanceMultiplier
      ),
    };
  });

  // Sort by score descending, take top N
  scoredVideos.sort((a, b) => (b.score || 0) - (a.score || 0));
  const topVideos = scoredVideos.slice(0, TOP_VIDEOS_COUNT);

  // ONLY update if we found videos to avoid clearing out existing data on quota errors
  if (topVideos.length === 0) {
    console.log(`  Skipping update for ${temple.name} (no new videos found/quota hit)`);
    return 0;
  }

  // Delete existing videos for this temple
  const videosRef = collection(db, 'templeVideos');
  const existingQuery = query(videosRef, where('templeId', '==', temple.id));
  const existing = await getDocs(existingQuery);
  for (const docSnap of existing.docs) {
    await deleteDoc(docSnap.ref);
  }

  // Store new ranked videos
  for (const video of topVideos) {
    const videoDoc = doc(collection(db, 'templeVideos'));
    const videoData: TempleVideo = {
      id: videoDoc.id,
      templeId: temple.id,
      youtubeVideoId: video.youtubeVideoId || '',
      title: video.title || '',
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

  // Also update the temple's embedded videos array
  const templeRef = doc(db, 'temples', temple.id);
  await setDoc(
    templeRef,
    {
      videos: topVideos.map((v) => ({
        youtubeVideoId: v.youtubeVideoId,
        title: v.title,
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
