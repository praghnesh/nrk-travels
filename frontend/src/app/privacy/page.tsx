"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Lock, Database, UserCheck, Share2, Cookie, Mail, Sparkles, MapPin } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

const highlights = [
  { title: "Data Security", desc: "Encryption at rest and in transit for all personal data.", icon: Lock, color: "text-emerald-500" },
  { title: "No Data Sales", desc: "We never sell your personal information to third parties.", icon: ShieldCheck, color: "text-orange-500" },
  { title: "Transparency", desc: "Clear information on how and why we collect your data.", icon: Eye, color: "text-emerald-600" }
];

const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-[#010a08] transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50 dark:bg-emerald-950/10 -z-10" />
        <div className="absolute top-0 right-0 w-[50%] h-full bg-emerald-500/5 blur-[120px] rounded-full translate-x-1/4 -z-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionReveal>
            <Breadcrumbs items={[{ label: "Support", href: "/support" }, { label: "Privacy Policy" }]} />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                  <Lock className="w-3.5 h-3.5" />
                  Your Privacy Matters
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
                  Privacy <span className="text-emerald-600">Policy</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-emerald-100/60 font-medium leading-relaxed">
                  We are committed to protecting your personal data and ensuring your experience with Vizag Taxi is secure and transparent.
                </p>
              </div>

              <div className="w-full lg:w-96 p-10 rounded-[3rem] bg-emerald-600 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
                <Database className="w-12 h-12 mb-6 opacity-50" />
                <h3 className="text-2xl font-black mb-4">Secure Storage</h3>
                <p className="text-emerald-100/80 text-sm font-medium leading-relaxed">
                  Your data is stored in ISO 27001 certified data centers with multi-layer physical and digital security.
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-24 bg-slate-50 dark:bg-emerald-950/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((h, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <div className="p-10 rounded-[2.5rem] bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-500/10 flex flex-col items-center text-center group hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-emerald-950 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <h.icon className={cn("w-8 h-8", h.color)} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{h.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-emerald-100/60 font-medium leading-relaxed">{h.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionReveal>
            <div className="space-y-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                  <Sparkles className="w-6 h-6 text-orange-500" />
                  1. Information We Collect
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Personal Info", val: "Name, email, phone number, and address provided during booking.", icon: UserCheck },
                    { label: "Location Data", val: "Pickup and destination points for route optimization and safety.", icon: MapPin },
                    { label: "Payment Info", val: "Encrypted transaction details (we don't store raw card numbers).", icon: Database },
                    { label: "Device Info", val: "IP address, browser type, and app usage patterns.", icon: Cookie }
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-100 dark:border-emerald-500/10">
                      <div className="flex items-center gap-3 mb-3">
                        <item.icon className="w-5 h-5 text-emerald-600" />
                        <span className="font-black text-slate-900 dark:text-white text-sm">{item.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-emerald-100/60 font-medium leading-relaxed">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                  <Share2 className="w-6 h-6 text-emerald-600" />
                  2. How We Use Your Information
                </h2>
                <p className="text-lg text-slate-600 dark:text-emerald-100/60 font-medium leading-relaxed">
                  Your information is primarily used to fulfill your transportation requests and improve our services.
                </p>
                <ul className="space-y-4">
                  {[
                    "To facilitate taxi bookings and chauffeur assignments.",
                    "To send ride-related notifications and receipts via SMS/WhatsApp/Email.",
                    "To process payments securely and prevent fraudulent transactions.",
                    "To provide 24/7 customer support and emergency response.",
                    "To personalize your experience with location-based tour recommendations."
                  ].map((li, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-emerald-50 font-bold">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-12 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
                <h3 className="text-2xl font-black mb-6">Contact Privacy Team</h3>
                <p className="text-slate-400 font-medium mb-8">Have questions about your data or want to request account deletion?</p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-600 transition-all">
                      <Mail className="w-6 h-6 text-emerald-400 group-hover:text-white" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Email Us</span>
                      <span className="font-bold">info@nrtravels.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      </main>
  );
};

export default PrivacyPolicy;
