import React from 'react';
import { X, MapPin, Wind, Sun, Users, Check } from 'lucide-react';
import { City, CityId } from '../types';
import { CITIES } from '../data/runningData';

interface CityPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCityId: CityId;
  onSelectCity: (cityId: CityId) => void;
}

export const CityPickerModal: React.FC<CityPickerModalProps> = ({
  isOpen,
  onClose,
  selectedCityId,
  onSelectCity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle on mobile */}
        <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto my-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Select Running City</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Verified tracks & morning permits across India</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* City list */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {CITIES.map((city: City) => {
            const isSelected = city.id === selectedCityId;
            const aqiColor = 
              city.weather.aqi <= 50 ? 'text-emerald-400' :
              city.weather.aqi <= 100 ? 'text-amber-400' : 'text-rose-400';

            return (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity(city.id);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-neutral-800/90 border-orange-500/80 shadow-md ring-1 ring-orange-500/40'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base tracking-tight">{city.name}</span>
                    <span className="text-xs text-neutral-400 font-normal">{city.state}</span>
                    {isSelected && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white ml-auto">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-neutral-400 mt-1 truncate">{city.tagline}</p>

                  {/* Weather and Running condition indicators */}
                  <div className="mt-2.5 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-400 tabular-nums">
                    <span className="flex items-center gap-1 text-neutral-300">
                      <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{city.weather.tempC}°C · {city.weather.condition}</span>
                    </span>
                    <span className="text-neutral-600">/</span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className={aqiColor}>AQI {city.weather.aqi} ({city.weather.aqiStatus})</span>
                    </span>
                    <span className="text-neutral-600">/</span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Users className="w-3.5 h-3.5 text-orange-400/80 shrink-0" />
                      <span>{city.popularRunnersCount.toLocaleString()} striders</span>
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-neutral-400 bg-neutral-950/60 rounded-lg px-2.5 py-1 inline-block border border-neutral-800/80">
                    Prime run window: <span className="text-neutral-200 font-medium">{city.weather.recommendedWindow}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
