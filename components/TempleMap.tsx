'use client';

import React, { useCallback, useState, useEffect } from 'react';
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
  fullscreenControl: true,
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

  useEffect(() => {
    fetchTemples();
  }, []);

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
  };

  const handleSearchSelect = async (slug: string) => {
    const marker = temples.find((t) => t.slug === slug);
    if (marker) {
      handleMarkerClick(marker);
    } else {
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
            map.setZoom(12);
          }
        }
      } catch (error) {
        console.error('Error fetching temple:', error);
      }
    }
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
    <div className="relative w-full h-screen">
      {/* Search Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[480px] z-20">
        <SearchBar onSelectTemple={handleSearchSelect} />
      </div>

      {/* Logo / Branding */}
      <div className="absolute top-4 left-4 z-10 hidden md:block">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-amber-200/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            🛕 TempleMap
          </h1>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-amber-700 font-medium">Loading temples...</p>
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

      {/* List Toggle Button + Browse All */}
      {!loading && (
        <div className="absolute top-20 left-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => setListOpen(true)}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-amber-200/50 hover:bg-amber-50 transition-all flex items-center gap-2 group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🗃️</span>
            <span className="text-sm font-bold text-amber-900 pr-1">Browse List</span>
          </button>
          <a
            href="/temples"
            className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-amber-200/50 hover:bg-amber-50 transition-all flex items-center gap-2 group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">📋</span>
            <span className="text-sm font-bold text-amber-900 pr-1">All Temples</span>
          </a>
        </div>
      )}

      {/* Temple count badge */}
      {!loading && temples.length > 0 && (
        <div className="absolute bottom-6 left-4 z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-amber-200/50">
            <span className="text-sm font-medium text-amber-800">
              🛕 {temples.length} temples discovered
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
