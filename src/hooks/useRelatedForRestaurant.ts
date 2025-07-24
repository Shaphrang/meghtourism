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
  const { location, district } = extractMatchFields(restaurant);

  const commonParams = {
    sourceType: 'cafes_and_restaurants',
    location,
    district,
    limit: 10,
  };

  const nearbyRestaurants = useInternalLinks<CafeAndRestaurant>({
    ...commonParams,
    targetType: 'cafes_and_restaurants',
    excludeId: restaurant?.id,
  });

  const destinations = useInternalLinks<Destination>({
    ...commonParams,
    targetType: 'destinations',
  });

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

  const itineraries = useInternalLinks<Itinerary>({
    ...commonParams,
    targetType: 'itineraries',
  });

  const rentals = useInternalLinks<Rental>({
    ...commonParams,
    targetType: 'rentals',
  });

  return {
    nearbyRestaurants: nearbyRestaurants.data,
    destinations: destinations.data,
    homestays: homestays.data,
    events: events.data,
    thrills: thrills.data,
    itineraries: itineraries.data,
    rentals: rentals.data,
  };
}
