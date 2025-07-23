import { Homestay } from '@/types/homestay';
import { Destination } from '@/types/destination';
import { Event } from '@/types/event';
import { Thrill } from '@/types/thrill';
import { CafeAndRestaurant } from '@/types/cafeRestaurants';
import { Itinerary } from '@/types/itineraries';
import { Rental } from '@/types/rentals';
import extractMatchFields from '@/lib/extractMatchFields';
import useInternalLinks from './useInternalLinks';
import useSupabaseNearby from './useSupabaseNearby';

export default function useRelatedForHomestay(homestay: Homestay | null) {
  const { location, district } = extractMatchFields(homestay);

  const commonParams = {
    sourceType: 'homestays',
    location,
    district,
    limit: 10,
  };

  const destinations = useInternalLinks<Destination>({
    ...commonParams,
    targetType: 'destinations',
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

  // Add nearby homestays (excluding the current one by id or slug)
  const nearbyHomestays = useSupabaseNearby<Homestay>(
    'homestays',
    location,
    homestay?.id || homestay?.slug || undefined,
    4
  );

  return {
    destinations: destinations.data,
    events: events.data,
    thrills: thrills.data,
    restaurants: restaurants.data,
    itineraries: itineraries.data,
    rentals: rentals.data,
    nearbyHomestays: nearbyHomestays.data,
  };
}
