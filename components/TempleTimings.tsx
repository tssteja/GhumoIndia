'use client';

import React from 'react';

interface TempleTimingsProps {
  timings: {
    open: string;
    close: string;
    darshan?: string[];
    special?: string;
  };
}

export default function TempleTimings({ timings }: TempleTimingsProps) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-orange-100 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">
          🕒
        </div>
        <h3 className="text-xl font-bold text-gray-900">Temple Timings</h3>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
          <div>
            <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Opens at</p>
            <p className="text-lg font-extrabold text-orange-900">{timings.open}</p>
          </div>
          <div className="h-px w-full bg-orange-200 sm:h-8 sm:w-px" />
          <div className="text-right">
            <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Closes at</p>
            <p className="text-lg font-extrabold text-orange-900">{timings.close}</p>
          </div>
        </div>

        {timings.darshan && timings.darshan.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-bold text-gray-700">Darshan & Rituals</p>
            <ul className="space-y-2">
              {timings.darshan.map((slot, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>{slot}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {timings.special && (
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 italic">
              {timings.special}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
