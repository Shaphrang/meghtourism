"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

const popularRestaurants = [
  {
    id: "cafe_shillong",
    name: "Cafe Shillong",
    cuisine: ["Khasi", "Continental"],
    location: "Shillong",
    rating: 4.5,
    image: "/images/restaurants/cafe_shillong.jpg"
  },
  {
    id: "mawkyrwat_dhaba",
    name: "Mawkyrwat Dhaba",
    cuisine: ["Local", "Veg"],
    location: "Mawkyrwat",
    rating: 4.2,
    image: "/images/restaurants/mawkyrwat_dhaba.jpg"
  },
  {
    id: "cherrapunji_eats",
    name: "Cherrapunji Eats",
    cuisine: ["Chinese", "Non-Veg"],
    location: "Cherrapunji",
    rating: 4.7,
    image: "/images/restaurants/cherrapunji_eats.jpg"
  }
];

const allRestaurants = [
  ...popularRestaurants,
  {
    id: "ri_bhoi_cafe",
    name: "Ri-Bhoi Cafe",
    cuisine: ["Khasi", "Cafe"],
    location: "Ri-Bhoi",
    rating: 4.3,
    image: "/images/restaurants/ri_bhoi_cafe.jpg"
  },
  {
    id: "nartiang_taste",
    name: "Nartiang Taste",
    cuisine: ["Local", "Veg", "Khasi"],
    location: "Jaintia Hills",
    rating: 4.1,
    image: "/images/restaurants/nartiang_taste.jpg"
  }
];

export default function RestaurantsListingPage() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      <section className="bg-gradient-to-r from-pink-100 to-yellow-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-pink-800">Dine in Meghalaya</h1>
      </section>

      {/* Filter Bar */}
      <section className="p-4 flex flex-wrap justify-center gap-3">
        <button className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">Sort by Price</button>
        <button className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Filter by Cuisine</button>
        <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Filter by Location</button>
      </section>

      {/* Popular Restaurants */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Popular Restaurants</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {popularRestaurants.map(rest => (
            <div key={rest.id} className="min-w-[180px] bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-32 relative">
                <Image src={rest.image} alt={rest.name} fill className="object-cover" />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{rest.name}</h3>
                <p className="text-xs text-gray-500 flex items-center">
                  <MapPin size={12} className="mr-1" /> {rest.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Restaurants (Vertical Cards) */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Explore More Restaurants</h2>
        <div className="flex flex-col gap-3">
          {allRestaurants.map(rest => (
            <div key={rest.id} className="flex items-center bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative w-24 h-24 bg-gray-100">
                <Image src={rest.image} alt={rest.name} fill className="object-cover" />
              </div>
              <div className="flex-1 p-3">
                <h3 className="text-base font-semibold">{rest.name}</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin size={14} className="mr-1" /> {rest.location}
                </p>
                <div className="mt-1 flex flex-wrap gap-1 text-xs">
                  {rest.cuisine?.map((c, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
