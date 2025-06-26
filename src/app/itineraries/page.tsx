"use client";

import Image from "next/image";

const itineraries = [
  {
    id: "meghalaya_3_day_family",
    name: "3-Day Family Trip to Shillong & Cherrapunji",
    duration: "3 Days",
    theme: ["Family Trip", "Nature"],
    startPoint: "Guwahati",
    summary: "Covers key family-friendly spots in Shillong, Cherrapunji, and nearby.",
    image: "/images/itineraries/family_trip.jpg"
  },
  {
    id: "meghalaya_5_day_offbeat",
    name: "5-Day Offbeat Meghalaya Explorer",
    duration: "5 Days",
    theme: ["Offbeat", "Adventure"],
    startPoint: "Shillong",
    summary: "Trek, explore hidden waterfalls, and live like a local.",
    image: "/images/itineraries/offbeat_explorer.jpg"
  },
  {
    id: "budget_4_day_trip",
    name: "4-Day Budget Adventure Itinerary",
    duration: "4 Days",
    theme: ["Budget-friendly", "Solo Trip"],
    startPoint: "Guwahati",
    summary: "Covers Shillong, Mawlynnong, Dawki with cost-conscious tips.",
    image: "/images/itineraries/budget_adventure.jpg"
  },
  {
    id: "luxury_7_day_trip",
    name: "7-Day Luxury Trip to Meghalaya",
    duration: "7 Days",
    theme: ["Luxury", "Relaxation"],
    startPoint: "Shillong",
    summary: "Premium stays, spa, and curated experiences across Meghalaya.",
    image: "/images/itineraries/luxury_trip.jpg"
  }
];

export default function ItinerariesListingPage() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      <section className="bg-gradient-to-r from-yellow-100 to-pink-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-800">
          Ready-Made Meghalaya Travel Plans
        </h1>
      </section>

      {/* Filter Bar */}
      <section className="p-4 flex flex-wrap justify-center gap-3">
        <button className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
          Sort by Duration
        </button>
        <button className="px-4 py-2 bg-pink-200 text-pink-800 rounded-full text-sm font-medium">
          Filter by Theme
        </button>
        <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Filter by Start Point
        </button>
      </section>

      {/* All Itineraries */}
      <section className="p-4">
        <div className="flex flex-col gap-4">
          {itineraries.map((trip) => (
            <div
              key={trip.id}
              className="bg-gray-50 rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-40 relative">
                <Image
                  src={trip.image}
                  alt={trip.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{trip.name}</h3>
                <p className="text-sm text-gray-600">
                  Duration: {trip.duration} | Start: {trip.startPoint}
                </p>
                <p className="text-sm text-gray-600 mt-1">{trip.summary}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {trip.theme.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-sm font-medium text-white bg-yellow-600 px-4 py-2 rounded-full">
                    View Full Itinerary
                  </button>
                  <button className="text-sm font-medium text-yellow-700 border border-yellow-600 px-4 py-2 rounded-full">
                    Customize This Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
