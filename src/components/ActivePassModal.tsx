import React, { useState } from 'react';
import { 
  X, MapPin, Calendar, Clock, CheckCircle2, 
  Share2, Key, Download, ShieldCheck, 
  ArrowLeft
} from 'lucide-react';
import { Booking } from '../types';

interface ActivePassModalProps {
  booking: Booking | null;
  onClose: () => void;
  onCheckIn?: (bookingId: string) => void;
}

export const ActivePassModal: React.FC<ActivePassModalProps> = ({
  booking,
  onClose,
  onCheckIn,
}) => {
  const [copied, setCopied] = useState(false);
  const [walletSaved, setWalletSaved] = useState(false);

  if (!booking) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Dhaav Runner Pass: ${booking.placeName}`,
        text: `My verified morning running pass for ${booking.placeName} (${booking.date}, ${booking.slotTime}). Ref: ${booking.bookingRef}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`DHAAV PASS: ${booking.placeName} | Ref: ${booking.bookingRef}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWalletSave = () => {
    setWalletSaved(true);
    setTimeout(() => setWalletSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-neutral-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Live Digital Runner Bib
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bib Container */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Physical Bib-style Card */}
          <div className="relative bg-gradient-to-b from-neutral-850 to-neutral-900 border-2 border-orange-500/60 rounded-3xl p-5 shadow-2xl overflow-hidden">
            {/* Athletic Diagonal Watermark Stripe */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Bar of Bib */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-bold">
                  DHAAV PASS REF
                </span>
                <span className="font-mono text-sm font-extrabold text-orange-400 tabular-nums">
                  {booking.bookingRef}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-bold">
                  PASS STATUS
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{booking.status === 'checked_in' ? 'CHECKED IN' : 'CONFIRMED'}</span>
                </span>
              </div>
            </div>

            {/* Place Details */}
            <div className="py-3.5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                RUNNING VENUE
              </span>
              <h3 className="text-lg font-black text-white leading-tight mt-0.5">
                {booking.placeName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>{booking.neighborhood}</span>
                <span aria-hidden="true">·</span>
                <span className="text-neutral-300 font-medium">{booking.passTypeName}</span>
              </div>
            </div>

            {/* Runner & Date Strip */}
            <div className="grid grid-cols-2 gap-2 bg-neutral-950/80 p-3 rounded-2xl border border-neutral-800/80 text-xs my-1">
              <div>
                <span className="text-[10px] text-neutral-400 block">RUNNER NAME</span>
                <strong className="text-white font-bold text-sm truncate block mt-0.5">
                  {booking.runnerName}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">ENTRY GATE</span>
                <strong className="text-orange-300 font-bold text-xs truncate block mt-0.5">
                  {booking.entryGate}
                </strong>
              </div>
              <div className="mt-1 pt-1 border-t border-neutral-800/60">
                <span className="text-[10px] text-neutral-400 block">DATE</span>
                <span className="text-white font-semibold">{booking.date}</span>
              </div>
              <div className="mt-1 pt-1 border-t border-neutral-800/60">
                <span className="text-[10px] text-neutral-400 block">SLOT TIMING</span>
                <span className="text-white font-semibold tabular-nums">{booking.slotTime}</span>
              </div>
            </div>

            {/* QR Code Presentation Box */}
            <div className="mt-4 bg-white p-4 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
              {/* Dynamic Scan Line Simulation */}
              <div className="absolute left-0 right-0 h-0.5 bg-orange-500 opacity-80 shadow-[0_0_8px_#f97316] animate-bounce" />

              {/* Simulated High-Res Vector QR Code */}
              <svg viewBox="0 0 140 140" className="w-40 h-40">
                {/* 3 Corner Anchor Boxes */}
                <rect x="10" y="10" width="30" height="30" fill="#000" rx="3" />
                <rect x="15" y="15" width="20" height="20" fill="#fff" rx="2" />
                <rect x="20" y="20" width="10" height="10" fill="#000" rx="1" />

                <rect x="100" y="10" width="30" height="30" fill="#000" rx="3" />
                <rect x="105" y="15" width="20" height="20" fill="#fff" rx="2" />
                <rect x="110" y="20" width="10" height="10" fill="#000" rx="1" />

                <rect x="10" y="100" width="30" height="30" fill="#000" rx="3" />
                <rect x="15" y="105" width="20" height="20" fill="#fff" rx="2" />
                <rect x="20" y="110" width="10" height="10" fill="#000" rx="1" />

                {/* Data Matrix Dots */}
                <g fill="#000">
                  <rect x="48" y="12" width="6" height="6" />
                  <rect x="62" y="16" width="6" height="6" />
                  <rect x="76" y="12" width="6" height="6" />
                  <rect x="88" y="22" width="6" height="6" />

                  <rect x="12" y="48" width="6" height="6" />
                  <rect x="24" y="60" width="6" height="6" />
                  <rect x="36" y="48" width="6" height="6" />
                  <rect x="18" y="76" width="6" height="6" />
                  <rect x="30" y="86" width="6" height="6" />

                  <rect x="52" y="48" width="6" height="6" />
                  <rect x="64" y="48" width="6" height="6" />
                  <rect x="76" y="56" width="6" height="6" />
                  <rect x="52" y="68" width="6" height="6" />
                  <rect x="72" y="68" width="6" height="6" />
                  <rect x="60" y="80" width="6" height="6" />
                  <rect x="80" y="80" width="6" height="6" />

                  <rect x="104" y="48" width="6" height="6" />
                  <rect x="118" y="56" width="6" height="6" />
                  <rect x="104" y="72" width="6" height="6" />
                  <rect x="120" y="82" width="6" height="6" />

                  <rect x="48" y="104" width="6" height="6" />
                  <rect x="60" y="116" width="6" height="6" />
                  <rect x="76" y="104" width="6" height="6" />
                  <rect x="88" y="116" width="6" height="6" />
                  <rect x="104" y="104" width="6" height="6" />
                  <rect x="116" y="118" width="6" height="6" />
                </g>

                {/* Central Brand Emblem */}
                <circle cx="70" cy="70" r="14" fill="#f97316" />
                <path d="M 64 70 L 68 74 L 76 64" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <span className="text-[10px] font-mono text-neutral-800 font-bold uppercase tracking-wider mt-1">
                SCAN AT ENTRY TURNSTILE
              </span>
            </div>

            {/* Locker PIN code if present */}
            {booking.lockerCode && (
              <div className="mt-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-neutral-300 font-medium">Digital Locker Token</span>
                </div>
                <div className="text-xs font-mono font-bold text-white bg-neutral-800 px-2.5 py-1 rounded-md border border-neutral-700">
                  PIN: {booking.lockerCode}
                </div>
              </div>
            )}

            {/* Add-ons list if any */}
            {booking.addOns.length > 0 && (
              <div className="mt-3 text-[11px] text-neutral-400 flex items-center gap-1.5 flex-wrap">
                <span className="text-neutral-500 font-semibold">Included:</span>
                {booking.addOns.map((add, i) => (
                  <span key={i} className="text-neutral-300">
                    {add}{i < booking.addOns.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWalletSave}
              className="py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>{walletSaved ? 'Pass Saved!' : 'Add to Wallet'}</span>
            </button>

            <button
              onClick={handleShare}
              className="py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-orange-400" />
              <span>{copied ? 'Copied Link!' : 'Share Pass'}</span>
            </button>
          </div>

          {/* Turnstile Check-In Simulation */}
          {onCheckIn && booking.status !== 'checked_in' && (
            <button
              onClick={() => onCheckIn(booking.id)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Simulate Turnstile Gate Scan (Check In)</span>
            </button>
          )}

          {booking.status === 'checked_in' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-center text-xs text-emerald-400 font-semibold">
              ✓ Checked in at {booking.entryGate}. Enjoy your morning run!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
