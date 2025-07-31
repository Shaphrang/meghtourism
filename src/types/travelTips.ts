export interface TravelTip {
  // 🔑 Core Identity
  id: string;
  title: string;                           // e.g., "Top Budget Travel Tips in Meghalaya"
  slug: string;                            // e.g., "budget-tips-meghalaya"

  // 📄 Content
  content: string;                         // Full content (markdown or HTML)
  category: string;                        // e.g., "Budget", "Packing", "Local Etiquette"
  tags: string[];                          // e.g., ["budget", "food", "packing"]
  theme?: string[];                        // e.g., ["Adventure", "Family Travel"]
  applicability: string[];                 // e.g., ["Solo", "Couples", "Senior Citizens"]
  season: string;                          // e.g., "Winter", "Monsoon"
  visitseason?: string[];                  // ["Spring", "Monsoon"] – for filters

  // 📍 Location
  location: string;                        // e.g., "Shillong"
  district?: string;                       // Optional – e.g., "East Khasi Hills"

  // 🖼 Media
  image: string;                           // Main banner image
  gallery?: string[];                      // Optional image gallery
  cover_image_alt?: string;                // For SEO & accessibility
  media?: string[];                        // Instagram/YT reels or maps

  // 📚 Source & Author
  source_url: string;                      // External reference – e.g., https://meghtourism.gov.in/tips
  author: string;                          // Contributor/editor name
  priority_level: string;                  // "High", "Medium", "Low"

  // 📞 Optional Contact
  contact?: string;                        // If tip is from a local expert
  email?: string;                          // Contributor/editor email
  website?: string;                        // Related link or contributor page
  socialmedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };

  // 📈 Analytics
  viewcount?: number;                      // Legacy
  view_count?: number;
  click_count?: number;

  // 📈 SEO & Visibility
  meta_title?: string;
  meta_description?: string;
  popularityindex?: number;
  visibilitystatus: 'visible' | 'hidden' | 'draft';
  highlight?: boolean;
  sponsoredby?: string;

  // 📢 Ads & Promotion
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
  created_at: string;                      // ISO string – "2025-07-27T14:45:00Z"
}
