"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, MessageCircle,
  Send, CheckCircle2, Sparkles, PhoneCall,
  Globe, Camera, Share2
} from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";
import { submitContact } from "@/lib/api";

const contactChannels = [
  {
    title: "Call Direct",
    info: "+91 9111989222",
    desc: "For urgent bookings and SOS",
    icon: PhoneCall,
    color: "bg-emerald-600",
    href: "tel:+919111989222"
  },
  {
    title: "WhatsApp",
    info: "Click to Chat",
    desc: "Quick responses in < 5 mins",
    icon: MessageCircle,
    color: "bg-emerald-500",
    href: "https://wa.me/919111989222"
  },
  {
    title: "Email Support",
    info: "info@nrtravels.com",
    desc: "Detailed tour inquiries",
    icon: Mail,
    color: "bg-orange-500",
    href: "mailto:info@nrtravels.com"
  }
];

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit contact form:', err);
      alert('Something went wrong. Please try again or reach us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle browser back button for success state
  React.useEffect(() => {
    if (isSubmitted) {
      window.history.pushState({ submitted: true }, "");
    }

    const handlePopState = (e: PopStateEvent) => {
      if (isSubmitted) {
        setIsSubmitted(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isSubmitted]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#010a08] transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-orange-600/20 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionReveal>
            <Breadcrumbs items={[{ label: "Support", href: "/support" }, { label: "Contact Us" }]} />
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Connect With Us
              </div>
              <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter">Let's <span className="text-orange-500">Connect</span></h1>
              <p className="text-xl text-slate-300 font-medium leading-relaxed mb-12">
                Whether it's a luxury tour package or a simple city ride, our team is here to ensure your journey is flawless.
              </p>
              <div className="flex items-center gap-6 mb-12">
                {[Globe, Camera, Share2].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white dark:bg-emerald-950/40 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all shadow-lg border border-slate-100 dark:border-emerald-500/10">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap gap-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Response Time</p>
                    <p className="font-bold">Average 15 Mins</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Coverage</p>
                    <p className="font-bold">South India Wide</p>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {contactChannels.map((channel, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <a
                  href={channel.href}
                  className="block p-10 rounded-[3rem] bg-white dark:bg-emerald-950/20 border border-slate-100 dark:border-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-white transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-xl",
                    channel.color
                  )}>
                    <channel.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{channel.title}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-black text-sm mb-4 tracking-tight">{channel.info}</p>
                  <p className="text-sm text-slate-500 dark:text-emerald-100/60 font-medium leading-relaxed">
                    {channel.desc}
                  </p>
                </a>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Info */}
      <section className="py-24 bg-slate-100/50 dark:bg-emerald-900/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Form */}
            <SectionReveal>
              <div className="p-10 md:p-14 rounded-[4rem] bg-white dark:bg-emerald-950/20 border border-slate-100 dark:border-emerald-500/10 shadow-3xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-8 relative z-10"
                    >
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Send a <span className="text-emerald-600">Message</span></h3>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Full Name</label>
                          <input
                            required
                            type="text"
                            className="w-full h-14 px-6 rounded-xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-medium"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Email Address</label>
                          <input
                            required
                            type="email"
                            className="w-full h-14 px-6 rounded-xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-medium"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Subject</label>
                        <select
                          className="w-full h-14 px-6 rounded-xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-medium appearance-none"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        >
                          <option>General Inquiry</option>
                          <option>Luxury Tour Package</option>
                          <option>Corporate Tie-up</option>
                          <option>Refund/Booking Issue</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Your Message</label>
                        <textarea
                          required
                          rows={4}
                          className="w-full p-6 rounded-xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 focus:border-emerald-600 outline-none transition-all font-medium resize-none"
                          placeholder="How can we assist you today?"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <button
                        disabled={isSubmitting}
                        className="w-full h-16 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Send Message <Send className="w-5 h-5" /></>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center py-20 relative z-10"
                    >
                      <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Message Sent!</h3>
                      <p className="text-slate-500 dark:text-emerald-100/60 font-medium mb-12">Thank you for reaching out, {formData.name.split(' ')[0]}. Our team will contact you shortly.</p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-emerald-600 font-black uppercase tracking-[0.3em] text-xs hover:text-orange-500 transition-colors"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionReveal>

            {/* Office Info */}
            <div className="space-y-12">
              <SectionReveal delay={0.2}>
                <div className="mb-12">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Our <span className="text-orange-500">Headquarters</span></h3>
                  <p className="text-slate-500 dark:text-emerald-100/60 font-medium leading-relaxed">
                    Visakhapatnam's premier luxury transportation provider. Visit us for a cup of coffee and a tour of our elite fleet.
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    { label: "Main Office", val: "Vizag Taxi, MVP Colony, Sector-5, Visakhapatnam, AP 530017", icon: MapPin },
                    { label: "Business Hours", val: "Monday - Sunday: 24 Hours Open", icon: Clock },
                    { label: "Social Media", val: "@nrktravelsvizag", icon: Camera }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 shadow-lg border border-slate-100 dark:border-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">{item.label}</span>
                        <span className="text-lg font-bold text-slate-800 dark:text-emerald-50 leading-tight">{item.val}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 rounded-[3rem] overflow-hidden h-64 border-4 border-white dark:border-emerald-950/40 shadow-3xl grayscale hover:grayscale-0 transition-all duration-700">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.2!2d83.3!3d17.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDQyJzAwLjAiTiA4M8KwMTgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  ></iframe>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      </main>
  );
};

export default ContactPage;
