import React, { useState } from 'react';
import { 
  X, MapPin, Clock, ShieldCheck, 
  Share2, Heart, CheckCircle2, ChevronRight,
  TrendingUp, Compass, AlertCircle
} from 'lucide-react';
import { RunningPlace } from '../types';

interface PlaceDetailModalProps {
  place: RunningPlace | null;
  onClose: () => void;
  onBookNow: (place: RunningPlace, preselectedSlotId?: string) => void;
  isSaved?: boolean;
  onToggleSave?: (placeId: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  onBookNow,
  isSaved = false,
  onToggleSave,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'route' | 'rules'>('overview');
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!place) return null;

  const currentSlot = selectedSlotId 
    ? place.slots.find(s => s.id === selectedSlotId) || place.slots[0]
    : place.slots[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${place.name} on Dhaav`,
        text: `Check out ${place.name} in ${place.neighborhood} for running on Dhaav!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Mobile Drag & Navigation Header */}
        <div className="relative">
          {/* Hero Image */}
          <div className="relative h-56 sm:h-64 w-full bg-neutral-950 overflow-hidden">
            <img
              src={place.heroImage}
              alt={place.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-black/60" />

            {/* Top Navigation Controls */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <button
                onClick={onClose}
                aria-label="Back"
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center border border-white/15 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  aria-label="Share"
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center border border-white/15 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {onToggleSave && (
                  <button
                    onClick={() => onToggleSave(place.id)}
                    aria-label="Save"
                    className={`w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/15 transition-colors ${
                      isSaved ? 'text-rose-500' : 'text-white hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Share feedback toast */}
            {shareSuccess && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg z-20">
                Link copied to clipboard!
              </div>
            )}

            {/* Badge on Hero */}
            <div className="absolute bottom-3 left-4 right-4">
              <div className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">
                {place.categoryLabel}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {place.name}
              </h1>
              <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-300 mt-1">
                {place.distanceFromUserKm !== undefined && (
                  <>
                    <span className="font-bold text-orange-400 tabular-nums">
                      {place.distanceFromUserKm} km from you
                    </span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{place.neighborhood}</span>
                </div>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">{place.currentRunnersOnTrack} runners live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Segmented Tab Controls */}
        <div className="flex items-center gap-1 p-2 bg-neutral-950 border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Overview & Slots
          </button>
          <button
            onClick={() => setActiveTab('route')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'route'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Interactive Route & Elevation
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'rules'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Lane Etiquette & Rules
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2.5 bg-neutral-950/70 p-3 rounded-2xl border border-neutral-800/80 text-center">
                <div>
                  <div className="text-[11px] text-neutral-400">Loop Distance</div>
                  <div className="text-base font-bold text-white tabular-nums mt-0.5">
                    {place.loopDistanceKm} <span className="text-xs font-normal text-neutral-400">km</span>
                  </div>
                </div>
                <div className="border-x border-neutral-800">
                  <div className="text-[11px] text-neutral-400">Elevation Gain</div>
                  <div className="text-base font-bold text-white tabular-nums mt-0.5">
                    +{place.elevationGainM} <span className="text-xs font-normal text-neutral-400">m</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400">Surface</div>
                  <div className="text-xs font-bold text-white truncate mt-1 px-1">
                    {place.surfaceType.split('(')[0]}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-sm font-bold text-white">About the Run Space</h2>
                <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                  {place.description}
                </p>
                {place.certifiedBy && (
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-neutral-300 bg-neutral-800/60 p-2.5 rounded-xl border border-neutral-700/50">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong className="text-white font-semibold">Certified:</strong> {place.certifiedBy}</span>
                  </div>
                )}
              </div>

              {/* Available Slots Section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>Select Time Slot</span>
                  </h2>
                  <span className="text-[11px] text-neutral-400">Tomorrow, Morning Dawn</span>
                </div>

                <div className="space-y-2">
                  {place.slots.map((slot) => {
                    const isSelected = (selectedSlotId || place.slots[0].id) === slot.id;
                    const fillPercent = Math.round((slot.bookedCount / slot.capacity) * 100);
                    const isAlmostFull = fillPercent >= 80;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-neutral-800/90 border-orange-500 ring-1 ring-orange-500/50'
                            : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white tabular-nums">{slot.timeLabel}</span>
                            {slot.isSurge && (
                              <span className="text-[10px] text-amber-400 font-medium">· Prime Dawn</span>
                            )}
                          </div>
                          <span className="text-xs font-semibold tabular-nums text-neutral-300">
                            {slot.capacity - slot.bookedCount} spots left
                          </span>
                        </div>

                        {/* Capacity meter bar */}
                        <div className="mt-2 w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              isAlmostFull ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-sm font-bold text-white mb-2">Track & Facility Amenities</h2>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {place.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-neutral-300 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entry & Parking Info */}
              <div className="bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800/80 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Compass className="w-4 h-4 text-orange-400 shrink-0" />
                  <span><strong>Designated Entry Gate:</strong> {place.entryGate}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span><strong>Operating Timings:</strong> {place.operatingHours}</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'route' && (
            <div className="space-y-5">
              {/* Interactive Route SVG Visualizer */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-neutral-400 font-medium">Circuit Architecture</span>
                  <span className="text-orange-400 font-bold tabular-nums">{place.loopDistanceKm} km Loop</span>
                </div>

                <div className="relative w-full h-56 bg-neutral-900/80 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center p-3">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                  {/* SVG Route Circuit */}
                  <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
                    <defs>
                      <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="50%" stopColor="#fb923c" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>
                    </defs>

                    {/* Polyline / Path for Route */}
                    {place.routeWaypoints.length > 2 && (
                      <>
                        {/* Glow track */}
                        <path
                          d={place.routeWaypoints.reduce((acc, curr, i) => 
                            i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`, ''
                          ) + ' Z'}
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.2"
                        />
                        {/* Crisp track line */}
                        <path
                          d={place.routeWaypoints.reduce((acc, curr, i) => 
                            i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`, ''
                          ) + ' Z'}
                          fill="none"
                          stroke="url(#routeGrad)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray={place.category === 'forest_ridge' ? '3 2' : 'none'}
                        />
                      </>
                    )}

                    {/* Waypoint nodes */}
                    {place.routeWaypoints.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r="3" fill="#ffffff" stroke="#f97316" strokeWidth="2" />
                        {pt.label && (
                          <text 
                            x={pt.x} 
                            y={pt.y - 4} 
                            fontSize="3.5" 
                            fill="#d4d4d8" 
                            textAnchor="middle" 
                            fontWeight="bold"
                            className="select-none"
                          >
                            {pt.label}
                          </text>
                        )}
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Elevation Profile Chart */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Elevation Profile</span>
                  </span>
                  <span className="text-neutral-400 tabular-nums">
                    {place.elevationGainM > 0 ? `+${place.elevationGainM}m Gain` : 'Flat Synthetic Plane'}
                  </span>
                </div>

                <div className="h-24 w-full flex items-end gap-1.5 px-2 pt-2 pb-1 bg-neutral-900/60 rounded-xl border border-neutral-800/80">
                  {place.elevationProfile.map((elev, i) => {
                    const minE = Math.min(...place.elevationProfile);
                    const maxE = Math.max(...place.elevationProfile);
                    const range = maxE - minE || 1;
                    const heightPercent = place.elevationGainM === 0 
                      ? 25 
                      : Math.max(15, Math.round(((elev - minE) / range) * 85));

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div 
                          className="w-full bg-gradient-to-t from-orange-600/40 to-orange-400 rounded-t transition-all group-hover:brightness-125"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[9px] text-neutral-400 mt-1 tabular-nums">
                          {elev}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Mandatory Runner Conduct & Etiquette</span>
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  To keep running corridors safe, peaceful, and clean for thousands of athletes each morning, all pass holders must adhere to the following protocol:
                </p>

                <div className="space-y-2.5">
                  {place.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-neutral-300">
                      <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 text-xs text-neutral-400">
                <strong className="text-white block mb-1">Gate Verification Process:</strong>
                Present your digital QR Pass at Gate Turnstile or Checkpost Marshal. Marshals will scan your bib directly from your smartphone screen. No paper printouts needed.
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Action Sheet CTA */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-neutral-400">
              Selected: <span className="text-neutral-200 font-medium">{currentSlot?.timeLabel.split('–')[0]}</span>
            </div>
            <div className="text-lg font-extrabold text-white tabular-nums">
              {place.isFreePermit ? (
                <span className="text-emerald-400">₹0 (Free Permit)</span>
              ) : (
                <>
                  ₹{place.pricePerSlot}
                  <span className="text-xs font-normal text-neutral-400 ml-1">/ session</span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookNow(place, currentSlot?.id)}
            className="flex-1 max-w-[200px] h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all"
          >
            <span>{place.isFreePermit ? 'Get Morning Pass' : 'Proceed to Book'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
