export interface PrebuiltFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  related_destinations: string[];
  related_events: string[];
  related_itineraries: string[];
  audience: string;
  language: string;
  priority: string;
  isactive: boolean;
  visibilitystatus: string;
  created_at: string;
}
