'use client';

import React, { useState, useMemo } from 'react';
import type { TempleMarkerData } from '@/lib/types';

interface TempleListProps {
  temples: TempleMarkerData[];
  onSelectTemple: (temple: TempleMarkerData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function TempleList({
  temples,
  onSelectTemple,
  isOpen,
  onClose,
}: TempleListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});

  const groupedTemples = useMemo(() => {
    const CITY_TO_REGION: Record<string, string> = {
      'Hyderabad': 'Telangana',
      'Bangalore': 'Bangalore',
      'Bengaluru': 'Bangalore',
      'Hampi': 'Karnataka',
      'Chennai': 'Tamil Nadu',
      'Coimbatore': 'Tamil Nadu',
      'Tiruchirappalli': 'Tamil Nadu',
      'Madurai': 'Tamil Nadu',
      'Mumbai': 'Maharashtra',
      'Aurangabad': 'Maharashtra',
      'Ahmedabad': 'Gujarat',
      'Surat': 'Gujarat',
      'Varanasi': 'Uttar Pradesh',
      'Lucknow': 'Uttar Pradesh',
      'Agra': 'Uttar Pradesh',
      'Delhi': 'Delhi',
      'Kochi': 'Kerala',
      'Thiruvananthapuram': 'Kerala',
      'Jaipur': 'Rajasthan',
      'Udaipur': 'Rajasthan',
      'Bhopal': 'Madhya Pradesh',
      'Bhubaneswar': 'Odisha',
      'Dehradun': 'Uttarakhand',
      'Goa': 'Goa',
      'Kolkata': 'West Bengal',
      'Chandigarh': 'Chandigarh',
    };

    const filtered = temples.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.state.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, TempleMarkerData[]> = {};
    filtered.forEach((t) => {
      let region = t.state;
      
      // Try to map city to region if state is missing or for specific preference (like Bangalore)
      if (!region || t.city === 'Bangalore' || t.city === 'Bengaluru' || t.city === 'Hyderabad') {
        region = CITY_TO_REGION[t.city] || region || 'Other Regions';
      }

      if (!groups[region]) groups[region] = [];
      groups[region].push(t);
    });

    // Sort regions and temples within regions
    return Object.keys(groups)
      .sort()
      .reduce((acc, region) => {
        acc[region] = groups[region].sort((a, b) => a.name.localeCompare(b.name));
        return acc;
      }, {} as Record<string, TempleMarkerData[]>);
  }, [temples, searchQuery]);

  const toggleRegion = (region: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [region]: !prev[region],
    }));
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar List */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[320px] bg-white z-40 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
          <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
            <span>🛕</span> Temples
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-lg text-amber-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 bg-white border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by name, city or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/30">
          <div className="px-1 pb-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              States & Regions
            </h3>
          </div>

          {Object.entries(groupedTemples).map(([region, regionTemples]) => (
            <div key={region} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/50">
              <button
                onClick={() => toggleRegion(region)}
                className="w-full flex items-center justify-between p-4 hover:bg-amber-50/30 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-colors ${
                    expandedRegions[region] ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {region.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                      {region}
                    </span>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {regionTemples.length} {regionTemples.length === 1 ? 'Temple' : 'Temples'}
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-300 transform transition-transform duration-300 ${
                    expandedRegions[region] ? 'rotate-180 text-amber-500' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {(expandedRegions[region] || searchQuery.length > 0) && (
                <div className="bg-gray-50/50 border-t border-gray-50 divide-y divide-gray-100/50">
                  {regionTemples.map((temple) => (
                    <button
                      key={temple.id}
                      onClick={() => onSelectTemple(temple)}
                      className="w-full pl-14 pr-4 py-3.5 hover:bg-white transition-all text-left relative group/item"
                    >
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/item:bg-amber-400 group-hover/item:scale-125 transition-all" />
                      <p className="text-sm font-semibold text-gray-800 group-hover/item:text-amber-900 transition-colors">
                        {temple.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {temple.city}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {Object.keys(groupedTemples).length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <span className="text-3xl block mb-2">🔍</span>
              <p className="text-sm">No temples found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
