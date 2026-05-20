"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, CreditCard, Car, MapPin,
  ChevronDown, ChevronRight, HelpCircle, Sparkles,
  ShieldAlert, UserCheck, Phone, MessageCircle, ArrowRight
} from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

const helpData = [
  {
    id: "booking",
    title: "Booking Issues",
    icon: BookOpen,
    faqs: [
      { q: "How do I book a taxi for an early morning airport drop?", a: "You can use our 'Airport Transfer' tab in the booking card. We recommend booking at least 4 hours in advance for early morning rides to ensure a 100% guarantee of on-time arrival." },
      { q: "Can I book a cab for a full-day city tour?", a: "Yes! Use the 'Hourly Rental' (Local) option and select the '8 Hours / 80 KM' or '12 Hours / 120 KM' package depending on your needs." },
      { q: "What should I do if my flight is delayed?", a: "Don't worry! If you've provided your flight number, our team monitors flight status and will adjust the pickup time automatically without extra charges." }
    ]
  },
  {
    id: "payment",
    title: "Payment Problems",
    icon: CreditCard,
    faqs: [
      { q: "My transaction failed but money was deducted.", a: "Usually, banks revert failed transactions within 24-48 hours. Please send your transaction ID to info@nrtravels.com if it doesn't revert." },
      { q: "Are toll and parking charges included in the fare?", a: "For local rentals, no. For outstation packages, it depends on the package selected. Clear details are shown during the booking process." }
    ]
  },
  {
    id: "safety",
    title: "Ride Safety",
    icon: ShieldAlert,
    faqs: [
      { q: "How are your drivers verified?", a: "Every chauffeur undergoes a rigorous background check, police verification, and a professional training program before joining our elite fleet." },
      { q: "What safety features are available in-ride?", a: "All vehicles are equipped with GPS tracking and an SOS button in our mobile app. You can also share your live location with family via WhatsApp." }
    ]
  },
  {
    id: "refund",
    title: "Refund Questions",
    icon: RotateCcwFallback, // Using local icon
    faqs: [
      { q: "How long does a refund take to reach my bank?", a: "Once approved, it typically takes 3-5 business days for the amount to reflect in your original payment method source." },
      { q: "Why was a cancellation fee charged?", a: "Fees are applied to compensate the driver for their time and fuel if the cancellation happens very close to the scheduled pickup time." }
    ]
  }
];

// Fallback for RotateCcw if not imported
function RotateCcwFallback(props: any) {
  return <Sparkles {...props} />
}

const HelpCenterPage = () => {
  const [activeCategory, setActiveCategory] = useState("booking");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (!searchQuery) return helpData;
    return helpData.map(cat => ({
      ...cat,
      faqs: cat.faqs.filter(f =>
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.faqs.length > 0);
  }, [searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#010a08] transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white dark:bg-transparent border-b border-slate-100 dark:border-emerald-500/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <SectionReveal>
            <Breadcrumbs items={[{ label: "Support", href: "/support" }, { label: "Help Center" }]} />

            <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
              The <span className="text-emerald-600">Knowledge</span> Base
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-emerald-100/60 font-medium mb-12">
              Instant answers to your most frequent questions, curated by our expert support team.
            </p>

            <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for articles (e.g. 'refund', 'safety', 'airport')..."
                className="w-full h-16 pl-16 pr-6 rounded-2xl bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-500/10 focus:border-emerald-500 outline-none shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Desktop Category Sidebar */}
            <aside className="lg:w-80 flex-shrink-0 hidden lg:block sticky top-32 h-fit">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4">Categories</h4>
                {helpData.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl text-sm font-black transition-all group",
                      activeCategory === cat.id
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                        : "text-slate-500 dark:text-emerald-100/40 hover:bg-emerald-500/5 hover:text-emerald-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <cat.icon className={cn("w-4 h-4", activeCategory === cat.id ? "text-white" : "text-slate-300 group-hover:text-emerald-500")} />
                      {cat.title}
                    </div>
                    <ChevronRight className={cn("w-4 h-4 transition-transform", activeCategory === cat.id && "translate-x-1")} />
                  </button>
                ))}
              </div>

              <div className="mt-12 p-8 rounded-[2.5rem] bg-orange-500 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-xl rounded-full" />
                <HelpCircle className="w-8 h-8 mb-4 opacity-50" />
                <h4 className="text-xl font-black mb-2">Can't Find it?</h4>
                <p className="text-orange-50 text-xs font-bold leading-relaxed mb-6">Talk to our concierge team directly via WhatsApp.</p>
                <a href="https://wa.me/919111989222" className="block w-full py-3 bg-white text-orange-600 rounded-xl text-xs font-black uppercase tracking-widest text-center">
                  Chat Now
                </a>
              </div>
            </aside>

            {/* Mobile Categories (Scrollable) */}
            <div className="lg:hidden flex gap-4 overflow-x-auto pb-4 mb-8">
              {helpData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    activeCategory === cat.id ? "bg-emerald-600 text-white" : "bg-white text-slate-500 dark:bg-emerald-950/20"
                  )}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* FAQ Area */}
            <div className="flex-1 space-y-12">
              {filteredData.map((cat) => (
                (activeCategory === cat.id || searchQuery) && (
                  <SectionReveal key={cat.id}>
                    <div className="mb-8">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <cat.icon className="w-6 h-6 text-emerald-600" />
                        {cat.title}
                      </h3>
                      <div className="h-1 w-20 bg-orange-500 rounded-full" />
                    </div>

                    <div className="space-y-4">
                      {cat.faqs.map((faq, idx) => {
                        const faqId = `${cat.id}-${idx}`;
                        const isOpen = openFaq === faqId;
                        return (
                          <div
                            key={idx}
                            className="rounded-3xl bg-white dark:bg-emerald-950/20 border border-slate-100 dark:border-emerald-500/10 overflow-hidden"
                          >
                            <button
                              onClick={() => toggleFaq(faqId)}
                              className="w-full flex items-center justify-between p-8 text-left group"
                            >
                              <span className={cn(
                                "text-lg font-black transition-colors",
                                isOpen ? "text-emerald-600" : "text-slate-900 dark:text-white group-hover:text-emerald-600"
                              )}>
                                {faq.q}
                              </span>
                              <ChevronDown className={cn("w-6 h-6 transition-all", isOpen ? "rotate-180 text-emerald-600" : "text-slate-300")} />
                            </button>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="px-8 pb-8 text-slate-600 dark:text-emerald-100/60 font-medium leading-relaxed text-lg border-t border-slate-50 dark:border-emerald-500/5 pt-6">
                                    {faq.a}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </SectionReveal>
                )
              ))}

              {filteredData.length === 0 && (
                <div className="text-center py-20 bg-slate-100/50 dark:bg-emerald-950/10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-emerald-500/10">
                  <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No matching results found</h3>
                  <p className="text-slate-500 font-medium mb-8">Try searching for different keywords or browse categories.</p>
                  <button onClick={() => setSearchQuery("")} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help Bottom Section */}
      <section className="py-24 bg-white dark:bg-[#010a08]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionReveal>
            <div className="p-12 md:p-20 rounded-[4rem] bg-slate-900 text-white relative overflow-hidden shadow-3xl text-center">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/10 to-orange-600/10" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Still Need <span className="text-emerald-500">Human</span> Help?</h2>
                <p className="text-xl text-slate-400 font-medium mb-12">
                  Our elite support squad is available around the clock for complex inquiries or special requests.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/contact" className="px-10 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all shadow-xl shadow-emerald-600/20 group">
                    Email Support Team <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="https://wa.me/919111989222" className="px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black text-lg transition-all flex items-center justify-center gap-3">
                    <MessageCircle className="w-6 h-6 text-emerald-400" /> WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      </main>
  );
};

export default HelpCenterPage;
