export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  cover_image: string;
  gallery: string[];
  category: string;
  tags: string[];
  theme: string[];
  region: string;
  estimated_read_time: number;
  source_url: string;
  related_places: string[];
  related_events: string[];
  comments: string[];
  likes: number;
  visibilitystatus: string;
  published_at: string;
  created_at: string;
}
