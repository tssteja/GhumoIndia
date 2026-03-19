import React from 'react';
import Link from 'next/link';
import { getAllFestivals } from '@/lib/templeData';

/*
  Fix: Festival page mobile spacing and button wrapping
  Issue: Header actions and festival cards felt cramped on narrow phones
  Solution: Tightened hero spacing and card layout while keeping deity links intact
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
export const metadata = {
  title: 'Temple Festival Calendar 2026 — India',
  description: 'Major upcoming religious festivals and temple events across India for 2026. Plan your pilgrimage and travel around these auspicious days.',
};

export default function FestivalCalendarPage() {
  const festivals = getAllFestivals();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🛕</span>
            <span className="text-xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              TempleMap
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/temples" className="text-sm font-bold text-slate-600 hover:text-orange-600">
              Browse Temples
            </Link>
            <Link 
              href="/#map-section"
              className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-600/20"
            >
              Back to Map
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white py-14 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 drop-shadow-md">
            India Festival Calendar 2026
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-orange-50 font-medium">
            Plan your spiritual journey around the most auspicious dates and grandest temple celebrations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      {/* FIX: Global responsive container pattern for consistency */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 sm:py-12 md:py-16 -mt-6 sm:-mt-8">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-slate-100 p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 md:space-y-10">
          
          <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-4 py-2 bg-orange-50/50 rounded-r-xl">
            <span className="text-2xl">📅</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Upcoming Auspicious Days</h2>
              <p className="text-sm text-slate-500 italic">Dates are approximate based on solar and lunar calenders (2026).</p>
            </div>
          </div>

          <div className="grid gap-6">
            {festivals.map((fest, index) => (
              <div 
                key={index}
                className="group flex flex-col md:flex-row gap-5 sm:gap-6 p-5 sm:p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all border-l-8 hover:border-l-orange-500 border-l-slate-200"
              >
                {/* Date Side */}
                <div className="md:w-32 flex-shrink-0">
                  <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">2026</p>
                    <p className="text-2xl font-black text-slate-800 leading-none my-1">{fest.date.split(' ')[1] || fest.date}</p>
                    <p className="text-[12px] font-black uppercase tracking-tight text-orange-600">{fest.date.split(' ')[0]}</p>
                  </div>
                  {fest.significance === 'Massive' && (
                    <div className="mt-2 text-center">
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black rounded uppercase tracking-widest">
                        Massive Crowd
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Side */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {fest.name}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    One of India&apos;s most significant religious events. Dedicated to deities like {fest.deities.join(', ')}. 
                    Expect grand processions, rituals, and thousands of devotees at major temples related to these deities.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {fest.deities.map((deity, idx) => (
                      <Link 
                        key={idx}
                        href={`/all-temples?deity=${encodeURIComponent(deity)}`}
                        className="text-[11px] font-bold bg-white text-slate-600 px-2 py-1 rounded-md border border-slate-200 hover:border-orange-200 hover:text-orange-600 transition-all"
                      >
                        {deity} Temples
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Action Side */}
                <div className="md:w-48 flex-shrink-0 flex flex-col justify-center">
                <Link 
                    href="/all-temples"
                    className="w-full text-center bg-white text-slate-900 font-bold py-3 rounded-xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all text-sm shadow-sm"
                  >
                    Find Temples to Visit
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* SEO Footer for page */}
        <footer className="mt-16 text-center space-y-4">
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            TempleMap is committed to providing accurate and up-to-date information for your pilgrimage. 
            Dates are indicative and can change based on regional almanacs.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/#map-section" className="text-orange-600 hover:underline font-bold">Map View</Link>
            <Link href="/all-temples" className="text-orange-600 hover:underline font-bold">Temple Directory</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
