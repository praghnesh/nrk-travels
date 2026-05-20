"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Users, 
  ShieldCheck, 
  Settings, 
  Fuel, 
  CheckCircle2, 
  Phone,
  Car,
  ChevronRight,
  Info,
  Sparkles,
  MapPin,
  Clock,
  Zap,
  ArrowRight,
  Star,
  Calendar,
  Navigation,
  MessageCircle,
  CreditCard
} from "lucide-react";
import { FLEET_DATA } from "@/lib/fleet";
import { TOURS_DATA } from "@/lib/tours";
import SectionReveal from "@/components/ui/SectionReveal";
import { cn } from "@/lib/utils";
import BookingFlowModal from "@/components/booking/BookingFlowModal";

const FleetDetailsPage = () => {
  const { slug } = useParams();
  const vehicle = FLEET_DATA[slug as string];
  const [activeTab, setActiveTab] = useState<"overview" | "inclusions" | "features">("overview");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Find tours that include this vehicle
  const availableTours = useMemo(() => {
    return Object.values(TOURS_DATA).filter(tour => 
      tour.vehicleRates.some(rate => rate.model.toLowerCase().includes(vehicle?.model.toLowerCase() || ""))
    );
  }, [vehicle]);

  // Similar vehicles
  const similarVehicles = useMemo(() => {
    return Object.values(FLEET_DATA).filter(v => 
      v.slug !== slug && (v.type === vehicle?.type || v.pax === vehicle?.pax)
    ).slice(0, 3);
  }, [vehicle, slug]);

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Vehicle Not Found</h1>
        <Link href="/" className="text-emerald-600 font-bold hover:underline">Return to Home</Link>
      </div>
    );
  }

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumbs */}
      <div className="pt-28 lg:pt-32 px-6 lg:px-12">
        <div className="max-w-[100%] mx-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/#fleet" className="hover:text-emerald-600">Fleet</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">{vehicle.model}</span>
        </div>
      </div>

      <section className="py-8 lg:py-12 px-6 lg:px-12">
        <div className="max-w-[100%] mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Main Content (Left) */}
            <div className="lg:w-3/4 space-y-10">
              {/* Vehicle Main Card */}
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm p-8 lg:p-12 space-y-10">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                      {vehicle.model}
                    </h1>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Comfort Ride
                      </span>
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                        AC
                      </span>
                      <span className="bg-slate-50 text-slate-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-slate-100">
                        {vehicle.type}
                      </span>
                    </div>
                    <div className="flex gap-6 pt-4 text-slate-400">
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Petrol/Diesel</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{vehicle.pax} Passengers</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="relative aspect-[21/10] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 group">
                  <Image 
                    src={vehicle.images[0]} 
                    alt={vehicle.model} 
                    fill 
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-1000" 
                  />
                </div>
              </div>

              {/* Rate Card Section */}
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-sm space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Rate Card</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transparent pricing for every journey</p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-2 rounded-xl border border-emerald-100 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" /> Best Price Guarantee
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { type: "Local Trip", price: "₹2,400", sub: "8 hrs / 80 km", extra: `Extra @ ₹${vehicle.pricePerKm}/km`, icon: MapPin },
                    { type: "Outstation", price: `₹${vehicle.pricePerKm}/km`, sub: `Min ${vehicle.minKm} km/day`, extra: "Driver allowance: ₹300", icon: Zap },
                    { type: "Airport", price: "₹800", sub: "Transfer Package", extra: "≤10 km - 11-20 km - 21-30 km", icon: Clock }
                  ].map((rate, i) => (
                    <div key={i} className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-12 -mt-12 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <rate.icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{rate.type}</h4>
                      <p className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{rate.price}</p>
                      <p className="text-[11px] font-bold text-slate-500 italic mb-4 opacity-80">{rate.sub}</p>
                      <div className="pt-4 border-t border-slate-200/50">
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{rate.extra}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs Section */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-100 px-8">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "inclusions", label: "Inclusions & Exclusions" },
                    { id: "features", label: "Features" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                        activeTab === tab.id ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div layoutId="vehicle-tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-10 lg:p-12">
                  <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <p className="text-lg text-slate-600 font-bold leading-relaxed italic">
                          {vehicle.description}
                        </p>
                      </motion.div>
                    )}
                    {activeTab === "inclusions" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="grid md:grid-cols-2 gap-10"
                      >
                        <div className="space-y-6">
                          <h4 className="text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Inclusions
                          </h4>
                          <ul className="space-y-3">
                            {["Professional Driver", "Fuel Charges", "A/C Usage", "Clean Interiors", "Phone Support"].map(item => (
                              <li key={item} className="text-xs font-bold text-slate-600 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-6">
                          <h4 className="text-rose-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <Info className="w-4 h-4" /> Exclusions
                          </h4>
                          <ul className="space-y-3">
                            {["Toll Charges", "Parking Fees", "Driver Allowance (if applicable)", "GST (5%)", "Entry Fees"].map(item => (
                              <li key={item} className="text-xs font-bold text-slate-600 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                    {activeTab === "features" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="grid md:grid-cols-3 gap-6"
                      >
                        {vehicle.features.map(feature => (
                          <div key={feature} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{feature}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Available Tours Section */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Available Tours for {vehicle.model}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Perfect destinations for your {vehicle.model}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {availableTours.map(tour => (
                    <div key={tour.slug} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-500 group flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image 
                          src={tour.images[0]} 
                          alt={tour.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase text-emerald-600 shadow-xl border border-white/20">
                          {tour.duration}
                        </div>
                      </div>
                      
                      <div className="p-8 flex flex-col flex-1 space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase group-hover:text-emerald-600 transition-colors line-clamp-1">{tour.title}</h4>
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest"><MapPin className="w-3 h-3 text-emerald-500" /> 460 KM</span>
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Clock className="w-3 h-3 text-emerald-500" /> 3D / 2N</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 font-bold leading-relaxed line-clamp-2 italic opacity-80">
                          {tour.description}
                        </p>

                        <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-900 italic leading-none">₹{tour.vehicleRates.find(r => r.model.toLowerCase().includes(vehicle.model.toLowerCase()))?.price || tour.basePrice}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Package</p>
                          </div>
                          <Link 
                            href={`/tours/${tour.slug}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex items-center gap-2"
                          >
                            VIEW DETAILS <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (Right) */}
            <div className="lg:w-1/4">
              <div className="sticky top-32 space-y-8">
                
                {/* Rates List Sidebar */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 text-slate-900">
                    <Car className="w-5 h-5" />
                    <h3 className="text-sm font-black uppercase tracking-widest">{vehicle.model} Rates</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trip Type</p>
                    <div className="space-y-2">
                      {[
                        { label: "Outstation", price: `₹${vehicle.pricePerKm}/km`, sub: `Min ${vehicle.minKm} km`, active: true },
                        { label: "Airport Transfer", price: "₹800", sub: "≤10 km - 11-20 km - 21-30 km - &gt;30 km" },
                        { label: "3 Days Vizag & Araku", price: "₹12000", sub: "460 km" },
                        { label: "Araku Valley Tour", price: "₹5000", sub: "260 km" },
                        { label: "Arasavalli & Srikurmam", price: "₹4500", sub: "250 km" }
                      ].map((rate, i) => (
                        <div key={i} className={cn(
                          "p-4 rounded-2xl border transition-all cursor-pointer group",
                          rate.active ? "bg-emerald-50 border-emerald-500 shadow-md" : "bg-white border-slate-100 hover:border-emerald-500/30"
                        )}>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{rate.label}</span>
                            <span className="text-[11px] font-black text-slate-900">{rate.price}</span>
                          </div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest group-hover:text-emerald-600 transition-colors">{rate.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Fare</p>
                        <p className="text-xl font-black text-slate-900">₹{vehicle.pricePerKm}/km</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Distance</p>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Min {vehicle.minKm} km</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleBookNow}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-black text-xs transition-all shadow-xl shadow-emerald-600/10 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                      <Navigation className="w-4 h-4" /> Book {vehicle.model}
                    </button>
                  </div>
                </div>

                {/* Similar Vehicles Sidebar */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Similar Vehicles</h3>
                  <div className="space-y-6">
                    {similarVehicles.map(v => (
                      <div key={v.slug} className="group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2 relative overflow-hidden flex-shrink-0">
                            <Image src={v.images[0]} alt={v.model} fill className="object-contain p-1 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="text-[11px] font-black text-slate-900 uppercase group-hover:text-emerald-600 transition-colors">{v.model}</h4>
                              <span className="text-[10px] font-black text-emerald-600 italic leading-none">₹{v.pricePerKm}/km</span>
                            </div>
                            <Link 
                              href={`/fleet/${v.slug}`}
                              className="inline-block text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
                  <div className="space-y-2 relative">
                    <h4 className="text-lg font-black tracking-tight uppercase leading-none">Need Help?</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Our experts are here 24/7</p>
                  </div>
                  <div className="space-y-3 relative">
                    <a href="tel:+919111989222" className="flex items-center gap-3 text-sm font-black hover:text-emerald-400 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      +91 9111989222
                    </a>
                  </div>
                  <a 
                    href="https://wa.me/919111989222" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingFlowModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        vehicle={{
          model: vehicle.model,
          pricePerKm: Number(vehicle.pricePerKm),
          type: vehicle.type,
          image: vehicle.images[0]
        }}
      />
    </main>
  );
};

export default FleetDetailsPage;
