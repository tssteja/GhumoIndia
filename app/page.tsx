import React from 'react';
import HeroSection from '@/components/HeroSection';
import TempleMapSection from '@/components/TempleMapSection';
import FeaturedTemplesSection from '@/components/FeaturedTemplesSection';
import AdSlot from '@/components/AdSlot';
import RitualGuidesSection from '@/components/RitualGuidesSection';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <TempleMapSection />
      <FeaturedTemplesSection />
      {/* FIX: Global responsive container - consistent across all pages */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AdSlot format="horizontal" label="Sponsored Travel Partner" />
      </div>
      <RitualGuidesSection />
    </main>
  );
}
