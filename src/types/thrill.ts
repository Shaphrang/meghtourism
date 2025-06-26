// types/thrill.ts

export interface Thrill {
  id: string;
  name?: string;
  slug?: string;
  location?: string;
  district?: string;
  image?: string;
  gallery?: string[];
  description?: string;
  highlights?: string[];
  difficultylevel?: string; // e.g., 'Easy', 'Moderate', 'Hard'
  duration?: string; // e.g., '2 hours', 'Half-day', 'Full-day'

  groupsize?: {
    min?: number;
    max?: number;
    notes?: string;
  };

  agelimit?: {
    min?: number;
    max?: number;
    notes?: string;
  };

  priceperperson?: number;

  inclusions?: string[];
  exclusions?: string[];
  equipmentrequired?: string[];
  safetytips?: string[];

  contact?: string;
  email?: string;
  website?: string;
  tags?: string[];

  latitude?: number;
  longitude?: number;
  maplink?: string;
  address?: string;

  operatingmonths?: string[]; // e.g., ['March', 'April', 'May']

  openinghours?: {
    start?: string; // e.g., '09:00 AM'
    end?: string;   // e.g., '05:00 PM'
    days?: string[]; // e.g., ['Mon', 'Tue', 'Wed']
    notes?: string;
  };

  availability?: boolean;
  seasonalonly?: boolean;

  averagecostestimate?: {
    min?: number;
    max?: number;
    currency?: string;
    notes?: string;
  };

  tips?: string[];
  warnings?: string[];
  created_at?: string; // ISO timestamp
}
