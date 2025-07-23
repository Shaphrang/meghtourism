import { Itinerary } from '@/types/itineraries';
import { Destination } from '@/types/destination';
import { Homestay } from '@/types/homestay';
import { Event } from '@/types/event';
import { Thrill } from '@/types/thrill';
import { CafeAndRestaurant } from '@/types/cafeRestaurants';
import { Rental } from '@/types/rentals';
import extractMatchFields from '@/lib/extractMatchFields';
import useInternalLinks from './useInternalLinks';

export default function useRelatedForItinerary(itinerary: Itinerary | null) {
  const { location, district, tags } = extractMatchFields(itinerary);

  const destinations = useInternalLinks<Destination>({
    sourceType: 'itineraries',
    targetType: 'destinations',
    location,
    district,
    tags,
  });

  const homestays = useInternalLinks<Homestay>({
    sourceType: 'itineraries',
    targetType: 'homestays',
    location,
    district,
    tags,
  });

  const events = useInternalLinks<Event>({
    sourceType: 'itineraries',
    targetType: 'events',
    location,
    district,
    tags,
  });

  const thrills = useInternalLinks<Thrill>({
    sourceType: 'itineraries',
    targetType: 'thrills',
    location,
    district,
    tags,
  });

  const restaurants = useInternalLinks<CafeAndRestaurant>({
    sourceType: 'itineraries',
    targetType: 'cafesRestaurants',
    location,
    district,
    tags,
  });

  const rentals = useInternalLinks<Rental>({
    sourceType: 'itineraries',
    targetType: 'rentals',
    location,
    district,
    tags,
  });

  return {
    destinations: destinations.data,
    homestays: homestays.data,
    events: events.data,
    thrills: thrills.data,
    restaurants: restaurants.data,
    rentals: rentals.data,
  };
}