"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Target, Eye, Globe, Zap, Heart, Shield,
  Award, Sparkles, CheckCircle2, TrendingUp,
  ShieldCheck, Users, Rocket
} from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import { cn } from "@/lib/utils";

const VisionPage = () => {
  return (
    <main className="min-h-screen bg-white transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <SectionReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Corporate Identity
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
              Vision & <span className="text-emerald-600 italic">Mission</span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-700 font-bold leading-relaxed italic opacity-90">
              "Our commitment to excellence and customer satisfaction drives everything we do."
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Vision & Mission Split */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            <SectionReveal>
              <div className="p-12 md:p-20 rounded-[4rem] bg-emerald-600 text-white relative overflow-hidden h-full shadow-2xl shadow-emerald-600/20 group hover:scale-[1.01] transition-transform duration-500">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
                <Eye className="w-16 h-16 mb-8 text-emerald-200 group-hover:scale-110 transition-transform duration-500" />
                <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Our Vision</h2>
                <div className="space-y-6 text-lg md:text-xl font-bold leading-relaxed text-emerald-50">
                  <p>
                    To become the most trusted and preferred transportation service provider in Visakhapatnam,
                    setting new standards for reliability, safety, and customer satisfaction.
                  </p>
                  <p className="opacity-80">
                    We envision a future where every journey is seamless, every customer feels valued,
                    and every ride contributes to building stronger, more connected communities.
                    Our goal is to be the bridge that connects people to their destinations, dreams, and opportunities.
                  </p>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="p-12 md:p-20 rounded-[4rem] bg-slate-900 text-white relative overflow-hidden h-full shadow-2xl shadow-black/20 group hover:scale-[1.01] transition-transform duration-500">
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />
                <Target className="w-16 h-16 mb-8 text-orange-500 group-hover:scale-110 transition-transform duration-500" />
                <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Our Mission</h2>
                <div className="space-y-6 text-lg md:text-xl font-bold leading-relaxed text-slate-200">
                  <p>
                    To provide safe, reliable, and comfortable transportation services while maintaining
                    the highest standards of professionalism and customer care.
                  </p>
                  <p className="opacity-80">
                    We are committed to leveraging technology and innovation to make transportation accessible,
                    affordable, and enjoyable for everyone. Through our dedicated team and modern fleet,
                    we strive to exceed expectations and create lasting relationships with our customers.
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Strategic Goals */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Strategic <span className="text-emerald-600 underline decoration-orange-500/30">Goals</span></h2>
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Mapping our future success</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Innovation", desc: "Continuously adopt new technologies to enhance customer experience.", icon: Rocket },
                { title: "Safety First", desc: "Maintain the highest safety standards in all our operations.", icon: ShieldCheck },
                { title: "Excellence", desc: "Deliver exceptional service that exceeds customer expectations.", icon: Award },
                { title: "Expansion", desc: "Grow our services to reach more cities and communities.", icon: TrendingUp },
              ].map((goal, i) => (
                <div key={goal.title} className="p-10 rounded-[3rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 group">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                    <goal.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">{goal.title}</h3>
                  <p className="text-slate-600 font-bold leading-relaxed">{goal.desc}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <SectionReveal>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">Our Core <span className="text-orange-500">Principles</span></h2>
                <p className="text-xl text-slate-700 font-bold mb-12 leading-relaxed opacity-90">
                  The fundamental beliefs that guide our decisions and shape our culture.
                </p>

                <div className="space-y-6">
                  {[
                    "Customer satisfaction is our top priority",
                    "Safety and reliability in every journey",
                    "Transparent and fair pricing",
                    "Professional and courteous service",
                    "Environmental responsibility",
                    "Continuous improvement and innovation"
                  ].map((principle, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-lg font-black text-slate-800">{principle}</span>
                    </div>
                  ))}
                </div>
              </SectionReveal>
            </div>

            <div className="lg:w-1/2 relative">
              <SectionReveal delay={0.3}>
                <div className="p-12 md:p-20 rounded-[5rem] bg-emerald-600 text-white relative z-10 shadow-3xl">
                  <Users className="w-20 h-20 mb-8 opacity-40" />
                  <h3 className="text-3xl md:text-4xl font-black mb-8 leading-tight">Our Commitment</h3>
                  <p className="text-xl font-bold leading-relaxed text-emerald-50 opacity-90 mb-8">
                    We are committed to being more than just a transportation service. We are your partners in every journey,
                    ensuring that each trip is not just about reaching your destination, but about the experience along the way.
                  </p>
                  <p className="text-lg font-black text-orange-400 uppercase tracking-widest">
                    Your partners in every journey
                  </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full" />
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Looking Forward */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <div className="p-12 md:p-24 rounded-[4rem] bg-slate-950 text-white text-center relative overflow-hidden shadow-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-orange-600/20" />
              <div className="relative z-10 max-w-4xl mx-auto">
                <Globe className="w-16 h-16 mx-auto mb-10 text-emerald-400 opacity-60" />
                <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight">Looking <span className="text-emerald-500">Forward</span></h2>
                <p className="text-xl md:text-2xl font-bold text-slate-200 leading-relaxed mb-12">
                  Our promise is to continuously evolve, adapt, and improve, always keeping our customers' needs
                  at the heart of everything we do. Together, we're not just moving people; we're moving communities forward.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.3em]">
                  Integrity • Innovation • Excellence
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      </main>
  );
};

export default VisionPage;
