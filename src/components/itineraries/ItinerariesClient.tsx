// src/components/itineraries/ItinerariesClient.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays, MapPin, Star, Megaphone, Percent, Users,
  Heart, BadgeDollarSign, Home, User, Compass
} from "lucide-react";

type Itin = {
  id: string;
  slug: string;
  title: string;
  image?: string;
  days: number;
  start: string;
  audience?: string;
  sponsored?: boolean;
  discountPct?: number;
  featured?: boolean;
  priceFrom?: number;
  ratingAvg?: number | null;
  ratingCount?: number;
  description?: string;
};

function cx(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" "); }

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="px-3 py-2 flex items-center gap-2">
        <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold">M</div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-500">Meghtourism</div>
          <div className="text-sm font-semibold">Itineraries</div>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs">Install</button>
      </div>
    </header>
  );
}

function TrendingZones({ zones = ["Shillong", "Sohra", "Dawki"] }: { zones?: string[] }) {
  return (
    <section className="px-3 mt-2">
      <div className="rounded-3xl overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky-600 via-indigo-500 to-violet-600 p-4 text-white">
        <h2 className="text-lg font-bold">Plan by vibe</h2>
        <p className="text-white/90 text-xs mt-1">Trending zones (suggestions)</p>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {zones.map((z) => (
            <span key={z} className="px-3 py-1.5 rounded-full bg-white/90 text-gray-900 text-sm shadow-sm">#{z}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniItineraryCard({ item }: { item: Itin }) {
  const hasDeal = (item.discountPct || 0) > 0;
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow border border-gray-100">
      <div className="relative">
        <div className="relative w-full h-28">
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 90vw, 480px"
          />
        </div>
        <div className="absolute left-2 top-2 bg-white/90 text-gray-900 text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1"><CalendarDays size={12}/> {item.days}d</div>
        {item.audience && <div className="absolute right-2 top-2 bg-white/90 text-gray-900 text-[11px] px-2 py-0.5 rounded-full">{item.audience}</div>}
        {hasDeal && (
          <div className="absolute right-2 bottom-2 bg-emerald-600 text-white text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1"><Percent size={12}/> {item.discountPct}%</div>
        )}
      </div>
      <div className="p-2">
        <div className="text-[13px] font-semibold line-clamp-2 leading-snug">{item.title}</div>
        <div className="text-[11px] text-gray-600 flex items-center"><MapPin size={12} className="mr-1"/>{item.start}</div>
        <div className="mt-1 flex items-center justify-between">
          <div className="text-[11px] text-gray-700">₹{(item.priceFrom || 0).toLocaleString()}+</div>
          {typeof item.ratingAvg === "number" && (
            <div className="text-[12px] text-amber-600 inline-flex items-center gap-1"><Star size={12}/> {item.ratingAvg.toFixed(1)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon, accent }: { title: string; icon: React.ReactNode; accent?: string }) {
  return (
    <div className="px-3 mt-4 mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
        <span className={cx("inline-block w-2 h-2 rounded-full", accent || "bg-gray-300")} />
        {icon} {title}
      </div>
      <button className="text-xs text-gray-500">View all</button>
    </div>
  );
}

function Rail({ items, twoUp = false }: { items: Itin[]; twoUp?: boolean }) {
  if (!items?.length) return null;
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory px-3 gap-3">
      {items.map((it) => (
        <div key={it.id} className={cx("snap-start", twoUp ? "min-w-[48%]" : "min-w-[85%]")}>
          <Link href={`/itineraries/${it.slug}`} className="block">
            <MiniItineraryCard item={it} />
          </Link>
        </div>
      ))}
    </div>
  );
}

function SegmentedTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const items = ["All", "2–3d", "4–5d", "6–7d", "Family", "Couple", "Backpacker", "Workation", "Sponsored", "Deals"];
  return (
    <div className="sticky top-[56px] z-30 bg-white/95 backdrop-blur border-b">
      <div className="px-3 py-2 overflow-x-auto">
        <div className="inline-flex gap-2 p-1 bg-gray-100 rounded-full">
          {items.map((key) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cx("px-3 py-1.5 rounded-full text-sm", value === key ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900")}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ItinerariesClient({
  all, topPicks, sponsored, deals,
}: { all: Itin[]; topPicks: Itin[]; sponsored: Itin[]; deals: Itin[]; }) {
  const [tab, setTab] = useState("All");

  const list = useMemo(() => {
    if (tab === "2–3d") return all.filter((i) => i.days <= 3);
    if (tab === "4–5d") return all.filter((i) => i.days >= 4 && i.days <= 5);
    if (tab === "6–7d") return all.filter((i) => i.days >= 6 && i.days <= 7);
    if (["Family", "Couple", "Backpacker", "Workation"].includes(tab)) return all.filter((i) => i.audience === tab);
    if (tab === "Sponsored") return sponsored;
    if (tab === "Deals") return deals;
    return all;
  }, [tab, all, deals, sponsored]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto w-full max-w-md">
        <Header />
        <TrendingZones />

        {/* Rails */}
        <div className="pt-2 pb-3 bg-gradient-to-b from-sky-50/60 to-white">
          <SectionHeader title="Top picks" icon={<Compass size={16}/>} accent="bg-sky-400" />
          <Rail items={topPicks} twoUp />

          <SectionHeader title="Sponsored itineraries" icon={<Megaphone size={16}/>} accent="bg-rose-400" />
          <Rail items={sponsored} />

          <SectionHeader title="Deals" icon={<BadgeDollarSign size={16}/>} accent="bg-emerald-400" />
          <Rail items={deals} twoUp />
        </div>

        <SegmentedTabs value={tab} onChange={setTab} />

        {/* Main list */}
        <main className="mt-2 pb-28">
          {!list.length && (
            <div className="text-center text-sm text-gray-600 py-10">No itineraries match this filter.</div>
          )}
          {list.map((i) => (
            <div key={i.id} className="px-3">
              <Link href={`/itineraries/${i.slug}`} className="block">
                <div className="rounded-2xl bg-white border border-gray-100 shadow p-2 flex gap-3 items-stretch mb-3">
                  <div className="w-12 rounded-xl bg-sky-50 text-sky-700 flex flex-col items-center justify-center">
                    <div className="text-[10px] uppercase">Days</div>
                    <div className="text-base font-bold leading-none">{i.days}</div>
                  </div>
                  <div className="relative w-20 h-20">
                    <Image
                      src={i.image || "/placeholder.jpg"}
                      alt={i.title}
                      fill
                      className="object-cover rounded-xl"
                      sizes="(max-width: 480px) 80px, 120px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold line-clamp-1">{i.title}</div>
                    <div className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                      <MapPin size={12} className="inline mr-1"/>{i.start} {i.audience ? <>• <Users size={12} className="inline mx-1"/>{i.audience}</> : null}
                    </div>
                    <div className="mt-1 text-[11px] text-gray-700 line-clamp-1">₹{(i.priceFrom || 0).toLocaleString()}+</div>
                    <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px]">
                      {i.sponsored && <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full">Sponsored</span>}
                      {(i.discountPct || 0) > 0 && <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1"><Percent size={12}/> {i.discountPct}% off</span>}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </main>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur border-t z-40">
          <div className="px-6 py-2 grid grid-cols-4 text-xs">
            <button className="flex flex-col items-center text-sky-700"><Home size={20}/>Home</button>
            <button className="flex flex-col items-center text-gray-600"><Megaphone size={20}/>Ads</button>
            <button className="flex flex-col items-center text-gray-600"><Heart size={20}/>Saved</button>
            <button className="flex flex-col items-center text-gray-600"><User size={20}/>Profile</button>
          </div>
        </nav>
      </div>
    </div>
  );
}
