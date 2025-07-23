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
  const { location, district, tags } = extractMatchFields(thrill);

  const destinations = useInternalLinks<Destination>({
    sourceType: 'thrills',
    targetType: 'destinations',
    location,
    district,
    tags,
  });

  const homestays = useInternalLinks<Homestay>({
    sourceType: 'thrills',
    targetType: 'homestays',
    location,
    district,
    tags,
  });

  const events = useInternalLinks<Event>({
    sourceType: 'thrills',
    targetType: 'events',
    location,
    district,
    tags,
  });

  const restaurants = useInternalLinks<CafeAndRestaurant>({
    sourceType: 'thrills',
    targetType: 'cafesRestaurants',
    location,
    district,
    tags,
  });

  const itineraries = useInternalLinks<Itinerary>({
    sourceType: 'thrills',
    targetType: 'itineraries',
    location,
    district,
    tags,
  });

  const rentals = useInternalLinks<Rental>({
    sourceType: 'thrills',
    targetType: 'rentals',
    location,
    district,
    tags,
  });

  return {
    destinations: destinations.data,
    homestays: homestays.data,
    events: events.data,
    restaurants: restaurants.data,
    itineraries: itineraries.data,
    rentals: rentals.data,
  };
}