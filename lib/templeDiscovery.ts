import { db } from './firebase.js';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { generateSlug } from './utils.js';
import type { GridCoordinate, Temple } from './types.js';

/** Grid coordinates covering major Indian cities */
export const INDIA_GRID: GridCoordinate[] = [
  { lat: 28.6139, lng: 77.209, label: 'Delhi' },
  { lat: 19.076, lng: 72.8777, label: 'Mumbai' },
  { lat: 13.0827, lng: 80.2707, label: 'Chennai' },
  { lat: 17.385, lng: 78.4867, label: 'Hyderabad' },
  { lat: 22.5726, lng: 88.3639, label: 'Kolkata' },
  { lat: 15.2993, lng: 74.124, label: 'Goa' },
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

const MIN_RATING = 4.2;
const MIN_RATING_COUNT = 1000;
const SEARCH_RADIUS = 50000; // 50km in meters

/**
 * Discover temples near a given coordinate using Google Places API
 */
export async function discoverTemplesNearCoordinate(
  coordinate: GridCoordinate
): Promise<Partial<Temple>[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_PLACES_API_KEY not set');
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinate.lat},${coordinate.lng}&radius=${SEARCH_RADIUS}&keyword=temple&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error(`Places API error for ${coordinate.label}:`, data.status);
      return [];
    }

    const temples: Partial<Temple>[] = data.results
      .filter(
        (place: {
          rating?: number;
          user_ratings_total?: number;
        }) =>
          (place.rating ?? 0) >= MIN_RATING &&
          (place.user_ratings_total ?? 0) >= MIN_RATING_COUNT
      )
      .map(
        (place: {
          place_id: string;
          name: string;
          rating: number;
          user_ratings_total: number;
          geometry: { location: { lat: number; lng: number } };
          vicinity?: string;
          photos?: { photo_reference: string }[];
        }) => ({
          placeId: place.place_id,
          name: place.name,
          slug: generateSlug(place.name),
          rating: place.rating,
          ratingCount: place.user_ratings_total,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          address: place.vicinity || '',
          city: coordinate.label,
          state: '',
          description: `${place.name} is a famous temple located in ${coordinate.label}, India, with a rating of ${place.rating} stars from ${place.user_ratings_total} reviews.`,
          photos: place.photos
            ? place.photos.map(
                (p: { photo_reference: string }) =>
                  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${p.photo_reference}&key=${apiKey}`
              )
            : [],
          videos: [],
          lastUpdated: new Date().toISOString(),
        })
      );

    return temples;
  } catch (error) {
    console.error(`Error discovering temples near ${coordinate.label}:`, error);
    return [];
  }
}

/**
 * Store discovered temples in Firestore, using place_id as unique key
 */
export async function storeTemples(temples: Partial<Temple>[]): Promise<number> {
  let stored = 0;

  for (const temple of temples) {
    if (!temple.placeId) continue;

    try {
      // Check for existing temple with same placeId
      const templesRef = collection(db, 'temples');
      const q = query(templesRef, where('placeId', '==', temple.placeId));
      const existing = await getDocs(q);

      if (existing.empty) {
        const docRef = doc(collection(db, 'temples'));
        await setDoc(docRef, {
          ...temple,
          id: docRef.id,
        });
        stored++;
      }
    } catch (error) {
      console.error(`Error storing temple ${temple.name}:`, error);
    }
  }

  return stored;
}

/**
 * Run full discovery across all grid coordinates
 */
export async function runFullDiscovery(): Promise<{
  total: number;
  newTemples: number;
}> {
  let totalDiscovered = 0;
  let totalStored = 0;

  for (const coordinate of INDIA_GRID) {
    console.log(`Scanning ${coordinate.label}...`);
    const temples = await discoverTemplesNearCoordinate(coordinate);
    totalDiscovered += temples.length;
    const stored = await storeTemples(temples);
    totalStored += stored;
    console.log(`  Found ${temples.length} temples, stored ${stored} new`);

    // Rate limiting: wait 200ms between API calls
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return { total: totalDiscovered, newTemples: totalStored };
}
