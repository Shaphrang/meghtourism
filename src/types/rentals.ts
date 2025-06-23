export interface Rental {
  id: string;
  title: string;
  type: string;
  description: string;
  brand: string;
  vehicle_features: string[];
  rentalrate: any; // JSONB
  fuelpolicy: string;
  location: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  maplink: string;
  image: string;
  gallery: string[];
  availability: string;
  terms: string[];
  documents_required: string[];
  contact: string;
  email: string;
  website: string;
  ownername: string;
  owner_id: string;
  tags: string[];
  ratings: number;
  reviews: string[];
  license_required: boolean;
  insurance_covered: boolean;
  popularityindex: number;
  visibilitystatus: string;
  created_at: string;
}
