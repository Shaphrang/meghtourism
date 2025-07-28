"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import useSupabaseList from "@/hooks/useSupabaseList";
import { Destination } from "@/types/destination";
import CarouselBanner from "@/components/common/carouselBanner";
import DynamicFilterComponent from "@/components/filters/DynamicFilterComponent";
import FeaturedBannerAds from "@/components/ads/featuredBannerAds";

export default function DestinationsListingPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Destination[]>([]);
  const [filter, setFilter] = useState<{ field: string; value: any } | null>(null);

  const { data, totalCount, loading } = useSupabaseList<Destination>("destinations", {
    filter,
    sortBy: "created_at",
    ascending: false,
    page,
    pageSize: 8,
  });

  const { data: featured } = useSupabaseList<Destination>("destinations", {
    sortBy: "rating",
    ascending: false,
    page: 1,
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
    <main className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-100 to-teal-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800">
          Explore Meghalaya's Destinations
        </h1>
        <p className="text-sm text-gray-700 mt-1">
          Discover beautiful places, hidden gems, and local favorites
        </p>
      </section>


      {/* Filter Component */}
      <DynamicFilterComponent
        table="destinations"
        filtersConfig={[
          { type: "location" },
          { type: "district" },
          { type: "tags" },
        ]}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPage(1);
        }}
      />
        
      {/* Featured Ads */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Featured Destinations</h2>
        <FeaturedBannerAds category="destinations"/>
      </section>

      {/* All Destinations */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">All Destinations</h2>
        <div className="grid grid-cols-2 gap-3">
  {items.map((dest, index) => (
    <Fragment key={dest.id}>
      {/* ⭐ Use new destination card format */}
      <Link
        href={`/destinations/${dest.slug ?? dest.id}`}
        className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] block h-[160px]"
      >
        <div className="relative w-full h-full">
          {dest.image ? (
            <>
              <Image
                src={dest.image}
                alt={dest.name ?? "Destination image"}
                fill
                sizes="(min-width: 640px) 180px, 100vw"
                className="object-cover transition-transform duration-300"
              />
              <div className="absolute bottom-0 w-full px-2 py-2 bg-gradient-to-t from-black/100 via-black/70 to-transparent text-white">
                <h3 className="text-sm font-semibold truncate">{dest.name}</h3>
                {dest.location && (
                  <p className="text-xs text-gray-300 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {dest.location}
                  </p>
                )}
                {/*{dest.rating && (
                  <div className="flex items-center text-xs mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(dest.rating) ? 'text-yellow-400' : 'text-gray-400'
                        }`}
                        fill={i < Math.round(dest.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                    <span className="ml-1">{dest.rating.toFixed(1)}</span>
                  </div>
                )}*/}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-gray-400">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* 👇 Carousel insertion every 8 items */}
      {(index + 1) % 8 === 0 && (
        <div key={`ad-${index}`} className="col-span-2">
          <CarouselBanner id="homestays" />
        </div>
      )}
    </Fragment>
  ))}
</div>


        <div ref={observerRef} className="text-center mt-4">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {items.length >= (totalCount ?? 0) && !loading && (
            <p className="text-sm text-gray-400">No more destinations.</p>
          )}
        </div>
      </section>
    </main>
  );
}
