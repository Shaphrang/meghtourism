'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useSupabaseList from '@/hooks/useSupabaseList';
import { cn } from '@/lib/utils';

export interface AdCardProps {
  image: string;
  title: string;
  description: string;
  link: string;
}

type Category = 'homestays' | 'events' | 'thrills' | 'cafes' | 'itineraries';

interface BannerProps {
  category: Category;
  className?: string;
}

const categoryMap: Record<Category, {
  table: string;
  getTitle: (item: any) => string;
  getDescription: (item: any) => string;
  getImage: (item: any) => string | undefined;
  getLink: (item: any) => string;
}> = {
  homestays: {
    table: 'homestays',
    getTitle: (i) => i.name ?? 'Untitled',
    getDescription: (i) => i.description ?? '',
    getImage: (i) => i.image,
    getLink: (i) => `/homestays/${i.slug ?? i.id}`,
  },
  events: {
    table: 'events',
    getTitle: (i) => i.name ?? 'Untitled',
    getDescription: (i) => i.description ?? '',
    getImage: (i) => i.image,
    getLink: (i) => `/events/${i.slug ?? i.id}`,
  },
  thrills: {
    table: 'thrills',
    getTitle: (i) => i.name ?? 'Untitled',
    getDescription: (i) => i.description ?? '',
    getImage: (i) => i.image,
    getLink: (i) => `/thrills/${i.slug ?? i.id}`,
  },
  cafes: {
    table: 'cafes_and_restaurants',
    getTitle: (i) => i.name ?? 'Untitled',
    getDescription: (i) => i.description ?? '',
    getImage: (i) => i.image,
    getLink: (i) => `/cafesRestaurants/${i.slug ?? i.id}`,
  },
  itineraries: {
    table: 'itineraries',
    getTitle: (i) => i.title ?? 'Untitled',
    getDescription: (i) => i.description ?? '',
    getImage: (i) => i.image,
    getLink: (i) => `/itineraries/${i.slug ?? i.id}`,
  },
};

function useAdData(category: Category) {
  const config = categoryMap[category];
  const { data, loading } = useSupabaseList<any>(config.table, {
    sortBy: 'created_at',
    ascending: false,
    pageSize: 10,
  });
  return { data, loading, config };
}

function VerticalCard({ image, title, description, link }: AdCardProps) {
  return (
    <div className="min-w-[160px] max-w-[180px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 flex flex-col">
      <div className="relative w-full h-28 bg-gray-100">
        {image ? (
          <Image src={image} alt={title} fill sizes="180px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-2">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{title}</h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</p>
        <div className="mt-auto pt-1">
          <Button variant="outline" size="sm" asChild>
            <Link href={link}>Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function HorizontalCard({ image, title, description, link }: AdCardProps) {
  return (
    <div className="flex bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 w-[240px]">
      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100">
        {image ? (
          <Image src={image} alt={title} fill sizes="96px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
        )}
      </div>
      <div className="flex flex-col justify-between p-2 flex-1">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 truncate">{title}</h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</p>
        </div>
        <div className="mt-1">
          <Button variant="outline" size="sm" asChild>
            <Link href={link}>Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Vertical banner ads for the homepage. Fetches 10 items
 * from the chosen category and displays them in a scrollable row.
 */
export function VerticalFeaturedAd({ category, className }: BannerProps) {
  const { data, loading, config } = useAdData(category);

  if (loading) {
    return <p className="text-sm text-gray-500 px-2">Loading ads...</p>;
  }
  if (!data.length) {
    return <p className="text-sm text-gray-500 px-2">No ads available.</p>;
  }

  return (
    <div className={cn('flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2', className)}>
      {data.map((item: any) => (
        <VerticalCard
          key={item.id}
          image={config.getImage(item) ?? ''}
          title={config.getTitle(item)}
          description={config.getDescription(item)}
          link={config.getLink(item)}
        />
      ))}
    </div>
  );
}

/**
 * Horizontal banner ads for the homepage. Fetches 10 items
 * from the chosen category and displays them in a scrollable row.
 */
export function HorizontalFeaturedAd({ category, className }: BannerProps) {
  const { data, loading, config } = useAdData(category);

  if (loading) {
    return <p className="text-sm text-gray-500 px-2">Loading ads...</p>;
  }
  if (!data.length) {
    return <p className="text-sm text-gray-500 px-2">No ads available.</p>;
  }

  return (
    <div className={cn('flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2', className)}>
      {data.map((item: any) => (
        <HorizontalCard
          key={item.id}
          image={config.getImage(item) ?? ''}
          title={config.getTitle(item)}
          description={config.getDescription(item)}
          link={config.getLink(item)}
        />
      ))}
    </div>
  );
}