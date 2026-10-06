/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, MapPin, 
  Sparkles, CheckCircle2, Ticket, X, 
  Flame, ChevronRight, Trophy, Zap
} from 'lucide-react';

import { CityId, TrackCategory, RunningPlace, Booking, GroupRun, RunnerProfile, UserLocation } from './types';
import { 
  CITIES, RUNNING_PLACES, GROUP_RUNS, 
  INITIAL_RUNNER_PROFILE, INITIAL_BOOKINGS,
  CITY_DEFAULT_USER_LOCATIONS, calculateDistanceKm 
} from './data/runningData';

import { TopBar } from './components/TopBar';
import { BottomTabBar, TabKey } from './components/BottomTabBar';
import { CityPickerModal } from './components/CityPickerModal';
import { PlaceCard } from './components/PlaceCard';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { BookingFlowModal } from './components/BookingFlowModal';
import { ActivePassModal } from './components/ActivePassModal';
import { TrackRadarTab } from './components/TrackRadarTab';
import { GroupRunsTab } from './components/GroupRunsTab';
import { MyBibsTab } from './components/MyBibsTab';
import { ProfileTab } from './components/ProfileTab';
import { Navigation } from 'lucide-react';

export default function App() {
  // City state
  const [selectedCityId, setSelectedCityId] = useState<CityId>('bengaluru');
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);

  // User location for distance calculation
  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    const defaultLoc = CITY_DEFAULT_USER_LOCATIONS.bengaluru;
    return {
      lat: defaultLoc.lat,
      lng: defaultLoc.lng,
      label: defaultLoc.label,
      isGps: false,
    };
  });
  const [isLocating, setIsLocating] = useState(false);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<TabKey>('explore');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'nearest' | 'popular' | 'distance' | 'price_low' | 'rating'>('nearest');

  // Modal states
  const [selectedPlaceForDetail, setSelectedPlaceForDetail] = useState<RunningPlace | null>(null);
  const [bookingPlace, setBookingPlace] = useState<{ place: RunningPlace; slotId?: string } | null>(null);
  const [activePassForView, setActivePassForView] = useState<Booking | null>(null);

  // Device frame toggle (for mobile feel on desktop)
  const [isFrameMode, setIsFrameMode] = useState(true);

  // Persistence for bookings, groups, profile
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('dhaav_bookings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_BOOKINGS;
  });

  const [groupRuns, setGroupRuns] = useState<GroupRun[]>(() => {
    try {
      const saved = localStorage.getItem('dhaav_group_runs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return GROUP_RUNS;
  });

  const [profile, setProfile] = useState<RunnerProfile>(() => {
    try {
      const saved = localStorage.getItem('dhaav_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_RUNNER_PROFILE;
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // When city changes, update default location if not using custom GPS
  useEffect(() => {
    if (!userLocation.isGps) {
      const defaultLoc = CITY_DEFAULT_USER_LOCATIONS[selectedCityId] || CITY_DEFAULT_USER_LOCATIONS.bengaluru;
      setUserLocation({
        lat: defaultLoc.lat,
        lng: defaultLoc.lng,
        label: defaultLoc.label,
        isGps: false,
      });
    }
  }, [selectedCityId]);

  // Request browser GPS location
  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      showToast('GPS is not supported on this browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Your Current GPS Location',
          isGps: true,
        });
        setIsLocating(false);
        showToast('Distance calculated from your GPS position');
      },
      () => {
        setIsLocating(false);
        showToast('Using city location: ' + userLocation.label);
      },
      { timeout: 8000 }
    );
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('dhaav_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('dhaav_group_runs', JSON.stringify(groupRuns));
    } catch {}
  }, [groupRuns]);

  useEffect(() => {
    try {
      localStorage.setItem('dhaav_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Current city object
  const currentCity = CITIES.find(c => c.id === selectedCityId) || CITIES[0];

  // Places for current city with calculated distance from user's location
  const cityPlacesWithDistance = RUNNING_PLACES
    .filter(p => p.cityId === selectedCityId)
    .map(p => {
      const dist = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        p.coordinates.lat,
        p.coordinates.lng
      );
      return {
        ...p,
        distanceFromUserKm: dist,
      };
    });

  // Filtered and sorted places
  const displayedPlaces = cityPlacesWithDistance
    .filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.surfaceType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'nearest') return (a.distanceFromUserKm ?? 0) - (b.distanceFromUserKm ?? 0);
      if (sortBy === 'distance') return a.loopDistanceKm - b.loopDistanceKm;
      if (sortBy === 'price_low') return a.pricePerSlot - b.pricePerSlot;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.currentRunnersOnTrack - a.currentRunnersOnTrack; // default popular
    });

  // Group runs for current city
  const cityGroupRuns = groupRuns.filter(g => g.cityId === selectedCityId);

  // Handlers
  const handleToggleSavePlace = (placeId: string) => {
    setProfile(prev => {
      const exists = prev.savedPlaceIds.includes(placeId);
      const updated = exists 
        ? prev.savedPlaceIds.filter(id => id !== placeId)
        : [...prev.savedPlaceIds, placeId];
      return { ...prev, savedPlaceIds: updated };
    });
    showToast('Saved places updated');
  };

  const handleToggleJoinGroup = (runId: string) => {
    setGroupRuns(prev => prev.map(r => {
      if (r.id === runId) {
        const nextJoined = !r.isJoined;
        showToast(nextJoined ? 'Spot reserved in group run!' : 'RSVP cancelled');
        return {
          ...r,
          isJoined: nextJoined,
          attendeesCount: nextJoined ? r.attendeesCount + 1 : Math.max(0, r.attendeesCount - 1),
        };
      }
      return r;
    }));
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setBookingPlace(null);
    setSelectedPlaceForDetail(null);
    setActivePassForView(newBooking);
    showToast(`Pass confirmed: ${newBooking.bookingRef}`);
  };

  const handleCheckInBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status: 'checked_in' as const } : b
    ));
    if (activePassForView && activePassForView.id === bookingId) {
      setActivePassForView(prev => prev ? { ...prev, status: 'checked_in' as const } : null);
    }
    showToast('Gate turnstile verified. Welcome runner!');
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    showToast('Running pass cancelled');
  };

  const activePassesCount = bookings.filter(b => b.status !== 'completed').length;
  const savedPlacesObjects = RUNNING_PLACES.filter(p => profile.savedPlaceIds.includes(p.id));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center font-sans antialiased">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-5 z-[70] bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - can be styled as a Mobile Device Shell or Full Width */}
      <div 
        className={`w-full min-h-screen sm:min-h-0 transition-all flex flex-col bg-neutral-950 ${
          isFrameMode 
            ? 'max-w-[430px] sm:my-6 sm:h-[900px] sm:rounded-[42px] sm:border-[8px] sm:border-neutral-800 shadow-[0_25px_70px_rgba(0,0,0,0.8)] sm:overflow-hidden relative' 
            : 'max-w-2xl min-h-screen'
        }`}
      >
        {/* Smartphone top speaker & camera cutout simulation (visible in frame mode on desktop) */}
        {isFrameMode && (
          <div className="hidden sm:flex items-center justify-between px-6 pt-2 pb-1 bg-neutral-950 text-neutral-400 text-[11px] font-mono select-none">
            <span>06:15 AM</span>
            <div className="w-20 h-4 bg-neutral-900 rounded-full" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 border border-neutral-400 rounded-sm p-0.5">
                <div className="bg-emerald-400 w-full h-full rounded-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <TopBar
          currentCity={currentCity}
          onOpenCityPicker={() => setIsCityPickerOpen(true)}
          isFrameMode={isFrameMode}
          onToggleFrameMode={() => setIsFrameMode(!isFrameMode)}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 pb-8">
          {/* TAB 1: EXPLORE / DISCOVER */}
          {activeTab === 'explore' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* City Dawn Advisory Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600/20 via-neutral-900 to-neutral-900 border border-orange-500/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                      TODAY'S RUNNER ADVISORY · {currentCity.name.toUpperCase()}
                    </span>
                    <h2 className="text-base font-extrabold text-white mt-0.5">
                      {currentCity.weather.condition} Morning ({currentCity.weather.tempC}°C)
                    </h2>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      Recommended stride window: <strong className="text-orange-300 font-semibold">{currentCity.weather.recommendedWindow}</strong>.
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-neutral-400 block">Sunrise</span>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {currentCity.weather.sunriseTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Location Distance Anchor */}
              <div className="flex items-center justify-between bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Navigation className="w-3.5 h-3.5 text-orange-400 shrink-0 rotate-45" />
                  <div className="truncate">
                    <span className="text-neutral-400 text-[11px]">Your Location: </span>
                    <span className="font-semibold text-white">{userLocation.label}</span>
                    {userLocation.isGps && (
                      <span className="ml-1.5 text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                        LIVE GPS
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRequestGps}
                  disabled={isLocating}
                  className="text-[11px] font-bold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/30 flex items-center gap-1 shrink-0 transition-colors active:scale-95"
                >
                  {isLocating ? (
                    <span className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>{userLocation.isGps ? 'Refresh GPS' : 'Use My GPS'}</span>
                  )}
                </button>
              </div>

              {/* Search & Surface Filters */}
              <div className="space-y-2.5">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search synthetic track, lake trail, park loop..."
                    className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Categories Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    All Venues
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
                    Lake & Coast
                  </button>
                  <button
                    onClick={() => setSelectedCategory('forest_ridge')}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === 'forest_ridge'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    Forest & Hill
                  </button>
                </div>
              </div>

              {/* Verified Running Venues Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Running Spaces in {currentCity.name}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {displayedPlaces.length} verified routes · Gate pass & slots available
                  </p>
                </div>

                {/* Sort selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="nearest">Nearest to You</option>
                  <option value="popular">Most Striders</option>
                  <option value="rating">Top Rated</option>
                  <option value="distance">Loop Length</option>
                  <option value="price_low">Price: Low to High</option>
                </select>
              </div>

              {/* Places List */}
              {displayedPlaces.length > 0 ? (
                <div className="space-y-4">
                  {displayedPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onSelect={(p) => setSelectedPlaceForDetail(p)}
                      onQuickBook={(p) => setBookingPlace({ place: p })}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-neutral-900/60 border border-neutral-800 rounded-2xl">
                  <p className="text-xs text-neutral-400">No running spaces match your query.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="mt-2 text-xs text-orange-400 font-bold"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRACK RADAR (INTERACTIVE CITY MAP) */}
          {activeTab === 'radar' && (
            <div className="animate-in fade-in duration-200">
              <TrackRadarTab
                currentCity={currentCity}
                places={cityPlacesWithDistance}
                onSelectPlace={(p) => setSelectedPlaceForDetail(p)}
                onBookPlace={(p) => setBookingPlace({ place: p })}
              />
            </div>
          )}

          {/* TAB 3: GROUP RUNS & PACING BUSES */}
          {activeTab === 'crews' && (
            <div className="animate-in fade-in duration-200">
              <GroupRunsTab
                groupRuns={cityGroupRuns}
                onToggleJoin={handleToggleJoinGroup}
                onSelectPlaceForRun={(placeId) => {
                  const target = cityPlacesWithDistance.find(p => p.id === placeId);
                  if (target) setSelectedPlaceForDetail(target);
                }}
              />
            </div>
          )}

          {/* TAB 4: MY BIBS / BOOKINGS */}
          {activeTab === 'bibs' && (
            <div className="animate-in fade-in duration-200">
              <MyBibsTab
                bookings={bookings}
                onOpenPass={(b) => setActivePassForView(b)}
                onExplore={() => setActiveTab('explore')}
                onCancelBooking={handleCancelBooking}
              />
            </div>
          )}

          {/* TAB 5: RUNNER PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-200">
              <ProfileTab
                profile={profile}
                savedPlaces={savedPlacesObjects}
                onSelectPlace={(p) => setSelectedPlaceForDetail(p)}
                onUpdatePace={(newPace) => {
                  setProfile(prev => ({ ...prev, paceCategory: newPace }));
                  showToast('Pace preference updated');
                }}
              />
            </div>
          )}
        </main>

        {/* Bottom Tab Bar Navigation */}
        <BottomTabBar
          activeTab={activeTab}
          onChangeTab={(t) => setActiveTab(t)}
          activePassesCount={activePassesCount}
        />

        {/* Modals */}
        <CityPickerModal
          isOpen={isCityPickerOpen}
          onClose={() => setIsCityPickerOpen(false)}
          selectedCityId={selectedCityId}
          onSelectCity={(cid) => {
            setSelectedCityId(cid);
            showToast(`Switched to ${CITIES.find(c => c.id === cid)?.name}`);
          }}
        />

        <PlaceDetailModal
          place={selectedPlaceForDetail}
          onClose={() => setSelectedPlaceForDetail(null)}
          onBookNow={(p, slotId) => {
            setBookingPlace({ place: p, slotId });
          }}
          isSaved={selectedPlaceForDetail ? profile.savedPlaceIds.includes(selectedPlaceForDetail.id) : false}
          onToggleSave={handleToggleSavePlace}
        />

        {bookingPlace && (
          <BookingFlowModal
            place={bookingPlace.place}
            initialSlotId={bookingPlace.slotId}
            onClose={() => setBookingPlace(null)}
            onBookingSuccess={handleBookingSuccess}
            runnerName={profile.name}
            runnerPhone={profile.phone}
          />
        )}

        <ActivePassModal
          booking={activePassForView}
          onClose={() => setActivePassForView(null)}
          onCheckIn={handleCheckInBooking}
        />
      </div>
    </div>
  );
}
