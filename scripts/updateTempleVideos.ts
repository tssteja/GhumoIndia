/**
 * Update Temple Videos Script
 * 
 * Manually run video ranking for all temples.
 * Searches YouTube for travel videos and ranks them by popularity score.
 * 
 * Prerequisites:
 * - YOUTUBE_API_KEY set in .env.local
 * - Firebase configured in .env.local
 * - Temples already discovered in Firestore
 * 
 * Usage: npx ts-node scripts/updateTempleVideos.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  const { runVideoRankingForAll, rankVideosForTemple } = await import('../lib/videoRanking.ts');
  const { db } = await import('../lib/firebase.ts');
  const { collection, query, where, getDocs } = await import('firebase/firestore');

  const slugArg = process.argv[2];

  if (slugArg) {
    console.log(`=== Video Ranking Job for ${slugArg} ===`);
    const templesRef = collection(db, 'temples');
    const q = query(templesRef, where('slug', '==', slugArg));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error(`Temple not found with slug: ${slugArg}`);
      return;
    }

    const temple = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;
    console.log(`Processing videos for: ${temple.name}`);
    const videosStored = await rankVideosForTemple(temple);
    console.log(`Total videos stored: ${videosStored}`);
    return;
  }

  console.log('=== Video Ranking Job ===');
  console.log('Updating video rankings for all temples...\n');

  const startTime = Date.now();
  const result = await runVideoRankingForAll();
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n=== Ranking Complete ===');
  console.log(`Temples processed: ${result.processed}`);
  console.log(`Total videos stored: ${result.totalVideos}`);
  console.log(`Duration: ${duration}s`);
}

main().catch(console.error);
