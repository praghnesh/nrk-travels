"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { cn } from "@/lib/utils";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
  };
}

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const LOCAL_SUGGESTIONS = [
  { display_name: "Amadalavalasa, Srikakulam, Andhra Pradesh, India", lat: "18.4124", lon: "83.9038", address: { postcode: "532185", village: "Amadalavalasa" } },
  { display_name: "Annavaram, East Godavari, Andhra Pradesh, India", lat: "17.2798", lon: "82.4087", address: { postcode: "533406", village: "Annavaram" } },
  { display_name: "Araku Valley, Alluri Sitharama Raju, Andhra Pradesh, India", lat: "18.2677", lon: "82.8791", address: { postcode: "531149", village: "Araku Valley" } },
  { display_name: "Arasavalli, Srikakulam, Andhra Pradesh, India", lat: "18.3075", lon: "83.9168", address: { postcode: "532401", village: "Arasavalli" } },
  { display_name: "Bangalore, Karnataka, India", lat: "12.9716", lon: "77.5946", address: { postcode: "560001", city: "Bangalore" } },
  { display_name: "Bhadrachalam, Bhadradri Kothagudem, Telangana, India", lat: "17.6715", lon: "80.8931", address: { postcode: "507111", village: "Bhadrachalam" } },
  { display_name: "Bhubaneswar, Khordha, Odisha, India", lat: "20.2961", lon: "85.8245", address: { postcode: "751001", city: "Bhubaneswar" } },
  { display_name: "Bobbili, Vizianagaram, Andhra Pradesh, India", lat: "18.5667", lon: "83.3667", address: { postcode: "535558", village: "Bobbili" } },
  { display_name: "Chennai, Tamil Nadu, India", lat: "13.0827", lon: "80.2707", address: { postcode: "600001", city: "Chennai" } },
  { display_name: "Eluru, West Godavari, Andhra Pradesh, India", lat: "16.7118", lon: "81.1032", address: { postcode: "534001", city: "Eluru" } },
  { display_name: "Guntur, Andhra Pradesh, India", lat: "16.3067", lon: "80.4365", address: { postcode: "522002", city: "Guntur" } },
  { display_name: "Hyderabad, Telangana, India", lat: "17.3850", lon: "78.4867", address: { postcode: "500001", city: "Hyderabad" } },
  { display_name: "Ichchapuram, Srikakulam, Andhra Pradesh, India", lat: "19.1171", lon: "84.6931", address: { postcode: "532312", village: "Ichchapuram" } },
  { display_name: "Jagdalpur, Bastar, Chhattisgarh, India", lat: "19.0730", lon: "82.0099", address: { postcode: "494001", city: "Jagdalpur" } },
  { display_name: "Kakinada, East Godavari, Andhra Pradesh, India", lat: "16.9891", lon: "82.2439", address: { postcode: "533001", city: "Kakinada" } },
  { display_name: "Khammam, Telangana, India", lat: "17.2473", lon: "80.1514", address: { postcode: "507001", city: "Khammam" } },
  { display_name: "Kolkata, West Bengal, India", lat: "22.5726", lon: "88.3639", address: { postcode: "700001", city: "Kolkata" } },
  { display_name: "Kurnool, Andhra Pradesh, India", lat: "15.8281", lon: "78.0373", address: { postcode: "518001", city: "Kurnool" } },
  { display_name: "Lambasingi, Alluri Sitharama Raju, Andhra Pradesh, India", lat: "17.8178", lon: "82.4936", address: { postcode: "531116", village: "Lambasingi" } },
  { display_name: "Narasannapeta, Srikakulam, Andhra Pradesh, India", lat: "18.4239", lon: "84.0475", address: { postcode: "532421", village: "Narasannapeta" } },
  { display_name: "Nellore, Sri Potti Sriramulu Nellore, Andhra Pradesh, India", lat: "14.4426", lon: "79.9865", address: { postcode: "524001", city: "Nellore" } },
  { display_name: "Palakollu, West Godavari, Andhra Pradesh, India", lat: "16.5161", lon: "81.7250", address: { postcode: "534260", village: "Palakollu" } },
  { display_name: "Palakonda, Parvathipuram Manyam, Andhra Pradesh, India", lat: "18.6015", lon: "83.7547", address: { postcode: "532440", village: "Palakonda" } },
  { display_name: "Palasa, Srikakulam, Andhra Pradesh, India", lat: "18.7702", lon: "84.4172", address: { postcode: "532221", village: "Palasa" } },
  { display_name: "Parvathipuram, Parvathipuram Manyam, Andhra Pradesh, India", lat: "18.7788", lon: "83.4243", address: { postcode: "535501", city: "Parvathipuram" } },
  { display_name: "Raipur, Chhattisgarh, India", lat: "21.2514", lon: "81.6296", address: { postcode: "492001", city: "Raipur" } },
  { display_name: "Rajahmundry, East Godavari, Andhra Pradesh, India", lat: "17.0005", lon: "81.7878", address: { postcode: "533101", city: "Rajahmundry" } },
  { display_name: "Ravulapalem, Dr. B.R. Ambedkar Konaseema, Andhra Pradesh, India", lat: "16.7547", lon: "81.8492", address: { postcode: "533238", village: "Ravulapalem" } },
  { display_name: "Razam, Vizianagaram, Andhra Pradesh, India", lat: "18.4500", lon: "83.6500", address: { postcode: "532127", village: "Razam" } },
  { display_name: "Sompeta, Srikakulam, Andhra Pradesh, India", lat: "18.9328", lon: "84.5956", address: { postcode: "532440", village: "Sompeta" } },
  { display_name: "Srikakulam, Andhra Pradesh, India", lat: "18.3000", lon: "83.9000", address: { postcode: "532001", city: "Srikakulam" } },
  { display_name: "Srimukhalingam, Srikakulam, Andhra Pradesh, India", lat: "18.5958", lon: "83.9631", address: { postcode: "532428", village: "Srimukhalingam" } },
  { display_name: "Tirupati, Tirupati District, Andhra Pradesh, India", lat: "13.6288", lon: "79.4192", address: { postcode: "517501", city: "Tirupati" } },
  { display_name: "Tuni, Kakinada District, Andhra Pradesh, India", lat: "17.3533", lon: "82.5489", address: { postcode: "533401", village: "Tuni" } },
  { display_name: "Vijayawada, NTR District, Andhra Pradesh, India", lat: "16.5062", lon: "80.6480", address: { postcode: "520001", city: "Vijayawada" } },
  { display_name: "Vizianagaram, Andhra Pradesh, India", lat: "18.1167", lon: "83.4167", address: { postcode: "535001", city: "Vizianagaram" } }
];

const POPULAR_PICKUPS = [
  { display_name: "Visakhapatnam Railway Station, Andhra Pradesh, India", lat: "17.7289", lon: "83.2982", address: { postcode: "530004", village: "Railway Station" } },
  { display_name: "Visakhapatnam Airport (VTZ), Andhra Pradesh, India", lat: "17.7230", lon: "83.2246", address: { postcode: "530009", village: "Airport" } },
  { display_name: "RTC Complex, Visakhapatnam, Andhra Pradesh, India", lat: "17.7214", lon: "83.3039", address: { postcode: "530020", village: "RTC Complex" } },
  { display_name: "MVP Colony, Visakhapatnam, Andhra Pradesh, India", lat: "17.7423", lon: "83.3323", address: { postcode: "530017", village: "MVP Colony" } },
  { display_name: "Gajuwaka, Visakhapatnam, Andhra Pradesh, India", lat: "17.6896", lon: "83.2089", address: { postcode: "530026", village: "Gajuwaka" } },
  { display_name: "Madhurawada, Visakhapatnam, Andhra Pradesh, India", lat: "17.8186", lon: "83.3486", address: { postcode: "530048", village: "Madhurawada" } }
];

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter a location",
  className,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync with parent value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Update suggestions list locally as well as from Nominatim
  useEffect(() => {
    const isPickup = label.toLowerCase().includes("pickup");
    const defaultList = isPickup ? POPULAR_PICKUPS : LOCAL_SUGGESTIONS;
    const query = inputValue.trim().toLowerCase();

    if (query.length < 2) {
      setSuggestions(defaultList);
    } else {
      const localFiltered = defaultList.filter(p => p.display_name.toLowerCase().includes(query));
      setSuggestions((prev) => {
        // Retain any loaded geocoding suggestions that also match the query
        const activeGeocoded = prev.filter(p => 
          !defaultList.some(d => d.display_name === p.display_name) &&
          p.display_name.toLowerCase().includes(query)
        );
        const combined = [...localFiltered, ...activeGeocoded].filter(
          (v, i, a) => a.findIndex(t => t.display_name === v.display_name) === i
        );
        return combined;
      });
    }
  }, [inputValue, label]);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.trim().length < 2) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          countrycodes: "in",
          limit: 5,
        },
        headers: {
          "Accept-Language": "en",
          "User-Agent": "NRK-Travels-App/1.0"
        }
      });

      // Filter and format suggestions
      const formattedSuggestions = response.data.map((item: any) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        address: item.address,
      }));

      const isPickup = label.toLowerCase().includes("pickup");
      const defaultList = isPickup ? POPULAR_PICKUPS : LOCAL_SUGGESTIONS;
      const localFiltered = defaultList.filter(p => p.display_name.toLowerCase().includes(query.toLowerCase()));

      const combined = [...localFiltered, ...formattedSuggestions].filter(
        (v, i, a) => a.findIndex(t => t.display_name === v.display_name) === i
      );

      setSuggestions(combined);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    onChange(newVal);
    setShowSuggestions(true);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newVal);
    }, 350);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    const isPickup = label.toLowerCase().includes("pickup");
    const defaultList = isPickup ? POPULAR_PICKUPS : LOCAL_SUGGESTIONS;
    const query = inputValue.trim().toLowerCase();
    
    if (query.length < 2) {
      setSuggestions(defaultList);
    } else {
      const localFiltered = defaultList.filter(p => p.display_name.toLowerCase().includes(query));
      setSuggestions(localFiltered);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const addr = suggestion.address;
    const name = addr?.suburb || addr?.town || addr?.village || addr?.city || "";
    const city = addr?.city || addr?.state || "";
    const formattedName = name && city && name !== city ? `${name}, ${city}` : suggestion.display_name.split(",").slice(0, 2).join(",");

    setInputValue(formattedName);
    onChange(formattedName);
    setShowSuggestions(false);
  };

  const clearInput = () => {
    setInputValue("");
    onChange("");
    const isPickup = label.toLowerCase().includes("pickup");
    setSuggestions(isPickup ? POPULAR_PICKUPS : LOCAL_SUGGESTIONS);
    setShowSuggestions(true);
  };

  return (
    <div className={cn("space-y-3 relative w-full", className)} ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">
        {label}
      </label>
      <div className="relative group w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-14 lg:h-16 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all font-bold disabled:bg-slate-100 disabled:cursor-not-allowed"
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
          {inputValue && (
            <button
              onClick={clearInput}
              className="p-1 hover:bg-emerald-500/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-emerald-500/50" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[100] left-0 right-0 mt-2 bg-white dark:bg-emerald-950 border border-emerald-500/10 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto no-scrollbar"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full px-4 py-4 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-start gap-3 border-b border-emerald-500/5 last:border-0"
              >
                <MapPin className="w-4 h-4 mt-1 text-emerald-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-emerald-950 dark:text-emerald-50 line-clamp-1">
                    {suggestion.display_name.split(",")[0]}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-900/70 dark:text-emerald-100/70 line-clamp-1 uppercase tracking-wider">
                    {[
                      suggestion.address?.suburb,
                      suggestion.address?.city || suggestion.address?.town,
                      suggestion.address?.state,
                      suggestion.address?.postcode
                    ].filter(Boolean).slice(1).join(", ")}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationInput;
