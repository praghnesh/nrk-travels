"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Headphones,
  CarFront,
  Award,
  CheckCircle2,
  Phone,
  MessageCircle,
  Mail,
  ArrowRight
} from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/button";
import BookDriverForm from "@/components/booking/BookDriverForm";

const whyChooseUs = [
  {
    title: "Verified Drivers",
    desc: "All drivers are background verified and licensed",
    icon: ShieldCheck,
    tag: "VERIFIED DRIVERS",
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Customer Support",
    desc: "Dedicated support team for any assistance 24/7",
    icon: Headphones,
    tag: "CUSTOMER SUPPORT",
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Safe Driving",
    desc: "Defensive driving techniques and safety protocols 5+",
    icon: CarFront,
    tag: "SAFE DRIVING",
    img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Quality Assured",
    desc: "Regular training and performance monitoring",
    icon: Award,
    tag: "QUALITY ASSURED",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400"
  }
];

const services = [
  {
    title: "Personal Driver - Local",
    price: "₹1,000",
    unit: "/day",
    hours: "8 hours",
    tag: "PERSONAL DRIVER - LOCAL",
    features: [
      "Professional driver",
      "Your own vehicle",
      "Flexible timing",
      "Local area coverage",
      "Transport Excluded"
    ]
  },
  {
    title: "Outstation Driver",
    price: "₹1,500",
    unit: "/day",
    hours: "12 hours",
    tag: "OUTSTATION DRIVER",
    features: [
      "Experienced in long drives",
      "Route planning",
      "Overnight stays not covered",
      "Interstate expertise",
      "Transport Excluded",
      "Upto 200 kms limit"
    ]
  },
  {
    title: "Event Driver",
    price: "₹1,500",
    unit: "/event",
    hours: "12 hours",
    tag: "EVENT DRIVER",
    features: [
      "Wedding ceremonies",
      "Special events",
      "Formal attire",
      "Punctual service",
      "Transport Excluded"
    ]
  }
];

const steps = [
  { id: 1, title: "Submit Request", desc: "Fill out the booking form with your requirements" },
  { id: 2, title: "Driver Assignment", desc: "We assign a verified driver based on your needs" },
  { id: 3, title: "Confirmation", desc: "Receive driver details and service confirmation" },
  { id: 4, title: "Service Begins", desc: "Your professional driver arrives at scheduled time" }
];

const HireDriverPage = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-[#010a08]">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-6 md:space-y-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-500/5 blur-[80px] md:blur-[120px] rounded-full -z-10" />
          <SectionReveal>
            <h1 className="text-4xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
              Hire a <span className="text-emerald-600 italic">Professional</span> <br className="hidden md:block" /> Driver
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-2xl text-slate-500 dark:text-emerald-100/40 font-medium leading-relaxed mt-4 md:mt-8 px-4 md:px-0">
              Need a reliable driver for your personal vehicle? Our experienced, verified drivers
              are ready to serve you with professionalism and safety.
            </p>
            <div className="pt-8 md:pt-12">
              <Button className="h-14 md:h-20 px-6 md:px-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm md:text-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-2 md:gap-5 mx-auto transition-all active:scale-95 group whitespace-nowrap">
                <Phone className="size-5 md:size-8 group-hover:rotate-12 transition-transform shrink-0" />
                Call Now: +91 9111989222
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-slate-50/50 dark:bg-emerald-950/5">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white text-center mb-12 md:mb-24 tracking-tight">
              Why <span className="text-emerald-600">Choose Our</span> Drivers?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {whyChooseUs.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -12 }}
                  className="bg-white dark:bg-emerald-950/20 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-emerald-500/10 group transition-all"
                >
                  <div className="p-8 md:p-10 space-y-6 md:space-y-8">
                    <div className="inline-block px-4 md:px-5 py-1.5 md:py-2 bg-slate-900 text-white text-[9px] md:text-[10px] font-black tracking-[0.2em] rounded-full">
                      {item.tag}
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{item.title}</h3>
                      <p className="text-slate-500 dark:text-emerald-100/60 font-medium text-sm md:text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="aspect-square relative overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#010a08]/90 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 w-12 md:w-16 h-12 md:h-16 bg-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-500">
                      <item.icon className="size-6 md:size-8" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Services Pricing Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white text-center mb-12 md:mb-24 tracking-tight">
              Our <span className="text-emerald-600">Driver</span> Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-emerald-50/30 dark:bg-emerald-900/5 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 lg:p-16 border border-emerald-100 dark:border-emerald-500/10 flex flex-col h-full relative group"
                >
                  <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <CheckCircle2 className="size-20 md:size-32" />
                  </div>
                  <div className="mb-8 md:mb-10 relative z-10">
                    <div className="inline-block px-4 md:px-5 py-1.5 md:py-2 bg-slate-900 text-white text-[9px] md:text-[10px] font-black tracking-[0.2em] rounded-full mb-6 md:mb-10">
                      {service.tag}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{service.price}</span>
                      <span className="text-slate-400 font-bold text-base md:text-lg">{service.unit}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{service.hours} duty</span>
                    </div>
                  </div>
                  <ul className="space-y-4 md:space-y-5 mb-8 md:mb-12 flex-1 relative z-10">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 md:gap-4 text-slate-600 dark:text-emerald-100/60 font-semibold text-sm md:text-base">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="size-3 md:size-4 text-emerald-600" />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 md:py-24 bg-slate-50/50 dark:bg-emerald-950/5">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <BookDriverForm />
          </SectionReveal>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white text-center mb-12 md:mb-20 tracking-tight">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden lg:block absolute top-12 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-slate-100 dark:bg-emerald-500/10 -z-10" />

              {steps.map((step) => (
                <div key={step.id} className="text-center space-y-4 md:space-y-6">
                  <div className="w-12 md:w-16 h-12 md:h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-xl shadow-emerald-500/20 mx-auto">
                    {step.id}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="text-slate-500 dark:text-emerald-100/40 text-xs md:text-sm font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 md:py-24 bg-emerald-600 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-white/10 blur-[80px] md:blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-emerald-900/20 blur-[60px] md:blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-white">
          <SectionReveal>
            <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight italic">Need Immediate Assistance?</h2>
            <p className="text-emerald-100/80 font-medium text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto">
              Our customer support team is available 24/7 to help you find the perfect driver for your journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <a href="tel:+919111989222" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-emerald-600 px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-base md:text-lg hover:scale-105 transition-all shadow-xl shadow-emerald-900/20">
                <Phone className="size-5 md:size-7" />
                Call: +91 9111989222
              </a>
              <a href="https://wa.me/919111989222" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-base md:text-lg hover:bg-white/20 transition-all">
                <MessageCircle className="size-5 md:size-7" />
                WhatsApp
              </a>
              <a href="mailto:info@nrtravels.com" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-base md:text-lg hover:bg-white/20 transition-all">
                <Mail className="size-5 md:size-7" />
                Email
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

      </main>
  );
};

export default HireDriverPage;
