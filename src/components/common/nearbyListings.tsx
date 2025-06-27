'use client';

import Image from 'next/image';
import Link from 'next/link';
import useSupabaseNearby from '@/hooks/useSupabaseNearby';
import HorizontalScroll from './horizontalScroll';

interface Props {
  type: string; // table name
  filterBy: string; // column to match
  matchValue: string | number | null;
  excludeId?: string;
  title?: string;
}

export default function NearbyListings<T>({
  type,
  filterBy,
  matchValue,
  excludeId,
  title,
}: Props) {
  const { data, loading } = useSupabaseNearby<T>(type, filterBy, matchValue, excludeId);

  if (loading) {
    return <p className="text-sm text-gray-500 px-2">Loading {title || 'items'}...</p>;
  }

  if (!data.length) return null;

  return (
    <section className="mt-6">
      {title && <h2 className="text-lg font-semibold mb-2 px-2">{title}</h2>}
      <HorizontalScroll>
        {data.map((item: any) => (
          <Link
            key={item.id}
            href={`/${type}/${item.slug ?? item.id}`}
            className="min-w-[160px] bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0"
          >
            <div className="w-full h-24 relative bg-gray-100">
              {item.image && item.image.startsWith('https') ? (
                <Image src={item.image} alt={item.name || 'Listing'} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-sm font-medium truncate">{item.name}</p>
              {(item.location || item.district) && (
                <p className="text-xs text-gray-500 truncate">{item.location || item.district}</p>
              )}
            </div>
          </Link>
        ))}
      </HorizontalScroll>
    </section>
  );
}