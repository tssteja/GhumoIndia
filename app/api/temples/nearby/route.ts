import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { haversineDistance } from '@/lib/utils';
import type { Temple } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '100'); // km

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'lat and lng parameters are required' },
        { status: 400 }
      );
    }

    const templesRef = collection(db, 'temples');
    const snapshot = await getDocs(templesRef);

    const nearby: (Temple & { distance: number })[] = [];

    snapshot.docs.forEach((doc) => {
      const temple = { id: doc.id, ...doc.data() } as Temple;
      const distance = haversineDistance(
        lat,
        lng,
        temple.latitude,
        temple.longitude
      );

      if (
        distance <= radius &&
        distance > 0.5 &&
        (temple.videos?.length ?? 0) > 0
      ) {
        nearby.push({ ...temple, distance: Math.round(distance) });
      }
    });

    // Sort by distance ascending
    nearby.sort((a, b) => a.distance - b.distance);

    return NextResponse.json(
      { temples: nearby.slice(0, 10) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error finding nearby temples:', error);
    return NextResponse.json(
      { error: 'Failed to find nearby temples' },
      { status: 500 }
    );
  }
}
