export interface TravelTip {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  tags: string[];
  category: string;
  applicability: string[];
  location: string;
  season: string;
  related_places: string[];
  media: string[];
  source_url: string;
  author: string;
  priority_level: string;
  highlight: boolean;
  visibilitystatus: string;
  popularityindex: number;
  region: string;
  theme: string[];
  created_at: string;
}
