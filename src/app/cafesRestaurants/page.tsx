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


  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
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
        <h2 className="text-lg font-semibold mb-2">Popular Restaurants</h2>
        <FeaturedBannerAds category="cafesRestaurants"/>
      </section>

      {/* All Restaurants (Vertical Cards) */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Explore More Restaurants</h2>
        <div className="flex flex-col gap-3">
          {restaurants.map((rest) => (
            <Link
              key={rest.id}
              href={`/cafesRestaurants/${rest.slug ?? rest.id}`}
              className="flex items-center bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="relative w-24 h-24 bg-gray-100">
                {rest.image && rest.image.startsWith('https') ? (
                  <Image src={rest.image} alt={rest.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="flex-1 p-3">
                <h3 className="text-base font-semibold">{rest.name}</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin size={14} className="mr-1" /> {rest.location}
                </p>
                <div className="mt-1 flex flex-wrap gap-1 text-xs">
                  {rest.cuisine?.map((c) => (
                    <span key={c} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
                <div ref={observerRef} className="text-center mt-4">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {restaurants.length >= (totalCount ?? 0) && !loading && (
            <p className="text-sm text-gray-400">No more restaurants.</p>
          )}
        </div>
      </section>
    </main>
  );
}
