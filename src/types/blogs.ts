export interface Blog {
  // 🔑 Core Identity
  id: string;
  title: string;                           // e.g., "Top 10 Hidden Cafes in Shillong"
  slug: string;                            // e.g., "hidden-cafes-in-shillong"

  // 📄 Content
  content: string;                         // Full HTML or markdown
  category: string;                        // e.g., "Food", "Adventure", "Culture"
  tags: string[];                          // e.g., ["cafe", "hidden", "romantic"]
  theme?: string[];                        // e.g., ["Local", "Budget", "Romantic"]
  estimated_read_time: number;            // e.g., 5 (minutes)

  // 👤 Author & Source
  author: string;                          // e.g., "John Doe"
  source_url?: string;                     // Optional for curated blogs
  contact?: string;                        // Optional for contributor
  email?: string;
  website?: string;
  socialmedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };

  // 🖼 Media
  cover_image: string;                     // Main image
  cover_image_alt?: string;                // For SEO
  gallery: string[];                       // More visual content
  media?: string[];                        // Video, YouTube, Reels

  // 🗺 Location Context
  district?: string;
  location?: string;

  // 📈 Analytics
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
  published_at: string;                    // ISO – when published
  created_at: string;                      // ISO – when created
}
