'use client';

{/*import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import HeroSection from '@/components/sections/heroSection';
import { DestinationsSection } from '@/components/sections/destinationsSection';
import { HomestaysSection } from '@/components/sections/homestaysSection';
import { EventsSection } from '@/components/sections/eventsSection';
import { ThrillsSection } from '@/components/sections/thrillsSection';

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Full-width, responsive layout 
      <main className="w-full px-2 sm:px-6 pt-16 pb-24 bg-white font-sans">
        <HeroSection />

        <section className="mt-4">
          <DestinationsSection />
        </section>

        <section className="mt-4">
          <HomestaysSection />
        </section>

        <section className="mt-4">
          <EventsSection />
        </section>

        <section className="mt-4">
          <ThrillsSection />
        </section>
      </main>

      <Footer />
    </>
  );
}*/}


import Image from 'next/image';

const mockDestinations = [
  { id: 1, name: 'Shillong Peak', district: 'East Khasi Hills', image: '/demo/shillong_peak.jpg' },
  { id: 2, name: 'Umiam Lake', district: 'Ri Bhoi', image: '/demo/umiam.jpg' },
  { id: 3, name: 'Laitlum Canyons', district: 'East Khasi Hills', image: '/demo/laitlum.jpg' },
  { id: 4, name: 'Mawsmai Cave', district: 'Sohra', image: '/demo/mawsmai.jpg' },
  { id: 5, name: 'Double Decker Bridge', district: 'Sohra', image: '/demo/doubledecker.jpg' },
];

const mockHomestays = [
  { id: 1, name: 'Pineview Homestay', price: 1800, description: 'Scenic views, peaceful stay', image: '/demo/homestay1.jpg' },
  { id: 2, name: 'Hilltop Retreat', price: 2500, description: 'Near waterfall, cozy rooms', image: '/demo/homestay2.jpg' },
  { id: 3, name: 'Nature Nest', price: 1600, description: 'Eco-friendly, clean', image: '/demo/homestay3.jpg' },
  { id: 4, name: 'Valley View', price: 2200, description: 'Great food, great view', image: '/demo/homestay4.jpg' },
  { id: 5, name: 'River Stay', price: 2000, description: 'Near river, quiet space', image: '/demo/homestay5.jpg' },
];

const mockEvents = [
  { id: 1, name: 'Cherry Blossom Fest', image: '/demo/event1.jpg' },
  { id: 2, name: 'Wangala Dance', image: '/demo/event2.jpg' },
  { id: 3, name: 'Monolith Festival', image: '/demo/event3.jpg' },
  { id: 4, name: 'Meghalaya Food Fest', image: '/demo/event4.jpg' },
  { id: 5, name: 'Music in the Hills', image: '/demo/event5.jpg' },
];

const mockCafes = [
  { id: 1, name: 'Cafe Shillong', type: 'Cafe', location: 'Shillong', image: '/demo/cafe1.jpg' },
  { id: 2, name: 'Dylans Cafe', type: 'Cafe', location: 'Shillong', image: '/demo/cafe2.jpg' },
  { id: 3, name: 'Bamboo Hut', type: 'Restaurant', location: 'Cherrapunji', image: '/demo/cafe3.jpg' },
  { id: 4, name: 'Highland Treats', type: 'Cafe', location: 'Mawlynnong', image: '/demo/cafe4.jpg' },
  { id: 5, name: 'Roots Eatery', type: 'Restaurant', location: 'Nongpoh', image: '/demo/cafe5.jpg' },
];

const mockBlogs = [
  { id: 1, title: 'Top 5 Waterfalls in Meghalaya', snippet: 'Explore the hidden waterfalls and their stories...', image: '/demo/blog1.jpg' },
  { id: 2, title: 'What to Eat in Shillong', snippet: 'Must-try street food and local cafes...', image: '/demo/blog2.jpg' },
  { id: 3, title: 'Adventure Trails Near Sohra', snippet: 'Hikes, caves and views...', image: '/demo/blog3.jpg' },
  { id: 4, title: 'Best Time to Visit Meghalaya', snippet: 'Seasonal tips for every traveler...', image: '/demo/blog4.jpg' },
  { id: 5, title: 'A Local’s Guide to Shillong', snippet: 'Insider tips from locals...', image: '/demo/blog5.jpg' },
];

export default function HomePage() {
  return (
    <main className="pb-28">
      {/* Hero Section */}
      <div className="relative h-72 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url('/demo/hero.jpg')` }}>
        <input
          type="text"
          placeholder="Ask Meghalaya..."
          className="w-11/12 max-w-md px-4 py-3 rounded-full shadow-md text-sm outline-none"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-around px-2 py-3 bg-white shadow sticky top-0 z-40">
        {['Destinations', 'Homestays', 'Events', 'Adventure'].map((tab) => (
          <button key={tab} className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
            {tab}
          </button>
        ))}
      </div>

      {/* Top Destinations */}
      <section className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-2">Top Destinations</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {mockDestinations.map((dest) => (
            <div key={dest.id} className="min-w-[160px] rounded-lg shadow bg-white">
              <img src={dest.image} alt={dest.name} className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-2">
                <p className="text-sm font-medium">{dest.name}</p>
                <p className="text-xs text-gray-500">{dest.district}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <div className="px-4">
        <img src="/demo/promo1.jpg" alt="Promo" className="rounded-xl w-full h-32 object-cover" />
      </div>

      {/* Homestays */}
      <section className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-2">Recommended Homestays</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {mockHomestays.map((stay) => (
            <div key={stay.id} className="min-w-[160px] rounded-lg shadow bg-white">
              <img src={stay.image} alt={stay.name} className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-2">
                <p className="text-sm font-medium">{stay.name}</p>
                <p className="text-xs text-gray-500">₹{stay.price}/night</p>
                <p className="text-xs text-gray-400 line-clamp-1">{stay.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {mockEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center">
              <img src={event.image} alt={event.name} className="w-16 h-16 object-cover rounded-full" />
              <p className="text-xs text-center mt-1 w-20 truncate">{event.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Second Promo */}
      <div className="px-4">
        <img src="/demo/promo2.jpg" alt="Promo 2" className="rounded-xl w-full h-32 object-cover" />
      </div>

      {/* Dine-In List */}
      <section className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-2">Dine-In Places</h2>
        <div className="flex flex-col gap-3">
          {mockCafes.map((cafe) => (
            <div key={cafe.id} className="flex gap-3 items-center bg-white p-3 rounded shadow">
              <img src={cafe.image} className="w-16 h-16 rounded object-cover" alt={cafe.name} />
              <div>
                <p className="text-sm font-medium">{cafe.name}</p>
                <p className="text-xs text-gray-500">{cafe.type} • {cafe.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blogs */}
      <section className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-2">Latest Blogs</h2>
        <div className="flex flex-col gap-3">
          {mockBlogs.map((blog) => (
            <div key={blog.id} className="flex gap-3 bg-white p-3 rounded shadow">
              <img src={blog.image} alt={blog.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex flex-col justify-between">
                <h3 className="text-sm font-semibold line-clamp-1">{blog.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{blog.snippet}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

