import { Rental } from '@/types/rentals';
import { Destination } from '@/types/destination';
import { Homestay } from '@/types/homestay';
import { Event } from '@/types/event';
import { Thrill } from '@/types/thrill';
import { CafeAndRestaurant } from '@/types/cafeRestaurants';
import { Itinerary } from '@/types/itineraries';
import extractMatchFields from '@/lib/extractMatchFields';
import useInternalLinks from './useInternalLinks';

export default function useRelatedForRental(rental: Rental | null) {
  const { location, district } = extractMatchFields(rental);

  const commonParams = {
    sourceType: 'rentals',
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

  return {
    destinations: destinations.data,
    homestays: homestays.data,
    events: events.data,
    thrills: thrills.data,
    restaurants: restaurants.data,
    itineraries: itineraries.data,
  };
}
