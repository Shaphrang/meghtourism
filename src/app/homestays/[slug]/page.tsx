import { useState } from 'react';
import { MapPin, Phone, Star } from 'lucide-react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function HomestayDetailPage() {
  const [showMore, setShowMore] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Image Carousel */}
      <Swiper
        spaceBetween={10}
        slidesPerView={1.2}
        className="w-full h-64 md:h-96"
      >
        {[1, 2, 3].map((_, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full rounded-lg overflow-hidden">
            <Image src={`/demo/homestay${idx + 1}.jpg`} alt="Homestay" fill className="object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Homestay Info */}
      <section className="p-4">
        <h1 className="text-2xl font-bold">Cozy Pine Homestay</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <MapPin size={16} />
          <span>Laitumkhrah, Shillong</span>
        </div>
        <p className="text-lg font-semibold text-green-600 mt-2">From ₹1200/night</p>
        <a href="tel:+919876543210" className="text-blue-600 text-sm mt-1 block">
          <Phone size={14} className="inline-block mr-1" /> +91 9876543210
        </a>
      </section>

      {/* Description */}
      <section className="p-4">
        <p className="text-sm text-gray-700">
          {showMore
            ? `Nestled in the heart of Shillong, Cozy Pine offers a warm, inviting experience with local hospitality and modern comfort. Enjoy fresh breakfast, serene views, and easy access to tourist spots.`
            : `Nestled in the heart of Shillong, Cozy Pine offers a warm...`}
        </p>
        <button onClick={() => setShowMore(!showMore)} className="text-blue-500 text-xs mt-1">
          {showMore ? 'Show less' : 'Show more'}
        </button>
      </section>

      {/* Room Info Card */}
      <section className="px-4 pb-4">
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold">Deluxe Room</h2>
          <p className="text-sm text-gray-600">Spacious room with balcony and attached bath</p>
          <p className="text-green-600 font-medium mt-1">₹1600/night</p>
        </div>
      </section>

      {/* Amenities */}
      <section className="p-4">
        <h3 className="text-base font-semibold mb-2">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {["WiFi", "Hot Water", "Breakfast", "Parking", "TV"].map((item) => (
            <span key={item} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Nearby Attractions */}
      <section className="p-4">
        <h3 className="text-base font-semibold mb-2">Nearby Attractions</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[160px] bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-24 relative">
                <Image src={`/demo/attraction${i}.jpg`} alt="Attraction" fill className="object-cover" />
              </div>
              <div className="p-2">
                <p className="text-sm font-medium">Elephant Falls</p>
                <p className="text-xs text-gray-500">5 km away</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Similar Stays */}
      <section className="p-4">
        <h3 className="text-base font-semibold mb-2">Similar Stays</h3>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 bg-gray-50 rounded-lg p-3 shadow-sm">
              <div className="relative w-20 h-20 rounded-md overflow-hidden">
                <Image src={`/demo/stay${i}.jpg`} alt="Stay" fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-semibold">Pine Breeze Inn</p>
                <p className="text-sm text-gray-500">Police Bazar</p>
                <p className="text-green-600 text-sm">₹1400/night</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="p-4">
        <h3 className="text-base font-semibold mb-2">Guest Reviews</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">John D.</p>
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">March 2025</p>
            <p className="text-sm mt-1">Wonderful stay! The host was very welcoming and the room was neat and clean.</p>
          </div>
        ))}
        <button className="text-blue-500 text-sm mt-2">View All Reviews</button>
      </section>
    </main>
  );
}
