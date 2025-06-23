// src/components/sections/CafesSection.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import useSupabaseList from '@/hooks/useSupabaseList';
import { CafeAndRestaurant } from '@/types/cafeAndRestaurant';

export default function CafesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: cafes, loading } = useSupabaseList<CafeAndRestaurant>('cafes_and_restaurants', {
    sortBy: 'created_at',
    ascending: false,
    pageSize: 8,
  });

  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section className="w-full px-2 sm:px-4 mt-6">
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Cafes & Restaurants</h2>
        <Link href="/cafes-and-restaurants" className="text-sm text-emerald-600 hover:underline font-medium">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 px-1">Loading cafes & restaurants...</div>
      ) : (
        <div ref={containerRef} className="grid gap-4 sm:grid-cols-2">
          {cafes.slice(0, 8).map((cafe) => (
            <div
              key={cafe.id}
              className="flex gap-3 bg-white rounded-xl shadow-md overflow-hidden p-2"
            >
              <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {cafe.image ? (
                  <Image
                    src={cafe.image}
                    alt={cafe.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400">No Image</div>
                )}
              </div>
              <div className="flex flex-col justify-between py-1 pr-1">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{cafe.name}</h3>
                  <p className="text-xs text-gray-600">
                    {expandedIds.includes(cafe.id)
                      ? cafe.description
                      : `${cafe.description?.slice(0, 100)}${cafe.description && cafe.description.length > 100 ? '...' : ''}`}
                    {cafe.description && cafe.description.length > 100 && (
                      <button
                        onClick={() => toggleExpand(cafe.id)}
                        className="ml-1 text-emerald-600 text-[11px] font-medium"
                      >
                        {expandedIds.includes(cafe.id) ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <MapPin size={12} className="mr-1" />
                    {cafe.location}
                  </p>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {(cafe.cuisine?.length ? cafe.cuisine.join(', ') : 'No cuisine')} • {cafe.type} • ⭐ {cafe.ratings ?? 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
