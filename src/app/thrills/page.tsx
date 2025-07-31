"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import useSupabaseList from "@/hooks/useSupabaseList";
import DynamicFilterComponent from "@/components/filters/DynamicFilterComponent";
import { Thrill } from "@/types/thrill";
import FeaturedBannerAds from "@/components/ads/featuredBannerAds";

export default function ThrillsListingPage() {
  const [page, setPage] = useState(1);
  const [thrills, setThrills] = useState<Thrill[]>([]);
  const [filter, setFilter] = useState<{ field: string; value: any } | null>(null);
  const { data, totalCount, loading } = useSupabaseList<Thrill>("thrills", {
    sortBy: "created_at",
    ascending: false,
    filter,
    page,
    pageSize: 6,
  });
  const { data: popular } = useSupabaseList<Thrill>("thrills", {
    sortBy: "created_at",
    ascending: false,
    pageSize: 10,
  });

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (page === 1) setThrills(data);
    else setThrills((prev) => [...prev, ...data]);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          thrills.length < (totalCount ?? 0)
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [thrills, loading, totalCount]);

  return (
    <main className="w-full min-h-screen bg-stoneGray text-charcoal">
      <section className="bg-gradient-to-r from-yellow-100 to-green-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-deepIndigo">Experience the Thrill of Meghalaya</h1>
      </section>

      {/* Filter Bar */}
      <DynamicFilterComponent
        table="thrills"
        filtersConfig={[{ type: "location" }]}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPage(1);
        }}
      />

      {/* Featured Ads */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Top Adventures</h2>
        <FeaturedBannerAds category="thrills"/>
      </section>

      {/* All Activities */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">All Activities</h2>
        <div className="flex flex-col gap-4">
          {thrills.map((thrill) => (
            <Link
              key={thrill.id}
              href={`/thrills/${thrill.slug ?? thrill.id}`}
              className="bg-cloudMist rounded-xl shadow-sm overflow-hidden"
            >
              <div className="h-40 relative bg-cloudMist">
                {thrill.image && thrill.image.startsWith('https') ? (
                  <Image src={thrill.image} alt={thrill.name || "Thrill"} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{thrill.name}</h3>
                {thrill.location && (
                  <p className="text-sm text-charcoal flex items-center">
                    <MapPin size={14} className="mr-1" /> {thrill.location}
                  </p>
                )}
                <p className="text-sm text-charcoal">
                  {thrill.duration && <>🕒 {thrill.duration} </>}
                  {thrill.price && <>💰 ₹{thrill.price.toLocaleString()}</>}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {thrill.tags?.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-green-100 text-deepIndigo px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
            <div ref={observerRef} className="text-center mt-4">
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
            {thrills.length >= (totalCount ?? 0) && !loading && (
              <p className="text-sm text-gray-400">No more activities.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
