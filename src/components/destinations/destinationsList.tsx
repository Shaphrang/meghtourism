'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchData } from '@/lib/fetchData';
import { Destination } from '@/types/destination';
import DestinationListingCard from '@/components/cards/destinationListingCard';
import PromoBanner from '@/components/common/promoBanner';

const PAGE_SIZE = 6;

export default function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [district, setDistrict] = useState('');
  const [sort, setSort] = useState('popularity');
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch destinations once
  useEffect(() => {
    fetchData('destinations.json')
      .then(setDestinations)
      .catch(console.error);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoadingMore(true);
        setTimeout(() => {
          setPage((prev) => prev + 1);
          setLoadingMore(false);
        }, 600); // Simulate load time
      }
    });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, []);

  // Extract unique districts
  const districts = Array.from(
    new Set(destinations.map((d) => d.district).filter(Boolean))
  ) as string[];

  const filtered = destinations.filter((d) =>
    district ? d.district === district : true
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'az') return a.name.localeCompare(b.name);
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // popularity default
  });

  const visible = sorted.slice(0, page * PAGE_SIZE);

  return (
    <>
      {/* Filters */}
      <div className="sticky top-[64px] z-10 bg-white pb-3 pt-2 mb-4 flex flex-wrap gap-3 px-2 border-b">
        <select
          className="border border-gray-300 px-3 py-1.5 text-sm rounded shadow-sm focus:outline-none"
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 px-3 py-1.5 text-sm rounded shadow-sm focus:outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="popularity">Popularity</option>
          <option value="az">A-Z</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-all px-2">
        {visible.map((dest, idx) => (
          <DestinationListingCard key={dest.id} destination={dest} />
        ))}

        {/* Promo banner after every 6 cards */}
        {visible.length % PAGE_SIZE === 0 && visible.length > 0 && (
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
