// src/app/homestays/page.tsx
import { createClient } from "@supabase/supabase-js";
import HomestaysClient, { HomestayCard } from "@/components/homestays/HomestaysClient";

export const revalidate = 900; // ISR: 15 minutes
export const dynamic = "force-static";

type SP = Record<string, string | undefined>;
type PriceRangeKey = "" | "lt1500" | "1500-2500" | "2500-5000" | "gt5000";


const PAGE_SIZE = 10;

/* ---------- helpers ---------- */

// --- robust normalizer for your free-form field ---
function normalizeTabsForAds(v?: string | null): "best" | "top" | "deals" | "ads" | null {
  if (!v) return null;
  let s = String(v)
    .normalize("NFKD")
    .toLowerCase()
    .trim();

  // drop emoji & punctuation we don't care about
  s = s.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
  // unify separators
  s = s.replace(/[_-]/g, " ").replace(/\s+/g, " ");

  // typo and synonyms
  if (/\bbest\b/.test(s)) return "best";
  if (/\btop rsated\b|\btop rated\b|\btoprated\b|\btop\b/.test(s)) return "top";
  if (/\bdeal\b|\bdeals\b|\boffer\b|\bdiscount\b|\bsale\b/.test(s)) return "deals";
  if (/\bads?\b|\bsponsor(ed)?\b|\bpromot(ed|ion|e)?\b/.test(s)) return "ads";

  return null;
}


function parseDiscountPercent(s?: string | null): number | undefined {
  if (!s) return undefined;
  const m = s.match(/(\d{1,2})\s*%/);
  return m ? Math.min(99, Math.max(1, parseInt(m[1], 10))) : undefined;
}

function mapRow(r: any): HomestayCard & { _tabs?: ReturnType<typeof normalizeTabsForAds> } {
  const priceRaw =
    r?.price ??
    r?.pricepernight ??
    r?.price_per_night ??
    r?.pricePerNight ??
    r?.rate ??
    null;

  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : typeof priceRaw === "string"
      ? Number(priceRaw.replace(/[^\d.]/g, "")) || undefined
      : undefined;

  const discount =
    parseDiscountPercent(r?.specialoffers) ??
    (typeof r?.discount === "number" ? r.discount : undefined);

  const sponsored = !!(r?.adactive || r?.sponsored || r?.sponsoredby);

  return {
    id: String(r.id),
    slug: r.slug ?? String(r.id),
    name: r.name ?? r.title ?? "Homestay",
    image: r.image ?? r.hero_image ?? r.images?.[0] ?? null,
    location: r.location ?? r.city ?? r.town ?? null,
    district: r.district ?? null,
    price,
    rating: undefined,      // filled below from aggregate
    ratingCount: undefined, // optional
    discount,
    sponsored,
    _tabs: normalizeTabsForAds(r?.tabsforads),
  };
}

/* ---------- page (SSR/ISR) ---------- */

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  // Narrow & sanitize query params
  const location = (sp.location ?? "").trim();

  const priceRangeRaw = (sp.priceRange ?? "").trim();
  const allowed: PriceRangeKey[] = ["", "lt1500", "1500-2500", "2500-5000", "gt5000"];
  const priceRange: PriceRangeKey = (allowed.includes(priceRangeRaw as PriceRangeKey)
    ? (priceRangeRaw as PriceRangeKey)
    : "");


  const page = Math.max(1, parseInt(sp.page || "1", 10));

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  // 1) Filter options: unique locations
  const { data: rawLocs } = await supabase
    .from("homestays")
    .select("location")
    .not("location", "is", null)
    .limit(2000);

  const locations = Array.from(
    new Set((rawLocs || []).map((r) => (r.location || "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  // 2) Base pool (apply SQL filters when possible)
  let q = supabase
    .from("homestays")
    .select("*")
    .order("popularityindex", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false, nullsFirst: false });

  // Only one filter at a time: Location wins if both present.
  if (location) {
    q = q.eq("location", location);
  } else if (priceRange) {
    // Use pricepernight; if some rows store in a different column,
    // keep your mapRow() to read from fallbacks (display is unaffected).
    switch (priceRange) {
      case "lt1500":
        q = q.lt("pricepernight", 1500);
        break;
      case "1500-2500":
        q = q.gte("pricepernight", 1500).lte("pricepernight", 2500);
        break;
      case "2500-5000":
        q = q.gt("pricepernight", 2500).lte("pricepernight", 5000);
        break;
      case "gt5000":
        q = q.gt("pricepernight", 5000);
        break;
    }
  }


  const { data: poolRaw } = await q.limit(500);
  let pool = (poolRaw || []).map(mapRow);

  // 3) Ratings aggregate (category='homestay', item_id=slug)
  const slugs = pool.map((p) => p.slug || p.id).filter(Boolean);
  if (slugs.length) {
    const { data: ratingRows } = await supabase
      .from("review_aggregate")
      .select("item_id, count, avg_rating")
      .eq("category", "homestay")
      .in("item_id", slugs);

    const ratingMap = new Map<string, { count: number; avg: number }>();
    (ratingRows || []).forEach((r) => ratingMap.set(r.item_id, {
      count: r.count || 0,
      avg: Number(r.avg_rating || 0),
    }));

    pool = pool.map((p) => {
      const agg = ratingMap.get(p.slug) || ratingMap.get(p.id);
      return {
        ...p,
        rating: agg?.avg,
        ratingCount: agg?.count,
      };
    });
  }


  // Rails: just highlight slices (dedup across rails)
  const used = new Set<string>();
  const take = (arr: HomestayCard[], n: number) => {
    const out: HomestayCard[] = [];
    for (const it of arr) {
      if (out.length >= n) break;
      if (used.has(it.id)) continue;
      used.add(it.id);
      out.push(it);
    }
    return out;
  };

  // master orders/fallbacks
const byPopularity = [...pool]; // already sorted by popularityindex, created_at
const byRating     = [...pool].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
const byDeals      = pool.filter((x) => typeof x.discount === "number");
const byAds        = pool.filter((x) => x.sponsored);

// primary lists based on tabsforads normalized
let lists = {
  all: byPopularity,
  best:  pool.filter((h) => h._tabs === "best"),
  topRated: pool.filter((h) => h._tabs === "top"),
  deals: pool.filter((h) => h._tabs === "deals"),
  ads: pool.filter((h) => h._tabs === "ads"),
};

// never show empty tabs — sensible fallbacks
if (!lists.best.length)     lists.best     = byPopularity.slice(0, 24);
if (!lists.topRated.length) lists.topRated = byRating.slice(0, 24);
if (!lists.deals.length)    lists.deals    = byDeals.length ? byDeals.slice(0, 24) : byPopularity.slice(0, 24);
if (!lists.ads.length)      lists.ads      = byAds.length ? byAds.slice(0, 24)     : byPopularity.slice(0, 24);

// rails are just small highlights from those lists (dedup optional)
const railTake = (arr: typeof pool, n: number) => arr.slice(0, n);
const rails = {
  best:     railTake(lists.best, 12),
  topRated: railTake(lists.topRated, 12),
  deals:    railTake(lists.deals, 12),
  ads:      railTake(lists.ads, 12),
};

// Sponsored == ads highlights
const sponsored = rails.ads.slice(0, 8);

// (debug: see counts in your server logs)
console.log("[homestays] list sizes:", {
  all: lists.all.length,
  best: lists.best.length,
  topRated: lists.topRated.length,
  deals: lists.deals.length,
  ads: lists.ads.length,
});

// return to client
return (
  <HomestaysClient
    filters={{ locations }}
    selected={{ location, priceRange }} // 👈 NEW
    sponsored={sponsored}
    rails={rails}
    lists={lists}
    pageSize={PAGE_SIZE}
  />
);
}
