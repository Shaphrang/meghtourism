// src/lib/schemas/itinerary.ts
import { z } from "zod";

export const DayPlanZ = z.object({
  day: z.number().int().min(1),
  // keeping the simplified version used in current UI (title/notes optional)
  title: z.string().optional(),
  notes: z.string().optional(),
  places: z.array(z.string().min(1)).default([]),
});

export const EstimatedCostZ = z.object({
  min: z.number().nonnegative().optional(),
  max: z.number().nonnegative().optional(),
  currency: z.string().min(1).optional(),
  notes: z.string().optional(),
}).refine((v) => (v.min == null || v.max == null || v.min <= v.max), {
  message: "Estimated cost: min cannot exceed max",
});

export const SocialZ = z.object({
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
}).optional();

export const FaqAnswerZ = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const ItineraryZ = z.object({
  // identity
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),

  // description
  description: z.string().nullable().optional(),

  // duration & flow
  days: z.number().int().positive().nullable().optional(),
  starting_point: z.string().nullable().optional(),
  ending_point: z.string().nullable().optional(),
  regions_covered: z.array(z.string()).default([]),
  districts: z.array(z.string()).default([]).optional(),

  // daily plan
  places_per_day: z.array(DayPlanZ).default([]),

  // classification
  idealfor: z.array(z.string()).default([]),
  theme: z.array(z.string()).default([]),
  season: z.string().nullable().optional(),
  visit_season: z.array(z.string()).default([]).optional(),
  tags: z.array(z.string()).default([]),
  customizable: z.boolean().default(false),

  // cost
  estimated_cost: EstimatedCostZ.nullable().optional(),

  // travel
  travel_mode: z.array(z.string()).default([]),

  // media
  image: z.string().url().nullable().optional(),
  gallery: z.array(z.string().url()).default([]).optional(),
  cover_image_alt: z.string().optional(),
  media: z.array(z.string()).default([]).optional(),

  // highlights
  highlights: z.array(z.string()).default([]),

  // contact
  contact: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  socialmedia: SocialZ,

  // tips & notes
  tips: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),

  // analytics
  viewcount: z.number().int().optional(),
  view_count: z.number().int().optional(),
  click_count: z.number().int().optional(),
  bookings_count: z.number().int().optional(),
  lastbookedat: z.string().optional(),

  // SEO & visibility
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  popularityindex: z.number().optional(),
  visibilitystatus: z.enum(["visible","hidden","draft"]).default("visible"),
  highlight: z.boolean().optional(),
  sponsoredby: z.string().optional(),

  // ads
  adslot: z.enum(["none","homepage","featured","nearby"]).default("none").optional(),
  adactive: z.boolean().optional(),
  isfeaturedforhome: z.boolean().optional(),

  // author
  author: z.string().optional(),
  ratings: z.number().optional(),

  // AI
  ai_score: z.number().optional(),
  search_keywords: z.array(z.string()).default([]).optional(),
  searchboost: z.number().optional(),
  summary: z.string().optional(),
  include_in_ai_search: z.boolean().default(true).optional(),
  faq_answers: z.array(FaqAnswerZ).default([]).optional(),

  // timestamps
  created_at: z.string().optional(),

  // admin status (if present in payload)
  approval_status: z.enum(["pending","approved","rejected"]).optional(),
});

export type ItineraryInput = z.infer<typeof ItineraryZ>;
