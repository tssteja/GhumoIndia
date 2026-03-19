'use client';

import React from 'react';
import { Marker } from '@react-google-maps/api';
import type { TempleMarkerData } from '@/lib/types';

interface TempleMarkerProps {
  temple: TempleMarkerData;
  onClick: () => void;
  isHighlighted?: boolean;
}

export default function TempleMarker({ temple, onClick, isHighlighted }: TempleMarkerProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const width = isMobile ? (isHighlighted ? 34 : 26) : (isHighlighted ? 46 : 36);
  const height = isMobile ? (isHighlighted ? 42 : 32) : (isHighlighted ? 56 : 44);
  const fontSize = isMobile ? (isHighlighted ? 13 : 11) : (isHighlighted ? 17 : 14);
  const pinColor = isHighlighted ? '#c2410c' : '#d97706';
  const ringColor = isHighlighted ? '#fff7ed' : '#fff';

  return (
    <Marker
      position={{ lat: temple.latitude, lng: temple.longitude }}
      onClick={onClick}
      title={temple.name}
      icon={{
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 40 48">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#00000033"/>
              </filter>
            </defs>
            <path d="M20 0C9 0 0 9 0 20c0 15 20 28 20 28s20-13 20-28C40 9 31 0 20 0z" fill="${pinColor}" filter="url(#shadow)"/>
            <circle cx="20" cy="18" r="${isHighlighted ? 13 : 11}" fill="${ringColor}"/>
            <text x="20" y="23" text-anchor="middle" font-size="${fontSize}" fill="${pinColor}">🛕</text>
          </svg>
        `),
      }}
    />
  );
}
