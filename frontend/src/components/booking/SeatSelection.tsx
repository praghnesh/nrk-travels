"use client";

import React, { useState } from "react";
import { User, ChevronLeft, CheckCircle2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeatSelectionProps {
  totalSeats: number;
  pricePerSeat: string | number;
  onConfirm: (selectedSeats: Record<number, string>) => void;
  onBack: () => void;
  selectedSeats?: Record<number, string>;
  onSeatsChange?: (selectedSeats: Record<number, string>) => void;
}

const SeatButton = ({ id, status, onClick, price, gender }: {
  id: number;
  status: "available" | "selected" | "booked" | "reserved";
  onClick: () => void;
  price: string | number;
  gender: string;
}) => (
  <button
    onClick={onClick}
    disabled={status === "booked" || status === "reserved"}
    className={cn(
      "w-12 h-14 rounded-xl border-2 transition-all flex flex-col items-center justify-center relative group active:scale-90",
      status === "selected"
        ? gender === "female"
          ? "bg-[#e11d48] border-[#be123c] text-white shadow-lg shadow-rose-600/20"
          : "bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-600/20"
        : status === "booked"
          ? "bg-[#94a3b8] border-[#64748b] text-white cursor-not-allowed opacity-60"
          : status === "reserved"
            ? "bg-[#f59e0b] border-[#d97706] text-white cursor-not-allowed"
            : "bg-white border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-600"
    )}
  >
    <span className="text-[9px] font-black uppercase">S{id}</span>
    <span className="text-[7px] font-bold opacity-60">₹{price}</span>
    {status === "selected" && (
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
        <div className={cn(
          "w-2 h-2 rounded-full",
          gender === "female" ? "bg-rose-600" : "bg-blue-600"
        )} />
      </div>
    )}
  </button>
);

const SeatSelection = ({ 
  totalSeats, 
  pricePerSeat, 
  onConfirm, 
  onBack,
  selectedSeats: propSelectedSeats,
  onSeatsChange
}: SeatSelectionProps) => {
  const [localSelectedSeats, setLocalSelectedSeats] = useState<Record<number, string>>({});
  const isControlled = propSelectedSeats !== undefined;
  const selectedSeats = isControlled ? propSelectedSeats : localSelectedSeats;
  const [gender, setGender] = useState<string>("male");

  const BOOKED_SEATS: number[] = []; // Clear simulated booked seats
  const RESERVED_SEATS: number[] = []; // Clear simulated reserved seats

  const toggleSeat = (id: number) => {
    if (BOOKED_SEATS.includes(id) || RESERVED_SEATS.includes(id)) return;

    const next = { ...selectedSeats };
    if (next[id]) {
      delete next[id];
    } else {
      next[id] = gender || "male";
    }

    if (isControlled) {
      if (onSeatsChange) {
        onSeatsChange(next);
      }
    } else {
      setLocalSelectedSeats(next);
    }
  };

  const totalFare = Object.keys(selectedSeats).length * (typeof pricePerSeat === 'string' ? parseInt(pricePerSeat.replace(/,/g, "")) : pricePerSeat);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:border-emerald-200 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Back to Selection
        </button>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border border-slate-200" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Male Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#e11d48]" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Female Selected</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-sm space-y-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Gender (for selected seats)</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender("male")}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  gender === "male" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-50 text-slate-400"
                )}
              >
                Male
              </button>
              <button
                onClick={() => setGender("female")}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  gender === "female" ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" : "bg-slate-50 text-slate-400"
                )}
              >
                Female
              </button>
            </div>
          </div>

          <div className="text-right space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seats Selected</p>
            <p className="text-2xl font-black text-slate-900">{Object.keys(selectedSeats).length} Seats</p>
          </div>
        </div>

        {/* Seat Grid Layout */}
        <div className="bg-slate-50 rounded-[2rem] lg:rounded-[3rem] p-6 md:p-12 flex flex-col items-center border border-slate-100 max-w-2xl mx-auto">
          <div className="mb-8 lg:mb-12">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-slate-800 flex flex-col items-center justify-center text-white shadow-xl">
              <User className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="text-[7px] lg:text-[8px] font-black uppercase mt-1">Driver</span>
            </div>
          </div>

          <div className="space-y-6 w-full flex justify-center">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: totalSeats }).map((_, i) => (
                <SeatButton
                  key={i + 1}
                  id={i + 1}
                  status={BOOKED_SEATS.includes(i + 1) ? "booked" : RESERVED_SEATS.includes(i + 1) ? "reserved" : !!selectedSeats[i + 1] ? "selected" : "available"}
                  onClick={() => toggleSeat(i + 1)}
                  price={pricePerSeat}
                  gender={selectedSeats[i + 1] || gender}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Fare</p>
            <p className="text-3xl font-black text-slate-900">₹{totalFare.toLocaleString('en-IN')}</p>
          </div>
          <button
            disabled={Object.keys(selectedSeats).length === 0}
            onClick={() => onConfirm(selectedSeats)}
            className={cn(
              "px-12 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center gap-3",
              Object.keys(selectedSeats).length > 0
                ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            Confirm Seats <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
