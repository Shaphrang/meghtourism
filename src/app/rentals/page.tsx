"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import useSupabaseList from "@/hooks/useSupabaseList";
import DynamicFilterComponent from "@/components/filters/DynamicFilterComponent";
import { Rental } from "@/types/rentals";

export default function RentalsListingPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Rental[]>([]);
  const [filter, setFilter] = useState<{ field: string; value: any } | null>(null);
  const { data, totalCount, loading } = useSupabaseList<Rental>("rentals", {
    sortBy: "created_at",
    ascending: false,
    filter,
    page,
    pageSize: 6,
  });
  const { data: popular } = useSupabaseList<Rental>("rentals", {
    sortBy: "popularityindex",
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
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800">
          Rent Bikes, Cars, or Gear in Meghalaya
        </h1>
      </section>

      {/* Filters */}
      <DynamicFilterComponent
        table="rentals"
        filtersConfig={[
          { type: "location" },
          { type: "carType", field: "carType" },
          { type: "price", field: "rentalrate->>price" },
        ]}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPage(1);
        }}
      />

      {/* Popular Rentals */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Popular Rentals</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {popular.slice(0, 10).map((rental) => (
            <Link
              key={rental.id}
              href={`/rentals/${rental.slug ?? rental.id}`}
              className="min-w-[160px] bg-stoneGray rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-24 relative bg-cloudMist">
                {rental.image && rental.image.startsWith('https') ? (
                  <Image src={rental.image} alt={rental.title || rental.type} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold truncate">{rental.title || rental.type}</p>
                {rental.location && <p className="text-xs text-gray-500 truncate">{rental.location}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Available Rentals */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Available Rentals</h2>
        <div className="flex flex-col gap-3">
          {items.map((rental) => (
            <Link
              key={rental.id}
              href={`/rentals/${rental.slug ?? rental.id}`}
              className="flex items-center bg-stoneGray rounded-xl shadow-sm overflow-hidden"
            >
              <div className="relative w-24 h-24 bg-cloudMist">
                {rental.image && rental.image.startsWith('https') ? (
                  <Image src={rental.image} alt={rental.title || rental.type} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="flex-1 p-3">
                <h3 className="text-base font-semibold">
                  {rental.title || `${rental.type} Rental`}
                </h3>
                {rental.location && (
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin size={14} className="mr-1" /> {rental.location}
                  </p>
                )}
                {rental.availability && (
                  <p className="text-sm text-charcoal">Status: {rental.availability}</p>
                )}
                {typeof rental.rentalrate === "object" && rental.rentalrate?.min && (
                  <p className="text-green-600 text-sm font-medium mt-1">
                    ₹{rental.rentalrate.min}/day
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div ref={observerRef} className="text-center mt-4">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {items.length >= (totalCount ?? 0) && !loading && (
            <p className="text-sm text-gray-400">No more rentals.</p>
          )}
        </div>
      </section>
    </main>
  );
}
