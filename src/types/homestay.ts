export type Homestay = {
  // 🔑 Core Identity
  id: string;                           // Unique identifier (from Supabase)
  name: string;                         // Name of the homestay
  slug?: string;                        // URL-friendly slug
  description?: string;                 // Short or full description

  // 📍 Location Info
  location?: string;                    // City/town/village – e.g., "Shillong", "Sohra"
  area?: string;                        // Local zone or colony – e.g., "Laitumkhrah"
  address?: string;                     // Full physical address
  district?: string;                    // Admin district – e.g., "East Khasi Hills"
  distancefromshillong?: string;       // e.g., "30 km"
  distancefromguwahati?: string;       // e.g., "110 km"

  // 🖼 Media & Visuals
  image?: string;                       // Primary image (card view)
  gallery?: string[];                   // Gallery of image URLs
  cover_image_alt?: string;             // Alt text for SEO
  media?: string[];                     // Other media like videos or reels

  // 💰 Price & Room Info (card-level)
  pricepernight?: number | null;        // Base price per night (min)
  rooms?: {
    name: string;                       // Room type – e.g., "Deluxe", "Tent"
    description?: string;               // Optional room description
    pricepernight: number;              // Price for this room type
    occupancy: number;                  // Max number of guests
    availabilitystatus?: 'available' | 'full' | 'limited'; // Status
  }[];

  // 🏨 Property Details
  totalrooms?: number;                  // Total number of rooms
  checkin_time?: string;                // e.g., "12:00 PM"
  checkout_time?: string;               // e.g., "10:00 AM"
  cancellationpolicy?: string;          // Cancellation terms
  house_rules?: string[];               // e.g., ["No smoking", "No loud music"]

  // 🌟 Features & Services
  occupancy?: number;                   // Total occupancy capacity
  amenities?: string[];                 // List of amenities – e.g., ["TV", "Geyser"]
  mealincluded?: boolean;               // Is any meal included?
  priceincludes?: string[];             // e.g., ["Breakfast", "WiFi"]
  petfriendly?: boolean;                // Pet allowed?
  wifi?: boolean;                       // WiFi available?
  hasparking?: boolean;                 // Parking available?
  hasbalcony?: boolean;                 // Any room has balcony?

  // 📞 Contact & Booking
  contact?: string;                     // Owner's phone number
  email?: string;                       // Booking email
  website?: string;                     // External website
  instant_booking?: boolean;           // Can user instantly book?
  availability_status?: 'available' | 'unavailable' | 'limited'; // General status

  // 🧭 Nearby & Experiences
  nearbydestinations?: string[];        // Destination slugs (internal linking)
  nearby_points_of_interest?: string[]; // Names of attractions (display only)
  localexperience?: string[];           // e.g., ["Village life", "Hiking"]
  suitablefor?: string[];               // e.g., ["Family", "Solo", "Couples"]
  accessibilityfeatures?: string[];     // e.g., ["Wheelchair Accessible"]

  // 💸 Cost Estimates
  averagecostestimate?: {
    min?: number;                       // Min total cost for a stay
    max?: number;                       // Max total cost
    currency?: string;                  // e.g., "INR"
    notes?: string;                     // e.g., "Varies by season"
  };

  // 📘 Visitor Guidance
  tips?: string[];                      // e.g., ["Carry warm clothes"]
  warnings?: string[];                  // e.g., ["No ATM nearby"]

  // 🏷️ Tags & Themes
  tags?: string[];                      // Internal filter tags
  theme?: string[];                     // e.g., ["Nature stay", "Eco-lodge"]
  visitseason?: string[];               // e.g., ["Winter", "Monsoon"]

  // 📈 Analytics & Performance
  view_count?: number;                  // Profile views
  click_count?: number;                 // CTA clicks (e.g., Contact)
  bookings_count?: number;              // Booking attempts/records
  lastbookedat?: string;                // Last booking date (ISO string)
  viewcount?: number;                   // [Legacy] View count alias

  // 📦 Featured & Promotion
  isfeaturedforhome?: boolean;          // Show on homepage?
  specialoffers?: string;               // e.g., "10% off this season"

  // 📣 SEO & Visibility
  popularityindex?: number;             // Used for internal ranking
  meta_title?: string;                  // Meta tag title
  meta_description?: string;           // Meta tag description
  visibilitystatus?: 'visible' | 'hidden' | 'draft'; // Page status
  sponsoredby?: string;                 // Sponsor label if any

  // 💼 Business Details
  gst_number?: string;                  // GSTIN for billing
  business_type?: 'individual' | 'agency'; // Owner type

  // 📢 Ads & Marketing
  adslot?: import('../lib/adSlots').AdSlot; // Slot assignment
  adactive?: boolean;                   // Is it a paid ad?

  // AI Functionality
  ai_score?: number;                    // 0–100 scoring relevance
  search_keywords?: string[];          // semantic alternatives
  searchboost?: number;                // manual promotion (0–100)
  summary?: string;                    // AI preview text
  include_in_ai_search?: boolean;      // if false, AI won’t fetch this
  faq_answers?: {                      // optional smart prompts
    question: string;
    answer: string;
  }[];
  
  // 🕓 Timestamps
  created_at?: string;                  // Date added
};
