"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, SlidersHorizontal, XCircle } from "lucide-react";
import useSupabaseList from "@/hooks/useSupabaseList";
import { Homestay } from "@/types/homestay";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function HomestayListingPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Homestay[]>([]);
  const [filter, setFilter] = useState<{ field: string; value: any } | null>(null);
  const [activeFilterType, setActiveFilterType] = useState<"location" | "price" | null>(null);

  const [locations, setLocations] = useState<string[]>([]);

  const supabase = createClientComponentClient();

  // Fetch unique locations
  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase.from("homestays").select("location");
      const locSet = new Set<string>();
      data?.forEach((item) => {
        if (item?.location && item.location !== "") locSet.add(item.location);
      });
      setLocations([...locSet].sort());
    };
    fetchLocations();
  }, []);

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

  const handleSelectValue = (field: string, value: any) => {
    setFilter({ field, value });
    setPage(1);
    setActiveFilterType(null);
  };

  const resetFilter = () => {
    setFilter(null);
    setActiveFilterType(null);
    setPage(1);
  };

  return (
    <main className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-100 to-blue-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800">
          Find Homestays in Meghalaya
        </h1>
        <p className="text-sm text-gray-700 mt-1">Explore cozy and affordable stays across the state</p>
      </section>

      {/* Filter Bar */}
      <section className="bg-white shadow-md border-b px-4 py-4">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveFilterType(activeFilterType === "location" ? null : "location")}
            className={`flex flex-col items-center px-3 py-2 rounded-full ${filter?.field === "location" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"} font-medium text-sm shadow transition`}
          >
            <MapPin size={18} />
            <span>Location</span>
            {filter?.field === "location" && <span className="text-xs mt-1">{filter.value}</span>}
          </button>

          <button
            onClick={() => setActiveFilterType(activeFilterType === "price" ? null : "price")}
            className={`flex flex-col items-center px-3 py-2 rounded-full ${filter?.field === "price" ? "bg-green-500 text-white" : "bg-green-100 text-green-800"} font-medium text-sm shadow transition`}
          >
            <SlidersHorizontal size={18} />
            <span>Price</span>
          </button>

          <button
            onClick={resetFilter}
            className="flex flex-col items-center px-3 py-2 rounded-full bg-gray-200 text-gray-700 font-medium text-sm shadow transition"
          >
            <XCircle size={18} />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {activeFilterType === "location" && locations.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSelectValue("location", loc)}
              className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-sm hover:bg-blue-100 transition"
            >
              {loc}
            </button>
          ))}
          {activeFilterType === "price" && (
            <>
              <button
                onClick={() => handleSelectValue("price", "<1000")}
                className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm hover:bg-green-100 transition"
              >
                Below ₹1,000
              </button>
              <button
                onClick={() => handleSelectValue("price", "1000-2000")}
                className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm hover:bg-green-100 transition"
              >
                ₹1,000 – ₹2,000
              </button>
              <button
                onClick={() => handleSelectValue("price", "2000-4000")}
                className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm hover:bg-green-100 transition"
              >
                ₹2,000 – ₹4,000
              </button>
              <button
                onClick={() => handleSelectValue("price", ">4000")}
                className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm hover:bg-green-100 transition"
              >
                Above ₹4,000
              </button>
            </>
          )}
        </div>
      </section>

      {/* Popular Stays */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Popular Stays</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {popular.slice(0, 10).map((stay) => (
            <Link
              key={stay.id}
              href={`/homestays/${stay.slug}`}
              className="min-w-[160px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="h-24 relative bg-gray-100">
                {stay.image && stay.image.startsWith("https") ? (
                  <Image src={stay.image} alt={stay.name || "Stay"} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold truncate">{stay.name}</p>
                {stay.location && <p className="text-xs text-gray-500 truncate">{stay.location}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Attractive Stays */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Attractive Stays</h2>
        <div className="flex flex-col gap-4">
          {items.map((stay) => (
            <Link
              key={stay.id}
              href={`/homestays/${stay.slug}`}
              className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative w-full h-40 bg-gray-100">
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
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin size={14} className="mr-1" /> {stay.location}
                  </div>
                )}
                {stay.pricepernight && (
                  <p className="text-green-700 font-semibold mt-1">
                    From ₹{stay.pricepernight.toLocaleString()}/night
                  </p>
                )}
                {stay.description && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{stay.description}</p>
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
