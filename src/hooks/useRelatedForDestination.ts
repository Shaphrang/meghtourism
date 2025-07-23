import { Destination } from '@/types/destination';
import { Homestay } from '@/types/homestay';
import { Event } from '@/types/event';
import { Thrill } from '@/types/thrill';
import { CafeAndRestaurant } from '@/types/cafeRestaurants';
import { Itinerary } from '@/types/itineraries';
import { Rental } from '@/types/rentals';
import extractMatchFields from '@/lib/extractMatchFields';
import useInternalLinks from './useInternalLinks';

export default function useRelatedForDestination(destination: Destination | null) {
  const { location, district, tags } = extractMatchFields(destination);

  const homestays = useInternalLinks<Homestay>({
    sourceType: 'destinations',
    targetType: 'homestays',
    location,
    district,
    tags,
  });

  const events = useInternalLinks<Event>({
    sourceType: 'destinations',
    targetType: 'events',
    location,
    district,
    tags,
  });

  const thrills = useInternalLinks<Thrill>({
    sourceType: 'destinations',
    targetType: 'thrills',
    location,
    district,
    tags,
  });

  const restaurants = useInternalLinks<CafeAndRestaurant>({
    sourceType: 'destinations',
    targetType: 'cafesRestaurants',
    location,
    district,
    tags,
  });

  const itineraries = useInternalLinks<Itinerary>({
    sourceType: 'destinations',
    targetType: 'itineraries',
    location,
    district,
    tags,
  });

  const rentals = useInternalLinks<Rental>({
    sourceType: 'destinations',
    targetType: 'rentals',
    location,
    district,
    tags,
  });

  return {
    homestays: homestays.data,
    events: events.data,
    thrills: thrills.data,
    restaurants: restaurants.data,
    itineraries: itineraries.data,
    rentals: rentals.data,
  };
}