export interface Itinerary {
  id: string;
  title: string;
  slug: string;
  description: string;
  days: number;
  starting_point: string;
  ending_point: string;
  regions_covered: string[];
  idealfor: string[];
  theme: string[];
  season: string;
  tags: string[];
  estimated_cost: any; // JSONB
  travel_mode: string[];
  highlights: string[];
  places_per_day: any[]; // JSONB[]
  maplink: string;
  image: string;
  gallery: string[];
  tips: string[];
  warnings: string[];
  contact: string;
  email: string;
  website: string;
  customizable: boolean;
  author: string;
  ratings: number;
  reviews: string[];
  visibilitystatus: string;
  adSlot?: import('../lib/adSlots').AdSlot;
  adActive?: boolean;
  created_at: string;
}
