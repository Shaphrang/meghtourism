export interface Thrill {
  // 🔑 Core Identity
  id: string;
  name: string;                         // e.g., "Zipline Adventure at Mawkdok"
  slug?: string;                        // e.g., "zipline-mawkdok"
  description: string;                  // Full description for detail page

  // 📍 Location Info
  location: string;                     // e.g., "Sohra"
  area?: string;                        // e.g., "Mawkdok"
  district: string;                     // e.g., "East Khasi Hills"
  address?: string;

  // 🖼 Media
  image: string;                        // Cover image
  gallery?: string[];                   // Additional images
  cover_image_alt?: string;             // For SEO
  media?: string[];                     // Optional: YouTube, Reels

  // 🧗 Activity Info
  activity_type: string;                // e.g., "Zipline", "Caving", "Kayaking"
  difficulty_level?: string;            // e.g., "Easy", "Moderate", "Hard"
  duration?: string;                    // e.g., "2 hours"
  age_limit?: string;                   // e.g., "Minimum 12 years"
  equipment_provided?: boolean;         // true if gear is included
  safety_measures?: string[];           // e.g., ["Harness", "Helmet"]

  price: number; // Simple numeric field in TypeScript

  averagecostestimate?: {
    min?: number;
    max?: number;
    currency?: string;
    notes?: string;
  };

  // 📅 Availability
  timing: string;                       // e.g., "10 AM - 5 PM"
  season?: string;                      // "Winter", "Summer"
  visitseason?: string[];               // ["Monsoon", "Winter"]
  isrecurring?: boolean;
  frequency?: string;                   // e.g., "Every weekend"

  // 🧩 Classification
  tags: string[];                       // ["extreme", "group", "adventure"]
  theme?: string[];                     // ["Adventure", "Nature"]
  suitablefor?: string[];               // ["Solo", "Group", "Couples"]
  accessibility?: string[];             // ["Wheelchair friendly"]

  // 📞 Contact Details
  contact?: string;                     // e.g., "+91 9876543210"
  email?: string;                       // e.g., "book@thrillmeghalaya.com"
  website?: string;                     // Booking or info page
  socialmedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };

  // 📘 Tips & Warnings
  tips?: string[];                      // ["Wear tight clothes"]
  warnings?: string[];                  // ["Avoid during rain"]

  // 📈 Analytics
  view_count?: number;
  click_count?: number;
  popularityindex?: number;

  // 📈 SEO & Visibility
  meta_title?: string;
  meta_description?: string;
  visibilitystatus: 'visible' | 'hidden' | 'draft';
  sponsoredby?: string;
  highlight?: boolean;

  // 📢 Ads & Promotions
  adslot?: import('../lib/adSlots').AdSlot;
  adactive?: boolean;
  isfeaturedforhome?: boolean;

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
  created_at: string;
}
