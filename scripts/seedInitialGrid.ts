/**
 * Seed Initial Grid Coordinates
 * 
 * This script outputs the grid coordinates used for temple discovery.
 * These coordinates are already embedded in lib/templeDiscovery.ts
 * Run this to verify the grid or export coordinates.
 * 
 * Usage: npx ts-node scripts/seedInitialGrid.ts
 */

const INDIA_GRID = [
  { lat: 28.6139, lng: 77.2090, label: 'Delhi' },
  { lat: 19.0760, lng: 72.8777, label: 'Mumbai' },
  { lat: 13.0827, lng: 80.2707, label: 'Chennai' },
  { lat: 17.3850, lng: 78.4867, label: 'Hyderabad' },
  { lat: 22.5726, lng: 88.3639, label: 'Kolkata' },
  { lat: 15.2993, lng: 74.1240, label: 'Goa' },
  { lat: 26.9124, lng: 75.7873, label: 'Jaipur' },
  { lat: 12.9716, lng: 77.5946, label: 'Bangalore' },
  { lat: 23.0225, lng: 72.5714, label: 'Ahmedabad' },
  { lat: 25.3176, lng: 82.9739, label: 'Varanasi' },
  { lat: 26.8467, lng: 80.9462, label: 'Lucknow' },
  { lat: 11.0168, lng: 76.9558, label: 'Coimbatore' },
  { lat: 9.9312, lng: 76.2673, label: 'Kochi' },
  { lat: 21.1702, lng: 72.8311, label: 'Surat' },
  { lat: 30.7333, lng: 76.7794, label: 'Chandigarh' },
  { lat: 20.2961, lng: 85.8245, label: 'Bhubaneswar' },
  { lat: 23.2599, lng: 77.4126, label: 'Bhopal' },
  { lat: 10.7905, lng: 78.7047, label: 'Tiruchirappalli' },
  { lat: 8.5241, lng: 76.9366, label: 'Thiruvananthapuram' },
  { lat: 15.3173, lng: 75.7139, label: 'Hampi' },
  { lat: 24.5854, lng: 73.7125, label: 'Udaipur' },
  { lat: 19.8762, lng: 75.3433, label: 'Aurangabad' },
  { lat: 27.1767, lng: 78.0081, label: 'Agra' },
  { lat: 30.0869, lng: 78.2676, label: 'Dehradun' },
  { lat: 10.2381, lng: 77.4892, label: 'Madurai' },
];

console.log('=== India Temple Discovery Grid ===');
console.log(`Total grid points: ${INDIA_GRID.length}`);
console.log(`Search radius: 50 km per point`);
console.log('');

INDIA_GRID.forEach((point, i) => {
  console.log(`${i + 1}. ${point.label}: ${point.lat}, ${point.lng}`);
});

console.log('');
console.log('Grid coordinates are embedded in lib/templeDiscovery.ts');
console.log('Run the discover-temples cron to start discovering temples.');
