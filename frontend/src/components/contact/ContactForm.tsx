"use client";

import React from "react";
import { motion } from "framer-motion";
import { Send, Phone, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ContactForm = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Form Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-2 bg-white dark:bg-emerald-950/10 border border-slate-100 dark:border-emerald-500/10 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/20 dark:shadow-none"
      >
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Send us a <span className="text-emerald-600">Message</span></h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-emerald-100/60 ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-emerald-100/60 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-emerald-100/60 ml-1">Phone Number</label>
              <input 
                type="tel" 
                placeholder="+91 99663 63662"
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-emerald-100/60 ml-1">Subject</label>
              <input 
                type="text" 
                placeholder="How can we help?"
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-emerald-100/60 ml-1">Message</label>
            <textarea 
              rows={5}
              placeholder="Tell us more about your travel needs..."
              className="w-full p-6 rounded-2xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-500/10 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all text-slate-900 dark:text-white font-medium resize-none"
            />
          </div>

          <Button className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none flex items-center gap-3">
            <Send className="w-5 h-5" />
            Send Message
          </Button>
        </form>
      </motion.div>

      {/* Sidebar Section */}
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Need <span className="text-orange-500">Immediate</span> Help?</h3>
          
          {/* Call Box */}
          <div className="p-6 rounded-[2rem] bg-white dark:bg-emerald-950/10 border border-slate-100 dark:border-emerald-500/10 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Call Now</h4>
                <p className="text-xs text-slate-400 font-medium">Speak with our team instantly</p>
              </div>
            </div>
            <a href="tel:+919111989222" className="block w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center transition-all shadow-lg shadow-emerald-600/10">
              Call +91-9111989222
            </a>
          </div>

          {/* WhatsApp Box */}
          <div className="p-6 rounded-[2rem] bg-white dark:bg-emerald-950/10 border border-slate-100 dark:border-emerald-500/10 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-400 flex items-center justify-center text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">WhatsApp Chat</h4>
                <p className="text-xs text-slate-400 font-medium">Quick responses via WhatsApp</p>
              </div>
            </div>
            <a href="https://wa.me/919111989222" target="_blank" rel="noopener noreferrer" className="block w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-center transition-all shadow-lg shadow-emerald-500/10">
              Chat on WhatsApp
            </a>
          </div>

          {/* Email Box */}
          <div className="p-6 rounded-[2rem] bg-white dark:bg-emerald-950/10 border border-slate-100 dark:border-emerald-500/10 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Email Support</h4>
                <p className="text-xs text-slate-400 font-medium">Detailed support via email</p>
              </div>
            </div>
            <a href="mailto:info@nrtravels.com" className="block w-full py-4 rounded-xl bg-slate-100 dark:bg-emerald-900/20 text-slate-700 dark:text-emerald-100 font-bold text-center hover:bg-slate-200 dark:hover:bg-emerald-900/40 transition-all">
              Send Email
            </a>
          </div>
        </motion.div>

        {/* Business Hours Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-[2rem] bg-slate-900 text-white"
        >
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
              <Send className="w-4 h-4" />
            </span>
            Business Hours
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-slate-400 font-medium">Phone Support</span>
              <span className="font-bold text-emerald-400">24/7</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-slate-400 font-medium">Email Support</span>
              <span className="font-bold text-emerald-400">24/7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">WhatsApp</span>
              <span className="font-bold text-emerald-400">24/7</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactForm;
