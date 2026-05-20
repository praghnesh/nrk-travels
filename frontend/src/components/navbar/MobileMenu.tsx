/**
 * =========================================
 * MobileMenu Component
 * Slide-out navigation for mobile devices
 * =========================================
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, LogIn, UserPlus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES, NAV_LINKS, COMPANY_LINKS, SUPPORT_LINKS, TOUR_LINKS, OUTSTATION_LINKS, MEGA_MENU_DATA } from "@/lib/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const getSubLinks = (name: string) => {
    switch (name) {
      case "Services":
        return MEGA_MENU_DATA.map(d => ({ title: d.title, href: d.items[0].href }));
      case "Tour Packages":
        return TOUR_LINKS;
      case "Outstation":
        return OUTSTATION_LINKS;
      case "Company":
        return COMPANY_LINKS;
      case "Support":
        return SUPPORT_LINKS;
      default:
        return [];
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[101] lg:hidden p-8 flex flex-col shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <span className="text-xl font-black tracking-tighter text-emerald-950">
                NRK <span className="text-orange-500">TRAVELS</span>
              </span>
              <button onClick={onClose} className="p-3 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors group">
                <X className="w-6 h-6 text-emerald-600 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 mb-16">
              <Link
                href="/"
                onClick={onClose}
                className="py-4 text-3xl font-black text-emerald-950 hover:text-orange-500 transition-all text-left"
              >
                Home
              </Link>
              {(() => {
                const sortedLinks = [...NAV_LINKS];
                const tourIndex = sortedLinks.findIndex(l => l.name === "Tour Packages");
                const outIndex = sortedLinks.findIndex(l => l.name === "Outstation");
                const orderedMobileLinks = [];
                if (tourIndex !== -1) orderedMobileLinks.push(sortedLinks[tourIndex]);
                if (outIndex !== -1) orderedMobileLinks.push(sortedLinks[outIndex]);
                sortedLinks.forEach(link => {
                  if (link.name !== "Tour Packages" && link.name !== "Outstation") {
                    orderedMobileLinks.push(link);
                  }
                });
                return orderedMobileLinks;
              })().map((link) => {
                const hasSubLinks = link.hasDropdown;
                const isOpen = openDropdown === link.name;
                const subLinks = getSubLinks(link.name);

                return (
                  <div key={link.name} className="flex flex-col">
                    {hasSubLinks ? (
                      <button
                        onClick={() => toggleDropdown(link.name)}
                        className={cn(
                          "flex items-center justify-between py-4 text-3xl font-black transition-all text-left",
                          isOpen ? "text-orange-500" : "text-emerald-950"
                        )}
                      >
                        {link.name}
                        <ChevronDown className={cn("w-6 h-6 transition-transform duration-300", isOpen && "rotate-180")} />
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="py-4 text-3xl font-black text-emerald-950 hover:text-orange-500 transition-all"
                      >
                        {link.name}
                      </Link>
                    )}

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className={cn(
                            "flex gap-3 pb-4 overflow-x-auto no-scrollbar scroll-smooth mt-4",
                            (link.name === "Outstation" || link.name === "Tour Packages" || link.name === "Services") ? "flex-row px-2" : "flex-col pl-4 border-l-4 border-emerald-500/20"
                          )}>
                            {subLinks.map((sub, idx) => (
                              <Link
                                key={idx}
                                href={sub.href}
                                onClick={onClose}
                                className={cn(
                                  "whitespace-nowrap transition-all",
                                  (link.name === "Outstation" || link.name === "Tour Packages" || link.name === "Services")
                                    ? "px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                                    : "text-lg font-bold text-emerald-900/70 hover:text-emerald-600"
                                )}
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4">
              <Button className="w-full h-16 rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-white font-black text-lg shadow-lg shadow-orange-600/20 border-none transition-all active:scale-95">
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </Button>
              <Button variant="outline" className="w-full h-16 rounded-[2rem] border-emerald-500/10 text-emerald-950 font-black text-lg hover:bg-emerald-50 transition-all active:scale-95">
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up
              </Button>
              <Link
                href="tel:9111989222"
                className="flex items-center justify-center gap-3 w-full h-16 rounded-[2rem] bg-emerald-500/10 text-emerald-600 font-black text-lg border border-emerald-500/20 transition-all active:scale-95"
              >
                <Phone className="w-5 h-5" />
                9111989222
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
