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
  const { location, district, tags } = extractMatchFields(rental);

  const destinations = useInternalLinks<Destination>({
    sourceType: 'rentals',
    targetType: 'destinations',
    location,
    district,
    tags,
  });

  const homestays = useInternalLinks<Homestay>({
    sourceType: 'rentals',
    targetType: 'homestays',
    location,
    district,
    tags,
  });

  const events = useInternalLinks<Event>({
    sourceType: 'rentals',
    targetType: 'events',
    location,
    district,
    tags,
  });

  const thrills = useInternalLinks<Thrill>({
    sourceType: 'rentals',
    targetType: 'thrills',
    location,
    district,
    tags,
  });

  const restaurants = useInternalLinks<CafeAndRestaurant>({
    sourceType: 'rentals',
    targetType: 'cafesRestaurants',
    location,
    district,
    tags,
  });

  const itineraries = useInternalLinks<Itinerary>({
    sourceType: 'rentals',
    targetType: 'itineraries',
    location,
    district,
    tags,
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