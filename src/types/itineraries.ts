export interface Itinerary {
  // 🔑 Identity
  id: string;
  title: string;                        // e.g., "7-Day Meghalaya Backpacking Itinerary"
  slug: string;                         // e.g., "meghalaya-7-day-backpack"

  // 📝 Description
  description: string;                  // Full rich-text description

  // 📅 Duration & Flow
  days: number;                         // e.g., 7
  starting_point: string;              // e.g., "Guwahati"
  ending_point: string;                // e.g., "Shillong"
  regions_covered: string[];           // e.g., ["East Khasi Hills", "Jaintia Hills"]
  districts?: string[];                // (optional, for search filters)

  // 🧭 Daily Plan
  places_per_day: {
    day: number;                        // e.g., 1
    title: string;                      // "Arrival & Sightseeing"
    locations: string[];               // ["Umiam Lake", "Elephant Falls"]
    notes?: string;                     // Optional tip/narrative
  }[];

  // 🗂 Classification
  idealfor: string[];                   // ["Couples", "Backpackers", "Families"]
  theme: string[];                      // ["Nature", "Adventure", "Culture"]
  season: string;                       // Best time to follow this itinerary
  visitseason?: string[];              // For filters/search – ["Winter", "Spring"]
  tags: string[];                       // ["7-day", "budget", "roadtrip"]
  customizable: boolean;                // Can users customize?

  // 💰 Cost Estimate
  estimated_cost: {
    min?: number;
    max?: number;
    currency?: string;
    notes?: string;
  };

  // 🚐 Travel Info
  travel_mode: string[];                // ["Self-drive", "Taxi", "Shared"]

  // 🖼 Media
  image: string;                        // Main card image
  gallery: string[];                    // Slideshow/gallery images
  cover_image_alt?: string;             // For SEO
  media?: string[];                     // Video, YouTube, Reels

  // 🌟 Highlights
  highlights: string[];                 // ["Dawki river", "Camping at Krang Suri"]

  // 📞 Contact (For bookings / queries)
  contact: string;                      // e.g., "+91 9876543210"
  email: string;                        // For questions or bookings
  website: string;                      // Booking site
  socialmedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };

  // 📘 Tips & Notes
  tips: string[];                       // ["Pack light", "Start early for Mawlynnong"]
  warnings: string[];                   // ["No ATMs after Jowai", "Poor network coverage"]

  // 📈 Analytics
  viewcount?: number;                   // Legacy
  view_count?: number;
  click_count?: number;
  bookings_count?: number;              // Optional for guided tours
  lastbookedat?: string;                // ISO string

  // 📈 SEO & Visibility
  meta_title?: string;
  meta_description?: string;
  popularityindex?: number;             // Sortable score for trending itineraries
  visibilitystatus: 'visible' | 'hidden' | 'draft';
  highlight?: boolean;
  sponsoredby?: string;

  // 📢 Ads & Promotions
  adSlot?: import('../lib/adSlots').AdSlot;
  adActive?: boolean;
  isfeaturedforhome?: boolean;

  // ✍️ Author Info
  author: string;                       // Who designed this itinerary

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

  // ⏱️ Timestamps
  created_at: string;                   // ISO string
}
