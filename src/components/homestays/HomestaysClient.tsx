//src\components\homestays\HomestaysClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Megaphone,
  Star,
  Crown,
  BadgePercent, HomeIcon, User
} from "lucide-react";
import HomestaysSEO from "@/components/seo/HomestaysSeo";
import Footer from "@/components/common/footer";
import FooterSpace from "@/components/common/FooterSpace";

/* ---------------- Types ---------------- */

export type HomestayCard = {
  id: string;
  slug: string;
  name: string;
  image?: string | null;
  location?: string | null;
  district?: string | null;
  price?: number | null;
  rating?: number | null;
  ratingCount?: number | null;
  discount?: number | null;
  sponsored?: boolean;
  best?: boolean; // local UI badge
};

// New price range keys (single dropdown)
type PriceRangeKey = "" | "lt1500" | "1500-2500" | "2500-5000" | "gt5000";
type TabKey = "all" | "best" | "top" | "deals" | "ads";

/* ---------------- Utilities ---------------- */

// normalize simple string for equality checks
function norm(s?: string | null) {
  return (s || "").trim().toLowerCase();
}

// map legacy {priceOp, price} -> new {priceRange}
function opValToRange(op?: string, price?: number | null): PriceRangeKey {
  if (typeof price !== "number") return "";
  if (price < 1500) return "lt1500";
  if (price <= 2500) return "1500-2500";
  if (price <= 5000) return "2500-5000";
  return "gt5000";
}

// predicate for price range bucket
function inPriceRange(price: number | null | undefined, range: PriceRangeKey) {
  if (!range || typeof price !== "number") return true;
  switch (range) {
    case "lt1500":
      return price < 1500;
    case "1500-2500":
      return price >= 1500 && price <= 2500;
    case "2500-5000":
      return price > 2500 && price <= 5000;
    case "gt5000":
      return price > 5000;
    default:
      return true;
  }
}

// apply client-side filters to an array
function filterItems(
  items: HomestayCard[],
  location: string,
  priceRange: PriceRangeKey
) {
  const loc = norm(location);
  return items.filter((it) => {
    const locOk =
      !loc ||
      norm(it.location) === loc ||
      norm(it.district) === loc;
    const priceOk = inPriceRange(it.price ?? null, priceRange);
    return locOk && priceOk;
  });
}

/* ---------------- Header ---------------- */

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="px-3 py-2 flex items-center gap-2">
        <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
          M
        </div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-500">Meghtourism</div>
          <div className="text-sm font-semibold">Homestays in Meghalaya</div>
        </div>
        <Link href="/" className="text-xs text-emerald-700">
          Home
        </Link>
      </div>
    </header>
  );
}

/* ---------------- Filters ---------------- */

function FiltersBar({
  locations,
  selected,
  onChangeLocation,
  onChangePriceRange,
  onReset,
}: {
  locations: string[];
  selected: { location: string; priceRange: PriceRangeKey };
  onChangeLocation: (loc: string) => void;
  onChangePriceRange: (range: PriceRangeKey) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 text-white p-5 m-3"

>
      <div className="max-w-5xl mx-auto">
        <div className="text-xs opacity-90">Find homestays by</div>
        <h1 className="text-2xl font-bold">Trending Zones</h1>

        {/* compact 3-item grid, no scroll */}
        <div className="mt-3 grid grid-cols-3 gap-2 max-w-2xl">
          {/* Location (clears price range) */}
          <select
            value={selected.location}
            onChange={(e) => onChangeLocation(e.target.value)}
            className="px-2 py-1.5 rounded-full text-xs bg-white/95 text-gray-900"
          >
            <option value="">Location</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          {/* Price range (clears location) */}
          <select
            value={selected.priceRange}
            onChange={(e) => onChangePriceRange(e.target.value as PriceRangeKey)}
            className="px-2 py-1.5 rounded-full text-xs bg-white/95 text-gray-900"
          >
            <option value="">Price</option>
            <option value="lt1500">Less than ₹1500</option>
            <option value="1500-2500">₹1500 – ₹2500</option>
            <option value="2500-5000">₹2500 – ₹5000</option>
            <option value="gt5000">₹5000 and above</option>
          </select>

          {/* Reset */}
          <button
            onClick={onReset}
            className="px-2 py-1.5 rounded-full text-xs bg-white/15 border border-white/30"
            title="Reset filters"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Cards ---------------- */

type BadgeKind = "best" | "top" | "deals" | "ads" | undefined;

function Badge({ kind }: { kind?: BadgeKind }) {
  if (!kind) return null;
  const base =
    "absolute left-2 top-2 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1";
  switch (kind) {
    case "best":
      return (
        <div className={`${base} bg-amber-100 text-amber-800`}>
          <Crown size={12} /> Best
        </div>
      );
    case "top":
      return (
        <div className={`${base} bg-white/95 text-gray-900 border border-amber-200`}>
          <Star size={12} className="text-amber-500" /> Top rated
        </div>
      );
    case "deals":
      return (
        <div className={`${base} bg-emerald-100 text-emerald-800`}>
          <BadgePercent size={12} /> Deal
        </div>
      );
    case "ads":
      return (
        <div className={`${base} bg-indigo-100 text-indigo-800`}>
          <Megaphone size={12} /> Ad
        </div>
      );
  }
}

function HomeStyleHomestayCard({
  item,
  badge,
  imgH = "h-25", // NEW: default for rails
}: {
  item: HomestayCard;
  badge?: BadgeKind;
  imgH?: string;
}) {
  return (
    <Link
      href={`/homestays/${item.slug}`}
      className="rounded-2xl overflow-hidden bg-white shadow border border-gray-100 block"
    >
      <div className={`relative ${imgH || "h-25"}`}>
        <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, 600px"
        />
        {/* Tab badge (Top-left) */}
        <Badge kind={badge} />

        {/* Discount (Top-right) */}
        {typeof item.discount === "number" && item.discount > 0 && (
          <div className="absolute right-2 top-2 text-[11px] bg-rose-600 text-white px-2 py-0.5 rounded-full">
            {item.discount}% off
          </div>
        )}
      </div>
      <div className="p-2">
        <div className="text-[13px] font-semibold line-clamp-1">{item.name}</div>
        {(item.location || item.district) && (
          <div className="text-[11px] text-gray-600 flex items-center">
            <MapPin size={12} className="mr-1" />
            {item.location || item.district}
          </div>
        )}
        <div className="mt-1 flex items-center justify-between">
          <div className="text-[12px] text-emerald-700 font-semibold">
            {typeof item.price === "number"
              ? `₹${item.price.toLocaleString("en-IN")}`
              : "—"}{" "}
            <span className="text-[11px] text-gray-500 font-normal">/ night</span>
          </div>
          {typeof item.rating === "number" && (
            <div className="text-[12px] text-amber-600 inline-flex items-center gap-1">
              <Star size={12} /> {item.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Sponsored wide card (unchanged)
function HomestayCardWide({ item }: { item: HomestayCard }) {
  return (
    <Link href={`/homestays/${item.slug}`} className="block">
      <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow">
        <div className="relative h-40 sm:h-44 md:h-48">
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 90vw, 640px"
            className="object-cover"
            priority={false}
          />
          <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white">
            SPONSORED
          </div>
        </div>
        <div className="p-2">
          <div className="text-[13px] font-semibold line-clamp-1">{item.name}</div>
          <div className="text-[11px] text-gray-600 flex items-center gap-1">
            <MapPin size={12} className="opacity-70" />
            {item.location || item.district || "Meghalaya"}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ---------------- Rails ---------------- */

function Rail({
  title,
  items,
  badge,
}: {
  title: React.ReactNode;
  items: HomestayCard[];
  badge?: BadgeKind;
}) {
  if (!items?.length) return null;

  return (
    <section className="px-3 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          {title}
        </h3>
        <span className="text-xs text-gray-500">Swipe</span>
      </div>

      <div className="overflow-x-auto rail-scroll">
        <ul
          className="
            flex items-stretch gap-3
            snap-x snap-mandatory
            pb-1
            [-webkit-overflow-scrolling:touch]
          "
        >
          {items.map((it) => (
            <li
              key={it.id}
              className="
                flex-none snap-start
                w-[150px] sm:w-[150px] md:w-[150px]
              "
            >
              <HomeStyleHomestayCard item={it} badge={badge} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Main Component ---------------- */

export default function HomestaysClient(props: {
  filters: { locations: string[] };
  // Backward-friendly: server can send either priceOp/price or priceRange
  selected: { location: string; priceOp?: "lt" | "gt" | ""; price?: number; priceRange?: PriceRangeKey };
  sponsored: HomestayCard[];
  rails: {
    // No "all" rail by design
    best: HomestayCard[];
    topRated: HomestayCard[];
    deals: HomestayCard[];
    ads: HomestayCard[];
  };
  lists: {
    all: HomestayCard[];
    best: HomestayCard[];
    topRated: HomestayCard[];
    deals: HomestayCard[];
    ads: HomestayCard[];
  };
  pageSize: number;
}) {
  const { filters, selected, sponsored, rails, lists, pageSize } = props;

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Derive initial priceRange (support legacy priceOp/price)
  const initialPriceRange: PriceRangeKey =
    (selected.priceRange as PriceRangeKey) ??
    opValToRange(selected.priceOp, selected.price);

  // Filters (single-active rule is enforced in handlers)
  const [loc, setLoc] = useState<string>(selected.location || "");
  const [priceRange, setPriceRange] = useState<PriceRangeKey>(initialPriceRange);

  // Tabs: All behaves as overview
  const [tab, setTab] = useState<TabKey>("all");

  // Visible counts (separate for tab list and All list)
  const [visibleTab, setVisibleTab] = useState(pageSize);
  const [visibleAll, setVisibleAll] = useState(pageSize);

  // Reset counts on tab or URL change
  useEffect(() => setVisibleTab(pageSize), [tab, pageSize]);
  useEffect(() => {
    setVisibleTab(pageSize);
    setVisibleAll(pageSize);
  }, [pathname, params, pageSize]);

  // Build filtered versions of rails and lists (client-side)
  const fLists = useMemo(() => {
    const out = {
      all: filterItems(lists.all, loc, priceRange),
      best: filterItems(lists.best, loc, priceRange),
      topRated: filterItems(lists.topRated, loc, priceRange),
      deals: filterItems(lists.deals, loc, priceRange),
      ads: filterItems(lists.ads, loc, priceRange),
    };
    console.debug("[Homestays] filter applied:", {
      location: loc || "(none)",
      priceRange: priceRange || "(none)",
      counts: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length])),
    });
    return out;
  }, [lists, loc, priceRange]);

  const fRails = useMemo(() => {
    return {
      best: filterItems(rails.best, loc, priceRange),
      topRated: filterItems(rails.topRated, loc, priceRange),
      deals: filterItems(rails.deals, loc, priceRange),
      ads: filterItems(rails.ads, loc, priceRange),
    };
  }, [rails, loc, priceRange]);

  // Current tab list
  const currentList: HomestayCard[] = useMemo(() => {
    switch (tab) {
      case "best":
        return fLists.best;
      case "top":
        return fLists.topRated;
      case "deals":
        return fLists.deals;
      case "ads":
        return fLists.ads;
      case "all":
      default:
        return fLists.all;
    }
  }, [tab, fLists]);

  const shownTab = currentList.slice(0, visibleTab);
  const canMoreTab = visibleTab < currentList.length;

  const shownAll = fLists.all.slice(0, visibleAll);
  const canMoreAll = visibleAll < fLists.all.length;

  // URL param helper (kept so server can adopt later)
  const pushParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params?.toString() || "");
    Object.entries(patch).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: true });
  };

  // Filter handlers — only one active at a time
  const onChangeLocation = (value: string) => {
    setLoc(value);
    setPriceRange("");
    pushParams({ location: value || undefined, priceRange: undefined });
  };

  const onChangePriceRange = (range: PriceRangeKey) => {
    setPriceRange(range);
    setLoc("");
    pushParams({ location: undefined, priceRange: range || undefined });
  };

  const onReset = () => {
    setLoc("");
    setPriceRange("");
    pushParams({ location: undefined, priceRange: undefined, page: undefined });
  };

  const showRails = tab === "all";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* SEO – total = all homestays (filtered) */}
      <HomestaysSEO
        total={fLists.all.length}
        location={loc || undefined}
        // HomestaysSeo accepts priceOp?: "lt"|"gt" — we pass undefined (we changed UI to buckets)
        priceOp={undefined}
        price={undefined}
      />

      <div className="mx-auto w-full max-w-md">
        <Header />
        <FiltersBar
          locations={filters.locations}
          selected={{ location: loc, priceRange }}
          onChangeLocation={onChangeLocation}
          onChangePriceRange={onChangePriceRange}
          onReset={onReset}
        />

        {/* Sponsored */}
        {sponsored?.length > 0 && (
          <section className="px-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <Megaphone size={16} /> Sponsored
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 rail-scroll pb-1">
              {filterItems(sponsored, loc, priceRange).map((h) => (
                <div key={h.id} className="snap-start min-w-[85%]">
                  <HomestayCardWide item={h} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tabs header with icons */}
        <section className="px-3 mt-3">
        <div className="flex items-center">
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-0 bg-gray-50 p-1 rounded-full border whitespace-nowrap">
              {[
                { key: "all",   label: "All",        icon: <MapPin size={14} className="opacity-70 shrink-0" /> },
                { key: "best",  label: "Best",       icon: <Crown size={14} className="text-amber-600 shrink-0" /> },
                { key: "top",   label: "Top Rated",  icon: <Star size={14} className="text-amber-500 shrink-0" /> },
                { key: "deals", label: "Deals",      icon: <BadgePercent size={14} className="text-emerald-600 shrink-0" /> },
                { key: "ads",   label: "Ads",        icon: <Megaphone size={14} className="text-indigo-600 shrink-0" /> },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as typeof tab)}
                  className={`
                    px-2.5 py-1.5 text-[12px] rounded-full
                    inline-flex items-center gap-1
                    ${tab === t.key ? "bg-white shadow text-emerald-700" : "text-gray-600"}
                  `}
                >
                  {t.icon}{t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>


        {/* Rails (ONLY when All tab is active; no “All” rail) */}
        {showRails && (
          <>
            <Rail title="Best" items={fRails.best} badge="best" />
            <Rail title="Top Rated" items={fRails.topRated} badge="top" />
            <Rail title="Deals" items={fRails.deals} badge="deals" />
            <Rail title="Ads" items={fRails.ads} badge="ads" />
          </>
        )}

        {/* Selected tab list (only when tab !== all) */}
        {tab !== "all" && (
          <section className="px-3 mt-5 max-w-2xl mx-auto">
            <div className="mb-2 text-sm font-semibold text-gray-800">
              {tab === "best" && "Best Homestays"}
              {tab === "top" && "Top Rated Homestays"}
              {tab === "deals" && "Deals"}
              {tab === "ads" && "Sponsored Homestays"}
            </div>

            {shownTab.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No results for this tab with current filters.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {shownTab.map((it) => (
                  <HomeStyleHomestayCard
                    key={it.id}
                    item={it}
                    imgH="h-32"
                    badge={tab === "best" ? "best" : tab === "top" ? "top" : tab === "deals" ? "deals" : "ads"}
                  />
                ))}
              </div>
            )}

            {canMoreTab && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setVisibleTab((v) => v + pageSize)}
                  className="px-4 py-2 rounded-full text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                >
                  View more
                </button>
              </div>
            )}
          </section>
        )}

        {/* All Homestays — ALWAYS visible below */}
        <section className="px-3 mt-6 max-w-2xl mx-auto">
          <div className="text-sm font-semibold text-gray-800 mb-2">All Homestays</div>

          {shownAll.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No homestays found.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {shownAll.map((it) => (
                <HomeStyleHomestayCard key={it.id} item={it} imgH="h-32" />
              ))}
            </div>
          )}

          {canMoreAll && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setVisibleAll((v) => v + pageSize)}
                className="px-4 py-2 rounded-full text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow"
              >
                View more
              </button>
            </div>
          )}
        </section>
        <FooterSpace/>
        <Footer />

        {/* Hide scrollbars for rails */}
        <style jsx global>{`
          .rail-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .rail-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}
