"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const topAdventures = [
  {
    id: "living_root_bridge",
    name: "Living Root Bridge Trek",
    type: "Trekking",
    region: "Cherrapunji",
    duration: "3 hrs",
    cost: "₹500",
    tags: ["Beginner-Friendly"],
    image: "/images/thrills/root_bridge.jpg"
  },
  {
    id: "dawki_boating",
    name: "Boating in Dawki",
    type: "Boating",
    region: "Dawki",
    duration: "1 hr",
    cost: "₹400",
    tags: ["Scenic", "Family-Friendly"],
    image: "/images/thrills/dawki_boating.jpg"
  },
  {
    id: "mawkdok_zipline",
    name: "Mawkdok Ziplining",
    type: "Ziplining",
    region: "Mawkdok",
    duration: "30 min",
    cost: "₹800",
    tags: ["High Altitude"],
    image: "/images/thrills/zipline.jpg"
  }
];

const allActivities = [
  {
    id: "siju_cave",
    name: "Siju Cave Exploration",
    type: "Caving",
    region: "South Garo Hills",
    duration: "2 hrs",
    cost: "₹600",
    tags: ["Adventure", "Flashlight Needed"],
    image: "/images/thrills/siju_cave.jpg"
  },
  {
    id: "nohkalikai_trail",
    name: "Nohkalikai Viewpoint Trail",
    type: "Hiking",
    region: "Cherrapunji",
    duration: "1.5 hrs",
    cost: "Free",
    tags: ["Nature Walk"],
    image: "/images/thrills/nohkalikai_trail.jpg"
  },
  {
    id: "umiam_kayaking",
    name: "Kayaking in Umiam Lake",
    type: "Kayaking",
    region: "Umiam",
    duration: "1 hr",
    cost: "₹300",
    tags: ["Calm Waters"],
    image: "/images/thrills/umiam_kayak.jpg"
  }
];

export default function ThrillsListingPage() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      <section className="bg-gradient-to-r from-yellow-100 to-green-100 p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Experience the Thrill of Meghalaya</h1>
      </section>

      {/* Filter Bar */}
      <section className="p-4 flex flex-wrap justify-center gap-3">
        <button className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">Sort by Difficulty</button>
        <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Filter by Type</button>
        <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Filter by Region</button>
      </section>

      {/* Top Adventures */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Top Adventures</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {topAdventures.map((activity) => (
            <div key={activity.id} className="min-w-[200px] bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-32 relative">
                <Image src={activity.image} alt={activity.name} fill className="object-cover" />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{activity.name}</h3>
                <p className="text-xs text-gray-500">📍 {activity.region}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Activities */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">All Activities</h2>
        <div className="flex flex-col gap-4">
          {allActivities.map((a) => (
            <div key={a.id} className="bg-gray-50 rounded-xl shadow-sm overflow-hidden">
              <div className="h-40 relative">
                <Image src={a.image} alt={a.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{a.name}</h3>
                <p className="text-sm text-gray-600">📍 {a.region}</p>
                <p className="text-sm text-gray-600">🕒 {a.duration} 💰 {a.cost}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {a.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <button className="mt-3 text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-full">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
