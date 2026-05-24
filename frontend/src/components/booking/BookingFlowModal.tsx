/**
 * =========================================
 * BookingFlowModal Component
 * Interactive multi-step booking with Map and Payment
 * =========================================
 */

"use client";

import React, { useState, useEffect } from "react";
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
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    model: string;
    pricePerKm: number;
    type: string;
    image: string;
  };
}

const getEstimatedDistance = (from: string, to: string): number => {
  const f = from.toLowerCase();
  const t = to.toLowerCase();

  // If one of them is Vizag/Visakhapatnam, check the other one
  const other = f.includes("vizag") || f.includes("visakhapatnam") ? t : f;

  if (other.includes("araku")) return 115;
  if (other.includes("arasavalli")) return 120;
  if (other.includes("srikakulam")) return 115;
  if (other.includes("annavaram")) return 110;
  if (other.includes("lambasingi")) return 105;
  if (other.includes("vanajangi")) return 100;
  if (other.includes("hyderabad")) return 620;
  if (other.includes("bangalore") || other.includes("bengaluru")) return 1000;
  if (other.includes("chennai")) return 800;
  if (other.includes("vijayawada")) return 350;
  if (other.includes("tirupati")) return 750;
  if (other.includes("kakinada")) return 155;
  if (other.includes("rajahmundry")) return 190;
  if (other.includes("airport")) return 35;

  return 145; // default fallback
};

const getEstimatedFare = (from: string, to: string, pricePerKm: number): { price: number; distance: number; time: string } => {
  const distance = getEstimatedDistance(from, to);
  const f = from.toLowerCase();
  const t = to.toLowerCase();
  
  if (f.includes("airport") || t.includes("airport")) {
    return {
      price: 800,
      distance: 35,
      time: "1h 0m"
    };
  }

  // Outstation: minimum 300 km billing
  const price = Math.max(distance, 300) * pricePerKm;
  const hours = Math.floor((distance * 1.5) / 60) + 1; // rough estimate
  const minutes = Math.round((distance * 1.5) % 60);

  return {
    price: price,
    distance: distance,
    time: `${hours}h ${minutes}m`
  };
};

const BookingFlowModal = ({ isOpen, onClose, vehicle }: BookingFlowModalProps) => {
  const [step, setStep] = useState(1);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setPaymentSuccess(false);
        setIsProcessing(false);
      }, 300);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2500);
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
        className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px] lg:max-h-[800px]"
      >
        {/* Left Sidebar - Summary */}
        <div className="lg:w-1/3 bg-slate-900 p-8 lg:p-12 text-white flex flex-col justify-between">
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
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Pricing</p>
                  <p className="text-lg font-black italic">₹{vehicle.pricePerKm} / KM</p>
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
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">To</p>
                    <p className="text-sm font-bold">{toLocation || "Select drop location"}</p>
                  </div>
                </div>
              </div>

              {fromLocation && toLocation && (
                <div className="pt-6 border-t border-white/10">
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Estimated Total</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">₹{getEstimatedFare(fromLocation, toLocation, vehicle.pricePerKm).price.toLocaleString('en-IN')}</p>
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
              By proceeding, you agree to NRK Travels terms of service and privacy policy.
            </p>
          </div>
        </div>

        {/* Right Content - Stepper */}
        <div className="lg:w-2/3 flex flex-col relative bg-white overflow-hidden">
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
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Pickup Location"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                          className="w-full h-18 bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-6 font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-600">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Drop Location"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                          className="w-full h-18 bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-6 font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    {/* Simulated Map Container */}
                    <div className="relative h-64 rounded-[2rem] bg-slate-100 overflow-hidden border border-slate-200 group">
                      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/83.3,17.7,11,0/1200x600?access_token=pk.eyJ1IjoicHJhZ2huZWFyIiwiYSI6ImNrcWwwamU1czAwaDUyb28waWwwamU1czAifQ.F_F0_v_v_v_v_v_v_v_v_v_v')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                      
                      {/* Map Markers Simulation */}
                      <div className="absolute top-1/4 left-1/4 animate-bounce">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 border-4 border-white">
                          <MapPin className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="absolute bottom-1/4 right-1/4 animate-bounce delay-300">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20 border-4 border-white">
                          <MapPin className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 glass px-4 py-2 rounded-xl border border-white/50 shadow-xl">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Interactive Map View</span>
                      </div>
                    </div>
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
                    <div className="p-8 rounded-[2rem] bg-emerald-50 border border-emerald-500/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Estimated Price</p>
                        <Info className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{getEstimatedFare(fromLocation, toLocation, vehicle.pricePerKm).price.toLocaleString('en-IN')}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Fixed</span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 leading-relaxed">
                        Includes fuel, driver allowance, and basic maintenance. Tolls & Parking extra.
                      </p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Analysis</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-600">Total Distance</span>
                          <span className="text-sm font-black text-slate-900 uppercase">~{getEstimatedFare(fromLocation, toLocation, vehicle.pricePerKm).distance} KM</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-600">Estimated Time</span>
                          <span className="text-sm font-black text-slate-900 uppercase">{getEstimatedFare(fromLocation, toLocation, vehicle.pricePerKm).time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 italic">NRK Satisfaction Guarantee</p>
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

                      <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
                        <div className="flex items-center justify-between mb-8">
                          <Lock className="w-5 h-5 text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Secure Checkout</span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Amount to Pay</p>
                            <p className="text-4xl font-black">₹{getEstimatedFare(fromLocation, toLocation, vehicle.pricePerKm).price.toLocaleString('en-IN')}</p>
                          </div>
                          
                          <Button 
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-emerald-500/20 border-none group-hover:scale-[1.02]"
                          >
                            {isProcessing ? (
                              <div className="flex items-center gap-3">
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
                  disabled={step === 1 && (!fromLocation || !toLocation)}
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
