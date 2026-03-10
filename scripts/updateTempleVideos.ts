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
  const { runVideoRankingForAll } = await import('../lib/videoRanking.js');

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
