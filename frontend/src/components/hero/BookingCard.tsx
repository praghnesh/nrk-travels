/**
 * =========================================
 * BookingCard Component
 * Central floating card in the Hero section
 * =========================================
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Map } from "lucide-react";
import { useRouter } from "next/navigation";
import BookingTabs from "./BookingTabs";
import BookingForm from "./BookingForm";
import { ROUTES, TOUR_LINKS } from "@/lib/navigation";
import Link from "next/link";

// Tour icons mapping
const tourIcons: Record<string, string> = {
  "3 Days Vizag & Araku": "🏞️",
  "Araku Valley Tour": "🏔️",
  "Temple Tour": "🛕",
  "Lambasingi Tour": "🌿",
  "Vizag Full City Tour": "🏙️",
};

// Dropdown component for mobile Tour search
const TourSearchDropdown = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all"
      >
        <Map className="w-4 h-4" />
        SEARCH TOURS
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select a Tour Package</p>
            </div>
            {TOUR_LINKS.map((tour) => (
              <button
                key={tour.href}
                onClick={() => handleSelect(tour.href)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-emerald-50 active:bg-emerald-100 transition-colors border-b border-slate-50 last:border-b-0 text-left"
              >
                <span className="text-lg">{tourIcons[tour.title] ?? "🗺️"}</span>
                <span className="flex-1 text-sm font-black text-slate-900">{tour.title}</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BookingCard = () => {
  const [activeTab, setActiveTab] = useState("outstation");

  return (
    <div className="w-full max-w-[100%] mx-auto z-20 relative px-4">
      <div className="bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-premium relative overflow-visible border border-emerald-500/10 backdrop-blur-3xl">
        {/* Info Badge - Top on Mobile */}
        <div className="bg-orange-600 p-3 lg:hidden flex items-center justify-between px-6 rounded-t-[2.5rem]">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">New</div>
            <span className="text-xs font-bold text-white tracking-tight">Urbania Luxury now available!</span>
          </div>
          <Link href={ROUTES.FLEET_SECTION} className="bg-white text-orange-600 px-4 py-1 rounded-lg text-[10px] font-black uppercase">Book</Link>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between border-b border-emerald-500/10 lg:pr-10">
          <BookingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Info Badge - Integrated on Desktop */}
          <div className="hidden lg:flex items-center gap-4 px-6 py-2.5 bg-emerald-50 border border-emerald-500/10 rounded-2xl my-3 group">
            <div className="bg-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest">New</div>
            <span className="text-sm font-bold text-slate-900">Urbania Luxury now available!</span>
            <Link
              href={ROUTES.FLEET_SECTION}
              className="text-orange-600 hover:text-orange-500 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-all group-hover:gap-3"
            >
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile-only Search Tour Button with Dropdown */}
        <div className="lg:hidden px-4 pt-4 pb-2">
          <TourSearchDropdown />
        </div>

        <div className="p-2">
          <BookingForm activeTab={activeTab} />
        </div>
      </div>
    </div>

  );
};

export default BookingCard;
