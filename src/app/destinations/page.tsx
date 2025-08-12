// src/app/destinations/page.tsx
import { createClient } from "@supabase/supabase-js";
import DestinationsClient, {
  DestinationCard,
  DestinationsClientProps,
} from "@/components/destinations/destinationClient";

export const revalidate = 900; // ISR: 15 min

const TABLE = "destinations";
const PAGE_SIZE = 20;

// Note: new Next.js expects searchParams to be awaited
type SearchParamsObj = { [key: string]: string | string[] | undefined };

function mapRow(r: any): DestinationCard {
  return {
    id: r.id,
    slug: r.slug ?? String(r.id),
    name: r.name,
    image: r.image || undefined,
    location: r.location || undefined,
    district: r.district || undefined,
  };
}

// Fisher–Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Helper to normalize string | string[] | undefined -> string
const pick = (v: unknown): string =>
  Array.isArray(v) ? String(v[0] ?? "") : typeof v === "string" ? v : "";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsObj>; // 👈 make it a Promise
}) {
  const sp = await searchParams; // 👈 await it once

  const location = pick(sp?.location).trim();
  const district = pick(sp?.district).trim();
  const page = Math.max(1, parseInt(pick(sp?.page) || "1", 10));

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  // Build base filter (only one filter active at a time)
  const filter = (q: any) => {
    if (location) return q.eq("location", location);
    if (district) return q.eq("district", district);
    return q;
  };

  // Unique filters (Locations/Districts)
  const [locRes, distRes] = await Promise.all([
    supabase.from(TABLE).select("location").not("location", "is", null).order("location", { ascending: true }),
    supabase.from(TABLE).select("district").not("district", "is", null).order("district", { ascending: true }),
  ]);
  const locations = Array.from(new Set((locRes.data || []).map((r: any) => r.location).filter(Boolean))) as string[];
  const districts = Array.from(new Set((distRes.data || []).map((r: any) => r.district).filter(Boolean))) as string[];

  // Sponsored ads
  const adsQuery = filter(
    supabase
      .from(TABLE)
      .select("id, slug, name, image, location, district, adslot, adactive")
      .eq("adactive", true)
      .in("adslot", ["destinations", "homepage"])
      .limit(10)
  );
  const { data: adsRows } = await adsQuery;
  const sponsored = (adsRows || []).map(mapRow);

  // Pool for rails
  const poolQuery = filter(
    supabase
      .from(TABLE)
      .select("id, slug, name, image, location, district, popularityindex, created_at")
      .limit(200)
  );
  const { data: poolRows } = await poolQuery;
  const pool = shuffle<DestinationCard>((poolRows ?? []).map(mapRow));

  const used = new Set<string>();
  const takeUnique = (n: number) => {
    const out: DestinationCard[] = [];
    for (const item of pool) {
      if (out.length >= n) break;
      if (used.has(item.id)) continue;
      used.add(item.id);
      out.push(item);
    }
    return out;
  };

  const mustSee = takeUnique(10);
  const nowTrending = takeUnique(10);
  const secretGems = takeUnique(10);
  const bucketList = takeUnique(10);
  const handpicked = takeUnique(10);

  // All Destinations (paginated, SSR)
  let listQuery = filter(
    supabase
      .from(TABLE)
      .select("id, slug, name, image, location, district, popularityindex, created_at", { count: "exact" })
  )
    .order("popularityindex", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false, nullsFirst: false });

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  listQuery = listQuery.range(from, to);
  const { data: listRows, count: total = 0 } = await listQuery;
  const allDestinations = (listRows || []).map(mapRow);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const props: DestinationsClientProps = {
    filters: { locations, districts },
    selected: { location: location || "", district: district || "" },
    sponsored,
    rails: { mustSee, nowTrending, secretGems, bucketList, handpicked },
    all: { items: allDestinations, total, page, totalPages, pageSize: PAGE_SIZE },
  };

  return <DestinationsClient {...props} />;
}
