export interface Rental {
  // 🔑 Core Info
  id: string;
  title: string;                         // e.g., "Royal Enfield Himalayan for Rent"
  slug?: string;                         // URL slug – e.g., "enfield-himalayan-shillong"
  description: string;                   // Full listing description
  type: string;                          // e.g., "Bike", "Car", "Scooter", "SUV"
  brand: string;                         // e.g., "Royal Enfield", "Toyota"

  // 🚘 Vehicle Info
  vehicle_features: string[];            // ["Dual Disc", "ABS", "Top Box"]
  license_required: boolean;             // true = DL required
  insurance_covered: boolean;            // true = insurance included
  fuelpolicy: string;                    // e.g., "Full to Full", "Fuel extra"
  rentalrate: {
    min?: number;
    max?: number;
    currency?: string;
    unit?: string;                       // e.g., "per day", "per hour"
    notes?: string;                      // e.g., "Helmet included"
  };

  // 🧭 Location
  location: string;                      // e.g., "Shillong"
  district: string;                      // e.g., "East Khasi Hills"
  address: string;                       // Full address

  // 🖼 Media
  image: string;                         // Primary image
  gallery: string[];                     // More photos
  cover_image_alt?: string;              // SEO alt text
  media?: string[];                      // Optional video or Instagram/YT reels

  // 📆 Availability & Conditions
  availability: string;                  // e.g., "9 AM - 7 PM daily"
  terms: string[];                       // ["Full day rental only", "Late fee ₹100/hr"]
  documents_required: string[];          // ["Aadhar", "DL", "Passport Copy"]

  // 📞 Contact Info
  contact: string;                       // Phone number
  email: string;                         // Inquiry/booking email
  website: string;                       // Optional booking link
  socialmedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };

  // 👤 Owner Info
  ownername: string;                     // e.g., "D. Kharkongor"
  owner_id: string;                      // Supabase user reference or string

  // 🧩 Classification & Filters
  tags: string[];                        // ["bike", "premium", "longtour"]
  theme?: string[];                      // Optional – e.g., ["Adventure", "Budget"]
  suitablefor?: string[];                // ["Solo", "Group", "Tourists"]
  visitseason?: string[];                // ["Summer", "Autumn"]

  // 📈 Performance & Search
  viewcount?: number;                    // Legacy view tracker
  view_count?: number;                   // New view tracker
  click_count?: number;
  popularityindex: number;               // Internal trending sort

  // 📘 Tips & User Notes
  tips?: string[];                       // ["Inspect tires before leaving"]
  warnings?: string[];                   // ["Rainy season = slippery roads"]

  // 📈 SEO & Visibility
  meta_title?: string;
  meta_description?: string;
  visibilitystatus: 'visible' | 'hidden' | 'draft';
  highlight?: boolean;                   // true = featured visually
  sponsoredby?: string;                  // Sponsor label if paid

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
