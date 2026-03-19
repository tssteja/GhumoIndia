'use client';

import React from 'react';

interface FestivalAlertProps {
  festivals: Array<{
    name: string;
    date: string;
    description?: string;
  }>;
}

export default function FestivalAlert({ festivals }: FestivalAlertProps) {
  if (!festivals || festivals.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-sm overflow-hidden relative">
      {/* Decorative background icon */}
      <div className="absolute -bottom-4 -right-4 text-7xl opacity-5 grayscale select-none">
        🪔
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
              🎉
            </div>
            <h3 className="text-xl font-bold text-gray-900">Upcoming Festivals</h3>
          </div>
          <a href="/festivals" className="text-xs font-bold text-purple-600 hover:underline">
            View All India Calendar →
          </a>
        </div>

        <div className="space-y-4">
          {festivals.map((festival, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-100 flex gap-4 items-start hover:shadow-md transition-shadow cursor-default">
              <div className="bg-purple-600 text-white rounded-lg p-2 text-center min-w-[60px] shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-tighter leading-none opacity-80">2026</p>
                <p className="text-lg font-black leading-tight">{festival.date.split(' ')[1] || festival.date}</p>
                <p className="text-[11px] font-extrabold uppercase tracking-tight leading-none">{festival.date.split(' ')[0]}</p>
              </div>
              <div className="flex-1">
                <p className="font-bold text-purple-900 text-base">{festival.name}</p>
                <p className="text-sm text-purple-800/70 mt-0.5 line-clamp-2 leading-relaxed">
                  {festival.description || 'Major religious celebration attracting thousands of devotees locally and from across the region.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
