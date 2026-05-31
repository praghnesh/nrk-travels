"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import FleetCard from "./FleetCard";

const fleet = [
  {
    slug: "swift-dzire",
    model: "Swift Dzire",
    pricePerKm: "14",
    pax: "4",
    image: "/images/fleet/swift_dzire.png",
  },
  {
    slug: "ertiga",
    model: "Ertiga",
    pricePerKm: "18",
    pax: "6",
    image: "/images/fleet/ertiga.png",
  },
  {
    slug: "glanza",
    model: "Toyota Glanza",
    pricePerKm: "14",
    pax: "4",
    image: "/images/fleet/glanza.png",
  },
  {
    slug: "innova-crysta",
    model: "Innova Crysta",
    pricePerKm: "20",
    pax: "7",
    image: "/images/fleet/innova_crysta.png",
  },
  {
    slug: "tempo-traveller",
    model: "Tempo Traveller",
    pricePerKm: "35",
    pax: "17",
    image: "/images/fleet/tempo_traveller.png",
  },
  {
    slug: "honda-amaze",
    model: "Honda Amaze",
    pricePerKm: "14",
    pax: "4",
    image: "/images/fleet/honda_amaze.png",
  },
  {
    slug: "urbania",
    model: "Urbania",
    pricePerKm: "40",
    pax: "16",
    image: "/images/fleet/urbania.png",
  },
  {
    slug: "luxury-bus",
    model: "Luxury Bus",
    pricePerKm: "60",
    pax: "40",
    image: "/images/fleet/bus.png",
  },
  {
    slug: "mini-bus",
    model: "21-Seater Mini Bus",
    pricePerKm: "45",
    pax: "21",
    image: "/images/fleet/minibus.png",
  },
];

const FleetSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[100%] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Premium Mobility</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-emerald-950 dark:text-emerald-50 tracking-tighter leading-[0.9]">
            OUR ELITE <br />
            <span className="text-gradient-emerald italic">VEHICLE FLEET</span>
          </h2>
          <p className="text-emerald-900/60 dark:text-emerald-100/60 text-base md:text-lg lg:text-xl max-w-2xl mx-auto font-medium">
            Choose from our meticulously maintained collection, each driven by elite professionals
            and equipped with first-class amenities.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-8 py-4">
              {fleet.map((car, idx) => (
                <div key={idx} className="flex-[0_0_90%] sm:flex-[0_0_45%] xl:flex-[0_0_31%] min-w-0">
                  <FleetCard {...car} index={idx} />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination (Mobile & Tablet) */}
          <div className="xl:hidden flex items-center justify-center gap-2 mt-12">
            {scrollSnaps.map((_, index) => (
              index === selectedIndex ? (
                <div key={index} className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">
                  {index + 1} / {fleet.length}
                </div>
              ) : (
                <div key={index} className="w-2 h-2 rounded-full bg-emerald-500/20" />
              )
            ))}
          </div>

          {/* Desktop Navigation (Visible >= xl) */}
          <div className="hidden xl:block">
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-2xl shadow-xl border border-emerald-500/10 flex items-center justify-center text-emerald-950 hover:bg-orange-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-14 h-14 bg-white rounded-2xl shadow-xl border border-emerald-500/10 flex items-center justify-center text-emerald-950 hover:bg-orange-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Safety Badge */}
        <div className="glass-emerald rounded-[3rem] p-8 lg:p-12 max-w-4xl mx-auto text-center space-y-4 mt-24 relative overflow-hidden border border-emerald-500/10">
          <div className="flex items-center justify-center gap-3 text-emerald-600">
            <Shield className="w-6 h-6 fill-current opacity-20" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Diamond Safety Protocol</span>
          </div>
          <p className="text-emerald-900/60 text-base lg:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Our commitment to your safety is absolute. Every vehicle undergoes rigorous
            sanitization and technical verification before every single journey.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
