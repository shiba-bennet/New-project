import React, { useState } from 'react';
import { 
  X, Calendar, Clock, Check, ShieldCheck, 
  Sparkles, CreditCard, ArrowRight, Lock
} from 'lucide-react';
import { RunningPlace, Booking, CityId } from '../types';

interface BookingFlowModalProps {
  place: RunningPlace | null;
  initialSlotId?: string;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
  runnerName: string;
  runnerPhone: string;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  place,
  initialSlotId,
  onClose,
  onBookingSuccess,
  runnerName,
  runnerPhone,
}) => {
  if (!place) return null;

  // Dates: Next 4 days
  const DATES = [
    { label: 'Tomorrow', sub: 'Oct 7 (Wed)', val: 'Tomorrow, Oct 7' },
    { label: 'Thursday', sub: 'Oct 8 (Thu)', val: 'Thursday, Oct 8' },
    { label: 'Friday', sub: 'Oct 9 (Fri)', val: 'Friday, Oct 9' },
    { label: 'Saturday', sub: 'Oct 10 (Sat)', val: 'Saturday, Oct 10' },
  ];

  const [selectedDate, setSelectedDate] = useState(DATES[0].val);
  const [selectedSlotId, setSelectedSlotId] = useState(initialSlotId || place.slots[0].id);
  const [passType, setPassType] = useState<'single_session' | 'ten_run_punch'>(
    place.isFreePermit ? 'single_session' : 'single_session'
  );
  const [name, setName] = useState(runnerName);
  const [phone, setPhone] = useState(runnerPhone);
  
  // Add-ons state
  const [includeLocker, setIncludeLocker] = useState(false);
  const [includeHydration, setIncludeHydration] = useState(false);
  const [includePacer, setIncludePacer] = useState(false);

  // Payment method
  const [paymentProvider, setPaymentProvider] = useState<'upi_gpay' | 'upi_phonepe' | 'upi_paytm' | 'card'>('upi_gpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedSlot = place.slots.find(s => s.id === selectedSlotId) || place.slots[0];

  // Pricing calculations
  const basePrice = place.isFreePermit 
    ? 0 
    : passType === 'ten_run_punch' 
      ? Math.round(place.pricePerSlot * 7.5) // 25% discount for 10-pack
      : place.pricePerSlot;

  const lockerCost = includeLocker ? 30 : 0;
  const hydrationCost = includeHydration ? 20 : 0;
  const totalPrice = basePrice + lockerCost + hydrationCost;

  const handleConfirmBooking = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const bookingRef = `DHV-${place.cityId.slice(0, 3).toUpperCase()}-${randomNum}`;
      const randomLocker = includeLocker ? `${Math.floor(1000 + Math.random() * 9000)}` : undefined;

      const addOnsList: string[] = [];
      if (includeLocker) addOnsList.push(`Locker Access (PIN: ${randomLocker})`);
      if (includeHydration) addOnsList.push('Electrolyte Flask Token');
      if (includePacer) addOnsList.push('Pacer Group Assigned');

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingRef,
        placeId: place.id,
        placeName: place.name,
        cityId: place.cityId as CityId,
        neighborhood: place.neighborhood,
        date: selectedDate,
        slotId: selectedSlot.id,
        slotTime: selectedSlot.timeLabel,
        passType: place.isFreePermit ? 'free_morning_permit' : passType,
        passTypeName: place.isFreePermit 
          ? 'Morning Runner Community Permit' 
          : passType === 'ten_run_punch' ? '10-Session Track Pass' : 'Single Session Athlete Pass',
        runnerName: name || 'Runner',
        runnerPhone: phone || '+91 98765 43210',
        totalPrice,
        addOns: addOnsList,
        lockerCode: randomLocker,
        entryGate: place.entryGate,
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
        qrPayload: `DHAAV:${place.id}:${bookingRef}:${encodeURIComponent(name)}:${Date.now()}:GATE-OK`,
      };

      setIsProcessing(false);
      onBookingSuccess(newBooking);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-neutral-900 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950">
          <div>
            <h2 className="text-base font-bold text-white font-display">
              {place.isFreePermit ? 'Reserve Morning Permit' : 'Book Track Pass'}
            </h2>
            <p className="text-xs text-neutral-400 truncate max-w-[280px]">
              {place.name}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* Step 1: Date Selection */}
          <div>
            <label className="text-xs font-bold text-white block mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>Select Date</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DATES.map((d) => {
                const isSelected = selectedDate === d.val;
                return (
                  <button
                    key={d.val}
                    type="button"
                    onClick={() => setSelectedDate(d.val)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-neutral-800 border-orange-500 ring-1 ring-orange-500/50 text-white'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{d.label}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 truncate">{d.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Slot Selection */}
          <div>
            <label className="text-xs font-bold text-white block mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>Select Stride Window</span>
            </label>
            <div className="space-y-2">
              {place.slots.map((s) => {
                const isSelected = selectedSlotId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSlotId(s.id)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-neutral-800 border-orange-500 ring-1 ring-orange-500/50'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-orange-500 bg-orange-500' : 'border-neutral-600'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                      </div>
                      <span className="text-xs font-bold text-white tabular-nums">{s.timeLabel}</span>
                      {s.isSurge && <span className="text-[10px] text-amber-400 font-semibold">· Dawn Prime</span>}
                    </div>
                    <span className="text-xs text-neutral-400 tabular-nums">
                      {s.capacity - s.bookedCount} spots left
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Pass Type (if paid place) */}
          {!place.isFreePermit && (
            <div>
              <label className="text-xs font-bold text-white block mb-2">Choose Pass Tier</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPassType('single_session')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    passType === 'single_session'
                      ? 'bg-neutral-800 border-orange-500 ring-1 ring-orange-500/50'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">Single Session</div>
                  <div className="text-base font-extrabold text-orange-400 mt-1 tabular-nums">
                    ₹{place.pricePerSlot}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Valid for 1 booked session</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPassType('ten_run_punch')}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                    passType === 'ten_run_punch'
                      ? 'bg-neutral-800 border-orange-500 ring-1 ring-orange-500/50'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>10-Run Punch</span>
                    <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold">25% OFF</span>
                  </div>
                  <div className="text-base font-extrabold text-emerald-400 mt-1 tabular-nums">
                    ₹{Math.round(place.pricePerSlot * 7.5)}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">10 flexible track entries</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Facility Add-Ons */}
          <div>
            <label className="text-xs font-bold text-white block mb-2 flex items-center justify-between">
              <span>Runner Add-Ons (Optional)</span>
              <span className="text-[10px] text-neutral-400">On-site redemption</span>
            </label>
            <div className="space-y-2">
              <label 
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  includeLocker ? 'bg-neutral-800/90 border-orange-500/70' : 'bg-neutral-950/60 border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox"
                    checked={includeLocker}
                    onChange={(e) => setIncludeLocker(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 accent-orange-500 bg-neutral-900 border-neutral-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Digital Locker & Shower Access</div>
                    <div className="text-[10px] text-neutral-400">PIN provided immediately upon booking</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-200 tabular-nums">+₹30</span>
              </label>

              <label 
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  includeHydration ? 'bg-neutral-800/90 border-orange-500/70' : 'bg-neutral-950/60 border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox"
                    checked={includeHydration}
                    onChange={(e) => setIncludeHydration(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 accent-orange-500 bg-neutral-900 border-neutral-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Electrolyte Hydration Flask Token</div>
                    <div className="text-[10px] text-neutral-400">Refillable fast-flow energy dispenser token</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-200 tabular-nums">+₹20</span>
              </label>

              <label 
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  includePacer ? 'bg-neutral-800/90 border-orange-500/70' : 'bg-neutral-950/60 border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input 
                    type="checkbox"
                    checked={includePacer}
                    onChange={(e) => setIncludePacer(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 accent-orange-500 bg-neutral-900 border-neutral-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Pacer Group Match (Free)</div>
                    <div className="text-[10px] text-neutral-400">Sync with volunteer pacesetter on the track</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400">Free</span>
              </label>
            </div>
          </div>

          {/* Step 5: Runner Details */}
          <div>
            <label className="text-xs font-bold text-white block mb-2">Runner Contact for QR Gate Pass</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-neutral-400 block mb-1">Full Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun Sen"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block mb-1">Phone (SMS Backup)</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Step 6: Payment Method (if paid) */}
          {totalPrice > 0 && (
            <div>
              <label className="text-xs font-bold text-white block mb-2">Instant Payment (Simulated)</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentProvider('upi_gpay')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    paymentProvider === 'upi_gpay'
                      ? 'bg-neutral-800 border-orange-500 ring-1 ring-orange-500/50 text-white'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold">Google Pay</div>
                  <div className="text-[10px] text-neutral-400">Instant UPI</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentProvider('upi_phonepe')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    paymentProvider === 'upi_phonepe'
                      ? 'bg-neutral-800 border-orange-500 ring-1 ring-orange-500/50 text-white'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold">PhonePe</div>
                  <div className="text-[10px] text-neutral-400">Instant UPI</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentProvider('upi_paytm')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    paymentProvider === 'upi_paytm'
                      ? 'bg-neutral-800 border-orange-500 ring-1 ring-orange-500/50 text-white'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold">Paytm / Cards</div>
                  <div className="text-[10px] text-neutral-400">UPI / Rupay</div>
                </button>
              </div>
            </div>
          )}

          {/* Security note */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Digital QR entry pass issued instantly. Turnstile auto-scans in &lt;1 second.</span>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-neutral-400">Total Payable</div>
            <div className="text-xl font-extrabold text-white tabular-nums">
              {totalPrice === 0 ? (
                <span className="text-emerald-400">₹0 Free</span>
              ) : (
                `₹${totalPrice}`
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirmBooking}
            className="flex-1 max-w-[220px] h-12 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all"
          >
            {isProcessing ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Issuing Pass...
              </span>
            ) : (
              <>
                <span>{totalPrice === 0 ? 'Confirm Free Pass' : `Pay ₹${totalPrice} & Issue`}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
