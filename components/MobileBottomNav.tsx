'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: 'Home', icon: 'home', href: '/' },
    { label: 'Map', icon: 'map', href: '/#map-section' },
    { label: 'Temples', icon: 'temple_hindu', href: '/temples' },
    { label: 'Festivals', icon: 'festival', href: '/festivals' }
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-[90] bg-surface/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-outline-variant/15 p-2 transition-transform duration-500">
      <div className="flex items-stretch justify-around gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : item.label === 'Map'
              ? pathname === '/'
              : pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex flex-1 min-w-0 flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl transition-all duration-300 touch-manipulation ${
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
