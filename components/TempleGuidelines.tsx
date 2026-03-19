'use client';

import React from 'react';

interface TempleGuidelinesProps {
  guidelines: {
    dressCode?: string;
    photography?: string;
    allowedItems?: string[];
    prohibitedItems?: string[];
    otherRules?: string[];
  };
}

export default function TempleGuidelines({ guidelines }: TempleGuidelinesProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
          📜
        </div>
        <h3 className="text-xl font-bold text-gray-900">Visitor Guidelines</h3>
      </div>

      <div className="space-y-5">
        {/* Dress Code */}
        <div>
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Dress Code</p>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
            <span className="text-lg">👕</span>
            <p className="text-sm text-blue-900 font-medium leading-relaxed">
              {guidelines.dressCode || 'Conservative attire recommended.'}
            </p>
          </div>
        </div>

        {/* Photography */}
        <div>
          <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Photography</p>
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
            <span className="text-lg">📸</span>
            <p className="text-sm text-indigo-900 font-medium leading-relaxed">
              {guidelines.photography || 'Generally restricted inside the sanctum.'}
            </p>
          </div>
        </div>

        {/* Prohibited Items */}
        {guidelines.prohibitedItems && guidelines.prohibitedItems.length > 0 && (
          <div>
            <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-2">Not Allowed</p>
            <div className="flex flex-wrap gap-2">
              {guidelines.prohibitedItems.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100">
                  ✕ {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Other Rules */}
        {guidelines.otherRules && guidelines.otherRules.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <ul className="space-y-1.5">
              {guidelines.otherRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-blue-400">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
