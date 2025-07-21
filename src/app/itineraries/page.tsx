"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSupabaseList from "@/hooks/useSupabaseList";
import DynamicFilterComponent from "@/components/filters/DynamicFilterComponent";
import { Itinerary } from "@/types/itineraries";
import { MapPin } from "lucide-react";
import FeaturedBannerAds from "@/components/ads/featuredBannerAds";

export default function ItinerariesListingPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Itinerary[]>([]);
  const [filter, setFilter] = useState<{ field: string; value: any } | null>(null);
  const { data, totalCount, loading } = useSupabaseList<Itinerary>(
    "itineraries",
    {
      sortBy: "created_at",
      ascending: false,
      filter,
      page,
      pageSize: 6,
    }
  );
  const { data: top } = useSupabaseList<Itinerary>("itineraries", {
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
        if (
          entries[0].isIntersecting &&
          !loading &&
          items.length < (totalCount ?? 0)
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [items, loading, totalCount]);

  return (
    <main className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden">
      <section className="bg-gradient-to-r from-yellow-100 to-pink-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-800">
          Ready-Made Meghalaya Travel Plans
        </h1>
      </section>
      
      <DynamicFilterComponent
        table="itineraries"
        filtersConfig={[
          { type: "location", field: "starting_point" },
          { type: "days", field: "days" },
        ]}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPage(1);
        }}
      />

      {/* Featured Ads */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Top Adventures</h2>
        <FeaturedBannerAds category="itineraries"/>
      </section>

      {/* All Itineraries */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">All Activities</h2>
        <div className="flex flex-col gap-4">
          {items.map((trip) => (
            <Link
              key={trip.id}
              href={`/itineraries/${trip.slug ?? trip.id}`}
              className="bg-gray-50 rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative w-full h-40 bg-gray-100">
                {trip.image && trip.image.startsWith("/") ? (
                  <Image
                    src={trip.image}
                    alt={trip.title || "Itinerary"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold truncate">{trip.title}</h3>
                {trip.description && (
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    {trip.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div ref={observerRef} className="text-center mt-4">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {items.length >= (totalCount ?? 0) && !loading && (
            <p className="text-sm text-gray-400">No more itineraries.</p>
          )}
        </div>
      </section>
    </main>
  );
}
