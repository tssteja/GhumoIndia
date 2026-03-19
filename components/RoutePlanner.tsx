'use client';

// Interactive pilgrimage route planner with preset circuits and Google Maps directions.
import React, { useEffect, useMemo, useState } from 'react';
import { GoogleMap, MarkerF, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import type { Temple } from '@/lib/types';
import { PILGRIMAGE_ROUTES } from '@/lib/pilgrimageRoutes';

interface RoutePlannerProps {
  temples: Temple[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapCenter = { lat: 20.5937, lng: 78.9629 };

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function formatDuration(seconds: number) {
  const totalMinutes = Math.max(0, Math.round(seconds / 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatDistance(meters: number) {
  return `${(meters / 1000).toFixed(meters >= 100000 ? 0 : 1)} km`;
}

export default function RoutePlanner({ temples }: RoutePlannerProps) {
  const [query, setQuery] = useState('');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [routeId, setRouteId] = useState<string>('custom');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [summary, setSummary] = useState<{ distance: string; duration: string } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-route-planner',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const templeIndex = useMemo(() => {
    return temples.map((temple, index) => ({
      ...temple,
      searchKey: normalize(`${temple.name} ${temple.city} ${temple.state} ${temple.deity || ''}`),
      order: index,
    }));
  }, [temples]);

  const selectedTemples = useMemo(
    () => selectedSlugs.map((slug) => templeIndex.find((temple) => temple.slug === slug)).filter(Boolean) as Temple[],
    [selectedSlugs, templeIndex]
  );

  const suggestions = useMemo(() => {
    const q = normalize(query);
    if (q.length < 2) return [];
    return templeIndex
      .filter((temple) => temple.searchKey.includes(q))
      .slice(0, 6);
  }, [query, templeIndex]);

  const presetRoutes = useMemo(() => PILGRIMAGE_ROUTES, []);

  const setPresetRoute = (id: string) => {
    if (id === 'custom') {
      setRouteId(id);
      setDirections(null);
      setSummary(null);
      return;
    }

    const preset = presetRoutes.find((route) => route.id === id);
    if (!preset) return;

    const matched = preset.templeNames
      .map((name) => templeIndex.find((temple) => normalize(temple.name).includes(normalize(name)) || normalize(name).includes(normalize(temple.name))))
      .filter(Boolean) as Temple[];

    setRouteId(id);
    setSelectedSlugs(matched.map((temple) => temple.slug));
    setQuery('');
    setDirections(null);
    setSummary(null);
    if (matched[0] && map) {
      map.panTo({ lat: matched[0].latitude, lng: matched[0].longitude });
      map.setZoom(6);
    }
  };

  const addTemple = (slug: string) => {
    if (selectedSlugs.includes(slug)) return;
    setRouteId('custom');
    setSelectedSlugs((prev) => [...prev, slug]);
    setQuery('');
    setDirections(null);
    setSummary(null);
  };

  const removeTemple = (slug: string) => {
    setRouteId('custom');
    setSelectedSlugs((prev) => prev.filter((item) => item !== slug));
    setDirections(null);
    setSummary(null);
  };

  const shareRoute = async () => {
    const url = new URL('/plan-route', window.location.origin);
    if (routeId !== 'custom') url.searchParams.set('route', routeId);
    if (selectedSlugs.length) url.searchParams.set('temples', selectedSlugs.join(','));

    const shareData = {
      title: 'GhumoIndia pilgrimage route',
      url: url.toString(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url.toString());
      }
    } catch {
      await navigator.clipboard.writeText(url.toString());
    }
  };

  useEffect(() => {
    if (!isLoaded || selectedTemples.length < 2 || !map) return;

    const service = new window.google.maps.DirectionsService();
    const origin = selectedTemples[0];
    const destination = selectedTemples[selectedTemples.length - 1];
    const waypoints = selectedTemples.slice(1, -1).map((temple) => ({
      location: { lat: temple.latitude, lng: temple.longitude },
      stopover: true,
    }));

    service.route(
      {
        origin: { lat: origin.latitude, lng: origin.longitude },
        destination: { lat: destination.latitude, lng: destination.longitude },
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          const legs = result.routes[0]?.legs || [];
          const totalDistance = legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0);
          const totalDuration = legs.reduce((sum, leg) => sum + (leg.duration?.value || 0), 0);
          setSummary({
            distance: formatDistance(totalDistance),
            duration: formatDuration(totalDuration),
          });
        } else {
          setDirections(null);
          setSummary(null);
        }
      }
    );
  }, [isLoaded, selectedTemples, map]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[420px_minmax(0,1fr)] gap-6">
      <aside className="space-y-4">
        <div className="rounded-[2rem] bg-white border border-primary/10 shadow-xl p-5 md:p-6 space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Route Planner</p>
            <h1 className="mt-2 text-2xl md:text-3xl font-serif font-black text-on-surface">Plan Your Pilgrimage Route</h1>
            <p className="text-sm text-on-surface-variant mt-2">
              Select multiple temples, try a preset pilgrimage route, and share a ready-to-book travel plan.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPresetRoute('custom')}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] border transition-all ${routeId === 'custom' ? 'bg-primary text-white border-primary' : 'bg-white border-outline-variant/10 text-on-surface-variant'}`}
            >
              Custom
            </button>
            {presetRoutes.map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => setPresetRoute(route.id)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] border transition-all ${routeId === route.id ? 'bg-secondary text-white border-secondary' : 'bg-white border-outline-variant/10 text-on-surface-variant'}`}
              >
                {route.name}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/40">search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search temples to add..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-outline-variant/10 bg-gray-50/60 font-semibold focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl border border-gray-100 shadow-2xl z-[50] max-h-72 overflow-y-auto">
                {suggestions.map((temple) => (
                  <button
                    key={temple.slug}
                    type="button"
                    onClick={() => addTemple(temple.slug)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between gap-3"
                  >
                    <span className="min-w-0">
                      <span className="block font-bold text-secondary truncate">{temple.name}</span>
                      <span className="block text-xs text-on-surface-variant truncate">
                        {temple.city}, {temple.state}
                      </span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                      Add
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/50 mb-2">Selected temples</p>
            <div className="space-y-2">
              {selectedTemples.length === 0 && (
                <div className="rounded-2xl border border-dashed border-outline-variant/20 p-4 text-sm text-on-surface-variant">
                  Start by adding temples or choose a pilgrimage route.
                </div>
              )}
              {selectedTemples.map((temple, index) => (
                <div key={temple.slug} className="flex items-center justify-between gap-3 rounded-2xl bg-surface-container-low px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Stop {index + 1}</p>
                    <p className="font-bold text-on-surface truncate">{temple.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTemple(temple.slug)}
                    className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-on-surface-variant hover:text-primary shadow-sm"
                    aria-label={`Remove ${temple.name}`}
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={shareRoute}
              className="w-full rounded-2xl bg-primary text-white font-black py-3 px-4 shadow-lg hover:bg-primary/90 transition-all"
            >
              Share Route
            </button>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white border border-primary/10 p-4 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/40">Total Distance</p>
              <p className="mt-2 text-2xl font-black text-secondary">{summary.distance}</p>
            </div>
            <div className="rounded-2xl bg-white border border-primary/10 p-4 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/40">Travel Time</p>
              <p className="mt-2 text-2xl font-black text-secondary">{summary.duration}</p>
            </div>
          </div>
        )}

        <div className="rounded-[2rem] bg-white border border-primary/10 shadow-xl p-5 md:p-6 space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Route Summary</p>
            <h2 className="mt-2 text-xl font-serif font-black text-on-surface">Temple order</h2>
          </div>
          <ol className="space-y-2">
            {selectedTemples.map((temple, index) => (
              <li key={temple.slug} className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-on-surface truncate">{temple.name}</p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {temple.city}, {temple.state}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {routeId !== 'custom' && (
            <div className="rounded-2xl bg-primary/5 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Preset route</p>
              <p className="mt-2 font-bold text-on-surface">
                {presetRoutes.find((route) => route.id === routeId)?.name}
              </p>
              <p className="text-sm text-on-surface-variant mt-1">
                {presetRoutes.find((route) => route.id === routeId)?.description}
              </p>
            </div>
          )}
        </div>
      </aside>

      <section className="space-y-4">
        <div className="rounded-[2rem] overflow-hidden border border-primary/10 shadow-2xl bg-white min-h-[520px]">
          {!isLoaded ? (
            <div className="h-[520px] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="font-black text-primary">Loading route planner...</p>
              </div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={selectedTemples[0] ? { lat: selectedTemples[0].latitude, lng: selectedTemples[0].longitude } : mapCenter}
              zoom={selectedTemples.length > 0 ? 6 : 5}
              options={{
                disableDefaultUI: false,
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeControl: false,
                gestureHandling: 'greedy',
              }}
              onLoad={(loadedMap) => setMap(loadedMap)}
            >
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{ suppressMarkers: true, preserveViewport: false }}
                />
              )}

              {selectedTemples.map((temple, index) => (
                <MarkerF
                  key={temple.slug}
                  position={{ lat: temple.latitude, lng: temple.longitude }}
                  label={{
                    text: `${index + 1}`,
                    color: 'white',
                    fontWeight: '700',
                  }}
                />
              ))}
            </GoogleMap>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[2rem] bg-white border border-primary/10 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">What you get</p>
            <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
              <li>Multi-temple travel order with route summary</li>
              <li>Shareable URL for family or group planning</li>
              <li>Hotel, flight, and train integrations on temple pages</li>
            </ul>
          </div>
          <div className="rounded-[2rem] bg-white border border-primary/10 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Tips</p>
            <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
              <li>Choose nearby temples to keep the route practical.</li>
              <li>Use presets when you want a ready-made pilgrimage circuit.</li>
              <li>Open temple pages for timings, videos, and booking links.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
