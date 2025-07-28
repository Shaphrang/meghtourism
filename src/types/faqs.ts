export interface PrebuiltFAQ {
  // 🔑 Core Identity
  id: string;
  question: string;                        // e.g., "Is there network coverage in Cherrapunji?"
  slug?: string;                           // URL-friendly format – "network-in-cherrapunji"
  answer: string;                          // Full HTML/markdown answer

  // 🧩 Classification
  category: string;                        // e.g., "Connectivity", "Travel Rules", "Safety"
  tags: string[];                          // ["mobile", "internet", "network"]
  theme?: string[];                        // ["Safety", "Planning", "Essentials"]
  audience: string;                        // e.g., "Backpackers", "Families", "Everyone"
  priority: string;                        // "High", "Medium", "Low"
  district?: string;
  location?: string;

  // 📈 Analytics & Performance
  view_count?: number;
  click_count?: number;

  // 📈 SEO & Visibility
  meta_title?: string;
  meta_description?: string;
  visibilitystatus: 'visible' | 'hidden' | 'draft';
  highlight?: boolean;
  sponsoredby?: string;

  // 📢 Ads & Promotion
  adSlot?: import('../lib/adSlots').AdSlot;
  adActive?: boolean;
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
