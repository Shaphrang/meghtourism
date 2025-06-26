'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const bannerCards = [
  {
    title: 'Book Early & Save!',
    description: 'Get up to 20% off on selected homestays.',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Local Experiences',
    description: 'Book guided tours and adventure packages.',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Taste Meghalaya',
    description: 'Explore top-rated cafés and restaurants.',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Festive Season Deals',
    description: 'Cherry Blossom Festival offers inside.',
    bgColor: 'bg-pink-100',
  },
  {
    title: 'Plan with AI',
    description: 'Try our smart trip designer – it’s free!',
    bgColor: 'bg-yellow-100',
  },
];

export default function CarouselBanner() {
  return (
    <section className="w-full mt-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full h-40"
      >
        {bannerCards.map((card, i) => (
          <SwiperSlide key={i} className="w-full h-full">
            <div
              className={`flex flex-col justify-center items-center text-center w-full h-full ${card.bgColor}`}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-700">{card.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}