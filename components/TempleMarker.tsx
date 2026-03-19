'use client';

import React from 'react';
import { Marker } from '@react-google-maps/api';
import type { TempleMarkerData } from '@/lib/types';

interface TempleMarkerProps {
  temple: TempleMarkerData;
  onClick: () => void;
}

export default function TempleMarker({ temple, onClick }: TempleMarkerProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const width = isMobile ? 28 : 40;
  const height = isMobile ? 34 : 48;
  const circleRadius = isMobile ? 8 : 12;
  const fontSize = isMobile ? 12 : 16;

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
            <path d="M20 0C9 0 0 9 0 20c0 15 20 28 20 28s20-13 20-28C40 9 31 0 20 0z" fill="#d97706" filter="url(#shadow)"/>
            <circle cx="20" cy="18" r="${circleRadius}" fill="#fff"/>
            <text x="20" y="23" text-anchor="middle" font-size="${fontSize}" fill="#d97706">🛕</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(width, height),
        anchor: new google.maps.Point(width / 2, height),
      }}
      animation={google.maps.Animation.DROP}
    />
  );
}
