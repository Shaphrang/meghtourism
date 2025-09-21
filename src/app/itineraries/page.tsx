// src/app/itineraries/page.tsx
import ItinerariesClient from "@/components/itineraries/ItinerariesClient";
import ItinerariesSEO from "@/components/seo/ItinerariesSEO";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 900; // 15m ISR

type Cost = { min?: number; max?: number; currency?: string; notes?: string } | null;

type ItineraryRow = {
  id: string;
  slug: string | null;
  title: string | null;
  image: string | null;
  gallery: string[] | null;
  days: number | null;
  starting_point: string | null;
  idealfor: string[] | null;
  estimated_cost: Cost;
  description: string | null;
  created_at: string | null;
  popularityindex: number | null;
  // (we intentionally ignore promo flags for now)
};

type Card = {
  id: string;
  slug: string;
  title: string;
  image?: string;
  days: number;
  start: string;
  audience?: string;
  sponsored?: boolean;   // not used, but kept for client type
  discountPct?: number;  // not used, but kept for client type
  featured?: boolean;    // not used, but kept for client type
  priceFrom?: number;
  ratingAvg: number | null;
  ratingCount: number;
  description: string;
  popularity: number;
};

const envSafe = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function Page() {
  if (!envSafe()) {
    console.error("[itineraries/page] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return (
      <>
        <ItinerariesSEO total={0} />
        <ItinerariesClient all={[]} topPicks={[]} sponsored={[]} deals={[]} />
      </>
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Pull a decently large pool to randomize from
  const { data: dataRows, error } = await supabase
    .from("itineraries")
    .select(
      [
        "id",
        "slug",
        "title",
        "image",
        "gallery",
        "days",
        "starting_point",
        "idealfor",
        "estimated_cost",
        "description",
        "created_at",
        "popularityindex",
      ].join(", ")
    )
    .eq("approval_status", "approved")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<ItineraryRow[]>();

  if (error) console.error("[itineraries/page] Supabase error:", error.message);

  const rows: ItineraryRow[] = dataRows ?? [];

  const list: Card[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug || r.id,
    title: r.title || "Untitled",
    image: r.image || r.gallery?.[0] || undefined,
    days: Math.max(0, Number(r.days ?? 0)),
    start: r.starting_point || "Meghalaya",
    audience: (r.idealfor?.[0] ?? "").toString().trim() || undefined,
    priceFrom: typeof r.estimated_cost?.min === "number" ? r.estimated_cost!.min : undefined,
    ratingAvg: null,
    ratingCount: 0,
    description: r.description ?? "",
    popularity: Number.isFinite(Number(r.popularityindex)) ? Number(r.popularityindex) : 0,
  }));

  // --- Randomize & split (no overlap) ---
  const take = Math.min(30, list.length); // up to 30 items total for rails
  const shuffled = [...list].sort(() => Math.random() - 0.5).slice(0, take);

  // If fewer than 30, split evenly and keep order
  const third = Math.ceil(shuffled.length / 3);
  const topPicks = shuffled.slice(0, Math.min(10, third));
  const sponsored = shuffled.slice(Math.min(10, third), Math.min(20, 2 * third));
  const deals = shuffled.slice(Math.min(20, 2 * third), Math.min(30, 3 * third));

  return (
    <>
      <ItinerariesSEO total={list.length} />
      <ItinerariesClient
        all={list}
        topPicks={topPicks}
        sponsored={sponsored}
        deals={deals}
      />
    </>
  );
}
