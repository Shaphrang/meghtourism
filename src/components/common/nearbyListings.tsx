'use client';

import Image from 'next/image';
import Link from 'next/link';
import useSupabaseNearby from '@/hooks/useSupabaseNearby';

interface Props {
  type: string; // Supabase table name
  location: string | null;
  excludeId?: string;
  limit?: number;
  title?: string;
}

export default function NearbyListings<T>({
  type,
  location,
  excludeId,
  limit,
  title,
}: Props) {
  const { data, loading } = useSupabaseNearby<T>(type, location, excludeId, limit);

  if (loading) {
    return <p className="text-sm text-gray-500 px-4">Loading {title || 'items'}...</p>;
  }

  if (!data.length) return null;

  return (
    <section className="mt-6 px-4">
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 snap-x snap-mandatory">
        {data.map((item: any) => (
          <Link
            key={item.id}
            href={`/${type}/${item.slug ?? item.id}`}
            className="min-w-[160px] max-w-[160px] snap-start bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex-shrink-0"
          >
            <div className="w-full h-28 relative bg-gray-100">
              {item.image && item.image.startsWith('https') ? (
                <Image src={item.image} alt={item.name || 'Listing'} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">
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
      </div>
    </section>
  );
}
