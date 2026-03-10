'use client';

import dynamic from 'next/dynamic';

const TempleMap = dynamic(() => import('@/components/TempleMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-amber-400/30 rounded-full mx-auto" />
          <div className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">
            🛕
          </span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-2">
          TempleMap
        </h1>
        <p className="text-amber-700/70 text-sm">
          Loading the map of India&apos;s sacred temples...
        </p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <TempleMap />
    </main>
  );
}
