"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Clock, Star, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const restaurant = {
  name: "Cafe Shillong Heights",
  cuisine: ["Khasi", "Chinese", "Continental"],
  address: "Laitumkhrah, Shillong, Meghalaya",
  contact: "9876543210",
  openHours: "10:00 AM - 10:00 PM",
  pricePerPerson: 250,
  tags: ["Accepts Cards", "Parking Available", "Vegetarian Friendly", "Scenic View"],
  amenities: ["Free WiFi", "Indoor Seating", "Live Music", "Pet Friendly"],
  menu: ["Smoked Pork Rice Bowl", "Jadoh Platter", "Veg Momos", "Cappuccino"],
  images: [
    "/images/restaurants/cafe1.jpg",
    "/images/restaurants/cafe2.jpg",
    "/images/restaurants/cafe3.jpg"
  ],
  reviews: [
    { name: "Arun", rating: 5, comment: "Amazing food and vibes!", date: "June 2025" },
    { name: "Rina", rating: 4, comment: "Loved the coffee and view.", date: "May 2025" }
  ]
};

const nearbyAttractions = [
  { name: "Ward's Lake", image: "/images/attractions/lake.jpg", distance: "1.2 km" },
  { name: "Police Bazar", image: "/images/attractions/market.jpg", distance: "2 km" }
];

const nearbyStays = [
  { name: "Highland Homestay", image: "/images/stays/stay1.jpg", price: 1200, location: "Laitumkhrah" },
  { name: "Pine Hill Cottage", image: "/images/stays/stay2.jpg", price: 1500, location: "Malki" }
];

export default function RestaurantDetailPage() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      {/* Image Carousel */}
      <Swiper spaceBetween={10} slidesPerView={1.2} className="w-full h-64">
        {restaurant.images.map((img, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full">
            <Image src={img} alt="Restaurant Image" fill className="object-cover rounded-lg" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Header */}
      <section className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-green-800">{restaurant.name}</h1>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MapPin size={14} className="mr-1" /> {restaurant.address}
            </p>
          </div>
          <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
            <Share2 size={14} className="mr-1" /> Share
          </button>
        </div>

        {/* Cuisine */}
        <div className="flex flex-wrap gap-2 mt-2">
          {restaurant.cuisine.map((c, i) => (
            <span key={i} className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              {c}
            </span>
          ))}
        </div>

        {/* Price + Hours + Contact */}
        <div className="mt-4 text-sm">
          <p className="text-lg font-semibold text-green-700">
            ₹{restaurant.pricePerPerson}/person
          </p>
          <p className="mt-1 text-gray-700 flex items-center">
            <Clock size={14} className="mr-1" /> {restaurant.openHours}
          </p>
          <a href={`tel:${restaurant.contact}`} className="block text-blue-700 mt-1">
            <Phone size={14} className="inline-block mr-1" /> {restaurant.contact.replace(/(\d{5})(\d{5})/, "$1xxxxx$2")}
          </a>
        </div>
      </section>

      {/* Tags & Amenities */}
      <section className="px-4 pb-4">
        <h2 className="font-semibold mb-1">Tags</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {restaurant.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 text-xs bg-blue-50 text-blue-800 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h2 className="font-semibold mb-1">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {restaurant.amenities.map((a, idx) => (
            <span key={idx} className="px-3 py-1 text-xs bg-green-50 text-green-800 rounded-full">
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="px-4 pb-4">
        <h2 className="font-semibold mb-1">Menu Highlights</h2>
        <ul className="list-disc ml-5 text-sm text-gray-700">
          {restaurant.menu.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Reviews */}
      <section className="px-4 pb-4">
        <h2 className="font-semibold mb-1">Reviews</h2>
        {restaurant.reviews.map((rev, idx) => (
          <div key={idx} className="bg-gray-50 p-3 rounded-lg shadow-sm mb-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">{rev.name}</p>
              <p className="flex items-center text-yellow-600">
                <Star size={14} className="mr-1" /> {rev.rating}
              </p>
            </div>
            <p className="text-sm text-gray-600">{rev.date}</p>
            <p className="text-sm mt-1">{rev.comment}</p>
          </div>
        ))}
      </section>

      {/* Nearby Attractions */}
      <section className="px-4 pb-4">
        <h2 className="font-semibold mb-2">Nearby Attractions</h2>
        <div className="flex gap-3 overflow-x-auto">
          {nearbyAttractions.map((a, idx) => (
            <div key={idx} className="min-w-[160px] rounded-lg shadow bg-white">
              <div className="h-24 relative">
                <Image src={a.image} alt={a.name} fill className="object-cover rounded-t-lg" />
              </div>
              <div className="p-2">
                <p className="font-medium text-sm">{a.name}</p>
                <p className="text-xs text-gray-500">{a.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Homestays */}
      <section className="px-4 pb-20">
        <h2 className="font-semibold mb-2">Nearby Stays</h2>
        <div className="flex flex-col gap-3">
          {nearbyStays.map((stay, idx) => (
            <div key={idx} className="flex gap-3 bg-gray-50 rounded-lg p-3 shadow-sm">
              <div className="w-20 h-20 relative">
                <Image src={stay.image} alt={stay.name} fill className="object-cover rounded-md" />
              </div>
              <div>
                <p className="font-semibold">{stay.name}</p>
                <p className="text-sm text-gray-500">{stay.location}</p>
                <p className="text-green-600 font-medium">₹{stay.price}/night</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full text-center text-sm text-blue-700 underline">View All Nearby Stays</button>
      </section>
    </main>
  );
}
