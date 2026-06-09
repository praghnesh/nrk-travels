"use client";

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Search,
  Info,
  Phone,
  MessageCircle,
  Zap,
  Briefcase,
  Camera,
  Star,
  Check,
  ChevronDown,
  Edit2,
  Settings,
  Fuel,
  Map
} from "lucide-react";
import { FLEET_DATA } from "@/lib/fleet";
import { DESTINATIONS } from "@/lib/destinations";
import DestinationsSection from "@/components/tours/DestinationsSection";
import { cn } from "@/lib/utils";
import { getFormattedVehicleTermsList, getVehicleTerms } from "@/lib/rates";
import { createBooking, createPaymentOrder, verifyPayment, loadRazorpay } from "@/lib/api";

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

const getFallbackCoordinates = (placeName: string) => {
  if (!placeName) return null;
  const cleanName = placeName.toLowerCase();

  // Hardcoded additional popular destinations just in case
  const extraFallbacks: Record<string, { lat: number; lon: number; name: string }> = {
    "bangalore": { lat: 12.9716, lon: 77.5946, name: "Bangalore, Karnataka, India" },
    "bengaluru": { lat: 12.9716, lon: 77.5946, name: "Bangalore, Karnataka, India" },
    "hyderabad": { lat: 17.3850, lon: 78.4867, name: "Hyderabad, Telangana, India" },
    "chennai": { lat: 13.0827, lon: 80.2707, name: "Chennai, Tamil Nadu, India" },
    "vijayawada": { lat: 16.5062, lon: 80.6480, name: "Vijayawada, NTR District, Andhra Pradesh, India" },
    "tirupati": { lat: 13.6288, lon: 79.4192, name: "Tirupati, Tirupati District, Andhra Pradesh, India" },
    "arasavalli": { lat: 18.3075, lon: 83.9168, name: "Arasavalli, Srikakulam, Andhra Pradesh, India" },
    "araku": { lat: 18.2677, lon: 82.8791, name: "Araku Valley, Alluri Sitharama Raju, Andhra Pradesh, India" },
    "annavaram": { lat: 17.2798, lon: 82.4087, name: "Annavaram, East Godavari, Andhra Pradesh, India" },
    "bobbili": { lat: 18.5667, lon: 83.3667, name: "Bobbili, Vizianagaram, Andhra Pradesh, India" },
    "srikakulam": { lat: 18.3000, lon: 83.9000, name: "Srikakulam, Andhra Pradesh, India" },
    "vizianagaram": { lat: 18.1167, lon: 83.4167, name: "Vizianagaram, Andhra Pradesh, India" },
    "rajahmundry": { lat: 17.0005, lon: 81.7878, name: "Rajahmundry, East Godavari, Andhra Pradesh, India" },
    "kakinada": { lat: 16.9891, lon: 82.2439, name: "Kakinada, East Godavari, Andhra Pradesh, India" },
    "vizag": { lat: 17.6868, lon: 83.2185, name: "Visakhapatnam, Andhra Pradesh, India" },
    "visakhapatnam": { lat: 17.6868, lon: 83.2185, name: "Visakhapatnam, Andhra Pradesh, India" },
  };

  // 1. Check if the whole string contains any key
  for (const [key, val] of Object.entries(extraFallbacks)) {
    if (cleanName.includes(key)) {
      return val;
    }
  }

  // 2. Check if the string matches any LOCAL_SUGGESTIONS display name
  const query = cleanName.replace(/[^a-z0-9]/g, "");
  for (const s of LOCAL_SUGGESTIONS) {
    const dispName = s.display_name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (dispName.includes(query) || query.includes(dispName)) {
      return {
        lat: parseFloat(s.lat),
        lon: parseFloat(s.lon),
        name: s.display_name
      };
    }
    // Check if any word of s.display_name is inside the cleanName
    const words = s.display_name.toLowerCase().split(/[^a-z0-9]/);
    for (const word of words) {
      if (word && word.length > 3 && cleanName.includes(word)) {
        return {
          lat: parseFloat(s.lat),
          lon: parseFloat(s.lon),
          name: s.display_name
        };
      }
    }
  }

  // 3. Try matching in POPULAR_PICKUPS
  for (const p of POPULAR_PICKUPS) {
    const dispName = p.display_name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (dispName.includes(query) || query.includes(dispName)) {
      return {
        lat: parseFloat(p.lat),
        lon: parseFloat(p.lon),
        name: p.display_name
      };
    }
  }

  return null;
};

const BookingPageContent = () => {
  const params = useParams();
  const router = useRouter();
  const toSlug = params.to as string;
  const searchParams = useSearchParams();
  const fleetParam = searchParams.get("fleet");
  const isTempoMode = fleetParam === "tempo";

  const normalizedToSlug = useMemo(() => {
    if (!toSlug) return "";
    const decoded = decodeURIComponent(toSlug);
    const firstPart = decoded.split(",")[0].toLowerCase().trim();
    const clean = firstPart.replace(/[^a-z0-9]+/g, "-");
    if (clean === "bengaluru") return "bangalore";
    return clean;
  }, [toSlug]);

  const destination = useMemo(() => {
    if (DESTINATIONS[normalizedToSlug]) return DESTINATIONS[normalizedToSlug];

    const isAirport = normalizedToSlug === "vizag-airport-transfer" || normalizedToSlug.includes("airport");
    const name = isAirport ? "Vizag Airport Transfer" : normalizedToSlug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return {
      name: name,
      distanceKm: isAirport ? 35 : 250, // Realistic city distance
      duration: isAirport ? "1 hour" : "5 hours",
      type: "outstation" as const,
      description: isAirport ? "Premium Airport Transfer Service. Smooth, reliable, and comfortable rides directly to or from Visakhapatnam International Airport." : `Premium travel service to ${name}. Experience a safe and comfortable journey with NRK Travels.`,
      highlights: ["Experienced Drivers", "Well Maintained Fleet", "24/7 Support", "Transparent Pricing"],
      itinerary: [
        { day: "1", title: "Departure", activities: [`Pickup from Visakhapatnam`, `Travel to ${name}`, `Safe Drop-off at destination`] }
      ],
      images: ["https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800"]
    };
  }, [normalizedToSlug]);

  const isAirportMode = normalizedToSlug === "vizag-airport-transfer" || normalizedToSlug.includes("airport");
  const [tripType, setTripType] = useState<"one-way" | "round-trip">(() => {
    return isTempoMode ? "round-trip" : "one-way";
  });
  const [airportTrip, setAirportTrip] = useState<"from-airport" | "to-airport">("from-airport");
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingStep, setBookingStep] = useState<"selection" | "forms" | "payment">("selection");
  const [passengerCount, setPassengerCount] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "policy">("overview");
  const [paymentOption, setPaymentOption] = useState<"part" | "full">("part");
  const [hasGST, setHasGST] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");

  // Passenger state hooks
  const [passengerName, setPassengerName] = useState("");
  const [passengerAge, setPassengerAge] = useState("");
  const [passengerGender, setPassengerGender] = useState("Male");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // India Location Search States
  const [fromSearch, setFromSearch] = useState("Visakhapatnam, Andhra Pradesh, India");
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState({
    name: "Visakhapatnam, Andhra Pradesh, India",
    lat: 17.6868,
    lon: 83.2185
  });

  const [toSearch, setToSearch] = useState(() => {
    const decoded = decodeURIComponent(toSlug || "");
    const firstPart = decoded.split(",")[0].toLowerCase().trim();
    const clean = firstPart.replace(/[^a-z0-9]+/g, "-");
    const slug = clean === "bengaluru" ? "bangalore" : clean;
    const dest = DESTINATIONS[slug] || { name: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") };
    const fallback = getFallbackCoordinates(dest.name);
    return fallback ? fallback.name : dest.name;
  });
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [selectedTo, setSelectedTo] = useState(() => {
    const decoded = decodeURIComponent(toSlug || "");
    const firstPart = decoded.split(",")[0].toLowerCase().trim();
    const clean = firstPart.replace(/[^a-z0-9]+/g, "-");
    const slug = clean === "bengaluru" ? "bangalore" : clean;
    const dest = DESTINATIONS[slug] || { name: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") };
    const fallback = getFallbackCoordinates(dest.name);
    return {
      name: fallback ? fallback.name : dest.name,
      lat: fallback ? fallback.lat : 17.6868,
      lon: fallback ? fallback.lon : 83.2185
    };
  });

  const [calculatedDistance, setCalculatedDistance] = useState<number>(destination.distanceKm);
  const [calculatedDuration, setCalculatedDuration] = useState<string>(destination.duration);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [mapMode, setMapMode] = useState<"map" | "satellite">("map");

  const mapRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Initialize dates on client-side only to avoid hydration mismatch
    const now = new Date();
    const future = new Date(now.getTime() + 48 * 60 * 60 * 1000); // +2 days
    setPickupDate(now.toISOString().slice(0, 16));
    setReturnDate(future.toISOString().slice(0, 16));
  }, []);

  const [isEditingDates, setIsEditingDates] = useState(false);

  // Auto-complete Geocoding suggestions fetching
  const fetchSuggestions = async (query: string, onResults: (results: any[]) => void) => {
    if (query.trim().length < 3) {
      onResults([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=5`, {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "NRK-Travels-App/1.0"
        }
      });
      if (res.ok) {
        const data = await res.json();
        onResults(data || []);
      } else {
        onResults([]);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      onResults([]);
    }
  };

  useEffect(() => {
    const query = fromSearch.trim();
    if (query.length < 3) {
      setFromSuggestions(POPULAR_PICKUPS);
    } else {
      const delay = setTimeout(() => {
        fetchSuggestions(fromSearch, (results) => {
          const q = fromSearch.toLowerCase();
          const localFiltered = POPULAR_PICKUPS.filter(p => p.display_name.toLowerCase().includes(q));
          const combined = [...localFiltered, ...results].filter(
            (v, i, a) => a.findIndex(t => t.display_name === v.display_name) === i
          );
          setFromSuggestions(combined);
        });
      }, 400);
      return () => clearTimeout(delay);
    }
  }, [fromSearch]);

  useEffect(() => {
    const query = toSearch.trim();
    if (query.length < 3) {
      setToSuggestions(LOCAL_SUGGESTIONS);
    } else {
      const delay = setTimeout(() => {
        fetchSuggestions(toSearch, (results) => {
          const q = toSearch.toLowerCase();
          const localFiltered = LOCAL_SUGGESTIONS.filter(p => p.display_name.toLowerCase().includes(q));
          const combined = [...localFiltered, ...results].filter(
            (v, i, a) => a.findIndex(t => t.display_name === v.display_name) === i
          );
          setToSuggestions(combined);
        });
      }, 400);
      return () => clearTimeout(delay);
    }
  }, [toSearch]);

  // Parse Airport Transfer or Outstation query parameters on mount
  useEffect(() => {
    const pickupParam = searchParams.get("pickup");
    const dropParam = searchParams.get("drop");
    const directionParam = searchParams.get("direction");
    const dateParam = searchParams.get("date");

    if (isAirportMode) {
      if (directionParam === "to-airport" || directionParam === "from-airport") {
        setAirportTrip(directionParam as any);
      }

      if (pickupParam) {
        const actualPickup = decodeURIComponent(pickupParam);
        setFromSearch(actualPickup);
        setSelectedFrom(prev => ({
          ...prev,
          name: actualPickup,
          lat: actualPickup.includes("Airport") ? 17.7244 : prev.lat,
          lon: actualPickup.includes("Airport") ? 83.2245 : prev.lon
        }));
      }

      if (dropParam) {
        const actualDrop = decodeURIComponent(dropParam);
        setToSearch(actualDrop);
        setSelectedTo(prev => ({
          ...prev,
          name: actualDrop,
          lat: actualDrop.includes("Airport") ? 17.7244 : prev.lat,
          lon: actualDrop.includes("Airport") ? 83.2245 : prev.lon
        }));
      }
    } else {
      // Outstation Mode Parameter Parsing
      if (pickupParam) {
        const actualPickup = decodeURIComponent(pickupParam);
        setFromSearch(actualPickup);
        const fallback = getFallbackCoordinates(actualPickup);
        if (fallback) {
          setSelectedFrom({
            name: fallback.name,
            lat: fallback.lat,
            lon: fallback.lon
          });
        }
      }

      if (dropParam) {
        const actualDrop = decodeURIComponent(dropParam);
        setToSearch(actualDrop);
        const fallback = getFallbackCoordinates(actualDrop);
        if (fallback) {
          setSelectedTo({
            name: fallback.name,
            lat: fallback.lat,
            lon: fallback.lon
          });
        }
      }
    }

    if (dateParam) {
      try {
        const d = new Date(dateParam);
        if (!isNaN(d.getTime())) {
          setPickupDate(d.toISOString().slice(0, 16));
        }
      } catch (e) {
        console.error("Date parsing error:", e);
      }
    }
  }, [searchParams, isAirportMode]);

  // Default select the first vehicle on mount so that the sidebar shows the price immediately
  useEffect(() => {
    const defaultVeh = isTempoMode
      ? Object.values(FLEET_DATA).find(v => v.slug === "tempo-traveller") || Object.values(FLEET_DATA)[0]
      : Object.values(FLEET_DATA)[0];
    if (defaultVeh && !selectedVehicle) {
      setSelectedVehicle(defaultVeh);
    }
  }, [isTempoMode, selectedVehicle]);

  // Keep selection state as is and do not force round-trip for tempo travellers

  // Geocode airport transfer custom location on mount/change
  useEffect(() => {
    if (!isAirportMode) return;

    const geocodeAirportLocation = async () => {
      const isFrom = airportTrip === "from-airport";
      const targetQuery = isFrom ? toSearch : fromSearch;

      if (!targetQuery || targetQuery === "Visakhapatnam International Airport" || targetQuery.includes("Airport")) return;

      setIsLoadingRoute(true);

      // Try local fallback first
      const fallback = getFallbackCoordinates(targetQuery);
      if (fallback) {
        if (isFrom) {
          setSelectedTo({
            name: fallback.name,
            lat: fallback.lat,
            lon: fallback.lon
          });
          setSelectedFrom({
            name: "Visakhapatnam International Airport",
            lat: 17.7244,
            lon: 83.2245
          });
        } else {
          setSelectedFrom({
            name: fallback.name,
            lat: fallback.lat,
            lon: fallback.lon
          });
          setSelectedTo({
            name: "Visakhapatnam International Airport",
            lat: 17.7244,
            lon: 83.2245
          });
        }
      }

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(targetQuery + ", Visakhapatnam")}&countrycodes=in&limit=1`, {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "NRK-Travels-App/1.0"
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            if (isFrom) {
              setSelectedTo({
                name: data[0].display_name,
                lat: coords.lat,
                lon: coords.lon
              });
              setSelectedFrom({
                name: "Visakhapatnam International Airport",
                lat: 17.7244,
                lon: 83.2245
              });
            } else {
              setSelectedFrom({
                name: data[0].display_name,
                lat: coords.lat,
                lon: coords.lon
              });
              setSelectedTo({
                name: "Visakhapatnam International Airport",
                lat: 17.7244,
                lon: 83.2245
              });
            }
          }
        }
      } catch (err) {
        console.error("Airport geocoding error:", err);
      } finally {
        setIsLoadingRoute(false);
      }
    };

    geocodeAirportLocation();
  }, [isAirportMode, airportTrip, fromSearch, toSearch]);

  // Geocode initial drop destination on mount
  useEffect(() => {
    if (isAirportMode) return;
    const geocodeInitialDestination = async () => {
      setIsLoadingRoute(true);

      // Try local fallback first
      const fallback = getFallbackCoordinates(destination.name);
      if (fallback) {
        setSelectedTo({
          name: fallback.name,
          lat: fallback.lat,
          lon: fallback.lon
        });
        setToSearch(fallback.name);
        setIsLoadingRoute(false);
        return;
      }

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination.name + ", India")}&countrycodes=in&limit=1`, {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "NRK-Travels-App/1.0"
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const dropPlace = {
              name: data[0].display_name,
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon)
            };
            setSelectedTo(dropPlace);
            setToSearch(data[0].display_name);
          }
        }
      } catch (err) {
        console.error("Initial geocoding error:", err);
      } finally {
        setIsLoadingRoute(false);
      }
    };
    geocodeInitialDestination();
  }, [destination.name]);

  // Calculate dynamic driving route using OSRM
  useEffect(() => {
    const getRoute = async () => {
      if (!selectedFrom.lat || !selectedTo.lat) return;

      setIsLoadingRoute(true);
      setRouteError("");
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${selectedFrom.lon},${selectedFrom.lat};${selectedTo.lon},${selectedTo.lat}?overview=full&geometries=geojson`);
        if (!res.ok) throw new Error("OSRM Routing failed");
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distanceKm = Math.round(route.distance / 1000);
          setCalculatedDistance(distanceKm || 1);

          // Format duration
          const durationSec = route.duration;
          const hours = Math.floor(durationSec / 3600);
          const minutes = Math.round((durationSec % 3600) / 60);
          let durStr = "";
          if (hours > 0) durStr += `${hours}h `;
          durStr += `${minutes}m`;
          setCalculatedDuration(durStr || "10m");

          // Get coordinates for Leaflet
          const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
          setRouteCoordinates(coords);
        } else {
          throw new Error("No route found");
        }
      } catch (err) {
        console.error("Routing error:", err);
        setRouteError("Could not calculate route. Using straight line distance.");
        // Fallback distance calculation using Haversine formula
        const R = 6371; // km
        const dLat = (selectedTo.lat - selectedFrom.lat) * Math.PI / 180;
        const dLon = (selectedTo.lon - selectedFrom.lon) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(selectedFrom.lat * Math.PI / 180) * Math.cos(selectedTo.lat * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = Math.round(R * c);
        setCalculatedDistance(dist || destination.distanceKm);
        setCalculatedDuration("Calculated");
        setRouteCoordinates([[selectedFrom.lat, selectedFrom.lon], [selectedTo.lat, selectedTo.lon]]);
      } finally {
        setIsLoadingRoute(false);
      }
    };
    getRoute();
  }, [selectedFrom.lat, selectedFrom.lon, selectedTo.lat, selectedTo.lon]);

  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const handleMapMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "MAP_READY") {
        setIsMapReady(true);
      }
    };
    window.addEventListener("message", handleMapMessage);
    return () => window.removeEventListener("message", handleMapMessage);
  }, []);

  // Leaflet map code inside an iframe
  const mapSrcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
        <style>
          body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #f8fafc; }
          .leaflet-container { font-family: inherit; }
          .custom-popup .leaflet-popup-content-wrapper {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            padding: 4px;
            font-size: 11px;
            font-weight: 700;
          }
          .custom-popup .leaflet-popup-tip { background: #ffffff; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: false }).setView([17.6868, 83.2185], 11);
          L.control.zoom({ position: 'bottomright' }).addTo(map);

          var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri'
          });

          // Post map ready message to parent window
          window.parent.postMessage({ type: 'MAP_READY' }, '*');

          window.addEventListener('message', function(event) {
            if (event.data.type === 'UPDATE_ROUTE') {
              var route = event.data;
              
              // Clear existing markers/polylines
              map.eachLayer(function(layer) {
                if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                  map.removeLayer(layer);
                }
              });

              if (route.from && route.to) {
                var fromMarker = L.marker([route.from.lat, route.from.lon]).addTo(map)
                  .bindPopup('<b>Pickup:</b><br>' + route.from.name, { className: 'custom-popup' });
                
                var toMarker = L.marker([route.to.lat, route.to.lon]).addTo(map)
                  .bindPopup('<b>Dropoff:</b><br>' + route.to.name, { className: 'custom-popup' });

                if (route.coordinates && route.coordinates.length > 0) {
                  var polyline = L.polyline(route.coordinates, {
                    color: '#10b981', // emerald-500
                    weight: 5,
                    opacity: 0.8,
                    lineJoin: 'round'
                  }).addTo(map);
                  
                  map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
                } else {
                  var bounds = L.latLngBounds([
                    [route.from.lat, route.from.lon],
                    [route.to.lat, route.to.lon]
                  ]);
                  map.fitBounds(bounds, { padding: [50, 50] });
                }
              }
            } else if (event.data.type === 'SET_TILE') {
              if (event.data.mode === 'satellite') {
                map.removeLayer(streets);
                satellite.addTo(map);
              } else {
                map.removeLayer(satellite);
                streets.addTo(map);
              }
            }
          });
        </script>
      </body>
      </html>
    `;
  }, []);

  // Post message to map iframe when coordinates, map mode, or map readiness changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.contentWindow && selectedFrom.lat && selectedTo.lat) {
      const timer = setTimeout(() => {
        mapRef.current?.contentWindow?.postMessage({
          type: "UPDATE_ROUTE",
          from: selectedFrom,
          to: selectedTo,
          coordinates: routeCoordinates
        }, "*");

        mapRef.current?.contentWindow?.postMessage({
          type: "SET_TILE",
          mode: mapMode
        }, "*");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedFrom, selectedTo, routeCoordinates, mapMode, isMapReady]);

  // If destination not found, fallback
  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black">Destination Not Found</h1>
          <Link href="/" className="text-emerald-600 font-bold underline">Go Back</Link>
        </div>
      </div>
    );
  }

  // Simplified and corrected fare calculation based on requirements including Driver Bhatta
  const calculateFare = (pricePerKm: number, slug: string, modelName?: string, pax?: string | number) => {
    const distance = calculatedDistance || destination.distanceKm;
    const multiplier = (tripType === "round-trip") ? 2 : 1;
    const totalKm = distance * multiplier;
    const chargeKm = distance * multiplier;

    // Calculate number of days (default to 1 day for one-way, and based on pickup/return difference for round trip)
    let calculatedDays = 1;
    if (tripType === "round-trip" && pickupDate && returnDate) {
      const dep = new Date(pickupDate);
      const ret = new Date(returnDate);
      const diffMs = ret.getTime() - dep.getTime();
      const diffDays = Math.ceil(diffMs / 86400000);
      calculatedDays = Math.max(diffDays, 1);
    }

    // Resolve vehicle terms for Bhatta
    const terms = getVehicleTerms(slug, modelName, pax);
    const bhatta = terms.driverBhatta * calculatedDays;

    const basePrice = Math.ceil(chargeKm * pricePerKm);
    const total = basePrice + bhatta;

    return {
      total: total,
      totalKm: totalKm,
      chargeKm: chargeKm,
      bhatta: bhatta,
      base: basePrice,
      days: calculatedDays
    };
  };

  const totalAmount = useMemo(() => {
    if (!selectedVehicle) return 0;
    return calculateFare(Number(selectedVehicle.pricePerKm), selectedVehicle.slug, selectedVehicle.model, selectedVehicle.pax).total;
  }, [selectedVehicle, calculatedDistance, tripType, pickupDate, returnDate]);

  const partPayAmount = Math.ceil(totalAmount * 0.3);

  const handleBookNow = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setPassengerCount(1);
    setBookingStep("forms");
    setTimeout(() => {
      const formElement = document.getElementById("booking-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 600);
  };

  const maxPassengers = selectedVehicle ? parseInt(selectedVehicle.pax, 10) || 1 : 1;

  const initiatePayment = async () => {
    if (!passengerName.trim() || !passengerPhone.trim() || !passengerEmail.trim()) {
      setErrorMessage("Please fill out lead guest name, phone, and email details before paying.");
      return;
    }
    if (!termsAccepted) {
      setErrorMessage("Please accept the Terms & Conditions of booking.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please verify your connection.");
      }

      const amountToPay = paymentOption === "part" ? partPayAmount : totalAmount;

      const bookingRes = await createBooking({
        customer_name: passengerName,
        customer_email: passengerEmail,
        customer_phone: passengerPhone,
        booking_type: "vehicle",
        total_amount: amountToPay, // Keep for backward compat
        actual_total_amount: totalAmount,
        amount_paid: amountToPay,
        payment_percentage: paymentOption === "part" ? 30 : 100,
        special_requests: `From: ${fromSearch}. To: ${toSearch}. Type: ${tripType}. Vehicle: ${selectedVehicle?.model}. Mode: Outstation. Pickup: ${pickupDate}. Return: ${returnDate || 'N/A'}. Passengers: ${passengerCount}. Age: ${passengerAge}. Gender: ${passengerGender}. Option: ${paymentOption === "part" ? "Part (30%)" : "Full"}`,
        fleet_id: selectedVehicle?.model || "Standard Vehicle",
        travel_date: pickupDate ? pickupDate.split("T")[0] : new Date().toISOString().split("T")[0]
      });

      console.log("DEBUG bookingRes:", bookingRes);
      if (!bookingRes.success || !bookingRes.data?.id) {
        throw new Error("Failed to register booking in database. bookingRes: " + JSON.stringify(bookingRes));
      }

      const bookingId = bookingRes.data.id;
      const orderRes = await createPaymentOrder(bookingId);
      if (!orderRes.success || !orderRes.data?.id) {
        throw new Error("Failed to create Razorpay transaction order.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "NRK Travels",
        description: `Vehicle Rental: ${selectedVehicle?.model}`,
        order_id: orderRes.data.id,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setBookingSuccess(true);
          } catch (err: any) {
            setErrorMessage(err.message || "Payment verification failed.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: passengerName,
          email: passengerEmail,
          contact: passengerPhone,
        },
        config: {
          display: {
            blocks: {
              paytm: {
                name: "Pay via Paytm",
                instruments: [{ method: "wallet", wallet: "paytm" }]
              },
              upi: {
                name: "Pay via UPI",
                instruments: [{ method: "upi" }]
              }
            },
            sequence: ["block.paytm", "block.upi"],
            preferences: { show_default_blocks: true }
          }
        },
        theme: {
          color: "#059669"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setErrorMessage("Payment transaction failed: " + response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Booking secure payment flow error:", err);
      setErrorMessage(err.message || "An error occurred during booking creation.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------------------------------------------------------
  // RENDER AIRPORT LAYOUT HEADER FORM
  // ---------------------------------------------------------
  const renderAirportBookingBar = () => {
    return (
      <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-xl relative z-30 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          {/* Pickup Location */}
          <div className="lg:col-span-3 space-y-3 relative">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Pickup Location</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter area, city or pincode"
                value={fromSearch}
                onFocus={() => setShowFromSuggestions(true)}
                onChange={(e) => {
                  setFromSearch(e.target.value);
                  setShowFromSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 250)}
                disabled={airportTrip === "from-airport"}
                className={cn(
                  "w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-10 text-sm font-black focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900",
                  airportTrip === "from-airport" && "opacity-75 cursor-not-allowed bg-slate-100"
                )}
              />
              {fromSearch && airportTrip !== "from-airport" && (
                <button
                  type="button"
                  onClick={() => {
                    setFromSearch("");
                    setSelectedFrom({ name: "", lat: 0, lon: 0 });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-rose-500 flex items-center justify-center font-bold text-lg"
                >
                  ×
                </button>
              )}

              <AnimatePresence>
                {showFromSuggestions && fromSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[110] max-h-60 overflow-y-auto no-scrollbar"
                  >
                    {fromSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedFrom({
                            name: s.display_name,
                            lat: parseFloat(s.lat),
                            lon: parseFloat(s.lon)
                          });
                          setFromSearch(s.display_name);
                          setShowFromSuggestions(false);
                        }}
                        className="w-full px-6 py-4 text-left hover:bg-emerald-50 flex items-center justify-between group/item border-b border-slate-50 last:border-b-0 text-slate-800"
                      >
                        <div className="flex flex-col flex-1 pr-4 min-w-0">
                          <span className="text-xs font-bold truncate">{s.display_name}</span>
                          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">
                            {s.address?.postcode ? `PIN: ${s.address.postcode} | ` : ''}
                            {s.address?.village || s.address?.suburb || s.address?.city || s.address?.state || 'Location'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-emerald-500 shrink-0" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Drop Location */}
          <div className="lg:col-span-3 space-y-3 relative">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Drop Location</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter area, city or pincode"
                value={toSearch}
                onFocus={() => setShowToSuggestions(true)}
                onChange={(e) => {
                  setToSearch(e.target.value);
                  setShowToSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 250)}
                disabled={airportTrip === "to-airport"}
                className={cn(
                  "w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-10 text-sm font-black focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900",
                  airportTrip === "to-airport" && "opacity-75 cursor-not-allowed bg-slate-100"
                )}
              />
              {toSearch && airportTrip !== "to-airport" && (
                <button
                  type="button"
                  onClick={() => {
                    setToSearch("");
                    setSelectedTo({ name: "", lat: 0, lon: 0 });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-rose-500 flex items-center justify-center font-bold text-lg"
                >
                  ×
                </button>
              )}

              <AnimatePresence>
                {showToSuggestions && toSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[110] max-h-60 overflow-y-auto no-scrollbar"
                  >
                    {toSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedTo({
                            name: s.display_name,
                            lat: parseFloat(s.lat),
                            lon: parseFloat(s.lon)
                          });
                          setToSearch(s.display_name);
                          setShowToSuggestions(false);
                        }}
                        className="w-full px-6 py-4 text-left hover:bg-emerald-50 flex items-center justify-between group/item border-b border-slate-50 last:border-b-0 text-slate-800"
                      >
                        <div className="flex flex-col flex-1 pr-4 min-w-0">
                          <span className="text-xs font-bold truncate">{s.display_name}</span>
                          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">
                            {s.address?.postcode ? `PIN: ${s.address.postcode} | ` : ''}
                            {s.address?.village || s.address?.suburb || s.address?.city || s.address?.state || 'Location'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-emerald-500 shrink-0" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Trip Direction */}
          <div className="lg:col-span-3 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Trip Direction</label>
            <div className="flex bg-slate-50 border border-slate-250 p-1 rounded-2xl w-full relative h-16 items-center">
              <div
                className={cn(
                  "absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-gradient-orange rounded-xl shadow-lg z-0 transition-all duration-300",
                  airportTrip === "to-airport" ? "translate-x-full" : "translate-x-0"
                )}
              />
              <button
                type="button"
                onClick={() => {
                  setAirportTrip("from-airport");
                  setFromSearch("Visakhapatnam International Airport");
                  setSelectedFrom({ name: "Visakhapatnam International Airport", lat: 17.7244, lon: 83.2245 });
                  setToSearch("");
                  setSelectedTo({ name: "", lat: 0, lon: 0 });
                }}
                className={cn(
                  "flex-1 text-[10px] font-black uppercase tracking-widest z-10 transition-colors duration-300 text-center h-full flex items-center justify-center",
                  airportTrip === "from-airport" ? "text-white font-extrabold" : "text-slate-400 font-bold hover:text-slate-600"
                )}
              >
                From Airport
              </button>
              <button
                type="button"
                onClick={() => {
                  setAirportTrip("to-airport");
                  setToSearch("Visakhapatnam International Airport");
                  setSelectedTo({ name: "Visakhapatnam International Airport", lat: 17.7244, lon: 83.2245 });
                  setFromSearch("");
                  setSelectedFrom({ name: "", lat: 0, lon: 0 });
                }}
                className={cn(
                  "flex-1 text-[10px] font-black uppercase tracking-widest z-10 transition-colors duration-300 text-center h-full flex items-center justify-center",
                  airportTrip === "to-airport" ? "text-white font-extrabold" : "text-slate-400 font-bold hover:text-slate-600"
                )}
              >
                To Airport
              </button>
            </div>
          </div>

          {/* Departure Date */}
          <div className="lg:col-span-3 space-y-3 relative">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Departure</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 pointer-events-none" />
              <input
                type="datetime-local"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-black focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------
  // RENDER TOUR LAYOUT (Gallery + Tabs)
  // ---------------------------------------------------------
  const renderTripHeader = () => (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 mb-8 group/header">
      <div className="flex items-center justify-between gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px] sm:max-w-[200px]">
            {selectedFrom.name.split(",")[0]}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px] sm:max-w-[200px]">
            {selectedTo.name.split(",")[0]}
          </span>
        </div>

        <button
          onClick={() => setIsEditingDates(!isEditingDates)}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0 md:hidden",
            isEditingDates ? "bg-emerald-600 text-white rotate-90" : "bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
          )}
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        <div className="hidden md:block h-8 w-px bg-slate-100 shrink-0" />

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:flex md:items-center md:gap-8">
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pickup Date</span>
            <span className="text-[10px] md:text-xs font-black text-slate-800 uppercase mt-0.5 truncate">
              {pickupDate ? new Date(pickupDate).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Select Date'}
            </span>
          </div>
          {tripType === "round-trip" ? (
            <div className="flex flex-col border-l border-slate-100 pl-4 md:pl-8 min-w-0">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Return Date</span>
              <span className="text-[10px] md:text-xs font-black text-slate-800 uppercase mt-0.5 truncate">
                {returnDate ? new Date(returnDate).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Select Date'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col border-l border-slate-100 pl-4 md:pl-8">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Trip Mode</span>
              <span className="text-[10px] md:text-xs font-black text-emerald-600 uppercase mt-0.5">One Way</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsEditingDates(!isEditingDates)}
        className={cn(
          "w-12 h-12 rounded-xl items-center justify-center transition-all duration-500 shrink-0 hidden md:flex",
          isEditingDates ? "bg-emerald-600 text-white rotate-90" : "bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
        )}
      >
        <Edit2 className="w-5 h-5" />
      </button>
    </div>
  );

  const renderEditPanel = () => (
    <AnimatePresence>
      {isEditingDates && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white rounded-[2rem] p-8 border border-emerald-500/20 shadow-xl overflow-visible mb-10 relative z-30"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pickup Search */}
            <div className="space-y-4 relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Location</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                <input
                  type="text"
                  placeholder="Search pickup city, area, village or PIN..."
                  value={fromSearch}
                  onFocus={() => setShowFromSuggestions(true)}
                  onChange={(e) => {
                    setFromSearch(e.target.value);
                    setShowFromSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                  className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900"
                />

                <AnimatePresence>
                  {showFromSuggestions && fromSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] max-h-60 overflow-y-auto no-scrollbar"
                    >
                      {fromSuggestions.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedFrom({
                              name: s.display_name,
                              lat: parseFloat(s.lat),
                              lon: parseFloat(s.lon)
                            });
                            setFromSearch(s.display_name);
                            setShowFromSuggestions(false);
                          }}
                          className="w-full px-6 py-4 text-left hover:bg-emerald-50 flex items-center justify-between group/item border-b border-slate-50 last:border-b-0"
                        >
                          <div className="flex flex-col flex-1 pr-4">
                            <span className="text-xs font-bold text-slate-800 line-clamp-1">{s.display_name}</span>
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">
                              {s.address?.postcode ? `PIN: ${s.address.postcode} | ` : ''}
                              {s.address?.village || s.address?.suburb || s.address?.city || s.address?.state || 'Location'}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-emerald-500 shrink-0" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Drop Search */}
            <div className="space-y-4 relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop Location</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                <input
                  type="text"
                  placeholder="Search drop city, area, village or PIN..."
                  value={toSearch}
                  onFocus={() => setShowToSuggestions(true)}
                  onChange={(e) => {
                    setToSearch(e.target.value);
                    setShowToSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                  className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900"
                />

                <AnimatePresence>
                  {showToSuggestions && toSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] max-h-60 overflow-y-auto no-scrollbar"
                    >
                      {toSuggestions.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedTo({
                              name: s.display_name,
                              lat: parseFloat(s.lat),
                              lon: parseFloat(s.lon)
                            });
                            setToSearch(s.display_name);
                            setShowToSuggestions(false);
                          }}
                          className="w-full px-6 py-4 text-left hover:bg-emerald-50 flex items-center justify-between group/item border-b border-slate-50 last:border-b-0"
                        >
                          <div className="flex flex-col flex-1 pr-4">
                            <span className="text-xs font-bold text-slate-800 line-clamp-1">{s.display_name}</span>
                            <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest mt-0.5">
                              {s.address?.postcode ? `PIN: ${s.address.postcode} | ` : ''}
                              {s.address?.village || s.address?.suburb || s.address?.city || s.address?.state || 'Location'}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-emerald-500 shrink-0" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Pickup Date */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Date & Time</label>
              <input
                type="datetime-local"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900"
              />
            </div>

            {/* Return Date */}
            {tripType === "round-trip" && (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Return Date & Time</label>
                <input
                  type="datetime-local"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all text-slate-900"
                />
              </div>
            )}
          </div>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <button onClick={() => setIsEditingDates(false)} className="w-full md:w-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">Confirm Locations</button>
            <button onClick={() => setIsEditingDates(false)} className="w-full md:w-auto px-10 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100">Cancel</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ---------------------------------------------------------
  // RENDER TOUR LAYOUT (Gallery + Tabs)
  // ---------------------------------------------------------
  const renderTourLayout = () => (
    <div className="space-y-10">
      {renderTripHeader()}
      {renderEditPanel()}
      <div className="flex flex-col-reverse lg:flex-row gap-12">
        <div className="lg:w-[65%] space-y-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">
                <span className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Premium Tour</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase">Vizag to {destination.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" /> {destination.distanceKm} KM</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500" /> {destination.duration}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500" /> Daily</span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 h-[500px]">
              <div className="col-span-8 relative rounded-[2.5rem] overflow-hidden group">
                <Image src={destination.images[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427"} alt={destination.name} fill className="object-cover group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="col-span-4 flex flex-col gap-4">
                <div className="flex-1 relative rounded-[2.5rem] overflow-hidden bg-slate-100 group">
                  {destination.images[1] && <Image src={destination.images[1]} alt={destination.name} fill className="object-cover group-hover:scale-105 transition-all duration-700" />}
                </div>
                <div className="flex-1 relative rounded-[2.5rem] overflow-hidden bg-slate-100 group">
                  {destination.images[2] ? <Image src={destination.images[2]} alt={destination.name} fill className="object-cover group-hover:scale-105 transition-all duration-700" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black uppercase text-[10px]">Vizag Travels</div>}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white cursor-pointer hover:bg-slate-900/60 transition-all">
                    <Camera className="w-6 h-6 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Gallery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {renderContentTabs()}
          {bookingStep === "forms" && renderPassengerForms()}
        </div>
        <div className="lg:w-[35%]">
          <div className="sticky top-32 space-y-8">
            {!selectedVehicle && renderVehicleListSidebar()}
            {selectedVehicle && renderBookingSummarySidebar()}
          </div>
        </div>
      </div>

      {isTempoMode && (
        <div className="pt-16 border-t border-slate-100">
          <DestinationsSection />
        </div>
      )}
    </div>
  );

  // ---------------------------------------------------------
  // RENDER OUTSTATION LAYOUT (Map + Cards)
  // ---------------------------------------------------------
  const renderOutstationLayout = () => (
    <div className="space-y-10">
      {isAirportMode ? renderAirportBookingBar() : (
        <>
          {renderTripHeader()}
          {renderEditPanel()}
        </>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-[65%] space-y-10">
          {/* Mobile Only: Trip Mode */}
          <div className="lg:hidden">
            {renderTripModeCard()}
          </div>

          {/* Map Preview */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm p-3 relative z-10">
            <div className="relative h-[300px] md:h-[400px] rounded-[2rem] bg-slate-100 overflow-hidden group">
              <iframe
                ref={mapRef}
                srcDoc={mapSrcDoc}
                className="w-full h-full border-none rounded-[2rem]"
                title="Route Map"
              />

              {isLoadingRoute && (
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] flex items-center justify-center z-20 transition-all rounded-[2rem]">
                  <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Calculating Route...</span>
                  </div>
                </div>
              )}

              <div className="absolute top-6 left-6 flex bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-2xl border border-white z-20">
                <button
                  type="button"
                  onClick={() => setMapMode("map")}
                  className={cn(
                    "px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all",
                    mapMode === "map"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Map
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode("satellite")}
                  className={cn(
                    "px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all",
                    mapMode === "satellite"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Satellite
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center lg:text-left">
                Rates for {calculatedDistance} Kms approx distance | {calculatedDuration} approx time
              </p>
            </div>
          </div>

          {/* Mobile Only: Booking Summary */}
          <div className="lg:hidden">
            {renderBookingSummarySidebar()}
          </div>

          {/* Vertical Vehicle List */}
          <div className="space-y-6">
            {Object.values(FLEET_DATA)
              .filter((vehicle) => !isTempoMode || vehicle.slug === "tempo-traveller" || vehicle.slug === "urbania" || vehicle.slug === "luxury-bus" || vehicle.slug === "mini-bus")
              .map((vehicle) => {
                const fares = calculateFare(Number(vehicle.pricePerKm), vehicle.slug);
                const isExpanded = expandedVehicle === vehicle.slug;

                return (
                  <div key={vehicle.slug} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
                    <div className="p-8 flex flex-col md:flex-row items-center gap-10">
                      <div className="w-48 h-32 relative bg-slate-50 rounded-3xl p-4 flex items-center justify-center">
                        <Image src={vehicle.images[0]} alt={vehicle.model} fill className="object-contain p-4 group-hover:scale-110 transition-all duration-700" />
                      </div>

                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{vehicle.model}</h3>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100"><Users className="w-3.5 h-3.5 text-emerald-500" /> {vehicle.pax} Seats</span>
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100"><Briefcase className="w-3.5 h-3.5 text-emerald-500" /> 3 Bags</span>
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100"><Fuel className="w-3.5 h-3.5 text-emerald-500" /> Petrol</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                          {["AC", "Music System", "Charging Point"].map(f => (
                            <span key={f} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[8px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">{f}</span>
                          ))}
                        </div>
                        <button onClick={() => setExpandedVehicle(isExpanded ? null : vehicle.slug)} className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] pt-4 hover:underline">
                          View Details <ChevronDown className={cn("w-4 h-4 transition-all", isExpanded && "rotate-180")} />
                        </button>
                      </div>

                      <div className="flex flex-col items-center md:items-end gap-6">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Fare</p>
                          <p className="text-3xl font-black text-emerald-600 tracking-tighter">₹{fares.total.toLocaleString()}</p>
                          <p className="text-[10px] font-black text-slate-500 mt-1">
                            Up to {vehicle.pax} passengers
                          </p>
                          <p className={cn("text-[9px] font-bold text-slate-400 mt-0.5")}>
                            {fares.totalKm} KM @ ₹{vehicle.pricePerKm}/KM
                          </p>
                        </div>
                        <button
                          onClick={() => handleBookNow(vehicle)}
                          className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="bg-slate-50/50 border-t border-slate-100 p-8">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-slate-400 uppercase">Features</p>
                              <ul className="space-y-1 text-xs font-bold text-slate-600">
                                <li>✓ Power Windows</li>
                                <li>✓ Central Locking</li>
                                <li>✓ Airbags</li>
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>

          <AnimatePresence>
            {bookingStep === "forms" && (
              <motion.div
                id="booking-form"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                {renderPassengerForms()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:w-[35%] hidden lg:block">
          <div className="sticky top-32 space-y-8">
            {renderBookingSummarySidebar()}
            {renderTripModeCard()}
          </div>
        </div>
      </div>

      {isTempoMode && (
        <div className="pt-16 border-t border-slate-100">
          <DestinationsSection />
        </div>
      )}
    </div>
  );

  // ---------------------------------------------------------
  // SHARED SUB-RENDERERS
  // ---------------------------------------------------------

  const renderTripModeCard = () => {

    return (
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trip Mode</h3>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button onClick={() => setTripType("one-way")} className={cn("flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", tripType === "one-way" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}>One Way</button>
          <button onClick={() => setTripType("round-trip")} className={cn("flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", tripType === "round-trip" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}>Round Trip</button>
        </div>
        <p className="text-[9px] font-bold text-slate-400 italic">Round trip includes return journey with same vehicle. Rates may vary based on duration.</p>
      </div>
    );
  };

  const renderContentTabs = () => (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex border-b border-slate-100 px-10">
        {["overview", "itinerary", "policy"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab}
            {activeTab === tab && <motion.div layoutId="tab-bar" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full" />}
          </button>
        ))}
      </div>
      <div className="p-10 lg:p-14">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              <p className="text-xl text-slate-600 font-bold leading-relaxed italic opacity-80">"{destination.description}"</p>
              <div className="grid md:grid-cols-2 gap-8">
                {destination.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100"><Check className="w-3.5 h-3.5" /></div>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {activeTab === "itinerary" && (
            <motion.div key="it" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
              {destination.itinerary.map((item, idx) => (
                <div key={idx} className="flex gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">DAY {item.day}</div>
                    {idx !== destination.itinerary.length - 1 && <div className="w-1 flex-1 bg-slate-100 my-4 rounded-full" />}
                  </div>
                  <div className="space-y-6 flex-1 pb-10">
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                    <ul className="space-y-4">
                      {item.activities.map((act, ai) => (
                        <li key={ai} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 text-sm font-bold text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderPassengerForms = () => (
    <div className="space-y-10">
      {/* Trip details & passenger count */}
      <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Trip &amp; Passengers</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
              Full vehicle fare — same as car booking (distance × rate per km)
            </p>
          </div>
        </div>

        {selectedVehicle && (() => {
          const f = calculateFare(Number(selectedVehicle.pricePerKm), selectedVehicle.slug);
          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-[2rem] bg-[#F8FAFC] border border-slate-100">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Distance</p>
                <p className="text-lg font-black text-slate-900">{f.totalKm} KM</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Rate</p>
                <p className="text-lg font-black text-slate-900">₹{selectedVehicle.pricePerKm}/KM</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Driver Bhatta ({f.days} Day{f.days > 1 ? "s" : ""})</p>
                <p className="text-lg font-black text-slate-900">₹{f.bhatta.toLocaleString("en-IN")}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Fare</p>
                <p className="text-lg font-black text-emerald-600">₹{f.total.toLocaleString("en-IN")}</p>
              </div>
            </div>
          );
        })()}

        <div className="p-8 rounded-[2rem] bg-[#F8FAFC] border border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pricing Model</p>
          <p className="text-[10px] font-bold text-slate-400 italic mt-1">
            Total booking amount stays ₹{totalAmount.toLocaleString("en-IN")} for the whole vehicle.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-12">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Primary Guest Details</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
              Lead passenger for this booking
            </p>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-[#F8FAFC] border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">Primary Passenger</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="w-full h-14 bg-white border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-900 placeholder:text-slate-500"
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Age</label>
              <input
                type="number"
                value={passengerAge}
                onChange={(e) => setPassengerAge(e.target.value)}
                className="w-full h-14 bg-white border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-900 placeholder:text-slate-500"
                placeholder="Age"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Gender</label>
              <select
                value={passengerGender}
                onChange={(e) => setPassengerGender(e.target.value)}
                className="w-full h-14 bg-white border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-900"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-14">
        <div className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Contact details</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">For booking confirmation</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="w-full h-14 lg:h-16 bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 lg:px-6 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
              <div className="flex gap-3 lg:gap-4">
                <div className="w-20 lg:w-24 h-14 lg:h-16 bg-[#F8FAFC] border border-slate-100 rounded-2xl flex items-center justify-center text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-slate-600">IN +91</div>
                <input
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  className="flex-1 w-full min-w-0 h-14 lg:h-16 bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 lg:px-6 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="Enter 10 digit number"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={passengerEmail}
                onChange={(e) => setPassengerEmail(e.target.value)}
                className="w-full h-14 lg:h-16 bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 lg:px-6 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="example@gmail.com"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Terms & Conditions based on selected vehicle */}
        <div className="pt-14 border-t border-slate-100 space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Info className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                Terms & Conditions {selectedVehicle ? `(${selectedVehicle.model})` : ""}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Please review before proceeding</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {getFormattedVehicleTermsList(
              selectedVehicle?.slug || "",
              selectedVehicle?.model || "",
              selectedVehicle?.pax || ""
            ).map((term, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight leading-relaxed">{term}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTermsAccepted(!termsAccepted)}
            className={cn(
              "w-full flex items-center gap-4 p-6 rounded-2xl border transition-all text-left",
              termsAccepted
                ? "bg-emerald-50/50 border-emerald-500 text-emerald-950"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-200"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
              termsAccepted ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"
            )}>
              {termsAccepted && <Check className="w-3.5 h-3.5" />}
            </div>
            <p className="text-xs font-black">I agree to the vehicle-specific Terms of Service, Cancellation Policy, and Privacy Policy.</p>
          </button>
        </div>

        <div className="pt-14 border-t border-slate-100 space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CreditCard className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Payment Options</h3>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => setPaymentOption("part")}
              className={cn(
                "w-full p-8 rounded-[2.5rem] border-2 flex items-center justify-between transition-all group relative overflow-hidden",
                paymentOption === "part" ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 hover:border-emerald-500/30"
              )}
            >
              <div className="flex items-center gap-6 z-10">
                <div className={cn("w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all", paymentOption === "part" ? "border-emerald-600 bg-emerald-600" : "border-slate-300")}>
                  {paymentOption === "part" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-900 uppercase">Part Pay</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pay 30% now, rest to the driver</p>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 z-10">₹{partPayAmount.toLocaleString()}</p>
              {paymentOption === "part" && <motion.div layoutId="pay-bg" className="absolute inset-0 bg-emerald-50/50 -z-0" />}
            </button>

            <button
              onClick={() => setPaymentOption("full")}
              className={cn(
                "w-full p-8 rounded-[2.5rem] border-2 flex items-center justify-between transition-all group relative overflow-hidden",
                paymentOption === "full" ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 hover:border-emerald-500/30"
              )}
            >
              <div className="flex items-center gap-6 z-10">
                <div className={cn("w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all", paymentOption === "full" ? "border-emerald-600 bg-emerald-600" : "border-slate-300")}>
                  {paymentOption === "full" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-900 uppercase">Full Pay</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pay total amount now</p>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 z-10">₹{totalAmount.toLocaleString()}</p>
              {paymentOption === "full" && <motion.div layoutId="pay-bg" className="absolute inset-0 bg-emerald-50/50 -z-0" />}
            </button>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <p className="text-xs font-bold text-red-600">{errorMessage}</p>
            </div>
          )}

          <button
            onClick={initiatePayment}
            disabled={!termsAccepted || isProcessing}
            className={cn(
              "w-full h-24 rounded-[2rem] font-black text-xl uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-[0.98]",
              termsAccepted && !isProcessing
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30 cursor-pointer"
                : "bg-emerald-600/30 text-white/50 cursor-not-allowed shadow-none"
            )}
          >
            {isProcessing
              ? "Processing..."
              : `Proceed to Pay ₹${(paymentOption === "part" ? partPayAmount : totalAmount).toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );

  const renderVehicleListSidebar = () => (
    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl space-y-8">
      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Select Vehicle</h3>
      <div className="space-y-4">
        {Object.values(FLEET_DATA)
          .filter((vehicle) => !isTempoMode || vehicle.slug === "tempo-traveller" || vehicle.slug === "urbania" || vehicle.slug === "luxury-bus" || vehicle.slug === "mini-bus")
          .map((vehicle) => {
            const fares = calculateFare(Number(vehicle.pricePerKm), vehicle.slug);
            return (
              <button key={vehicle.slug} onClick={() => handleBookNow(vehicle)} className={cn("w-full p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group", selectedVehicle?.slug === vehicle.slug ? "border-emerald-500 bg-emerald-50/50" : "border-slate-100 hover:border-emerald-500/30")}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 relative bg-slate-50 rounded-xl overflow-hidden">
                    <Image src={vehicle.images[0]} alt={vehicle.model} fill className="object-contain p-2" />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-black text-slate-900 uppercase">{vehicle.model}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase">{vehicle.pax} Seats</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">₹{vehicle.pricePerKm}/KM</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">₹{Math.ceil(fares.total / Number(vehicle.pax))}/head</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 tracking-tight">₹{fares.total.toLocaleString()}</p>
                  <p className="text-[8px] font-bold text-slate-400 mt-0.5">
                    {fares.totalKm} km
                  </p>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );

  const renderBookingSummarySidebar = () => {
    const defaultVehicle = isTempoMode
      ? Object.values(FLEET_DATA).find(v => v.slug === "tempo-traveller") || Object.values(FLEET_DATA)[0]
      : Object.values(FLEET_DATA)[0];
    const activeVehicle = selectedVehicle || defaultVehicle;
    const fares = calculateFare(Number(activeVehicle.pricePerKm), activeVehicle.slug);
    const isTempo = activeVehicle.slug.includes("tempo") || activeVehicle.slug.includes("urbania") || activeVehicle.slug.includes("bus");
    const formattedDistance = calculatedDistance * (tripType === "round-trip" ? 2 : 1);

    return (
      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl space-y-10">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Booking Summary</h3>
        <div className="space-y-8">
          <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trip Type</p>
              <p className="text-sm font-black text-slate-900 uppercase mt-0.5">
                {isAirportMode
                  ? `Airport Transfer (${airportTrip === 'from-airport' ? 'From Airport' : 'To Airport'})`
                  : destination.type === "tour" ? "Tour" : `Outstation (${tripType === 'one-way' ? 'One Way' : 'Round Trip'})`
                }
              </p>
            </div>
            <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
          </div>

          <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pickup</p>
              <p className="text-sm font-black text-slate-900 uppercase mt-0.5 line-clamp-1">{selectedFrom.name}</p>
            </div>
            <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
          </div>

          <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Drop-off</p>
              <p className="text-sm font-black text-slate-900 uppercase mt-0.5 line-clamp-1">{selectedTo.name}</p>
            </div>
            <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
          </div>

          <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Map className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Distance</p>
              <p className="text-sm font-black text-slate-900 uppercase mt-0.5">{formattedDistance} KM</p>
            </div>
            <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
          </div>

          <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pickup Date</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">{pickupDate ? new Date(pickupDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Select Date'}</p>
            </div>
            <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
          </div>

          {tripType === "round-trip" && (
            <div className="flex items-start gap-4 group cursor-pointer" onClick={() => setIsEditingDates(true)}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Return Date</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">{returnDate ? new Date(returnDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Select Date'}</p>
              </div>
              <Edit2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
            </div>
          )}

          {selectedVehicle && (
            <div className="p-5 rounded-[2rem] border border-emerald-500 bg-emerald-50/30 flex items-center gap-5 relative">
              <div className="w-20 h-14 relative bg-white rounded-2xl p-2 border border-emerald-100 shadow-sm shrink-0">
                <Image src={selectedVehicle.images[0]} alt={selectedVehicle.model} fill className="object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 uppercase truncate">{selectedVehicle.model}</p>
                <div className="flex items-center gap-3 mt-1 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3 text-emerald-500" /> {selectedVehicle.pax} Seats</span>
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-500" /> ₹{selectedVehicle.pricePerKm}/KM</span>
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-600 absolute -top-2 -right-2 bg-white rounded-full shadow-lg" />
            </div>
          )}

          {!selectedVehicle && (
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-dashed border-slate-200 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a vehicle to see fare details</p>
            </div>
          )}
        </div>

        <div className="pt-10 border-t border-slate-100 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Distance</span>
            <span className="text-sm font-black text-slate-900">{formattedDistance} KM</span>
          </div>
          {selectedVehicle && (() => {
            const f = calculateFare(Number(selectedVehicle.pricePerKm), selectedVehicle.slug);
            return (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Name</span>
                  <span className="text-sm font-black text-slate-900 uppercase">{selectedVehicle.model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price per KM</span>
                  <span className="text-sm font-black text-slate-900">₹{selectedVehicle.pricePerKm}/KM</span>
                </div>
                {f.bhatta > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver Bhatta ({f.days} Day{f.days > 1 ? "s" : ""})</span>
                    <span className="text-sm font-black text-slate-900">₹{f.bhatta.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </>
            );
          })()}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trip Type</span>
            <span className="text-sm font-black text-slate-900 uppercase">
              {isAirportMode
                ? `Airport (${airportTrip === 'from-airport' ? 'From' : 'To'})`
                : tripType === 'one-way' ? 'One Way' : 'Round Trip'
              }
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Total Price</span>
            <span className="text-3xl font-black text-emerald-600 tracking-tight">₹{totalAmount.toLocaleString()}</span>
          </div>
          <button
            onClick={() => {
              if (!selectedVehicle) return;
              const f = calculateFare(Number(selectedVehicle.pricePerKm), selectedVehicle.slug);
              const message = `
*New Booking Enquiry - NRK Travels*
-----------------------------
*Vehicle:* ${selectedVehicle.model} (${selectedVehicle.type})
*Pickup:* ${fromSearch}
*Destination:* ${toSearch}
*Departure:* ${pickupDate ? new Date(pickupDate).toLocaleString('en-IN') : 'N/A'}
*Return:* ${returnDate ? new Date(returnDate).toLocaleString('en-IN') : 'N/A'}
*Trip Type:* ${tripType === 'one-way' ? 'One Way' : 'Round Trip'}
*Distance:* ~${f.totalKm} KM

*PRICING BREAKDOWN:*
*Base Price:* ₹${f.base.toLocaleString()}
*Driver Bhatta:* ₹${f.bhatta.toLocaleString()} (${f.days} Day${f.days > 1 ? "s" : ""})
*Total Estimated Fare:* ₹${f.total.toLocaleString()}
-----------------------------
Please confirm availability and book my ride!
`.trim();
              window.open(`https://api.whatsapp.com/send?phone=919111989222&text=${encodeURIComponent(message)}`, "_blank");
            }}
            className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-100 hover:bg-emerald-50 transition-all"
          >
            <MessageCircle className="w-4 h-4" /> Share Summary on WhatsApp
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="pt-28 lg:pt-36 pb-20 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          {destination.type === "tour" ? renderTourLayout() : renderOutstationLayout()}
        </div>
      </section>
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
              <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
              <div className="space-y-2"><h3 className="text-2xl font-black text-white">Connecting...</h3><p className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Do not refresh</p></div>
            </motion.div>
          </div>
        )}
        {bookingSuccess && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center space-y-8">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto"><CheckCircle2 className="w-12 h-12" /></div>
              <div className="space-y-3"><h3 className="text-3xl font-black text-slate-900 uppercase">Confirmed!</h3><p className="text-slate-500 font-bold italic">Your journey to {destination.name} is scheduled.</p></div>
              <button onClick={() => setBookingSuccess(false)} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest">Back to Home</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

const BookingPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
};

export default BookingPage;
