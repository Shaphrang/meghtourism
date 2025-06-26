export type Homestay = {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  location?: string;
  district?: string;
  image?: string;
  gallery?: string[];
  pricepernight?: number;
  occupancy?: number;
  mealincluded?: boolean;
  priceincludes?: string[];
  amenities?: string[];
  contact?: string;
  email?: string;
  website?: string;
  ratings?: number;
  reviews?: string[];
  tags?: string[];
  latitude?: number;
  longitude?: number;
  maplink?: string;
  address?: string;
  distancefromshillong?: string;
  nearbydestinations?: string[];
  averagecostestimate?: Record<string, any>; // You can type this more specifically if structure is known
  tips?: string[];
  warnings?: string[];
  created_at?: string; // ISO timestamp format
};
