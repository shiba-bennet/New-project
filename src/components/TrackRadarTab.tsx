import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, ChevronRight, Zap } from 'lucide-react';
import { RunningPlace, TrackCategory, City } from '../types';

interface TrackRadarTabProps {
  currentCity: City;
  places: RunningPlace[];
  onSelectPlace: (place: RunningPlace) => void;
  onBookPlace: (place: RunningPlace) => void;
}

export const TrackRadarTab: React.FC<TrackRadarTabProps> = ({
  currentCity,
  places,
  onSelectPlace,
  onBookPlace,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePinId, setActivePinId] = useState<string | null>(places[0]?.id || null);

  const filteredPlaces = places.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const activePlace = places.find(p => p.id === activePinId) || filteredPlaces[0] || places[0];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Category Filter Pills (Functional Buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          All City Tracks ({places.length})
        </button>
        <button
          onClick={() => setSelectedCategory('synthetic_track')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'synthetic_track'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Synthetic 400m
        </button>
        <button
          onClick={() => setSelectedCategory('heritage_park')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'heritage_park'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Heritage Loops
        </button>
        <button
          onClick={() => setSelectedCategory('lake_trail')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'lake_trail'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Lake / Coastal
        </button>
        <button
          onClick={() => setSelectedCategory('forest_ridge')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'forest_ridge'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Ridge & Hills
        </button>
      </div>

      {/* Interactive Map Visualizer Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-neutral-950 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Cartographic Grid & Concentric Radar Rings */}
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />
        
        {/* Subtle City Waterway / Arterial Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M -20 180 Q 150 120 280 200 T 500 160" fill="none" stroke="#38bdf8" strokeWidth="4" />
          <path d="M 80 -10 Q 140 180 200 320 T 260 450" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M -10 90 Q 220 150 420 80" fill="none" stroke="#525252" strokeWidth="2" />
        </svg>

        {/* Pulse radar circle */}
        <div className="absolute w-72 h-72 border border-orange-500/10 rounded-full animate-ping pointer-events-none" />
        <div className="absolute w-44 h-44 border border-orange-500/20 rounded-full pointer-events-none" />

        {/* Map Header Overlay */}
        <div className="absolute top-3 left-3 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-neutral-800 text-xs flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-white font-semibold">{currentCity.name} Track Radar</span>
          <span className="text-neutral-500">·</span>
          <span className="text-emerald-400 font-medium tabular-nums">{filteredPlaces.length} live spaces</span>
        </div>

        {/* Interactive Track Pins */}
        {filteredPlaces.map((place) => {
          const isActive = place.id === activePlace?.id;
          return (
            <button
              key={place.id}
              onClick={() => setActivePinId(place.id)}
              style={{
                left: `${place.coordinates.xPercent}%`,
                top: `${place.coordinates.yPercent}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                isActive ? 'scale-110 z-30' : 'hover:scale-105 z-20'
              }`}
            >
              {/* Outer Glow on Active Pin */}
              {isActive && (
                <span className="absolute -inset-2 bg-orange-500/30 rounded-full animate-pulse" />
              )}

              {/* Pin Pill / Bubble */}
              <div className={`px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl transition-all border ${
                isActive
                  ? 'bg-orange-500 text-white border-white/40 ring-2 ring-orange-500/50'
                  : 'bg-neutral-900 text-neutral-200 border-neutral-700/80 hover:bg-neutral-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  place.category === 'synthetic_track' ? 'bg-red-400' :
                  place.category === 'forest_ridge' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <span className="text-[11px] font-bold whitespace-nowrap max-w-[110px] truncate">
                  {place.name.split(' ')[0]}
                </span>
                <span className="text-[10px] opacity-80 tabular-nums">
                  {place.loopDistanceKm}k
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Place Card Detail Drawer */}
      {activePlace && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="text-orange-400 font-semibold">{activePlace.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{activePlace.neighborhood}</span>
              </div>
              <h4 className="text-base font-bold text-white mt-0.5 truncate">
                {activePlace.name}
              </h4>
              <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-300 mt-2 tabular-nums">
                {activePlace.distanceFromUserKm !== undefined && (
                  <>
                    <span className="font-bold text-orange-400">
                      {activePlace.distanceFromUserKm} km away
                    </span>
                    <span className="text-neutral-500">·</span>
                  </>
                )}
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activePlace.currentRunnersOnTrack} active
                </span>
                <span className="text-neutral-500">·</span>
                <span>{activePlace.loopDistanceKm} km loop</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[11px] text-neutral-400">Access</div>
              <div className="text-sm font-extrabold text-white tabular-nums">
                {activePlace.isFreePermit ? (
                  <span className="text-emerald-400 font-bold">Free Permit</span>
                ) : (
                  `₹${activePlace.pricePerSlot}`
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
            <button
              onClick={() => onSelectPlace(activePlace)}
              className="text-xs font-semibold text-neutral-300 hover:text-white px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-1"
            >
              <span>View Route & Elevation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onBookPlace(activePlace)}
              className="text-xs font-bold text-white px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 flex items-center gap-1 shadow-md shadow-orange-500/20 active:scale-95 transition-transform"
            >
              <span>{activePlace.isFreePermit ? 'Get Permit' : 'Book Track Pass'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
