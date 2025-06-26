// src/components/sections/DestinationsSection.tsx
'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import useSupabaseList from '@/hooks/useSupabaseList';
import { Destination } from '@/types/destination';

export default function DestinationsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: destinations, loading } = useSupabaseList<Destination>('destinations', {
    sortBy: 'created_at',
    ascending: false,
    pageSize: 10,
  });

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
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Explore Destinations</h2>
        <Link href="/destinations" className="text-sm text-emerald-600 hover:underline font-medium">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 px-1">Loading destinations...</div>
      ) : (
        <div
          ref={containerRef}
          className="flex space-x-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-2"
        >
          {destinations.slice(0, 10).map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug ?? dest.id}`}
              className="min-w-[42%] sm:min-w-[200px] max-w-[240px] rounded-xl overflow-hidden bg-white shadow-md snap-start flex-shrink-0"
            >
              <div className="w-full h-[120px] sm:h-[140px] bg-gray-100">
                {dest.image && dest.image.startsWith('https') ? (
                  <Image
                    src={dest.image}
                    alt={dest.name || 'Destination'}
                    width={300}
                    height={140}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No image available
                  </div>
                )}
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {dest.name || 'Untitled'}
                </h3>
                {dest.location && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin size={12} className="mr-1" />
                    <span className="truncate">{dest.location}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
