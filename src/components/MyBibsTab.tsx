import React from 'react';
import { Ticket, QrCode, MapPin, Calendar, Clock, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Booking } from '../types';

interface MyBibsTabProps {
  bookings: Booking[];
  onOpenPass: (booking: Booking) => void;
  onExplore: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export const MyBibsTab: React.FC<MyBibsTabProps> = ({
  bookings,
  onOpenPass,
  onExplore,
  onCancelBooking,
}) => {
  const activeBookings = bookings.filter(b => b.status !== 'completed');
  const pastBookings = bookings.filter(b => b.status === 'completed');

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-neutral-900 border border-neutral-800 rounded-3xl min-h-[360px]">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
          <Ticket className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">No Active Running Passes</h3>
        <p className="text-xs text-neutral-400 max-w-xs mt-1.5 leading-relaxed">
          You haven't reserved any track sessions or morning park permits yet. Browse verified running spaces across Indian cities to get started.
        </p>
        <button
          onClick={onExplore}
          className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-lg shadow-orange-500/20"
        >
          Explore Running Venues
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Active Passes Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active & Upcoming Bibs ({activeBookings.length})</span>
          </h3>
          <span className="text-[11px] text-neutral-400">Ready for turnstile scan</span>
        </div>

        <div className="space-y-3">
          {activeBookings.map((b) => (
            <div
              key={b.id}
              onClick={() => onOpenPass(b)}
              className="group bg-neutral-900 border border-neutral-800 hover:border-orange-500/70 rounded-2xl p-4 transition-all cursor-pointer relative overflow-hidden shadow-lg active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-mono text-orange-400 font-bold">{b.bookingRef}</span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-emerald-400 font-medium">
                      {b.status === 'checked_in' ? 'Checked In' : 'Confirmed'}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white mt-1 group-hover:text-orange-400 transition-colors leading-tight">
                    {b.placeName}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{b.neighborhood}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-neutral-300">{b.entryGate}</span>
                  </div>
                </div>

                {/* QR Code thumbnail icon */}
                <div className="w-14 h-14 bg-white rounded-xl p-1.5 shrink-0 flex flex-col items-center justify-center shadow-md">
                  <QrCode className="w-9 h-9 text-black" />
                  <span className="text-[8px] font-mono text-black font-extrabold tracking-tighter">
                    TAP PASS
                  </span>
                </div>
              </div>

              {/* Slot & Date strip */}
              <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs tabular-nums text-neutral-300">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    <span>{b.date}</span>
                  </span>
                  <span className="text-neutral-600">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{b.slotTime}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-orange-400 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                  <span>View Bib</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Add-ons tag preview */}
              {b.addOns && b.addOns.length > 0 && (
                <div className="mt-2 text-[10px] text-neutral-400 bg-neutral-950/70 px-2.5 py-1 rounded-lg inline-block border border-neutral-800/60">
                  {b.addOns.join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Runner gate instructions card */}
      <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800 text-xs text-neutral-400 space-y-1.5">
        <div className="flex items-center gap-2 text-white font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Paperless Gate Access</span>
        </div>
        <p className="leading-relaxed">
          Hold your phone with QR code face-up at the automated turnstiles or security checkposts 15 minutes before slot commencement.
        </p>
      </div>
    </div>
  );
};
