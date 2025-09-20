import { ItineraryZ, ItineraryCompatInZ } from "./itinerary";

export function normalizeItinerary(input: unknown) {
  // 1) Parse with the permissive compat schema
  const compat = ItineraryCompatInZ.parse(input);

  // 2) Normalize places_per_day: prefer locations, fallback to places
  const places_per_day = (compat.places_per_day || []).map((p) => ({
    day: p.day,
    title: (p.title && p.title.trim()) || `Day ${p.day}`,
    locations: (p.locations ?? p.places ?? []).filter(Boolean),
    notes: p.notes,
  }));

  // 3) Final strict parse
  const strict = ItineraryZ.parse({ ...compat, places_per_day });
  return strict;
}
