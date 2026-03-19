import type { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { Temple } from '@/lib/types';
import { getInferredDeity, getInferredState } from '@/lib/utils';
import RoutePlanner from '@/components/RoutePlanner';

// SEO entry point for the pilgrimage route planner.
export const metadata: Metadata = {
  title: 'Plan Your Pilgrimage Route | GhumoIndia',
  description:
    'Build a multi-temple pilgrimage route, compare travel distance, and share your travel plan with family or friends.',
};

async function getTemples(): Promise<Temple[]> {
  try {
    const templesRef = collection(db, 'temples');
    const q = query(templesRef, orderBy('rating', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      state: getInferredState(doc.data() as Temple),
      deity: getInferredDeity(doc.data() as Temple),
    } as Temple));
  } catch (error) {
    console.error('Error fetching route planner temples:', error);
    return [];
  }
}

export default async function PlanRoutePage() {
  const temples = await getTemples();

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/60 to-white px-4 md:px-8 py-6 md:py-10">
      <div className="max-w-7xl mx-auto">
        <RoutePlanner temples={temples} />
      </div>
    </main>
  );
}
