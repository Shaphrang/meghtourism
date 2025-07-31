export interface CafeAndRestaurant {
  // 🔑 Core Identity
  id: string;
  name: string;                         // e.g., "Cafe Shillong"
  slug?: string;                        // e.g., "cafe-shillong"
  description: string;                  // Full description for detail page

  // 📍 Location & Map
  location: string;                     // e.g., "Shillong"
  area?: string;                        // e.g., "Laitumkhrah"
  district: string;                     // e.g., "East Khasi Hills"
  address: string;                      // Full physical address

  // 🖼️ Media
  image: string;                        // Main card/banner image
  gallery: string[];                    // Image gallery
  cover_image_alt?: string;             // SEO alt text
  media?: string[];                     // Video, Instagram, YouTube

  // 🍽️ Classification & Experience
  type: string;                         // e.g., "Cafe", "Fine Dining"
  cuisine: string[];                    // e.g., ["Continental", "Indian"]
  tags: string[];                       // e.g., ["romantic", "casual", "pet-friendly"]
  theme?: string[];                     // e.g., ["Rustic", "Garden", "Cultural"]
  visitseason?: string[];              // e.g., ["Winter", "Monsoon"]
  features?: string[];                  // e.g., ["Live music", "Rooftop", "Pet-friendly"]
  dietaryoptions?: string[];            // e.g., ["Vegan", "Gluten-Free"]
  accessibility?: string[];             // e.g., ["Wheelchair Accessible"]
  isfamilyfriendly?: boolean;           // true = Family-safe

  // 📖 Menu
  menu: string[];                       // List of dishes
  popularitems: string[];              // e.g., ["Red Velvet Cake", "Cappuccino"]

  // 💰 Pricing
  pricelevel: string;                   // e.g., "$", "$$", "$$$"
  averagecost: number;                  // Avg. per person cost in INR

  // ⏰ Timing
  timing: string;                       // e.g., "10 AM - 9 PM"
  season?: string;                      // e.g., "Open year-round", "Winter-only"
  isrecurring?: boolean;                // true for weekend popups
  frequency?: string;                   // e.g., "Every Sunday"

  // 🧭 Distance & Nearby
  distancefromshillong?: string;        // e.g., "3.5 km"
  distancefromguwahati?: string;        // e.g., "105 km"

  // 📞 Contact
  contact: string;                      // Phone number
  email: string;                        // Booking / info email
  website: string;                      // Official link
  socialmedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };

  // 📝 Visitor Guidance
  tips?: string[];                      // ["Try their Sunday brunch", "Crowded after 6PM"]
  warnings?: string[];                  // ["Limited parking"]

  // 📈 Analytics
  viewcount?: number;                   // Legacy
  view_count?: number;
  click_count?: number;

  // 📈 SEO & Visibility
  meta_title?: string;
  meta_description?: string;
  popularityindex?: number;
  visibilitystatus: 'visible' | 'hidden' | 'draft';
  highlight?: boolean;
  sponsoredby?: string;

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

  // ⏱️ Timestamps
  created_at: string;
}
