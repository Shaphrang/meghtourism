"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import useSupabaseList from "@/hooks/useSupabaseList";
import DynamicFilterComponent from "@/components/filters/DynamicFilterComponent";
import { CafeAndRestaurant } from "@/types/cafeRestaurants";
import FeaturedBannerAds from "@/components/ads/featuredBannerAds";

export default function RestaurantsListingPage() {
  const [page, setPage] = useState(1);
  const [restaurants, setRestaurants] = useState<CafeAndRestaurant[]>([]);
  const [filter, setFilter] = useState<{ field: string; value: any } | null>(null);

  const { data, totalCount, loading } = useSupabaseList<CafeAndRestaurant>(
    "cafes_and_restaurants",
    {
      sortBy: "created_at",
      ascending: false,
      filter,
      page,
      pageSize: 6,
    }
  );

  const { data: popular } = useSupabaseList<CafeAndRestaurant>(
    "cafes_and_restaurants",
    {
      sortBy: "ratings",
      ascending: false,
      pageSize: 10,
    }
  );

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (page === 1) setRestaurants(data);
    else setRestaurants((prev) => [...prev, ...data]);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          restaurants.length < (totalCount ?? 0)
        ) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [restaurants, loading, totalCount]);

  // Inline Card Component
  function Card({ item }: { item: CafeAndRestaurant }) {
    const [expanded, setExpanded] = useState(false);
    return (
      <div className="flex gap-3 bg-white rounded-xl shadow-md overflow-hidden p-2 flex-shrink-0">
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
            <div className="flex items-center justify-center h-full text-sm text-charcoal/50">
              No Image
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between py-1 pr-1">
          <div>
            <h3 className="text-sm font-semibold text-deepIndigo truncate">
              {item.name || "Untitled"}
            </h3>
            <p className="text-xs text-charcoal mt-0.5">
              {expanded
                ? item.description
                : `${item.description?.slice(0, 100)}${
                    item.description && item.description.length > 100 ? "..." : ""
                  }`}
              {item.description && item.description.length > 100 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="ml-1 text-meghGreen text-[11px] font-medium hover:underline"
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </p>
            <p className="text-xs text-meghGreen mt-1 flex items-center">
              <MapPin size={12} className="mr-1" />
              {item.location}
            </p>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {(item.cuisine?.length ? item.cuisine.join(", ") : "No cuisine")}
            {" • "}
            <span className="text-deepIndigo">{item.type}</span>
            {" • "}
            <span className="text-warmAmber font-bold">
              ⭐ {item.ratings ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-stoneGray text-charcoal">
      <section className="bg-gradient-to-r from-pink-100 to-yellow-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-pink-800">Dine in Meghalaya</h1>
      </section>

      {/* Filter Bar */}
      <DynamicFilterComponent
        table="cafes_and_restaurants"
        filtersConfig={[{ type: "location" }, { type: "cuisine" }]}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPage(1);
        }}
      />

      {/* Featured Ads */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-meghGreen font-geist font-sans">
          Popular Restaurants
        </h2>
        <FeaturedBannerAds category="cafesRestaurants" />
      </section>

      {/* All Restaurants (Vertical Cards) */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-meghGreen font-geist font-sans">
          All Restaurants
        </h2>
        <div className="flex flex-col gap-3">
          {restaurants.map((rest) => (
            <Link
              key={rest.id}
              href={`/cafesRestaurants/${rest.slug ?? rest.id}`}
              className="block hover:scale-[1.01] transition-transform duration-200"
            >
              <Card item={rest} />
            </Link>
          ))}
        </div>
        <div ref={observerRef} className="text-center mt-4">
          {loading && <p className="text-sm text-meghGreen font-geist font-sans">Loading...</p>}
          {restaurants.length >= (totalCount ?? 0) && !loading && (
            <p className="text-sm text-charcoal/40 font-geist font-sans">No more restaurants.</p>
          )}
        </div>
      </section>
    </main>
  );
}
