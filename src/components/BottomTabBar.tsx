import React from 'react';
import { Compass, MapPin, Users, Ticket, User } from 'lucide-react';

export type TabKey = 'explore' | 'radar' | 'crews' | 'bibs' | 'profile';

interface BottomTabBarProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
  activePassesCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onChangeTab,
  activePassesCount,
}) => {
  const tabs = [
    { key: 'explore' as TabKey, label: 'Explore', icon: Compass },
    { key: 'radar' as TabKey, label: 'Track Radar', icon: MapPin },
    { key: 'crews' as TabKey, label: 'Group Runs', icon: Users },
    { 
      key: 'bibs' as TabKey, 
      label: 'My Bibs', 
      icon: Ticket,
      badge: activePassesCount > 0 ? activePassesCount : undefined 
    },
    { key: 'profile' as TabKey, label: 'Profile', icon: User },
  ];

  return (
    <nav 
      aria-label="Primary mobile navigation"
      className="sticky bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/80 px-2 py-1.5"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChangeTab(tab.key)}
              className="relative flex flex-col items-center justify-center min-h-[46px] min-w-[56px] py-1 transition-all active:scale-95"
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-orange-500 stroke-[2.5]' : 'text-neutral-400 hover:text-neutral-200'
                  }`} 
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-orange-500 text-white font-mono font-bold text-[9px] flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                isActive ? 'text-orange-400 font-bold' : 'text-neutral-400'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-orange-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
