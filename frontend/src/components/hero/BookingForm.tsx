/**
 * =========================================
 * BookingForm Component
 * Search inputs for locations and dates
 * =========================================
 */

"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Search, ArrowRight, ChevronDown, Compass, Mountain, Palmtree, Landmark, Navigation2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TOUR_LINKS, OUTSTATION_LINKS } from "@/lib/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TripToggle from "./TripToggle";
import DateTimePicker from "./DateTimePicker";
import WhatsAppModal from "./WhatsAppModal";
import LocationInput from "./LocationInput";
import { format } from "date-fns";


const BookingForm = ({ activeTab = "outstation" }: { activeTab?: string }) => {
  const router = useRouter();
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [airportTrip, setAirportTrip] = useState<"from-airport" | "to-airport">("from-airport");

  // Input States
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [localPackage, setLocalPackage] = useState("8 Hours / 80 KM");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date(new Date().getTime() + 86400000));

  // Date Picker States
  const [showDepPicker, setShowDepPicker] = useState(false);
  const [showRetPicker, setShowRetPicker] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const toggleDepPicker = () => {
    setShowDepPicker(!showDepPicker);
    setShowRetPicker(false);
  };

  const toggleRetPicker = () => {
    setShowRetPicker(!showRetPicker);
    setShowDepPicker(false);
  };

  // Validation
  const isFormValid = () => {
    if (activeTab === "local") {
      return pickup.trim() !== "";
    }
    if (activeTab === "airport") {
      return pickup.trim() !== "" || drop.trim() !== ""; // One is usually pre-filled
    }
    if (activeTab === "tour") {
      return pickup.trim() !== "";
    }
    return pickup.trim() !== "" && drop.trim() !== "";
  };

  const handleSearch = () => {
    if (isFormValid()) {
      setIsSearching(true);

      // Determine navigation path
      let path = "/booking/vizag-full-city-tour"; // Default

      if (activeTab === "outstation") {
        const slug = drop.toLowerCase().trim().replace(/\s+/g, "-");
        path = `/booking/${slug}`;
      } else if (activeTab === "airport") {
        path = "/booking/vizag-airport-transfer";
      } else if (activeTab === "local") {
        path = "/booking/local-city-taxi";
      }

      setTimeout(() => {
        setIsSearching(false);
        router.push(path);
      }, 1500);
    }
  };

  const handleTourClick = (href: string) => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      router.push(href);
    }, 1000);
  };

  // Collect Booking Data
  const getBookingData = () => {
    return {
      category: activeTab,
      tripType: activeTab === "local" ? "Local" : (activeTab === "airport" ? airportTrip : tripType),
      pickup: activeTab === "airport" && airportTrip === "from-airport" ? "Visakhapatnam International Airport" : pickup,
      drop: activeTab === "airport" && airportTrip === "to-airport" ? "Visakhapatnam International Airport" : drop,
      package: activeTab === "local" ? localPackage : undefined,
      departureDate: format(departureDate, "MMM dd, yyyy hh:mm a"),
      returnDate: (activeTab === "outstation" || activeTab === "tour") && tripType === "round-trip" ? format(returnDate, "MMM dd, yyyy hh:mm a") : undefined,
    };
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 relative overflow-hidden bg-transparent">
      {/* Premium Search Overlay */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-emerald-500/10 border-t-orange-500 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="flex flex-col items-center text-center px-6">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs font-black uppercase tracking-[0.4em] text-orange-600"
              >
                Analyzing Routes
              </motion.span>
              <span className="text-sm font-bold text-slate-600 mt-2">Curating the best rates for your journey...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conditional Rendering based on Active Tab */}
      {activeTab === "local" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <LocationInput
            label="Pickup location"
            value={pickup}
            onChange={setPickup}
            placeholder="Enter area, city or pincode"
          />
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1">Package</label>
            <div className="relative group">
              <select
                value={localPackage}
                onChange={(e) => setLocalPackage(e.target.value)}
                className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold appearance-none cursor-pointer group-hover:border-emerald-500/20"
              >
                <option className="bg-white text-slate-900 font-bold">8 Hours / 80 KM</option>
                <option className="bg-white text-slate-900 font-bold">10 Hours / 100 KM</option>
                <option className="bg-white text-slate-900 font-bold">12 Hours / 120 KM</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </div>
          <div className="space-y-3 relative">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1">Departure</label>
            <div onClick={toggleDepPicker} className="relative group cursor-pointer">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-orange-500 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div suppressHydrationWarning className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 flex items-center text-slate-900 font-black group-hover:border-emerald-500/20">
                {format(departureDate, "MMM dd, hh:mm a")}
              </div>
            </div>
          </div>
          <div>
            <Button
              onClick={handleSearch}
              disabled={!isFormValid()}
              className={cn(
                "w-full h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 border-none shadow-xl",
                isFormValid()
                  ? "bg-gradient-orange hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-95 text-white"
                  : "bg-slate-100 text-slate-500 cursor-not-allowed"
              )}
            >
              {isSearching ? "Searching..." : "Search"} <Search className={cn("w-5 h-5", isSearching && "animate-spin")} />
            </Button>
          </div>
        </div>
      ) : activeTab === "airport" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <LocationInput
            label="Pickup location"
            value={airportTrip === "from-airport" ? "Visakhapatnam International Airport" : pickup}
            onChange={setPickup}
            disabled={airportTrip === "from-airport"}
            placeholder="Enter area, city or pincode"
          />
          <LocationInput
            label="Drop location"
            value={airportTrip === "to-airport" ? "Visakhapatnam International Airport" : drop}
            onChange={setDrop}
            disabled={airportTrip === "to-airport"}
            placeholder="Enter area, city or pincode"
          />
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1">Trip Direction</label>
            <div className="flex bg-slate-50 border border-slate-200 p-1.5 rounded-2xl w-full relative h-16">
              <div className={cn("absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-orange-600 rounded-xl shadow-lg z-0 transition-all duration-300", airportTrip === "to-airport" ? "translate-x-full" : "translate-x-0")} />
              <button onClick={() => setAirportTrip("from-airport")} className={cn("flex-1 px-2 text-[10px] font-black uppercase tracking-widest z-10 transition-colors duration-300", airportTrip === "from-airport" ? "text-white" : "text-slate-600")}>From Airport</button>
              <button onClick={() => setAirportTrip("to-airport")} className={cn("flex-1 px-2 text-[10px] font-black uppercase tracking-widest z-10 transition-colors duration-300", airportTrip === "to-airport" ? "text-white" : "text-slate-600")}>To Airport</button>
            </div>
          </div>
          <div className="space-y-3 relative">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1">Departure</label>
            <div onClick={toggleDepPicker} className="relative group cursor-pointer">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-orange-500 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div suppressHydrationWarning className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 flex items-center text-slate-900 font-black group-hover:border-emerald-500/20">
                {format(departureDate, "MMM dd, hh:mm a")}
              </div>
            </div>
          </div>
          <div>
            <Button
              onClick={handleSearch}
              disabled={!isFormValid()}
              className={cn(
                "w-full h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 border-none shadow-xl",
                isFormValid()
                  ? "bg-gradient-orange hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-95 text-white"
                  : "bg-slate-100 text-slate-500 cursor-not-allowed"
              )}
            >
              {isSearching ? "Searching..." : "Search"} <Search className={cn("w-5 h-5", isSearching && "animate-spin")} />
            </Button>
          </div>
        </div>
      ) : activeTab === "tour" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Popular Tour Packages</h3>
            <button onClick={() => router.push('/#tours')} className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-700 transition-colors">View All &rarr;</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleTourClick('/booking/araku-valley-tour')}
              className="group flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-600 group-hover:text-emerald-600 shadow-sm transition-colors">
                <Mountain className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-900 uppercase">Araku Valley Tour</p>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Hill Station Experience</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-500 transition-colors" />
            </button>

            <button
              onClick={() => handleTourClick('/booking/lambasingi-tour')}
              className="group flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-600 group-hover:text-orange-500 shadow-sm transition-colors">
                <Palmtree className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-900 uppercase">Lambasingi Tour</p>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Kashmir of Andhra</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-orange-500 transition-colors" />
            </button>

            <button
              onClick={() => handleTourClick('/booking/vizag-full-city-tour')}
              className="group flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-600 group-hover:text-blue-600 shadow-sm transition-colors">
                <Landmark className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-900 uppercase">Vizag Full City Tour</p>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Beaches & Museums</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
            </button>

            <button
              onClick={() => router.push('/#outstation')}
              className="group flex items-center gap-6 p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 hover:bg-emerald-600 hover:border-emerald-600 transition-all text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm transition-colors">
                <Navigation2 className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-emerald-950 group-hover:text-white uppercase">Outstation Tours</p>
                <p className="text-[9px] font-black text-emerald-600/60 group-hover:text-white/60 uppercase tracking-widest mt-1">Long Distance Trips</p>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={() => router.push('/#tours')}
              className="group flex items-center gap-6 p-6 rounded-[2rem] bg-emerald-600 shadow-xl shadow-emerald-600/20 border border-emerald-600 hover:bg-emerald-700 transition-all text-left md:col-span-2 lg:col-span-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-sm transition-colors">
                <Compass className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-white uppercase">View All Tours</p>
                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mt-1">Explore 50+ Packages</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
          <LocationInput
            label="Pickup location"
            value={pickup}
            onChange={setPickup}
            placeholder="Enter area, city or pincode"
          />
          <LocationInput
            label="Drop location"
            value={drop}
            onChange={setDrop}
            placeholder="Enter area, city or pincode"
          />
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1">Trip Type</label>
            <TripToggle value={tripType} onChange={setTripType} />
          </div>
          <div className="space-y-3 relative">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1">Departure</label>
            <div onClick={toggleDepPicker} className="relative group cursor-pointer">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-orange-500 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div suppressHydrationWarning className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 flex items-center text-slate-900 font-black group-hover:border-emerald-500/20">
                {format(departureDate, "MMM dd, hh:mm a")}
              </div>
            </div>
          </div>
          <div className={cn("space-y-3 relative transition-all duration-300", tripType === "round-trip" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none")}>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1">Return</label>
            <div onClick={toggleRetPicker} className="relative group cursor-pointer">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-orange-500 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div suppressHydrationWarning className="w-full h-16 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 flex items-center text-slate-900 font-black group-hover:border-emerald-500/20">
                {format(returnDate, "MMM dd, hh:mm a")}
              </div>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <Button
              onClick={handleSearch}
              disabled={!isFormValid()}
              className={cn(
                "w-full h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 border-none shadow-xl",
                isFormValid()
                  ? "bg-gradient-orange hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-95 text-white"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              )}
            >
              Search <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Pickers - Rendered at bottom of container for stacking context */}
      {showDepPicker && (
        <DateTimePicker
          initialDate={departureDate}
          onApply={(date) => { setDepartureDate(date); setShowDepPicker(false); }}
          onClose={() => setShowDepPicker(false)}
        />
      )}
      {showRetPicker && (
        <DateTimePicker
          initialDate={returnDate}
          onApply={(date) => { setReturnDate(date); setShowRetPicker(false); }}
          onClose={() => setShowRetPicker(false)}
        />
      )}
      {showWhatsAppModal && (
        <WhatsAppModal
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          bookingData={getBookingData()}
          onConfirm={(phone) => {
            console.log("Searching for phone:", phone);
            setShowWhatsAppModal(false);
          }}
        />
      )}
    </div>
  );
};

export default BookingForm;
