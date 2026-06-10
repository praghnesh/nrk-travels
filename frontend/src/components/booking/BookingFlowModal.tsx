/**
 * =========================================
 * BookingFlowModal Component
 * Interactive multi-step booking with Map and Payment
 * =========================================
 */

"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Navigation,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Smartphone,
  Info,
  Check,
  Loader2,
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFormattedVehicleTermsList, getVehicleTerms, getOneWayRate } from "@/lib/rates";
import { createBooking, createPaymentOrder, verifyPayment, loadRazorpay } from "@/lib/api";

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    slug?: string;
    model: string;
    pricePerKm: number;
    type: string;
    image: string;
    pax?: string;
  };
  prefilledFromLocation?: string;
  prefilledToLocation?: string;
  prefilledBookingMode?: "km" | "day";
  prefilledDayTripScope?: "local" | "outstation";
  prefilledLocalPackage?: string;
  prefilledDays?: number;
  prefilledPickupDate?: string;
  prefilledReturnDate?: string;
  prefilledTripType?: "one-way" | "round-trip";
}

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

const BookingFlowModal = ({
  isOpen,
  onClose,
  vehicle,
  prefilledFromLocation = "",
  prefilledToLocation = "",
  prefilledBookingMode = "km",
  prefilledDayTripScope = "local",
  prefilledLocalPackage = "8 Hours / 80 KM",
  prefilledDays = 1,
  prefilledPickupDate = "",
  prefilledReturnDate = "",
  prefilledTripType = "one-way"
}: BookingFlowModalProps) => {
  const [step, setStep] = useState(1);
  const [fromLocation, setFromLocation] = useState(prefilledFromLocation);
  const [toLocation, setToLocation] = useState(prefilledToLocation);
  const [bookingMode, setBookingMode] = useState<"km" | "day">(prefilledBookingMode);
  const [dayTripScope, setDayTripScope] = useState<"local" | "outstation">(prefilledDayTripScope);
  const [localPackage, setLocalPackage] = useState(prefilledLocalPackage);
  const [tripType, setTripType] = useState<"one-way" | "round-trip">(prefilledTripType);
  const [returnDate, setReturnDate] = useState("");
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
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Lead passenger details state hooks
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");

  // Map and routing coordinate states
  const [selectedFrom, setSelectedFrom] = useState({ name: "", lat: 0, lon: 0 });
  const [selectedTo, setSelectedTo] = useState({ name: "", lat: 0, lon: 0 });
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapMode, setMapMode] = useState<"map" | "satellite">("map");
  const mapRef = useRef<HTMLIFrameElement>(null);

  const [osrmDistance, setOsrmDistance] = useState<number | null>(null);
  const [osrmDuration, setOsrmDuration] = useState<string | null>(null);

  // Reset OSRM route metrics when location changes
  useEffect(() => {
    setOsrmDistance(null);
    setOsrmDuration(null);
  }, [fromLocation, toLocation]);

  // Resolve pickup coordinate
  useEffect(() => {
    if (!fromLocation) {
      setSelectedFrom({ name: "", lat: 0, lon: 0 });
      return;
    }
    const q = fromLocation.toLowerCase();
    const found = POPULAR_PICKUPS.find(p => p.display_name.toLowerCase().includes(q) || q.includes(p.display_name.toLowerCase()));
    if (found) {
      setSelectedFrom({ name: fromLocation, lat: parseFloat(found.lat), lon: parseFloat(found.lon) });
    } else {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fromLocation)}&countrycodes=in&limit=1`, {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "NRK-Travels-App/1.0"
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              setSelectedFrom({ name: fromLocation, lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
            }
          }
        } catch (e) {
          console.error("Geocoding fromLocation error:", e);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [fromLocation]);

  // Resolve drop coordinate
  useEffect(() => {
    if (!toLocation) {
      setSelectedTo({ name: "", lat: 0, lon: 0 });
      return;
    }
    const q = toLocation.toLowerCase();
    const found = LOCAL_SUGGESTIONS.find(p => p.display_name.toLowerCase().includes(q) || q.includes(p.display_name.toLowerCase()));
    if (found) {
      setSelectedTo({ name: toLocation, lat: parseFloat(found.lat), lon: parseFloat(found.lon) });
    } else {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(toLocation)}&countrycodes=in&limit=1`, {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "NRK-Travels-App/1.0"
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              setSelectedTo({ name: toLocation, lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
            }
          }
        } catch (e) {
          console.error("Geocoding toLocation error:", e);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [toLocation]);

  // Fetch OSRM Route
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
        console.error("Routing error inside BookingFlowModal:", err);
      } finally {
        setIsLoadingRoute(false);
      }
    };
    getRoute();
  }, [selectedFrom, selectedTo]);

  // Handle message listener for map loading confirmation
  useEffect(() => {
    const handleMapMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "MAP_READY") {
        setIsMapReady(true);
      }
    };
    window.addEventListener("message", handleMapMessage);
    return () => window.removeEventListener("message", handleMapMessage);
  }, []);

  // Post changes to Leaflet iframe
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

  // Leaflet source code
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

  // Sync state on prefill change or modal open
  useEffect(() => {
    if (isOpen) {
      setFromLocation(prefilledFromLocation);
      setToLocation(prefilledToLocation);
      setBookingMode(prefilledBookingMode);
      setDayTripScope(prefilledDayTripScope);
      setLocalPackage(prefilledLocalPackage);
      setTripType(prefilledTripType);
      setPaymentSuccess(false);
      setIsProcessing(false);
      setTermsAccepted(false);

      const now = new Date();
      const pDate = prefilledPickupDate || now.toISOString().slice(0, 16);
      setPickupDate(pDate);
      
      const nextDayTime = (prefilledPickupDate ? new Date(prefilledPickupDate) : now).getTime() + (86400000 * (prefilledDays || 1));
      const rDate = prefilledReturnDate || new Date(nextDayTime).toISOString().slice(0, 16);
      setReturnDate(rDate);

      const hasLocations = prefilledFromLocation && (prefilledBookingMode === "day" && prefilledDayTripScope === "local" ? true : !!prefilledToLocation);
      if (hasLocations) {
        setStep(2);
      } else {
        setStep(1);
      }
    }
  }, [
    isOpen,
    prefilledFromLocation,
    prefilledToLocation,
    prefilledBookingMode,
    prefilledDayTripScope,
    prefilledLocalPackage,
    prefilledDays,
    prefilledPickupDate,
    prefilledReturnDate,
    prefilledTripType
  ]);

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
    const q = fromLocation.trim().toLowerCase();
    if (q.length < 2) {
      setFromSuggestions(POPULAR_PICKUPS);
    } else {
      const localFiltered = POPULAR_PICKUPS.filter(p => p.display_name.toLowerCase().includes(q));
      setFromSuggestions(localFiltered);
    }
  }, [fromLocation]);

  useEffect(() => {
    const q = toLocation.trim().toLowerCase();
    if (q.length < 2) {
      setToSuggestions(LOCAL_SUGGESTIONS);
    } else {
      const localFiltered = LOCAL_SUGGESTIONS.filter(p => p.display_name.toLowerCase().includes(q));
      setToSuggestions(localFiltered);
    }
  }, [toLocation]);

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
      console.error("Error fetching from suggestions:", err);
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
      console.error("Error fetching to suggestions:", err);
    } finally {
      setIsToLoading(false);
    }
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFromLocation(val);
    setShowFromSuggestions(true);

    if (fromDebounceTimer.current) clearTimeout(fromDebounceTimer.current);
    fromDebounceTimer.current = setTimeout(() => {
      fetchFromSuggestions(val);
    }, 350);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setToLocation(val);
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
    setFromLocation(formattedName);
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
    setToLocation(formattedName);
    setSelectedTo({
      name: formattedName,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon)
    });
    setShowToSuggestions(false);
  };

  // Unified Fare Calculations
  const getCalculatedFare = (): { price: number; distance: number; time: string; breakdown: { base: number; bhatta: number; extraInfo?: string } } => {
    const terms = getVehicleTerms(vehicle.slug, vehicle.model, vehicle.pax);
    
    if (bookingMode === "day" && dayTripScope === "local") {
      const basePrice = getLocalPackagePrice(vehicle.slug || "", localPackage);
      const bhatta = terms.driverBhatta;
      return {
        price: basePrice + bhatta,
        distance: localPackage.includes("80 KM") ? 80 : (localPackage.includes("100 KM") ? 100 : 120),
        time: localPackage.split("/")[0].trim(),
        breakdown: {
          base: basePrice,
          bhatta: bhatta,
          extraInfo: `Local Package (${localPackage})`
        }
      };
    }

    if (bookingMode === "day" && dayTripScope === "outstation") {
      const distance = osrmDistance !== null ? osrmDistance : getEstimatedDistance(fromLocation, toLocation);
      const baseDistance = Math.max(distance, 300 * calculatedDays);
      const basePrice = baseDistance * vehicle.pricePerKm;
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
          extraInfo: `Outstation Package (${calculatedDays} Days)`
        }
      };
    }

    // KM Booking Mode - One Way vs Round Trip Outstation
    const distance = osrmDistance !== null ? osrmDistance : getEstimatedDistance(fromLocation, toLocation);
    
    if (tripType === "one-way") {
      const oneWayRate = getOneWayRate(vehicle.slug, vehicle.model);
      const basePrice = Math.ceil(distance * oneWayRate);
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
          extraInfo: `One-Way (₹${oneWayRate}/KM + ₹1,000 Premium Charge)`
        }
      };
    }

    const multiplier = 2;
    const totalKm = distance * multiplier;
    const chargeKm = totalKm <= 250 ? 250 : totalKm;
    const basePrice = Math.ceil(chargeKm * vehicle.pricePerKm);
    const bhatta = 300 * calculatedDays;
    const total = basePrice + bhatta;
    const timeStr = osrmDuration !== null ? osrmDuration : (() => {
      const hours = Math.floor((distance * 1.5) / 60) + 1;
      const minutes = Math.round((distance * 1.5) % 60);
      return `${hours}h ${minutes}m`;
    })();

    return {
      price: total,
      distance: chargeKm,
      time: timeStr,
      breakdown: {
        base: basePrice,
        bhatta: bhatta,
        extraInfo: `Round-Trip Outstation (${calculatedDays} Days, ₹${vehicle.pricePerKm}/KM)`
      }
    };
  };

  const currentFare = getCalculatedFare();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMessage("");
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please verify your internet connection.");
      }

      const bookingRes = await createBooking({
        customer_name: passengerName,
        customer_email: passengerEmail,
        customer_phone: passengerPhone,
        booking_type: "vehicle",
        total_amount: currentFare.price,
        actual_total_amount: currentFare.price,
        amount_paid: currentFare.price,
        payment_percentage: 100,
        special_requests: `From: ${fromLocation}. To: ${toLocation || "Local"}. Mode: ${bookingMode}. Scope: ${dayTripScope}. Package: ${localPackage}. Trip Type: ${tripType}. Return Date: ${returnDate}`,
        fleet_id: vehicle.model,
        travel_date: pickupDate ? pickupDate.split("T")[0] : new Date().toISOString().split("T")[0]
      });

      if (!bookingRes.success || !bookingRes.data?.id) {
        throw new Error("Failed to create a booking request in our system.");
      }

      const bookingId = bookingRes.data.id;
      const orderRes = await createPaymentOrder(bookingId);
      if (!orderRes.success || !orderRes.data?.id) {
        throw new Error("Failed to generate payment order. Please try again.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "NRK Travels",
        description: `Vehicle Booking: ${vehicle.model}`,
        order_id: orderRes.data.id,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPaymentSuccess(true);
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
        setErrorMessage("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Booking error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during booking.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-white rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[92vh] sm:h-[85vh] lg:h-[800px] min-h-[500px]"
      >
        {/* Left Sidebar - Summary */}
        <div className="lg:w-1/3 bg-slate-900 p-6 lg:p-12 text-white flex flex-col justify-between shrink-0 lg:h-auto min-h-0">
          {/* Mobile compact header */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <div className="space-y-1">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400">Booking Summary</span>
              <h2 className="text-xl font-black tracking-tight leading-none">{vehicle.model}</h2>
              <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">{vehicle.type} • {bookingMode === "day" && dayTripScope === "local" ? "Local" : "Outstation"}</p>
            </div>
            {fromLocation && (bookingMode === "day" && dayTripScope === "local" ? true : !!toLocation) && (
              <div className="text-right">
                <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">Est. Total</p>
                <p className="text-xl font-black text-emerald-400 leading-none mt-0.5">₹{currentFare.price.toLocaleString('en-IN')}</p>
                <span className="text-[7px] font-black uppercase text-emerald-300 opacity-80 tracking-widest">{currentFare.breakdown.extraInfo}</span>
              </div>
            )}
          </div>

          {/* Desktop full detailed summary */}
          <div className="hidden lg:flex flex-col justify-between h-full space-y-8">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Booking Summary</span>
                <h2 className="text-3xl font-black tracking-tight leading-none">{vehicle.model}</h2>
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest">{vehicle.type}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Rate Mode</p>
                    <p className="text-lg font-black italic">
                      {bookingMode === "day" && dayTripScope === "local" ? "Local Day Package" : `₹${vehicle.pricePerKm} / KM`}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">From</p>
                      <p className="text-sm font-bold">{fromLocation || "Select pickup location"}</p>
                    </div>
                  </div>
                  {!(bookingMode === "day" && dayTripScope === "local") && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">To</p>
                        <p className="text-sm font-bold">{toLocation || "Select drop location"}</p>
                      </div>
                    </div>
                  )}
                </div>

                {fromLocation && (bookingMode === "day" && dayTripScope === "local" ? true : !!toLocation) && (
                  <div className="pt-6 border-t border-white/10 space-y-2">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Estimated Total</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">₹{currentFare.price.toLocaleString('en-IN')}</p>
                    <p className="text-[8px] font-black uppercase text-emerald-300 opacity-80 tracking-widest">{currentFare.breakdown.extraInfo}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Fully Insured Travel</span>
              </div>
              <p className="text-[10px] font-medium opacity-40 leading-relaxed">
                By proceeding, you agree to Vizag Taxi terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content - Stepper */}
        <div className="flex-1 lg:w-2/3 flex flex-col relative bg-white overflow-hidden min-h-0">
          {/* Header */}
          <div className="px-8 lg:px-12 py-8 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                    step >= s ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    {s}
                  </div>
                  {s < 3 && <div className={cn("w-4 h-0.5 rounded-full", step > s ? "bg-emerald-600" : "bg-slate-100")} />}
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 lg:p-12 space-y-8"
                >
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tight text-slate-900">Where are you going?</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select your route for accurate pricing</p>
                  </div>

                  <div className="space-y-6">
                    {/* Booking Mode toggles within modal */}
                    <div className="flex bg-slate-50 border border-slate-200/50 p-1.5 rounded-2xl w-full max-w-md">
                      <button
                        type="button"
                        onClick={() => setBookingMode("km")}
                        className={cn(
                          "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                          bookingMode === "km" ? "bg-white text-emerald-600 shadow-md border border-slate-100" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        Book for KM
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingMode("day")}
                        className={cn(
                          "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                          bookingMode === "day" ? "bg-white text-emerald-600 shadow-md border border-slate-100" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        Book for Day
                      </button>
                    </div>

                    {bookingMode === "day" && (
                      <div className="flex bg-slate-100/50 p-1 rounded-xl w-full max-w-xs items-center">
                        <button
                          type="button"
                          onClick={() => setDayTripScope("local")}
                          className={cn("flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all text-center", dayTripScope === "local" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}
                        >
                          Local Cabs
                        </button>
                        <button
                          type="button"
                          onClick={() => setDayTripScope("outstation")}
                          className={cn("flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all text-center", dayTripScope === "outstation" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}
                        >
                          Outstations
                        </button>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Pickup Location input with autocomplete suggestions */}
                      <div className="relative" ref={fromContainerRef}>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Pickup Location</label>
                        <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            placeholder="Type Zip Code, Area, or Railway Station..."
                            value={fromLocation}
                            onChange={handleFromChange}
                            onFocus={() => setShowFromSuggestions(true)}
                            className="w-full h-18 bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-12 font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-350"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isFromLoading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
                            {fromLocation && (
                              <button onClick={() => { setFromLocation(""); setFromSuggestions(POPULAR_PICKUPS); setShowFromSuggestions(true); }} className="text-slate-400 hover:text-slate-600 font-bold text-base">×</button>
                            )}
                          </div>
                        </div>

                        {/* Autocomplete Dropdown overlaying everything */}
                        <AnimatePresence>
                          {showFromSuggestions && fromSuggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto no-scrollbar z-[200]"
                            >
                              {fromSuggestions.map((s, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleSelectFrom(s)}
                                  className="w-full px-5 py-4 text-left hover:bg-emerald-50 transition-colors flex items-start gap-3 border-b border-slate-50 last:border-0"
                                >
                                  <MapPin className="w-4 h-4 mt-1 text-emerald-500 shrink-0" />
                                  <div className="flex flex-col min-w-0 flex-1 pr-2">
                                    <span className="text-xs font-black text-slate-800 line-clamp-1">
                                      {s.display_name.split(",")[0]}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 line-clamp-1 uppercase tracking-wider mt-0.5">
                                      {[
                                        s.address?.suburb,
                                        s.address?.city || s.address?.town,
                                        s.address?.state,
                                        s.address?.postcode
                                      ].filter(Boolean).slice(1).join(", ")}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Drop Location input with autocomplete suggestions */}
                      {!(bookingMode === "day" && dayTripScope === "local") && (
                        <div className="relative" ref={toContainerRef}>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Drop Location</label>
                          <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-600">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <input
                              type="text"
                              placeholder="Type Dropoff Location..."
                              value={toLocation}
                              onChange={handleToChange}
                              onFocus={() => setShowToSuggestions(true)}
                              className="w-full h-18 bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-12 font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-350"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              {isToLoading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
                              {toLocation && (
                                <button onClick={() => { setToLocation(""); setToSuggestions(LOCAL_SUGGESTIONS); setShowToSuggestions(true); }} className="text-slate-400 hover:text-slate-600 font-bold text-base">×</button>
                              )}
                            </div>
                          </div>

                          {/* Autocomplete Dropdown overlaying everything */}
                          <AnimatePresence>
                            {showToSuggestions && toSuggestions.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto no-scrollbar z-[200]"
                              >
                                {toSuggestions.map((s, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSelectTo(s)}
                                    className="w-full px-5 py-4 text-left hover:bg-emerald-50 transition-colors flex items-start gap-3 border-b border-slate-50 last:border-0"
                                  >
                                    <MapPin className="w-4 h-4 mt-1 text-orange-500 shrink-0" />
                                    <div className="flex flex-col min-w-0 flex-1 pr-2">
                                      <span className="text-xs font-black text-slate-800 line-clamp-1">
                                        {s.display_name.split(",")[0]}
                                      </span>
                                      <span className="text-[9px] font-bold text-slate-400 line-clamp-1 uppercase tracking-wider mt-0.5">
                                        {[
                                          s.address?.suburb,
                                          s.address?.city || s.address?.town,
                                          s.address?.state,
                                          s.address?.postcode
                                        ].filter(Boolean).slice(1).join(", ")}
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Package / Days Selectors */}
                      {bookingMode === "day" && (
                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                          {dayTripScope === "local" ? (
                            <>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Hourly Package</label>
                                <div className="relative group">
                                  <select
                                    value={localPackage}
                                    onChange={(e) => setLocalPackage(e.target.value)}
                                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-5 text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                  >
                                    <option>8 Hours / 80 KM</option>
                                    <option>10 Hours / 100 KM</option>
                                    <option>12 Hours / 120 KM</option>
                                  </select>
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">&#9662;</div>
                                </div>
                              </div>

                              <div className="space-y-2">
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
                            </>
                          ) : (
                            <>
                              <div className="space-y-2">
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

                              <div className="space-y-2">
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
                            </>
                          )}
                        </div>
                      )}

                      {bookingMode === "km" && (
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Trip Type</label>
                            <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-xl w-full h-11 items-center">
                              <button type="button" onClick={() => setTripType("one-way")} className={cn("flex-1 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", tripType === "one-way" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}>One Way</button>
                              <button type="button" onClick={() => setTripType("round-trip")} className={cn("flex-1 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", tripType === "round-trip" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400")}>Round Trip</button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
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

                            <div className="space-y-2">
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
                        </div>
                      )}
                    </div>

                    {/* Realtime Route Map plotting inside Modal */}
                    {fromLocation && !(bookingMode === "day" && dayTripScope === "local") && toLocation ? (
                      <div className="relative h-60 rounded-[2rem] bg-slate-100 overflow-hidden border border-slate-200 group">
                        <iframe
                          ref={mapRef}
                          srcDoc={mapSrcDoc}
                          className="w-full h-full border-none rounded-[2rem]"
                          title="Route Map"
                        />
                        {isLoadingRoute && (
                          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center z-20">
                            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 flex bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-100 z-20 text-[9px] font-black uppercase tracking-widest">
                          <button type="button" onClick={() => setMapMode("map")} className={cn("px-2.5 py-1.5 rounded-lg transition-all", mapMode === "map" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-900")}>Map</button>
                          <button type="button" onClick={() => setMapMode("satellite")} className={cn("px-2.5 py-1.5 rounded-lg transition-all", mapMode === "satellite" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-900")}>Sat</button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-60 rounded-[2rem] bg-slate-100 overflow-hidden border border-slate-200 group">
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/83.3,17.7,11,0/1200x600?access_token=pk.eyJ1IjoicHJhZ2huZWFyIiwiYSI6ImNrcWwwamU1czAwaDUyb28waWwwamU1czAifQ.F_F0_v_v_v_v_v_v_v_v_v_v')] bg-cover bg-center opacity-85 group-hover:scale-105 transition-transform duration-1000 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
                        
                        {fromLocation && (
                          <div className="absolute top-1/3 left-1/3 animate-bounce">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 border-4 border-white">
                              <MapPin className="w-5 h-5" />
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4 glass px-4 py-2 rounded-xl border border-white/50 shadow-xl">
                          <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Interactive Map View</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 lg:p-12 space-y-8"
                >
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tight text-slate-900">Confirm Booking</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Check details before payment</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[2rem] bg-emerald-50/50 border border-emerald-500/10 space-y-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Pricing Breakdown</p>
                        <Info className="w-4 h-4 text-emerald-600" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-baseline border-b border-emerald-500/10 pb-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase">Base Package Price</span>
                          <span className="text-base font-black text-slate-900">₹{currentFare.breakdown.base.toLocaleString('en-IN')}</span>
                        </div>
                        {currentFare.breakdown.bhatta > 0 && (
                          <div className="flex justify-between items-baseline border-b border-emerald-500/10 pb-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Driver Bhatta Allowance</span>
                            <span className="text-base font-black text-slate-900">₹{currentFare.breakdown.bhatta.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-baseline pt-2">
                          <span className="text-xs font-black text-emerald-700 uppercase">Total Estimated Fare</span>
                          <span className="text-3xl font-black text-emerald-600 tracking-tighter">₹{currentFare.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      
                      <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                        Includes fuel, driver allowance, and basic maintenance. Toll charges & parking fees are completely excluded.
                      </p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trip Metrics</p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                          <span className="text-xs font-bold text-slate-600">Route Distance</span>
                          <span className="text-xs font-black text-slate-900 uppercase">
                            {bookingMode === "day" && dayTripScope === "local" ? `${currentFare.distance} KM Limit` : `~${currentFare.distance} KM`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                          <span className="text-xs font-bold text-slate-600">Expected Time</span>
                          <span className="text-xs font-black text-slate-900 uppercase">
                            {bookingMode === "day" && dayTripScope === "local" ? `${localPackage.split("/")[0].trim()}` : currentFare.time}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-600">Package Type</span>
                          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                            {bookingMode === "day" ? (dayTripScope === "local" ? "Hourly Rental" : `${calculatedDays} Days Trip`) : "KM Package"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 italic">Vizag Taxi Satisfaction Guarantee</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Full refund if cancelled before 4 hours</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 lg:p-12 space-y-8 h-full flex flex-col"
                >
                  <div className="space-y-2 text-center lg:text-left">
                    <h3 className="text-3xl font-black tracking-tight text-slate-900">Secure Payment</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select your preferred method</p>
                  </div>

                  {errorMessage && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-xs font-bold">
                      <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 animate-pulse" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {paymentSuccess ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex-1 flex flex-col items-center justify-center space-y-6"
                    >
                      <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <div className="text-center space-y-2">
                        <h4 className="text-2xl font-black text-slate-900">Booking Confirmed!</h4>
                        <p className="text-slate-500 font-bold italic">Your ride is scheduled. Driver details will be sent soon.</p>
                      </div>
                      <Button
                        onClick={onClose}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-12 h-14 font-black uppercase tracking-widest"
                      >
                        Great!
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      {/* Guest Details Form */}
                      <div className="space-y-4 p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Primary Guest Details</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Please provide passenger contact information</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest ml-1">Full Name *</label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                              <input
                                type="text"
                                placeholder="Passenger Name"
                                value={passengerName}
                                onChange={(e) => setPassengerName(e.target.value)}
                                className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest ml-1">Phone Number *</label>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                              <input
                                type="tel"
                                placeholder="10-digit Phone"
                                value={passengerPhone}
                                onChange={(e) => setPassengerPhone(e.target.value)}
                                className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest ml-1">Email Address *</label>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                              <input
                                type="email"
                                placeholder="Email Address"
                                value={passengerEmail}
                                onChange={(e) => setPassengerEmail(e.target.value)}
                                className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: 'upi', icon: Smartphone, title: 'UPI / GPay', desc: 'Scan & Pay instantly' },
                          { id: 'card', icon: CreditCard, title: 'Credit / Debit Card', desc: 'Visa, Master, Amex' }
                        ].map((m) => (
                          <button key={m.id} className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left space-y-2 group">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-white transition-all">
                              <m.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{m.title}</p>
                              <p className="text-[10px] font-bold text-slate-400 italic">{m.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Vehicle Specific Dynamic Terms & Conditions */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                            <Info className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Terms & Conditions ({vehicle.model})</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Please review before proceeding</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {getFormattedVehicleTermsList(vehicle.slug, vehicle.model, vehicle.pax, tripType).map((term, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100/50">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{term}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setTermsAccepted(!termsAccepted)}
                          className={cn(
                            "w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left",
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
                          <p className="text-xs font-black">I agree to the vehicle-specific Terms of Service and Cancellation Policy.</p>
                        </button>
                      </div>

                      <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
                        <div className="flex items-center justify-between mb-8">
                          <Lock className="w-5 h-5 text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Secure Checkout</span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Amount to Pay</p>
                            <p className="text-4xl font-black">₹{currentFare.price.toLocaleString('en-IN')}</p>
                          </div>

                          <Button
                            onClick={handlePayment}
                            disabled={isProcessing || !termsAccepted || !passengerName.trim() || !passengerPhone.trim() || !passengerEmail.trim()}
                            className={cn(
                              "w-full h-16 rounded-2xl font-black text-lg transition-all shadow-2xl border-none group-hover:scale-[1.02]",
                              termsAccepted && !isProcessing && passengerName.trim() && passengerPhone.trim() && passengerEmail.trim()
                                ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20"
                                : "bg-emerald-500/30 text-white/50 cursor-not-allowed"
                            )}
                          >
                            {isProcessing ? (
                              <div className="flex items-center gap-3 justify-center">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                                Processing...
                              </div>
                            ) : "Pay Now & Confirm"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          {!paymentSuccess && (
            <div className="px-8 lg:px-12 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={cn(
                  "flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all",
                  step === 1 ? "opacity-0 pointer-events-none" : "text-slate-400 hover:text-slate-900"
                )}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {step < 3 && (
                <Button
                  onClick={handleNext}
                  disabled={step === 1 && (!fromLocation || (bookingMode === "day" && dayTripScope === "local" ? false : !toLocation))}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/10 active:scale-95 flex items-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingFlowModal;
