import React from 'react';
import { MapPin, ChevronDown, Wind, Smartphone, Monitor } from 'lucide-react';
import { City } from '../types';

interface TopBarProps {
  currentCity: City;
  onOpenCityPicker: () => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentCity,
  onOpenCityPicker,
  isFrameMode,
  onToggleFrameMode,
}) => {
  const aqiColor = 
    currentCity.weather.aqi <= 50 ? 'text-emerald-400' :
    currentCity.weather.aqi <= 100 ? 'text-amber-400' : 'text-rose-400';

  return (
    <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Brand Zone: wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <span className="font-extrabold text-white text-base font-display">धा</span>
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white font-display">
              DHAAV
            </span>
          </div>
        </div>

        {/* City Selector Trigger Button */}
        <button
          type="button"
          onClick={onOpenCityPicker}
          aria-label="Change city"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs transition-colors active:scale-95"
        >
          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="font-bold text-white tracking-tight">{currentCity.name}</span>
          <ChevronDown className="w-3 h-3 text-neutral-400" />
        </button>

        {/* Frame Toggle for Desktop reviewers */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleFrameMode}
            title={isFrameMode ? 'Switch to responsive fluid view' : 'Switch to mobile device frame'}
            className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors hidden sm:flex"
          >
            {isFrameMode ? (
              <Monitor className="w-4 h-4" />
            ) : (
              <Smartphone className="w-4 h-4 text-orange-400" />
            )}
          </button>
        </div>
      </div>

      {/* Weather & Live Air Advisory ticker below header */}
      <div className="mt-2 pt-2 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-400 max-w-md mx-auto">
        <div className="flex items-center gap-2 tabular-nums">
          <span className="text-neutral-200 font-medium">
            {currentCity.weather.tempC}°C {currentCity.weather.condition}
          </span>
          <span className="text-neutral-700">·</span>
          <span className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-neutral-500" />
            <span className={aqiColor}>AQI {currentCity.weather.aqi}</span>
          </span>
        </div>

        <div className="text-[10px] text-neutral-400 font-medium truncate max-w-[170px]">
          Sunrise {currentCity.weather.sunriseTime}
        </div>
      </div>
    </header>
  );
};
