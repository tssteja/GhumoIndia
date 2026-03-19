// SEO: dynamic temple metadata, structured data, and rich breadcrumbs for individual temple pages.
import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Temple, TempleVideo } from '@/lib/types';
import { formatCount } from '@/lib/utils';
import TempleDetailClient from './TempleDetailClient';
import Script from 'next/script';

const DEFAULT_OG_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDQP6Yrm01UWW9UeGU6L2J0oSwNyfLPvbBw9aWgePSR2nChp0373T8lYV4t4fGnrZ2zC74BfL-i-T1ZlajrEwcle978DPsN1KZP9_xrPKd5RZbkI-DNkMxzfvKaLWXg0Cre5Gki-YN3uvMYLNuGGs8vKoUQp2RAGkOJQX5E0tyJPsfXflSF_dJiaGbAvXeTKvHCI7MKUP9wO7sbagWab9lHBuTDNgmkao6Ph-YcEQz9KOopMTFRIu27iFzEyqrxByMbr1-5j47SGyI';

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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://templemap.in';

  if (!temple) {
    return {
      title: 'Temple Not Found | GhumoIndia',
      description: 'The requested temple could not be found.',
    };
  }

  const title = `${temple.name} | GhumoIndia`;
  const description = `Visit ${temple.name} in ${temple.city}, ${temple.state}. Explore temple timings, history, festivals, and travel tips.`;
  const url = `${baseUrl}/temple/${temple.slug}`;
  const image = temple.photos?.[0] || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: [
      temple.name,
      temple.city,
      temple.state,
      temple.deity || '',
      `${temple.name} timings`,
      `history of ${temple.name}`,
      `festivals at ${temple.name}`,
      `travel tips for ${temple.name}`,
    ].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'GhumoIndia',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function TemplePage({ params }: TemplePageProps) {
  const { slug } = await params;
  const { temple, videos } = await getTemple(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://templemap.in';

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
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl px-6 py-3 font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
          >
            ← Back to Map
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: temple.name,
    description:
      temple.description ||
      `${temple.name} is a renowned temple located in ${temple.city}, ${temple.state}, India.`,
    image: temple.photos?.[0] || DEFAULT_OG_IMAGE,
    url: `${baseUrl}/temple/${temple.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: temple.city,
      addressRegion: temple.state,
      addressCountry: 'India',
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

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Temples', item: `${baseUrl}/all-temples` },
      { '@type': 'ListItem', position: 3, name: temple.state || 'India', item: `${baseUrl}/all-temples?deity=${encodeURIComponent(temple.deity || '')}` },
      { '@type': 'ListItem', position: 4, name: temple.name },
    ],
  };

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
