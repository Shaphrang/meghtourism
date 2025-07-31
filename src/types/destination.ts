export interface Destination {
  // 🔑 Core Identification
  id: string;                           // Unique ID (from Supabase or DB)
  name: string;                         // Name of the destination – e.g., "Nohkalikai Falls"
  slug?: string;                        // URL slug – e.g., "nohkalikai-falls"
  description: string | null;           // Detailed description for the page

  // 📍 Location Information
  location: string | null;              // Town/Village – e.g., "Sohra"
  area?: string | null;                 // Sub-region or locality – e.g., "Laitryngew"
  district: string | null;              // District – e.g., "East Khasi Hills"
  address: string | null;               // Full address – e.g., "Near Sohra Market"

  // 🖼 Media & Images
  image: string | null;                 // Primary image for cards and header
  gallery: string[] | null;             // Image gallery (URLs)
  cover_image_alt?: string | null;      // Alt text for SEO and accessibility
  media?: string[] | null;              // Video URLs, reels, etc.

  // 📌 Highlights & Planning Info
  highlights: string[] | null;          // Key points – e.g., ["Tallest plunge waterfall", "Great for sunset"]
  besttimetovisit: string | null;       // e.g., "October to February"
  thingstodo: string[] | null;          // Suggested activities – e.g., ["Photography", "Trekking"]
  durationtospend: string | null;       // e.g., "1–2 hours"
  specialnotice?: string | null;        // e.g., "Closed during monsoon" or "Permit required"

  // 💰 Entry Fee
  entryfee: {
    type?: string;                      // e.g., "Paid" or "Free"
    amount?: number;                    // e.g., 30
    currency?: string;                  // e.g., "INR"
    notes?: string;                     // e.g., "Includes camera charges"
  } | null;

  // 💸 Average Cost Estimate
  averagecostestimate: {
    min?: number;                       // e.g., 300
    max?: number;                       // e.g., 700
    currency?: string;                  // e.g., "INR"
    notes?: string;                     // e.g., "For travel and local guide"
  } | null;

  // ⏰ Opening Hours
  openinghours: {
    days?: string;                      // e.g., "All Days"
    open?: string;                      // e.g., "9:00 AM"
    close?: string;                     // e.g., "5:00 PM"
    notes?: string;                     // e.g., "Closed on public holidays"
  } | null;

  // 🧭 Travel Info & Distance
  howtoreach: string | null;            // Detailed text – e.g., "Take a shared taxi from Shillong, about 2 hrs."
  distancefromshillong?: string;        // e.g., "3.5 km"
  distancefromguwahati?: string;        // e.g., "105 km"

  // 🏷️ Tags, Themes, and Seasons
  tags: string[] | null;                // e.g., ["waterfall", "natural", "easy hike"]
  theme?: string[] | null;              // e.g., ["Adventure", "Nature", "Relaxation"]
  visitseason?: string[] | null;        // e.g., ["Winter", "Post-Monsoon"]
  isoffbeat: boolean | null;            // true if it's less visited

  // ✅ Classification Flags (used in filters)
  isnaturalspot?: boolean | null;       // e.g., Waterfalls, viewpoints
  ishistorical?: boolean | null;        // e.g., "Monoliths of Nartiang"
  requirespermit?: boolean | null;      // e.g., Some caves or border areas

  // 📈 Analytics & Performance
  view_count?: number | null;           // Number of views
  click_count?: number | null;          // CTA clicks or interactions

  // 📢 SEO & Visibility
  meta_title?: string | null;           // For <title> in <head>
  meta_description?: string | null;     // For SEO description
  popularityindex?: number | null;      // Used for sorting/popularity logic
  sponsoredby?: string | null;          // Sponsor label if paid
  visibilitystatus?: 'visible' | 'hidden' | 'draft'; // Used to control display
  highlight?: boolean | null;           // Highlighted listing for styling/emphasis

  // 📢 Ads & Promotion
  adslot?: import('../lib/adSlots').AdSlot; // Linked ad campaign
  adactive?: boolean;                   // true if paid ad active

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

  // 🕒 Timestamp
  created_at: string | null;            // ISO string – e.g., "2025-07-25T14:30:00Z"
}
