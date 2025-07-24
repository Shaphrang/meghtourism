import { Thrill } from '@/types/thrill';
import { Destination } from '@/types/destination';
import { Homestay } from '@/types/homestay';
import { Event } from '@/types/event';
import { CafeAndRestaurant } from '@/types/cafeRestaurants';
import { Itinerary } from '@/types/itineraries';
import { Rental } from '@/types/rentals';
import extractMatchFields from '@/lib/extractMatchFields';
import useInternalLinks from './useInternalLinks';

export default function useRelatedForThrill(thrill: Thrill | null) {
  const { location, district } = extractMatchFields(thrill);

  const commonParams = {
    sourceType: 'thrills',
    location,
    district,
    limit: 10,
  };

  const nearbyThrills = useInternalLinks<Thrill>({
    ...commonParams,
    targetType: 'thrills',
    excludeId: thrill?.id,
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
    nearbyThrills: nearbyThrills.data,
    destinations: destinations.data,
    homestays: homestays.data,
    events: events.data,
    restaurants: restaurants.data,
    itineraries: itineraries.data,
    rentals: rentals.data,
  };
}
