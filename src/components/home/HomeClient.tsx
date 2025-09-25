//src\components\home\HomeClient.tsx
"use client";
import HomeSEO from "@/components/seo/HomeSEO";
import React, { useEffect, useState } from "react"; // ensure useEffect is imported
import Link from "next/link";
import Image from "next/image";
import {
  Home as HomeIcon, MapPin, Star, Mountain, CalendarDays, Percent, Coffee,
  UtensilsCrossed, Bike, BookOpen, Info, Megaphone, Crown, Heart, Users,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js"
import Footer from "@/components/common/footer";
import FooterSpace from "@/components/common/FooterSpace";

// --- REPLACE your HomestayVCard with this version ---
function formatINR(v?: number) {
  if (v == null) return "—";
  try { return `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`; }
  catch { return `₹${v}`; }
}

function HomestayVCard({ h }: { h: HomestayCard }) {
  return (
    <Link href={`/homestays/${h.slug}`} className="block">
      <div className="rounded-2xl overflow-hidden border border-zinc-100 bg-white shadow-sm">
        <div className="relative w-full h-40 bg-zinc-100">
          {h.image ? (
            <Image
              src={h.image}
              alt={h.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
              loading="lazy"
            />
          ) : null}

          {/* Darker bottom gradient to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-black/30 to-transparent" />

          {/* Price */}
          <div className="absolute left-3 bottom-10 text-white">
            <span className="text-sm font-semibold leading-none">
              {formatINR(h.price)}
            </span>
            <span className="text-[10px] font-normal">/night</span>
          </div>

          {/* Name + Location */}
          <div className="absolute left-3 right-3 bottom-3 text-white">
            <div className="font-semibold leading-tight text-[10px] line-clamp-1">
              {h.name}
            </div>
            {h.location && (
              <div className="text-[9px] opacity-90 line-clamp-1">
                {h.location}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);


function DestinationCompactCard({ d }: { d: DestinationCard }) {
  return (
    <Link href={`/destinations/${d.slug}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100">
        <div className="relative w-full aspect-[16/11] bg-zinc-100">
          {d.image ? (
            <Image
              src={d.image}
              alt={d.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
        <div className="p-3">
          <div className="text-sm font-medium truncate">{d.name}</div>
          <div className="text-xs text-zinc-500 truncate">{d.location ?? "Meghalaya"}</div>
        </div>
      </div>
    </Link>
  );
}

// tiny skeleton while first page loads
function DestSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl overflow-hidden border border-zinc-100">
      <div className="w-full aspect-[16/11] bg-zinc-100" />
      <div className="p-3">
        <div className="h-3 bg-zinc-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-zinc-200 rounded w-1/2" />
      </div>
    </div>
  );
}

function AllDestinations({ featured }: { featured: DestinationCard[] }) {
  const PAGE = 12;

  const [seenIds, setSeenIds] = useState<Set<string>>(
    new Set(featured.map(f => String(f.id ?? "")))
  );
  const [seenSlugs, setSeenSlugs] = useState<Set<string>>(
    new Set(featured.map(f => String(f.slug ?? "")))
  );

  const [items, setItems] = useState<DestinationCard[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  async function loadMore() {
    if (loading || done) return;
    setLoading(true);

    const from = offset;
    const to = offset + PAGE - 1;

    const { data, error } = await supabasePublic
      .from("destinations")
      .select("id, slug, name, image, location, category, popularityindex")
      .order("popularityindex", { ascending: false, nullsFirst: false })
      .range(from, to);

    if (error) {
      console.error("AllDestinations fetch error:", error.message);
      setLoading(false);
      setFirstLoadDone(true);
      return;
    }

    const fresh: DestinationCard[] = (data ?? []).map((r: any) => ({
      id: r.id,
      slug: r.slug ?? String(r.id),
      name: r.name,
      image: r.image,
      location: r.location ?? undefined,
      type: r.category ?? undefined,
    }));

    // De-dupe by BOTH id and slug
    const deduped = fresh.filter((d) => {
      const id = String(d.id ?? "");
      const slug = String(d.slug ?? "");
      return !(seenIds.has(id) || seenSlugs.has(slug));
    });

    if (deduped.length) {
      setItems(prev => [...prev, ...deduped]);
      setSeenIds(prev => {
        const s = new Set(prev);
        deduped.forEach(d => s.add(String(d.id ?? "")));
        return s;
      });
      setSeenSlugs(prev => {
        const s = new Set(prev);
        deduped.forEach(d => s.add(String(d.slug ?? "")));
        return s;
      });
    }

    setOffset(o => o + PAGE);
    if (!data || data.length < PAGE) setDone(true);
    setLoading(false);
    setFirstLoadDone(true);
  }

  useEffect(() => { loadMore(); /* auto-load first page */ }, []);

  return (
    <Section title="All Destinations" href="/destinations">
      <div className="grid grid-cols-2 gap-3">
        {!firstLoadDone && (<><DestSkeleton /><DestSkeleton /><DestSkeleton /><DestSkeleton /></>)}
        {items.map((d, i) => (
          <DestinationCompactCard key={`${d.id || d.slug || "x"}-${i}`} d={d} />
        ))}
      </div>

      <div className="mt-3 flex justify-center">
        {!done ? (
          <button onClick={loadMore} disabled={loading}
            className="px-4 rounded-full border border-zinc-300 bg-white text-sm">
            {loading && firstLoadDone ? "Loading…" : "Load more"}
          </button>
        ) : firstLoadDone ? (
          <span className="text-xs text-zinc-500">You’ve reached the end.</span>
        ) : null}
      </div>
    </Section>
  );
}



function cx(...c: any[]) { return c.filter(Boolean).join(" "); }

export type DestinationCard = {
  id: string; slug: string; name: string; image?: string;
  location?: string; type?: string; rating?: number;
};
export type HomestayCard = {
  id: string; slug: string; name: string; image?: string;
  location?: string; price?: number; rating?: number; best?: boolean; discount?: string;
};
export type ItineraryCard = {
  id: string; slug: string; title: string; image?: string; days?: number; audience?: string;
  start?: string;          // NEW
  priceFrom?: number;      // NEW
  sponsored?: boolean;     // NEW
  discountPct?: number;    // NEW
  ratingAvg?: number;      // NEW
};
export type RentalCard = {
  id: string; slug: string; type: string; model?: string; image?: string; pricePerDay?: number;
};
export type CafeCard = {
  id: string; slug: string; name: string; image?: string; description?: string;
  type?: string; cuisine?: string[]; location?: string; ratings?: number; rating?: number;
};
export type EventCard = any; export type ThrillCard = any; export type BlogCard = any; export type TipCard = any; export type FaqCard = any;

// Tiny helpers for consistent, minimal PWA look
function Section({ title, children, href }: { title: string; children: React.ReactNode; href?: string }) {
  return (
    <section className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export type HomeProps = {
  destinations: DestinationCard[];
  homestays: HomestayCard[];
  events: EventCard[];
  thrills: ThrillCard[];
  cafes: CafeCard[];
  itineraries: ItineraryCard[];
  rentals: RentalCard[];
  blogs: BlogCard[];
  tips: TipCard[];
  faqs: FaqCard[];
};



function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="px-3 py-2 flex items-center gap-2">
        <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">M</div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-500">Meghtourism</div>
          <div className="text-sm font-semibold">Explore Meghalaya</div>
        </div>
        <button onClick={() => alert("PWA: Add to Home Screen")} className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs">Install</button>
      </div>
    </header>
  );
}

function TrendingZones() {
  const zones = ["Shillong", "Sohra", "Mawlynnong"];
  return (
    <section className="px-3 mt-2">
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-500 to-sky-500 p-4 text-white">
        <h2 className="text-lg font-bold">Discover Meghalaya, your way</h2>
        <p className="text-white/90 text-xs mt-1">Trending zones</p>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {zones.map((z) => (
            <span key={z} className="px-3 py-1.5 rounded-full bg-white/90 text-gray-900 text-sm shadow-sm">#{z}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickCategories() {
  const items = [
    { key: "Destinations", icon: <Mountain size={18}/>, href: "/destinations", color: "bg-emerald-50 text-emerald-700" },
    { key: "Homestays", icon: <HomeIcon size={18}/>, href: "/homestays", color: "bg-indigo-50 text-indigo-700" },
    { key: "Itineraries", icon: <BookOpen size={18}/>, href: "/itineraries", color: "bg-sky-50 text-sky-700" },
    { key: "Cafes", icon: <Coffee size={18}/>, href: "/cafesRestaurants", color: "bg-amber-50 text-amber-700" },
    { key: "Travel Agencies", icon: <UtensilsCrossed size={18}/>, href: "/blogs", color: "bg-fuchsia-50 text-fuchsia-700" },
    { key: "Rentals", icon: <Bike size={18}/>, href: "/rentals", color: "bg-lime-50 text-lime-700" },
    { key: "Tips", icon: <Info size={18}/>, href: "/travelTips", color: "bg-gray-50 text-gray-700" },
    { key: "FAQs", icon: <Info size={18}/>, href: "/faqs", color: "bg-gray-50 text-gray-700" },
  ];
  return (
    <section className="px-3 mt-3">
      <div className="grid grid-cols-4 gap-2">
        {items.map((it) => (
          <Link key={it.key} href={it.href} className={cx("aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px]", it.color)}>
            {it.icon}
            {it.key}
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title, icon, accent, href }: { title: string; icon?: React.ReactNode; accent?: string; href?: string }) {
  return (
    <div className="px-3 mt-5 mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
        <span className={cx("inline-block w-2 h-2 rounded-full", accent || "bg-gray-300")}></span>
        {icon} {title}
      </div>
      {href && <Link href={href} className="text-xs text-gray-500">View all</Link>}
    </div>
  );
}

/* Cards (converted to next/image for performance) */
function DestinationCard({ item }: { item: DestinationCard }) { 
  return (
    <Link href={`/destinations/${item.slug}`} className="rounded-2xl overflow-hidden bg-white shadow border border-gray-100 block">
      <div className="relative h-36">
        <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 90vw, 600px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
        {item.type && (
          <div className="absolute left-2 top-2 text-[11px] text-white bg-black/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Mountain size={12}/> {item.type}
          </div>
        )}
        <div className="absolute left-2 bottom-2 text-white">
          <div className="font-semibold leading-tight text-sm line-clamp-1">{item.name}</div>
          {item.location && <div className="text-xs flex items-center opacity-90"><MapPin size={12} className="mr-1"/>{item.location}</div>}
        </div>
        {typeof item.rating === "number" && (
          <div className="absolute right-2 top-2 text-[11px] bg-white/90 text-gray-900 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star size={12} className="text-amber-500"/> {item.rating.toFixed(1)}
          </div>
        )}
      </div>
    </Link>
  );
}

function HomestayCard({ item }: { item: HomestayCard }) {
  return (
    <Link href={`/homestays/${item.slug}`} className="rounded-2xl overflow-hidden bg-white shadow border border-gray-100 block">
      <div className="relative h-25">
        <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 90vw, 600px" />
        {item.best && (
          <div className="absolute left-2 top-2 text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1"><Crown size={12}/> Best</div>
        )}
        {item.discount ? (
          <div className="absolute right-2 top-2 text-[11px] bg-rose-600 text-white px-2 py-0.5 rounded-full">{item.discount}% off</div>
        ) : null}
      </div>
      <div className="p-2">
        <div className="text-[13px] font-semibold line-clamp-1">{item.name}</div>
        {item.location && <div className="text-[11px] text-gray-600 flex items-center"><MapPin size={12} className="mr-1"/>{item.location}</div>}
        <div className="mt-1 flex items-center justify-between">
          <div className="text-[12px] text-emerald-700 font-semibold">{typeof item.price === "number" ? `₹${item.price.toLocaleString()}` : "—"} <span className="text-[11px] text-gray-500 font-normal">/ night</span></div>
          {typeof item.rating === "number" && <div className="text-[12px] text-amber-600 inline-flex items-center gap-1"><Star size={12}/> {item.rating.toFixed(1)}</div>}
        </div>
      </div>
    </Link>
  );
}

function EventSponsoredCard({ item }: { item: EventCard }) {
  return (
    <Link href={`/events/${item.slug}`} className="snap-start min-w-[85%] mr-3 block">
      <div className="relative h-36 rounded-2xl overflow-hidden shadow">
        <Image src={item.image || "/placeholder.jpg"} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 90vw, 800px" />
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/70 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 p-3 text-white flex flex-col justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-[11px] uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded-full">{item.sponsored ? "Sponsored Event" : "Event"}</span>
            {item.date && <span className="text-[11px] bg-white text-gray-900 px-2 py-0.5 rounded-full inline-flex items-center gap-1"><CalendarDays size={12}/>{item.date}</span>}
          </div>
          <div className="font-semibold leading-snug text-sm pr-10">{item.title}</div>
          {item.place && <div className="text-xs opacity-90 inline-flex items-center gap-1"><MapPin size={12}/>{item.place}</div>}
        </div>
      </div>
    </Link>
  );
}

function RentalTagCard({ item }: { item: RentalCard }) {
  return (
    <Link href={`/rentals/${item.slug}`} className="rounded-2xl overflow-hidden bg-white shadow border border-gray-100 relative block">
      <div className="relative h-24">
        <Image src={item.image || "/placeholder.jpg"} alt={item.model || item.type} fill className="object-cover" sizes="(max-width: 768px) 90vw, 400px" />
      </div>
      {typeof item.pricePerDay === "number" && <div className="absolute right-2 top-2 bg-lime-600 text-white text-[11px] px-2 py-0.5 rounded">₹{item.pricePerDay}/day</div>}
      <div className="p-2">
        <div className="text-[13px] font-semibold line-clamp-1">{item.type}{item.model ? ` • ${item.model}` : ""}</div>
      </div>
    </Link>
  );
}

function CafeWideCard({ item }: { item: CafeCard }) {
  const [expanded, setExpanded] = useState(false);

  // stop Link navigation when clicking "Show more/less"
  const onToggle: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((v) => !v);
  };

  return (
    <Link href={`/cafesRestaurants/${item.slug}`} className="block">
      <div className="flex gap-3 bg-white border border-gray-100 shadow rounded-xl overflow-hidden p-2">
        <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name || "Cafe"}
              fill
              sizes="100px"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between py-1 pr-1 min-w-0">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {item.name || "Untitled"}
            </h3>

            <p className="text-xs text-gray-600">
              {expanded
                ? item.description
                : `${item.description?.slice(0, 100) ?? ""}${
                    item.description && item.description.length > 100 ? "..." : ""
                  }`}
              {item.description && item.description.length > 100 && (
                <button
                  onClick={onToggle}
                  className="ml-1 text-emerald-600 text-[11px] font-medium"
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </p>

            <p className="text-xs text-gray-500 mt-1 flex items-center truncate">
              <MapPin size={12} className="mr-1" />
              <span className="truncate">{item.location}</span>
            </p>
          </div>

          <div className="text-xs text-gray-500 mt-1 truncate">
            {(item.cuisine?.length ? item.cuisine.concat(", ") : "No cuisine")}
            {" • "}
            {item.type ?? "—"}
            {" • "}
            ⭐ {typeof item.ratings === "number" ? item.ratings.toFixed(1) : "N/A"}
          </div>
        </div>
      </div>
    </Link>
  );
}


function CafeList({ items }: { items: CafeCard[] }) {
  return (
    <section className="px-3">
      <div className="mb-1 px-0.5">
      </div>
      <div className="space-y-2">
        {items.map((c) => (
          <CafeWideCard key={c.id} item={c} />
        ))}
      </div>
    </section>
  );
}


function ItineraryList({ items }: { items: ItineraryCard[] }) {
  const list = items; // or items.slice(0, 10) if you only want 10
  return (
    <section className="">
      <div className="space-y-3">
        {list.map((i) => (
          <Link key={i.id} href={`/itineraries/${i.slug}`} aria-label={i.title} className="block">
            <div className="rounded-2xl bg-white/95 backdrop-blur border border-gray-100 shadow-sm p-2 flex gap-3 items-stretch">
              <div className="w-12 rounded-xl bg-sky-50 text-sky-700 flex flex-col items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,.6)]">
                <div className="text-[10px] uppercase">Days</div>
                <div className="text-base font-bold leading-none">{i.days ?? "—"}</div>
              </div>
              <div className="relative w-20 h-20">
                <Image
                  src={i.image || "/placeholder.jpg"}
                  alt={i.title}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 96px, 120px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold line-clamp-1">{i.title}</div>
                <div className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                  <MapPin size={12} className="inline mr-1"/>{i.start ?? "Meghalaya"}
                  {i.audience ? <> • <Users size={12} className="inline mx-1"/>{i.audience}</> : null}
                </div>
                {typeof i.priceFrom === "number" && (
                  <div className="mt-1 text-[11px] text-gray-700 line-clamp-1">
                    ₹{i.priceFrom.toLocaleString("en-IN")}+
                  </div>
                )}
                <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px]">
                  {i.sponsored && <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full">Sponsored</span>}
                  {(i.discountPct || 0) > 0 && (
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Percent size={12}/> {i.discountPct}% off
                    </span>
                  )}
                </div>
              </div>
              {typeof i.ratingAvg === "number" && (
                <div className="self-center text-[12px] text-amber-600 inline-flex items-center gap-1">
                  <Star size={12}/> {i.ratingAvg.toFixed(1)}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}


function Rail<T>({ items, render, twoUp=false }: { items: T[]; render: (item: T) => React.ReactNode; twoUp?: boolean }) {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory px-3 gap-3">
      {items.map((it: any) => (
        <div key={it.id} className={cx("snap-start", twoUp ? "min-w-[48%]" : "min-w-[85%]")}>{render(it)}</div>
      ))}
    </div>
  );
}

export default function HomeClient(props: HomeProps) {
  const [liked, setLiked] = useState(false);
  const { destinations, homestays, cafes, events, itineraries, rentals, blogs, tips } = props;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <HomeSEO />
      <div className="mx-auto w-full max-w-md">
        <Header />
        <TrendingZones />
        <QuickCategories />

        {/* Sponsored ads (we're using "events" list for now; can be a separate table later) */}
        {events?.length > 0 && (
          <section className="px-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2"><Megaphone size={16}/> Sponsored</div>
            <div className="flex overflow-x-auto snap-x snap-mandatory">
              {events.map((e) => <EventSponsoredCard key={e.id} item={e} />)}
            </div>
          </section>
        )}

        {/* ===== Group 1: Explore & Stay ===== */}
        <div className="px-3 pt-2 pb-3 bg-gradient-to-b from-emerald-50/60 to-white">
          <SectionHeader title="Destinations" icon={<Mountain size={16}/>} accent="bg-emerald-400" href="/destinations" />
          <Rail items={destinations} twoUp render={(d) => <DestinationCard item={d} />} />

          <SectionHeader title="Homestays" icon={<HomeIcon size={16}/>} accent="bg-indigo-400" href="/homestays" />
          <Rail items={homestays} twoUp render={(h) => <HomestayCard item={h} />} />
        </div>

                {/* Sponsored ads (we're using "events" list for now; can be a separate table later) */}
        {events?.length > 0 && (
          <section className="px-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2"><Megaphone size={16}/> Sponsored</div>
            <div className="flex overflow-x-auto snap-x snap-mandatory">
              {events.map((e) => <EventSponsoredCard key={e.id} item={e} />)}
            </div>
          </section>
        )}
        
        <Section title="Top - Homestays" href="/homestays">
          <div className="grid grid-cols-2 gap-3">
            {homestays.slice(0, 10).map(h => <HomestayVCard key={h.id} h={h} />)}
          </div>
        </Section>

        <Section title="Itineraries" href="/itineraries">
          <ItineraryList items={itineraries.slice(0, 10)} />
        </Section>

                {/* ===== Group 4: Logistics & Learn ===== */}
        <div className="px-3 pt-2 pb-3 bg-gradient-to-b from-lime-50/60 to-white">
          <SectionHeader title="Rentals" icon={<Bike size={16}/>} accent="bg-lime-400" href="/rentals" />
          <Rail items={rentals} twoUp render={(r) => <RentalTagCard item={r} />} />
        </div>

        {/* ===== Group 3: Eat & Plan ===== */}
        <div className="px-3 pt-2 pb-3 bg-gradient-to-b from-amber-50/60 to-white">
          <SectionHeader title="Cafes & Restaurants" icon={<Coffee size={16}/>} accent="bg-amber-400" href="/cafesRestaurants" />
          <CafeList items={cafes} />
        </div>
        <AllDestinations featured={destinations} />

        <FooterSpace/>
        <Footer />
      </div>
    </div>
  );
}
