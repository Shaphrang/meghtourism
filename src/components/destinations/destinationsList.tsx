'use client';

import { useState, useEffect, useRef } from 'react';
import useSupabaseList from '@/hooks/useSupabaseList';
import { Destination } from '@/types/destination';
import DestinationListingCard from '@/components/cards/destinationListingCard';

const PAGE_SIZE = 12;

export default function DestinationsList() {
  const [district, setDistrict] = useState('');
  const [sort, setSort] = useState('popularity');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: fetchedData = [],
    totalCount,
    loading,
    error
  } = useSupabaseList<Destination>('destinations', {
    search: searchText,
    filter: district ? { field: 'district', value: district } : undefined,
    sortBy: sort === 'az' ? 'name' : sort === 'rating' ? 'rating' : 'created_at',
    ascending: sort === 'az',
    page,
    pageSize: PAGE_SIZE,
  });

  // Append or reset data
  useEffect(() => {
    if (page === 1) {
      setAllDestinations(fetchedData);
    } else {
      setAllDestinations((prev) => [...prev, ...fetchedData]);
    }
  }, [fetchedData]);

  // Stop if we've reached all rows
  useEffect(() => {
    if (totalCount !== null) {
      const maxPages = Math.ceil(totalCount / PAGE_SIZE);
      if (page >= maxPages || fetchedData.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [totalCount, page, fetchedData.length]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    setAllDestinations([]); 
  }, [searchText, district, sort]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    const ref = loadMoreRef.current;
    if (ref) observer.observe(ref);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  const districts = Array.from(
    new Set(allDestinations.map((d) => d.district).filter(Boolean))
  ) as string[];

  return (
    <>
      {/* Filters: compact, scrollable row */}
      <div className="w-full px-3 py-2 sticky top-0 z-10 bg-white border-b flex flex-nowrap overflow-x-auto gap-2 sm:gap-3">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search"
          className="flex-1 min-w-[140px] border border-gray-300 px-3 py-2 text-sm rounded-md shadow-sm"
        />

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="min-w-[120px] border border-gray-300 px-2 py-2 text-sm rounded-md shadow-sm"
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="min-w-[120px] border border-gray-300 px-2 py-2 text-sm rounded-md shadow-sm"
        >
          <option value="popularity">Popularity</option>
          <option value="az">A-Z</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-2 sm:px-4 pt-4">
        {allDestinations.map((dest, index) => (
          <DestinationListingCard key={`${dest.id}-${index}`} destination={dest} />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      <div
        ref={loadMoreRef}
        className="h-12 mt-6 flex justify-center items-center text-sm text-gray-500"
      >
        {loading && <span>Loading more...</span>}
        {!hasMore && !loading && allDestinations.length > 0 && <span>✅ All loaded</span>}
      </div>

      {error && <p className="p-4 text-red-500">{error}</p>}
    </>
  );
}
