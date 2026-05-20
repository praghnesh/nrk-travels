"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Globe, Camera, Play, Share2, Heart } from "lucide-react";

import { ROUTES } from "@/lib/navigation";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 pt-24 pb-12">
      <div className="max-w-[100%] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: Services */}
          <div className="space-y-6">
            <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">Prime Services</h4>
            <ul className="space-y-4 text-xs font-bold">
              <li><Link href={ROUTES.SERVICES_SECTION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Local Taxi Hub</Link></li>
              <li><Link href={ROUTES.SERVICES_SECTION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Outstation Elite</Link></li>
              <li><Link href={ROUTES.SERVICES_SECTION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Airport Concierge</Link></li>
              <li><Link href={ROUTES.TOURS_SECTION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Luxury Tour Packages</Link></li>
              <li><Link href={ROUTES.TOURS_SECTION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Group Travel Solutions</Link></li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-6">
            <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">Our Company</h4>
            <ul className="space-y-4 text-xs font-bold">
              <li><Link href={ROUTES.ABOUT} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Our Story</Link></li>
              <li><Link href={ROUTES.VISION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Vision & Mission</Link></li>
              <li><Link href={ROUTES.FLEET} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Fleet & Luxury</Link></li>
              <li><Link href={ROUTES.CAREERS} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Careers Hub</Link></li>
              <li><Link href={ROUTES.CONTACT} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Investor Relations</Link></li>
            </ul>
          </div>

          {/* Column 3: Tours */}
          <div className="space-y-6">
            <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">Curated Tours</h4>
            <ul className="space-y-4 text-xs font-bold">
              <li><Link href={ROUTES.TOURS_SECTION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Araku Valley Escape</Link></li>
              <li><Link href={ROUTES.TOURS_SECTION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Lambasingi Heights</Link></li>
              <li><Link href={ROUTES.TOURS_SECTION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Vizag Coastal Tour</Link></li>
              <li><Link href={ROUTES.TOURS_SECTION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Spiritual Hub Tour</Link></li>
              <li><Link href={ROUTES.TOURS_SECTION} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Custom Group Journeys</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-6">
            <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">Support Hub</h4>
            <ul className="space-y-4 text-xs font-bold">
              <li><Link href={ROUTES.HELP} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">24/7 Help Center</Link></li>
              <li><Link href={ROUTES.CONTACT} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Corporate Inquiry</Link></li>
              <li><Link href={ROUTES.HIRE_DRIVER} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Hire Certified Driver</Link></li>
              <li><Link href={ROUTES.REFUND} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Refund Policy</Link></li>
              <li><Link href={ROUTES.TERMS} className="hover:text-emerald-600 transition-colors uppercase tracking-widest">Terms of Luxury</Link></li>
            </ul>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-16 pb-20 border-b border-slate-200">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-100 shadow-md flex items-center justify-center relative">
                <Image 
                  src="/images/logo.jpg" 
                  alt="NRK Travels Logo" 
                  fill 
                  className="object-cover object-left scale-[1.35] -translate-x-[4%]" 
                />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-emerald-600 tracking-tight">NRK</span>
                <span className="text-sm font-black text-orange-500 tracking-tight">TRAVELS</span>
              </div>
            </div>
            <p className="text-slate-600 text-[13px] leading-relaxed font-bold">
              Journeys that connect, Memories that last. Visakhapatnam's premier luxury transportation provider,
              specializing in bespoke travel experiences across South India.
            </p>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">Contact Concierge</h4>
              <ul className="space-y-5 text-sm font-black text-slate-900">
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                    <Phone className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                  </div>
                  <div className="flex flex-col">
                    <a href="tel:+919111989222" className="tracking-widest font-black hover:text-emerald-600 transition-colors">+91 9111989222</a>
                    <a href="tel:+918889994886" className="tracking-widest font-black text-xs text-slate-500 mt-1 hover:text-emerald-600 transition-colors">+91 8889994886</a>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                    <Mail className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                  </div>
                  <div className="flex flex-col">
                    <a href="mailto:info@nrtravels.com" className="tracking-wide font-black hover:text-emerald-600 transition-colors">info@nrtravels.com</a>
                    <a href="mailto:nrktravels.in@gmail.com" className="tracking-wide font-black text-xs text-slate-500 mt-1 hover:text-emerald-600 transition-colors">nrktravels.in@gmail.com</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Location Map */}
          <div className="space-y-6">
            <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px]">Headquarters</h4>
            <div className="rounded-[2rem] overflow-hidden h-40 border border-slate-200 grayscale hover:grayscale-0 transition-all duration-700 shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.2!2d83.3!3d17.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDQyJzAwLjAiTiA4M8KwMTgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
            © 2026 VIZAG TAXI. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-8">
            {[Globe, Camera, Play, Share2].map((Icon, i) => (
              <a key={i} href="#" className="text-slate-400 hover:text-emerald-600 transition-all hover:scale-110">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <p className="text-[10px] font-black flex items-center gap-3 uppercase tracking-[0.4em] opacity-60">
            CRAFTED WITH <Heart className="w-4 h-4 text-emerald-600 fill-current animate-pulse" /> IN VIZAG
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
