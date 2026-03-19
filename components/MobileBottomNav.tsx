'use client';

/*
  Fix: Mobile bottom nav tap targets and spacing
  Issue: Navigation icons needed more even spacing and a less bulky footprint on phones
  Solution: Standardized icon sizing, tap areas, and preserved scroll-hide behavior
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const atTop = currentY < 20;
      const scrollingDown = currentY > lastY;

      if (atTop) {
        setVisible(true);
      } else if (scrollingDown && currentY > 80) {
        setVisible(false);
      } else if (!scrollingDown) {
        setVisible(true);
      }

      lastY = currentY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const NAV_ITEMS = [
    { label: 'Home', icon: 'home', href: '/' },
    { label: 'Map', icon: 'map', href: '/#map-section' },
    { label: 'Temples', icon: 'temple_hindu', href: '/temples' },
    { label: 'Festivals', icon: 'festival', href: '/festivals' }
  ];

  return (
    <nav className={`md:hidden fixed bottom-3 left-3 right-3 z-[90] bg-surface/85 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl border border-outline-variant/15 p-1.5 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-28 opacity-0 pointer-events-none'}`}>
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
              className={`flex flex-1 basis-0 min-w-0 min-h-12 flex-col items-center justify-center gap-1 py-2.5 px-1.5 rounded-2xl transition-all duration-300 touch-manipulation ${
                isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className={`material-symbols-outlined text-xl sm:text-2xl ${isActive ? 'scale-110' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                {item.icon}
              </span>
              <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
