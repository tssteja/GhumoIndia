'use client';

import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import TempleMarker from './TempleMarker';
import TempleSidebar from './TempleSidebar';
import SearchBar from './SearchBar';
import TempleList from './TempleList';
import type { Temple, TempleMarkerData } from '@/lib/types';

const MAP_CENTER = { lat: 20.5937, lng: 78.9629 }; // Center of India
const MAP_ZOOM = 5;

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy',
  styles: [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#c9e8f5' }],
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry.fill',
      stylers: [{ color: '#f0f4e8' }],
    },
  ],
  zoomControlOptions: {
    position: google.maps.ControlPosition.RIGHT_BOTTOM,
  },
};

export default function TempleMap() {
  const [temples, setTemples] = useState<TempleMarkerData[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const openTempleInSidebar = useCallback(
    async (marker: TempleMarkerData) => {
      try {
        const res = await fetch(`/api/temples/${marker.slug}`);
        const data = await res.json();

        if (data.temple) {
          setSelectedTemple({ ...data.temple, videos: data.videos || data.temple.videos || [] });
          setSidebarOpen(true);

          if (map) {
            map.panTo({ lat: marker.latitude, lng: marker.longitude });
            map.setZoom(12);
          }
        }
      } catch (error) {
        console.error('Error fetching temple details:', error);
      }
    },
    [map]
  );

  const handleSearchSelect = useCallback(
    async (slug: string) => {
      const marker = temples.find((t) => t.slug === slug);
      if (marker) {
        await openTempleInSidebar(marker);
        return;
      }

      try {
        const res = await fetch(`/api/temples/${slug}`);
        const data = await res.json();
        if (data.temple) {
          setSelectedTemple({ ...data.temple, videos: data.videos || data.temple.videos || [] });
          setSidebarOpen(true);

          if (map) {
            map.panTo({
              lat: data.temple.latitude,
              lng: data.temple.longitude,
            });
            map.setZoom(15);
          }
        }
      } catch (error) {
        console.error('Error fetching temple:', error);
      }
    },
    [map, temples, openTempleInSidebar]
  );

  useEffect(() => {
    fetchTemples();

    // Listen for external temple selection (e.g., from HeroSection)
    const handleExternalSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string }>;
      if (customEvent.detail?.slug) {
        handleSearchSelect(customEvent.detail.slug);
      }
    };

    window.addEventListener('select-temple', handleExternalSelect);
    return () => window.removeEventListener('select-temple', handleExternalSelect);
  }, [handleSearchSelect]);

  const fetchTemples = async () => {
    try {
      const res = await fetch('/api/temples');
      const data = await res.json();
      if (data.temples) {
        setTemples(
          data.temples.map((t: Temple) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            latitude: t.latitude,
            longitude: t.longitude,
            rating: t.rating,
            ratingCount: t.ratingCount,
            city: t.city,
            state: t.state,
            photo: t.photos?.[0],
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching temples:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = async (marker: TempleMarkerData) => {
    await openTempleInSidebar(marker);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedTemple(null);
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-800 font-medium text-lg">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Search Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 md:top-6 md:left-10 md:w-[480px] z-20">
        <SearchBar onSelectTemple={handleSearchSelect} />
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-white/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-primary font-black text-sm">Loading temples...</p>
          </div>
        </div>
      )}

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {temples.map((temple) => (
          <TempleMarker
            key={temple.id}
            temple={temple}
            onClick={() => handleMarkerClick(temple)}
          />
        ))}
      </GoogleMap>

      {/* Sidebar */}
      <TempleSidebar
        temple={selectedTemple}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Temple List */}
      <TempleList
        temples={temples}
        isOpen={listOpen}
        onClose={() => setListOpen(false)}
        onSelectTemple={(temple) => {
          handleMarkerClick(temple);
          setListOpen(false);
        }}
      />

      {/* List Toggle Button + Browse All - Positioned for Mobile Accessibility */}
      {!loading && (
        <div className="absolute bottom-20 left-4 md:top-24 md:bottom-auto md:left-6 z-10 flex flex-row md:flex-col gap-2 md:gap-3">
          <button
            onClick={() => setListOpen(true)}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 md:p-4 shadow-xl border border-primary/10 hover:bg-surface-container transition-all flex items-center gap-2 md:gap-3 group touch-manipulation"
          >
            <span className="material-symbols-outlined text-primary group-hover:rotate-12 transition-transform text-lg md:text-2xl">list_alt</span>
            <span className="hidden sm:inline text-xs md:text-sm font-black text-on-surface">See List</span>
          </button>
          <Link
            href="/temples"
            className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 md:p-4 shadow-xl border border-primary/10 hover:bg-surface-container transition-all flex items-center gap-2 md:gap-3 group touch-manipulation"
          >
            <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform text-lg md:text-2xl">explore</span>
            <span className="hidden sm:inline text-xs md:text-sm font-black text-on-surface">Show All</span>
          </Link>
        </div>
      )}

      {/* Temple count badge */}
      {!loading && temples.length > 0 && (
        <div className="absolute bottom-4 right-4 md:bottom-8 md:left-auto md:right-8 z-10">
          <div className="bg-primary/90 backdrop-blur-md rounded-xl px-3 py-2 md:px-6 md:py-2.5 shadow-2xl border border-white/20 max-w-[160px] md:max-w-none">
            <span className="text-[10px] md:text-xs font-black text-white tracking-[0.15em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white animate-pulse" />
              {temples.length} Sacred Sites
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
