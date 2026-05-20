"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RotateCcw, Clock, AlertCircle, CheckCircle2,
  HelpCircle, ShieldAlert, ArrowRight, Wallet,
  Calendar, Car, Plane
} from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

const refundProcess = [
  { title: "Initiate Request", desc: "Cancel via app or support line.", icon: RotateCcw },
  { title: "Verification", desc: "Our team checks the refund eligibility.", icon: Clock },
  { title: "Processing", desc: "Bank processing within 3-5 business days.", icon: Wallet },
  { title: "Credit", desc: "Amount credited back to original source.", icon: CheckCircle2 }
];

const policies = [
  {
    title: "Local Taxi Bookings",
    icon: Car,
    rules: [
      { condition: "> 2 hours before pickup", effect: "Full Refund (0% cancellation fee)" },
      { condition: "< 2 hours before pickup", effect: "50% Cancellation Fee applies" },
      { condition: "After driver arrival / No show", effect: "No Refund (100% fee)" }
    ]
  },
  {
    title: "Airport Transfers",
    icon: Plane,
    rules: [
      { condition: "> 4 hours before pickup", effect: "Full Refund" },
      { condition: "< 4 hours before pickup", effect: "Flat ₹250 Cancellation Fee" },
      { condition: "Flight delayed/cancelled", effect: "Free rescheduling or Full Refund" }
    ]
  },
  {
    title: "Outstation & Tours",
    icon: Calendar,
    rules: [
      { condition: "> 24 hours before pickup", effect: "Full Refund" },
      { condition: "12-24 hours before pickup", effect: "25% of advance amount as fee" },
      { condition: "< 12 hours before pickup", effect: "50% of total package cost as fee" }
    ]
  }
];

const RefundPolicy = () => {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#010a08] transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white dark:bg-transparent">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-orange-500/5 blur-[100px] rounded-full translate-x-1/4 -z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionReveal>
            <Breadcrumbs items={[{ label: "Support", href: "/support" }, { label: "Refund Policy" }]} />

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <RotateCcw className="w-3.5 h-3.5" />
                Transparency Guaranteed
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
                Cancellation & <span className="text-orange-600">Refunds</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-emerald-100/60 font-medium leading-relaxed">
                Clear rules and simple processing for your peace of mind. We believe in fair practices for both our passengers and driver partners.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Refund Process Timeline */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600/5 -z-0" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionReveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl font-black mb-4">The Refund <span className="text-emerald-500">Journey</span></h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">How we process your reversal requests</p>
            </div>

            <div className="grid md:grid-cols-4 gap-12 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-white/10" />

              {refundProcess.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all duration-500 group-hover:scale-110 relative z-10">
                    <step.icon className="w-10 h-10 text-emerald-500 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-xl font-black mb-3">{step.title}</h4>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Detailed Policies Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Service-Specific <span className="text-emerald-600">Rules</span></h2>
              <p className="text-slate-500 dark:text-emerald-100/40 font-bold uppercase tracking-widest text-xs">Clear cancellation criteria for every trip type</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {policies.map((policy, i) => (
                <div
                  key={i}
                  className="p-10 rounded-[3rem] bg-white dark:bg-emerald-950/20 border border-slate-100 dark:border-emerald-500/10 hover:shadow-2xl transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-8">
                    <policy.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">{policy.title}</h3>
                  <div className="space-y-6">
                    {policy.rules.map((rule, j) => (
                      <div key={j} className="flex flex-col gap-1 border-l-2 border-slate-100 dark:border-emerald-500/20 pl-6 hover:border-orange-500 transition-colors">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{rule.condition}</span>
                        <span className="font-bold text-slate-800 dark:text-emerald-50">{rule.effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Important Disclaimers */}
      <section className="py-24 bg-orange-500/5 dark:bg-orange-500/5 border-y border-orange-500/10">
        <div className="max-w-4xl mx-auto px-6">
          <SectionReveal>
            <div className="flex flex-col md:flex-row items-center gap-12 bg-white dark:bg-emerald-950/40 p-12 rounded-[3rem] border border-orange-500/20">
              <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white flex-shrink-0 animate-pulse">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Crucial Information</h3>
                <ul className="space-y-4">
                  {[
                    "No-shows are considered as cancelled with 100% fee.",
                    "Refunds are only processed back to the original source of payment.",
                    "Wait charges beyond 15 mins are non-refundable.",
                    "Toll taxes and inter-state permits are non-refundable once paid."
                  ].map((li, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-emerald-100/60 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* FAQ & Support CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/10 text-slate-500 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <HelpCircle className="w-3.5 h-3.5" />
              More Questions?
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8">Don't See Your <span className="text-emerald-600">Case?</span></h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/help" className="px-10 py-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black transition-all shadow-xl">
                View Help Center
              </Link>
              <Link href="/contact" className="px-10 py-5 rounded-2xl bg-white text-emerald-600 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-50 font-black transition-all shadow-xl">
                Talk to Support
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      </main>
  );
};

export default RefundPolicy;
