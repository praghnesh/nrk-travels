"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Users, Luggage, Gauge, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/navigation";
import SectionReveal from "@/components/ui/SectionReveal";
import { cn } from "@/lib/utils";

const fullFleet = [
  {
    model: "Swift Dzire",
    type: "Premium Sedan",
    pricePerKm: "14",
    pax: "4",
    features: ["AC", "Music System", "Comfortable Seating", "Elite Driver"],
    image: "/images/fleet/swift_dzire.png",
    color: "emerald"
  },
  {
    model: "Toyota Glanza",
    type: "Luxury Hatchback",
    pricePerKm: "14",
    pax: "4",
    features: ["Touchscreen", "Climate Control", "Premium Interiors", "Smooth Ride"],
    image: "/images/fleet/glanza.png",
    color: "emerald"
  },
  {
    model: "Honda Amaze",
    type: "Compact Luxury",
    pricePerKm: "14",
    pax: "4",
    features: ["AC", "Ample Boot Space", "Reliable Performance", "Clean Fleet"],
    image: "/images/fleet/honda_amaze.png",
    color: "emerald"
  },
  {
    model: "Ertiga",
    type: "Family SUV / MUV",
    pricePerKm: "18",
    pax: "6",
    features: ["AC", "Flexible Seating", "Great for Families", "GPS Tracking"],
    image: "/images/fleet/ertiga.png",
    color: "orange"
  },
  {
    model: "Innova Crysta",
    type: "Executive Luxury",
    pricePerKm: "20",
    pax: "7",
    features: ["Premium Leather Seats", "Rear AC", "Silent Cabin", "VIP Experience"],
    image: "/images/fleet/innova_crysta.png",
    color: "emerald"
  },
  {
    model: "Tempo Traveller",
    type: "Group Luxury",
    pricePerKm: "35",
    pax: "17",
    features: ["Spacious", "Entertainment System", "Individual AC", "Professional Captain"],
    image: "/images/fleet/tempo_traveller.png",
    color: "emerald"
  },
  {
    model: "Urbania",
    type: "Ultra-Luxury Coach",
    pricePerKm: "40",
    pax: "16",
    features: ["VIP Recliner Seats", "Ambient Lighting", "Advanced Suspension", "On-board Concierge"],
    image: "/images/fleet/urbania.png",
    color: "orange"
  }
];

const FleetPage = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-[#010a08] transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1549194382-346a85f0252c?q=80&w=2070&auto=format&fit=crop"
            alt="Fleet Background"
            className="w-full h-full object-cover brightness-[0.3] scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <SectionReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Star className="w-3.5 h-3.5 fill-current" />
              Diamond Certified Fleet
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              The <span className="text-gradient-emerald italic">Elite</span> Collection
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-emerald-100/60 font-medium leading-relaxed">
              Experience the pinnacle of mobility with our meticulously curated fleet of luxury vehicles,
              maintained to the highest international standards.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Fleet Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {fullFleet.map((car, i) => (
                <motion.div
                  key={car.model}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative flex flex-col bg-white dark:bg-emerald-950/10 border border-slate-100 dark:border-emerald-500/10 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-slate-50 dark:bg-emerald-900/20">
                    <img
                      src={car.image}
                      alt={car.model}
                      className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg",
                        car.color === "emerald" ? "bg-emerald-600 shadow-emerald-600/20" : "bg-orange-600 shadow-orange-600/20"
                      )}>
                        {car.type}
                      </span>
                    </div>
                    <div className="absolute top-6 right-6 flex flex-col items-end">
                      <div className="text-[10px] font-black text-slate-400 dark:text-emerald-100/40 uppercase tracking-widest mb-1">Starts From</div>
                      <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{car.pricePerKm}/km</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{car.model}</h3>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-emerald-100/40 font-bold text-xs">
                          <Users className="w-4 h-4 text-emerald-500" />
                          {car.pax} Seats
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-emerald-100/40 font-bold text-xs">
                          <Luggage className="w-4 h-4 text-emerald-500" />
                          Ample Boot
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      {car.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-emerald-100/60">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/booking/vizag-full-city-tour"
                      className="block w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-center hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10"
                    >
                      Book This Vehicle
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Safety & Quality */}
      <section className="py-24 bg-slate-50 dark:bg-emerald-900/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <SectionReveal>
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Standard of <span className="text-emerald-600 italic">Excellence</span></h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Shield className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Diamond Safety Protocol</h4>
                      <p className="text-slate-500 dark:text-emerald-100/60 font-medium leading-relaxed">Every vehicle undergoes a 45-point inspection and complete sanitization before every trip.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <Gauge className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">GPS Fleet Tracking</h4>
                      <p className="text-slate-500 dark:text-emerald-100/60 font-medium leading-relaxed">All vehicles are equipped with real-time GPS tracking for your safety and peace of mind.</p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal>
              <div className="bg-slate-900 p-12 rounded-[3rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <h3 className="text-3xl font-black mb-6">Need a <span className="text-orange-500">Custom</span> Solution?</h3>
                <p className="text-emerald-100/60 font-medium mb-10 leading-relaxed">Whether it's a high-profile corporate event, a wedding, or a cross-country tour, our logistics experts can curate a custom fleet for your specific needs.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={ROUTES.CONTACT} className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center transition-all">Get Custom Quote</Link>
                  <a href="tel:+919111989222" className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-center border border-white/10 transition-all">Call Concierge</a>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      </main>
  );
};

export default FleetPage;
