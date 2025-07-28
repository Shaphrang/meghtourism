'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// 👇 Carousel card data (you can move this to a separate file if needed)
const carousels = {
  homepage: [
    {
      id: 1,
      title: 'Cherry Blossom Festival 2025 🌸',
      description: 'Shillong turns pink this November. Book your trip now!',
      bgColor: 'bg-pink-100',
    },
    {
      id: 2,
      title: 'Homestay Deals – Save 20% 🎉',
      description: 'Book early and enjoy discounts on selected stays.',
      bgColor: 'bg-orange-100',
    },
    {
      id: 3,
      title: 'What’s Happening This Week? 🎶',
      description: 'Live music, tribal festivals & art fairs around you.',
      bgColor: 'bg-purple-100',
    },
    {
      id: 4,
      title: 'Taste Meghalaya 🍽️',
      description: 'Discover local cafés and food you’ve never tried.',
      bgColor: 'bg-green-100',
    },
    {
      id: 5,
      title: 'Plan Your Meghalaya Trip with AI 🤖',
      description: 'Our smart assistant builds your perfect itinerary – free!',
      bgColor: 'bg-blue-100',
    },
  ],
  destinations: [
    {
      id: 6,
      title: 'Top 10 Must-Visit Spots 📍',
      description: 'Handpicked scenic places you shouldn’t miss.',
      bgColor: 'bg-yellow-100',
    },
    {
      id: 7,
      title: 'Scenic Road Trips 🚗',
      description: 'Plan routes from Shillong or Guwahati.',
      bgColor: 'bg-sky-100',
    },
    {
      id: 8,
      title: 'Live Map & Travel Tips 🗺️',
      description: 'Directions, do’s and don’ts, best timings.',
      bgColor: 'bg-gray-100',
    },
    {
      id: 9,
      title: 'Custom Itineraries 🧭',
      description: '3 to 7-day Meghalaya plans, ready to go.',
      bgColor: 'bg-teal-100',
    },
    {
      id: 10,
      title: 'Quick Weekend Getaways 🏞️',
      description: 'Places you can cover in just 2–3 days.',
      bgColor: 'bg-lime-100',
    },
  ],
  homestays: [
    {
      id: 11,
      title: 'Book Early & Save 💸',
      description: 'Early bird discounts on peaceful stays.',
      bgColor: 'bg-orange-50',
    },
    {
      id: 12,
      title: 'Stay Like a Local 🏡',
      description: 'Experience Khasi culture & comfort.',
      bgColor: 'bg-amber-100',
    },
    {
      id: 13,
      title: 'Verified Comfort Stays ✅',
      description: 'Reviewed and trusted by real travelers.',
      bgColor: 'bg-green-50',
    },
    {
      id: 14,
      title: 'Offbeat Homestays 🏕️',
      description: 'Hidden stays in remote scenic villages.',
      bgColor: 'bg-slate-100',
    },
    {
      id: 15,
      title: 'Speak Directly with Owners 📞',
      description: 'No middlemen – clear answers, real people.',
      bgColor: 'bg-blue-50',
    },
  ],
  events: [
    {
      id: 16,
      title: 'Cherry Blossom Festival 🌸',
      description: 'Don’t miss Shillong’s pink season in Nov!',
      bgColor: 'bg-pink-50',
    },
    {
      id: 17,
      title: 'This Week’s Highlights 🥁',
      description: 'Live shows, workshops, and cultural meets.',
      bgColor: 'bg-indigo-100',
    },
    {
      id: 18,
      title: 'Celebrate With Locals 🪘',
      description: 'Tribal festivals and traditional parades.',
      bgColor: 'bg-rose-100',
    },
    {
      id: 19,
      title: 'Plan Festival Stay in Advance 🛏️',
      description: 'Find top homestays near event venues.',
      bgColor: 'bg-violet-100',
    },
    {
      id: 20,
      title: 'Promote Your Event 🚀',
      description: 'Get featured across the site. It’s free!',
      bgColor: 'bg-yellow-50',
    },
  ],
  business: [
    {
      id: 21,
      title: 'List Your Business for Free 📣',
      description: 'Get discovered by 1,000+ travelers every month.',
      bgColor: 'bg-slate-50',
    },
    {
      id: 22,
      title: 'Become a Verified Listing ✅',
      description: 'Trusted listings = more bookings.',
      bgColor: 'bg-zinc-100',
    },
    {
      id: 23,
      title: 'Get Featured on the Homepage ⭐',
      description: 'Boost your visibility with banner placements.',
      bgColor: 'bg-yellow-100',
    },
    {
      id: 24,
      title: 'Tourists Are Already Searching 🔍',
      description: 'Join now and get found easily.',
      bgColor: 'bg-neutral-100',
    },
    {
      id: 25,
      title: 'We Promote. You Grow. 📈',
      description: 'Focus on service. Let us handle visibility.',
      bgColor: 'bg-blue-50',
    },
  ],
};

// 👇 Dynamic carousel rendering
export default function CarouselBanner({ id }: { id: keyof typeof carousels }) {
  const cards = carousels[id];

  if (!cards) return null;

  return (
    <section className="w-full my-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full h-[120px] sm:h-[130px] md:h-[160px]"
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id}>
            <div
              className={`flex flex-col justify-center items-center text-center w-full h-full px-4 rounded-xl shadow-md ${card.bgColor}`}
            >
              <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-0.5 leading-tight line-clamp-1">
                {card.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-tight line-clamp-2">
                {card.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
