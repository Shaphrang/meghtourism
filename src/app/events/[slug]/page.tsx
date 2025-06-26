// app/events/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Share2, MapPin, Calendar, Clock } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function EventDetailPage() {
  const { slug } = useParams();
  const [timeLeft, setTimeLeft] = useState("");

  // Static mock data for now
  const event = {
    name: "Shillong Cherry Blossom Festival",
    date: "2025-11-18",
    time: "12:00",
    location: "Polo Grounds, Shillong",
    entry: "Free Entry",
    tags: ["Music", "Cultural", "Food"],
    highlights: ["Live Music", "Fireworks", "Traditional Dance"],
    description:
      "The Shillong Cherry Blossom Festival celebrates nature, music, and culture with vibrant performances, food stalls, and floral beauty.",
    gallery: [
      "/images/events/cherry_blossom.jpg",
      "/images/events/cherry_blossom2.jpg",
      "/images/events/cherry_blossom3.jpg"
    ],
    reviews: [
      {
        user: "John Doe",
        date: "2024-11-20",
        rating: 5,
        comment: "Amazing vibe and crowd! Loved the music."
      },
      {
        user: "Priya Sharma",
        date: "2023-11-19",
        rating: 4,
        comment: "Beautiful setting, though a bit crowded."
      }
    ]
  };

  const attractions = [
    { id: 1, name: "Ward's Lake", image: "/images/places/wards_lake.jpg" },
    { id: 2, name: "Don Bosco Museum", image: "/images/places/don_bosco.jpg" },
    { id: 3, name: "Elephant Falls", image: "/images/places/elephant_falls.jpg" },
    { id: 4, name: "Laitlum Canyon", image: "/images/places/laitlum.jpg" },
    { id: 5, name: "Shillong View Point", image: "/images/places/shillong_view.jpg" }
  ];

  const homestays = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    name: `Homestay ${i + 1}`,
    price: 1200 + i * 100,
    location: "Shillong",
    image: "/images/homestays/sample.jpg"
  }));

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      const eventDate = new Date(`${event.date}T${event.time}`);
      const diff = eventDate.getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft("Event is Live or Completed");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${days}d ${hrs}h ${mins}m left`);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.name,
        url: window.location.href
      });
    } else {
      alert("Sharing not supported on this device");
    }
  };

  return (
    <main className="w-full min-h-screen bg-white text-gray-800">
      {/* Image Carousel */}
      <Swiper spaceBetween={10} slidesPerView={1.2} className="w-full h-64 md:h-96">
        {event.gallery.map((img, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full rounded-lg overflow-hidden">
            <Image src={img} alt="Event Banner" fill className="object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Event Info */}
      <section className="p-4">
        <h1 className="text-2xl font-bold text-blue-800">{event.name}</h1>
        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
          <Calendar size={16} /> {event.date} <Clock size={16} /> {event.time}
        </p>
        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
          <MapPin size={16} /> {event.location}
        </p>
        <p className="mt-1 text-sm text-green-700 font-medium">{event.entry}</p>
        {timeLeft && <p className="text-xs text-red-500 mt-1">⏳ {timeLeft}</p>}

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full shadow"
        >
          <Share2 size={16} /> Share Event
        </button>
      </section>

      {/* Highlights */}
      <section className="p-4">
        <h3 className="font-semibold mb-2">Event Highlights</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {event.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </section>

      {/* Description */}
      <section className="p-4">
        <h3 className="font-semibold mb-2">About the Event</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {event.description}
        </p>
      </section>

      {/* Nearby Attractions */}
      <section className="p-4">
        <h3 className="font-semibold mb-2">Nearby Attractions</h3>
        <div className="flex gap-3 overflow-x-auto">
          {attractions.map((a) => (
            <div key={a.id} className="min-w-[150px] rounded-xl shadow overflow-hidden">
              <div className="relative w-full h-24">
                <Image src={a.image} alt={a.name} fill className="object-cover" />
              </div>
              <p className="p-2 text-sm font-medium truncate">{a.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Homestays */}
      <section className="p-4">
        <h3 className="font-semibold mb-2">Nearby Homestays</h3>
        <div className="flex flex-col gap-3">
          {homestays.map((stay) => (
            <div key={stay.id} className="flex gap-3 bg-gray-50 rounded-xl shadow p-3">
              <div className="relative w-20 h-20 rounded-md overflow-hidden">
                <Image src={stay.image} alt={stay.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-sm">{stay.name}</p>
                <p className="text-xs text-gray-500">{stay.location}</p>
                <p className="text-green-700 text-sm">₹{stay.price}/night</p>
              </div>
            </div>
          ))}
          <button className="mt-2 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-full self-center">
            View All Homestays
          </button>
        </div>
      </section>

      {/* Reviews */}
      <section className="p-4">
        <h3 className="font-semibold mb-2">Guest Reviews</h3>
        {event.reviews.map((r, i) => (
          <div key={i} className="mb-2 border-b pb-2">
            <p className="text-sm font-medium">{r.user}</p>
            <p className="text-xs text-gray-400">{r.date}</p>
            <p className="text-sm">⭐ {r.rating} - {r.comment}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
