"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Users, Clock, MapPin, Award, Star, Heart } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import OurStory from "@/components/about/OurStory";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Years Experience", value: "15+", icon: Clock },
  { label: "Happy Travelers", value: "50k+", icon: Heart },
  { label: "Elite Fleet", value: "100+", icon: Award },
  { label: "Locations", value: "20+", icon: MapPin },
];

const values = [
  {
    title: "Safety First",
    description: "Every journey is protected by our Diamond Safety Protocol and certified drivers.",
    icon: Shield,
    color: "emerald"
  },
  {
    title: "Customer Obsession",
    description: "We provide 24/7 personalized concierge service to meet your every travel need.",
    icon: Users,
    color: "emerald"
  },
  {
    title: "Excellence in Service",
    description: "From meticulously maintained vehicles to elite professional drivers.",
    icon: Star,
    color: "orange"
  }
];

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-[#010a08] transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full scale-150 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionReveal>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Users className="w-3.5 h-3.5" />
                Our Story
              </div>

              <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
                Pioneering <span className="text-emerald-600 italic">Luxury</span> <br />
                <span className="text-orange-500">Mobility</span> in Vizag
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-emerald-100/60 font-medium leading-relaxed">
                Founded with a vision to redefine travel, VIZAG TAXI has been the
                trusted partner for premium transportation and curated tour experiences for over 15 years.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 dark:bg-emerald-900/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-white dark:bg-emerald-950/20 border border-slate-100 dark:border-emerald-500/10 text-center group hover:shadow-2xl hover:shadow-emerald-500/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 dark:text-emerald-100/40 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-40 relative">
        <div className="max-w-[100%] mx-auto px-6 lg:px-8">
          <SectionReveal>
            <div className="flex flex-col lg:flex-row gap-24 items-start">
              <div className="lg:w-1/3 space-y-10">
                <div className="inline-flex items-center gap-4 bg-orange-600/10 border border-orange-600/20 px-6 py-2 rounded-full backdrop-blur-3xl">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">The Directive</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                  OUR CORE <br />
                  <span className="text-orange-600">PROTOCOLS</span>
                </h2>
                <p className="text-xl text-white/40 font-medium leading-relaxed">
                  Every operation within our network is governed by a strict hierarchy of values designed to ensure absolute superiority in service.
                </p>
              </div>

              <div className="lg:w-2/3 grid md:grid-cols-2 gap-10">
                {values.map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="glass-card p-12 rounded-[3.5rem] border border-white/10 space-y-8 group hover:border-orange-500/30 transition-all duration-500"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-2xl">
                      <value.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{value.title}</h3>
                      <p className="text-lg text-white/40 leading-relaxed font-medium">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Our Story Section */}
      <OurStory />

      </main>
  );
};

export default AboutPage;
