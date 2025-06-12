'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { fetchData } from '@/lib/fetchData';
import { Thrill } from '@/types/thrill';
import ThrillCard from '@/components/cards/thrillsCard';
import PromoBanner from '@/components/common/promoBanner';

const PAGE_SIZE = 6;

export default function ThrillsList() {
  const [thrills, setThrills] = useState<Thrill[]>([]);
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch thrills once
  useEffect(() => {
    fetchData('thrills.json').then(setThrills).catch(console.error);
  }, []);

  // Infinite scroll effect
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

  const locations = useMemo(() => {
    return Array.from(new Set(thrills.map((t) => t.location).filter(Boolean))) as string[];
  }, [thrills]);

  const filtered = useMemo(() => {
    return thrills.filter((t) => (location ? t.location === location : true));
  }, [thrills, location]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [filtered]);

  const visible = useMemo(() => {
    return sorted.slice(0, page * PAGE_SIZE);
  }, [sorted, page]);

  return (
    <>
      {/* Filters */}
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
      </div>

      {/* Grid of thrill cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-all px-2">
        {visible.map((thrill) => (
          <ThrillCard key={thrill.id} thrill={thrill} className="w-full" />
        ))}

        {/* PromoBanner after full page */}
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
