'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: 'Home', icon: 'home', href: '/' },
    { label: 'Map', icon: 'map', href: '#map' },
    { label: 'Temples', icon: 'temple_hindu', href: '/temples' },
    { label: 'Festivals', icon: 'festival', href: '/festivals' }
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 z-[60] bg-surface/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-outline-variant/15 p-2 transition-transform duration-500 hover:scale-[1.02]">
      <div className="flex justify-around items-center">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex flex-col items-center gap-1.5 py-2 px-4 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${isActive ? 'scale-110' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
