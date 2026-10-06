import React, { useState } from 'react';
import { 
  User, Award, Target, Phone, Shield, 
  MapPin, Heart, ChevronRight, Check, Edit2, Zap
} from 'lucide-react';
import { RunnerProfile, RunningPlace } from '../types';

interface ProfileTabProps {
  profile: RunnerProfile;
  savedPlaces: RunningPlace[];
  onSelectPlace: (place: RunningPlace) => void;
  onUpdatePace: (pace: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  savedPlaces,
  onSelectPlace,
  onUpdatePace,
}) => {
  const [isEditingPace, setIsEditingPace] = useState(false);
  const [selectedPace, setSelectedPace] = useState(profile.paceCategory);

  const PACE_OPTIONS = [
    'Sub 4:30 min/km (Elite Pace)',
    '4:45 – 5:15 min/km (Fast Tempo)',
    '5:20 – 5:45 min/km (Aerobic Stride)',
    '6:00 – 6:30 min/km (Conversation LSD)',
    '6:45 – 7:30 min/km (Beginner Easy)',
  ];

  const handleSavePace = () => {
    onUpdatePace(selectedPace);
    setIsEditingPace(false);
  };

  return (
    <div className="space-y-5">
      {/* Runner Profile Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-xl">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{profile.name}</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  VERIFIED RUNNER
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">{profile.email}</p>
              <p className="text-xs text-neutral-400 tabular-nums">{profile.phone}</p>
            </div>
          </div>
        </div>

        {/* Milestone Statistics */}
        <div className="grid grid-cols-3 gap-2 bg-neutral-950/70 p-3.5 rounded-2xl border border-neutral-800/80 mt-4 text-center tabular-nums">
          <div>
            <div className="text-[11px] text-neutral-400">Total Distance</div>
            <div className="text-base font-extrabold text-white mt-0.5">
              {profile.totalDistanceKm} <span className="text-xs font-normal text-neutral-400">km</span>
            </div>
          </div>
          <div className="border-x border-neutral-800">
            <div className="text-[11px] text-neutral-400">Track Sessions</div>
            <div className="text-base font-extrabold text-orange-400 mt-0.5">
              {profile.completedRunsThisMonth}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-neutral-400">Weekly Goal</div>
            <div className="text-base font-extrabold text-white mt-0.5">
              {profile.weeklyGoalKm} <span className="text-xs font-normal text-neutral-400">km</span>
            </div>
          </div>
        </div>

        {/* Weekly Progress Bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span>Weekly Mileage Progress</span>
            <span className="text-white font-semibold tabular-nums">24 / {profile.weeklyGoalKm} km (68%)</span>
          </div>
          <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
      </div>

      {/* Pace Category Preference */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <h4 className="text-sm font-bold text-white">Target Stride & Pace</h4>
          </div>
          {!isEditingPace ? (
            <button
              onClick={() => setIsEditingPace(true)}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Change</span>
            </button>
          ) : (
            <button
              onClick={handleSavePace}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          )}
        </div>

        {!isEditingPace ? (
          <div className="text-xs text-neutral-300 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80 flex items-center justify-between">
            <span className="font-semibold text-white">{profile.paceCategory}</span>
            <span className="text-[11px] text-neutral-500">Auto-matches group pacer buses</span>
          </div>
        ) : (
          <div className="space-y-1.5 mt-2">
            {PACE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedPace(opt)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                  selectedPace === opt
                    ? 'bg-neutral-800 text-white font-bold border border-orange-500'
                    : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                }`}
              >
                <span>{opt}</span>
                {selectedPace === opt && <Check className="w-3.5 h-3.5 text-orange-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Contact & Safety */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white">Outdoor Safety & Emergency Contact</h4>
        </div>
        <p className="text-xs text-neutral-400 mb-3">
          Printed on your digital gate pass for ranger checkposts & track safety marshals.
        </p>
        <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-white">{profile.emergencyContact.name}</span>
            <span className="text-neutral-400 ml-1.5 font-normal">({profile.emergencyContact.relation})</span>
          </div>
          <span className="font-mono text-neutral-300 tabular-nums">{profile.emergencyContact.phone}</span>
        </div>
      </div>

      {/* Saved Venues */}
      <div>
        <h4 className="text-sm font-bold text-white mb-2.5 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Saved Running Spots ({savedPlaces.length})</span>
        </h4>
        {savedPlaces.length === 0 ? (
          <p className="text-xs text-neutral-500">No favorite spots saved yet.</p>
        ) : (
          <div className="space-y-2">
            {savedPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-950 shrink-0">
                    <img src={place.heroImage} alt={place.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{place.name}</h5>
                    <p className="text-[11px] text-neutral-400">{place.neighborhood} · {place.loopDistanceKm} km</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
