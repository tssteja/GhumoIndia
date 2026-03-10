import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Temple } from '@/lib/types';

export async function GET() {
  try {
    const templesRef = collection(db, 'temples');
    const snapshot = await getDocs(templesRef);

    const temples: Temple[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Temple));

    return NextResponse.json({ temples }, { status: 200 });
  } catch (error) {
    console.error('Error fetching temples:', error);
    return NextResponse.json(
      { error: 'Failed to fetch temples' },
      { status: 500 }
    );
  }
}
