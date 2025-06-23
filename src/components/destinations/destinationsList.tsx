'use client';

import { useEffect, useState, useRef } from 'react';
import useSupabaseList from '@/hooks/useSupabaseList';
import { Destination } from '@/types/destination';
import DestinationListingCard from '@/components/cards/destinationListingCard';
import PromoBanner from '@/components/common/promoBanner';

const PAGE_SIZE = 6;

export default function DestinationsList() {
  const [district, setDistrict] = useState('');
  const [sort, setSort] = useState('popularity');
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: destinations = [], loading, error } = useSupabaseList<Destination>('destinations', {
    search: searchText,
    filter: district ? { field: 'district', value: district } : undefined,
    sortBy: sort === 'az' ? 'name' : sort === 'rating' ? 'rating' : 'created_at',
    ascending: sort === 'az',
    page,
    pageSize: PAGE_SIZE,
  });

  // Infinite scroll
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

  // Extract unique districts
  const districts = Array.from(
    new Set(destinations.map((d: Destination) => d.district).filter(Boolean))
  ) as string[];

  if (loading && page === 1) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <>
      {/* Filters */}
      <div className="sticky top-[64px] z-10 bg-white pb-3 pt-2 mb-4 flex flex-wrap gap-3 px-2 border-b">
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
          placeholder="Search destinations"
          className="border border-gray-300 px-3 py-1.5 text-sm rounded shadow-sm"
        />

        <select
          className="border border-gray-300 px-3 py-1.5 text-sm rounded shadow-sm focus:outline-none"
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Districts</option>
          {districts.map((d: string) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className="border border-gray-300 px-3 py-1.5 text-sm rounded shadow-sm focus:outline-none"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          <option value="popularity">Popularity</option>
          <option value="az">A-Z</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-all px-2">
        {destinations.map((dest: Destination) => (
          <div key={dest.id} className="rounded overflow-hidden shadow-md">
            <img
              src={dest.image || '/placeholder.jpg'}
              alt={dest.name || 'Destination'}
              loading="lazy"
              className="w-full h-48 object-cover"
            />
            <DestinationListingCard destination={dest} />
          </div>
        ))}

        {destinations.length % PAGE_SIZE === 0 && destinations.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-3" key={`banner-${page}`}>
            <PromoBanner />
          </div>
        )}
      </div>

      {/* Infinite scroll loader */}
      <div ref={loadMoreRef} className="h-10 mt-6 flex justify-center items-center text-sm text-gray-500">
        {loadingMore && <span>Loading more...</span>}
      </div>
    </>
  );
}
