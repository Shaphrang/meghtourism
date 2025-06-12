// types/event.ts

export interface Event {
  id: string;
  name?: string;
  description?: string;
  location?: string;
  district?: string;
  image?: string;
  gallery?: string[];
  type?: string;
  theme?: string[];
  tags?: string[];
  date?: string; // format: YYYY-MM-DD
  time?: string; // format: HH:mm or similar
  duration?: string; // e.g., '2 hours'
  ismultiday?: boolean;
  season?: string;
  entryfee?: {
    type?: string; // e.g., 'Paid' or 'Free'
    amount?: number;
    currency?: string;
    notes?: string;
  };
  contact?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  maplink?: string;
  address?: string;
  expectedfootfall?: string;
  highlights?: string[];
  nearbydestinations?: string[];
  availablefacilities?: string[];
  isrecurring?: boolean;
  frequency?: string; // e.g., 'monthly', 'annually'
  averagecostestimate?: {
    min?: number;
    max?: number;
    currency?: string;
    notes?: string;
  };
  tips?: string[];
  warnings?: string[];
  created_at?: string; // ISO timestamp format
}
