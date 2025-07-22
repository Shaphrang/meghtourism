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
import NearbyListings from "@/components/common/nearbyListings";

export default function ClientPage() {
  const { slug } = useParams();
  const [cafe, setCafe] = useState<CafeAndRestaurant | null>(null);

  useEffect(() => {
    async function fetchData() {
      const fixedSlug = normalizeSlug(String(slug));
      const { data } = await supabase
        .from("cafes_and_restaurants")
        .select("*")
        .eq("slug", fixedSlug)
        .single();
      setCafe(data);
    }
    fetchData();
  }, [slug]);

  if (!cafe) return <p className="p-4">Loading...</p>;

  const gallery = cafe.gallery?.length ? cafe.gallery : cafe.image ? [cafe.image] : [];

  return (
    <main className="w-full min-h-screen bg-white text-gray-800 pb-20">
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
          <h1 className="text-2xl font-bold text-green-800">{cafe.name}</h1>

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
                  className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Price - Centered */}
          {cafe.averagecost && (
            <p className="text-lg font-semibold text-green-700 text-center mt-4">
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
              className="block text-blue-700 mt-1 text-sm"
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

        {/* Nearby */}
        <NearbyListings
          type="destinations"
          location={cafe.location}
          title="Nearby Attractions"
        />
        <NearbyListings
          type="homestays"
          location={cafe.location}
          title="Nearby Stays"
        />

        {/* Reviews */}
        {Array.isArray(cafe.reviews) && cafe.reviews.length > 0 && (
          <section className="pb-4">
            <h2 className="font-semibold mb-1">Reviews</h2>
            {cafe.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-3 rounded-lg shadow-sm mb-2"
              >
                <p className="text-sm">{rev}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
