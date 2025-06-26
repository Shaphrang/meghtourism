"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const featuredEvents = [
  {
    id: "cherry_blossom_festival",
    name: "Shillong Cherry Blossom Festival",
    type: "Festival",
    location: "Shillong",
    date: "2025-11-18",
    time: "12:00",
    tags: ["Music", "Food", "Cultural"],
    highlights: ["Live music", "Food stalls", "Fireworks"],
    image: "/images/events/cherry_blossom.jpg"
  },
  {
    id: "meghalaya_monsoon_fest",
    name: "Meghalaya Monsoon Festival",
    type: "Cultural",
    location: "Cherrapunji",
    date: "2025-07-15",
    time: "10:00",
    tags: ["Rain", "Dance", "Nature"],
    highlights: ["Rainwalk", "Traditional Dance", "Eco Market"],
    image: "/images/events/monsoon_festival.jpg"
  },
  {
    id: "winter_music_fest",
    name: "Winter Indie Music Fest",
    type: "Music",
    location: "Shillong",
    date: "2025-12-20",
    time: "15:00",
    tags: ["Indie", "Live Band", "Outdoor"],
    highlights: ["Band performances", "Bonfire Night"],
    image: "/images/events/winter_music.jpg"
  },
  {
    id: "dawki_boat_festival",
    name: "Dawki River Boat Festival",
    type: "Local",
    location: "Dawki",
    date: "2025-09-05",
    time: "09:00",
    tags: ["Boating", "Cultural", "Family-friendly"],
    highlights: ["Boat parade", "Fishing competition"],
    image: "/images/events/dawki_boat.jpg"
  },
  {
    id: "khasi_folk_day",
    name: "Khasi Folk Music & Dance Day",
    type: "Cultural",
    location: "Nongstoin",
    date: "2025-08-10",
    time: "11:00",
    tags: ["Traditional", "Music", "Dance"],
    highlights: ["Khasi dances", "Ethnic food"],
    image: "/images/events/khasi_folk.jpg"
  }
];

const upcomingEvents = [
  {
    id: "nongkrem_dance_festival",
    name: "Nongkrem Dance Festival",
    type: "Cultural",
    location: "Smit",
    date: "2025-10-01",
    time: "13:00",
    quickInfo: ["Free Entry", "Cultural", "Family-friendly"],
    image: "/images/events/nongkrem.jpg"
  },
  {
    id: "mei_ramew_fair",
    name: "Mei-Ramew Farmers Market",
    type: "Local",
    location: "Mawkyrwat",
    date: "2025-08-25",
    time: "09:00",
    quickInfo: ["Free Entry", "Organic", "Local Crafts"],
    image: "/images/events/mei_ramew.jpg"
  },
  {
    id: "umsning_food_fest",
    name: "Umsning Food Fest",
    type: "Festival",
    location: "Ri-Bhoi",
    date: "2025-09-18",
    time: "10:30",
    quickInfo: ["Family-friendly", "Street Food", "Local Cuisines"],
    image: "/images/events/umsning_food.jpg"
  },
  {
    id: "shillong_heritage_walk",
    name: "Shillong Heritage Walk",
    type: "Local",
    location: "Shillong",
    date: "2025-07-30",
    time: "08:00",
    quickInfo: ["Guided", "Free Entry", "Photography Friendly"],
    image: "/images/events/heritage_walk.jpg"
  },
  {
    id: "jowai_blues_night",
    name: "Jowai Blues Night",
    type: "Music",
    location: "Jowai",
    date: "2025-08-12",
    time: "17:00",
    quickInfo: ["Live Music", "Limited Seats", "Outdoor"],
    image: "/images/events/jowai_blues.jpg"
  }
];

export default function EventsListingPage() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      <section className="bg-gradient-to-r from-blue-100 to-green-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">What’s Happening in Meghalaya?</h1>
      </section>

      {/* Filter Bar */}
      <section className="p-4 flex flex-wrap justify-center gap-3">
        <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Sort by Date</button>
        <button className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Filter by Type</button>
        <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Filter by District</button>
      </section>

      {/* Featured Events */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Featured Events</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {featuredEvents.map(event => (
            <div key={event.id} className="min-w-[200px] bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-32 relative">
                <Image src={event.image} alt={event.name} fill className="object-cover" />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{event.name}</h3>
                <p className="text-xs text-gray-500">{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
        <div className="flex flex-col gap-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="bg-gray-50 rounded-xl shadow-sm overflow-hidden">
              <div className="h-40 relative">
                <Image src={event.image} alt={event.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{event.name}</h3>
                <p className="text-sm text-gray-600">📅 {event.date} ⏰ {event.time}</p>
                <p className="text-sm text-gray-500">📍 {event.location}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {event.quickInfo?.map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <button className="mt-3 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-full">More Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
