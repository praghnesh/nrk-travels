"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TourCard from "./TourCard";
import { TOURS_DATA } from "@/lib/tours";

const tours = [
  {
    slug: "vizag-araku-3d",
    title: "3 Days Vizag & Araku Valley Tour",
    price: "12,000",
    duration: "3D / 2N",
    image: "/images/tours/vizag_araku.png",
    tags: ["Scenic Views", "Local Guide"],
  },
  {
    slug: "araku-valley",
    title: "Araku Valley Tour",
    price: "5,000",
    duration: "13 Hours",
    image: "/images/tours/araku_caves.png",
    tags: ["Scenic Views", "Local Guide"],
  },
  {
    slug: "arasavalli-temple",
    title: "Arasavalli & Srikurmam Temple Tour",
    price: "4,500",
    duration: "12 Hours",
    image: "/images/tours/arasavalli.png",
    tags: ["Scenic Views", "Local Guide"],
  },
  {
    slug: "lambasingi",
    title: "Lambasingi Tour",
    price: "5,000",
    duration: "13 Hours",
    image: "/images/tours/lambasingi.png",
    tags: ["Scenic Views", "Local Guide"],
  },
  {
    slug: "vanajangi",
    title: "Vanajangi Tour",
    price: "5,000",
    duration: "13 Hours",
    image: "/images/tours/vanajangi.png",
    tags: ["Sunrise View", "Local Guide"],
  },
  {
    slug: "vizag-city-tour",
    title: "Vizag Full City Tour",
    price: "3,000",
    duration: "10-12 Hours",
    image: "/images/tours/vizag_north.png",
    tags: ["City Sights", "Local Guide"],
  },
];

const TourCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
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
    <div className="relative group px-4 lg:px-0">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 py-4">
          {tours.map((tour, idx) => {
            const dynamicTour = TOURS_DATA[tour.slug];
            const displayPrice = dynamicTour ? dynamicTour.basePrice : tour.price;
            return (
              <div
                key={idx}
                className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_31%] xl:flex-[0_0_23%] min-w-0"
              >
                <TourCard {...tour} price={displayPrice} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Tablet Pagination Indicator */}
      <div className="flex xl:hidden items-center justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          index === selectedIndex ? (
            <div
              key={index}
              className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-orange-500/30"
            >
              {index + 1}/{tours.length}
            </div>
          ) : (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-emerald-500/20 transition-all"
            />
          )
        ))}
      </div>

      {/* Navigation Buttons (Desktop Only) */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-emerald-500/10 flex items-center justify-center text-slate-900 hover:bg-emerald-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden xl:flex hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-14 h-14 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-emerald-500/10 flex items-center justify-center text-slate-900 hover:bg-emerald-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden xl:flex hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default TourCarousel;
