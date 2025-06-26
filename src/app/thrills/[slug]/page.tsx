"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Share2, Star, Clock, BadgeCheck } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const sampleThrill = {
  name: "Ziplining Over Mawkdok Valley",
  location: "Mawkdok, East Khasi Hills",
  cost: 600,
  duration: "2 hours",
  difficulty: "Beginner",
  description:
    "Experience the thrill of flying over lush green valleys with one of the longest ziplines in Northeast India. Perfect for adventure seekers of all ages!",
  highlights: [
    "Scenic valley views",
    "Certified safety gear",
    "Photos & videos included",
    "Professional instructors"
  ],
  amenities: ["Safety Gear", "Photography", "Washroom", "Snacks Available"],
  gallery: [
    "/images/thrills/zipline1.jpg",
    "/images/thrills/zipline2.jpg",
    "/images/thrills/zipline3.jpg"
  ],
  reviews: [
    {
      name: "Anika D.",
      rating: 5,
      comment: "Absolutely breathtaking! The staff was helpful and I felt safe the entire time.",
      date: "2025-04-10"
    },
    {
      name: "Rajiv M.",
      rating: 4,
      comment: "Loved it! Will come back with friends.",
      date: "2025-05-22"
    }
  ]
};

const nearbyAttractions = [
  { id: 1, name: "Mawkdok Viewpoint", image: "/images/attractions/viewpoint.jpg" },
  { id: 2, name: "Wah Kaba Falls", image: "/images/attractions/wah_kaba.jpg" },
  { id: 3, name: "Cherrapunji Eco Park", image: "/images/attractions/eco_park.jpg" }
];

const nearbyHomestays = [
  {
    id: 1,
    name: "Highland Nest Homestay",
    location: "Cherrapunji",
    price: 1200,
    image: "/images/stays/highland_nest.jpg"
  },
  {
    id: 2,
    name: "Valley View Lodge",
    location: "Mawkdok",
    price: 1500,
    image: "/images/stays/valley_view.jpg"
  }
];

export default function ThrillDetailPage() {
  return (
    <main className="bg-white text-gray-800 w-full min-h-screen">
      {/* Carousel */}
      <Swiper spaceBetween={10} slidesPerView={1.1} className="w-full h-64 md:h-96">
        {sampleThrill.gallery.map((img, idx) => (
          <SwiperSlide key={idx} className="relative rounded-xl overflow-hidden">
            <Image src={img} alt="Adventure" fill className="object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Info */}
      <section className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">{sampleThrill.name}</h1>
          <button className="text-blue-600">
            <Share2 size={20} />
          </button>
        </div>
        <p className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <MapPin size={16} /> {sampleThrill.location}
        </p>
        <p className="text-green-700 font-semibold text-lg mt-2">
          ₹{sampleThrill.cost}/person
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <Clock size={14} className="inline mr-1" /> Duration: {sampleThrill.duration}
        </p>
        <span className="text-xs inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full mt-2">
          Difficulty: {sampleThrill.difficulty}
        </span>
      </section>

      {/* Highlights */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Highlights</h2>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {sampleThrill.highlights.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Amenities */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Facilities & Inclusions</h2>
        <div className="flex flex-wrap gap-2">
          {sampleThrill.amenities.map((a, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full"
            >
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Reviews</h2>
        {sampleThrill.reviews.map((rev, i) => (
          <div key={i} className="mb-3">
            <p className="font-semibold text-sm text-gray-800">{rev.name}</p>
            <p className="text-xs text-gray-500">{rev.date}</p>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: rev.rating }, (_, idx) => (
                <Star key={idx} size={14} className="text-yellow-500 fill-yellow-300" />
              ))}
            </div>
            <p className="text-sm text-gray-700 mt-1">{rev.comment}</p>
          </div>
        ))}
      </section>

      {/* Nearby Attractions */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-2">Nearby Attractions</h2>
        <div className="flex gap-4 overflow-x-auto">
          {nearbyAttractions.map((a) => (
            <div key={a.id} className="min-w-[140px] bg-white rounded-lg shadow">
              <div className="h-24 relative">
                <Image src={a.image} alt={a.name} fill className="object-cover rounded-t-lg" />
              </div>
              <div className="p-2">
                <p className="text-sm font-medium truncate">{a.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Stays */}
      <section className="p-4 pb-8">
        <h2 className="text-lg font-semibold mb-2">Nearby Homestays</h2>
        <div className="flex flex-col gap-3">
          {nearbyHomestays.map((stay) => (
            <div key={stay.id} className="flex gap-3 bg-gray-50 rounded-lg shadow p-3">
              <div className="w-20 h-20 relative rounded-md overflow-hidden">
                <Image src={stay.image} alt={stay.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-semibold text-sm">{stay.name}</p>
                <p className="text-xs text-gray-500">{stay.location}</p>
                <p className="text-green-600 text-sm">₹{stay.price}/night</p>
              </div>
            </div>
          ))}
          <button className="mt-2 text-sm text-blue-600 font-medium">View All Homestays</button>
        </div>
      </section>
    </main>
  );
}
