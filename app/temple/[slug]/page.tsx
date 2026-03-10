import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import type { Temple, TempleVideo } from '@/lib/types';
import { formatCount } from '@/lib/utils';
import TempleDetailClient from './TempleDetailClient';

interface TemplePageProps {
  params: Promise<{ slug: string }>;
}

async function getTemple(slug: string): Promise<{ temple: Temple | null; videos: TempleVideo[] }> {
  try {
    const templesRef = collection(db, 'temples');
    const q = query(templesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { temple: null, videos: [] };
    }

    const templeDoc = snapshot.docs[0];
    const temple = { id: templeDoc.id, ...templeDoc.data() } as Temple;

    const videosRef = collection(db, 'templeVideos');
    const videosQuery = query(videosRef, where('templeId', '==', temple.id));
    const videosSnapshot = await getDocs(videosQuery);
    const videos = videosSnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as TempleVideo[];

    return { temple, videos };
  } catch (error) {
    console.error('Error fetching temple:', error);
    return { temple: null, videos: [] };
  }
}

export async function generateMetadata({ params }: TemplePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { temple } = await getTemple(slug);

  if (!temple) {
    return {
      title: 'Temple Not Found — TempleMap',
      description: 'The requested temple could not be found.',
    };
  }

  return {
    title: `${temple.name} — TempleMap`,
    description: temple.description || `Explore ${temple.name} in ${temple.city}. Rating: ${temple.rating}★ from ${formatCount(temple.ratingCount)} reviews. Watch travel videos and get directions.`,
    openGraph: {
      title: `${temple.name} — TempleMap`,
      description: `Explore ${temple.name} in ${temple.city}. Rating: ${temple.rating}★.`,
      images: temple.photos?.[0] ? [temple.photos[0]] : [],
    },
  };
}

export default async function TemplePage({ params }: TemplePageProps) {
  const { slug } = await params;
  const { temple, videos } = await getTemple(slug);

  if (!temple) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">🛕</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Temple Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            We could not find the temple you are looking for.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl px-6 py-3 font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
          >
            ← Back to Map
          </a>
        </div>
      </div>
    );
  }

  return <TempleDetailClient temple={temple} videos={videos} />;
}
