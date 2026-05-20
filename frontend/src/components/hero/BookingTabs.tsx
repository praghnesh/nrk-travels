/**
 * =========================================
 * BookingTabs Component
 * Categorical tabs for the booking search
 * =========================================
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car, Clock, Plane, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "outstation", label: "Outstation", sub: "Trips", icon: Car },
  { id: "local", label: "Hourly", sub: "Rentals", icon: Clock },
  { id: "airport", label: "Airport", sub: "Transfer", icon: Plane },
];

interface BookingTabsProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const BookingTabs: React.FC<BookingTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth border-b lg:border-b-0 border-slate-100">
      <div className="flex w-full min-w-max lg:w-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-3 px-2 lg:px-10 py-3 lg:py-6 transition-all relative border-r border-slate-200 last:border-r-0 lg:border-r-0 group",
              activeTab === tab.id
                ? "text-orange-600 dark:text-orange-500 bg-orange-50/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <tab.icon className={cn("w-5 h-5 transition-all", activeTab === tab.id ? "text-orange-600 dark:text-orange-500 scale-110" : "text-slate-500 group-hover:text-slate-800")} />
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-[10px] lg:text-sm font-black tracking-wide uppercase">{tab.label}</span>
              <span className={cn(
                "text-[8px] lg:text-[10px] font-bold uppercase tracking-widest",
                activeTab === tab.id ? "text-orange-600/80" : "text-slate-500 group-hover:text-slate-700"
              )}>{tab.sub}</span>
            </div>

            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-full shadow-[0_-4px_10px_rgba(249,115,22,0.3)]"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};


export default BookingTabs;
