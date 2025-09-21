// src/components/itineraries/ItinerariesClient.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays, MapPin, Star, Megaphone, Percent, Users,
  Heart, BadgeDollarSign, Home, User, Compass
} from "lucide-react";

export type Itin = {
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
  popularity?: number;
};

function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/* Header — same as baseline */
function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="px-3 py-2 flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold"
          aria-label="Meghtourism"
        >
          M
        </div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-500">Meghtourism</div>
          <div className="text-sm font-semibold">Explore Meghalaya</div>
        </div>
        <button
          onClick={() => alert("PWA: Add to Home Screen")}
          className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs"
          aria-label="Install app"
        >
          Install
        </button>
      </div>
    </header>
  );
}

/* Hero chip block */
function TrendingZones() {
  const zones = ["Shillong", "Sohra", "Mawlynnong"];
  return (
    <section className="mt-3">
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-4 text-white shadow-sm">
        <h2 className="text-lg font-bold">Discover Meghalaya, your way</h2>
        <p className="text-white/90 text-xs mt-1">Trending zones</p>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {zones.map((z) => (
            <span
              key={z}
              className="px-3 py-1.5 rounded-full bg-white/90 text-gray-900 text-sm shadow-sm"
            >
              #{z}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Uniform mini card (fixed image height + clamped text) */
function MiniItineraryCard({ item }: { item: Itin }) {
  const hasDeal = (item.discountPct || 0) > 0;
  const hasPrice = typeof item.priceFrom === "number";
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
      <div className="relative">
        <div className="relative w-full h-28">
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 480px"
            priority={false}
          />
        </div>
        <div className="absolute left-2 top-2 bg-white/90 text-gray-900 text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
          <CalendarDays size={12}/> {item.days}d
        </div>
        {item.audience && (
          <div className="absolute right-2 top-2 bg-white/90 text-gray-900 text-[11px] px-2 py-0.5 rounded-full">
            {item.audience}
          </div>
        )}
        {hasDeal && (
          <div className="absolute right-2 bottom-2 bg-emerald-600 text-white text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <Percent size={12}/> {item.discountPct}%
          </div>
        )}
      </div>
      <div className="p-2 min-h-[86px] flex flex-col justify-between">
        <div className="text-[13px] font-semibold leading-snug line-clamp-2">{item.title}</div>
        <div className="mt-1 flex items-center justify-between">
          <div className="text-[11px] text-gray-700">
            {hasPrice ? `₹${item.priceFrom!.toLocaleString("en-IN")}+` : "—"}
          </div>
          {typeof item.ratingAvg === "number" && (
            <div className="text-[12px] text-amber-600 inline-flex items-center gap-1">
              <Star size={12}/> {item.ratingAvg.toFixed(1)}
            </div>
          )}
        </div>
        <div className="text-[10px] text-gray-500 flex items-center">
          <MapPin size={12} className="mr-1"/>{item.start}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon, accent }: { title: string; icon: React.ReactNode; accent?: string }) {
  return (
    <div className="mt-4 mb-2 flex items-center">
      <span className={cx("inline-block w-2 h-2 rounded-full mr-2", accent || "bg-gray-300")} />
      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
        {icon} {title}
      </div>
    </div>
  );
}

/**
 * Rail
 * - "twoHalf": ~2.5 cards visible (min-w ~ 40%)
 * - "wide": ~85% card (hero-like)
 * - always gives a little bottom padding so nothing feels cut off
 */
function Rail({
  items,
  variant = "wide",
}: {
  items: Itin[];
  variant?: "twoHalf" | "wide" | "twoUp";
}) {
  const capped = (items ?? []).slice(0, 10);
  if (!capped.length) return null;

  const widthClass =
    variant === "twoHalf"
      ? "min-w-[40%]"     // ~2.5 cards visible
      : variant === "twoUp"
      ? "min-w-[48%]"     // 2 cards
      : "min-w-[85%]";    // hero

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 no-scrollbar pb-2">
      {capped.map((it) => (
        <div key={it.id} className={cx("snap-start", widthClass)}>
          <Link href={`/itineraries/${it.slug}`} className="block" aria-label={it.title}>
            <MiniItineraryCard item={it} />
          </Link>
        </div>
      ))}
    </div>
  );
}

/** Tabs (highlighted more) */
function SegmentedTabs({
  value,
  onChange,
}: {
  value: string; onChange: (v: string) => void;
}) {
  const items = ["All", "2–3d", "4–5d", "6–7d"];
  return (
    <div className="sticky top-[56px] z-30 bg-white/95 backdrop-blur">
      <div className="py-2">
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl border bg-gradient-to-r from-emerald-50 to-sky-50 shadow-[inset_0_1px_0_rgba(255,255,255,.6)]">
          {items.map((key) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cx(
                "px-2 py-1.5 rounded-full text-[12px] truncate transition-shadow",
                value === key
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              )}
              aria-pressed={value === key}
              title={key}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}

export default function ItinerariesClient({
  all, topPicks, sponsored, deals,
}: { all: Itin[]; topPicks: Itin[]; sponsored: Itin[]; deals: Itin[]; }) {
  const [tab, setTab] = useState("All");

  const filtered = useMemo(() => {
    if (tab === "2–3d") return all.filter((i) => i.days <= 3);
    if (tab === "4–5d") return all.filter((i) => i.days >= 4 && i.days <= 5);
    if (tab === "6–7d") return all.filter((i) => i.days >= 6 && i.days <= 7);
    return all;
  }, [tab, all]);

  const PAGE = 10;
  const [visible, setVisible] = useState(PAGE);
  const list = filtered.slice(0, visible);
  const canMore = visible < filtered.length;

  return (
    <div className="min-h-screen text-gray-900 bg-gradient-to-b from-emerald-50/40 via-white to-sky-50/40">
      {/* Center column + gutters (same baseline) */}
      <div className="mx-auto w-full max-w-md px-3">
        <Header />
        <TrendingZones />

        {/* Rails zone in a subtle card shell for separation */}
        <div className="mt-3 rounded-3xl border bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm p-3">
          <SectionHeader title="Top picks" icon={<Compass size={16}/>} accent="bg-sky-400" />
          <Rail items={topPicks} variant="twoHalf" />

          <SectionHeader title="Sponsored itineraries" icon={<Megaphone size={16}/>} accent="bg-rose-400" />
          <Rail items={sponsored} variant="wide" />

          <SectionHeader title="Deals" icon={<BadgeDollarSign size={16}/>} accent="bg-emerald-400" />
          <Rail items={deals} variant="twoHalf" />
        </div>

        {/* Highlighted filter bar */}
        <SegmentedTabs value={tab} onChange={(k) => { setTab(k); setVisible(PAGE); }} />

        {/* Main list with clearer sectioning */}
        <main className="mt-2 pb-28">
          {!list.length ? (
            <div className="text-center text-sm text-gray-600 py-12">No itineraries match this filter.</div>
          ) : (
            <div className="space-y-3">
              {list.map((i) => (
                <Link key={i.id} href={`/itineraries/${i.slug}`} aria-label={i.title} className="block">
                  <div className="rounded-2xl bg-white/95 backdrop-blur border border-gray-100 shadow-sm p-2 flex gap-3 items-stretch">
                    <div className="w-12 rounded-xl bg-sky-50 text-sky-700 flex flex-col items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,.6)]">
                      <div className="text-[10px] uppercase">Days</div>
                      <div className="text-base font-bold leading-none">{i.days}</div>
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
                        <MapPin size={12} className="inline mr-1"/>{i.start}
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
          )}

          {canMore && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setVisible((v) => v + PAGE)}
                className="px-4 py-2 rounded-full text-sm bg-gray-900 text-white hover:bg-gray-800 shadow"
              >
                Load more
              </button>
            </div>
          )}
        </main>

        {/* Bottom nav (unchanged) */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur border-t z-40">
          <div className="px-6 py-2 grid grid-cols-4 text-xs">
            <Link href="/" className="flex flex-col items-center text-sky-700"><Home size={20}/>Home</Link>
            <Link href="/ads" className="flex flex-col items-center text-gray-600"><Megaphone size={20}/>Ads</Link>
            <Link href="/saved" className="flex flex-col items-center text-gray-600"><Heart size={20}/>Saved</Link>
            <Link href="/profile" className="flex flex-col items-center text-gray-600"><User size={20}/>Profile</Link>
          </div>
        </nav>

        {/* Hide scrollbars for rails */}
        <style jsx global>{`
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </div>
  );
}
