"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSupabaseList from "@/hooks/useSupabaseList";
import { Itinerary } from "@/types/itineraries";

export default function ItinerariesListingPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Itinerary[]>([]);
  const { data, totalCount, loading } = useSupabaseList<Itinerary>(
    "itineraries",
    {
      sortBy: "created_at",
      ascending: false,
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

      
      {/* Top Adventures */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Top Adventures</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {top.slice(0, 10).map((itin) => (
            <Link
              key={itin.id}
              href={`/itineraries/${itin.slug ?? itin.id}`}
              className="min-w-[160px] bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="h-32 relative bg-gray-100">
                {itin.image ? (
                  <Image
                    src={itin.image}
                    alt={itin.title || "Itinerary"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{itin.title}</h3>
                {itin.days && (
                  <p className="text-xs text-gray-500 truncate">{itin.days} Days</p>
                )}
              </div>
            </Link>
          ))}
        </div>
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
                {trip.image ? (
                  <Image src={trip.image} alt={trip.title || "Itinerary"} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">No image</div>
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
