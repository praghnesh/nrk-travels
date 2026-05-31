/**
 * ============================================================================
 * Rates & Terms Matrix Configuration
 * Dynamic Rates & Terms for Vehicle Classes
 * ============================================================================
 */

export interface VehicleTerms {
  vehicleClass: string;
  extraKm: number;
  extraHour: number;
  driverBhatta: number;
  tollAndParking: string; // "Paid by Customer"
  driverFood: boolean;
}

export const RATE_MATRIX: Record<string, VehicleTerms> = {
  "40-seater": {
    vehicleClass: "40 Seater Bus",
    extraKm: 65,
    extraHour: 1100,
    driverBhatta: 500,
    tollAndParking: "Paid by Customer",
    driverFood: false,
  },
  "27-seater": {
    vehicleClass: "27 Seater Bus",
    extraKm: 50,
    extraHour: 250,
    driverBhatta: 500,
    tollAndParking: "Paid by Customer",
    driverFood: false,
  },
  "20-seater": {
    vehicleClass: "20/21 Seater Bus",
    extraKm: 45,
    extraHour: 250,
    driverBhatta: 400,
    tollAndParking: "Paid by Customer",
    driverFood: false,
  },
  "17-seater": {
    vehicleClass: "16/17 Seater Tempo Traveller",
    extraKm: 35,
    extraHour: 250,
    driverBhatta: 300,
    tollAndParking: "Paid by Customer",
    driverFood: false,
  },
  "12-seater": {
    vehicleClass: "12 Seater Coach",
    extraKm: 35,
    extraHour: 250,
    driverBhatta: 300,
    tollAndParking: "Paid by Customer",
    driverFood: false,
  },
  "innova-crysta": {
    vehicleClass: "Innova Crysta / 7 Seater",
    extraKm: 20,
    extraHour: 400,
    driverBhatta: 200,
    tollAndParking: "Paid by Customer",
    driverFood: true,
  },
  "dzire": {
    vehicleClass: "4 Seater / Dzire / Sedan",
    extraKm: 14,
    extraHour: 250,
    driverBhatta: 200,
    tollAndParking: "Paid by Customer",
    driverFood: true,
  },
};

/**
 * Resolves the vehicle name, capacity, or slug to the matching vehicle terms from RATE_MATRIX.
 */
export const getVehicleTerms = (
  slug?: string,
  modelName?: string,
  pax?: number | string
): VehicleTerms => {
  const s = (slug || "").toLowerCase();
  const m = (modelName || "").toLowerCase();
  const p = Number(pax) || 0;

  // 1. Check slug matches
  if (s.includes("dzire") || s.includes("glanza") || s.includes("amaze") || s === "sedan" || s === "hatchback") {
    return RATE_MATRIX["dzire"];
  }
  if (s.includes("innova") || s.includes("ertiga")) {
    return RATE_MATRIX["innova-crysta"];
  }
  if (s.includes("12-seater") || s.includes("12seater")) {
    return RATE_MATRIX["12-seater"];
  }
  if (s.includes("tempo") || s.includes("traveller") || s.includes("urbania") || s.includes("17")) {
    return RATE_MATRIX["17-seater"];
  }
  if (s.includes("mini-bus") || s.includes("minibus") || s.includes("20") || s.includes("21")) {
    return RATE_MATRIX["20-seater"];
  }
  if (s.includes("27")) {
    return RATE_MATRIX["27-seater"];
  }
  if (s.includes("bus") || s.includes("40")) {
    return RATE_MATRIX["40-seater"];
  }

  // 2. Check model name matches
  if (m.includes("dzire") || m.includes("glanza") || m.includes("amaze")) {
    return RATE_MATRIX["dzire"];
  }
  if (m.includes("innova") || m.includes("ertiga")) {
    return RATE_MATRIX["innova-crysta"];
  }
  if (m.includes("tempo") || m.includes("traveller") || m.includes("urbania")) {
    return RATE_MATRIX["17-seater"];
  }
  if (m.includes("mini") || m.includes("21")) {
    return RATE_MATRIX["20-seater"];
  }
  if (m.includes("27")) {
    return RATE_MATRIX["27-seater"];
  }
  if (m.includes("40") || m.includes("bus")) {
    return RATE_MATRIX["40-seater"];
  }

  // 3. Fallback to capacity (pax) matches
  if (p > 0) {
    if (p <= 4) return RATE_MATRIX["dzire"];
    if (p <= 7) return RATE_MATRIX["innova-crysta"];
    if (p <= 12) return RATE_MATRIX["12-seater"];
    if (p <= 17) return RATE_MATRIX["17-seater"];
    if (p <= 26) return RATE_MATRIX["20-seater"];
    if (p <= 35) return RATE_MATRIX["27-seater"];
    return RATE_MATRIX["40-seater"];
  }

  // Final fallback
  return RATE_MATRIX["dzire"];
};

/**
 * Returns formatted bullet points for terms and conditions based on vehicle rates.
 */
export const getFormattedVehicleTermsList = (
  slug?: string,
  modelName?: string,
  pax?: number | string
): string[] => {
  const terms = getVehicleTerms(slug, modelName, pax);
  const list = [
    `For extra kilometers (after time limit), charge is ₹${terms.extraKm}/km.`,
    `For extra hours (after time limit), charge is ₹${terms.extraHour}/hour.`,
    `Driver Bhatta is ₹${terms.driverBhatta}/day (per day driver allowance).`,
    "Toll gates charges and parking fees should be paid by the customer.",
  ];

  if (terms.driverFood) {
    list.push("Driver food should be paid/provided by the customer.");
  }

  return list;
};
