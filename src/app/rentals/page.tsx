"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

const popularRentals = [
  {
    id: "shillong_bike_rental",
    type: "Bike",
    location: "Shillong",
    price: 500,
    availability: "Available",
    image: "/images/rentals/bike1.jpg"
  },
  {
    id: "cherrapunji_car_rental",
    type: "Car",
    location: "Cherrapunji",
    price: 1500,
    availability: "Available",
    image: "/images/rentals/car1.jpg"
  },
  {
    id: "dawki_taxi_rental",
    type: "Taxi",
    location: "Dawki",
    price: 1000,
    availability: "Booked",
    image: "/images/rentals/taxi1.jpg"
  },
  {
    id: "gear_rental_shillong",
    type: "Gear",
    location: "Shillong",
    price: 300,
    availability: "Available",
    image: "/images/rentals/gear1.jpg"
  }
];

const availableRentals = [...popularRentals];

export default function RentalsListingPage() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      <section className="bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Rent Bikes, Cars, or Gear in Meghalaya</h1>
      </section>

      {/* Filter Bar */}
      <section className="p-4 flex flex-wrap justify-center gap-3">
        <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Sort by Price</button>
        <button className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Filter by Type</button>
        <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Pickup Location</button>
      </section>

      {/* Popular Rentals */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Popular Rentals</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {popularRentals.map(rental => (
            <div key={rental.id} className="min-w-[180px] bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-32 relative">
                <Image src={rental.image} alt={rental.type} fill className="object-cover" />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{rental.type}</h3>
                <p className="text-xs text-gray-500 flex items-center">
                  <MapPin size={12} className="mr-1" /> {rental.location}
                </p>
                <p className="text-sm font-bold text-green-700">₹{rental.price}/day</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available Rentals (Vertical Cards) */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Available Rentals</h2>
        <div className="flex flex-col gap-3">
          {availableRentals.map(rental => (
            <div key={rental.id} className="flex items-center bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative w-24 h-24 bg-gray-100">
                <Image src={rental.image} alt={rental.type} fill className="object-cover" />
              </div>
              <div className="flex-1 p-3">
                <h3 className="text-base font-semibold">{rental.type} Rental</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin size={14} className="mr-1" /> {rental.location}
                </p>
                <p className="text-sm text-gray-600">Status: {rental.availability}</p>
                <p className="text-green-600 text-sm font-medium mt-1">₹{rental.price}/day</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
