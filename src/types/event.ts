export interface Event {
  // 🔑 Core Identity
  id: string;                         // Unique event ID
  name: string;                       // e.g., "Shillong Autumn Festival"
  slug?: string;                      // URL slug – e.g., "autumn-festival"
  description?: string;              // Full description for detail page

  // 📍 Location
  location?: string;                 // e.g., "Shillong"
  area?: string;                     // e.g., "Ward's Lake"
  district?: string;                 // e.g., "East Khasi Hills"
  address?: string;                  // Full venue address

  // 🖼 Media & Visuals
  image?: string;                    // Main image URL
  gallery?: string[];                // Array of image URLs
  cover_image_alt?: string;          // Alt text for SEO
  media?: string[];                  // YouTube/Instagram/etc.

  // 📅 Schedule
  date?: string;                     // ISO format – "2025-12-05"
  time?: string;                     // "14:00"
  duration?: string;                 // e.g., "3 hours", "Full day"
  ismultiday?: boolean;             // true if spans multiple days
  isrecurring?: boolean;            // true if repeats
  frequency?: string;               // e.g., "annually", "monthly"
  season?: string;                  // "Winter", "Spring"
  visitseason?: string[];           // ["Winter", "Festival Season"]

  // 💰 Entry & Cost Info
  entryfee?: {
    type?: string;                  // "Free", "Paid", "By Invitation"
    amount?: number;                // 200
    currency?: string;              // "INR"
    notes?: string;                 // "Includes food coupon"
  };
  averagecostestimate?: {
    min?: number;                   // 500
    max?: number;                   // 2000
    currency?: string;              // "INR"
    notes?: string;                 // "Depends on ticket tier"
  };

  // 📌 Summary & Tags
  highlights?: string[];           // ["Music", "Dance", "Food Stalls"]
  tags?: string[];                 // ["outdoor", "free", "family-friendly"]
  theme?: string[];                // ["Cultural", "Youth"]
  type?: string;                   // e.g., "Festival", "Workshop"

  // 📍 Nearby & Facilities
  availablefacilities?: string[];  // ["Restroom", "Food", "Parking"]

  // 📞 Contact & Organizer
  contact?: string;                // e.g., "+91 9876543210"
  email?: string;                  // Organizer email
  website?: string;                // Official event page
  organizer?: string;              // e.g., "Shillong Tourism Board"

  // 📊 Analytics
  view_count?: number;            // Correct field
  click_count?: number;           // Button clicks or interactions
  expectedfootfall?: string;      // e.g., "500+", "Local event", "Massive turnout"

  // 📘 Guidance
  tips?: string[];                // ["Arrive early", "Bring umbrella"]
  warnings?: string[];            // ["No mobile network", "Parking limited"]

  // 📈 SEO & Visibility
  meta_title?: string;            // SEO title
  meta_description?: string;      // SEO description
  popularityindex?: number;       // Used to rank by popularity
  sponsoredby?: string;           // Sponsor label
  visibilitystatus?: 'visible' | 'hidden' | 'draft'; // For admin control
  highlight?: boolean;            // For UI highlight/banner

  // 📢 Ads & Promotion
  adslot?: import('../lib/adSlots').AdSlot; // Ad slot if sponsored
  adactive?: boolean;             // true if ad is active

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
  created_at?: string;            // ISO date string
}
