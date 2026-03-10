/**
 * Discover Temples Script
 * 
 * Manually run temple discovery across all grid coordinates.
 * Uses Google Places API to find temples, filter by rating, and store in Firestore.
 * 
 * Prerequisites:
 * - GOOGLE_PLACES_API_KEY set in .env.local
 * - Firebase configured in .env.local
 * 
 * Usage: npx ts-node scripts/discoverTemples.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  // Dynamic imports after env is loaded
  const { runFullDiscovery } = await import('../lib/templeDiscovery.js');

  console.log('=== Temple Discovery Job ===');
  console.log('Starting full discovery across India grid...\n');

  const startTime = Date.now();
  const result = await runFullDiscovery();
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n=== Discovery Complete ===');
  console.log(`Total temples found: ${result.total}`);
  console.log(`New temples stored: ${result.newTemples}`);
  console.log(`Duration: ${duration}s`);
}

main().catch(console.error);
