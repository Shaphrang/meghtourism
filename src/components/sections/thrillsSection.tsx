'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import useSupabaseList from '@/hooks/useSupabaseList';
import { Thrill } from '@/types/thrill';

export default function ThrillsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: thrills, loading } = useSupabaseList<Thrill>('thrills', {
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
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Adventure & Thrills</h2>
        <Link
          href="/thrills"
          className="text-sm text-emerald-600 hover:underline font-medium"
        >
          View All
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 px-1">Loading thrills...</div>
      ) : (
        <div
          ref={containerRef}
          className="flex space-x-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-2"
        >
          {thrills.slice(0, 10).map((thrill) => (
            <Link
              key={thrill.id}
              href={`/thrills/${thrill.slug ?? thrill.id}`}
              className="min-w-[42%] sm:min-w-[200px] max-w-[240px] rounded-xl overflow-hidden bg-white shadow-md snap-start flex-shrink-0"
            >
              <div className="w-full h-[120px] sm:h-[140px] bg-gray-100">
                {thrill.image && thrill.image.startsWith('https') ? (
                  <Image
                    src={thrill.image}
                    alt={thrill.name || 'Thrill'}
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
                  {thrill.name || 'Untitled'}
                </h3>
                {thrill.location && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin size={12} className="mr-1" />
                    <span className="truncate">{thrill.location}</span>
                  </div>
                )}
                {thrill.priceperperson && (
                  <p className="text-xs text-gray-600 mt-1">
                    ₹{thrill.priceperperson.toLocaleString()} per person
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
