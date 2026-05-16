"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Search,
  Info,
  Phone,
  MessageCircle,
  Zap,
  Briefcase,
  Camera,
  Star,
  Check,
  ChevronDown,
  Edit2,
  Settings,
  Fuel,
  Map
} from "lucide-react";
import { FLEET_DATA } from "@/lib/fleet";
import { DESTINATIONS } from "@/lib/destinations";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import SeatSelection from "@/components/booking/SeatSelection";
import { cn } from "@/lib/utils";

const BookingPage = () => {
  const params = useParams();
  const router = useRouter();
  const toSlug = params.to as string;

  const destination = useMemo(() => {
    if (DESTINATIONS[toSlug]) return DESTINATIONS[toSlug];

    // Fallback for custom/unknown cities
    const name = toSlug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return {
      name: name,
      distanceKm: 250, // Generic distance for unknown routes
      duration: "5 hours",
      type: "outstation" as const,
      description: `Premium travel service to ${name}. Experience a safe and comfortable journey with NRK Travels.`,
      highlights: ["Experienced Drivers", "Well Maintained Fleet", "24/7 Support", "Transparent Pricing"],
      itinerary: [
        { day: "1", title: "Departure", activities: [`Pickup from Visakhapatnam`, `Travel to ${name}`, `Safe Drop-off at destination`] }
      ],
      images: ["https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800"]
    };
  }, [toSlug]);

  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingStep, setBookingStep] = useState<"selection" | "seats" | "forms" | "payment">("selection");
  const [selectedSeats, setSelectedSeats] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "policy">("overview");
  const [paymentOption, setPaymentOption] = useState<"part" | "full">("part");
  const [hasGST, setHasGST] = useState(false);
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");

  useEffect(() => {
    // Initialize dates on client-side only to avoid hydration mismatch
    const now = new Date();
    const future = new Date(now.getTime() + 48 * 60 * 60 * 1000); // +2 days
    setPickupDate(now.toISOString().slice(0, 16));
    setReturnDate(future.toISOString().slice(0, 16));
  }, []);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [destSearch, setDestSearch] = useState("");
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // If destination not found, fallback
  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black">Destination Not Found</h1>
          <Link href="/" className="text-emerald-600 font-bold underline">Go Back</Link>
        </div>
      </div>
    );
  }

  const calculateFare = (pricePerKm: number, capacity: number, isTempo: boolean) => {
    const distance = destination.distanceKm;
    // For Outstation: One-way is base, Round-trip is roughly 1.8x (standard practice)
    const multiplier = tripType === "round-trip" ? 1.8 : 1;
    const totalKm = distance * multiplier;
    const baseFare = totalKm * pricePerKm;
    const driverAllowance = tripType === "round-trip" ? 500 : 300;
    const total = Math.ceil((baseFare + driverAllowance) / 50) * 50; // Round to nearest 50

    if (isTempo) {
      return {
        total: total.toLocaleString(),
        perPerson: Math.ceil(total / capacity).toLocaleString()
      };
    }
    return { total: total.toLocaleString() };
  };

  const totalAmount = useMemo(() => {
    if (!selectedVehicle) return 0;
    const fares = calculateFare(Number(selectedVehicle.pricePerKm), Number(selectedVehicle.pax), selectedVehicle.type.toLowerCase().includes("tempo"));
    if (selectedVehicle.type.toLowerCase().includes("tempo") && Object.keys(selectedSeats).length > 0) {
      return parseInt(fares.perPerson?.replace(/,/g, "") || "0") * Object.keys(selectedSeats).length;
    }
    return parseInt(fares.total.replace(/,/g, ""));
  }, [selectedVehicle, selectedSeats, tripType]);

  const partPayAmount = Math.ceil(totalAmount * 0.3);

  const handleBookNow = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    const isTempo = vehicle.slug.includes("tempo") || vehicle.slug.includes("urbania");
    if (isTempo) {
      setBookingStep("seats");
      // Smooth scroll to seats
      setTimeout(() => {
        const seatsElement = document.getElementById("booking-seats");
        if (seatsElement) {
          seatsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      setBookingStep("forms");
      // Smooth scroll to form
      setTimeout(() => {
        const formElement = document.getElementById("booking-form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const initiatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBookingSuccess(true);
    }, 3000);
  };

  // ---------------------------------------------------------
  // RENDER TOUR LAYOUT (Gallery + Tabs)
  // ---------------------------------------------------------
  const renderTripHeader = () => (
    <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-sm flex items-center justify-between gap-6 overflow-hidden mb-10 group/header">
      <div className="flex flex-1 items-center gap-8 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm lg:text-base font-black text-slate-900 uppercase tracking-tight">Visakhapatnam</span>
          <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-sm lg:text-base font-black text-slate-900 uppercase tracking-tight">{destination.name}</span>
        </div>

        <div className="h-10 w-px bg-slate-100 shrink-0" />

        <div className="flex items-center gap-10 shrink-0">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pickup Date</span>
            <span className="text-xs font-black text-slate-900 uppercase mt-0.5">{pickupDate ? new Date(pickupDate).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Select Date'}</span>
          </div>
          {tripType === "round-trip" && (
            <div className="flex flex-col border-l border-slate-100 pl-10">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Return Date</span>
              <span className="text-xs font-black text-slate-900 uppercase mt-0.5">{returnDate ? new Date(returnDate).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Select Date'}</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsEditingDates(!isEditingDates)}
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0",
          isEditingDates ? "bg-emerald-600 text-white rotate-90" : "bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
        )}
      >
        <Edit2 className="w-5 h-5" />
      </button>
    </div>
  );

  const renderEditPanel = () => (
    <AnimatePresence>
      {isEditingDates && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white rounded-[2rem] p-8 border border-emerald-500/20 shadow-xl overflow-hidden mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Change Destination</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Type city name..."
                  value={destSearch}
                  onFocus={() => setShowDestSuggestions(true)}
                  onChange={(e) => {
                    setDestSearch(e.target.value);
                    setShowDestSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && destSearch.trim()) {
                      const slug = destSearch.toLowerCase().trim().replace(/\s+/g, "-");
                      router.push(`/booking/${slug}`);
                      setShowDestSuggestions(false);
                    }
                  }}
                  className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
                />

                <AnimatePresence>
                  {showDestSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[200] max-h-60 overflow-y-auto no-scrollbar"
                    >
                      {destSearch.trim() && !Object.entries(DESTINATIONS).some(([slug, dest]) => dest.name.toLowerCase() === destSearch.toLowerCase()) && (
                        <button
                          onClick={() => {
                            const slug = destSearch.toLowerCase().trim().replace(/\s+/g, "-");
                            router.push(`/booking/${slug}`);
                            setShowDestSuggestions(false);
                          }}
                          className="w-full px-6 py-4 text-left hover:bg-emerald-50 flex items-center justify-between group/custom bg-emerald-50/30"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">Search for "{destSearch}"</span>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Custom Destination</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-emerald-500" />
                        </button>
                      )}

                      {Object.entries(DESTINATIONS)
                        .filter(([slug, dest]) => dest.name.toLowerCase().includes(destSearch.toLowerCase()))
                        .map(([slug, dest]) => (
                          <button
                            key={slug}
                            onClick={() => {
                              router.push(`/booking/${slug}`);
                              setShowDestSuggestions(false);
                              setDestSearch(dest.name);
                            }}
                            className="w-full px-6 py-4 text-left hover:bg-emerald-50 flex items-center justify-between group/item"
                          >
                            <span className="text-sm font-bold text-slate-700 group-hover/item:text-emerald-600">{dest.name}</span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-emerald-500" />
                          </button>
                        ))}
                      {Object.entries(DESTINATIONS).filter(([slug, dest]) => dest.name.toLowerCase().includes(destSearch.toLowerCase())).length === 0 && (
                        <div className="px-6 py-4 text-xs font-bold text-slate-400 italic">No matching cities found...</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Quick Links */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                {["srikakulam", "vizianagaram", "annavaram", "kakinada", "rajahmundry"].map(slug => (
                  <button
                    key={slug}
                    onClick={() => {
                      router.push(`/booking/${slug}`);
                      setIsEditingDates(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest whitespace-nowrap active:scale-95 transition-transform"
                  >
                    {slug.charAt(0).toUpperCase() + slug.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Date & Time</label>
              <input
                type="datetime-local"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            {tripType === "round-trip" && (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Return Date & Time</label>
                <input
                  type="datetime-local"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            )}
          </div>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <button onClick={() => setIsEditingDates(false)} className="w-full md:w-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">Save Changes</button>
            <button onClick={() => setIsEditingDates(false)} className="w-full md:w-auto px-10 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100">Cancel</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ---------------------------------------------------------
  // RENDER TOUR LAYOUT (Gallery + Tabs)
  // ---------------------------------------------------------
  const renderTourLayout = () => (
    <div className="space-y-10">
      {renderTripHeader()}
      {renderEditPanel()}
      <div className="flex flex-col-reverse lg:flex-row gap-12">
        <div className="lg:w-[65%] space-y-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">
                <span className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Premium Tour</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase">Vizag to {destination.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" /> {destination.distanceKm} KM</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500" /> {destination.duration}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500" /> Daily</span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 h-[500px]">
              <div className="col-span-8 relative rounded-[2.5rem] overflow-hidden group">
                <Image src={destination.images[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427"} alt={destination.name} fill className="object-cover group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="col-span-4 flex flex-col gap-4">
                <div className="flex-1 relative rounded-[2.5rem] overflow-hidden bg-slate-100 group">
                  {destination.images[1] && <Image src={destination.images[1]} alt={destination.name} fill className="object-cover group-hover:scale-105 transition-all duration-700" />}
                </div>
                <div className="flex-1 relative rounded-[2.5rem] overflow-hidden bg-slate-100 group">
                  {destination.images[2] ? <Image src={destination.images[2]} alt={destination.name} fill className="object-cover group-hover:scale-105 transition-all duration-700" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black uppercase text-[10px]">Vizag Travels</div>}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white cursor-pointer hover:bg-slate-900/60 transition-all">
                    <Camera className="w-6 h-6 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Gallery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {renderContentTabs()}
          {bookingStep === "forms" && renderPassengerForms()}
        </div>
        <div className="lg:w-[35%]">
          <div className="sticky top-32 space-y-8">
            {!selectedVehicle && renderVehicleListSidebar()}
            {selectedVehicle && renderBookingSummarySidebar()}
          </div>
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // RENDER OUTSTATION LAYOUT (Map + Cards)
  // ---------------------------------------------------------
  const renderOutstationLayout = () => (
    <div className="space-y-10">
      {renderTripHeader()}
      {renderEditPanel()}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-[65%] space-y-10">
          {/* Mobile Only: Trip Mode */}
          <div className="lg:hidden">
            {renderTripModeCard()}
          </div>

          {/* Map Preview */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm p-3">
            <div className="relative h-[300px] md:h-[400px] rounded-[2rem] bg-slate-100 overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-a+285ae5(83.2185,17.6868),pin-s-b+ff5722(83.4,17.8)/auto/1200x600?access_token=pk.eyJ1IjoicHJhZ2huZWFyIiwiYSI6ImNrcWwwamU1czAwaDUyb28waWwwamU1czAifQ.F_F0_v_v_v_v_v_v_v_v_v_v')] bg-cover bg-center" />
              <div className="absolute top-6 left-6 flex bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-2xl border border-white">
                <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20">Map</button>
                <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">Satellite</button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center lg:text-left">
                Rates for {destination.distanceKm} Kms approx distance | {destination.duration} approx time
              </p>
            </div>
          </div>

          {/* Mobile Only: Booking Summary */}
          <div className="lg:hidden">
            {renderBookingSummarySidebar()}
          </div>

          {/* Vertical Vehicle List */}
          <div className="space-y-6">
            {Object.values(FLEET_DATA).slice(0, 5).map((vehicle) => {
              const fares = calculateFare(Number(vehicle.pricePerKm), Number(vehicle.pax), false);
              const isExpanded = expandedVehicle === vehicle.slug;

              return (
                <div key={vehicle.slug} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
                  <div className="p-8 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-48 h-32 relative bg-slate-50 rounded-3xl p-4 flex items-center justify-center">
                      <Image src={vehicle.images[0]} alt={vehicle.model} fill className="object-contain p-4 group-hover:scale-110 transition-all duration-700" />
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{vehicle.model}</h3>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100"><Users className="w-3.5 h-3.5 text-emerald-500" /> {vehicle.pax} Seats</span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100"><Briefcase className="w-3.5 h-3.5 text-emerald-500" /> 3 Bags</span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100"><Fuel className="w-3.5 h-3.5 text-emerald-500" /> Petrol</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                        {["AC", "Music System", "Charging Point"].map(f => (
                          <span key={f} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[8px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">{f}</span>
                        ))}
                      </div>
                      <button onClick={() => setExpandedVehicle(isExpanded ? null : vehicle.slug)} className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] pt-4 hover:underline">
                        View Details <ChevronDown className={cn("w-4 h-4 transition-all", isExpanded && "rotate-180")} />
                      </button>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Fare</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{fares.total}</p>
                      </div>
                      <button
                        onClick={() => handleBookNow(vehicle)}
                        className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="bg-slate-50/50 border-t border-slate-100 p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Features</p>
                            <ul className="space-y-1 text-xs font-bold text-slate-600">
                              <li>✓ Power Windows</li>
                              <li>✓ Central Locking</li>
                              <li>✓ Airbags</li>
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {bookingStep === "seats" && selectedVehicle && (
              <motion.div
                id="booking-seats"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm">
                  <SeatSelection
                    totalSeats={parseInt(selectedVehicle.pax)}
                    pricePerSeat={parseInt(calculateFare(Number(selectedVehicle.pricePerKm), Number(selectedVehicle.pax), true).perPerson?.replace(/,/g, "") || "0")}
                    onBack={() => setBookingStep("selection")}
                    onConfirm={(seats) => {
                      setSelectedSeats(seats);
                      setBookingStep("forms");
                      setTimeout(() => {
                        document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                  />
                </div>
              </motion.div>
            )}

            {bookingStep === "forms" && (
              <motion.div
                id="booking-form"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                {renderPassengerForms()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:w-[35%] hidden lg:block">
          <div className="sticky top-32 space-y-8">
            {renderBookingSummarySidebar()}
            {renderTripModeCard()}
          </div>
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // SHARED SUB-RENDERERS
  // ---------------------------------------------------------

  const renderTripModeCard = () => (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trip Mode</h3>
      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button onClick={() => setTripType("one-way")} className={cn("flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", tripType === "one-way" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}>One Way</button>
        <button onClick={() => setTripType("round-trip")} className={cn("flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", tripType === "round-trip" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}>Round Trip</button>
      </div>
      <p className="text-[9px] font-bold text-slate-400 italic">Round trip includes return journey with same vehicle. Rates may vary based on duration.</p>
    </div>
  );

  const renderContentTabs = () => (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex border-b border-slate-100 px-10">
        {["overview", "itinerary", "policy"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab}
            {activeTab === tab && <motion.div layoutId="tab-bar" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full" />}
          </button>
        ))}
      </div>
      <div className="p-10 lg:p-14">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              <p className="text-xl text-slate-600 font-bold leading-relaxed italic opacity-80">"{destination.description}"</p>
              <div className="grid md:grid-cols-2 gap-8">
                {destination.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100"><Check className="w-3.5 h-3.5" /></div>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {activeTab === "itinerary" && (
            <motion.div key="it" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
              {destination.itinerary.map((item, idx) => (
                <div key={idx} className="flex gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">DAY {item.day}</div>
                    {idx !== destination.itinerary.length - 1 && <div className="w-1 flex-1 bg-slate-100 my-4 rounded-full" />}
                  </div>
                  <div className="space-y-6 flex-1 pb-10">
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                    <ul className="space-y-4">
                      {item.activities.map((act, ai) => (
                        <li key={ai} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 text-sm font-bold text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderPassengerForms = () => (
    <div className="space-y-10">
      {/* Dynamic Passenger Forms per Seat */}
      {Object.keys(selectedSeats).length > 0 && (
        <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-12">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Passenger Information</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Enter details for {Object.keys(selectedSeats).length} Travelers</p>
            </div>
          </div>

          <div className="space-y-10">
            {Object.entries(selectedSeats).map(([seatNum, gender], idx) => (
              <div key={seatNum} className="p-8 rounded-[2rem] bg-[#F8FAFC] border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">Seat {seatNum} — {gender}</span>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input type="text" className="w-full h-14 bg-white border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-900 placeholder:text-slate-500" placeholder="Enter name" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Age</label>
                    <input type="number" className="w-full h-14 bg-white border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-900 placeholder:text-slate-500" placeholder="Age" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gender</label>
                    <select className="w-full h-14 bg-white border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-900 appearance-none">
                      <option>{gender}</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-14">
        <div className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Contact details</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">For booking confirmation</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
              <div className="flex gap-3 lg:gap-4">
                <div className="w-20 lg:w-24 h-14 lg:h-16 bg-[#F8FAFC] border border-slate-100 rounded-2xl flex items-center justify-center text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-slate-600">IN +91</div>
                <input type="tel" className="flex-1 w-full min-w-0 h-14 lg:h-16 bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 lg:px-6 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="Enter 10 digit number" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
              <input type="email" className="w-full h-14 lg:h-16 bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 lg:px-6 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="example@gmail.com" />
            </div>
          </div>
        </div>

        {/* Terms & Conditions Placeholder like in screenshot */}
        <div className="pt-14 border-t border-slate-100 space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Info className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Terms & Conditions</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Please review before proceeding</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Valid ID proof is mandatory for all travelers",
              "Reporting time is 15 minutes before departure",
              "Refunds for cancellations will be processed in 5-7 days",
              "Management is not responsible for loss of belongings"
            ].map((term, i) => (
              <div key={i} className="flex items-center gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{term}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white"><Check className="w-3.5 h-3.5" /></div>
            <p className="text-[11px] font-bold text-emerald-900">I agree to the <span className="underline cursor-pointer">Terms of Service</span>, <span className="underline cursor-pointer">Cancellation Policy</span>, and <span className="underline cursor-pointer">Privacy Policy</span>.</p>
          </div>
        </div>

        <div className="pt-14 border-t border-slate-100 space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CreditCard className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Payment Options</h3>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => setPaymentOption("part")}
              className={cn(
                "w-full p-8 rounded-[2.5rem] border-2 flex items-center justify-between transition-all group relative overflow-hidden",
                paymentOption === "part" ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 hover:border-emerald-500/30"
              )}
            >
              <div className="flex items-center gap-6 z-10">
                <div className={cn("w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all", paymentOption === "part" ? "border-emerald-600 bg-emerald-600" : "border-slate-300")}>
                  {paymentOption === "part" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-900 uppercase">Part Pay</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pay 30% now, rest to the driver</p>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 z-10">₹{partPayAmount.toLocaleString()}</p>
              {paymentOption === "part" && <motion.div layoutId="pay-bg" className="absolute inset-0 bg-emerald-50/50 -z-0" />}
            </button>

            <button
              onClick={() => setPaymentOption("full")}
              className={cn(
                "w-full p-8 rounded-[2.5rem] border-2 flex items-center justify-between transition-all group relative overflow-hidden",
                paymentOption === "full" ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 hover:border-emerald-500/30"
              )}
            >
              <div className="flex items-center gap-6 z-10">
                <div className={cn("w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all", paymentOption === "full" ? "border-emerald-600 bg-emerald-600" : "border-slate-300")}>
                  {paymentOption === "full" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-900 uppercase">Full Pay</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pay total amount now</p>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 z-10">₹{totalAmount.toLocaleString()}</p>
              {paymentOption === "full" && <motion.div layoutId="pay-bg" className="absolute inset-0 bg-emerald-50/50 -z-0" />}
            </button>
          </div>

          <button
            onClick={initiatePayment}
            className="w-full h-24 bg-emerald-600 text-white rounded-[2rem] font-black text-xl uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 active:scale-[0.98]"
          >
            Proceed to Pay ₹{(paymentOption === 'part' ? partPayAmount : totalAmount).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );

  const renderVehicleListSidebar = () => (
    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl space-y-8">
      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Select Vehicle</h3>
      <div className="space-y-4">
        {Object.values(FLEET_DATA).slice(0, 7).map((vehicle) => {
          const fares = calculateFare(Number(vehicle.pricePerKm), Number(vehicle.pax), vehicle.type.toLowerCase().includes("tempo"));
          return (
            <button key={vehicle.slug} onClick={() => handleBookNow(vehicle)} className={cn("w-full p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group", selectedVehicle?.slug === vehicle.slug ? "border-emerald-500 bg-emerald-50/50" : "border-slate-100 hover:border-emerald-500/30")}>
              <div className="flex items-center gap-4"><div className="w-16 h-12 relative bg-slate-50 rounded-xl overflow-hidden"><Image src={vehicle.images[0]} alt={vehicle.model} fill className="object-contain p-2" /></div><div className="text-left"><p className="text-[13px] font-black text-slate-900 uppercase">{vehicle.model}</p><div className="flex items-center gap-2 mt-1"><span className="text-[8px] font-black text-slate-400 uppercase">{vehicle.pax} Seats</span><span className="w-1 h-1 bg-slate-300 rounded-full" /><span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">AC</span></div></div></div>
              <p className="text-sm font-black text-slate-900 tracking-tight">₹{fares.total}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderBookingSummarySidebar = () => (
    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl space-y-10">
      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Booking Summary</h3>
      <div className="space-y-8">
        <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trip Type</p>
            <p className="text-sm font-black text-slate-900 uppercase mt-0.5">{destination.type === "tour" ? "Tour" : `Outstation (${tripType === 'one-way' ? 'One Way' : 'Round Trip'})`}</p>
          </div>
          <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </div>

        <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pickup</p>
            <p className="text-sm font-black text-slate-900 uppercase mt-0.5">Visakhapatnam</p>
          </div>
          <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </div>

        <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Drop-off</p>
            <p className="text-sm font-black text-slate-900 uppercase mt-0.5">{destination.name}</p>
          </div>
          <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </div>

        <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Map className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Distance</p>
            <p className="text-sm font-black text-slate-900 uppercase mt-0.5">{tripType === "round-trip" ? Number(destination.distanceKm) * 2 : destination.distanceKm} KM</p>
          </div>
          <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </div>

        <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pickup Date</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">{new Date(pickupDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </div>

        {tripType === "round-trip" && (
          <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Return Date</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">{new Date(returnDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        )}
        {selectedVehicle && (
          <div className="p-5 rounded-[2rem] border border-emerald-500 bg-emerald-50/30 flex items-center gap-5 relative">
            <div className="w-20 h-14 relative bg-white rounded-2xl p-2 border border-emerald-100 shadow-sm"><Image src={selectedVehicle.images[0]} alt={selectedVehicle.model} fill className="object-contain" /></div>
            <div><p className="text-sm font-black text-slate-900 uppercase">{selectedVehicle.model}</p><div className="flex items-center gap-3 mt-1 text-[8px] font-black text-slate-400 uppercase tracking-widest"><span className="flex items-center gap-1"><Users className="w-3 h-3 text-emerald-500" /> {selectedVehicle.pax} Seats</span><span className="flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-500" /> AC</span></div></div>
            <CheckCircle2 className="w-6 h-6 text-emerald-600 absolute -top-2 -right-2 bg-white rounded-full shadow-lg" />
          </div>
        )}
        {!selectedVehicle && (
          <div className="p-8 rounded-[2rem] bg-slate-50 border border-dashed border-slate-200 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a vehicle to see fare details</p>
          </div>
        )}
      </div>
      <div className="pt-10 border-t border-slate-100 space-y-6">
        <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Fare</span><span className="text-sm font-black text-slate-900">₹{totalAmount.toLocaleString()}</span></div>
        <div className="flex justify-between items-center"><span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Total Price</span><span className="text-3xl font-black text-slate-900 tracking-tight">₹{totalAmount.toLocaleString()}</span></div>
        <button className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-100 hover:bg-emerald-50 transition-all"><MessageCircle className="w-4 h-4" /> Share Summary on WhatsApp</button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <section className="pt-28 lg:pt-36 pb-20 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          {destination.type === "tour" ? renderTourLayout() : renderOutstationLayout()}
        </div>
      </section>
      <Footer />

      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
              <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
              <div className="space-y-2"><h3 className="text-2xl font-black text-white">Connecting...</h3><p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Do not refresh</p></div>
            </motion.div>
          </div>
        )}
        {bookingSuccess && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center space-y-8">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto"><CheckCircle2 className="w-12 h-12" /></div>
              <div className="space-y-3"><h3 className="text-3xl font-black text-slate-900 uppercase">Confirmed!</h3><p className="text-slate-500 font-bold italic">Your journey to {destination.name} is scheduled.</p></div>
              <button onClick={() => setBookingSuccess(false)} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest">Back to Home</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default BookingPage;
