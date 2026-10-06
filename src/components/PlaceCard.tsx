import React, { useState } from 'react';
import { ChevronRight, Users, Navigation, Star, ShieldCheck } from 'lucide-react';
import { RunningPlace } from '../types';

interface PlaceCardProps {
  place: RunningPlace;
  onSelect: (place: RunningPlace) => void;
  onQuickBook: (place: RunningPlace) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onSelect,
  onQuickBook,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      onClick={() => onSelect(place)}
      className="group relative bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col active:scale-[0.99]"
    >
      {/* Visual media banner */}
      <div className="relative h-44 w-full bg-neutral-950 overflow-hidden">
        {!imgError ? (
          <img
            src={place.heroImage}
            alt={place.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-400 p-4 text-center">
            <Navigation className="w-8 h-8 text-orange-400 mb-2" />
            <span className="text-sm font-semibold text-neutral-200">{place.name}</span>
          </div>
        )}

        {/* Contrast scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

        {/* Top meta tags: quiet unboxed label on image */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="text-neutral-100 font-medium tracking-tight bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
            {place.categoryLabel}
          </span>
          <div className="flex items-center gap-1 text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 tabular-nums">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-xs">{place.rating}</span>
            <span className="text-neutral-400 text-[10px]">({place.reviewCount})</span>
          </div>
        </div>

        {/* Bottom image overlay: Live runners indicator */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-neutral-300">
          <span className="flex items-center gap-1.5 tabular-nums text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {place.currentRunnersOnTrack} runners currently active
          </span>
          {place.certifiedBy && (
            <span className="flex items-center gap-1 text-[11px] text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Certified Track</span>
            </span>
          )}
        </div>
      </div>

      {/* Content body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed metadata line with typographic bullet separators */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-400">
            {place.distanceFromUserKm !== undefined && (
              <>
                <span className="flex items-center gap-1 font-bold text-orange-400 tabular-nums">
                  <Navigation className="w-3 h-3 text-orange-400 shrink-0 rotate-45" />
                  <span>{place.distanceFromUserKm} km away</span>
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{place.neighborhood}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-medium text-neutral-300">{place.loopDistanceKm} km loop</span>
            <span aria-hidden="true">·</span>
            <span>{place.surfaceType.split('(')[0].trim()}</span>
          </div>

          {/* Place title */}
          <h3 className="text-base font-bold text-white mt-1 group-hover:text-orange-400 transition-colors leading-snug">
            {place.name}
          </h3>

          <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Pricing & Booking action bar */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-neutral-400">Entry Access</div>
            <div className="text-sm font-bold text-white tabular-nums">
              {place.isFreePermit ? (
                <span className="text-emerald-400 font-semibold">Free Permit QR</span>
              ) : (
                <>
                  ₹{place.pricePerSlot}
                  <span className="text-xs font-normal text-neutral-400 ml-1">/ session</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickBook(place);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center gap-1 shadow-sm shadow-orange-500/20 active:scale-95"
            >
              <span>{place.isFreePermit ? 'Get Permit' : 'Book Slot'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
