import { Event } from '@/types/event';
import { Destination } from '@/types/destination';
import { Homestay } from '@/types/homestay';
import { Thrill } from '@/types/thrill';
import { CafeAndRestaurant } from '@/types/cafeRestaurants';
import { Itinerary } from '@/types/itineraries';
import { Rental } from '@/types/rentals';
import extractMatchFields from '@/lib/extractMatchFields';
import useInternalLinks from './useInternalLinks';

export default function useRelatedForEvent(event: Event | null) {
  const { location, district, tags } = extractMatchFields(event);

  const destinations = useInternalLinks<Destination>({
    sourceType: 'events',
    targetType: 'destinations',
    location,
    district,
    tags,
  });

  const homestays = useInternalLinks<Homestay>({
    sourceType: 'events',
    targetType: 'homestays',
    location,
    district,
    tags,
  });

  const thrills = useInternalLinks<Thrill>({
    sourceType: 'events',
    targetType: 'thrills',
    location,
    district,
    tags,
  });

  const restaurants = useInternalLinks<CafeAndRestaurant>({
    sourceType: 'events',
    targetType: 'cafesRestaurants',
    location,
    district,
    tags,
  });

  const itineraries = useInternalLinks<Itinerary>({
    sourceType: 'events',
    targetType: 'itineraries',
    location,
    district,
    tags,
  });

  const rentals = useInternalLinks<Rental>({
    sourceType: 'events',
    targetType: 'rentals',
    location,
    district,
    tags,
  });

  return {
    destinations: destinations.data,
    homestays: homestays.data,
    thrills: thrills.data,
    restaurants: restaurants.data,
    itineraries: itineraries.data,
    rentals: rentals.data,
  };
}