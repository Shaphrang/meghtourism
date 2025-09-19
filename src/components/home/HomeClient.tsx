"use client";
import ImageFill from "@/components/ui/ImageFill";
import HomeSEO from "@/components/seo/HomeSEO";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home as HomeIcon, MapPin, Star, Mountain, CalendarDays, Compass, Coffee,
  UtensilsCrossed, Bike, BookOpen, Info, Megaphone, Crown, Heart, User, ChevronRight,
} from "lucide-react";

function cx(...c: any[]) { return c.filter(Boolean).join(" "); }

/** Tiny shapes the cards need (map DB fields to these) */
export type DestinationCard = { id: string; slug: string; name: string; image?: string; location?: string; type?: string; rating?: number };
export type HomestayCard    = { id: string; slug: string; name: string; image?: string; location?: string; price?: number; rating?: number; best?: boolean; discount?: number };
export type EventCard       = { id: string; slug: string; title: string; image?: string; date?: string; place?: string; sponsored?: boolean };
export type ThrillCard      = { id: string; slug: string; title: string; image?: string; duration?: string; grade?: string };
export type CafeCard        = { id: string; slug: string; name: string; image?: string; description?: string; type?: string; cuisine?: string; location?: string; ratings?: number; priceForTwo?: number };
export type ItineraryCard   = { id: string; slug: string; title: string; image?: string; days?: number; audience?: string };
export type RentalCard      = { id: string; slug: string; type: string; model?: string; image?: string; pricePerDay?: number };
export type BlogCard        = { id: string; slug: string; title: string; read?: number };
export type TipCard         = { id: string; slug: string; title: string };
export type FaqCard         = { id: string; slug: string; q: string };

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
    { key: "Events", icon: <CalendarDays size={18}/>, href: "/events", color: "bg-rose-50 text-rose-700" },
    { key: "Thrills", icon: <Compass size={18}/>, href: "/thrills", color: "bg-orange-50 text-orange-700" },
    { key: "Cafes", icon: <Coffee size={18}/>, href: "/cafesRestaurants", color: "bg-amber-50 text-amber-700" },
    { key: "Itineraries", icon: <BookOpen size={18}/>, href: "/itineraries", color: "bg-sky-50 text-sky-700" },
    { key: "Rentals", icon: <Bike size={18}/>, href: "/rentals", color: "bg-lime-50 text-lime-700" },
    { key: "Blogs", icon: <UtensilsCrossed size={18}/>, href: "/blogs", color: "bg-fuchsia-50 text-fuchsia-700" },
    { key: "Tips", icon: <Info size={18}/>, href: "/travelTips", color: "bg-gray-50 text-gray-700" },
    { key: "FAQs", icon: <Info size={18}/>, href: "/faqs", color: "bg-gray-50 text-gray-700" },
  ];
  return (
    <section className="px-3 mt-3">
      <div className="grid grid-cols-5 gap-2">
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

function ThrillSplitCard({ item }: { item: ThrillCard }) {
  return (
    <Link href={`/thrills/${item.slug}`} className="rounded-2xl overflow-hidden bg-white shadow border border-gray-100 block">
      <div className="relative h-28">
        <Image src={item.image || "/placeholder.jpg"} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 90vw, 500px" />
        {item.duration && <div className="absolute left-2 top-2 bg-orange-100 text-orange-800 text-[11px] px-2 py-0.5 rounded-full">{item.duration}</div>}
        {item.grade && <div className="absolute right-2 bottom-2 bg-white/90 text-gray-900 text-[11px] px-2 py-0.5 rounded-full">{item.grade}</div>}
      </div>
      <div className="p-2">
        <div className="text-[13px] font-semibold line-clamp-2 leading-snug">{item.title}</div>
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

function BlogEditorialCard({ item }: { item: BlogCard }) {
  return (
    <Link href={`/blogs/${item.slug}`} className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-3 block">
      <div className="text-[13px] font-semibold leading-snug line-clamp-2">{item.title}</div>
      {typeof item.read === "number" && <div className="text-[11px] text-gray-600 mt-1">{item.read} min read</div>}
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


function ItineraryListItem({ item }: { item: ItineraryCard }) {
  return (
    <Link href={`/itineraries/${item.slug}`} className="rounded-2xl bg-white border border-gray-100 shadow p-2 flex gap-3 items-stretch">
      <div className="relative w-20 h-20">
        <Image src={item.image || "/placeholder.jpg"} alt={item.title} fill className="object-cover rounded-xl" sizes="80px" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold line-clamp-2 leading-snug">{item.title}</div>
        {item.audience && <div className="text-xs text-gray-600 mt-0.5">{item.audience} trip</div>}
      </div>
      <ChevronRight size={18} className="text-gray-400 self-center" />
    </Link>
  );
}

function ItineraryList({ items }: { items: ItineraryCard[] }) {
  const visible = items
  return (
    <section className="px-3">
      <div className="flex items-center justify-between mb-1 px-0.5">
      </div>
      <div className="space-y-2">{visible.map((i) => <ItineraryListItem key={i.id} item={i} />)}</div>
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
  const { destinations, homestays, events, thrills, cafes, itineraries, rentals, blogs, tips, faqs } = props;

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

        {/* ===== Group 2: Happenings & Adventure ===== */}
        <div className="px-3 pt-2 pb-3 bg-gradient-to-b from-rose-50/60 to-white">
          <SectionHeader title="Events" icon={<CalendarDays size={16}/>} accent="bg-rose-400" href="/events" />
          <div className="flex overflow-x-auto snap-x snap-mandatory px-3 gap-3">
            {events.map((e) => <EventSponsoredCard key={e.id} item={e} />)}
          </div>

          <SectionHeader title="Thrills" icon={<Compass size={16}/>} accent="bg-orange-400" href="/thrills" />
          <Rail items={thrills} twoUp render={(t) => <ThrillSplitCard item={t} />} />
        </div>

        {/* ===== Group 3: Eat & Plan ===== */}
        <div className="px-3 pt-2 pb-3 bg-gradient-to-b from-amber-50/60 to-white">
          <SectionHeader title="Cafes & Restaurants" icon={<Coffee size={16}/>} accent="bg-amber-400" href="/cafesRestaurants" />
          <CafeList items={cafes} />

          <SectionHeader title="Itineraries" icon={<BookOpen size={16}/>} accent="bg-sky-400" href="/itineraries" />
          <ItineraryList items={itineraries} />
        </div>

        {/* ===== Group 4: Logistics & Learn ===== */}
        <div className="px-3 pt-2 pb-3 bg-gradient-to-b from-lime-50/60 to-white">
          <SectionHeader title="Rentals" icon={<Bike size={16}/>} accent="bg-lime-400" href="/rentals" />
          <Rail items={rentals} twoUp render={(r) => <RentalTagCard item={r} />} />

          <SectionHeader title="Blogs" icon={<UtensilsCrossed size={16}/>} accent="bg-fuchsia-400" href="/blogs" />
          <div className="px-3">
            <div className="grid grid-cols-1 gap-2">
              {blogs.map((b) => <BlogEditorialCard key={b.id} item={b} />)}
            </div>
          </div>

          <SectionHeader title="Travel Tips" icon={<Info size={16}/>} accent="bg-gray-400" href="/travelTips" />
          <div className="px-3">
            <div className="grid grid-cols-1 gap-2">
              {tips.map((t) => (
                <Link key={t.id} href={`/travelTips/${t.slug}`} className="rounded-2xl overflow-hidden bg-white shadow border border-gray-100 p-3 block">
                  <div className="text-[13px] font-semibold leading-snug">{t.title}</div>
                  <div className="text-[11px] text-gray-600 mt-1">Travel tip</div>
                </Link>
              ))}
            </div>
          </div>

          <SectionHeader title="FAQs" icon={<Info size={16}/>} accent="bg-gray-400" href="/faqs" />
          <div className="px-3">
            <div className="grid grid-cols-1 gap-2">
              {faqs.map((f) => (
                <Link key={f.id} href={`/faqs/${f.slug}`} className="rounded-2xl overflow-hidden bg-white shadow border border-gray-100 p-3 block">
                  <div className="text-[13px] font-semibold leading-snug">{f.q}</div>
                  <div className="text-[11px] text-gray-600 mt-1">FAQ</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="h-24"/>
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur border-t z-40">
          <div className="px-6 py-2 grid grid-cols-4 text-xs">
            <Link href="/" className="flex flex-col items-center text-emerald-700"><HomeIcon size={20}/>Home</Link>
            <Link href="/ads" className="flex flex-col items-center text-gray-600"><Megaphone size={20}/>Ads</Link>
            <button onClick={() => setLiked(!liked)} className={cx("flex flex-col items-center", liked ? "text-rose-600" : "text-gray-600")}><Heart size={20}/>Saved</button>
            <Link href="/profile" className="flex flex-col items-center text-gray-600"><User size={20}/>Profile</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
