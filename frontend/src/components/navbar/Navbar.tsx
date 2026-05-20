/**
 * =========================================
 * Navbar Component
 * Responsive premium navigation bar
 * =========================================
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu, Phone, ChevronDown, Car, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import MegaMenu from "./MegaMenu";
import TourMegaMenu from "./TourMegaMenu";
import SimpleDropdown from "./SimpleDropdown";

import { ROUTES, NAV_LINKS, COMPANY_LINKS, SUPPORT_LINKS } from "@/lib/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setActiveMegaMenu(null);
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleMenu = (e: React.MouseEvent, menuName: string) => {
    e.preventDefault();
    setActiveMegaMenu(activeMegaMenu === menuName ? null : menuName);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMegaMenu) {
        const nav = document.querySelector("nav");
        if (nav && !nav.contains(event.target as Node)) {
          setActiveMegaMenu(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMegaMenu]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out px-4 md:px-10",
          isScrolled ? "py-4" : "py-8"
        )}
      >
        <div className={cn(
          "max-w-[100%] mx-auto flex items-center justify-between px-6 py-2.5 rounded-[2rem] transition-all duration-700 ease-in-out",
          isScrolled
            ? "bg-white/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-white/50"
            : "bg-transparent"
        )}>
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-md flex items-center justify-center transition-all duration-500 group-hover:scale-105 active:scale-95">
                <div className="relative w-full h-full">
                  <Image 
                    src="/images/logo.jpg" 
                    alt="Vizag Taxi Logo" 
                    fill 
                    className="object-cover object-left scale-[1.35] -translate-x-[4%] transition-transform duration-700" 
                    priority
                  />
                </div>
              </div>
              <Sparkles className="absolute -top-1.5 -right-1.5 w-4 h-4 text-orange-500 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  "text-2xl font-display font-black tracking-tighter leading-none transition-colors duration-500",
                  "text-emerald-600"
                )}>
                  NRK
                </span>
                <span className={cn(
                  "text-sm font-display font-black tracking-tighter leading-none transition-colors duration-500",
                  "text-orange-500"
                )}>
                  TRAVELS
                </span>
              </div>
              <span className={cn(
                "text-[7px] font-black uppercase tracking-[0.3em] opacity-60 transition-colors duration-500",
                "text-slate-500"
              )}>
                Journeys that connect, Memories that last
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <div key={link.name} className="relative group/item">
                {link.hasDropdown ? (
                  <button
                    onClick={(e) => toggleMenu(e, link.name)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                      "text-slate-600 hover:text-emerald-600 hover:bg-emerald-500/5",
                      activeMegaMenu === link.name && "text-emerald-600 bg-emerald-500/10"
                    )}
                  >
                    {link.name}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-500", activeMegaMenu === link.name && "rotate-180")} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 block",
                      "text-slate-600 hover:text-emerald-600 hover:bg-emerald-500/5"
                    )}
                  >
                    {link.name}
                  </Link>
                )}

                {/* Dropdowns */}
                <AnimatePresence>
                  {activeMegaMenu === link.name && (
                    <>
                      {link.name === "Services" && (
                        <MegaMenu isOpen={activeMegaMenu === "Services"} onClose={() => setActiveMegaMenu(null)} />
                      )}
                      {link.name === "Tour Packages" && (
                        <TourMegaMenu isOpen={activeMegaMenu === "Tour Packages"} onClose={() => setActiveMegaMenu(null)} />
                      )}
                      {link.name === "Company" && (
                        <SimpleDropdown isOpen={activeMegaMenu === "Company"} items={COMPANY_LINKS} title="Our Company" onClose={() => setActiveMegaMenu(null)} />
                      )}
                      {link.name === "Support" && (
                        <SimpleDropdown isOpen={activeMegaMenu === "Support"} items={SUPPORT_LINKS} title="Support Hub" onClose={() => setActiveMegaMenu(null)} />
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:9111989222"
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full border-2 transition-all duration-300 font-bold text-xs tracking-tight",
                isScrolled
                  ? "bg-slate-50 border-slate-200 text-slate-900 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                  : "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              )}
            >
              <Phone className="w-3.5 h-3.5" />
              9111989222
            </a>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-2">
              <Button
                variant="ghost"
                className={cn(
                  "font-bold text-xs rounded-full px-5 transition-all duration-300",
                  "text-slate-600 hover:text-emerald-600 hover:bg-emerald-500/5"
                )}
              >
                Login
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-500 text-white rounded-full px-7 text-xs font-black tracking-widest shadow-lg shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all border-none uppercase">
                Join
              </Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className={cn(
              "lg:hidden p-3 rounded-2xl transition-all duration-300",
              "text-slate-900 hover:bg-slate-100"
            )}
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
};

export default Navbar;
