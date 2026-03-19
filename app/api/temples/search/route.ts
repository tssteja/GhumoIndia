import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Temple, SearchResult } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryText = searchParams.get('q')?.toLowerCase();

    if (!queryText || queryText.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const templesRef = collection(db, 'temples');
    const snapshot = await getDocs(templesRef);

    const results: SearchResult[] = [];

    snapshot.docs.forEach((doc) => {
      const temple = doc.data() as Temple;
      if (
        temple.name.toLowerCase().includes(queryText)
      ) {
        results.push({
          id: doc.id,
          name: temple.name,
          slug: temple.slug,
          city: temple.city,
          state: temple.state,
          rating: temple.rating,
        });
      }
    });

    // Sort by rating descending
    results.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({ results: results.slice(0, 20) }, { status: 200 });
  } catch (error) {
    console.error('Error searching temples:', error);
    return NextResponse.json(
      { error: 'Failed to search temples' },
      { status: 500 }
    );
  }
}
