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

    // Layer 2: Fast Website Delivery
    // Return videos directly from the database (cached by offline job)
    return NextResponse.json({ 
      temple, 
      videos: temple.videos || [] 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching temple:', error);
    return NextResponse.json(
      { error: 'Failed to fetch temple' },
      { status: 500 }
    );
  }
}
