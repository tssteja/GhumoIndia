import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { GUIDE_ARTICLES } from '@/lib/guides';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://templemap.in';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/all-temples`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/plan-route`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/festivals`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic temple pages
  try {
    const templesRef = collection(db, 'temples');
    const snapshot = await getDocs(templesRef);
    const templePages: MetadataRoute.Sitemap = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${baseUrl}/temple/${data.slug}`,
        lastModified: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });

    const guidePages: MetadataRoute.Sitemap = GUIDE_ARTICLES.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    }));

    return [...staticPages, ...templePages, ...guidePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
