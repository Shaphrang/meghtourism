'use client';

import dynamic from 'next/dynamic';

const AdminDestinations = dynamic(() => import('./destinations/adminDestinations'));
const AdminHomestays = dynamic(() => import('./homestays/adminHomestays'));
const AdminEvents = dynamic(() => import('./events/adminEvents'));
const AdminThrills = dynamic(() => import('./thrills/adminThrills'));
const AdminBlogs = dynamic(() => import('./blogs/adminBlogs'));
const AdminTravelTips = dynamic(() => import('./travelTips/adminTravelTips'));
const AdminItineraries = dynamic(() => import('./itineraries/adminItineraries'));
const AdminRentals = dynamic(() => import('./rentals/adminRentals'));
const AdminCafeRestaurants = dynamic(() => import('./cafeRestaurants/adminCafeRestaurants'));
const AdminFaqs = dynamic(() => import('./faqs/adminFaqs'));

interface Props {
  active: string;
}

export default function ContentPanel({ active }: Props) {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {active === 'destinations' && <AdminDestinations />}
      {active === 'homestays' && <AdminHomestays />}
      {active === 'events' && <AdminEvents />}
      {active === 'thrills' && <AdminThrills />}
      {active === 'blogs' && <AdminBlogs />}
      {active === 'traveltips' && <AdminTravelTips />}
      {active === 'itineraries' && <AdminItineraries />}
      {active === 'rentals' && <AdminRentals />}
      {active === 'cafes_and_restaurants' && <AdminCafeRestaurants />}
      {active === 'faqs' && <AdminFaqs />}
    </div>
  );
}
