import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import type { Temple, TempleVideo } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const templesRef = collection(db, 'temples');
    const q = query(templesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Temple not found' },
        { status: 404 }
      );
    }

    const templeDoc = snapshot.docs[0];
    const temple = { id: templeDoc.id, ...templeDoc.data() } as Temple;

    // Check if videos need refreshing (missing or > 24h old)
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;
    const lastUpdated = temple.lastUpdated ? new Date(temple.lastUpdated).getTime() : 0;
    const isStale = Date.now() - lastUpdated > CACHE_DURATION_MS;

    if (!temple.videos || temple.videos.length === 0 || isStale) {
      try {
        const { rankVideosForTemple } = await import('@/lib/videoRanking');
        await rankVideosForTemple(temple);
        
        // Re-fetch temple after ranking to get updated videos array
        const updatedSnapshot = await getDocs(q);
        const updatedTemple = { id: updatedSnapshot.docs[0].id, ...updatedSnapshot.docs[0].data() } as Temple;
        return NextResponse.json({ temple: updatedTemple, videos: updatedTemple.videos || [] }, { status: 200 });
      } catch (rankError) {
        console.error('Error auto-ranking videos:', rankError);
        // Continue with existing data if ranking fails (e.g., quota)
      }
    }

    // If not stale or ranking failed/skipped, return existing data
    // Fetch videos from sub-collection for full details if needed, 
    // but the temple object has the top 5 already.
    return NextResponse.json({ temple, videos: temple.videos || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching temple:', error);
    return NextResponse.json(
      { error: 'Failed to fetch temple' },
      { status: 500 }
    );
  }
}
