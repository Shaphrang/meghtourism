// src/components/sections/AccommodationsSection.tsx
'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import useSupabaseList from '@/hooks/useSupabaseList';
import { Homestay } from '@/types/homestay';

export default function AccommodationsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: homestays, loading } = useSupabaseList<Homestay>('homestays', {
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
    <section className="w-full px-2 sm:px-4 mt-4">
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Stay with Comfort</h2>
        <Link href="/accommodations" className="text-sm text-emerald-600 hover:underline font-medium">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 px-1">Loading accommodations...</div>
      ) : (
        <div
          ref={containerRef}
          className="flex space-x-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-2"
        >
          {homestays.slice(0, 10).map((stay) => (
            <div
              key={stay.id}
              className="min-w-[42%] sm:min-w-[180px] max-w-[220px] h-[190px] sm:h-[210px] bg-white rounded-xl overflow-hidden shadow-md snap-start flex-shrink-0 flex flex-col"
            >
              <div className="w-full h-[100px] sm:h-[110px] bg-gray-100">
                {stay.image ? (
                  <Image
                    src={stay.image}
                    alt={stay.name || 'Homestay'}
                    width={300}
                    height={130}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No image available
                  </div>
                )}
              </div>
              <div className="px-3 py-2 flex flex-col justify-between flex-grow h-full overflow-hidden">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{stay.name || 'Untitled'}</h3>
                {stay.location && (
                  <p className="text-xs text-gray-500 truncate flex items-center mt-1">
                    <MapPin size={12} className="mr-1" />
                    {stay.location}
                  </p>
                )}
                {stay.pricepernight && (
                  <p className="text-sm font-medium text-emerald-600 mt-auto">
                    ₹{stay.pricepernight.toLocaleString()}/night
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
