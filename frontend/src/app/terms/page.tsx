"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, ChevronRight, FileText, Shield, User, CreditCard, AlertTriangle, HelpCircle, ArrowRight } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

const sections = [
  { id: "intro", title: "Introduction", icon: FileText },
  { id: "user", title: "User Responsibilities", icon: User },
  { id: "booking", title: "Booking Terms", icon: Shield },
  { id: "payment", title: "Payment Terms", icon: CreditCard },
  { id: "driver", title: "Driver Policies", icon: User },
  { id: "cancel", title: "Cancellation Rules", icon: AlertTriangle },
  { id: "safety", title: "Safety Guidelines", icon: Shield },
  { id: "legal", title: "Legal Jurisdiction", icon: Scale }
];

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState("intro");

  const getContent = (id: string) => {
    switch (id) {
      case "intro":
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">1. Introduction</h2>
            <div className="prose prose-slate max-w-none text-slate-700 font-bold text-lg leading-relaxed space-y-6">
              <p>
                Welcome to NRK Travels (Vizag Taxi Hub). By accessing our website, mobile application, or using our transportation services, you agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you and NRK Travels.
              </p>
              <p>
                We provide a platform that connects users with professional transportation services. Our goal is to ensure a safe, luxury, and reliable experience for every passenger.
              </p>
            </div>
          </div>
        );
      case "user":
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">2. User Responsibilities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Provide accurate and complete information during booking.",
                "Be present at the pickup location at the scheduled time.",
                "Follow all safety instructions provided by the driver.",
                "Refrain from smoking or consuming illegal substances in the vehicle.",
                "Maintain respectful conduct towards our professional chauffeurs.",
                "Report any lost items or issues within 24 hours of the trip."
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 flex items-start gap-4 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black flex-shrink-0 text-xs">{i + 1}</div>
                  <p className="text-slate-700 font-bold text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "booking":
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">3. Booking Terms</h2>
            <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-200 space-y-6">
              <p className="text-lg text-slate-700 font-bold leading-relaxed">
                All bookings are subject to vehicle availability. While we strive to provide the exact vehicle model requested, NRK Travels reserves the right to provide an equivalent or higher category vehicle in case of unforeseen circumstances.
              </p>
              <ul className="space-y-4">
                {[
                  "Standard bookings require at least 2 hours advance notice.",
                  "Airport transfers should be booked 4 hours in advance.",
                  "Tour packages and outstation trips require 24-hour notice.",
                  "Modifications to bookings are subject to additional charges based on distance and time changes."
                ].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-900 font-black">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "payment":
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">4. Payment Terms</h2>
            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div className="p-8 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20">
                <h4 className="text-xl font-black mb-4">Accepted Methods</h4>
                <p className="text-emerald-50 mb-6 font-bold">We support multiple secure payment gateways for your convenience.</p>
                <div className="flex flex-wrap gap-3">
                  {['UPI', 'Net Banking', 'Cards', 'Cash'].map(m => (
                    <span key={m} className="px-4 py-2 bg-white/20 rounded-lg text-xs font-black uppercase tracking-widest">{m}</span>
                  ))}
                </div>
              </div>
              <div className="p-8 rounded-3xl bg-orange-500 text-white shadow-xl shadow-orange-500/20">
                <h4 className="text-xl font-black mb-4">Pricing Policy</h4>
                <p className="text-orange-50 font-bold">Fares are transparently calculated based on distance, time, and vehicle category. No hidden surcharges apply.</p>
              </div>
            </div>
            <p className="text-slate-500 text-sm italic font-medium">
              Note: Toll taxes, parking fees, and state permits for outstation trips are to be paid by the customer unless explicitly included in the package.
            </p>
          </div>
        );
      case "driver":
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">5. Driver Policies</h2>
            <div className="p-10 rounded-[3rem] bg-white border border-slate-200 space-y-6 shadow-sm">
              <p className="text-lg text-slate-700 font-bold leading-relaxed">
                Our drivers are trained professionals. Customers are expected to treat them with respect.
              </p>
              <div className="grid gap-4">
                <div className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  <span className="font-black text-slate-900">Drivers will follow all traffic laws and speed limits.</span>
                </div>
                <div className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  <span className="font-black text-slate-900">Drivers have the right to refuse service if safety is compromised.</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-20">
            <h3 className="text-2xl font-black text-slate-400">Content for {id} is coming soon.</h3>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-white transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-24 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-orange-600/30 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionReveal>
            <Breadcrumbs items={[{ label: "Support", href: "/support" }, { label: "Terms & Conditions" }]} />
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Scale className="w-3.5 h-3.5" />
                Legal Framework
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Terms & <span className="text-orange-500">Conditions</span></h1>
              <p className="text-xl text-slate-300 font-bold leading-relaxed">
                Last updated: May 15, 2026. Please read these terms carefully.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Tab Navigation Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200 shadow-xl lg:sticky lg:top-32">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 px-2">Table of Contents</h4>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        if (window.innerWidth < 1024) {
                          window.scrollTo({ top: document.getElementById('tab-content')?.offsetTop ? document.getElementById('tab-content')!.offsetTop - 100 : 0, behavior: 'smooth' });
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl text-sm font-black transition-all group text-left",
                        activeSection === section.id
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                          : "text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className={cn("w-4 h-4", activeSection === section.id ? "text-white" : "text-slate-300 group-hover:text-emerald-500")} />
                        {section.title}
                      </div>
                      <ChevronRight className={cn("w-4 h-4 transition-transform", activeSection === section.id ? "rotate-0 translate-x-1" : "opacity-0 group-hover:opacity-100")} />
                    </button>
                  ))}
                </nav>

                <div className="mt-12 pt-8 border-t border-slate-200">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <HelpCircle className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Questions?</p>
                      <Link href="/contact" className="text-xs font-black text-emerald-600 hover:text-orange-500 transition-colors">Contact Legal Team</Link>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Dynamic Content Area */}
            <div id="tab-content" className="flex-1 min-h-[600px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <SectionReveal>
                    {getContent(activeSection)}

                    <div className="mt-16 p-12 rounded-[3rem] bg-emerald-50 border border-emerald-200 text-center">
                      <h3 className="text-2xl font-black text-slate-900 mb-4">Still have legal questions?</h3>
                      <p className="text-slate-600 font-bold mb-8">Our compliance team is ready to provide clarifications on any clause.</p>
                      <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition-all shadow-xl shadow-emerald-600/20 border-none">
                        Contact Compliance Team <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </SectionReveal>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      </main>
  );
};

export default TermsPage;
