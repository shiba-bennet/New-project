export type CityId = 'bengaluru' | 'mumbai' | 'delhi' | 'hyderabad' | 'chennai' | 'pune';

export type TrackCategory = 
  | 'synthetic_track' 
  | 'heritage_park' 
  | 'lake_trail' 
  | 'coastal_promenade' 
  | 'forest_ridge';

export interface WeatherInfo {
  tempC: number;
  condition: string;
  aqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Poor' | 'Very Poor';
  humidity: number;
  sunriseTime: string;
  recommendedWindow: string;
}

export interface City {
  id: CityId;
  name: string;
  state: string;
  tagline: string;
  weather: WeatherInfo;
  popularRunnersCount: number;
}

export interface Slot {
  id: string;
  timeLabel: string;
  period: 'morning' | 'evening' | 'night';
  capacity: number;
  bookedCount: number;
  isSurge?: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  label: string;
  isGps: boolean;
}

export interface RunningPlace {
  id: string;
  name: string;
  cityId: CityId;
  neighborhood: string;
  category: TrackCategory;
  categoryLabel: string;
  heroImage: string;
  description: string;
  surfaceType: string;
  loopDistanceKm: number;
  elevationGainM: number;
  certifiedBy?: string;
  operatingHours: string;
  pricePerSlot: number;
  isFreePermit: boolean;
  rating: number;
  reviewCount: number;
  currentRunnersOnTrack: number;
  amenities: string[];
  rules: string[];
  entryGate: string;
  parkingAvailable: boolean;
  slots: Slot[];
  coordinates: {
    lat: number;
    lng: number;
    xPercent: number; // for custom map visualizer (0-100)
    yPercent: number;
  };
  distanceFromUserKm?: number;
  routeWaypoints: { x: number; y: number; label?: string }[];
  elevationProfile: number[]; // relative elevation heights
}

export interface Booking {
  id: string;
  bookingRef: string;
  placeId: string;
  placeName: string;
  cityId: CityId;
  neighborhood: string;
  date: string;
  slotId: string;
  slotTime: string;
  passType: 'single_session' | 'ten_run_punch' | 'free_morning_permit';
  passTypeName: string;
  runnerName: string;
  runnerPhone: string;
  totalPrice: number;
  addOns: string[];
  lockerCode?: string;
  entryGate: string;
  status: 'confirmed' | 'checked_in' | 'completed';
  bookedAt: string;
  qrPayload: string;
}

export interface GroupRun {
  id: string;
  title: string;
  placeId: string;
  placeName: string;
  cityId: CityId;
  neighborhood: string;
  dayLabel: string;
  date: string;
  time: string;
  distanceKm: number;
  paceTarget: string; // e.g. "5:45 min/km (Easy Aerobic)"
  hostClub: string;
  hostName: string;
  attendeesCount: number;
  maxCapacity: number;
  isJoined?: boolean;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface RunnerProfile {
  name: string;
  phone: string;
  email: string;
  cityId: CityId;
  paceCategory: string; // e.g., "5:15 - 5:45 min/km"
  weeklyGoalKm: number;
  completedRunsThisMonth: number;
  totalDistanceKm: number;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  savedPlaceIds: string[];
}
