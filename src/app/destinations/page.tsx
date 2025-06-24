// src/app/destinations/page.tsx
"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Destination } from "@/types/destination";
import useSupabaseList from "@/hooks/useSupabaseList";
import { MapPin } from "lucide-react";
import BannerAd from "@/components/common/bannerAd"; // Adjust this path as needed

export default function DestinationsListingPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ district: "", tag: "" });
  const [items, setItems] = useState<Destination[]>([]);
  const { data, totalCount, loading } = useSupabaseList<Destination>("destinations", {
    sortBy: "created_at",
    ascending: false,
    page,
    pageSize: 10,
    filter: filters.district ? { field: "district", value: filters.district } : undefined,
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

  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <main className="px-4 py-6">
      <Head>
        <title>Explore Destinations in Meghalaya | Meghtourism</title>
        <meta name="description" content="Discover beautiful destinations in Meghalaya. Filter by district or tags and explore more." />
      </Head>

      {/* Hero */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800">All Destinations</h1>
        <p className="text-sm text-gray-600">Browse all popular and offbeat destinations across Meghalaya</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filters.district}
          onChange={(e) => setFilters({ ...filters, district: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="">All Districts</option>
          <option value="East Khasi Hills">East Khasi Hills</option>
          <option value="West Jaintia Hills">West Jaintia Hills</option>
          <option value="Ri-Bhoi">Ri-Bhoi</option>
          {/* Add more districts as needed */}
        </select>
      </div>

      {/* List/Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((dest, index) => (
          <Fragment key={dest.id}>
            <Link
              href={`/destinations/${dest.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="w-full h-32 bg-gray-100">
                {dest.image ? (
                  <Image src={dest.image} alt={dest.name || "Destination"} width={400} height={150} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400">No image</div>
                )}
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{dest.name}</h3>
                {dest.location && (
                  <p className="text-xs text-gray-500 flex items-center truncate">
                    <MapPin size={12} className="mr-1" /> {dest.location}
                  </p>
                )}
              </div>
            </Link>

            {(index + 1) % 8 === 0 && (
              <div key={`ad-${index}`} className="col-span-full">
                <BannerAd />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {/* Loader / End */}
      <div ref={observerRef} className="mt-6 text-center">
        {loading ? (
          <p className="text-sm text-gray-500">Loading more destinations...</p>
        ) : items.length >= (totalCount ?? 0) ? (
          <p className="text-sm text-gray-400">No more destinations.</p>
        ) : null}
      </div>
    </main>
  );
}
