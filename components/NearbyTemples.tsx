'use client';

import React, { useState, useEffect } from 'react';
import TempleCard from './TempleCard';
import type { Temple } from '@/lib/types';

interface NearbyTemplesProps {
  latitude: number;
  longitude: number;
  currentTempleId?: string;
}

export default function NearbyTemples({
  latitude,
  longitude,
  currentTempleId,
}: NearbyTemplesProps) {
  const [nearby, setNearby] = useState<(Temple & { distance: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const res = await fetch(
          `/api/temples/nearby?lat=${latitude}&lng=${longitude}&radius=100`
        );
        const data = await res.json();
        if (data.temples) {
          setNearby(
            data.temples.filter(
              (t: Temple) => t.id !== currentTempleId
            )
          );
        }
      } catch (error) {
        console.error('Error fetching nearby temples:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [latitude, longitude, currentTempleId]);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-72 h-[28rem] bg-gray-100 rounded-2xl animate-pulse shrink-0"
          />
        ))}
      </div>
    );
  }

  if (nearby.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-2xl">
        <p className="text-gray-400 text-sm">
          No nearby temples found within 100 km
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
      {nearby.map((temple) => (
        <div
          key={temple.id}
          className="w-72 shrink-0 snap-start"
        >
          <TempleCard temple={temple} />
        </div>
      ))}
    </div>
  );
}
