import React, { useState } from 'react';
import { Users, Calendar, Clock, MapPin, Check, Plus, Shield, Sparkles } from 'lucide-react';
import { GroupRun, RunningPlace } from '../types';

interface GroupRunsTabProps {
  groupRuns: GroupRun[];
  onToggleJoin: (runId: string) => void;
  onSelectPlaceForRun: (placeId: string) => void;
}

export const GroupRunsTab: React.FC<GroupRunsTabProps> = ({
  groupRuns,
  onToggleJoin,
  onSelectPlaceForRun,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filteredRuns = groupRuns.filter(r => {
    if (filterDifficulty === 'all') return true;
    return r.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  return (
    <div className="space-y-4">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-orange-500/15 via-neutral-900 to-neutral-900 border border-orange-500/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>Weekend LSD & Pacing Buses</span>
        </div>
        <h3 className="text-base font-extrabold text-white">Join Certified Indian Run Crews</h3>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
          Never run alone. Join pacers with dedicated pacing flags, hydration support points, and post-run tender coconut / filter coffee meetups.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        <button
          onClick={() => setFilterDifficulty('all')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
            filterDifficulty === 'all'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          All Pacing Groups ({groupRuns.length})
        </button>
        <button
          onClick={() => setFilterDifficulty('beginner')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
            filterDifficulty === 'beginner'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Beginner / Easy 5K
        </button>
        <button
          onClick={() => setFilterDifficulty('intermediate')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
            filterDifficulty === 'intermediate'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Half Marathon LSD (10-15K)
        </button>
        <button
          onClick={() => setFilterDifficulty('advanced')}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
            filterDifficulty === 'advanced'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          Speed & Track Repeats
        </button>
      </div>

      {/* Group Runs List */}
      <div className="space-y-3">
        {filteredRuns.map((run) => {
          const isJoined = run.isJoined;

          return (
            <div
              key={run.id}
              className={`bg-neutral-900 border rounded-2xl p-4 transition-all duration-200 ${
                isJoined 
                  ? 'border-orange-500/80 bg-neutral-900/90 shadow-md ring-1 ring-orange-500/30' 
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Top metadata line: no pills, unboxed with separators */}
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-orange-400">{run.hostClub}</span>
                  <span aria-hidden="true">·</span>
                  <span>Led by {run.hostName}</span>
                </div>
                <span className={`text-[11px] font-bold ${
                  run.difficulty === 'Beginner' ? 'text-emerald-400' :
                  run.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {run.difficulty}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-base font-bold text-white mt-1 leading-snug">
                {run.title}
              </h4>

              {/* Venue button */}
              <button
                onClick={() => onSelectPlaceForRun(run.placeId)}
                className="text-xs text-neutral-300 hover:text-orange-400 flex items-center gap-1.5 mt-1 text-left group"
              >
                <MapPin className="w-3.5 h-3.5 text-neutral-500 group-hover:text-orange-400 shrink-0" />
                <span className="underline decoration-neutral-700 underline-offset-2">
                  {run.placeName} ({run.neighborhood})
                </span>
              </button>

              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                {run.description}
              </p>

              {/* Schedule and Pacing Strip */}
              <div className="grid grid-cols-3 gap-2 bg-neutral-950/70 p-3 rounded-xl border border-neutral-800/80 text-xs my-3 tabular-nums">
                <div>
                  <span className="text-[10px] text-neutral-400 block">SCHEDULE</span>
                  <strong className="text-white font-bold block mt-0.5 truncate">{run.date}</strong>
                  <span className="text-neutral-400 text-[11px]">{run.time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">DISTANCE</span>
                  <strong className="text-white font-bold block mt-0.5">{run.distanceKm} km</strong>
                  <span className="text-neutral-400 text-[11px]">Certified Loop</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">TARGET PACE</span>
                  <strong className="text-orange-300 font-bold block mt-0.5 truncate">{run.paceTarget.split('(')[0]}</strong>
                  <span className="text-neutral-400 text-[10px] truncate block">Steady Pacer</span>
                </div>
              </div>

              {/* Bottom RSVP Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <div className="text-xs text-neutral-400 flex items-center gap-1.5 tabular-nums">
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  <span>
                    <strong className="text-white font-semibold">{run.attendeesCount}</strong> / {run.maxCapacity} runners RSVP’d
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleJoin(run.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                    isJoined
                      ? 'bg-neutral-800 text-orange-400 border border-orange-500/60'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Spot Reserved</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>RSVP Free</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
