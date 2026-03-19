'use client';

/*
  Fix: Map overlays and mobile control crowding
  Issue: Badge, list, and nearby controls felt tight on small screens around the map viewport
  Solution: Repositioned mobile controls, tightened padding, and kept map interactions intact
  Verified breakpoints: 320px, 375px, 425px, 768px
*/
// Main map experience with predictive search, nearby discovery, and temple sidebar/list interactions.
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import TempleMarker from './TempleMarker';
import TempleSidebar from './TempleSidebar';
import SearchBar from './SearchBar';
import TempleList from './TempleList';
import NearMePanel from './NearMePanel';
import type { Temple, TempleMarkerData } from '@/lib/types';
import { haversineDistance } from '@/lib/utils';

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
};

export default function TempleMap() {
  const [temples, setTemples] = useState<TempleMarkerData[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [selectedTempleSlug, setSelectedTempleSlug] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [nearMeOpen, setNearMeOpen] = useState(false);
  const [nearMeStatus, setNearMeStatus] = useState<'idle' | 'loading' | 'ready' | 'denied' | 'unsupported'>('idle');
  const [radiusKm, setRadiusKm] = useState(50);
  const [sortBy, setSortBy] = useState<'nearest' | 'famous' | 'visited'>('nearest');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>('');
  const [cityQuery, setCityQuery] = useState('');
  const [cityError, setCityError] = useState('');
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const templeCityCentroids = useMemo(() => {
    const groups = new Map<string, { lat: number; lng: number; count: number; label: string }>();

    temples.forEach((temple) => {
      const key = temple.city.toLowerCase().trim();
      const existing = groups.get(key);
      if (existing) {
        existing.lat += temple.latitude;
        existing.lng += temple.longitude;
        existing.count += 1;
      } else {
        groups.set(key, {
          lat: temple.latitude,
          lng: temple.longitude,
          count: 1,
          label: temple.city,
        });
      }
    });

    return groups;
  }, [temples]);

  const nearbyTemples = useMemo(() => {
    if (!userLocation) return [];

    const filtered = temples
      .map((temple) => {
        const distanceKm = haversineDistance(
          userLocation.lat,
          userLocation.lng,
          temple.latitude,
          temple.longitude
        );

        return { ...temple, distanceKm };
      })
      .filter((temple) => temple.distanceKm <= radiusKm);

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'famous') return b.rating - a.rating;
      if (sortBy === 'visited') return b.ratingCount - a.ratingCount;
      return (a.distanceKm || 0) - (b.distanceKm || 0);
    });

    return sorted;
  }, [radiusKm, sortBy, temples, userLocation]);

  const visibleTemples = nearMeOpen && userLocation ? nearbyTemples : temples;

  const focusTempleOnMap = useCallback(
    (marker: TempleMarkerData, zoom = 13) => {
      setSelectedTempleSlug(marker.slug);
      setSidebarOpen(false);
      setSelectedTemple(null);
      if (map) {
        map.panTo({ lat: marker.latitude, lng: marker.longitude });
        map.setZoom(zoom);
      }
    },
    [map]
  );

  const startNearMe = useCallback(() => {
    setNearMeOpen(true);
    setListOpen(false);
    setCityError('');

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setNearMeStatus('unsupported');
      return;
    }

    setNearMeStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(currentLocation);
        setLocationLabel('Your location');
        setNearMeStatus('ready');
        if (map) {
          map.panTo(currentLocation);
          map.setZoom(10);
        }
      },
      () => {
        setNearMeStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [map]);

  const useManualCity = useCallback(() => {
    const query = cityQuery.trim().toLowerCase();
    if (!query) {
      setCityError('Please enter a city name.');
      return;
    }

    const directMatch = templeCityCentroids.get(query);
    const fuzzyMatch =
      directMatch ||
      Array.from(templeCityCentroids.entries()).find(([city]) => city.includes(query) || query.includes(city))?.[1];

    if (!fuzzyMatch) {
      setCityError('We could not find temples in that city yet.');
      return;
    }

    const center = {
      lat: fuzzyMatch.lat / fuzzyMatch.count,
      lng: fuzzyMatch.lng / fuzzyMatch.count,
    };

    setUserLocation(center);
    setLocationLabel(fuzzyMatch.label);
    setNearMeStatus('ready');
    setCityError('');
    if (map) {
      map.panTo(center);
      map.setZoom(10);
    }
  }, [cityQuery, map, templeCityCentroids]);

  const openTempleInSidebar = useCallback(
    async (marker: TempleMarkerData) => {
      try {
        setSelectedTempleSlug(marker.slug);
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
        focusTempleOnMap(marker, 13);
        return;
      }

      try {
        const res = await fetch(`/api/temples/${slug}`);
        const data = await res.json();
        if (data.temple) {
          focusTempleOnMap(
            {
              id: data.temple.id,
              name: data.temple.name,
              slug: data.temple.slug,
              latitude: data.temple.latitude,
              longitude: data.temple.longitude,
              rating: data.temple.rating,
              ratingCount: data.temple.ratingCount,
              city: data.temple.city,
              state: data.temple.state,
              photo: data.temple.photos?.[0],
            },
            13
          );
        }
      } catch (error) {
        console.error('Error fetching temple:', error);
      }
    },
    [focusTempleOnMap, temples]
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

    const handleOpenList = () => {
      setNearMeOpen(false);
      setListOpen(true);
    };
    const handleNearMe = () => startNearMe();

    window.addEventListener('select-temple', handleExternalSelect);
    window.addEventListener('open-temple-list', handleOpenList);
    window.addEventListener('find-temples-near-me', handleNearMe);
    return () => {
      window.removeEventListener('select-temple', handleExternalSelect);
      window.removeEventListener('open-temple-list', handleOpenList);
      window.removeEventListener('find-temples-near-me', handleNearMe);
    };
  }, [handleSearchSelect, startNearMe]);

  useEffect(() => {
    const pendingSlug = window.sessionStorage.getItem('pending-temple-slug');
    if (!pendingSlug || temples.length === 0) return;

    const marker = temples.find((t) => t.slug === pendingSlug);
    if (marker) {
      focusTempleOnMap(marker, 13);
      window.sessionStorage.removeItem('pending-temple-slug');
    }
  }, [focusTempleOnMap, temples]);

  useEffect(() => {
    if (nearMeStatus !== 'ready' || !userLocation || !map) return;
    map.panTo(userLocation);
  }, [map, nearMeStatus, userLocation]);

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
            deity: t.deity,
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
    setSelectedTempleSlug(null);
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
      <div className="absolute top-4 left-4 right-4 md:top-6 md:left-10 md:w-[480px] z-[60]">
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
        {visibleTemples.map((temple) => (
          <TempleMarker
            key={temple.id}
            temple={temple}
            onClick={() => handleMarkerClick(temple)}
            isHighlighted={selectedTempleSlug === temple.slug}
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
        temples={visibleTemples}
        isOpen={listOpen}
        onClose={() => setListOpen(false)}
        onSelectTemple={(temple) => {
          focusTempleOnMap(temple, 13);
          setListOpen(false);
        }}
      />

      <NearMePanel
        isOpen={nearMeOpen}
        loadingLocation={nearMeStatus === 'loading'}
        locationLabel={locationLabel}
        radiusKm={radiusKm}
        sortBy={sortBy}
        temples={nearbyTemples}
        locationMode={nearMeStatus}
        cityQuery={cityQuery}
        cityError={cityError}
        onClose={() => setNearMeOpen(false)}
        onRadiusChange={setRadiusKm}
        onSortChange={setSortBy}
        onCityQueryChange={(value) => {
          setCityQuery(value);
          setCityError('');
        }}
        onUseCity={useManualCity}
        onSelectTemple={(slug) => handleSearchSelect(slug)}
      />

      {/* List Toggle Button - Positioned for Mobile Accessibility */}
      {!loading && (
        <div className="absolute bottom-20 left-4 md:top-24 md:bottom-auto md:left-6 z-20 flex flex-row md:flex-col gap-2 md:gap-3">
          <button
            onClick={() => setListOpen(true)}
            className="min-w-12 min-h-12 bg-white/95 backdrop-blur-md rounded-xl px-5 py-3 md:p-4 shadow-xl border border-primary/10 hover:bg-surface-container transition-all flex items-center gap-2 md:gap-3 group touch-manipulation"
          >
            <span className="material-symbols-outlined text-primary group-hover:rotate-12 transition-transform text-lg md:text-2xl">list_alt</span>
            <span className="hidden sm:inline text-xs md:text-sm font-black text-on-surface">See List</span>
          </button>
        </div>
      )}

      {!loading && (
        <button
          type="button"
          onClick={startNearMe}
          className="absolute top-4 right-4 md:top-6 md:right-[160px] z-20 inline-flex min-w-12 min-h-12 items-center justify-center gap-3 rounded-xl bg-white/95 backdrop-blur-md px-5 py-3 shadow-xl border border-primary/10 hover:bg-surface-container transition-all font-black text-base text-secondary touch-manipulation"
        >
          <span className="material-symbols-outlined text-primary text-lg">my_location</span>
          Near Me
        </button>
      )}

      {/* Temple count badge */}
      {!loading && temples.length > 0 && (
        <div className="absolute top-20 left-4 right-auto md:top-auto md:bottom-8 md:left-auto md:right-8 z-20">
          <div className="bg-primary/90 backdrop-blur-md rounded-xl px-3 py-2 md:px-6 md:py-2.5 shadow-2xl border border-white/20 max-w-[128px] sm:max-w-[140px] md:max-w-none">
            <span className="text-[9px] md:text-xs font-black text-white tracking-[0.15em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white animate-pulse" />
              {temples.length} Sacred Sites
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
