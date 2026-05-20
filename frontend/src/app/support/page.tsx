"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search, Car, MapPin, AlertCircle, MessageCircle,
  Phone, Mail, ArrowRight, ShieldCheck, Clock,
  HelpCircle, UserCheck, Star, Sparkles
} from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/navigation";

const quickActions = [
  { title: "Track My Ride", icon: MapPin, color: "bg-emerald-500", desc: "Live GPS tracking of your active booking", href: ROUTES.HELP },
  { title: "Contact Driver", icon: Phone, color: "bg-emerald-600", desc: "Get in touch with your assigned chauffeur", href: ROUTES.CONTACT },
  { title: "Report an Issue", icon: AlertCircle, color: "bg-slate-700", desc: "Safety or service related concerns", href: ROUTES.CONTACT },
  { title: "Refund Status", icon: Clock, color: "bg-emerald-700", desc: "Check status of your recent refund request", href: ROUTES.REFUND }
];

const supportCategories = [
  { id: "booking", title: "Booking & Reservations", icon: Car, count: "12 Articles" },
  { id: "payment", title: "Payments & Invoices", icon: ShieldCheck, count: "8 Articles" },
  { id: "safety", title: "Safety & Security", icon: ShieldCheck, count: "6 Articles" },
  { id: "account", title: "Account & Profile", icon: UserCheck, count: "5 Articles" }
];

const stats = [
  { label: "Response Time", value: "< 5 Mins", icon: Clock },
  { label: "Happy Customers", value: "50k+", icon: Star },
  { label: "Availability", value: "24/7/365", icon: ShieldCheck }
];

const SupportOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionReveal>
            <Breadcrumbs items={[{ label: "Support" }]} />

            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Support Dashboard
              </div>

              <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter">
                How Can We <span className="text-emerald-600 underline decoration-emerald-500/30">Help?</span>
              </h1>

              <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-700 font-bold mb-12">
                Search our knowledge base or select a quick action to get started.
              </p>

              <div className="max-w-3xl mx-auto relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help topics, policies, or booking issues..."
                  className="w-full h-20 pl-16 pr-8 rounded-3xl bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none shadow-2xl shadow-slate-200/50 transition-all text-slate-900 text-lg font-bold"
                />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, i) => (
                <motion.div
                  key={action.title}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg transition-transform group-hover:scale-110",
                    action.color
                  )}>
                    <action.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{action.title}</h3>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed mb-6">
                    {action.desc}
                  </p>
                  <Link
                    href={action.href}
                    className="inline-flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest group/link"
                  >
                    Take Action <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="py-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black mb-1">In-Ride Emergency?</h2>
                <p className="text-orange-100 font-bold uppercase tracking-widest text-xs">Our 24/7 Response Team is standing by</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+919111989222" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl">
                <Phone className="w-5 h-5" /> SOS +91 9111989222
              </a>
              <a href="https://wa.me/919111989222" className="px-8 py-4 bg-white text-orange-600 hover:bg-orange-50 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl">
                <MessageCircle className="w-5 h-5" /> Rapid WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Stats */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Categories */}
            <div className="lg:col-span-2">
              <SectionReveal>
                <div className="mb-12">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Knowledge <span className="text-emerald-600">Categories</span></h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Find in-depth guides by topic</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {supportCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href="/help"
                      className="p-8 rounded-3xl bg-white border border-slate-100 flex items-center justify-between group hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          <cat.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900">{cat.title}</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.count}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </SectionReveal>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-8">
              <SectionReveal>
                <div className="p-10 rounded-[2.5rem] bg-emerald-600 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                  <h3 className="text-2xl font-black mb-8 relative z-10 leading-tight">Delivering Support <span className="text-orange-400">Excellence</span></h3>
                  <div className="space-y-8 relative z-10">
                    {stats.map((stat) => (
                      <div key={stat.label} className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-3xl font-black leading-none mb-1">{stat.value}</div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-100/60">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">Need Custom Support?</h4>
                  <p className="text-sm text-slate-600 mb-6 font-bold">Send us an email and we'll reply within 2 hours.</p>
                  <Link href="/contact" className="text-emerald-600 font-black uppercase tracking-widest text-[10px] hover:text-orange-500 transition-colors">
                    Go to Contact Page
                  </Link>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-slate-100/50">
        <div className="max-w-4xl mx-auto px-6">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Quick <span className="text-orange-500">FAQ</span> Preview</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Find instant answers to common queries</p>
            </div>

            <div className="space-y-4">
              {[
                "How do I cancel a pre-booked outstation ride?",
                "Are there any hidden waiting charges?",
                "How do I apply a discount coupon?",
                "What is the safety protocol for night rides?"
              ].map((q, i) => (
                <Link
                  key={i}
                  href="/help"
                  className="w-full flex items-center justify-between p-7 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-all group"
                >
                  <span className="text-lg font-bold text-slate-800 group-hover:text-emerald-600">{q}</span>
                  <HelpCircle className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href={ROUTES.HELP} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition-all">
                View Full Help Center
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      </main>
  );
};

export default SupportOverview;
