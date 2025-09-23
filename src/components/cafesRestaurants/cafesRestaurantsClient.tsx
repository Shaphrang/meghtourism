"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Coffee,
  Utensils,
  MapPin,
  Megaphone,
  Wifi,
  Music2,
  BadgeDollarSign,
  Compass,
} from "lucide-react";
import type { CafeAndRestaurant } from "@/types/cafeRestaurants";

function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/* ---------------- helpers ---------------- */

const norm = (t?: string | null) => (t ?? "");

type TabKey = "All" | "Cafes" | "Restaurants" | "Others";

/** Classifier: maps each item to a tab bucket */
function classify(item: Partial<CafeAndRestaurant>): TabKey {
  const t = norm(item.type);
  if (t === "Cafe") return "Cafes";
  if (t === "Restaurant") return "Restaurants";
  return "Others";
}

/** Friendly logging helpers */
function logTitle(title: string) {
  console.log(
    `%c${title}`,
    "background:#111;color:#fff;padding:2px 6px;border-radius:6px;font-weight:600;"
  );
}

function logKeyVal(label: string, value: any) {
  console.log(`%c${label}:`, "color:#0ea5e9;font-weight:600", value);
}

function logDivider() {
  console.log("%c— — — — — — — — — — — — — — — —", "color:#94a3b8");
}

/* ---------------- header ---------------- */

function Header() {
  return (
    <header className="bg-white/95 backdrop-blur border-b w-full">
      <div className="px-3 py-2 flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold"
          aria-label="Meghtourism"
        >
          M
        </div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-500">Meghtourism</div>
          <div className="text-sm font-semibold">Cafes & Restaurants</div>
        </div>
        <button
          onClick={() => alert("PWA: Add to Home Screen")}
          className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs"
          aria-label="Install app"
          type="button"
        >
          Install
        </button>
      </div>
    </header>
  );
}

/* ---------------- trending zones ---------------- */

function TrendingZones({ all }: { all: Partial<CafeAndRestaurant>[] }) {
  const zones = useMemo(() => {
    const counts = new Map<string, number>();
    for (const x of all) {
      const key = (x.area || x.location || "").trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    const top = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k);
    return top.length ? top : ["Laitumkhrah", "Police Bazar", "Shillong"];
  }, [all]);

  return (
    <section className="mt-3">
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-4 text-white shadow-sm">
        <h2 className="text-lg font-bold">Taste Meghalaya</h2>
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

/* ---------------- section header ---------------- */

function SectionHeader({
  title,
  icon,
  accent,
}: {
  title: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="mt-4 mb-2 flex items-center">
      <span className={cx("inline-block w-2 h-2 rounded-full mr-2", accent || "bg-gray-300")} />
      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
        {icon} {title}
      </div>
    </div>
  );
}

/* ---------------- cards & rails ---------------- */

function CafeMiniCard({ item }: { item: Partial<CafeAndRestaurant> }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
      <div className="relative">
        <div className="relative w-full h-28">
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.name ?? "Cafe / Restaurant"}
            fill
            className="object-cover"
            sizes="(max-width:768px) 90vw, 420px"
            unoptimized
          />
        </div>
        <div className="absolute left-2 top-2 bg-white/90 text-gray-900 text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
          {norm(item.type) === "cafe" ? <Coffee size={12} /> : <Utensils size={12} />} {item.type}
        </div>
      </div>
      <div className="p-2 min-h-[70px]">
        <div className="text-[13px] font-semibold line-clamp-2 leading-snug">
          {item.name}
        </div>
        <div className="text-[11px] text-gray-600 flex items-center mt-1">
          <MapPin size={12} className="mr-1" />
          {item.area || item.location || "…"}
        </div>
        <div className="mt-1 text-[11px] text-gray-700">
          {typeof item.averagecost === "number" ? `₹${item.averagecost} avg` : ""}
        </div>
      </div>
    </div>
  );
}

function Rail<T>({
  items,
  render,
  variant = "wide",
}: {
  items: T[];
  render: (x: T) => React.ReactNode;
  variant?: "twoHalf" | "wide" | "twoUp";
}) {
  const capped = (items ?? []).slice(0, 10);
  if (!capped.length) return null;

  const widthClass =
    variant === "twoHalf" ? "min-w-[40%]" :
    variant === "twoUp"   ? "min-w-[48%]" :
                            "min-w-[85%]";

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 no-scrollbar pb-2">
      {capped.map((it: any) => (
        <div key={it.id} className={cx("snap-start", widthClass)}>
          {render(it)}
        </div>
      ))}
    </div>
  );
}

/* ---------------- non-sticky filter bar (below sections) ---------------- */

function SegmentedTabs({
  value,
  onChange,
  counts,
  onLogClick,
}: {
  value: TabKey;
  onChange: (v: TabKey) => void;
  counts: { All: number; Cafes: number; Restaurants: number; Others: number };
  onLogClick: (v: TabKey) => void;
}) {
  const items: TabKey[] = ["All", "Cafes", "Restaurants", "Others"];
  return (
    <div className="mt-3">
      <div className="grid grid-cols-4 gap-0 p-1 rounded-2xl border bg-gradient-to-r from-emerald-50 to-sky-50 shadow-[inset_0_1px_0_rgba(255,255,255,.6)]">
        {items.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => { onChange(key); onLogClick(key); }}
            className={cx(
              "px-2 py-1.5 rounded-full text-[12px] truncate transition-shadow",
              value === key ? "bg-white shadow text-gray-900" : "text-gray-700 hover:text-gray-900"
            )}
            aria-pressed={value === key}
            title={`${key} (${counts[key]})`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- list row ---------------- */

function CafeListRow({ item }: { item: Partial<CafeAndRestaurant> }) {
  return (
    <Link href={`/cafesRestaurants/${item.slug}`} className="block">
      <div className="rounded-2xl bg-white/95 backdrop-blur border border-gray-100 shadow-sm p-2 flex gap-3 items-stretch">
        <div className="relative w-20 h-20">
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.name ?? "Cafe / Restaurant"}
            fill
            className="object-cover rounded-xl"
            sizes="96px"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold line-clamp-1">{item.name}</div>
          <div className="text-xs text-gray-600 mt-0.5 line-clamp-1">
            <MapPin size={12} className="inline mr-1" />
            {item.area || item.location || "…"}
          </div>
          <div className="text-[11px] text-gray-700 mt-0.5 line-clamp-2">
            {item.description?.trim() || "…"}
          </div>
          <div className="text-xs text-gray-700 mt-0.5 inline-flex items-center gap-2">
            {item.features?.includes("wifi") && (
              <span className="inline-flex items-center gap-1">
                <Wifi size={12} /> Wi-Fi
              </span>
            )}
            {item.features?.includes("live") && (
              <span className="inline-flex items-center gap-1">
                <Music2 size={12} /> Live
              </span>
            )}
          </div>
          {!!item.cuisine?.length && (
            <div className="mt-1 text-[11px] text-gray-600 line-clamp-1">
              {item.cuisine.join(" • ")}
            </div>
          )}
          <div className="mt-1 text-[11px] text-gray-500">
            {norm(item.type) === "restaurant" ? "Restaurant"
              : norm(item.type) === "cafe" ? "Cafe"
              : item.type || "—"}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ---------------- main component ---------------- */

export default function CafesRestaurantsClient({
  all,
  topPicks,
  sponsored,
  deals,
}: {
  all: Partial<CafeAndRestaurant>[];
  topPicks: Partial<CafeAndRestaurant>[];
  sponsored: Partial<CafeAndRestaurant>[];
  deals: Partial<CafeAndRestaurant>[];
}) {
  const [tab, setTab] = useState<TabKey>("All");

  // Precompute buckets and counts once per payload
  const { counts, byTab } = useMemo(() => {
    const map: Record<Exclude<TabKey, "All">, Partial<CafeAndRestaurant>[]> = {
      Cafes: [],
      Restaurants: [],
      Others: [],
    };
    for (const item of all) {
      const bucket = classify(item);
      if (bucket !== "All") map[bucket].push(item);
    }
    const result = {
      counts: {
        All: all.length,
        Cafes: map.Cafes.length,
        Restaurants: map.Restaurants.length,
        Others: map.Others.length,
      },
      byTab: map,
    };
    return result;
  }, [all]);

  /* ---------------- friendly logs ---------------- */

  // Log on mount / when data changes
  useEffect(() => {
    logTitle("📦 CafesRestaurantsClient: Initial payload");
    logKeyVal("All items", all.length);
    logKeyVal("TopPicks", topPicks.length);
    logKeyVal("Sponsored", sponsored.length);
    logKeyVal("Deals", deals.length);
    logDivider();
    logTitle("🧭 Classification summary");
    console.log(`Cafes: ${counts.Cafes} | Restaurants: ${counts.Restaurants} | Others: ${counts.Others}`);
    console.table(
      (all.slice(0, 5) || []).map((x) => ({
        id: x.id,
        name: x.name,
        type: x.type,
        area: x.area,
        location: x.location,
        avg: x.averagecost,
      }))
    );
    logDivider();
  }, [all, topPicks, sponsored, deals, counts]);

  // On tab click, print a very explicit, user-friendly log
  const handleLogTab = (key: TabKey) => {
    const data =
      key === "All" ? all :
      key === "Cafes" ? byTab.Cafes :
      key === "Restaurants" ? byTab.Restaurants :
      byTab.Others;

    console.groupCollapsed(`🔎 Filter → ${key} | showing ${data.length} item(s)`);
    console.log(`Tip: Only items with type === "${key.slice(0, -1).toLowerCase()}" appear here (Others = not cafe/restaurant).`);
    console.table(
      (data.slice(0, 10) || []).map((x) => ({
        id: x.id,
        name: x.name,
        type: x.type,
        area: x.area,
        location: x.location,
        avg: x.averagecost,
      }))
    );
    console.groupEnd();
  };

  // Filtered list for the active tab
  const filtered = useMemo(() => {
    if (tab === "All") return all;
    if (tab === "Cafes") return byTab.Cafes;
    if (tab === "Restaurants") return byTab.Restaurants;
    return byTab.Others;
  }, [tab, all, byTab]);

  // Also log whenever the tab changes (for extra visibility)
  useEffect(() => {
    handleLogTab(tab);
  }, [tab]);

  /* ---------------- pagination ---------------- */

  const PAGE = 10;
  const [visible, setVisible] = useState(PAGE);
  useEffect(() => {
    setVisible(PAGE); // reset when tab changes
  }, [tab]);
  const list = filtered.slice(0, visible);
  const canMore = visible < filtered.length;

  /* ---------------- render ---------------- */

  return (
    <div className="min-h-screen text-gray-900 bg-gradient-to-b from-emerald-50/40 via-white to-sky-50/40">
      {/* Full-width header */}
      <Header />

      {/* Center column */}
      <div className="mx-auto w-full max-w-md px-3">
        <TrendingZones all={all} />

        {/* Rails */}
        <div className="mt-3 rounded-3xl border bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm p-3">
          <SectionHeader title="Top picks" icon={<Compass size={16} />} accent="bg-sky-400" />
          <Rail
            items={topPicks}
            variant="twoHalf"
            render={(x) => (
              <Link href={`/cafesRestaurants/${x.slug}`} className="block">
                <CafeMiniCard item={x} />
              </Link>
            )}
          />

          <SectionHeader title="Sponsored" icon={<Megaphone size={16} />} accent="bg-rose-400" />
          <Rail
            items={sponsored}
            variant="wide"
            render={(x) => (
              <Link href={`/cafesRestaurants/${x.slug}`} className="block">
                <CafeMiniCard item={x} />
              </Link>
            )}
          />

          <SectionHeader title="Deals" icon={<BadgeDollarSign size={16} />} accent="bg-emerald-400" />
          <Rail
            items={deals}
            variant="twoHalf"
            render={(x) => (
              <Link href={`/cafesRestaurants/${x.slug}`} className="block">
                <CafeMiniCard item={x} />
              </Link>
            )}
          />
        </div>

        {/* Filter bar (non-sticky, below sections) */}
        <SegmentedTabs
          value={tab}
          onChange={(k) => setTab(k)}
          counts={counts}
          onLogClick={handleLogTab}
        />

        {/* Main list */}
        <main className="mt-2 pb-28">
          {!list.length ? (
            <div className="text-center text-sm text-gray-600 py-12">
              No places match this filter.
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((i) => (
                <CafeListRow key={i.id} item={i} />
              ))}
            </div>
          )}

          {canMore && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE)}
                className="px-4 py-2 rounded-full text-sm bg-gray-900 text-white hover:bg-gray-800 shadow"
              >
                Load more
              </button>
            </div>
          )}
        </main>

        {/* Hide scrollbars for rails */}
        <style jsx global>{`
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </div>
  );
}
