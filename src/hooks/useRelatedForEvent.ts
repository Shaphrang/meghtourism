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
  const { location, district } = extractMatchFields(event);

  const commonParams = {
    sourceType: 'events',
    location,
    district,
    limit: 10,
  };

  const destinations = useInternalLinks<Destination>({
    ...commonParams,
    targetType: 'destinations',
  });

  const homestays = useInternalLinks<Homestay>({
    ...commonParams,
    targetType: 'homestays',
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
    destinations: destinations.data,
    homestays: homestays.data,
    thrills: thrills.data,
    restaurants: restaurants.data,
    itineraries: itineraries.data,
    rentals: rentals.data,
  };
}
