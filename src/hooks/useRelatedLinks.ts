import { Destination } from '@/types/destination'
import { Homestay } from '@/types/homestay'
import { Event } from '@/types/event'
import { Thrill } from '@/types/thrill'
import { CafeAndRestaurant } from '@/types/cafeRestaurants'
import { Itinerary } from '@/types/itineraries'
import { Rental } from '@/types/rentals'
import { Blog } from '@/types/blogs'
import { TravelTip } from '@/types/travelTips'
import useInternalLinks from './useInternalLinks'

export function useRelatedForDestination(dest: Destination) {
  const homestays = useInternalLinks<Homestay>('homestays', dest.location, {
    tags: dest.tags || [],
    region: dest.district,
    excludeId: dest.id,
  })
  const events = useInternalLinks<Event>('events', dest.location, {
    tags: dest.tags || [],
    region: dest.district,
  })
  const restaurants = useInternalLinks<CafeAndRestaurant>('cafes_and_restaurants', dest.location, {
    tags: dest.tags || [],
    region: dest.district,
  })
  const thrills = useInternalLinks<Thrill>('thrills', dest.location, {
    tags: dest.tags || [],
    region: dest.district,
  })
  const blogs = useInternalLinks<Blog>('blogs', dest.location, {
    tags: dest.tags || [],
    region: dest.district,
  })
  const tips = useInternalLinks<TravelTip>('traveltips', dest.location, {
    tags: dest.tags || [],
    region: dest.district,
  })
  return { homestays, events, restaurants, thrills, blogs, tips }
}

export function useRelatedForHomestay(stay: Homestay) {
  const events = useInternalLinks<Event>('events', stay.location || null, {
    tags: stay.tags || [],
    region: stay.district,
  })
  const restaurants = useInternalLinks<CafeAndRestaurant>('cafes_and_restaurants', stay.location || null, {
    tags: stay.tags || [],
    region: stay.district,
  })
  const tips = useInternalLinks<TravelTip>('traveltips', stay.location || null, {
    tags: stay.tags || [],
    region: stay.district,
  })
  const blogs = useInternalLinks<Blog>('blogs', stay.location || null, {
    tags: stay.tags || [],
    region: stay.district,
  })
  return { events, restaurants, tips, blogs }
}

export function useRelatedForEvent(ev: Event) {
  const homestays = useInternalLinks<Homestay>('homestays', ev.location || null, {
    tags: ev.tags || [],
    region: ev.district,
  })
  const destinations = useInternalLinks<Destination>('destinations', ev.location || null, {
    tags: ev.tags || [],
    region: ev.district,
  })
  const restaurants = useInternalLinks<CafeAndRestaurant>('cafes_and_restaurants', ev.location || null, {
    tags: ev.tags || [],
    region: ev.district,
  })
  const blogs = useInternalLinks<Blog>('blogs', ev.location || null, {
    tags: ev.tags || [],
    region: ev.district,
  })
  return { homestays, destinations, restaurants, blogs }
}

export function useRelatedForThrill(thrill: Thrill) {
  const homestays = useInternalLinks<Homestay>('homestays', thrill.location || null, {
    tags: thrill.tags || [],
    region: thrill.district,
  })
  const destinations = useInternalLinks<Destination>('destinations', thrill.location || null, {
    tags: thrill.tags || [],
    region: thrill.district,
  })
  const restaurants = useInternalLinks<CafeAndRestaurant>('cafes_and_restaurants', thrill.location || null, {
    tags: thrill.tags || [],
    region: thrill.district,
  })
  const blogs = useInternalLinks<Blog>('blogs', thrill.location || null, {
    tags: thrill.tags || [],
    region: thrill.district,
  })
  return { homestays, destinations, restaurants, blogs }
}

export function useRelatedForCafe(cafe: CafeAndRestaurant) {
  const homestays = useInternalLinks<Homestay>('homestays', cafe.location || null, {
    tags: cafe.tags || [],
    region: cafe.district,
  })
  const destinations = useInternalLinks<Destination>('destinations', cafe.location || null, {
    tags: cafe.tags || [],
    region: cafe.district,
  })
  const events = useInternalLinks<Event>('events', cafe.location || null, {
    tags: cafe.tags || [],
    region: cafe.district,
  })
  const blogs = useInternalLinks<Blog>('blogs', cafe.location || null, {
    tags: cafe.tags || [],
    region: cafe.district,
  })
  return { homestays, destinations, events, blogs }
}

export function useRelatedForItinerary(itinerary: Itinerary) {
  const destinations = useInternalLinks<Destination>('destinations', itinerary.starting_point || null, {
    tags: itinerary.tags || [],
    region: itinerary.regions_covered?.[0] || null,
  })
  const homestays = useInternalLinks<Homestay>('homestays', itinerary.starting_point || null, {
    tags: itinerary.tags || [],
    region: itinerary.regions_covered?.[0] || null,
  })
  const blogs = useInternalLinks<Blog>('blogs', itinerary.starting_point || null, {
    tags: itinerary.tags || [],
    region: itinerary.regions_covered?.[0] || null,
  })
  return { destinations, homestays, blogs }
}

export function useRelatedForRental(rental: Rental) {
  const destinations = useInternalLinks<Destination>('destinations', rental.location || null, {
    tags: rental.tags || [],
    region: rental.district,
  })
  const homestays = useInternalLinks<Homestay>('homestays', rental.location || null, {
    tags: rental.tags || [],
    region: rental.district,
  })
  const blogs = useInternalLinks<Blog>('blogs', rental.location || null, {
    tags: rental.tags || [],
    region: rental.district,
  })
  return { destinations, homestays, blogs }
}

export function useRelatedForBlog(blog: Blog) {
  const destinations = useInternalLinks<Destination>('destinations', blog.region || null, {
    tags: blog.tags || [],
    region: blog.region,
  })
  const events = useInternalLinks<Event>('events', blog.region || null, {
    tags: blog.tags || [],
    region: blog.region,
  })
  const tips = useInternalLinks<TravelTip>('traveltips', blog.region || null, {
    tags: blog.tags || [],
    region: blog.region,
  })
  return { destinations, events, tips }
}

export function useRelatedForTravelTip(tip: TravelTip) {
  const destinations = useInternalLinks<Destination>('destinations', tip.location || null, {
    tags: tip.tags || [],
    region: tip.region,
  })
  const events = useInternalLinks<Event>('events', tip.location || null, {
    tags: tip.tags || [],
    region: tip.region,
  })
  const blogs = useInternalLinks<Blog>('blogs', tip.location || null, {
    tags: tip.tags || [],
    region: tip.region,
  })
  return { destinations, events, blogs }
}