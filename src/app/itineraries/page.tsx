// src/app/itineraries/page.tsx
import ItinerariesClient from "@/components/itineraries/ItinerariesClient";
import { createClient } from "@supabase/supabase-js";
import ItinerariesSEO from "@/app/components/seo/ItinerariesSEO";

export const revalidate = 900; // ISR like Homestays

// --- Minimal row types (adjust to your schema as needed)
type ItineraryRow = {
  id: string;
  slug?: string;
  title?: string;
  image?: string;
  gallery?: string[] | null;
  days?: number | null;
  starting_point?: string | null;
  audience?: string | null;
  sponsored?: boolean | null;
  discountPct?: number | null;
  featured?: boolean | null;
  pricefrom?: number | null;
  description?: string | null;
  created_at?: string;
};

type ReviewAggRow = {
  item_id: string;
  count: number;
  avg_rating: number | string | null;
};

export default async function Page() {
  // 1) Create Supabase client (inline). Ensure env vars exist.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 2) Fetch a pooled set of itineraries
  const { data: dataRows, error: rowsError } = await supabase
    .from("itineraries")
    .select(
      "id, slug, title, image, gallery, days, starting_point, audience, sponsored, discountPct, featured, pricefrom, description, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(60);

  // Safe fallback to array
  const rows: ItineraryRow[] = dataRows ?? [];

  // 3) Join rating aggregate (optional)
  const ids = rows.map((r) => r.slug || r.id).filter(Boolean) as string[];
  let ratingMap: Record<string, { count: number; avg: number }> = {};

  if (ids.length > 0) {
    const { data: dataAgg } = await supabase
      .from("review_aggregate")
      .select("item_id, count, avg_rating")
      .eq("category", "itinerary")
      .in("item_id", ids);

    const agg: ReviewAggRow[] = dataAgg ?? [];
    ratingMap = Object.fromEntries(
      agg.map((a) => [
        a.item_id,
        {
          count: a.count ?? 0,
          avg: a.avg_rating == null ? 0 : Number(a.avg_rating),
        },
      ])
    );
  }

  // 4) Normalize rows -> list for UI
  const list = rows.map((r) => {
    const key = (r.slug || r.id) as string;
    const rating = ratingMap[key];
    return {
      id: r.id,
      slug: r.slug || r.id,
      title: r.title || "Untitled",
      image: r.image || (r.gallery?.[0] ?? ""),
      days: r.days ?? 0,
      start: r.starting_point ?? "Shillong",
      audience: r.audience ?? "",
      sponsored: Boolean(r.sponsored),
      discountPct: r.discountPct ?? 0,
      featured: Boolean(r.featured),
      priceFrom: r.pricefrom ?? 0,
      ratingAvg: rating?.avg ?? null,
      ratingCount: rating?.count ?? 0,
      description: r.description ?? "",
    };
  });

  // 5) Precompute rails
  const topPicks = list.filter((i) => i.featured);
  const sponsored = list.filter((i) => i.sponsored);
  const deals = list
    .filter((i) => (i.discountPct || 0) > 0)
    .sort((a, b) => (b.discountPct || 0) - (a.discountPct || 0));

  return (
    <>
      <ItinerariesSEO total={list.length} />
      <ItinerariesClient all={list} topPicks={topPicks} sponsored={sponsored} deals={deals} />
    </>
  );
}
