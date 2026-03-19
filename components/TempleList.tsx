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
      'Tirupati': 'Andhra Pradesh',
      'Vijayawada': 'Andhra Pradesh',
      'Visakhapatnam': 'Andhra Pradesh',
    };

    const filtered = temples.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.state.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, TempleMarkerData[]> = {};
    filtered.forEach((t) => {
      let region = t.state;
      
      if (!region || t.city === 'Bangalore' || t.city === 'Bengaluru' || t.city === 'Hyderabad') {
        region = CITY_TO_REGION[t.city] || region || 'Other Regions';
      }

      if (!groups[region]) groups[region] = [];
      groups[region].push(t);
    });

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
      {/* Global Backdrop for Click-Outside Closure */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[55]"
          onClick={onClose}
        />
      )}

      {/* Sidebar List */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[400px] bg-surface/95 backdrop-blur-3xl z-[60] shadow-[20px_0_80px_-20px_rgba(0,0,0,0.3)] transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col border-r border-outline-variant/10`}
      >
        {/* Premium Header */}
        <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-white/40">
          <div>
            <h2 className="text-2xl font-serif font-black text-secondary flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>temple_hindu</span>
              Temple Directory
            </h2>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1 opacity-60">
              Explore by State & Region
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-secondary shadow-sm transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
          </button>
        </div>

        {/* Search/Filter Bar */}
        <div className="p-4 bg-white/20 border-b border-outline-variant/5">
          <div className="relative group">
            <input
              type="text"
              placeholder="Find a sacred place..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/60 border border-outline-variant/20 rounded-2xl text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary opacity-50">search</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {Object.entries(groupedTemples).map(([region, regionTemples]) => (
            <div key={region} className="bg-white/40 rounded-3xl overflow-hidden border border-white/60 shadow-sm transition-all hover:shadow-md">
              <button
                onClick={() => toggleRegion(region)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/40 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                    expandedRegions[region] ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-primary/10 text-primary'
                  }`}>
                    {region.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 group-hover:text-primary transition-colors text-base">
                      {region}
                    </span>
                    <p className="text-[10px] text-on-surface-variant font-bold tracking-tighter uppercase opacity-50">
                      {regionTemples.length} Sacred Locations
                    </p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-primary/30 transform transition-transform duration-300 ${
                  expandedRegions[region] ? 'rotate-180 text-primary/80' : ''
                }`}>
                  expand_more
                </span>
              </button>

              {(expandedRegions[region] || searchQuery.length > 0) && (
                <div className="bg-white/30 border-t border-white/40 divide-y divide-gray-100/30">
                  {regionTemples.map((temple) => (
                    <button
                      key={temple.id}
                      onClick={() => onSelectTemple(temple)}
                      className="w-full pl-16 pr-6 py-4 hover:bg-white/60 transition-all text-left relative group/item"
                    >
                      <div className="absolute left-7 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/20 group-hover/item:bg-primary group-hover/item:scale-125 transition-all shadow-sm" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 group-hover/item:text-secondary transition-colors leading-tight">
                          {temple.name}
                        </p>
                        <p className="text-[11px] text-on-surface-variant/60 font-medium mt-0.5">
                          {temple.city}
                        </p>
                      </div>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all text-sm">
                        arrow_forward
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {Object.keys(groupedTemples).length === 0 && (
            <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-primary/40">temple_hindu</span>
              </div>
              <p className="text-secondary font-black text-lg">No sacred sites found</p>
              <p className="text-on-surface-variant text-sm font-medium mt-2">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
