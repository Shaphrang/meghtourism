import { CafeAndRestaurant } from '@/types/cafeRestaurants';
import { Destination } from '@/types/destination';
import { Homestay } from '@/types/homestay';
import { Event } from '@/types/event';
import { Thrill } from '@/types/thrill';
import { Itinerary } from '@/types/itineraries';
import { Rental } from '@/types/rentals';
import extractMatchFields from '@/lib/extractMatchFields';
import useInternalLinks from './useInternalLinks';

export default function useRelatedForRestaurant(restaurant: CafeAndRestaurant | null) {
  const { location, district, tags } = extractMatchFields(restaurant);

  const destinations = useInternalLinks<Destination>({
    sourceType: 'cafesRestaurants',
    targetType: 'destinations',
    location,
    district,
    tags,
  });

  const homestays = useInternalLinks<Homestay>({
    sourceType: 'cafesRestaurants',
    targetType: 'homestays',
    location,
    district,
    tags,
  });

  const events = useInternalLinks<Event>({
    sourceType: 'cafesRestaurants',
    targetType: 'events',
    location,
    district,
    tags,
  });

  const thrills = useInternalLinks<Thrill>({
    sourceType: 'cafesRestaurants',
    targetType: 'thrills',
    location,
    district,
    tags,
  });

  const itineraries = useInternalLinks<Itinerary>({
    sourceType: 'cafesRestaurants',
    targetType: 'itineraries',
    location,
    district,
    tags,
  });

  const rentals = useInternalLinks<Rental>({
    sourceType: 'cafesRestaurants',
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
    itineraries: itineraries.data,
    rentals: rentals.data,
  };
}