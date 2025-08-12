// src/app/components/destinations/DestinationsClient.tsx
"use client";

import DestinationsSEO from "@/components/seo/DestinationSeo";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  MapPin, Megaphone, SlidersHorizontal, ChevronRight, Mountain,
} from "lucide-react";
import React, { useState } from "react";

export type DestinationCard = {
  id: string;
  slug: string;
  name: string;
  image?: string;
  location?: string;
  district?: string;
};

export type DestinationsClientProps = {
  filters: { locations: string[]; districts: string[] };
  selected: { location: string; district: string };
  sponsored: DestinationCard[];
  rails: {
    mustSee: DestinationCard[];
    nowTrending: DestinationCard[];
    secretGems: DestinationCard[];
    bucketList: DestinationCard[];
    handpicked: DestinationCard[];
  };
  all: {
    items: DestinationCard[];
    total: number;
    page: number;
    totalPages: number;
    pageSize: number;
  };
};

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="px-3 py-2 flex items-center gap-2">
        <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">M</div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-500">Meghtourism</div>
          <div className="text-sm font-semibold">Destinations in Meghalaya</div>
        </div>
        <Link href="/" className="text-xs text-emerald-700">Home</Link>
      </div>
    </header>
  );
}

function TrendingZonesFilters({
  filters,
  selected,
  onChange,
  onReset,
}: {
  filters: { locations: string[]; districts: string[] };
  selected: { location: string; district: string };
  onChange: (next: { location?: string; district?: string }) => void;
  onReset: () => void;
}) {
  return (
    <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-500 to-sky-500 p-4 text-white px-3 pt-5 pb-5 m-3">
      <div className="max-w-5xl mx-auto">
        <div className="text-xs opacity-90">Find places by</div>
        <h1 className="text-2xl font-bold">Trending Zones</h1>

        {/* No scroll: compact 3-item grid */}
        <div className="mt-3 grid grid-cols-3 gap-2 max-w-2xl">
          <select
            value={selected.location}
            onChange={(e) => onChange({ location: e.target.value || undefined, district: "" })}
            className="px-2 py-1.5 rounded-full text-xs bg-white/95 text-gray-900"
          >
            <option value="">Location</option>
            {filters.locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select
            value={selected.district}
            onChange={(e) => onChange({ district: e.target.value || undefined, location: "" })}
            className="px-2 py-1.5 rounded-full text-xs bg-white/95 text-gray-900"
          >
            <option value="">District</option>
            {filters.districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

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


function Rail({
  title,
  items,
  render,
}: {
  title: React.ReactNode;
  items: DestinationCard[];
  render: (item: DestinationCard) => React.ReactNode;
}) {
  if (!items?.length) return null;
  return (
    <section className="px-3 mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          {title}
        </div>
        <div className="text-xs text-gray-500">Swipe</div>
      </div>
      <div className="rail-scroll flex overflow-x-auto snap-x snap-mandatory gap-2">
        {items.map((it) => (
          <div
            key={it.id}
            className="
              snap-start shrink-0
              min-w-[calc(50%-0.25rem)]      /* 2 visible on mobile */
              sm:min-w-[calc(33.333%-0.333rem)]
              md:min-w-[calc(25%-0.375rem)]
            "
          >
            {render(it)}
          </div>
        ))}
      </div>
    </section>
  );
}

function DestCardTall({ item }: { item: DestinationCard }) {
  return (
    <Link href={`/destinations/${item.slug}`} className="block">
      <article className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow transition">
        {/* 3/4 image */}
        <div className="relative h-[320px] sm:h-[360px]">
          <Image
            src={item.image || "/placeholder.jpg"}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 95vw, 640px"
            className="object-cover"
          />
          <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-white/85 text-emerald-700 border border-emerald-200">
            Destination
          </div>
        </div>

        {/* 1/4 info */}
        <div className="p-3 bg-gradient-to-br from-white to-emerald-50/40">
          <h3 className="text-base font-semibold line-clamp-1">{item.name}</h3>
          <p className="text-[12px] text-gray-600 flex items-center gap-1 mt-1">
            <svg width="12" height="12" viewBox="0 0 24 24" className="opacity-70"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
            {item.location || item.district || "Meghalaya"}
          </p>
        </div>
      </article>
    </Link>
  );
}

function SponsoredPosterCard({ item }: { item: DestinationCard }) {
  return (
    <Link href={`/destinations/${item.slug}`} className="block">
      <div className="relative h-32 sm:h-36 md:h-40 rounded-2xl overflow-hidden border border-gray-100 shadow">
        <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 800px, 1000px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/40 via-black/10 to-transparent" />
        <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-white/85 text-emerald-700 border border-emerald-200">
          Sponsored
        </div>
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <div className="text-sm font-semibold leading-tight line-clamp-1">{item.name}</div>
          <div className="text-[11px] opacity-90 flex items-center gap-1">
            <MapPin size={12} />
            {item.location || item.district || "Meghalaya"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function DestinationHomeRailCard({ item }: { item: DestinationCard }) {
  return (
    <Link href={`/destinations/${item.slug}`} className="block">
      <div className="relative h-36 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow">
        <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, 600px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute left-2 bottom-2 right-2 text-white">
          <div className="font-semibold leading-tight text-sm line-clamp-1">{item.name}</div>
          {(item.location || item.district) && (
            <div className="text-xs opacity-90 flex items-center gap-1">
              <MapPin size={12} />
              {item.location || item.district}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}


export default function DestinationsClient(props: DestinationsClientProps) {
  const { filters, selected, sponsored, rails, all } = props;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [allItems, setAllItems] = useState(all.items);
const [pageState, setPageState] = useState(all.page);
const [hasMore, setHasMore] = useState(all.page < all.totalPages);
const [loadingMore, setLoadingMore] = useState(false);

async function loadMore() {
  if (!hasMore || loadingMore) return;
  setLoadingMore(true);

  // client-side fetch from Supabase (same filters as server)
  const supabase = (await import("@/lib/supabaseClient")).supabase;
  const nextPage = pageState + 1;
  const from = (nextPage - 1) * all.pageSize;
  const to = from + all.pageSize - 1;

  let q = supabase
    .from("destinations")
    .select("id, slug, name, image, location, district, popularityindex, created_at");

  if (loc) q = q.eq("location", loc);
  else if (dist) q = q.eq("district", dist);

  q = q
    .order("popularityindex", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false, nullsFirst: false })
    .range(from, to);

  const { data, error } = await q;
  if (!error && data) {
    setAllItems((prev) => [...prev, ...data.map((r: any) => ({
      id: r.id, slug: r.slug ?? String(r.id), name: r.name,
      image: r.image || undefined, location: r.location || undefined, district: r.district || undefined,
    }))]);
    setPageState(nextPage);
    setHasMore(nextPage < all.totalPages);

    // smooth scroll down after append
    requestAnimationFrame(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  }
  setLoadingMore(false);
}


  // Keep local state synced for selects
  const [loc, setLoc] = useState(selected.location);
  const [dist, setDist] = useState(selected.district);

  const pushParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params?.toString() || "");
    Object.entries(patch).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    // when one filter changes, clear the other and reset page
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: true });
  };

  const onChange = (next: { location?: string; district?: string }) => {
    const location = next.location ?? (next.district ? "" : loc);
    const district = next.district ?? (next.location ? "" : dist);
    setLoc(location || "");
    setDist(district || "");
    pushParams({
      location: location || undefined,
      district: district || undefined,
    });
  };

  const onReset = () => {
    setLoc("");
    setDist("");
    pushParams({ location: undefined, district: undefined, page: undefined });
  };

  const goPage = (p: number) => pushParams({ page: String(p) });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DestinationsSEO
        total={all.total}
        location={selected.location || undefined}
        district={selected.district || undefined}
      />

      <div className="mx-auto w-full max-w-md">
        <Header />
        {/* Trending Zones with Filters */}
        <TrendingZonesFilters
          filters={filters}
          selected={{ location: loc, district: dist }}
          onChange={onChange}
          onReset={onReset}
        />

        {/* Sponsored */}
        {sponsored?.length > 0 && (
          <section className="px-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <Megaphone size={16}/> Sponsored
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3">
              {sponsored.map((d) => (
                <div key={d.id} className="snap-start min-w-[85%]">
                  <SponsoredPosterCard item={d} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5 rails (random, deduped) */}
        <Rail title="Must See Picks" items={rails.mustSee} render={(item) => <DestinationHomeRailCard item={item} />} />
        <Rail title="Now Trending" items={rails.nowTrending} render={(item) => <DestinationHomeRailCard item={item} />} />
        <Rail title="Secret Gems" items={rails.secretGems} render={(item) => <DestinationHomeRailCard item={item} />} />
        <Rail title="Ultimate Bucket List" items={rails.bucketList} render={(item) => <DestinationHomeRailCard item={item} />} />
        <Rail title="Handpicked For You" items={rails.handpicked} render={(item) => <DestinationHomeRailCard item={item} />} />

        {/* All Destinations — good-looking vertical single cards */}
        <section className="px-3 mt-6 max-w-2xl mx-auto">
        <div className="text-sm font-semibold text-gray-800 mb-2">All Destinations</div>

        {allItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No destinations found.</div>
        ) : (
            <div className="flex flex-col gap-4">
            {allItems.map((it) => (
                <DestCardTall key={it.id} item={it} />
            ))}
            </div>
        )}

        {/* View More */}
        {hasMore && (
            <div className="flex justify-center mt-4">
            <button
                onClick={loadMore}
                className="px-4 py-2 rounded-full text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow"
            >
                View more
            </button>
            </div>
        )}
        </section>
        <style jsx global>{`
            .rail-scroll { -ms-overflow-style: none; scrollbar-width: none; }
            .rail-scroll::-webkit-scrollbar { display: none; }
            `}</style>
        <div className="h-24" />
      </div>
    </div>
  );
}

