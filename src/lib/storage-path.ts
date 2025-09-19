export type MediaCategory = "agency" | "itineraries" | "rentals" | "thrills";

export function agencyObjectKey(agencyId: string, category: MediaCategory, rowId: string, filename: string) {
  return `agencies/${agencyId}/${category}/${rowId}/${filename}`;
}
