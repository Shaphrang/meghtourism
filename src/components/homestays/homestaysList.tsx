'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { fetchData } from '@/lib/fetchData';
import { Homestay } from '@/types/homestay';
import HomestayCard from '@/components/cards/homestayCard';
import PromoBanner from '@/components/common/promoBanner';

const PAGE_SIZE = 6;

export default function HomestaysList() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState<'az' | 'price'>('az');
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch homestays on mount
  useEffect(() => {
    fetchData('homestays.json').then(setHomestays).catch(console.error);
  }, []);

  // Infinite scroll setup
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoadingMore(true);
        setTimeout(() => {
          setPage((prev) => prev + 1);
          setLoadingMore(false);
        }, 600);
      }
    });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, []);

  // Extract unique locations
  const locations = useMemo(() => {
    return Array.from(new Set(homestays.map((h) => h.location).filter(Boolean))) as string[];
  }, [homestays]);

  // Filter by selected location
  const filtered = useMemo(() => {
    return homestays.filter((h) => (location ? h.location === location : true));
  }, [homestays, location]);

  // Sort homestays by name or pricepernight
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === 'price') {
        return (a.pricepernight ?? 0) - (b.pricepernight ?? 0);
      }
      return (a.name ?? '').localeCompare(b.name ?? '');
    });
  }, [filtered, sort]);

  // Paginate visible results
  const visible = useMemo(() => {
    return sorted.slice(0, page * PAGE_SIZE);
  }, [sorted, page]);

  return (
    <>
      {/* Filter Controls */}
      <div className="sticky top-[64px] z-10 bg-white pb-3 pt-2 mb-4 flex flex-wrap gap-3 px-2 border-b">
        <select
          className="border border-gray-300 px-3 py-1.5 text-sm rounded shadow-sm focus:outline-none"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 px-3 py-1.5 text-sm rounded shadow-sm focus:outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'az' | 'price')}
        >
          <option value="az">A-Z</option>
          <option value="price">Price</option>
        </select>
      </div>

      {/* Homestay Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-all px-2">
        {visible.map((homestay) => (
          <HomestayCard key={homestay.id} homestay={homestay} />
        ))}

        {/* PromoBanner after every full page */}
        {visible.length % PAGE_SIZE === 0 && visible.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-3" key={`banner-${page}`}>
            <PromoBanner />
          </div>
        )}
      </div>

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="h-10 mt-6 flex justify-center items-center text-sm text-gray-500">
        {loadingMore && <span>Loading more...</span>}
      </div>
    </>
  );
}
