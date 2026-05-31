"use client";

import React, { useState } from "react";
import { Calendar, User, Phone, Mail, MapPin, Briefcase, Clock, MessageSquare, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookDriverForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    pickupLocation: "",
    pickupDateTime: "",
    serviceType: "Personal Driver - Local",
    duration: "Multi Day",
    specialRequirements: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Your driver request has been submitted! We will contact you shortly.");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-emerald-950/20 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 md:p-12 border border-slate-100 dark:border-emerald-500/10">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Book Your Driver</h2>
        <p className="text-slate-500 dark:text-emerald-100/40 font-medium">Fill out the form below and we&apos;ll get back to you within 30 minutes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name *</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full h-14 bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number *</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Enter 10-digit number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-14 bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address *</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-14 bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup Location *</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="pickupLocation"
              required
              placeholder="Enter pickup location"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full h-14 bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Pickup Date & Time *</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <input
              type="datetime-local"
              name="pickupDateTime"
              required
              value={formData.pickupDateTime}
              onChange={handleChange}
              className="w-full h-14 bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold appearance-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Service Type *</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full h-14 bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 rounded-2xl pl-12 pr-10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold appearance-none cursor-pointer"
              >
                <option>Personal Driver - Local</option>
                <option>Outstation Driver</option>
                <option>Event Driver</option>
                <option>Bus / Heavy Vehicle Driver</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Duration *</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full h-14 bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 rounded-2xl pl-12 pr-10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold appearance-none cursor-pointer"
              >
                <option>One Day</option>
                <option>Multi Day</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Special Requirements</label>
          <div className="relative group">
            <div className="absolute left-4 top-6 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <textarea
              name="specialRequirements"
              placeholder="Any specific requirements or additional information..."
              value={formData.specialRequirements}
              onChange={handleChange}
              rows={4}
              className="w-full bg-slate-50 dark:bg-emerald-900/10 border border-slate-200 dark:border-emerald-500/10 rounded-2xl pl-12 pr-4 pt-5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold resize-none"
            />
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-[10px] text-slate-400 mb-6 font-medium">
            By submitting, you agree to our <span className="text-emerald-600 underline cursor-pointer">Hire-a-Driver Terms & Conditions</span>.
          </p>
          <Button
            type="submit"
            className="w-full md:w-auto px-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-95 border-none"
          >
            Request Driver
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookDriverForm;
