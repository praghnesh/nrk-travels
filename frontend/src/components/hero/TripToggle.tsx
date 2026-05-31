/**
 * =========================================
 * TripToggle Component
 * Toggle switch for One Way / Round Trip
 * =========================================
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TripToggleProps {
  value: "one-way" | "round-trip";
  onChange: (value: "one-way" | "round-trip") => void;
}

const TripToggle: React.FC<TripToggleProps> = ({ value, onChange }) => {
  return (
    <div className="flex bg-slate-50 p-1 rounded-2xl w-full relative h-14 lg:h-16 border border-slate-200 items-stretch overflow-hidden">
      {/* Animated Background Slide */}
      <div
        className={cn(
          "absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-orange-600 rounded-xl shadow-md z-0 transition-transform duration-300 ease-out",
          value === "round-trip" ? "translate-x-full" : "translate-x-0"
        )}
      />

      <button
        onClick={() => onChange("one-way")}
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-0.5 px-2 z-10 transition-colors duration-300",
          value === "one-way" ? "text-white" : "text-slate-600 hover:text-orange-600"
        )}
      >
        <span className="text-xs lg:text-sm font-black uppercase tracking-tight whitespace-nowrap">One Way</span>
        <span className="text-[7px] lg:text-[9px] opacity-80 font-bold uppercase tracking-tighter leading-none block">
          Get dropped off
        </span>
      </button>

      <button
        onClick={() => onChange("round-trip")}
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-0.5 px-2 z-10 transition-colors duration-300",
          value === "round-trip" ? "text-white" : "text-slate-600 hover:text-orange-600"
        )}
      >
        <span className="text-xs lg:text-sm font-black uppercase tracking-tight whitespace-nowrap">Round Trip</span>
        <span className="text-[7px] lg:text-[9px] opacity-80 font-bold uppercase tracking-tighter leading-none block">
          Keep cab till return
        </span>
      </button>
    </div>

  );
};

export default TripToggle;
