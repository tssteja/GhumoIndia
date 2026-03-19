import React from 'react';
import HeroSection from '@/components/HeroSection';
import TempleMapSection from '@/components/TempleMapSection';
import FeaturedTemplesSection from '@/components/FeaturedTemplesSection';
import RitualGuidesSection from '@/components/RitualGuidesSection';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <TempleMapSection />
      <FeaturedTemplesSection />
      <RitualGuidesSection />
    </main>
  );
}
