"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, Calendar, CheckCircle2,
  AlertCircle, ChevronRight, ChevronLeft,
  Users, Info, ShieldCheck, Share2,
  Camera, ArrowLeft, MessageCircle,
  Phone, User, CreditCard, Star,
  Zap, Ticket, Car, Bus, Fuel, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GROUP_TOURS_DATA, GroupTour } from "@/lib/tours";
import { getFormattedVehicleTermsList } from "@/lib/rates";
import { createBooking, createPaymentOrder, verifyPayment, loadRazorpay } from "@/lib/api";

const GroupTourDetailsPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const tour = GROUP_TOURS_DATA[slug];

  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "highlights" | "included">("overview");
  const [policyTab, setPolicyTab] = useState<"cancellation" | "vehicle" | "other">("cancellation");
  const [bookingStep, setBookingStep] = useState<"details" | "seats" | "checkout">("details");
  const [selectedSeats, setSelectedSeats] = useState<Record<number, string>>({});
  const [gender, setGender] = useState<string>("male");
  const [passengerDetails, setPassengerDetails] = useState<Record<string, { name: string; age: string; gender: string }>>({});
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const BOOKED_SEATS = [4, 7, 10];
  const RESERVED_SEATS = [12, 15];

  // Map and Route States
  const [mapMode, setMapMode] = useState<"map" | "satellite">("map");
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [calculatedDistance, setCalculatedDistance] = useState<number>(0);
  const [calculatedDuration, setCalculatedDuration] = useState<string>("");
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
  const [routeError, setRouteError] = useState<string>("");
  const mapRef = useRef<HTMLIFrameElement>(null);

  // Vehicle Selection States
  const [selectedVehicle, setSelectedVehicle] = useState<string>("tempo-traveller");
  const [bookingType, setBookingType] = useState<"per-seat" | "full-vehicle">("per-seat");

  // Coordinates Mapping
  const selectedFrom = useMemo(() => ({ name: "Akkayapalem, Visakhapatnam", lat: 17.7289, lon: 83.3015 }), []);
  
  const selectedTo = useMemo(() => {
    switch (slug) {
      case "arasavalli-group-tour":
        return { name: "Arasavalli Temple, Srikakulam", lat: 18.2934, lon: 83.9015 };
      case "vizag-to-pithapuram":
        return { name: "Kukkuteswara Swamy Temple, Pithapuram", lat: 17.1147, lon: 82.2612 };
      case "araku-group-trip":
        return { name: "Araku Valley", lat: 18.3333, lon: 82.8667 };
      case "lambasingi-group-trip":
        return { name: "Lambasingi", lat: 17.8183, lon: 82.5283 };
      default:
        return { name: "Arasavalli Temple, Srikakulam", lat: 18.2934, lon: 83.9015 };
    }
  }, [slug]);

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
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(selectedFrom.lat * Math.PI / 180) * Math.cos(selectedTo.lat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const dist = Math.round(R * c);
        // Fallback mapping
        const fallbackDistance = slug === "arasavalli-group-tour" ? 120 : slug === "vizag-to-pithapuram" ? 125 : slug === "araku-group-trip" ? 115 : 105;
        setCalculatedDistance(dist || fallbackDistance);
        setCalculatedDuration("Calculated");
        setRouteCoordinates([[selectedFrom.lat, selectedFrom.lon], [selectedTo.lat, selectedTo.lon]]);
      } finally {
        setIsLoadingRoute(false);
      }
    };
    getRoute();
  }, [selectedFrom, selectedTo, slug]);

  // Update map layer inside iframe
  useEffect(() => {
    if (mapRef.current && mapRef.current.contentWindow && selectedFrom.lat && selectedTo.lat) {
      mapRef.current.contentWindow.postMessage({
        type: 'UPDATE_ROUTE',
        from: selectedFrom,
        to: selectedTo,
        coordinates: routeCoordinates
      }, '*');
      
      mapRef.current.contentWindow.postMessage({
        type: 'SET_TILE',
        mode: mapMode
      }, '*');
    }
  }, [selectedFrom, selectedTo, routeCoordinates, mapMode, isLoadingRoute]);

  const toggleSeat = (id: number) => {
    if (BOOKED_SEATS.includes(id) || RESERVED_SEATS.includes(id)) return;
    
    setSelectedSeats(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = gender || "male";
      }
      return next;
    });
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.step) {
        setBookingStep(e.state.step);
      } else {
        setBookingStep("details");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update history only when moving forward
  const changeStep = (newStep: "details" | "seats" | "checkout") => {
    window.history.pushState({ step: newStep }, "");
    setBookingStep(newStep);
  };

  const farePerSeat = parseInt(tour.fare.replace(/[^0-9]/g, ""));
  const vehiclePricePerKm = selectedVehicle === "urbania" ? 40 : 35;
  const totalFullVehicleFare = calculatedDistance * 2 * vehiclePricePerKm;

  const totalFare = useMemo(() => {
    if (bookingType === "full-vehicle") {
      return totalFullVehicleFare;
    }
    return Object.keys(selectedSeats).length * farePerSeat;
  }, [bookingType, totalFullVehicleFare, selectedSeats, farePerSeat]);

  const handleGroupBooking = async () => {
    setIsProcessing(true);
    setErrorMessage("");
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please verify your internet connection.");
      }

      const passengerNames = Object.values(passengerDetails).map(p => p.name).filter(Boolean).join(", ");
      const bookingRes = await createBooking({
        customer_name: passengerNames || "Guest",
        customer_email: contactEmail,
        customer_phone: contactPhone,
        booking_type: "group_tour",
        total_amount: totalFare,
        actual_total_amount: totalFare,
        amount_paid: totalFare,
        payment_percentage: 100,
        special_requests: `Seats: ${Object.keys(selectedSeats).join(", ")}. Gender: ${gender}`,
        group_tour_id: tour.title,
        travel_date: new Date(tour.journeyDate).toISOString().split("T")[0]
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
        description: `Group Tour: ${tour.title}`,
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
          name: passengerNames || "Guest",
          email: contactEmail,
          contact: contactPhone,
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

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Group Tour Not Found</h2>
        <Link href="/" className="text-emerald-600 font-bold hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pt-28 lg:pt-32">
      {/* Search Route Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-8">
        <div className="bg-white border border-slate-100 rounded-[2rem] px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Route Information</h2>
              <p className="text-[11px] font-bold text-slate-900 mt-0.5">
                {tour.pickup} • {new Date(tour.journeyDate).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-')}
              </p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {bookingStep === "details" ? (
            <>
              {/* Main Content (Left) */}
              <div className="flex-1 space-y-8">

                {/* Gallery Grid */}
                <div className="grid grid-cols-12 gap-3 aspect-[16/9] lg:aspect-[21/10]">
                  <div className="col-span-8 relative rounded-[2rem] overflow-hidden border border-slate-200">
                    <Image src={tour.images[0]} alt={tour.title} fill className="object-cover" />
                    <div className="absolute top-6 left-6 bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl uppercase tracking-widest flex items-center gap-2 backdrop-blur-md bg-emerald-600/90">
                      <Camera className="w-3.5 h-3.5" />
                      1 / {tour.images.length}
                    </div>
                  </div>
                  <div className="col-span-4 flex flex-col gap-3">
                    <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-slate-200">
                      <Image src={tour.images[1]} alt={tour.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-slate-200">
                      <Image src={tour.images[2]} alt={tour.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white cursor-pointer hover:bg-slate-900/50 transition-all">
                        <Camera className="w-6 h-6 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">View All Images</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tour Title & Badges */}
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">{tour.title}</h1>
                    <div className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
                      <Zap className="w-3.5 h-3.5" />
                      Save up to 60%
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Pickup Point
                      </p>
                      <p className="text-sm font-black text-slate-900">Akkayapalem</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Journey Date
                      </p>
                      <p className="text-sm font-black text-slate-900">{new Date(tour.journeyDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Ticket className="w-3.5 h-3.5 text-emerald-500" /> Fare Starts
                      </p>
                      <p className="text-sm font-black text-slate-900">₹{tour.fare} / seat</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" /> Timing
                      </p>
                      <p className="text-sm font-black text-slate-900">05:30 AM - 08:30 PM</p>
                    </div>
                  </div>
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
                      Rates for {calculatedDistance * 2} Kms round-trip distance | {calculatedDuration} approx duration
                    </p>
                  </div>
                </div>

                {/* Content Tabs */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex border-b border-slate-100 px-6 lg:px-8 overflow-x-auto scrollbar-hide flex-nowrap">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "itinerary", label: "Itinerary" },
                      { id: "highlights", label: "Highlights" },
                      { id: "included", label: "What's Included" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          "px-6 py-6 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap flex-shrink-0",
                          activeTab === tab.id ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div layoutId="tab-underline-group" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="p-8 lg:p-12">
                    <AnimatePresence mode="wait">
                      {activeTab === "overview" && (
                        <motion.div
                          key="overview"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-10"
                        >
                          <div className="flex flex-wrap gap-8">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <Car className="w-5 h-5" />
                              </div>
                              <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Transfer Included</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <Camera className="w-5 h-5" />
                              </div>
                              <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Sightseeing Included</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <MapPin className="w-5 h-5" />
                              </div>
                              <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Pickup Included</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <MapPin className="w-5 h-5" />
                              </div>
                              <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Drop Included</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                            <Users className="w-5 h-5 text-emerald-600" />
                            <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">
                              {tour.availableSeats} seats available • Group tour by {tour.vehicleType}
                            </p>
                          </div>

                          <p className="text-lg text-slate-600 font-bold leading-relaxed opacity-90 italic">
                            "{tour.description}"
                          </p>
                        </motion.div>
                      )}

                      {activeTab === "itinerary" && (
                        <motion.div
                          key="itinerary"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-12"
                        >
                          {tour.itinerary.map((item, idx) => (
                            <div key={idx} className="flex gap-8">
                              <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-xl shadow-emerald-600/20">
                                  DAY {item.day}
                                </div>
                                {idx !== tour.itinerary.length - 1 && <div className="w-1 flex-1 bg-emerald-50 rounded-full my-4" />}
                              </div>
                              <div className="pb-12 space-y-6 flex-1">
                                <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">{item.title}</h4>
                                <div className="grid gap-4">
                                  {item.activities.map((activity, aIdx) => (
                                    <div key={aIdx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                                      <span className="text-sm text-slate-600 font-bold leading-relaxed">{activity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {activeTab === "highlights" && (
                        <motion.div
                          key="highlights"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="grid md:grid-cols-2 gap-6"
                        >
                          {tour.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-start gap-5 p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50 group hover:bg-white hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-600/5 transition-all">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                              <span className="text-base font-black text-slate-800 tracking-tight">{highlight}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {activeTab === "included" && (
                        <motion.div
                          key="included"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="grid md:grid-cols-2 gap-12"
                        >
                          <div className="space-y-8">
                            <h4 className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5" /> What's Included
                            </h4>
                            <ul className="space-y-4">
                              {tour.included.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-emerald-50/30 transition-colors">
                                  <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-bold text-slate-700 leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-8">
                            <h4 className="text-rose-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                              <AlertCircle className="w-5 h-5" /> Not Included
                            </h4>
                            <ul className="space-y-4">
                              {tour.notIncluded.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-rose-50/30 transition-colors">
                                  <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 flex-shrink-0 mt-0.5">
                                    <span className="text-[10px] font-black">✕</span>
                                  </div>
                                  <span className="text-sm font-bold text-slate-700 leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Vehicle & Booking Policy */}
                <div className="bg-white rounded-[2.5rem] p-10 lg:p-12 border border-slate-100 shadow-sm space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600">
                      <Info className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Vehicle & Booking Policy</h3>
                  </div>
                  <div className="space-y-6">
                    <p className="text-sm font-bold text-slate-500 leading-relaxed">
                      We assign vehicles based on confirmed passengers:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { count: "10-17", vehicle: "Tempo Traveller" },
                        { count: "7", vehicle: "Innova Crysta" },
                        { count: "5-6", vehicle: "Ertiga" },
                        { count: "1-4", vehicle: "Sedan" }
                      ].map((policy, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-sm font-black text-slate-800">{policy.count} Passengers:</span>
                          <span className="text-sm font-bold text-slate-600">{policy.vehicle}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl space-y-3">
                      <p className="text-sm font-black text-orange-900 leading-relaxed">
                        Minimum 4 bookings required.
                      </p>
                      <p className="text-xs font-bold text-orange-800 leading-relaxed opacity-80">
                        If fewer than 4 bookings are confirmed 24h before departure, we'll contact you. Choose from: full refund, reschedule, or upgrade to a private tour.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar (Right) */}
              <div className="lg:w-[400px]">
                <div className="sticky top-32 space-y-8">
                  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-all" />
                    
                    {/* Booking Type Selector */}
                    <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] relative z-10">
                      <button
                        onClick={() => setBookingType("per-seat")}
                        className={cn(
                          "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                          bookingType === "per-seat"
                            ? "bg-white text-emerald-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        Book Seats
                      </button>
                      <button
                        onClick={() => setBookingType("full-vehicle")}
                        className={cn(
                          "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                          bookingType === "full-vehicle"
                            ? "bg-white text-emerald-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        Rent Vehicle
                      </button>
                    </div>

                    {bookingType === "per-seat" ? (
                      <>
                        <div className="space-y-2 relative z-10">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Star className="w-3.5 h-3.5 text-emerald-500" /> Shared Group Tour
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900 tracking-tight">₹{tour.fare}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ per seat</span>
                          </div>
                          <p className="text-xs font-bold text-slate-500">Book individual seats on a shared A/C Tempo Traveller.</p>
                        </div>

                        <button
                          onClick={() => changeStep("seats")}
                          className="w-full py-6 rounded-2xl bg-emerald-600 text-white text-sm font-black uppercase tracking-[0.2em] hover:bg-emerald-700 shadow-2xl shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group/btn relative z-10"
                        >
                          <Users className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          Select Seats
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <div className="space-y-6 relative z-10">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Car className="w-3.5 h-3.5 text-emerald-500" /> Private Charter Rental
                          </p>
                          <p className="text-xs font-bold text-slate-500 mt-1">Hire the entire luxury vehicle for your private group.</p>
                        </div>

                        {/* Exclusive Fleet Options */}
                        <div className="space-y-4">
                          {[
                            {
                              id: "tempo-traveller",
                              name: "Tempo Traveller",
                              seats: 17,
                              rate: 35,
                              desc: "Pushback seats, premium audio, A/C",
                              emoji: "🚐"
                            },
                            {
                              id: "urbania",
                              name: "Force Urbania",
                              seats: 16,
                              rate: 40,
                              desc: "Ultra-luxury, wide window view, dual A/C",
                              emoji: "🚌"
                            }
                          ].map((vehicle) => {
                            const vehicleTotal = calculatedDistance * 2 * vehicle.rate;
                            const perHead = Math.round(vehicleTotal / vehicle.seats);
                            const isSelected = selectedVehicle === vehicle.id;

                            return (
                              <button
                                key={vehicle.id}
                                onClick={() => {
                                  setSelectedVehicle(vehicle.id);
                                  changeStep("seats");
                                }}
                                className={cn(
                                  "w-full p-5 rounded-[1.8rem] border text-left transition-all duration-300 relative overflow-hidden group/card active:scale-[0.98]",
                                  isSelected
                                    ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10"
                                    : "bg-slate-50 border-slate-100 hover:bg-emerald-50 hover:border-emerald-200"
                                )}
                              >
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{vehicle.emoji}</span>
                                    <div>
                                      <h4 className={cn("text-sm font-black uppercase tracking-tight", isSelected ? "text-white" : "text-slate-800")}>
                                        {vehicle.name}
                                      </h4>
                                      <p className={cn("text-[9px] font-bold mt-0.5", isSelected ? "text-slate-400" : "text-slate-500")}>
                                        {vehicle.seats} Seats • A/C
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={cn("text-xs font-black", isSelected ? "text-emerald-400" : "text-emerald-600")}>
                                      ₹{vehicle.rate}/KM
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 flex justify-between items-end">
                                  <div className="space-y-1">
                                    <p className={cn("text-[8px] font-black uppercase tracking-widest", isSelected ? "text-slate-400" : "text-slate-400")}>
                                      Estimated Total
                                    </p>
                                    <p className="text-lg font-black tracking-tight">
                                      ₹{vehicleTotal.toLocaleString('en-IN')}
                                    </p>
                                  </div>
                                  
                                  {/* Per Head split badge */}
                                  <div className={cn(
                                    "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm",
                                    isSelected
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  )}>
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    ₹{perHead}/head
                                  </div>
                                </div>

                                {/* Tap to book indicator */}
                                <div className={cn(
                                  "mt-3 pt-3 border-t flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors",
                                  isSelected ? "border-white/10 text-emerald-400" : "border-slate-100 text-slate-400 group-hover/card:text-emerald-600"
                                )}>
                                  <Users className="w-3 h-3" />
                                  Tap to Select Seats & Pay
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="space-y-6 pt-4">
                      <div className="flex items-center gap-4 text-slate-500 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">Secure Booking Guarantee</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-500 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                        <Clock className="w-5 h-5 text-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">Instant Confirmation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : bookingStep === "seats" ? (
            <div className="w-full space-y-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Seat Map (Left) */}
                <div className="flex-1 space-y-8">
                  <button 
                    onClick={() => setBookingStep("details")}
                    className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:border-emerald-200 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Tour Details
                  </button>

                  {/* Vehicle Selected Banner (for full-vehicle mode) */}
                  {bookingType === "full-vehicle" && (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 text-white">
                      <span className="text-2xl">{selectedVehicle === "urbania" ? "🚌" : "🚐"}</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Selected Vehicle</p>
                        <p className="text-sm font-black">{selectedVehicle === "urbania" ? "Force Urbania — 16 Seats" : "Tempo Traveller — 17 Seats"}</p>
                      </div>
                      <p className="text-sm font-black text-emerald-400">₹{totalFullVehicleFare.toLocaleString("en-IN")}</p>
                    </div>
                  )}

                  <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-sm space-y-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your gender (for female-only seats)</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full md:w-64 h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-emerald-500" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-rose-400" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Female only</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-blue-600" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-slate-200" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booked</span>
                        </div>
                      </div>
                    </div>

                    {/* Seat Grid Layout */}
                    <div className="bg-slate-50 rounded-[3rem] p-12 flex flex-col items-center border border-slate-100 max-w-2xl mx-auto">
                      <div className="mb-12">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex flex-col items-center justify-center text-white shadow-xl">
                          <User className="w-6 h-6" />
                          <span className="text-[8px] font-black uppercase mt-1">Driver</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <SeatButton 
                            id={1} 
                            status={BOOKED_SEATS.includes(1) ? "booked" : RESERVED_SEATS.includes(1) ? "reserved" : !!selectedSeats[1] ? "selected" : "available"}
                            onClick={() => toggleSeat(1)} 
                            price={tour.fare} 
                            gender={selectedSeats[1] || gender}
                          />
                        </div>
                        {/* Remaining Grid (4 seats per row) */}
                        <div className="grid grid-cols-4 gap-6">
                          {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(id => (
                            <SeatButton 
                              key={id} 
                              id={id} 
                              status={BOOKED_SEATS.includes(id) ? "booked" : RESERVED_SEATS.includes(id) ? "reserved" : !!selectedSeats[id] ? "selected" : "available"}
                              onClick={() => toggleSeat(id)} 
                              price={tour.fare} 
                              gender={selectedSeats[id] || gender}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Summary Sidebar (Right) */}
                <div className="lg:w-[400px] space-y-6">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Booking Summary</h3>

                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                        <p className="text-xs font-bold text-slate-600 leading-relaxed">{tour.pickup}</p>
                      </div>
                      <div className="flex gap-4">
                        <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                        <p className="text-xs font-bold text-slate-600">{new Date(tour.journeyDate).toDateString()}</p>
                      </div>
                      <div className="flex gap-4">
                        <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                        <p className="text-xs font-bold text-slate-600">Boarding: NAD (05:30)</p>
                      </div>
                      <div className="flex gap-4">
                        <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                        <p className="text-xs font-bold text-slate-600">
                          Seats: {Object.keys(selectedSeats).length > 0 ? Object.keys(selectedSeats).sort((a, b) => Number(a) - Number(b)).join(", ") : "None selected"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">Total</span>
                      <span className="text-2xl font-black text-slate-900">₹{totalFare.toLocaleString('en-IN')}</span>
                    </div>

                    <button
                      disabled={Object.keys(selectedSeats).length === 0}
                      onClick={() => changeStep("checkout")}
                      className={cn(
                        "w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl",
                        Object.keys(selectedSeats).length > 0
                          ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      Confirm Booking
                    </button>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-4 text-slate-500">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Secure Booking</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                      <Clock className="w-5 h-5 text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Instant Confirmation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy Section */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-100 px-8">
                  {[
                    { id: "cancellation", label: "Cancellation", icon: Ticket },
                    { id: "vehicle", label: "Vehicle & Booking", icon: Info },
                    { id: "other", label: "Other", icon: ShieldCheck }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPolicyTab(tab.id as any)}
                      className={cn(
                        "px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2",
                        policyTab === tab.id ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {policyTab === tab.id && (
                        <motion.div layoutId="policy-underline" className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-8 lg:p-12">
                  {policyTab === "cancellation" && (
                    <div className="space-y-8">
                      <h4 className="text-xl font-black text-slate-900 uppercase">Cancellation policy</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-bold text-slate-600">
                          <thead className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                            <tr>
                              <th className="pb-4">Time before travel</th>
                              <th className="pb-4">Deduction</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            <tr><td className="py-4">More than 24 hours</td><td className="py-4">15% of seat fare</td></tr>
                            <tr><td className="py-4">12-24 hours before departure</td><td className="py-4">20% of seat fare</td></tr>
                            <tr><td className="py-4">6-12 hours before departure</td><td className="py-4">50% of seat fare</td></tr>
                            <tr><td className="py-4">Less than 6 hours</td><td className="py-4 text-rose-500">100% (no refund)</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <ul className="space-y-3 text-[11px] text-slate-500 font-bold list-disc pl-4 opacity-75">
                        <li>Cancellation charges are computed on a per-seat basis.</li>
                        <li>Ticket cannot be cancelled after scheduled departure from the first boarding point.</li>
                        <li>For group bookings, individual seats can be cancelled.</li>
                      </ul>
                    </div>
                  )}
                  {policyTab === "vehicle" && (
                    <div className="space-y-6">
                      <h4 className="text-xl font-black text-slate-900 uppercase">Vehicle Information</h4>
                      <p className="text-sm font-bold text-slate-500 leading-relaxed max-w-2xl">
                        We prioritize passenger comfort. If the minimum booking requirement is met, a Tempo Traveller or Urbania will be deployed. For smaller groups, high-end SUVs like Innova Crysta or Ertiga will be assigned.
                      </p>
                    </div>
                  )}
                  {policyTab === "other" && (
                    <div className="space-y-6">
                      <h4 className="text-xl font-black text-slate-900 uppercase">Other Rules</h4>
                      <p className="text-sm font-bold text-slate-500 leading-relaxed max-w-2xl">
                        Please carry a valid ID proof. Report to the boarding point 15 minutes before scheduled time. Alcohol and smoking are strictly prohibited inside the vehicle.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-xl font-black tracking-tight relative">Need help with booking?</h4>
                <p className="text-sm font-bold text-slate-400 leading-relaxed relative">
                  Our travel experts are available 24/7 to help you plan your spiritual journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 relative">
                  <a href="tel:+919111989222" className="flex-1 flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold">+91 9111989222</span>
                  </a>
                  <a href="https://wa.me/919111989222" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold">Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ) : bookingSuccess ? (
            <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Booking Confirmed!</h2>
                <p className="text-slate-500 font-bold italic text-sm leading-relaxed">
                  Thank you for choosing NRK Travels. We have received your payment. Your tickets have been reserved.
                </p>
              </div>
              <div className="bg-slate-50 rounded-3xl p-8 space-y-4 text-left border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-500 pb-3 border-b border-slate-100">
                  <span>Tour Package</span>
                  <span className="text-slate-900 font-black">{tour.title}</span>
                </div>
                {bookingType !== "full-vehicle" && (
                  <div className="flex justify-between text-xs font-bold text-slate-500 pb-3 border-b border-slate-100">
                    <span>Reserved Seats</span>
                    <span className="text-slate-900 font-black">{Object.keys(selectedSeats).sort((a,b) => Number(a)-Number(b)).join(", ")}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold text-slate-500 pb-3 border-b border-slate-100">
                  <span>Travel Date</span>
                  <span className="text-slate-900 font-black">{new Date(tour.journeyDate).toDateString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Amount Paid (INR)</span>
                  <span className="text-emerald-600 font-black">₹{totalFare.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center w-full h-16 rounded-2xl bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-center gap-4 text-rose-800 text-xs font-bold shadow-sm">
                  <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 animate-pulse" />
                  <span>{errorMessage}</span>
                </div>
              )}
              <button 
                onClick={() => {
                  if (bookingType === "full-vehicle") {
                    setBookingStep("details");
                  } else {
                    setBookingStep("seats");
                  }
                }}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:border-emerald-200 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </div>
                {bookingType === "full-vehicle" ? "Back to Tour Details" : "Back to Seat Selection"}
              </button>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Passenger Forms (Left) */}
                <div className="flex-1 space-y-6">
                  <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase">
                          {bookingType === "full-vehicle" ? "Primary Guest Details" : "Passenger Information"}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {bookingType === "full-vehicle" ? "Enter details for the primary passenger" : `Enter details for ${Object.keys(selectedSeats).length} travelers`}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-12">
                      {bookingType === "full-vehicle" ? (
                        <div className="relative pt-8 border-t border-slate-50 first:border-0 first:pt-0">
                          <div className="absolute -top-3 left-0 px-4 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                            Primary Traveler
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                              <input 
                                type="text" 
                                placeholder="Enter name"
                                value={passengerDetails["primary"]?.name || ""}
                                onChange={(e) => setPassengerDetails({
                                  ...passengerDetails,
                                  primary: { ...passengerDetails["primary"], name: e.target.value, age: passengerDetails["primary"]?.age || "", gender: passengerDetails["primary"]?.gender || "male" }
                                })}
                                className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</label>
                              <input 
                                type="number" 
                                placeholder="Age"
                                value={passengerDetails["primary"]?.age || ""}
                                onChange={(e) => setPassengerDetails({
                                  ...passengerDetails,
                                  primary: { ...passengerDetails["primary"], age: e.target.value, name: passengerDetails["primary"]?.name || "", gender: passengerDetails["primary"]?.gender || "male" }
                                })}
                                className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                              <select 
                                value={passengerDetails["primary"]?.gender || "male"}
                                onChange={(e) => setPassengerDetails({
                                  ...passengerDetails,
                                  primary: { ...passengerDetails["primary"], gender: e.target.value, name: passengerDetails["primary"]?.name || "", age: passengerDetails["primary"]?.age || "" }
                                })}
                                className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ) : (
                        Object.keys(selectedSeats).sort((a,b) => Number(a)-Number(b)).map((seatId, index) => (
                          <div key={seatId} className="relative pt-8 border-t border-slate-50 first:border-0 first:pt-0">
                            <div className="absolute -top-3 left-0 px-4 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                              Seat S{seatId} — {selectedSeats[Number(seatId)]}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                <input 
                                  type="text" 
                                  placeholder="Enter name"
                                  value={passengerDetails[seatId]?.name || ""}
                                  onChange={(e) => setPassengerDetails({ 
                                    ...passengerDetails, 
                                    [seatId]: { name: e.target.value, age: passengerDetails[seatId]?.age || "", gender: passengerDetails[seatId]?.gender || selectedSeats[Number(seatId)] } 
                                  })}
                                  className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</label>
                                <input 
                                  type="number" 
                                  placeholder="Age"
                                  value={passengerDetails[seatId]?.age || ""}
                                  onChange={(e) => setPassengerDetails({ 
                                    ...passengerDetails, 
                                    [seatId]: { name: passengerDetails[seatId]?.name || "", age: e.target.value, gender: passengerDetails[seatId]?.gender || selectedSeats[Number(seatId)] } 
                                  })}
                                  className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                                <select 
                                  value={passengerDetails[seatId]?.gender || selectedSeats[Number(seatId)]}
                                  onChange={(e) => setPassengerDetails({ 
                                    ...passengerDetails, 
                                    [seatId]: { name: passengerDetails[seatId]?.name || "", age: passengerDetails[seatId]?.age || "", gender: e.target.value } 
                                  })}
                                  className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                >
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase">Contact Details</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">For booking confirmation</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                        <input 
                          type="tel" 
                          placeholder="+91"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="example@gmail.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase">Terms & Conditions</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Please review before proceeding</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(bookingType === "full-vehicle"
                          ? getFormattedVehicleTermsList(selectedVehicle, undefined, selectedVehicle === "urbania" ? 16 : 17)
                          : [
                              "Valid ID proof (Aadhar/Voter ID) is mandatory for all travelers.",
                              "Reporting time is 15 minutes before the scheduled boarding.",
                              "Refunds for cancellations will be processed within 5-7 working days.",
                              "Management is not responsible for loss of personal belongings."
                            ]
                        ).map((term, i) => (
                          <div key={i} className="flex gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">{term}</p>
                          </div>
                        ))}
                      </div>

                      <label className="flex items-start gap-4 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 cursor-pointer group hover:bg-emerald-100/50 transition-all">
                        <div className="relative flex items-center">
                          <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-emerald-300 bg-white checked:bg-emerald-600 transition-all" defaultChecked />
                          <CheckCircle2 className="absolute h-5 w-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none p-0.5" />
                        </div>
                        <span className="text-xs font-bold text-emerald-900 leading-tight">
                          I agree to the <span className="underline decoration-2 underline-offset-4">Terms of Service</span>, <span className="underline decoration-2 underline-offset-4">Cancellation Policy</span>, and <span className="underline decoration-2 underline-offset-4">Privacy Policy</span>.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Final Summary (Right) */}
                <div className="lg:w-[400px] space-y-6">
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8 sticky top-32">
                    <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400">Final Summary</h3>
                    
                    <div className="space-y-6">
                      {bookingType === "full-vehicle" ? (
                        <>
                          <div className="flex justify-between items-center pb-6 border-b border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Vehicle</span>
                            <span className="text-sm font-bold">{selectedVehicle === 'urbania' ? 'Force Urbania (16 seats)' : 'Tempo Traveller (17 seats)'}</span>
                          </div>
                          <div className="flex justify-between items-center pb-6 border-b border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Rate</span>
                            <span className="text-sm font-bold">₹{vehiclePricePerKm}/KM × {calculatedDistance * 2} KM</span>
                          </div>
                          <div className="flex justify-between items-center pb-6 border-b border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Per Head Cost</span>
                            <span className="text-sm font-bold text-emerald-400">₹{Math.round(totalFullVehicleFare / (selectedVehicle === 'urbania' ? 16 : 17))}/seat</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between items-center pb-6 border-b border-white/10">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Base Fare</span>
                          <span className="text-sm font-bold">₹{farePerSeat} × {Object.keys(selectedSeats).length}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pb-6 border-b border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">GST (5%)</span>
                        <span className="text-sm font-bold text-emerald-400">Included</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-black uppercase tracking-tighter">Total Amount</span>
                        <span className="text-3xl font-black text-emerald-400">₹{totalFare.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleGroupBooking}
                      disabled={isProcessing || !contactPhone || !contactEmail}
                      className={cn(
                        "w-full h-16 rounded-2xl text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3",
                        (isProcessing || !contactPhone || !contactEmail)
                          ? "bg-emerald-500/30 text-slate-900/40 cursor-not-allowed"
                          : "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20"
                      )}
                    >
                      {isProcessing ? "Processing..." : "Proceed to Payment"} <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    <p className="text-[9px] text-center font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                      By clicking proceed, you agree to our <br/> Terms & Cancellation Policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      {bookingStep === "details" && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 z-[200] flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-lg bg-white/95">
          <div className="flex flex-col">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {bookingType === "full-vehicle" ? "Est. Total Hire" : "Starting from"}
            </p>
            <p className="text-xl font-black text-slate-900 tracking-tight">
              ₹{bookingType === "full-vehicle" ? totalFullVehicleFare.toLocaleString('en-IN') : tour.fare}{" "}
              <span className="text-[10px] text-slate-400">
                {bookingType === "full-vehicle" ? `(${calculatedDistance * 2} KM)` : "/ seat"}
              </span>
            </p>
          </div>
          <button
            onClick={() => changeStep("seats")}
            className="px-10 h-14 rounded-2xl bg-emerald-600 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
          >
            {bookingType === "full-vehicle" ? "Select Vehicle & Seats" : "Select Seats"}
          </button>
        </div>
      )}

      <div className="h-24 lg:hidden" />
    </main>
  );
};

interface SeatButtonProps {
  id: number;
  status: "available" | "selected" | "booked" | "reserved";
  onClick: () => void;
  price: string;
  gender: string;
}

const SeatButton: React.FC<SeatButtonProps> = ({ id, status, onClick, price, gender }) => (
  <button
    onClick={onClick}
    disabled={status === "booked" || status === "reserved"}
    className={cn(
      "w-12 h-14 rounded-xl border-2 transition-all flex flex-col items-center justify-center relative group active:scale-90",
      status === "selected"
        ? gender === "female"
          ? "bg-[#e11d48] border-[#be123c] text-white shadow-lg shadow-rose-600/20"
          : "bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-600/20"
        : status === "booked"
          ? "bg-[#94a3b8] border-[#64748b] text-white cursor-not-allowed opacity-60"
          : status === "reserved"
            ? "bg-[#f59e0b] border-[#d97706] text-white cursor-not-allowed"
            : "bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600"
    )}
  >
    <span className="text-[9px] font-black uppercase">S{id}</span>
    <span className="text-[7px] font-bold opacity-80">₹{price}</span>
    {status === "selected" && (
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
        <div className={cn(
          "w-2 h-2 rounded-full",
          gender === "female" ? "bg-rose-600" : "bg-blue-600"
        )} />
      </div>
    )}
  </button>
);

export default GroupTourDetailsPage;
