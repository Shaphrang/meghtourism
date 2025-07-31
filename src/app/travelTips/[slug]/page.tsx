"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSupabaseList from "@/hooks/useSupabaseList";
import { TravelTip } from "@/types/travelTips";

export default function TravelTipsListingPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TravelTip[]>([]);
  const { data, totalCount, loading } = useSupabaseList<TravelTip>("travelTips", {
    sortBy: "published_at",
    ascending: false,
    page,
    pageSize: 6,
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
     <main className="bg-stoneGray text-charcoal px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Travel Tips</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((tip) => (
          <Link
            key={tip.id}
            href={`/travelTips/${tip.slug ?? tip.id}`}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-40 bg-gray-100">
              {tip.image && tip.image.startsWith("https") ? (
                <Image
                  src={tip.image}
                  alt={tip.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
                {tip.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {tip.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div ref={observerRef} className="mt-6 text-center">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : items.length >= (totalCount ?? 0) ? (
          <p className="text-sm text-gray-400">No more tips.</p>
        ) : null}
      </div>
    </main>
  );
}
