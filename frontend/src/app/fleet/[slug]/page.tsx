"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Users, 
  ShieldCheck, 
  Settings, 
  Fuel, 
  CheckCircle2, 
  Phone,
  Car,
  ChevronRight,
  Info,
  Sparkles,
  MapPin,
  Clock,
  Zap,
  ArrowRight,
  Star,
  Calendar,
  Navigation,
  MessageCircle,
  CreditCard,
  Loader2
} from "lucide-react";
import { FLEET_DATA } from "@/lib/fleet";
import { TOURS_DATA } from "@/lib/tours";
import SectionReveal from "@/components/ui/SectionReveal";
import { cn } from "@/lib/utils";
import BookingFlowModal from "@/components/booking/BookingFlowModal";
import { getVehicleTerms, getFormattedVehicleTermsList, getOneWayRate } from "@/lib/rates";

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
  { display_name: "Palakollu, West Godavari, Andhra Pradesh, India", lat: "16.5161", lon: "81.7250", address: { postcode: "534260", village: "Palakollu" } },
  { display_name: "Srikakulam, Andhra Pradesh, India", lat: "18.3000", lon: "83.9000", address: { postcode: "532001", city: "Srikakulam" } },
  { display_name: "Tirupati, Tirupati District, Andhra Pradesh, India", lat: "13.6288", lon: "79.4192", address: { postcode: "517501", city: "Tirupati" } },
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

const getEstimatedDistance = (from: string, to: string): number => {
  const f = from.toLowerCase();
  const t = to.toLowerCase();

  const isFromVizag = f.includes("vizag") || f.includes("visakhapatnam") || f.includes("5300");
  const isToVizag = t.includes("vizag") || t.includes("visakhapatnam") || t.includes("5300");

  if (isFromVizag && isToVizag) {
    return 20; // Default local Visakhapatnam city area travel
  }

  const other = isFromVizag ? t : f;

  if (other.includes("araku")) return 115;
  if (other.includes("arasavalli")) return 120;
  if (other.includes("srikakulam") || other.includes("532")) return 115;
  if (other.includes("annavaram") || other.includes("533")) return 110;
  if (other.includes("lambasingi")) return 105;
  if (other.includes("vanajangi")) return 100;
  if (other.includes("vizianagaram") || other.includes("5350")) return 60; // Vizianagaram is ~60 KM from Vizag
  if (other.includes("hyderabad")) return 620;
  if (other.includes("bangalore") || other.includes("bengaluru")) return 1000;
  if (other.includes("chennai")) return 800;
  if (other.includes("vijayawada")) return 350;
  if (other.includes("tirupati")) return 750;
  if (other.includes("kakinada")) return 155;
  if (other.includes("rajahmundry")) return 190;
  if (other.includes("airport")) return 35;

  return 145; 
};

const getLocalPackagePrice = (vehicleSlug: string, localPackage: string): number => {
  const s = vehicleSlug.toLowerCase();
  let mult = 1.0;
  if (localPackage.includes("10 Hours")) mult = 1.2;
  if (localPackage.includes("12 Hours")) mult = 1.4;

  if (s.includes("dzire") || s.includes("glanza") || s.includes("amaze") || s === "sedan" || s === "hatchback") {
    return Math.round(2200 * mult);
  }
  if (s.includes("innova") || s.includes("ertiga")) {
    return Math.round(4000 * mult);
  }
  if (s.includes("12-seater") || s.includes("12seater")) {
    return Math.round(5000 * mult);
  }
  if (s.includes("tempo") || s.includes("traveller") || s.includes("urbania") || s.includes("17")) {
    return Math.round(6000 * mult);
  }
  if (s.includes("mini") || s.includes("20") || s.includes("21") || s.includes("26")) {
    return Math.round(7000 * mult);
  }
  if (s.includes("27")) {
    return Math.round(9000 * mult);
  }
  return Math.round(12000 * mult); 
};

const FleetDetailsPage = () => {
  const { slug } = useParams();
  const vehicle = FLEET_DATA[slug as string];
  const [activeTab, setActiveTab] = useState<"overview" | "inclusions" | "features">("overview");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Dynamic booking parameters
  const [bookingMode, setBookingMode] = useState<"km" | "day">("km");
  const [dayTripScope, setDayTripScope] = useState<"local" | "outstation">("local");
  const [localPackage, setLocalPackage] = useState("8 Hours / 80 KM");
  const [returnDate, setReturnDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [pickupDate, setPickupDate] = useState("");

  const calculatedDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return 1;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }, [pickupDate, returnDate]);

  // Map Coordinates & Route plotting
  const [selectedFrom, setSelectedFrom] = useState({ name: "", lat: 0, lon: 0 });
  const [selectedTo, setSelectedTo] = useState({ name: "", lat: 0, lon: 0 });
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapMode, setMapMode] = useState<"map" | "satellite">("map");
  const mapRef = useRef<HTMLIFrameElement>(null);

  const [osrmDistance, setOsrmDistance] = useState<number | null>(null);
  const [osrmDuration, setOsrmDuration] = useState<string | null>(null);

  // Reset route metrics when locations change
  useEffect(() => {
    setOsrmDistance(null);
    setOsrmDuration(null);
  }, [pickupLocation, dropLocation]);

  // Resolve pickup coordinates dynamically
  useEffect(() => {
    if (!pickupLocation) {
      setSelectedFrom({ name: "", lat: 0, lon: 0 });
      return;
    }
    const q = pickupLocation.toLowerCase();
    const found = POPULAR_PICKUPS.find(p => p.display_name.toLowerCase().includes(q) || q.includes(p.display_name.toLowerCase()));
    if (found) {
      setSelectedFrom({ name: pickupLocation, lat: parseFloat(found.lat), lon: parseFloat(found.lon) });
    } else {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickupLocation)}&countrycodes=in&limit=1`, {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "NRK-Travels-App/1.0"
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              setSelectedFrom({ name: pickupLocation, lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
            }
          }
        } catch (e) {
          console.error("Geocoding pickupLocation error:", e);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [pickupLocation]);

  // Resolve drop coordinates dynamically
  useEffect(() => {
    if (!dropLocation) {
      setSelectedTo({ name: "", lat: 0, lon: 0 });
      return;
    }
    const q = dropLocation.toLowerCase();
    const found = LOCAL_SUGGESTIONS.find(p => p.display_name.toLowerCase().includes(q) || q.includes(p.display_name.toLowerCase()));
    if (found) {
      setSelectedTo({ name: dropLocation, lat: parseFloat(found.lat), lon: parseFloat(found.lon) });
    } else {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropLocation)}&countrycodes=in&limit=1`, {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "NRK-Travels-App/1.0"
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              setSelectedTo({ name: dropLocation, lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
            }
          }
        } catch (e) {
          console.error("Geocoding dropLocation error:", e);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [dropLocation]);

  // Suggestions states
  const [fromSuggestions, setFromSuggestions] = useState<Suggestion[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [isFromLoading, setIsFromLoading] = useState(false);

  const [toSuggestions, setToSuggestions] = useState<Suggestion[]>([]);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [isToLoading, setIsToLoading] = useState(false);

  const fromContainerRef = useRef<HTMLDivElement>(null);
  const toContainerRef = useRef<HTMLDivElement>(null);
  const fromDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const toDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize date client-side
  useEffect(() => {
    const now = new Date();
    setPickupDate(now.toISOString().slice(0, 16));
    const nextDay = new Date(now.getTime() + 86400000);
    setReturnDate(nextDay.toISOString().slice(0, 16));
  }, []);

  // PostMessage Map update logic
  useEffect(() => {
    const handleMapMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "MAP_READY") {
        setIsMapReady(true);
      }
    };
    window.addEventListener("message", handleMapMessage);
    return () => window.removeEventListener("message", handleMapMessage);
  }, []);

  useEffect(() => {
    if (mapRef.current && mapRef.current.contentWindow && selectedFrom.lat && selectedTo.lat) {
      mapRef.current.contentWindow.postMessage({
        type: "UPDATE_ROUTE",
        from: selectedFrom,
        to: selectedTo,
        coordinates: routeCoordinates
      }, "*");
      mapRef.current.contentWindow.postMessage({
        type: "SET_TILE",
        mode: mapMode
      }, "*");
    }
  }, [selectedFrom, selectedTo, routeCoordinates, mapMode, isMapReady]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (fromContainerRef.current && !fromContainerRef.current.contains(event.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toContainerRef.current && !toContainerRef.current.contains(event.target as Node)) {
        setShowToSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Sync default suggestions when query is short
  useEffect(() => {
    const q = pickupLocation.trim().toLowerCase();
    if (q.length < 2) {
      setFromSuggestions(POPULAR_PICKUPS);
    } else {
      const localFiltered = POPULAR_PICKUPS.filter(p => p.display_name.toLowerCase().includes(q));
      setFromSuggestions(localFiltered);
    }
  }, [pickupLocation]);

  useEffect(() => {
    const q = dropLocation.trim().toLowerCase();
    if (q.length < 2) {
      setToSuggestions(LOCAL_SUGGESTIONS);
    } else {
      const localFiltered = LOCAL_SUGGESTIONS.filter(p => p.display_name.toLowerCase().includes(q));
      setToSuggestions(localFiltered);
    }
  }, [dropLocation]);

  const fetchFromSuggestions = async (query: string) => {
    if (!query || query.trim().length < 2) return;
    setIsFromLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=5`, {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "NRK-Travels-App/1.0"
        }
      });
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map((item: any) => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          address: item.address,
        }));
        const q = query.toLowerCase();
        const localFiltered = POPULAR_PICKUPS.filter(p => p.display_name.toLowerCase().includes(q));
        const combined = [...localFiltered, ...formatted].filter(
          (v, i, a) => a.findIndex(t => t.display_name === v.display_name) === i
        );
        setFromSuggestions(combined);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setIsFromLoading(false);
    }
  };

  const fetchToSuggestions = async (query: string) => {
    if (!query || query.trim().length < 2) return;
    setIsToLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=5`, {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "NRK-Travels-App/1.0"
        }
      });
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map((item: any) => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          address: item.address,
        }));
        const q = query.toLowerCase();
        const localFiltered = LOCAL_SUGGESTIONS.filter(p => p.display_name.toLowerCase().includes(q));
        const combined = [...localFiltered, ...formatted].filter(
          (v, i, a) => a.findIndex(t => t.display_name === v.display_name) === i
        );
        setToSuggestions(combined);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setIsToLoading(false);
    }
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPickupLocation(val);
    setShowFromSuggestions(true);

    if (fromDebounceTimer.current) clearTimeout(fromDebounceTimer.current);
    fromDebounceTimer.current = setTimeout(() => {
      fetchFromSuggestions(val);
    }, 350);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDropLocation(val);
    setShowToSuggestions(true);

    if (toDebounceTimer.current) clearTimeout(toDebounceTimer.current);
    toDebounceTimer.current = setTimeout(() => {
      fetchToSuggestions(val);
    }, 350);
  };

  const handleSelectFrom = (suggestion: Suggestion) => {
    const addr = suggestion.address;
    const name = addr?.suburb || addr?.town || addr?.village || addr?.city || "";
    const city = addr?.city || addr?.state || "";
    const formattedName = name && city && name !== city ? `${name}, ${city}` : suggestion.display_name.split(",").slice(0, 2).join(",");
    setPickupLocation(formattedName);
    setSelectedFrom({
      name: formattedName,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon)
    });
    setShowFromSuggestions(false);
  };

  const handleSelectTo = (suggestion: Suggestion) => {
    const addr = suggestion.address;
    const name = addr?.suburb || addr?.town || addr?.village || addr?.city || "";
    const city = addr?.city || addr?.state || "";
    const formattedName = name && city && name !== city ? `${name}, ${city}` : suggestion.display_name.split(",").slice(0, 2).join(",");
    setDropLocation(formattedName);
    setSelectedTo({
      name: formattedName,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon)
    });
    setShowToSuggestions(false);
  };

  // Find tours that include this vehicle
  const availableTours = useMemo(() => {
    return Object.values(TOURS_DATA).filter(tour => 
      tour.vehicleRates.some(rate => rate.model.toLowerCase().includes(vehicle?.model.toLowerCase() || ""))
    );
  }, [vehicle]);

  // Similar vehicles
  const similarVehicles = useMemo(() => {
    return Object.values(FLEET_DATA).filter(v => 
      v.slug !== slug && (v.type === vehicle?.type || v.pax === vehicle?.pax)
    ).slice(0, 3);
  }, [vehicle, slug]);

  // Dynamic route calculation hook
  useEffect(() => {
    const getRoute = async () => {
      if (!selectedFrom.lat || !selectedTo.lat) return;
      setIsLoadingRoute(true);
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${selectedFrom.lon},${selectedFrom.lat};${selectedTo.lon},${selectedTo.lat}?overview=full&geometries=geojson`);
        if (res.ok) {
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
            setRouteCoordinates(coords);
            if (route.distance) {
              setOsrmDistance(Math.round(route.distance / 1000));
            }
            if (route.duration) {
              const hours = Math.floor(route.duration / 3600);
              const minutes = Math.round((route.duration % 3600) / 60);
              setOsrmDuration(hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`);
            }
          }
        }
      } catch (err) {
        console.error("Routing error:", err);
      } finally {
        setIsLoadingRoute(false);
      }
    };
    getRoute();
  }, [selectedFrom, selectedTo]);

  // Simulated map document content
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
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: false }).setView([17.6868, 83.2185], 11);
          L.control.zoom({ position: 'bottomright' }).addTo(map);
          var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

          window.parent.postMessage({ type: 'MAP_READY' }, '*');

          window.addEventListener('message', function(event) {
            if (event.data.type === 'UPDATE_ROUTE') {
              var route = event.data;
              map.eachLayer(function(layer) {
                if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                  map.removeLayer(layer);
                }
              });
              if (route.from && route.to) {
                L.marker([route.from.lat, route.from.lon]).addTo(map);
                L.marker([route.to.lat, route.to.lon]).addTo(map);
                if (route.coordinates && route.coordinates.length > 0) {
                  var polyline = L.polyline(route.coordinates, { color: '#10b981', weight: 5, opacity: 0.8 }).addTo(map);
                  map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
                } else {
                  map.fitBounds(L.latLngBounds([[route.from.lat, route.from.lon], [route.to.lat, route.to.lon]]), { padding: [30, 30] });
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

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Vehicle Not Found</h1>
        <Link href="/" className="text-emerald-600 font-bold hover:underline">Return to Home</Link>
      </div>
    );
  }

  // Live Fare Calculator
  const sidebarFare = (() => {
    const terms = getVehicleTerms(vehicle.slug, vehicle.model, vehicle.pax);
    
    if (bookingMode === "day" && dayTripScope === "local") {
      const basePrice = getLocalPackagePrice(vehicle.slug || "", localPackage);
      const bhatta = terms.driverBhatta;
      return {
        price: basePrice + bhatta,
        distance: localPackage.includes("80 KM") ? 80 : (localPackage.includes("100 KM") ? 100 : 120),
        time: localPackage.split("/")[0].trim(),
        breakdown: { base: basePrice, bhatta: bhatta, info: `Local package rental + ₹${bhatta} Driver allowance included.` }
      };
    }

    if (bookingMode === "day" && dayTripScope === "outstation") {
      const distance = osrmDistance !== null ? osrmDistance : getEstimatedDistance(pickupLocation, dropLocation);
      const baseDistance = Math.max(distance, 300 * calculatedDays);
      const basePrice = baseDistance * Number(vehicle.pricePerKm);
      const bhatta = terms.driverBhatta * calculatedDays;
      const total = basePrice + bhatta;
      const timeStr = osrmDuration !== null ? osrmDuration : (() => {
        const hours = Math.floor((distance * 1.5) / 60) + 1;
        const minutes = Math.round((distance * 1.5) % 60);
        return `${hours}h ${minutes}m`;
      })();

      return {
        price: total,
        distance: distance,
        time: timeStr,
        breakdown: { 
          base: basePrice, 
          bhatta: bhatta, 
          info: `Outstation Daily rate for ${calculatedDays} days (${Math.max(distance, 300 * calculatedDays)} KM package min billing).`
        }
      };
    }

    // Book for KM Mode - Pure distance-based billing + driver bhatta per day, no daily minimum 300 KM billing per day
    const distance = osrmDistance !== null ? osrmDistance : getEstimatedDistance(pickupLocation, dropLocation);
    
    if (tripType === "one-way") {
      const oneWayRate = getOneWayRate(vehicle.slug, vehicle.model);
      const basePrice = distance * oneWayRate;
      const total = 1000 + basePrice;
      const timeStr = osrmDuration !== null ? osrmDuration : (() => {
        const hours = Math.floor((distance * 1.5) / 60) + 1;
        const minutes = Math.round((distance * 1.5) % 60);
        return `${hours}h ${minutes}m`;
      })();

      return {
        price: total,
        distance: distance,
        time: timeStr,
        breakdown: { 
          base: basePrice, 
          bhatta: 0, 
          info: `One Way rate (₹${oneWayRate}/KM) + ₹1,000 Premium Charge.`
        }
      };
    }

    const multiplier = 2;
    const totalKm = distance * multiplier;
    const chargeKm = totalKm <= 250 ? 250 : totalKm;
    const basePrice = Math.ceil(chargeKm * Number(vehicle.pricePerKm));
    const bhatta = 300 * calculatedDays; 
    const total = basePrice + bhatta;
    const timeStr = osrmDuration !== null ? osrmDuration : (() => {
      const hours = Math.floor((distance * 1.5) / 60) + 1;
      const minutes = Math.round((distance * 1.5) % 60);
      return `${hours}h ${minutes}m`;
    })();

    return {
      price: total,
      distance: totalKm,
      time: timeStr,
      breakdown: { 
        base: basePrice, 
        bhatta: bhatta, 
        info: totalKm < chargeKm
          ? `KM Outstation package rate (₹${vehicle.pricePerKm}/KM). Min ${chargeKm} KM billing applied.`
          : `KM Outstation package rate (₹${vehicle.pricePerKm}/KM).`
      }
    };
  })();

  const gstAmount = Math.ceil(sidebarFare.price * 0.05);
  const totalWithGst = sidebarFare.price + gstAmount;

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  const isFormValid = () => {
    if (bookingMode === "day" && dayTripScope === "local") {
      return pickupLocation.trim() !== "";
    }
    return pickupLocation.trim() !== "" && dropLocation.trim() !== "";
  };

  // Shared responsive booking widget
  const renderBookingCard = () => {
    return (
      <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
          <Car className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-black uppercase tracking-widest">Book {vehicle.model}</h3>
        </div>

        {/* Booking Mode Selector (KM vs Day) */}
        <div className="flex bg-slate-55 border border-slate-200/50 p-1 rounded-2xl w-full">
          <button
            type="button"
            onClick={() => setBookingMode("km")}
            className={cn(
              "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all text-center",
              bookingMode === "km" ? "bg-white text-emerald-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Book for KM
          </button>
          <button
            type="button"
            onClick={() => setBookingMode("day")}
            className={cn(
              "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all text-center",
              bookingMode === "day" ? "bg-white text-emerald-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Book for Day
          </button>
        </div>

        {/* Day trip scope selection if Book for Day */}
        {bookingMode === "day" && (
          <div className="flex bg-slate-100/50 p-1 rounded-xl w-full">
            <button
              type="button"
              onClick={() => setDayTripScope("local")}
              className={cn("flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all text-center", dayTripScope === "local" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}
            >
              Local Use
            </button>
            <button
              type="button"
              onClick={() => setDayTripScope("outstation")}
              className={cn("flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all text-center", dayTripScope === "outstation" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}
            >
              Outstation
            </button>
          </div>
        )}

        {/* Interactive Forms */}
        <div className="space-y-4">
          
          {/* Pickup Input with autocomplete */}
          <div className="relative" ref={fromContainerRef}>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Pickup Location</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              <input
                type="text"
                placeholder="Type Pickup Location..."
                value={pickupLocation}
                onChange={handleFromChange}
                onFocus={() => setShowFromSuggestions(true)}
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-8 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 placeholder:text-slate-350"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                {isFromLoading && <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />}
                {pickupLocation && !isFromLoading && (
                  <button onClick={() => { setPickupLocation(""); setFromSuggestions(POPULAR_PICKUPS); setShowFromSuggestions(true); }} className="text-slate-400 hover:text-slate-600 font-bold text-sm">×</button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto no-scrollbar z-50"
                >
                  {fromSuggestions.map((s, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectFrom(s)}
                      className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors flex items-start gap-2.5 border-b border-slate-50 last:border-0"
                    >
                      <MapPin className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                      <div className="flex flex-col min-w-0 flex-1 pr-1">
                        <span className="text-[11px] font-black text-slate-800 line-clamp-1">{s.display_name.split(",")[0]}</span>
                        <span className="text-[8px] font-bold text-slate-400 line-clamp-1 uppercase tracking-widest mt-0.5">{s.address?.village || s.address?.city || "Location"}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Drop Input with autocomplete (hidden for local hourly bookings) */}
          {!(bookingMode === "day" && dayTripScope === "local") && (
            <div className="relative" ref={toContainerRef}>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Drop Location</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                <input
                  type="text"
                  placeholder="Type Drop Location..."
                  value={dropLocation}
                  onChange={handleToChange}
                  onFocus={() => setShowToSuggestions(true)}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-8 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 placeholder:text-slate-350"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                  {isToLoading && <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />}
                  {dropLocation && !isToLoading && (
                    <button onClick={() => { setDropLocation(""); setToSuggestions(LOCAL_SUGGESTIONS); setShowToSuggestions(true); }} className="text-slate-400 hover:text-slate-600 font-bold text-sm">×</button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {showToSuggestions && toSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto no-scrollbar z-50"
                  >
                    {toSuggestions.map((s, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectTo(s)}
                        className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors flex items-start gap-2.5 border-b border-slate-50 last:border-0"
                      >
                        <MapPin className="w-3.5 h-3.5 mt-0.5 text-orange-500 shrink-0" />
                        <div className="flex flex-col min-w-0 flex-1 pr-1">
                          <span className="text-[11px] font-black text-slate-800 line-clamp-1">{s.display_name.split(",")[0]}</span>
                          <span className="text-[8px] font-bold text-slate-400 line-clamp-1 uppercase tracking-widest mt-0.5">{s.address?.village || s.address?.city || "Location"}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Trip Type Toggles or package dropdowns */}
          {bookingMode === "km" ? (
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Trip Type</label>
              <div className="flex bg-slate-100 p-1 rounded-xl w-full h-11 items-center">
                <button type="button" onClick={() => setTripType("one-way")} className={cn("flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", tripType === "one-way" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}>One Way</button>
                <button type="button" onClick={() => setTripType("round-trip")} className={cn("flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", tripType === "round-trip" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}>Round Trip</button>
              </div>
            </div>
          ) : (
            dayTripScope === "local" ? (
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Local Hourly Package</label>
                <div className="relative group">
                  <select
                    value={localPackage}
                    onChange={(e) => setLocalPackage(e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[10px] font-black text-slate-900 focus:outline-none cursor-pointer appearance-none"
                  >
                    <option>8 Hours / 80 KM</option>
                    <option>10 Hours / 100 KM</option>
                    <option>12 Hours / 120 KM</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-455 pointer-events-none text-xs">&#9662;</div>
                </div>
              </div>
            ) : null
          )}

          {/* Scheduler Input */}
          {bookingMode === "day" && dayTripScope === "local" ? (
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Departure Date & Time</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <input
                  type="datetime-local"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Departure Date & Time</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <input
                    type="datetime-local"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                  <span>Return Date & Time</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[8px] font-black tracking-normal uppercase">{calculatedDays} Day{calculatedDays > 1 ? "s" : ""}</span>
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <input
                    type="datetime-local"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Realtime Route Map plotting inside Booking Form Card */}
        {pickupLocation && !(bookingMode === "day" && dayTripScope === "local") && dropLocation && (
          <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-250 bg-slate-50 group">
            <iframe
              ref={mapRef}
              srcDoc={mapSrcDoc}
              className="w-full h-full border-none rounded-2xl"
              title="Route Map"
            />
            {isLoadingRoute && (
              <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center z-20">
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex bg-white/90 backdrop-blur-md p-0.5 rounded-lg shadow-md border border-slate-100 z-20 text-[8px] font-black uppercase tracking-widest">
              <button type="button" onClick={() => setMapMode("map")} className={cn("px-2 py-1 rounded", mapMode === "map" ? "bg-emerald-600 text-white" : "text-slate-400")}>Map</button>
              <button type="button" onClick={() => setMapMode("satellite")} className={cn("px-2 py-1 rounded", mapMode === "satellite" ? "bg-emerald-600 text-white" : "text-slate-400")}>Sat</button>
            </div>
          </div>
        )}

        {/* Realtime Pricing Breakdown */}
        {pickupLocation && (bookingMode === "day" && dayTripScope === "local" ? true : !!dropLocation) && (
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-500/10 space-y-3">
            <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Live Price Calculation</p>
            
            <div className="flex justify-between items-baseline border-b border-emerald-500/10 pb-2">
              <span className="text-[9px] font-black text-slate-500 uppercase">Estimated Distance</span>
              <span className="text-sm font-black text-slate-900">{sidebarFare.distance} KM</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-emerald-500/10 pb-2">
              <span className="text-[9px] font-black text-slate-500 uppercase">Expected Duration</span>
              <span className="text-sm font-black text-slate-900">{sidebarFare.time}</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-emerald-500/10 pb-2">
              <span className="text-[9px] font-black text-slate-500 uppercase">Base Price</span>
              <span className="text-sm font-black text-slate-900">₹{sidebarFare.breakdown.base.toLocaleString()}</span>
            </div>
            
            {sidebarFare.breakdown.bhatta > 0 && (
              <div className="flex justify-between items-baseline border-b border-emerald-500/10 pb-2">
                <span className="text-[9px] font-black text-slate-500 uppercase">Driver Bhatta</span>
                <span className="text-sm font-black text-slate-900">₹{sidebarFare.breakdown.bhatta.toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between items-baseline border-b border-emerald-500/10 pb-2">
              <span className="text-[9px] font-black text-slate-500 uppercase">GST (5%)</span>
              <span className="text-sm font-black text-slate-900">₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-[10px] font-black text-emerald-700 uppercase">Estimated Total</span>
              <span className="text-2xl font-black text-emerald-600 tracking-tighter">₹{totalWithGst.toLocaleString('en-IN')}</span>
            </div>

            <p className="text-[8px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider italic">
              {sidebarFare.breakdown.info} Incl. 5% GST. Excludes toll & parking charges.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100">
          <button 
            onClick={handleBookNow}
            disabled={!isFormValid()}
            className={cn(
              "w-full py-4 rounded-xl font-black text-[10px] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 uppercase tracking-[0.2em] border-none",
              isFormValid() 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Navigation className="w-3.5 h-3.5" /> Book {vehicle.model}
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumbs */}
      <div className="pt-28 lg:pt-32 px-6 lg:px-12">
        <div className="max-w-[100%] mx-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/#fleet" className="hover:text-emerald-600">Fleet</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">{vehicle.model}</span>
        </div>
      </div>

      <section className="py-8 lg:py-12 px-6 lg:px-12">
        <div className="max-w-[100%] mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Main Content (Left) */}
            <div className="lg:w-3/4 space-y-10">
              {/* Vehicle Main Card */}
              <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm p-8 lg:p-12 space-y-10">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                      {vehicle.model}
                    </h1>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Comfort Ride
                      </span>
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                        AC
                      </span>
                      <span className="bg-slate-50 text-slate-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-slate-100">
                        {vehicle.type}
                      </span>
                    </div>
                    <div className="flex gap-6 pt-4 text-slate-400">
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Petrol/Diesel</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{vehicle.pax} Passengers</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Squished Mobile Image Container */}
                <div className="relative h-48 sm:h-64 md:h-80 lg:h-[400px] w-full rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 group">
                  <Image 
                    src={vehicle.images[0]} 
                    alt={vehicle.model} 
                    fill 
                    className="object-contain p-4 md:p-8 group-hover:scale-105 transition-transform duration-1000" 
                  />
                </div>
              </div>

              {/* Mobile Only: Render Booking Selector Form card (Hidden on Desktop) */}
              <div className="block lg:hidden">
                {renderBookingCard()}
              </div>

              {/* Rate Card Section */}
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-sm space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Rate Card</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transparent pricing for every journey</p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-2 rounded-xl border border-emerald-100 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" /> Best Price Guarantee
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { type: "Local Trip", price: `₹${getLocalPackagePrice(vehicle.slug, "8 Hours / 80 KM").toLocaleString()}`, sub: "8 hrs / 80 km limit", extra: `Extra @ ₹${getVehicleTerms(vehicle.slug, vehicle.model, vehicle.pax).extraKm}/km`, icon: MapPin },
                    { type: "Outstation", price: `₹${vehicle.pricePerKm}/km`, sub: `Min ${vehicle.minKm} km/day`, extra: `Driver allowance: ₹${getVehicleTerms(vehicle.slug, vehicle.model, vehicle.pax).driverBhatta}`, icon: Zap },
                    { type: "Airport", price: "₹1,200", sub: "Transfer Package", extra: "Excluding toll & parking", icon: Clock }
                  ].map((rate, i) => (
                    <div key={i} className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-12 -mt-12 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <rate.icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{rate.type}</h4>
                      <p className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{rate.price}</p>
                      <p className="text-[11px] font-bold text-slate-500 italic mb-4 opacity-80">{rate.sub}</p>
                      <div className="pt-4 border-t border-slate-200/50">
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{rate.extra}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs Section */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-100 px-8">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "inclusions", label: "Inclusions & Exclusions" },
                    { id: "features", label: "Features" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                        activeTab === tab.id ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div layoutId="vehicle-tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-10 lg:p-12">
                  <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <p className="text-lg text-slate-600 font-bold leading-relaxed italic">
                          {vehicle.description}
                        </p>
                      </motion.div>
                    )}
                    {activeTab === "inclusions" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="grid md:grid-cols-2 gap-10"
                      >
                        <div className="space-y-6">
                          <h4 className="text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Inclusions
                          </h4>
                          <ul className="space-y-3">
                            {["Professional Driver", "Fuel Charges", "A/C Usage", "Clean Interiors", "Phone Support"].map(item => (
                              <li key={item} className="text-xs font-bold text-slate-600 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-6">
                          <h4 className="text-rose-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <Info className="w-4 h-4" /> Exclusions
                          </h4>
                          <ul className="space-y-3">
                            {["Toll Charges", "Parking Fees", "Driver Allowance", "GST (5%)", "Entry Fees"].map(item => (
                              <li key={item} className="text-xs font-bold text-slate-600 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                    {activeTab === "features" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="grid md:grid-cols-3 gap-6"
                      >
                        {vehicle.features.map(feature => (
                          <div key={feature} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{feature}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Available Tours Section */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Available Tours for {vehicle.model}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Perfect destinations for your {vehicle.model}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {availableTours.map(tour => (
                    <div key={tour.slug} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-500 group flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image 
                          src={tour.images[0]} 
                          alt={tour.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase text-emerald-600 shadow-xl border border-white/20">
                          {tour.duration}
                        </div>
                      </div>
                      
                      <div className="p-8 flex flex-col flex-1 space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase group-hover:text-emerald-600 transition-colors line-clamp-1">{tour.title}</h4>
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest"><MapPin className="w-3 h-3 text-emerald-500" /> {tour.distanceKm} KM</span>
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Clock className="w-3 h-3 text-emerald-500" /> {tour.duration}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-550 font-bold leading-relaxed line-clamp-2 italic opacity-80">
                          {tour.description}
                        </p>

                        <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-900 italic leading-none">₹{tour.vehicleRates.find(r => r.model.toLowerCase().includes(vehicle.model.toLowerCase()))?.price || tour.basePrice}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Package</p>
                          </div>
                          <Link 
                            href={`/tours/${tour.slug}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex items-center gap-2"
                          >
                            VIEW DETAILS <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (Right) - INTERACTIVE DYNAMIC BOOKING CARD (Desktop only) */}
            <div className="lg:w-1/4 hidden lg:block">
              <div className="sticky top-32 space-y-8">
                {renderBookingCard()}

                {/* Similar Vehicles Sidebar */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Similar Vehicles</h3>
                  <div className="space-y-6">
                    {similarVehicles.map(v => (
                      <div key={v.slug} className="group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2 relative overflow-hidden flex-shrink-0">
                            <Image src={v.images[0]} alt={v.model} fill className="object-contain p-1 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="text-[11px] font-black text-slate-900 uppercase group-hover:text-emerald-600 transition-colors">{v.model}</h4>
                              <span className="text-[10px] font-black text-emerald-600 italic leading-none">₹{v.pricePerKm}/km</span>
                            </div>
                            <Link 
                              href={`/fleet/${v.slug}`}
                              className="inline-block text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
                  <div className="space-y-2 relative">
                    <h4 className="text-lg font-black tracking-tight uppercase leading-none">Need Help?</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Our experts are here 24/7</p>
                  </div>
                  <div className="space-y-3 relative">
                    <a href="tel:+919111989222" className="flex items-center gap-3 text-sm font-black hover:text-emerald-400 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      +91 9111989222
                    </a>
                  </div>
                  <a 
                    href="https://wa.me/919111989222" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
            
            {/* Mobile Footer Items (Shown under left content on mobile) */}
            <div className="w-full lg:hidden space-y-8">
              {/* Similar Vehicles */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Similar Vehicles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {similarVehicles.map(v => (
                    <div key={v.slug} className="group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2 relative overflow-hidden flex-shrink-0">
                          <Image src={v.images[0]} alt={v.model} fill className="object-contain p-1 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase group-hover:text-emerald-600 transition-colors">{v.model}</h4>
                            <span className="text-[10px] font-black text-emerald-600 italic leading-none">₹{v.pricePerKm}/km</span>
                          </div>
                          <Link 
                            href={`/fleet/${v.slug}`}
                            className="inline-block text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
                <div className="space-y-2 relative">
                  <h4 className="text-lg font-black tracking-tight uppercase leading-none">Need Help?</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Our experts are here 24/7</p>
                </div>
                <div className="space-y-3 relative">
                  <a href="tel:+919111989222" className="flex items-center gap-3 text-sm font-black hover:text-emerald-400 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    +91 9111989222
                  </a>
                </div>
                <a 
                  href="https://wa.me/919111989222" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <BookingFlowModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        vehicle={{
          slug: vehicle.slug,
          model: vehicle.model,
          pricePerKm: Number(vehicle.pricePerKm),
          type: vehicle.type,
          image: vehicle.images[0],
          pax: vehicle.pax
        }}
        prefilledFromLocation={pickupLocation}
        prefilledToLocation={dropLocation}
        prefilledBookingMode={bookingMode}
        prefilledDayTripScope={dayTripScope}
        prefilledLocalPackage={localPackage}
        prefilledDays={calculatedDays}
        prefilledPickupDate={pickupDate}
        prefilledReturnDate={returnDate}
        prefilledTripType={tripType}
      />
    </main>
  );
};

export default FleetDetailsPage;
