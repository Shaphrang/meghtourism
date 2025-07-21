export interface Destination {
  id: string;
  name: string | null;
  slug?: string;
  description: string | null;
  location: string | null;
  district: string | null;
  image: string | null;
  gallery: string[] | null;
  highlights: string[] | null;
  besttimetovisit: string | null;
  thingstodo: string[] | null;
  durationtospend: string | null;
  entryfee: Record<string, any> | null; // or define a specific shape if known
  openinghours: Record<string, any> | null;
  howtoreach: string | null;
  nearbyattractions: string[] | null;
  traveltimes: Record<string, any> | null;
  latitude: number | null;
  longitude: number | null;
  maplink: string | null;
  address: string | null;
  tags: string[] | null;
  visitseason: string[] | null;
  isoffbeat: boolean | null;
  rating: number | null;
  averagecostestimate: Record<string, any> | null;
  tips: string[] | null;
  warnings: string[] | null;
  adSlot?: import('../lib/adSlots').AdSlot;
  adActive?: boolean;
  created_at: string | null; // or `Date | null` if you parse it as a JS date
}
