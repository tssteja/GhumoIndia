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
import Script from 'next/script';

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

  const title = `${temple.name} (${temple.city}) — Timings, History & How to Reach`;
  const description = `Plan your visit to ${temple.name} in ${temple.city}, ${temple.state}. Rated ${temple.rating}★. Get temple timings, historical facts, travel videos, and find the best hotels nearby.`;

  return {
    title,
    description,
    keywords: [`${temple.name}`, `${temple.name} timings`, `hotels near ${temple.name}`, `how to reach ${temple.name}`, `${temple.city} temples`],
    openGraph: {
      title,
      description,
      images: temple.photos?.[0] ? [temple.photos[0]] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://templemap.in';

  // Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PlaceOfWorship',
    name: temple.name,
    description: temple.description || `${temple.name} is a renowned temple located in ${temple.city}, ${temple.state}, India.`,
    image: temple.photos?.[0],
    url: `${baseUrl}/temple/${temple.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: temple.city,
      addressRegion: temple.state,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: temple.latitude,
      longitude: temple.longitude,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: temple.rating,
      reviewCount: temple.ratingCount,
    },
  };

  // Breadcrumb structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Temples', item: `${baseUrl}/temples` },
      { '@type': 'ListItem', position: 3, name: temple.state || 'India', item: `${baseUrl}/temples#${(temple.state || 'india').toLowerCase().replace(/\s+/g, '-')}` },
      { '@type': 'ListItem', position: 4, name: temple.name },
    ],
  };

  // FAQ structured data for rich snippets
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Where is ${temple.name} located?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: temple.address || `${temple.name} is located in ${temple.city}, ${temple.state}, India.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the rating of ${temple.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${temple.name} is rated ${temple.rating} out of 5 stars based on ${formatCount(temple.ratingCount)} visitor reviews.`,
        },
      },
      {
        '@type': 'Question',
        name: `How to reach ${temple.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can get directions to ${temple.name} via Google Maps. The temple is located at coordinates ${temple.latitude}, ${temple.longitude} in ${temple.city}, ${temple.state}.`,
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="temple-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <TempleDetailClient temple={temple} videos={videos} />
    </>
  );
}
