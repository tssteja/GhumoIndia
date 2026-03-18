'use client';

import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  /** AdSense ad slot ID — get this from your AdSense dashboard */
  slotId?: string;
  /** Ad format: 'auto', 'rectangle', 'horizontal', 'vertical' */
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  /** Optional label shown above the ad */
  label?: string;
}

/**
 * Google AdSense ad slot component.
 * 
 * Setup steps:
 * 1. Sign up at https://www.google.com/adsense
 * 2. Get approved (requires decent traffic — ~1000+ monthly visits)
 * 3. Add your AdSense client ID to NEXT_PUBLIC_ADSENSE_CLIENT_ID in .env.local
 * 4. Create ad units in your AdSense dashboard and pass their slot IDs here
 * 
 * In development, this renders a styled placeholder instead of a real ad.
 */
export default function AdSlot({ slotId, format = 'auto', label = 'Sponsored' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isProduction = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (isProduction && clientId && slotId) {
      try {
        // Push ad to AdSense queue
        ((window as unknown as Record<string, unknown[]>).adsbygoogle =
          (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded — no-op
      }
    }
  }, [isProduction, clientId, slotId]);

  // Development placeholder
  if (!isProduction || !clientId || !slotId) {
    return (
      <div className="my-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
        <p className="text-[10px] uppercase tracking-widest text-gray-300 font-semibold mb-2">
          {label}
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span className="text-xs text-gray-400">
            Ad Slot {format === 'auto' ? '(Responsive)' : `(${format})`}
          </span>
        </div>
        <p className="text-[10px] text-gray-300 mt-2">
          Set NEXT_PUBLIC_ADSENSE_CLIENT_ID in .env.local to enable
        </p>
      </div>
    );
  }

  // Production AdSense ad
  return (
    <div className="my-6" ref={adRef}>
      <p className="text-[10px] uppercase tracking-widest text-gray-300 font-semibold mb-1 text-center">
        {label}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
