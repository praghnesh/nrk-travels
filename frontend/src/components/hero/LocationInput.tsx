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
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 1) {
      setSuggestions([]);
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
      });

      // Filter and format suggestions
      const formattedSuggestions = response.data.map((item: any) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        address: item.address,
      }));

      setSuggestions(formattedSuggestions);
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

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newVal);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    // Format the display name to be shorter if possible (e.g., just Area, City)
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
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={cn("space-y-3 relative", className)} ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
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
            className="absolute z-[100] left-0 right-0 mt-2 bg-white dark:bg-emerald-950 border border-emerald-500/10 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar"
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
