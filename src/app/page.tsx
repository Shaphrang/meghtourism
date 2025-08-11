// src/app/page.tsx
import { createClient } from "@supabase/supabase-js";
import HomeClient from "@/components/home/HomeClient";
import type {
  DestinationCard, HomestayCard, EventCard, ThrillCard, CafeCard,
  ItineraryCard, RentalCard, BlogCard, TipCard, FaqCard
} from "@/components/home/HomeClient";

export const revalidate = 900; // cache homepage HTML for 15 minutes

const T = {
  destinations: "destinations",
  homestays: "homestays",
  events: "events",
  thrills: "thrills", // keep if you have this table; will harmlessly return []
  cafes: "cafes_and_restaurants",
  itineraries: "itineraries",
  rentals: "rentals",
  blogs: "blogs",
  tips: "travel_tips",       // using prebuilt_faqs for tips (category='tips')
  faqs: "prebuilt_faqs",       // using prebuilt_faqs for FAQs
} as const;

export default async function Page() {
  // Static, public client (good for ISR)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  // Fire all queries in parallel (only selecting what we render)
  const [
    dest, home, evt, thr, caf, iti, ren, blo, tip, faq,
  ] = await Promise.all([
    
    supabase
      .from(T.destinations)
      .select("id, slug, name, image, location, category, popularityindex")
      .eq("adslot", "homepage")
      .eq("adactive", true)
      .order("popularityindex", { ascending: false })
      .limit(10),

    supabase
      .from(T.homestays)
      .select("id, slug, name, image, location, pricepernight, ratings, isfeaturedforhome")
      .eq("adslot", "homepage")
      .eq("adactive", true)
      //.order("isfeaturedforhome", { ascending: false })
      .order("ratings", { ascending: false })
      .limit(10),

    supabase
      .from(T.events)
      .select("id, slug, name, date, location, image, sponsoredby, created_at")
      .order("date", { ascending: true, nullsFirst: false })
      .limit(10),

    supabase
      .from(T.thrills)
      .select("id, slug, name, image, duration")
      .eq("adslot", "homepage")
      .eq("adactive", true)
      .limit(10),

    supabase
// cafes query (with your ad filters + limit 10)
      .from(T.cafes)
      .select("id, slug, name, image, description, type, cuisine, location, ratings")
      .eq("adslot", "homepage")
      .eq("adactive", true)
      .limit(10),

    supabase
      .from(T.itineraries)
      .select("id, slug, title, image, days, idealfor")
      //.eq("adslot", "homepage")
      //.eq("adactive", true)
      .order("days", { ascending: true })
      .limit(10),

    supabase
      .from(T.rentals)
      .select("id, slug, type, brand, image, rentalrate")
      //.eq("adslot", "homepage")
      //.eq("adactive", true)
      .limit(10),

    supabase
      .from(T.blogs)
      .select("id, slug, title, estimated_read_time, created_at")
      .order("created_at", { ascending: false })
      .limit(10),

    // Tips are stored in prebuilt_faqs with category='tips'
    supabase
      .from(T.tips)
      .select("id, slug, title, created_at")
      //.eq("category", "tips")
      .order("created_at", { ascending: false })
      .limit(10),

    // FAQs (anything not tips). Adjust filter if you have a dedicated category like 'faq'
    supabase
      .from(T.faqs)
      .select("id, slug, question, category, created_at")
      .neq("category", "tips")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);
  console.log("HOME COUNTS", {
  destinations: dest?.data?.length ?? 0,
  homestays:    home?.data?.length ?? 0,
  events:       evt?.data?.length ?? 0,
  thrills:      thr?.data?.length ?? 0,
  cafes:        caf?.data?.length ?? 0,
  itineraries:  iti?.data?.length ?? 0,
  rentals:      ren?.data?.length ?? 0,
  blogs:        blo?.data?.length ?? 0,
  tips:         tip?.data?.length ?? 0,
  faqs:         faq?.data?.length ?? 0,
});
if (thr?.error) console.error("THRILLS ERROR", thr.error);

  const rows = <T,>(res: { data?: any; error?: any } | null): T[] =>
    (res && !res.error && Array.isArray(res.data)) ? (res.data as T[]) : [];

  const destinations: DestinationCard[] = rows<any>(dest).map((r) => ({
    id: r.id,
    slug: r.slug ?? String(r.id),
    name: r.name,
    image: r.image,
    location: r.location ?? undefined,
    type: r.category ?? undefined,            // map category → type badge
    rating: undefined,                        // no rating column on destinations
  }));

  const homestays: HomestayCard[] = rows<any>(home).map((r) => ({
    id: r.id,
    slug: r.slug ?? String(r.id),
    name: r.name,
    image: r.image,
    location: r.location ?? undefined,
    price: r.pricepernight ?? undefined,
    rating: r.ratings ?? undefined,           // table uses 'ratings'
    best: !!r.isfeaturedforhome,
    // If you later encode discounts in 'specialoffers', parse them here
    discount: undefined,
  }));

  const events: EventCard[] = rows<any>(evt).map((r) => ({
    id: r.id,
    slug: r.slug ?? String(r.id),
    title: r.name,                            // table uses 'name'
    image: r.image,
    date: r.date ?? undefined,                // stored as text in your schema
    place: r.location ?? undefined,
    sponsored: !!r.sponsoredby,               // boolean badge if sponsoredby set
  }));

  const thrills: ThrillCard[] = rows<any>(thr).map((r) => ({
    id: r.id,
    slug: r.slug ?? String(r.id),
    title: r.title ?? r.name,
    image: r.image,
    duration: r.duration ?? undefined,
    grade: r.difficulty ?? undefined,
  }));

  const cafes: CafeCard[] = rows<any>(caf).map((r) => ({
    id: r.id,
    slug: r.slug ?? String(r.id),
    name: r.name,
    image: r.image,
    description: r.description ?? undefined,
    type: r.type ?? undefined,
    cuisine: r.cuisine ?? [],
    location: r.location ?? undefined,
    ratings: r.ratings ?? undefined,
    rating: r.ratings ?? undefined, // alias for any older UI pieces
  }));

  const itineraries: ItineraryCard[] = rows<any>(iti).map((r) => ({
    id: r.id,
    slug: r.slug ?? String(r.id),
    title: r.title,
    image: r.image,
    days: r.days ?? undefined,
    audience: Array.isArray(r.idealfor) ? r.idealfor[0] : r.idealfor ?? undefined,
  }));

  const rentals: RentalCard[] = rows<any>(ren).map((r) => ({
    id: r.id,
    slug: r.slug ?? String(r.id),
    type: r.type,
    model: r.brand ?? undefined,              // no 'model' column; use brand
    image: r.image,
    // derive per-day price from rentalrate JSON if present
    pricePerDay:
      r?.rentalrate && typeof r.rentalrate === "object"
        ? (r.rentalrate.perday ?? r.rentalrate.per_day ?? undefined)
        : undefined,
  }));

  const blogs: BlogCard[] = rows<any>(blo).map((r) => ({
    id: r.id,
    slug: r.slug ?? String(r.id),
    title: r.title,
    read: r.estimated_read_time ?? undefined, // table uses 'estimated_read_time'
  }));

  const tips: TipCard[] = rows<any>(tip).map((r) => ({
    id: r.id,
    slug: r.slug ?? String(r.id),
    title: r.title,                        // show question as tip title
  }));

  const faqs: FaqCard[] = rows<any>(faq).map((r) => ({
    id: r.id,
    slug: r.slug ?? String(r.id),
    q: r.question,
  }));

  return (
    <HomeClient
      destinations={destinations}
      homestays={homestays}
      events={events}
      thrills={thrills}
      cafes={cafes}
      itineraries={itineraries}
      rentals={rentals}
      blogs={blogs}
      tips={tips}
      faqs={faqs}
    />
  );
}
