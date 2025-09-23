// Server/ISR page — fetch ALL rows, split into 3 equal buckets (max 10 each)

import { createClient } from "@supabase/supabase-js";
import CafesRestaurantsClient from "@/components/cafesRestaurants/cafesRestaurantsClient";
import CafesRestaurantsSEO from "@/components/seo/cafesRestaurantsSeo";
import type { CafeAndRestaurant } from "@/types/cafeRestaurants";

export const revalidate = 900; // 15m

type Row = {
  id: string;
  slug: string | null;
  name: string | null;
  image: string | null;
  gallery: string[] | null;
  type: string | null;
  area: string | null;
  location: string | null;
  cuisine: string[] | null;
  tags: string[] | null;
  averagecost: number | null;
  description: string | null;
  adactive: boolean | null;
  sponsoredby: string | null;
  isfeaturedforhome: boolean | null;
  highlight: boolean | null;
  visibilitystatus: "visible" | "hidden" | "draft" | null;
  created_at: string | null;
};

export default async function Page() {
  const hasEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!hasEnv) {
    console.error("[cafesRestaurants/page] Missing NEXT_PUBLIC_SUPABASE_* env");
    return (
      <>
        <CafesRestaurantsSEO total={0} />
        <CafesRestaurantsClient all={[]} topPicks={[]} sponsored={[]} deals={[]} />
      </>
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("cafes_and_restaurants")
    .select(
      [
        "id","slug","name","image","gallery","type","area","location",
        "cuisine","tags","averagecost","description",
        "adactive","sponsoredby","isfeaturedforhome","highlight",
        "visibilitystatus","created_at",
      ].join(", ")
    )
    // IMPORTANT: no filter — get ALL
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<Row[]>();

  if (error) {
    console.error("[cafesRestaurants/page] Supabase error:", error.message);
  }

  const rows: Row[] = data ?? [];

  const toCard = (r: Row): Partial<CafeAndRestaurant> => ({
    id: r.id,
    slug: r.slug ?? r.id,
    name: r.name ?? "Untitled",
    image: r.image ?? r.gallery?.[0] ?? "",
    type: r.type ?? "Cafe",
    area: r.area ?? undefined,
    location: r.location ?? undefined,
    cuisine: r.cuisine ?? undefined,
    features: r.tags ?? undefined,
    averagecost: typeof r.averagecost === "number" ? r.averagecost : undefined,
    description: r.description ?? "",
    // kept for future use (UI doesn’t rely on them right now)
    adactive: !!r.adactive,
    sponsoredby: r.sponsoredby ?? undefined,
    isfeaturedforhome: !!r.isfeaturedforhome,
    highlight: !!r.highlight,
    created_at: r.created_at ?? new Date().toISOString(),
  });

  const list = rows.map(toCard);

  // ------- Split ALL into 3 buckets (no criteria), disjoint, each ≤ 10 -------
  const total = list.length;
  const third = Math.ceil(total / 3);
  const cap = Math.min(10, Math.max(1, Math.floor(total / 3) || 10));

  const first = list.slice(0, third);
  const second = list.slice(third, third * 2);
  const thirdArr = list.slice(third * 2);

  const topPicks   = first.slice(0, cap);
  const sponsored  = second.slice(0, cap);
  const deals      = thirdArr.slice(0, cap);

  console.log("[cafesRestaurants/page] split", {
    total, cap,
    topPicks: topPicks.length,
    sponsored: sponsored.length,
    deals: deals.length,
    sample: list[0],
  });

  return (
    <>
      <CafesRestaurantsSEO total={list.length} />
      <CafesRestaurantsClient
        all={list}
        topPicks={topPicks}
        sponsored={sponsored}
        deals={deals}
      />
    </>
  );
}
