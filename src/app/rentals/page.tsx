"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Filter,
  MapPin,
  SlidersHorizontal,
  SortAsc,
} from "lucide-react";
import useSupabaseList from "@/hooks/useSupabaseList";
import { Rental } from "@/types/rentals";

export default function RentalsListingPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Rental[]>([]);
  const { data, totalCount, loading } = useSupabaseList<Rental>("rentals", {
    sortBy: "created_at",
    ascending: false,
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
    <main className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800">
          Rent Bikes, Cars, or Gear in Meghalaya
        </h1>
      </section>

      {/* Filters */}
      <section className="p-4 flex flex-wrap justify-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
          <SortAsc size={16} /> Sort
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
          <SlidersHorizontal size={16} /> Type
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
          <Filter size={16} /> Location
        </button>
      </section>

      {/* Popular Rentals */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Popular Rentals</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {popular.slice(0, 10).map((rental) => (
            <Link
              key={rental.id}
              href={`/rentals/${rental.slug ?? rental.id}`}
              className="min-w-[160px] bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-24 relative bg-gray-100">
                {rental.image ? (
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
              className="flex items-center bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="relative w-24 h-24 bg-gray-100">
                {rental.image ? (
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
                  <p className="text-sm text-gray-600">Status: {rental.availability}</p>
                )}
                {typeof rental.rentalrate === "object" && rental.rentalrate?.price && (
                  <p className="text-green-600 text-sm font-medium mt-1">
                    ₹{rental.rentalrate.price}/day
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
