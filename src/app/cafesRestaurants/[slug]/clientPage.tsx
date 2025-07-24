"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CafeAndRestaurant } from "@/types/cafeRestaurants";
import Image from "next/image";
import { MapPin, Phone, Clock } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import useRelatedForRestaurant from "@/hooks/useRelatedForRestaurant";
import HorizontalSection from "@/components/common/horizonatlSection";
import VerticalSection from "@/components/common/verticalSection";
import ReviewSection from "@/components/reviews/reviewSection";
import AverageRating from "@/components/reviews/averageRating";
import Head from "next/head";

export default function ClientPage() {
  const { slug } = useParams();
  const itemSlug = normalizeSlug(String(slug));
  const [cafe, setCafe] = useState<CafeAndRestaurant | null>(null);
  const related = useRelatedForRestaurant(cafe);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("cafes_and_restaurants")
        .select("*")
        .eq("slug", itemSlug)
        .single();
      setCafe(data);
    }
    fetchData();
  }, [itemSlug]);

  if (!cafe)
    return (
      <>
        <Head>
          <title>Loading Restaurant... | Meghtourism</title>
        </Head>
        <p className="p-4">Loading...</p>
      </>
    );

  const gallery = cafe.gallery?.length ? cafe.gallery : cafe.image ? [cafe.image] : [];

  const desc = cafe.description?.slice(0, 150) || "";
  const img = cafe.image || cafe.gallery?.[0] || "";

  return (
    <>
      <Head>
        <title>{cafe.name} | Meghtourism</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={`${cafe.name} | Meghtourism`} />
        <meta property="og:description" content={desc} />
        {img && <meta property="og:image" content={img} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${cafe.name} | Meghtourism`} />
        <meta name="twitter:description" content={desc} />
        {img && <meta name="twitter:image" content={img} />}
      </Head>

      <main className="bg-gradient-to-b from-orange-50 to-white w-full min-h-screen text-gray-800 pb-10">
      {/* Image Swiper */}
      <Swiper spaceBetween={10} slidesPerView={1} className="w-full h-64 md:h-96">
        {gallery.map((img, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full">
            {img?.startsWith("https") ? (
              <Image
                src={img}
                alt={cafe.name || "Cafe"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                No image
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="max-w-screen-md mx-auto px-4">
        {/* Title & Chips */}
        <section className="pt-5 pb-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-green-800">{cafe.name}</h1>
            <AverageRating category="cafeRestaurant" itemId={itemSlug} />
          </div>

          {cafe.address && (
            <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin size={14} /> {cafe.address}
            </p>
          )}

          {cafe.cuisine?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {cafe.cuisine.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          {cafe.averagecost && (
            <p className="text-green-600 font-medium text-base mt-2">
              ₹{cafe.averagecost}/person
            </p>
          )}
        </section>

        {/* Timing & Contact */}
        <section className="pb-3">
          {cafe.timing && (
            <p className="flex items-center gap-2 text-sm text-gray-700 mt-1">
              <Clock size={14} /> {cafe.timing}
            </p>
          )}
          {cafe.contact && (
            <a
              href={`tel:${cafe.contact}`}
              className="inline-block text-blue-700 bg-blue-50 px-4 py-2 rounded-full mt-2 text-sm"
            >
              <Phone size={14} className="inline-block mr-1" /> {cafe.contact}
            </a>
          )}
        </section>

        {/* Tags */}
        {cafe.tags?.length > 0 && (
          <section className="pb-4">
            <h2 className="font-semibold mb-1">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {cafe.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        {cafe.features?.length > 0 && (
          <section className="pb-4">
            <h2 className="font-semibold mb-1">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {cafe.features.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1 text-xs bg-green-50 text-green-800 rounded-full"
                >
                  {f}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Popular Items */}
        {cafe.popularitems?.length > 0 && (
          <section className="pb-4">
            <h2 className="font-semibold mb-1">Highlights</h2>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {cafe.popularitems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Description */}
        {cafe.description && (
          <section className="pb-4">
            <h2 className="font-semibold mb-1">About</h2>
            <DescriptionToggle text={cafe.description} />
          </section>
        )}

        <div className="pt-6 space-y-6">
          <HorizontalSection
            title="Nearby Restaurants"
            type="cafesRestaurants"
            items={related.nearbyRestaurants}
          />
          <HorizontalSection
            title="Nearby Attractions"
            type="destinations"
            items={related.destinations}
          />
          <HorizontalSection
            title="Nearby Stays"
            type="homestays"
            items={related.homestays}
          />
          <HorizontalSection
            title="🎉 What's Happening"
            type="events"
            items={related.events}
          />
          <HorizontalSection
            title="🌄 Adventure Nearby"
            type="thrills"
            items={related.thrills}
          />
          <HorizontalSection
            title="📜 Itineraries"
            type="itineraries"
            items={related.itineraries}
          />
          <HorizontalSection
            title="🛵 Get a Rental"
            type="rentals"
            items={related.rentals}
          />
        </div>

        {/* Reviews */}
          <ReviewSection category="cafeRestaurant" itemId={itemSlug} />
        </div>
      </main>
    </>
  );
}
