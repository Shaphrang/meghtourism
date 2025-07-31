"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import useSupabaseList from "@/hooks/useSupabaseList";
import DynamicFilterComponent from "@/components/filters/DynamicFilterComponent";
import { Homestay } from "@/types/homestay";
import FeaturedBannerAds from "@/components/ads/featuredBannerAds";

export default function HomestayListingPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Homestay[]>([]);
  const [filter, setFilter] = useState<{ field: string; value: any } | null>(null);

  const { data, totalCount, loading } = useSupabaseList<Homestay>("homestays", {
    filter,
    sortBy: "created_at",
    ascending: false,
    page,
    pageSize: 6,
  });

  const { data: popular } = useSupabaseList<Homestay>("homestays", {
    sortBy: "ratings",
    ascending: false,
    pageSize: 10,
  });

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (page === 1) setItems(data);
    else setItems((prev) => [...prev, ...data]);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && items.length < (totalCount ?? 0)) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [items, loading, totalCount]);

  return (
    <main className="w-full min-h-screen bg-stoneGray text-charcoal overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cloudMist to-stoneGray p-6 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-deepIndigo">
          Find Homestays in Meghalaya
        </h1>
        <p className="text-sm text-charcoal mt-1">Explore cozy and affordable stays across the state</p>
      </section>

      {/* Filter Bar */}
      <DynamicFilterComponent
        table="homestays"
        filtersConfig={[
          { type: "location" },
          { type: "price", field: "pricepernight" },
        ]}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPage(1);
        }}
      />

      {/* Featured Ads */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Popular Stays</h2>
        <FeaturedBannerAds category="homestays"/>
      </section>

      {/* Attractive Stays */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Attractive Stays</h2>
        <div className="flex flex-col gap-4">
          {items.map((stay) => (
            <Link
              key={stay.id}
              href={`/homestays/${stay.slug}`}
              className="bg-cloudMist rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative w-full h-40 bg-cloudMist">
                {stay.image && stay.image.startsWith("https") ? (
                  <Image src={stay.image} alt={stay.name || "Stay"} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold truncate">{stay.name}</h3>
                {stay.location && (
                  <div className="flex items-center text-sm text-charcoal mt-1">
                    <MapPin size={14} className="mr-1" /> {stay.location}
                  </div>
                )}
                {stay.pricepernight && (
                  <p className="text-green-700 font-semibold mt-1">
                    From ₹{stay.pricepernight.toLocaleString()}/night
                  </p>
                )}
                {stay.description && (
                  <p className="text-sm text-charcoal mt-2 line-clamp-2">{stay.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div ref={observerRef} className="text-center mt-4">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {items.length >= (totalCount ?? 0) && !loading && (
            <p className="text-sm text-gray-400">No more homestays.</p>
          )}
        </div>
      </section>
    </main>
  );
}
