export interface Itinerary {
  id: string;
  title: string;
  days: {
    day: number;
    activities: string[];
  }[];
}