'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import useFilteredList from '@/hooks/useFilteredList'
import { cn } from '@/lib/utils'

export type FeaturedCategory =
  | 'destinations'
  | 'homestays'
  | 'events'
  | 'thrills'
  | 'cafesRestaurants'
  | 'itineraries'

interface BannerProps {
  category: FeaturedCategory
  className?: string
}

function useFeaturedAds(category: FeaturedCategory) {
  const config = categoryConfig[category]
  const { data, loading } = useFilteredList<any>(config.table, {
    filters: [
      { field: 'adslot', op: 'eq', value: 'homepage' },
      { field: 'adactive', op: 'eq', value: true },
    ],
    sort: { field: 'created_at', ascending: false },
    pageSize: 10,
  })
  return { data: data || [], loading, Card: config.Card }
}

const categoryConfig: Record<
  FeaturedCategory,
  { table: string; Card: (props: { item: any }) => React.ReactElement }
> = {
  destinations: {
    table: 'destinations',
    Card: ({ item }) => (
      <div className="flex bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 w-[260px]">
        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.name || 'Destination'} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>
        <div className="flex flex-col justify-center p-2 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {item.name || 'Untitled'}
          </h3>
          {item.location && (
            <p className="text-xs text-gray-600 flex items-center">
              <MapPin size={12} className="mr-1" /> {item.location}
            </p>
          )}
        </div>
      </div>
    ),
  },
  homestays: {
    table: 'homestays',
    Card: ({ item }) => (
      <div className="flex bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 w-[260px]">
        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.name || 'Homestay'} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>
        <div className="flex flex-col justify-center p-2 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {item.name || 'Untitled'}
          </h3>
          {item.location && (
            <p className="text-xs text-gray-600 flex items-center">
              <MapPin size={12} className="mr-1" /> {item.location}
            </p>
          )}
          {item.pricepernight && (
            <p className="text-xs text-emerald-600">
              ₹{item.pricepernight.toLocaleString()}/night
            </p>
          )}
        </div>
      </div>
    ),
  },
  events: {
    table: 'events',
    Card: ({ item }) => (
      <div className="flex items-center gap-2 bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 px-2 py-2 w-[220px]">
        <div className="relative w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
          {item.image ? (
            <Image src={item.image} alt={item.name || 'Event'} fill sizes="64px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 text-center px-1">
              {item.name?.slice(0, 20) || 'No image'}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {item.name || 'Untitled'}
          </h3>
          {item.date && (
            <p className="text-xs text-gray-600">
              {new Date(item.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>
    ),
  },
  thrills: {
    table: 'thrills',
    Card: ({ item }) => (
      <div className="flex bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 w-[260px]">
        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.name || 'Thrill'} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>
        <div className="flex flex-col justify-center p-2 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {item.name || 'Untitled'}
          </h3>
          {item.location && (
            <p className="text-xs text-gray-600 flex items-center">
              <MapPin size={12} className="mr-1" /> {item.location}
            </p>
          )}
          {item.priceperperson && (
            <p className="text-xs text-emerald-600">
              ₹{item.priceperperson.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    ),
  },
  cafesRestaurants: {
    table: 'cafes_and_restaurants',
    Card: ({ item }) => (
      <div className="flex bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 w-[300px]">
        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.name || 'Cafe'} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>
        <div className="flex flex-col justify-center p-2 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {item.name || 'Untitled'}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
          <p className="text-xs text-gray-600 flex items-center">
            <MapPin size={12} className="mr-1" /> {item.location}
          </p>
          <p className="text-xs text-gray-500">
            {(item.cuisine?.[0] || 'Unknown')} • {item.type} • ⭐ {item.ratings ?? 'N/A'}
          </p>
        </div>
      </div>
    ),
  },
  itineraries: {
    table: 'itineraries',
    Card: ({ item }) => (
      <div className="flex bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 w-[260px]">
        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.title || 'Itinerary'} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>
        <div className="flex flex-col justify-center p-2 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {item.title || 'Untitled'}
          </h3>
          {item.starting_point && (
            <p className="text-xs text-gray-600 flex items-center">
              <MapPin size={12} className="mr-1" /> {item.starting_point}
            </p>
          )}
          {item.estimated_cost?.min && (
            <p className="text-xs text-emerald-600">
              ₹{item.estimated_cost.min.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    ),
  },
}

export default function FeaturedBannerAds({ category, className }: BannerProps) {
  const { data, loading, Card } = useFeaturedAds(category)

  if (loading) {
    return <p className="text-sm text-gray-500 px-2">Loading Data...</p>
  }
  if (!data.length) {
    return <p className="text-sm text-gray-500 px-2">No Data available.</p>
  }

  const hrefMap: Record<FeaturedCategory, (item: any) => string> = {
    destinations: (i) => `/destinations/${i.slug ?? i.id}`,
    homestays: (i) => `/homestays/${i.slug ?? i.id}`,
    events: (i) => `/events/${i.slug ?? i.id}`,
    thrills: (i) => `/thrills/${i.slug ?? i.id}`,
    cafesRestaurants: (i) => `/cafesRestaurants/${i.slug ?? i.id}`,
    itineraries: (i) => `/itineraries/${i.slug ?? i.id}`,
  }

  return (
    <div className={cn('flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2', className)}>
      {data.map((item) => (
        <Link key={item.id} href={hrefMap[category](item)} className="shrink-0">
          <Card item={item} />
        </Link>
      ))}
    </div>
  )
}