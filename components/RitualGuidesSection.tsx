'use client';

/*
  Fix: Ritual guide mobile spacing and card proportions
  Issue: Guide cards needed tighter stacking and more readable text on phones
  Solution: Adjusted section padding, heading scale, and card padding for mobile-first layout
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
import React from 'react';
import Link from 'next/link';

const GUIDES = [
  {
    title: 'Morning Visit',
    desc: 'The best time for a peaceful experience. Most temples open early in the morning.',
    icon: 'wb_sunny',
    color: 'bg-orange-50 text-secondary border-orange-100',
    size: 'md:col-span-2'
  },
  {
    title: 'Aarti Timings',
    desc: 'Experience the beautiful light ceremony and chants.',
    icon: 'auto_awesome',
    color: 'bg-red-50 text-secondary border-red-100',
    size: 'md:col-span-1'
  },
  {
    title: 'Dress Code',
    desc: 'Wear traditional or respectful clothes for your visit.',
    icon: 'checkroom',
    color: 'bg-amber-50 text-primary border-amber-100',
    size: 'md:col-span-1'
  },
  {
    title: 'Offerings',
    desc: 'Simple steps to make offerings and receive Prasad.',
    icon: 'card_giftcard',
    color: 'bg-white text-secondary border-secondary/10 shadow-md',
    size: 'md:col-span-2'
  }
];

export default function RitualGuidesSection() {
  return (
    <section className="py-10 sm:py-12 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-black text-secondary mb-4 tracking-tight">
            Temple Visit Guide
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-medium leading-relaxed">
            Plan your visit with our simple guides on traditions, timings, and how to have a peaceful experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {GUIDES.map((guide, idx) => (
            <div 
              key={idx} 
              className={`p-5 sm:p-6 md:p-10 rounded-[2rem] border-2 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative group min-h-[220px] sm:min-h-[240px] ${guide.color} ${guide.size}`}
            >
              <div className="relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/70 border border-white/60 shadow-sm flex items-center justify-center mb-4 md:mb-6">
                  <span className="material-symbols-outlined text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-500 text-primary">
                    {guide.icon}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-black mb-3 md:mb-4 tracking-tight italic">{guide.title}</h3>
                <p className="opacity-90 leading-relaxed text-sm sm:text-base font-bold max-w-sm">{guide.desc}</p>
                <Link 
                  href="/temples"
                  className="mt-6 md:mt-8 inline-flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest hover:gap-4 transition-all bg-white px-4 py-2.5 md:px-6 md:py-3 rounded-xl shadow-sm border border-black/5 hover:bg-secondary hover:text-white touch-manipulation"
                >
                  Learn More <span className="material-symbols-outlined text-base">east</span>
                </Link>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-48 md:h-48 bg-white/40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
