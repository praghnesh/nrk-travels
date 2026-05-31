import { FLEET_DATA } from "./fleet";
import { getVehicleTerms } from "./rates";

export interface VehicleRate {
  model: string;
  pax: string;
  price: string;
  image: string;
}

export interface ItineraryDay {
  day: string;
  title: string;
  activities: string[];
}

export interface Tour {
  slug: string;
  title: string;
  description: string;
  highlights: string[];
  images: string[];
  duration: string;
  basePrice: string;
  vehicleRates: VehicleRate[];
  included: string[];
  notIncluded: string[];
  itinerary: ItineraryDay[];
  distanceKm: number;
  days: number;
}

export interface GroupTour {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  images: string[];
  journeyDate: string;
  fare: string;
  timing: string;
  pickup: string;
  totalSeats: number;
  availableSeats: number;
  vehicleType: string;
  included: string[];
  notIncluded: string[];
  itinerary: ItineraryDay[];
}

export const calculateTourPrice = (tourSlug: string, vehicleSlug: string): number => {
  const vehicle = FLEET_DATA[vehicleSlug];
  if (!vehicle) return 0;

  const pricePerKm = Number(vehicle.pricePerKm);
  const minKm = Number(vehicle.minKm);
  const terms = getVehicleTerms(vehicleSlug);

  // If local city tour
  if (tourSlug === "vizag-city-tour") {
    let basePrice = 3000;
    switch (vehicleSlug) {
      case "swift-dzire":
      case "toyota-glanza":
      case "honda-amaze":
        basePrice = 3000;
        break;
      case "ertiga":
        basePrice = 4000;
        break;
      case "innova-crysta":
        basePrice = 5500;
        break;
      case "tempo-traveller":
        basePrice = 9000;
        break;
      case "urbania":
        basePrice = 11000;
        break;
      case "luxury-bus":
        basePrice = 22000;
        break;
      case "mini-bus":
        basePrice = 14000;
        break;
      default:
        basePrice = 3000;
    }
    return basePrice + terms.driverBhatta;
  }

  // Otherwise it is an outstation tour
  let distance = 260; // default Araku
  let days = 1;

  if (tourSlug === "vizag-araku-3d") {
    distance = 460;
    days = 3;
  } else if (tourSlug === "araku-valley") {
    distance = 260;
    days = 1;
  } else if (tourSlug === "lambasingi") {
    distance = 220;
    days = 1;
  } else if (tourSlug === "arasavalli-temple") {
    distance = 250;
    days = 1;
  } else if (tourSlug === "vanajangi") {
    distance = 240;
    days = 1;
  }

  // Formula: Math.max(distance, minKm * days) * pricePerKm + (driverBhatta * days)
  const bhatta = terms.driverBhatta * days;
  return (Math.max(distance, minKm * days) * pricePerKm) + bhatta;
};

const getVehicleRatesForTour = (tourSlug: string): VehicleRate[] => {
  return [
    { model: "Swift Dzire", pax: "4", price: calculateTourPrice(tourSlug, "swift-dzire").toLocaleString('en-IN'), image: "/images/fleet/swift_dzire.png" },
    { model: "Ertiga", pax: "6", price: calculateTourPrice(tourSlug, "ertiga").toLocaleString('en-IN'), image: "/images/fleet/ertiga.png" },
    { model: "Toyota Glanza", pax: "4", price: calculateTourPrice(tourSlug, "toyota-glanza").toLocaleString('en-IN'), image: "/images/fleet/glanza.png" },
    { model: "Innova Crysta", pax: "7", price: calculateTourPrice(tourSlug, "innova-crysta").toLocaleString('en-IN'), image: "/images/fleet/innova_crysta.png" },
    { model: "Tempo Traveller", pax: "17", price: calculateTourPrice(tourSlug, "tempo-traveller").toLocaleString('en-IN'), image: "/images/fleet/tempo_traveller.png" },
    { model: "Honda Amaze", pax: "4", price: calculateTourPrice(tourSlug, "honda-amaze").toLocaleString('en-IN'), image: "/images/fleet/honda_amaze.png" },
    { model: "Urbania", pax: "16", price: calculateTourPrice(tourSlug, "urbania").toLocaleString('en-IN'), image: "/images/fleet/urbania.png" },
    { model: "Luxury Bus", pax: "40", price: calculateTourPrice(tourSlug, "luxury-bus").toLocaleString('en-IN'), image: "/images/fleet/bus.png" },
    { model: "Luxury Mini Bus", pax: "21", price: calculateTourPrice(tourSlug, "mini-bus").toLocaleString('en-IN'), image: "/images/fleet/minibus.png" }
  ];
};

export const TOURS_DATA: Record<string, Tour> = {
  "vizag-araku-3d": {
    slug: "vizag-araku-3d",
    title: "3 Days Vizag & Araku Valley Tour",
    description: "Experience the perfect blend of coastal beauty and hill station charm. This 3-day comprehensive tour takes you through the pristine beaches of Visakhapatnam and the lush coffee plantations of Araku Valley. Visit the Borra Caves, Galikonda View Point, and enjoy the tribal dance performances.",
    highlights: [
      "RK Beach & Submarine Museum",
      "Kailasagiri Hill Top",
      "Borra Caves Exploration",
      "Araku Coffee Plantations",
      "Tribal Museum Visit"
    ],
    images: [
      "/images/tours/vizag_araku.png",
      "/images/tours/araku_caves.png",
      "/images/tours/lambasingi.png"
    ],
    duration: "3 Days / 2 Nights",
    distanceKm: 460,
    days: 3,
    get basePrice() {
      return calculateTourPrice("vizag-araku-3d", "swift-dzire").toLocaleString('en-IN');
    },
    get vehicleRates() {
      return getVehicleRatesForTour("vizag-araku-3d");
    },
    included: [
      "Private vehicle with driver.",
      "Fuel, driver charges & basic transportation.",
      "Sightseeing as per itinerary.",
      "Pickup & drop at Vizag Airport / Railway Station / Hotel."
    ],
    notIncluded: [
      "Entry fees to sightseeing places & monuments.",
      "Jeep ride to Katiki Waterfalls.",
      "Parking fees & toll charges (approx. ₹500 extra).",
      "Hotel accommodation & meals.",
      "Personal expenses (shopping, tips, etc.).",
      "A/C will be turned off on ghat roads & during standby."
    ],
    itinerary: [
      {
        day: "1",
        title: "Vizag City Tour (10 Hours, 100 KM)",
        activities: [
          "Pickup from Vizag Airport / Railway Station / Hotel.",
          "Rushikonda Beach – golden sand & water sports.",
          "Kailasagiri Hill Park – panoramic city views.",
          "Tenneti Park relaxation.",
          "Lunch at a local restaurant.",
          "RK Beach – Vizag’s most popular spot.",
          "Submarine Museum, TU 142 Aircraft Museum, Visakha Museum, Sea Harrier Museum.",
          "Stroll at Central Park.",
          "Drop at hotel & overnight stay."
        ]
      },
      {
        day: "2",
        title: "Araku Valley Tour (07:00 AM to 08:00 PM)",
        activities: [
          "Early pickup (07:00 AM).",
          "Scenic drive to Araku Valley.",
          "Damuku Viewpoint.",
          "Borra Caves exploration.",
          "Katiki Waterfalls (Jeep ride extra).",
          "Coffee Plantations & Galikonda Viewpoint.",
          "Araku Coffee Museum, Tribal Museum, Chocolate Factory & Padmapuram Gardens.",
          "Return to Vizag & hotel drop."
        ]
      },
      {
        day: "3",
        title: "Vizag Local & Departure (10 Hours, 100 KM)",
        activities: [
          "Breakfast & checkout.",
          "Yarada Beach – black sand & scenic shoreline.",
          "Dolphin’s Nose viewpoint.",
          "Simhachalam Temple visit.",
          "Drop at Vizag Railway Station or Airport for departure."
        ]
      }
    ]
  },
  "araku-valley": {
    slug: "araku-valley",
    title: "Araku Valley Day Tour",
    description: "A breathtaking journey through the Eastern Ghats. Araku Valley is famous for its pleasant weather, hills, and deep valleys. This day tour covers all major attractions including the ancient Borra Caves and scenic viewpoints.",
    highlights: ["Galikonda View Point", "Borra Caves", "Coffee Museum", "Padmapuram Gardens", "Chaprai Waterfalls"],
    images: ["/images/tours/araku_caves.png", "/images/tours/vizag_araku.png", "/images/tours/lambasingi.png"],
    duration: "13 Hours",
    distanceKm: 260,
    days: 1,
    get basePrice() {
      return calculateTourPrice("araku-valley", "swift-dzire").toLocaleString('en-IN');
    },
    get vehicleRates() {
      return getVehicleRatesForTour("araku-valley");
    },
    included: ["Private vehicle with driver.", "Fuel and driver charges."],
    notIncluded: ["Entry fees", "Parking and tolls"],
    itinerary: []
  },
  "lambasingi": {
    slug: "lambasingi",
    title: "Lambasingi Day Tour",
    description: "Visit the 'Kashmir of Andhra Pradesh'. Lambasingi is known for its cool climate and mist-covered hills. Experience the unique strawberry farms and the serene Thajangi Reservoir.",
    highlights: ["Strawberry Farms", "Thajangi Reservoir", "Misty View Points", "Coffee & Pepper Plantations", "Kothapalli Waterfalls"],
    images: ["/images/tours/lambasingi.png", "/images/tours/vanajangi.png", "/images/tours/araku_caves.png"],
    duration: "13 Hours",
    distanceKm: 220,
    days: 1,
    get basePrice() {
      return calculateTourPrice("lambasingi", "swift-dzire").toLocaleString('en-IN');
    },
    get vehicleRates() {
      return getVehicleRatesForTour("lambasingi");
    },
    included: ["Private vehicle with driver.", "Fuel and driver charges."],
    notIncluded: ["Entry fees", "Parking and tolls"],
    itinerary: []
  },
  "arasavalli-temple": {
    slug: "arasavalli-temple",
    title: "Arasavalli & Srikurmam Temple Tour",
    description: "A spiritual journey to two of the most significant temples in North Andhra. Visit the Sun God Temple at Arasavalli and the unique Kurmanatha Temple at Srikurmam.",
    highlights: ["Arasavalli Sun Temple", "Srikurmam Vishnu Temple", "Spiritual Guidance", "Comfortable Pilgrimage", "Local Prasadam Experience"],
    images: ["/images/tours/arasavalli.png", "/images/tours/vizag_north.png", "/images/tours/vizag_south.png"],
    duration: "12 Hours",
    distanceKm: 250,
    days: 1,
    get basePrice() {
      return calculateTourPrice("arasavalli-temple", "swift-dzire").toLocaleString('en-IN');
    },
    get vehicleRates() {
      return getVehicleRatesForTour("arasavalli-temple");
    },
    included: ["Private vehicle with driver.", "Fuel and driver charges."],
    notIncluded: ["Entry fees", "Parking and tolls"],
    itinerary: []
  },
  "vanajangi": {
    slug: "vanajangi",
    title: "Vanajangi Sunrise Tour",
    description: "Witness the magical 'Sea of Clouds' from the Vanajangi hills. This early morning trek offers one of the most spectacular sunrise views in the Eastern Ghats.",
    highlights: ["Sea of Clouds View", "Sunrise Trekking", "Early Morning Adventure", "Paderu Valley Sightseeing", "Local Hill Cuisine"],
    images: ["/images/tours/vanajangi.png", "/images/tours/lambasingi.png", "/images/tours/araku_caves.png"],
    duration: "13 Hours",
    distanceKm: 240,
    days: 1,
    get basePrice() {
      return calculateTourPrice("vanajangi", "swift-dzire").toLocaleString('en-IN');
    },
    get vehicleRates() {
      return getVehicleRatesForTour("vanajangi");
    },
    included: ["Private vehicle with driver.", "Fuel and driver charges."],
    notIncluded: ["Entry fees", "Parking and tolls"],
    itinerary: []
  },
  "vizag-city-tour": {
    slug: "vizag-city-tour",
    title: "Vizag Full City Tour",
    description: "Explore the best of Visakhapatnam in a single day. This comprehensive tour covers both Northern and Southern attractions, from the sacred Simhachalam Temple and sacred Buddhist sites to the pristine Rishikonda Beach and the iconic Submarine Museum.",
    highlights: [
      "Simhachalam Temple", 
      "Kailasagiri Hill Top", 
      "Rishikonda Beach", 
      "Thotlakonda Buddhist Site",
      "Zoo Park (IGZP)",
      "RK Beach & Submarine Museum", 
      "TU-142 Aircraft Museum",
      "Sea Harrier Museum",
      "Dolphin's Nose & Lighthouse", 
      "Yarada Beach",
      "Bheemili Beach Road Drive"
    ],
    images: ["/images/tours/vizag_north.png", "/images/tours/vizag_south.png", "/images/tours/vizag_city.png"],
    duration: "12 Hours",
    distanceKm: 100,
    days: 1,
    get basePrice() {
      return calculateTourPrice("vizag-city-tour", "swift-dzire").toLocaleString('en-IN');
    },
    get vehicleRates() {
      return getVehicleRatesForTour("vizag-city-tour");
    },
    included: ["Private vehicle with driver.", "Fuel and driver charges.", "Pickup and drop-off."],
    notIncluded: ["Entry fees to museums/parks.", "Parking and tolls.", "Meals and snacks."],
    itinerary: [
      {
        day: "1",
        title: "Complete City Exploration",
        activities: [
          "08:30 AM: Simhachalam Temple Darshan.",
          "10:30 AM: Kailasagiri Hill Top (Ropeway & Views).",
          "11:30 AM: Thotlakonda Buddhist Complex & Zoo Park.",
          "01:00 PM: Lunch Break.",
          "02:00 PM: Rishikonda Beach (Water Sports) & Bheemili Road Drive.",
          "04:00 PM: RK Beach, Submarine, Aircraft & Sea Harrier Museums.",
          "06:00 PM: Dolphin's Nose Lighthouse & Yarada Beach sunset view."
        ]
      }
    ]
  }
};

export const GROUP_TOURS_DATA: Record<string, GroupTour> = {
  "arasavalli-group-tour": {
    slug: "arasavalli-group-tour",
    title: "Arasavalli - Srikurmam - Mukhalingam Tour",
    subtitle: "Curated shared experiences for social travelers",
    description: "A spiritual journey to the most significant temples in North Andhra. This group tour is designed for comfort and spiritual enrichment, covering the Sun God Temple at Arasavalli, the unique Kurmanatha Temple at Srikurmam, and the ancient Mukhalingam Temple.",
    highlights: [
      "Arasavalli Sun God Temple",
      "Srikurmam Kurmanatha Temple",
      "Mukhalingam Shiva Temple",
      "Experienced Spiritual Guide",
      "Group Interaction & Shared Travel"
    ],
    images: [
      "/images/tours/arasavalli.png",
      "/images/tours/vizag_north.png",
      "/images/tours/vizag_south.png",
      "/images/tours/araku_caves.png"
    ],
    journeyDate: "2026-06-01",
    fare: "999",
    timing: "05:30 AM to 08:30 PM",
    pickup: "Akkayapalem → Arasavalli → Srikurmam → Mukhalingam Tour",
    totalSeats: 17,
    availableSeats: 12,
    vehicleType: "Tempo Traveller",
    included: [
      "Transfer in A/C Tempo Traveller.",
      "Sightseeing as per itinerary.",
      "Professional Driver & Guide.",
      "Pickup & Drop at designated points."
    ],
    notIncluded: [
      "Temple entry & Special Darshan tickets.",
      "Breakfast, Lunch & Personal expenses.",
      "Parking & Tolls (Divided among passengers).",
      "Anything not mentioned in inclusions."
    ],
    itinerary: [
      {
        day: "1",
        title: "Temples of North Andhra",
        activities: [
          "05:30 AM: Pickup from Akkayapalem.",
          "08:30 AM: Reach Arasavalli Sun Temple.",
          "11:00 AM: Visit Srikurmam Temple.",
          "01:00 PM: Lunch Break.",
          "03:00 PM: Visit Mukhalingam Temple.",
          "08:30 PM: Return to Vizag."
        ]
      }
    ]
  },
  "vizag-to-pithapuram": {
    slug: "vizag-to-pithapuram",
    title: "Vizag to Pithapuram Spiritual Tour",
    subtitle: "Sacred pilgrimage to the Kukkuteswara Swamy Temple",
    description: "Join us for a divine journey to Pithapuram, one of the 18 Shakti Peethas. This tour is perfect for devotees looking for a organized spiritual experience, visiting the Kukkuteswara Swamy Temple and Sripada Srivallabha Samsthanam.",
    highlights: [
      "Kukkuteswara Swamy Temple",
      "Sripada Srivallabha Birthplace",
      "Gaya Padakshetra Visit",
      "Special Group Pooja Arrangement",
      "Satvik Meals Included"
    ],
    images: [
      "/images/group-tours/pithapuram.png",
      "/images/tours/arasavalli.png",
      "/images/tours/vizag_north.png"
    ],
    journeyDate: "2026-06-02",
    fare: "999",
    timing: "05:00 AM to 09:00 PM",
    pickup: "Vizag → Annavaram → Pithapuram → Vizag",
    totalSeats: 17,
    availableSeats: 8,
    vehicleType: "Tempo Traveller",
    included: ["AC Transport", "Breakfast & Lunch", "Special Darshan assistance"],
    notIncluded: ["Personal rituals", "Dinner", "Shopping"],
    itinerary: [
      {
        day: "1",
        title: "Pithapuram Pilgrimage",
        activities: [
          "05:00 AM: Departure from Vizag.",
          "08:30 AM: Darshan at Annavaram Temple.",
          "11:30 AM: Reach Pithapuram Kukkuteswara Temple.",
          "02:00 PM: Lunch and Sripada Srivallabha Darshan.",
          "09:00 PM: Return to Vizag."
        ]
      }
    ]
  },
  "araku-group-trip": {
    slug: "araku-group-trip",
    title: "Araku Valley Group Trip",
    subtitle: "Scenic hills and coffee plantations",
    description: "Experience the magic of Araku Valley with a fun group. Visit the ancient Borra Caves, enjoy the coffee museum, and witness the tribal dance at the Tribal Museum.",
    highlights: ["Borra Caves", "Coffee Museum", "Galikonda Viewpoint", "Chaprai Waterfalls", "Group Bonfire"],
    images: [
      "/images/group-tours/araku_caves.png",
      "/images/tours/vizag_araku.png",
      "/images/tours/lambasingi.png"
    ],
    journeyDate: "2026-06-03",
    fare: "999",
    timing: "07:00 AM to 10:00 PM",
    pickup: "Vizag → Borra Caves → Araku → Vizag",
    totalSeats: 17,
    availableSeats: 15,
    vehicleType: "Urbania Luxury",
    included: ["Luxury AC Transport", "Sightseeing", "Guided Tour"],
    notIncluded: ["Entry tickets", "Food", "Jeep rides"],
    itinerary: [
      {
        day: "1",
        title: "Araku Exploration",
        activities: ["Morning drive to hills", "Borra Caves visit", "Lunch at Araku", "Coffee Museum", "Return to Vizag"]
      }
    ]
  },
  "lambasingi-group-trip": {
    slug: "lambasingi-group-trip",
    title: "Lambasingi Group Trip",
    subtitle: "Misty mornings in Andhra's Kashmir",
    description: "A chilling adventure to the coldest place in Andhra. Perfect for groups looking for mist, strawberries, and serene reservoir views.",
    highlights: ["Misty Sunrise", "Strawberry Farms", "Thajangi Reservoir", "Kothapalli Waterfalls", "Group Trekking"],
    images: [
      "/images/tours/lambasingi.png",
      "/images/tours/vanajangi.png",
      "/images/tours/araku_caves.png"
    ],
    journeyDate: "2026-08-25",
    fare: "999",
    timing: "03:00 AM to 08:00 PM",
    pickup: "Vizag → Lambasingi → Kothapalli → Vizag",
    totalSeats: 17,
    availableSeats: 10,
    vehicleType: "Tempo Traveller",
    included: ["Comfortable Transport", "Strawberry farm visit", "Morning Tea"],
    notIncluded: ["Breakfast/Lunch", "Adventure activities", "Shopping"],
    itinerary: [
      {
        day: "1",
        title: "Lambasingi Mist",
        activities: ["Early morning start (03:00 AM)", "Sunrise at Lambasingi", "Strawberry farms", "Thajangi Reservoir", "Return by 8 PM"]
      }
    ]
  }
};
