"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Phone, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const rental = {
  id: "classic_350",
  name: "Royal Enfield Classic 350",
  type: "Bike",
  price: 900,
  location: "Police Bazar, Shillong",
  status: "Available",
  imageGallery: [
    "/images/rentals/classic1.jpg",
    "/images/rentals/classic2.jpg",
    "/images/rentals/classic3.jpg"
  ],
  description:
    "Rent the legendary Royal Enfield Classic 350 to explore Meghalaya's winding roads and misty hills. Ideal for solo travelers or duos.",
  features: ["Helmet Included", "Pickup & Drop", "Insurance Covered"],
  policies: [
    "Minimum age: 18+",
    "Refundable deposit: ₹2000",
    "Valid Driving License required",
    "Free cancellation up to 24 hrs"
  ],
  reviews: [
    {
      name: "John D",
      date: "May 2025",
      rating: 5,
      comment: "Smooth experience! Bike was well maintained."
    },
    {
      name: "Anita R",
      date: "June 2025",
      rating: 4,
      comment: "Pickup was on time. Would rent again."
    }
  ]
};

export default function RentalDetailPage() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      {/* Image Carousel */}
      <Swiper spaceBetween={10} slidesPerView={1.1} className="w-full h-64">
        {rental.imageGallery.map((src, i) => (
          <SwiperSlide key={i} className="relative w-full h-full rounded-lg overflow-hidden">
            <Image src={src} alt={rental.name} fill className="object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Rental Info */}
      <section className="p-4">
        <h1 className="text-2xl font-bold mb-1">{rental.name}</h1>
        <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
          <MapPin size={14} /> {rental.location}
        </div>
        <p className="text-lg font-semibold text-green-600">₹{rental.price}/day</p>
        <p className="text-sm text-blue-700 font-medium mt-1">Status: {rental.status}</p>
      </section>

      {/* Description */}
      <section className="p-4">
        <p className="text-sm text-gray-700 leading-relaxed">{rental.description}</p>
      </section>

      {/* Features */}
      <section className="p-4">
        <h2 className="text-base font-semibold mb-2">What's Included</h2>
        <div className="flex flex-wrap gap-2">
          {rental.features.map((item, i) => (
            <span key={i} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Policies */}
      <section className="p-4">
        <h2 className="text-base font-semibold mb-2">Rental Policies</h2>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {rental.policies.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </section>

      {/* Reviews */}
      <section className="p-4">
        <h2 className="text-base font-semibold mb-2">Reviews</h2>
        <div className="flex flex-col gap-3">
          {rental.reviews.map((rev, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between">
                <p className="font-medium text-sm">{rev.name}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">{rev.date}</p>
              <p className="text-sm text-gray-700">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="p-4 sticky bottom-10 bg-white border-t shadow-inner">
        <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl text-center">
          Contact to Book
        </button>
      </div>
    </main>
  );
}
