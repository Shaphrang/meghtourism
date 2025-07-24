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
  const { location, district } = extractMatchFields(destination);

  const commonParams = {
    sourceType: 'destinations',
    location,
    district,
    limit: 10,
  };

  const homestays = useInternalLinks<Homestay>({
    ...commonParams,
    targetType: 'homestays',
  });

  const events = useInternalLinks<Event>({
    ...commonParams,
    targetType: 'events',
  });

  const thrills = useInternalLinks<Thrill>({
    ...commonParams,
    targetType: 'thrills',
  });

  const restaurants = useInternalLinks<CafeAndRestaurant>({
    ...commonParams,
    targetType: 'cafes_and_restaurants',
  });

  const itineraries = useInternalLinks<Itinerary>({
    ...commonParams,
    targetType: 'itineraries',
  });

  const rentals = useInternalLinks<Rental>({
    ...commonParams,
    targetType: 'rentals',
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
