"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, MessageSquare, Car, Shield, Navigation, Calendar, Star } from "lucide-react";
import { ROUTES } from "@/lib/navigation";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-10 lg:py-24 bg-white dark:bg-[#010a08] mb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[3rem] lg:rounded-[4rem] p-10 lg:p-24 text-center relative overflow-hidden shadow-sm border border-emerald-500/10"
        >
          {/* Abstract background shapes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full translate-y-1/2 translate-x-1/2 blur-[100px]" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            {/* Main Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 px-5 py-2 rounded-full mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Direct Booking Available</span>
              </div>
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-emerald-950 dark:text-emerald-50">
                READY TO BOOK <br />
                <span className="text-gradient-emerald italic">YOUR RIDE?</span>
              </h2>
              <p className="text-emerald-900/60 dark:text-emerald-100/60 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Experience hassle-free, premium travel with Vizag Taxi Hub. Professional service guaranteed for every journey.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { label: "Verified Drivers", icon: Shield },
                { label: "Clean Vehicles", icon: Car },
                { label: "GPS Tracking", icon: Navigation },
                { label: "24/7 Service", icon: Calendar }
              ].map((pill, idx) => (
                <div key={idx} className="bg-white dark:bg-emerald-900/40 backdrop-blur-xl border border-emerald-500/10 rounded-2xl px-6 py-3 flex items-center gap-3 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-900/60">
                  <pill.icon className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/70 dark:text-emerald-100/70">{pill.label}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
              <Link
                href={ROUTES.FLEET_SECTION}
                className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 group border-none"
              >
                <Car className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Book Now
              </Link>

              <a href="https://wa.me/919111989222" className="bg-[#25D366] text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl hover:brightness-110 transition-all hover:scale-105 active:scale-95">
                <MessageSquare className="w-6 h-6" />
                WhatsApp
              </a>

              <a href="tel:+919111989222" className="bg-white dark:bg-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/60 border border-emerald-500/10 px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 backdrop-blur-sm transition-all text-emerald-950 dark:text-emerald-50">
                <Phone className="w-6 h-6 text-emerald-600" />
                Call Expert
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-3 pt-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 text-emerald-600 fill-current" />
                ))}
              </div>
              <span className="text-xs font-black text-emerald-900/40 dark:text-emerald-100/40 uppercase tracking-[0.2em]">
                Rated 4.9/5 by 2,000+ happy clients
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
