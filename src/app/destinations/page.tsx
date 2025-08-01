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
import { FIELD_OPTIONS } from "@/lib/fieldOption";
import HorizontalSection from "@/components/ads/destinationSectionsUnique";


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
    <main className="w-full min-h-screen bg-stoneGray text-charcoal overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-teal-900 pb-2 pt-2 px-4 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-xl md:text-5xl font-bold mb-4">
            Discover Amazing Tourist Destinations
          </h1>
          <DynamicFilterComponent
            table="destinations"
            filtersConfig={[
              { type: "location" },
              { type: "district" },
            ]}
            onFilterChange={(newFilter) => {
              setFilter(newFilter);
              setPage(1);
            }}
          />
        </div>
      </section>
      <div className="px-4 pt-4">
        <div className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar pb-2">
          {FIELD_OPTIONS.destinations.category.map((cat, i) => (
            <span
              key={i}
              className="flex items-center px-3 py-1 bg-gray-100 text-xs rounded-full shadow whitespace-nowrap border border-teal-700"
              style={{ minHeight: 32 }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div> 
      {/* Featured Ads */}
      <section className="p-4">
        <h2 className="text-sm font-semibold">⭐️ Featured Destinations</h2>
        <FeaturedBannerAds category="destinations"/>
      </section>
      <section className="p-4">
        <HorizontalSection type="top10" />
        <HorizontalSection type="trending" />
        <HorizontalSection type="hiddenGems" />
        <HorizontalSection type="bucketList" />
        <HorizontalSection type="recommended" />
      </section>

      {/* All Destinations */}
      <section className="p-4">
        <h2 className="text-sm font-semibold mb-2">🌍 All Destinations</h2>
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
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cloudMist text-xs text-gray-400">
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
