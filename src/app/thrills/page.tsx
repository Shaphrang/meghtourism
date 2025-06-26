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
import { Thrill } from "@/types/thrill";

export default function ThrillsListingPage() {
  const [page, setPage] = useState(1);
  const [thrills, setThrills] = useState<Thrill[]>([]);
  const { data, totalCount, loading } = useSupabaseList<Thrill>("thrills", {
    sortBy: "created_at",
    ascending: false,
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
    <main className="w-full min-h-screen bg-white text-gray-800">
      <section className="bg-gradient-to-r from-yellow-100 to-green-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Experience the Thrill of Meghalaya</h1>
      </section>

      {/* Filter Bar */}
      <section className="p-4 flex flex-wrap justify-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
          <SortAsc size={16} /> Sort
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
          <SlidersHorizontal size={16} /> Type
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
          <Filter size={16} /> District
        </button>
      </section>

      {/* Top Adventures */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Top Adventures</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {popular.slice(0, 10).map((thrill) => (
            <Link
              key={thrill.id}
              href={`/thrills/${thrill.slug ?? thrill.id}`}
              className="min-w-[200px] bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-32 relative bg-gray-100">
                {thrill.image ? (
                  <Image src={thrill.image} alt={thrill.name || "Thrill"} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{thrill.name}</h3>
                {thrill.location && (
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin size={12} className="mr-1" /> {thrill.location}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Activities */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">All Activities</h2>
        <div className="flex flex-col gap-4">
          {thrills.map((thrill) => (
            <Link
              key={thrill.id}
              href={`/thrills/${thrill.slug ?? thrill.id}`}
              className="bg-gray-50 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="h-40 relative bg-gray-100">
                {thrill.image ? (
                  <Image src={thrill.image} alt={thrill.name || "Thrill"} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{thrill.name}</h3>
                {thrill.location && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin size={14} className="mr-1" /> {thrill.location}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {thrill.duration && <>🕒 {thrill.duration} </>}
                  {thrill.priceperperson && <>💰 ₹{thrill.priceperperson.toLocaleString()}</>}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {thrill.tags?.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{tag}</span>
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
