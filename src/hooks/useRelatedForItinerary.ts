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
  const { location, district } = extractMatchFields(itinerary);

  const commonParams = {
    sourceType: 'itineraries',
    location,
    district,
    limit: 10,
  };

  const nearbyItineraries = useInternalLinks<Itinerary>({
    ...commonParams,
    targetType: 'itineraries',
    excludeId: itinerary?.id,
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

  const restaurants = useInternalLinks<CafeAndRestaurant>({
    ...commonParams,
    targetType: 'cafes_and_restaurants',
  });

  const rentals = useInternalLinks<Rental>({
    ...commonParams,
    targetType: 'rentals',
  });

  return {
    nearbyItineraries: nearbyItineraries.data,
    destinations: destinations.data,
    homestays: homestays.data,
    events: events.data,
    thrills: thrills.data,
    restaurants: restaurants.data,
    rentals: rentals.data,
  };
}
