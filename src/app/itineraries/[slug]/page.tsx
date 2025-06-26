"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";

const itinerary = {
  title: "5-Day Scenic Meghalaya Tour",
  duration: "5 Days / 4 Nights",
  theme: "Nature & Adventure",
  startPoint: "Guwahati",
  bestSeason: "October to March",
  image: "/images/itineraries/meghalaya_tour.jpg",
  days: [
    {
      day: "Day 1",
      location: "Shillong Arrival & Sightseeing",
      activities: [
        "Visit Umiam Lake",
        "Ward's Lake walk",
        "Evening at Police Bazaar"
      ]
    },
    {
      day: "Day 2",
      location: "Mawlynnong & Dawki",
      activities: [
        "Cleanest village tour",
        "Living Root Bridge",
        "Boating in Dawki River"
      ]
    },
    {
      day: "Day 3",
      location: "Cherrapunji Excursion",
      activities: [
        "Nohkalikai Falls",
        "Mawsmai Caves",
        "Eco Park"
      ]
    },
    {
      day: "Day 4",
      location: "Laitlum & Sacred Groves",
      activities: [
        "Laitlum Canyon hike",
        "Mawphlang Sacred Grove exploration"
      ]
    },
    {
      day: "Day 5",
      location: "Shillong Local & Departure",
      activities: [
        "Cathedral visit",
        "Handicraft shopping",
        "Transfer to Guwahati"
      ]
    }
  ],
  tips: [
    "Carry rain gear and sturdy shoes",
    "Respect local traditions and sacred spots",
    "Keep cash for remote area expenses"
  ],
  reviews: [
    {
      name: "Rohit S.",
      date: "Feb 2024",
      comment: "Well-planned and scenic itinerary. Loved Dawki and Cherrapunji."
    },
    {
      name: "Anita R.",
      date: "Nov 2023",
      comment: "Perfect for families. Every day was exciting and memorable."
    }
  ]
};

export default function ItineraryDetailPage() {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="relative w-full h-52 md:h-72">
        <Image src={itinerary.image} alt="Itinerary Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-end p-4">
          <h1 className="text-white text-xl md:text-3xl font-bold">
            {itinerary.title}
          </h1>
        </div>
      </section>

      {/* Meta Info */}
      <section className="p-4">
        <p className="text-sm text-gray-600">{itinerary.duration} • {itinerary.theme}</p>
        <p className="text-sm text-gray-500">Start: {itinerary.startPoint} • Best Season: {itinerary.bestSeason}</p>
        <button className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600">
          <Share2 size={16} /> Share Plan
        </button>
      </section>

      {/* Day-wise Plan */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Day-wise Plan</h2>
        <div className="flex flex-col gap-3">
          {itinerary.days.map((day, index) => (
            <div key={index} className="bg-gray-50 rounded-xl shadow p-4">
              <button
                onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                className="flex items-center justify-between w-full"
              >
                <span className="font-semibold">{day.day}: {day.location}</span>
                {expandedDay === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedDay === index && (
                <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                  {day.activities.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Travel Tips</h2>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {itinerary.tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </section>

      {/* Reviews */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Traveler Reviews</h2>
        {itinerary.reviews.map((rev, i) => (
          <div key={i} className="mb-3">
            <p className="text-sm font-medium">{rev.name} <span className="text-xs text-gray-500">({rev.date})</span></p>
            <p className="text-sm text-gray-700">{rev.comment}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
