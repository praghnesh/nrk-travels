"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Phone,
  Camera,
  Info,
  Car,
  ChevronRight,
  Star,
  Shield,
  Calendar,
  CreditCard,
  Mail,
  User,
  MessageCircle,
  Pencil,
  AlertCircle,
  Check
} from "lucide-react";
import { TOURS_DATA, VehicleRate } from "@/lib/tours";
import { cn } from "@/lib/utils";
import { getFormattedVehicleTermsList, getVehicleTerms } from "@/lib/rates";
import { createBooking, createPaymentOrder, verifyPayment, loadRazorpay } from "@/lib/api";

type BookingStep = "select" | "summary" | "checkout";

const TourDetailsPage = () => {
  const { slug } = useParams();
  const tour = TOURS_DATA[slug as string];

  const [bookingStep, setBookingStep] = useState<BookingStep>("select");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRate | null>(tour?.vehicleRates[0] || null);
  const [tripMode, setTripMode] = useState<"one-way" | "round-trip">("round-trip");
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "policy">("overview");
  const [passengerCount, setPassengerCount] = useState(1);

  React.useEffect(() => {
    if (tour) {
      setBookingStep("select");
      setSelectedVehicle(tour.vehicleRates[0] || null);
      setActiveTab("overview");
      setTripMode("round-trip");
      setPassengerCount(1);
      setTermsAccepted(false);
    }
  }, [tour?.slug]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    requirements: "",
    gstNumber: "",
    businessName: "",
    businessAddress: "",
    businessEmail: ""
  });
  const [paymentOption, setPaymentOption] = useState<"part" | "full">("part");
  const [hasGst, setHasGst] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/,/g, ""), 10) || 0;
  };

  const maxPassengers = selectedVehicle ? parseInt(selectedVehicle.pax, 10) || 1 : 1;

  const getBookingPrice = () => {
    if (!selectedVehicle) return 0;
    return parsePrice(selectedVehicle.price);
  };

  const getDriverBhatta = () => {
    if (!selectedVehicle) return 0;
    const terms = getVehicleTerms(undefined, selectedVehicle.model, selectedVehicle.pax);
    const days = tour.slug === "vizag-city-tour" ? 1 : (tour.days || 1);
    return terms.driverBhatta * days;
  };

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Tour Not Found</h1>
        <Link href="/" className="text-emerald-600 font-bold hover:underline">Return to Home</Link>
      </div>
    );
  }

  const handleFinalBooking = async () => {
    setIsProcessing(true);
    setErrorMessage("");
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please verify your internet connection.");
      }

      const totalAmount = getBookingPrice();
      const bookingRes = await createBooking({
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        booking_type: "tour",
        total_amount: totalAmount,
        actual_total_amount: totalAmount,
        amount_paid: totalAmount,
        payment_percentage: 100,
        special_requests: formData.requirements || "",
        tour_id: tour.title, // using tour title or slug
        travel_date: new Date().toISOString().split("T")[0]
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
        description: `Tour Package: ${tour.title}`,
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
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
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

  const SummaryList = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trip Type</p>
          <p className="text-sm font-black text-slate-900">Tour</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Distance</p>
          <p className="text-sm font-black text-slate-900">{tour.distanceKm} KM</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup</p>
            <p className="text-sm font-black text-slate-900">Visakhapatnam</p>
          </div>
          <button className="text-slate-400 hover:text-emerald-600 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Date</p>
          <p className="text-sm font-black text-slate-900 truncate">Fri, May 15, 2026 - 9:15 AM</p>
        </div>
        <button className="text-slate-400 hover:text-emerald-600 transition-colors flex-shrink-0">
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-24 lg:pt-32 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content (Left) */}
          <div className="flex-1 space-y-8">
            <AnimatePresence mode="wait">
              {bookingStep !== "checkout" ? (
                <motion.div
                  key="tour-details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Header / Hero */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest">Nature & Adventure</span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest">Easy</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">{tour.title}</h1>
                    <div className="flex items-center gap-6 text-slate-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-600">{tour.distanceKm} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-600">{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-600">{tour.days}D / {tour.days > 1 ? `${tour.days - 1}N` : 'Same Day'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-12 gap-3 aspect-[16/9] lg:aspect-[21/9]">
                    <div className="col-span-8 relative rounded-2xl overflow-hidden border border-slate-200">
                      <Image src={tour.images[0]} alt={tour.title} fill className="object-cover" />
                    </div>
                    <div className="col-span-4 flex flex-col gap-3">
                      <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-200">
                        <Image src={tour.images[1] || tour.images[0]} alt={tour.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-200">
                        <Image src={tour.images[2] || tour.images[0]} alt={tour.title} fill className="object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Content Tabs */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex border-b border-slate-100 px-4 lg:px-6 overflow-x-auto scrollbar-hide flex-nowrap">
                      {[
                        { id: "overview", label: "Overview" },
                        { id: "itinerary", label: "Itinerary" },
                        { id: "policy", label: "Inclusions & Exclusions" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={cn(
                            "px-4 lg:px-6 py-5 text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap flex-shrink-0",
                            activeTab === tab.id ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          {tab.label}
                          {activeTab === tab.id && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="p-8 lg:p-10">
                      <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                          <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                          >
                            <p className="text-lg text-slate-700 font-bold leading-relaxed opacity-90 italic">
                              "{tour.description}"
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                              {tour.highlights.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                                  <span className="text-base font-black text-slate-800">{item}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeTab === "itinerary" && (
                          <motion.div
                            key="itinerary"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                          >
                            {tour.itinerary && tour.itinerary.length > 0 ? (
                              <div className="space-y-6">
                                {tour.itinerary.map((item, idx) => (
                                  <div key={idx} className="flex gap-6">
                                    <div className="flex flex-col items-center">
                                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xs">
                                        {item.day}
                                      </div>
                                      {idx !== tour.itinerary.length - 1 && <div className="w-0.5 flex-1 bg-slate-100 my-2" />}
                                    </div>
                                    <div className="pb-8">
                                      <h4 className="text-base font-black text-slate-900 uppercase tracking-widest mb-4">{item.title}</h4>
                                      <ul className="space-y-3">
                                        {item.activities.map((activity, aIdx) => (
                                          <li key={aIdx} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-500 font-bold leading-relaxed">{activity}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-12">
                                <p className="text-slate-400 font-bold italic">Detailed itinerary coming soon...</p>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {activeTab === "policy" && (
                          <motion.div
                            key="policy"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid md:grid-cols-2 gap-12"
                          >
                            <div className="space-y-6">
                              <h4 className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Included
                              </h4>
                              <ul className="space-y-4">
                                {tour.included.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm font-bold text-slate-700 leading-tight">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-6">
                              <h4 className="text-rose-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Not Included
                              </h4>
                              <ul className="space-y-4">
                                {tour.notIncluded.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-3">
                                    <div className="w-4 h-4 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mt-0.5 flex-shrink-0">
                                      <span className="text-[10px] font-black">✕</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 leading-tight">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ) : bookingSuccess ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2rem] p-8 lg:p-12 border border-slate-100 shadow-xl text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto">
                    <Check className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Booking Confirmed!</h2>
                    <p className="text-slate-500 font-bold italic text-sm">
                      Thank you for booking with NRK Travels. We have received your payment. Our executive will reach out to you shortly.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-3 text-left">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Package</span>
                      <span className="text-slate-900 font-black">{tour.title}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Vehicle</span>
                      <span className="text-slate-900 font-black">{selectedVehicle?.model}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Amount Paid</span>
                      <span className="text-emerald-600 font-black">₹{(paymentOption === "part" ? Math.round(getBookingPrice() * 0.3) : getBookingPrice()).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center w-full h-14 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all"
                  >
                    Go Back to Home
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="checkout-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {errorMessage && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-xs font-bold">
                      <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  {/* Top Bar */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Visakhapatnam <ChevronRight className="w-4 h-4 text-slate-300" /> {tour.title}
                      </h2>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} - 10:20 PM
                      </p>
                    </div>
                    <button onClick={() => setBookingStep("select")} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contact Details */}
                  <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Contact details</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Booking details will be sent to</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full h-14 lg:h-16 rounded-2xl bg-slate-50 border border-slate-100 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                        <div className="flex gap-3">
                          <div className="w-20 lg:w-24 h-14 lg:h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-bold text-slate-900">
                            IN +91
                          </div>
                          <input
                            type="tel"
                            placeholder="Enter 10 digit number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="flex-1 h-14 lg:h-16 rounded-2xl bg-slate-50 border border-slate-100 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email ID</label>
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-14 lg:h-16 rounded-2xl bg-slate-50 border border-slate-100 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Additional Requirements</label>
                        <textarea
                          placeholder="Enter flight number, special requests, or any other requirements..."
                          value={formData.requirements}
                          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                          className="w-full h-32 rounded-2xl bg-slate-50 border border-slate-100 p-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                        />
                        <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Optional: Include flight details, accessibility needs, or any special requests.</p>
                      </div>
                    </div>

                    {/* Payment Options */}
                    <div className="pt-10 border-t border-slate-100 space-y-8">
                      <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">Payment Options</h3>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => setPaymentOption("part")}
                          className={cn(
                            "w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between group text-left",
                            paymentOption === "part" ? "border-emerald-600 bg-emerald-50/20" : "border-slate-100 hover:border-emerald-200"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", paymentOption === "part" ? "border-emerald-600 bg-emerald-600" : "border-slate-200")}>
                              {paymentOption === "part" && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">Part Pay</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pay 30% now, rest to the driver</p>
                            </div>
                          </div>
                          <p className="text-lg font-black text-slate-900">₹{Math.round(getBookingPrice() * 0.3).toLocaleString('en-IN')}</p>
                        </button>

                        <button
                          onClick={() => setPaymentOption("full")}
                          className={cn(
                            "w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between group text-left",
                            paymentOption === "full" ? "border-emerald-600 bg-emerald-50/20" : "border-slate-100 hover:border-emerald-200"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", paymentOption === "full" ? "border-emerald-600 bg-emerald-600" : "border-slate-200")}>
                              {paymentOption === "full" && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">Full Pay</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pay total amount</p>
                            </div>
                          </div>
                          <p className="text-lg font-black text-slate-900">₹{getBookingPrice().toLocaleString('en-IN')}</p>
                        </button>
                      </div>
                    </div>

                    {/* GST Section */}
                    <div className="pt-10 border-t border-slate-100 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">I have a GST number</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Optional</p>
                        </div>
                        <button
                          onClick={() => setHasGst(!hasGst)}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                            hasGst ? "bg-emerald-600" : "bg-slate-200"
                          )}
                        >
                          <div className={cn("w-4 h-4 rounded-full bg-white transition-all shadow-sm", hasGst ? "translate-x-6" : "translate-x-0")} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {hasGst && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                              <input
                                type="text"
                                placeholder="GSTIN"
                                value={formData.gstNumber}
                                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                              />
                              <input
                                type="text"
                                placeholder="Business Name"
                                value={formData.businessName}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                              />
                              <input
                                type="text"
                                placeholder="Business Address"
                                value={formData.businessAddress}
                                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                                className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all md:col-span-2"
                              />
                              <input
                                type="email"
                                placeholder="Business Email"
                                value={formData.businessEmail}
                                onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                                className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all md:col-span-2"
                              />
                              <div className="md:col-span-2 bg-orange-50/50 border border-orange-100 p-4 rounded-xl">
                                <p className="text-[10px] font-bold text-orange-800 leading-relaxed">
                                  In case of invalid/cancelled GSTIN, this booking shall be considered as personal booking. Additional 18% GST will be charged on the total amount.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Vehicle Specific Dynamic Terms & Conditions */}
                    <div className="pt-10 border-t border-slate-100 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                          <Info className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Terms & Conditions {selectedVehicle ? `(${selectedVehicle.model})` : ""}</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Please review before proceeding</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getFormattedVehicleTermsList(undefined, selectedVehicle?.model, selectedVehicle?.pax).map((term, i) => (
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
                        <p className="text-xs font-black">I agree to the vehicle-specific Terms of Service, Privacy Policy, and Cancellation Rules.</p>
                      </button>
                    </div>

                    <div className="pt-6 space-y-4">
                      <div className="space-y-4">
                        <button
                          onClick={() => {
                            if (formData.fullName && formData.phone && formData.email && termsAccepted) {
                              handleFinalBooking();
                            }
                          }}
                          disabled={!(formData.fullName && formData.phone && formData.email && termsAccepted)}
                          className={cn(
                            "w-full h-16 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-all shadow-xl",
                            (formData.fullName && formData.phone && formData.email && termsAccepted)
                              ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700 cursor-pointer"
                              : "bg-emerald-50 text-emerald-600/40 cursor-not-allowed border border-emerald-100"
                          )}
                        >
                          <CreditCard className="w-5 h-5" />
                          Proceed to Payment - ₹{paymentOption === "part" ? Math.round(getBookingPrice() * 0.3).toLocaleString('en-IN') : getBookingPrice().toLocaleString('en-IN')}
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => setBookingStep("summary")}
                          className="w-full h-16 rounded-2xl border-2 border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Back
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:w-[400px]">
            <div className="sticky top-32 space-y-6">
              <AnimatePresence mode="wait">
                {bookingStep === "select" && (
                  <motion.div
                    key="step-select"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Select Vehicle</h3>
                      <Car className="w-5 h-5 text-emerald-600" />
                    </div>

                    <div className="space-y-3">
                      {tour.vehicleRates.map((vehicle, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setPassengerCount(1);
                            setBookingStep("summary");
                          }}
                          className={cn(
                            "w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group",
                            selectedVehicle?.model === vehicle.model
                              ? "border-emerald-600 bg-emerald-50/20"
                              : "border-slate-100 hover:border-emerald-200"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-100 relative">
                              <Image src={vehicle.image} alt={vehicle.model} fill className="object-cover" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-black text-slate-900">{vehicle.model}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{vehicle.pax} Seats</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-slate-900 tracking-tight">₹{vehicle.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {(bookingStep === "summary" || bookingStep === "checkout") && (
                  <motion.div
                    key="step-summary"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Trip Mode is locked to round-trip for tours */}

                    {/* Summary */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Booking Summary</h4>
                      <SummaryList />

                      <div className="bg-emerald-50/30 rounded-2xl p-4 border border-emerald-100/50 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white border border-emerald-100 overflow-hidden relative">
                          <Image src={selectedVehicle?.image || ""} alt={selectedVehicle?.model || ""} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-slate-900">{selectedVehicle?.model}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Users className="w-2.5 h-2.5" /> {selectedVehicle?.pax} Seats</span>
                            <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest"><CheckCircle2 className="w-2.5 h-2.5" /> AC</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 mb-6">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pricing Model</p>
                        <p className="text-[10px] font-bold text-slate-400 italic mt-1">
                          Package fare (₹{(getBookingPrice() - getDriverBhatta()).toLocaleString("en-IN")}) + Driver Bhatta (₹{getDriverBhatta().toLocaleString("en-IN")})
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-100 space-y-6">
                        {/* Fare Breakdown */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Package fare</span>
                            <span className="text-sm font-black text-slate-900 tracking-tight">₹{(getBookingPrice() - getDriverBhatta()).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-slate-100/50">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Driver Bhatta ({tour.slug === "vizag-city-tour" ? 1 : (tour.days || 1)} Days)</span>
                            <span className="text-sm font-black text-slate-900 tracking-tight">₹{getDriverBhatta().toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                            <span className="text-sm font-black text-slate-900 uppercase tracking-widest font-black">Total Price</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tight">₹{getBookingPrice().toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Actions & Notes */}
                        <div className="space-y-4">
                          <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 transition-all w-fit">
                            <MessageCircle className="w-4 h-4" />
                            Share summary on WhatsApp
                          </button>
                          <p className="text-[10px] font-bold text-slate-400 italic">Parking and tolls fees are extra.</p>
                        </div>

                        {/* Inclusions / Exclusions Box */}
                        <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Inclusions/Exclusions</h5>
                            <button
                              onClick={() => setActiveTab("policy")}
                              className="text-emerald-600 text-[10px] font-black uppercase hover:underline"
                            >
                              View Policy
                            </button>
                          </div>
                          <ul className="space-y-3">
                            {[
                              "Toll charges, Parking, State Tax & Driver Allowance are excluded",
                              "Only one pickup and drop",
                              "Waiting time upto 45 mins included. ₹100.00/30 mins after that",
                              "During ghat roads and standby AC will turned off"
                            ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-[11px] font-bold text-slate-600 leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => {
                              if (bookingStep === "checkout") {
                                setBookingStep("summary");
                              } else {
                                setBookingStep("select");
                              }
                            }}
                            className="flex-1 h-14 rounded-2xl border-2 border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            {bookingStep === "checkout" ? "Back to Summary" : "Back to Vehicles"}
                          </button>
                          <button
                            onClick={() => {
                              if (bookingStep === "checkout") {
                                handleFinalBooking();
                              } else if (bookingStep === "summary") {
                                setBookingStep("checkout");
                              }
                            }}
                            className="flex-1 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl transition-all bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                          >
                            {bookingStep === "checkout" ? "Confirm Booking" : "Book Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 z-50 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-lg bg-white/90">
        <div className="flex flex-col">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Booking Price</p>
          <p className="text-xl font-black text-emerald-600 tracking-tight">₹{getBookingPrice().toLocaleString('en-IN')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open(`https://wa.me/919111989222`, "_blank")}
            className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              if (bookingStep === "select") {
                setBookingStep("summary");
              } else if (bookingStep === "summary") {
                setBookingStep("checkout");
              } else if (bookingStep === "checkout") {
                if (formData.fullName && formData.phone && formData.email) {
                  handleFinalBooking();
                }
              }
            }}
            className={cn(
              "px-8 h-12 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95",
              (formData.fullName && formData.phone && formData.email) || bookingStep !== "checkout"
                ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700"
                : "bg-emerald-50 text-emerald-600/40 cursor-not-allowed border border-emerald-100"
            )}
          >
            {bookingStep === "checkout" ? "Confirm Booking" : "Book Now"}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Always Visible) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around z-[60] px-4 pb-safe shadow-2xl hidden">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-400">
          <motion.div whileTap={{ scale: 0.9 }}><Car className="w-6 h-6" /></motion.div>
          <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-emerald-600">
          <motion.div whileTap={{ scale: 0.9 }}><MessageCircle className="w-6 h-6" /></motion.div>
          <span className="text-[8px] font-black uppercase tracking-widest">WhatsApp</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <motion.div whileTap={{ scale: 0.9 }}><Phone className="w-6 h-6" /></motion.div>
          <span className="text-[8px] font-black uppercase tracking-widest">Call</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <motion.div whileTap={{ scale: 0.9 }}><User className="w-6 h-6" /></motion.div>
          <span className="text-[8px] font-black uppercase tracking-widest">Account</span>
        </button>
      </div>

      <div className="h-32 lg:hidden" /> {/* Increased spacer for sticky bar */}
      </main>
  );
};

export default TourDetailsPage;
