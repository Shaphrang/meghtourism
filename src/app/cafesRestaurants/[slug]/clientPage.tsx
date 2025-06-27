"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CafeAndRestaurant } from "@/types/cafeRestaurants";
import Image from "next/image";
import { MapPin, Phone, Clock, Share2 } from "lucide-react";
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

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: cafe.name, url: window.location.href });
    } else {
      alert("Sharing not supported on this device");
    }
  };

  return (
    <main className="w-full min-h-screen bg-white text-gray-800 pb-20">
      <Swiper spaceBetween={10} slidesPerView={1.2} className="w-full h-64 md:h-96">
        {gallery.map((img, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full rounded-lg overflow-hidden">
            {img && img.startsWith('https') ? (
              <Image src={img} alt={cafe.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-green-800">{cafe.name}</h1>
            {cafe.address && (
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <MapPin size={14} className="mr-1" /> {cafe.address}
              </p>
            )}
          </div>
          <button
            onClick={handleShare}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
          >
            <Share2 size={14} className="mr-1" /> Share
          </button>
        </div>

        {cafe.cuisine?.length && (
          <div className="flex flex-wrap gap-2 mt-2">
            {cafe.cuisine.map((c) => (
              <span key={c} className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 text-sm">
          {cafe.averagecost && (
            <p className="text-lg font-semibold text-green-700">₹{cafe.averagecost}/person</p>
          )}
          {cafe.timing && (
            <p className="mt-1 text-gray-700 flex items-center">
              <Clock size={14} className="mr-1" /> {cafe.timing}
            </p>
          )}
          {cafe.contact && (
            <a href={`tel:${cafe.contact}`} className="block text-blue-700 mt-1">
              <Phone size={14} className="inline-block mr-1" /> {cafe.contact}
            </a>
          )}
        </div>
      </section>

      {cafe.tags?.length ? (
        <section className="px-4 pb-4">
          <h2 className="font-semibold mb-1">Tags</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {cafe.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs bg-blue-50 text-blue-800 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {cafe.features?.length ? (
        <section className="px-4 pb-4">
          <h2 className="font-semibold mb-1">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {cafe.features.map((a) => (
              <span key={a} className="px-3 py-1 text-xs bg-green-50 text-green-800 rounded-full">
                {a}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {cafe.popularitems?.length ? (
        <section className="px-4 pb-4">
          <h2 className="font-semibold mb-1">Highlights</h2>
          <ul className="list-disc ml-5 text-sm text-gray-700">
            {cafe.popularitems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {cafe.description && (
        <section className="px-4 pb-4">
          <h2 className="font-semibold mb-1">About</h2>
          <DescriptionToggle text={cafe.description} />
        </section>
      )}

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
      {Array.isArray(cafe.reviews) && cafe.reviews.length > 0 && (
        <section className="px-4 pb-4">
          <h2 className="font-semibold mb-1">Reviews</h2>
          {cafe.reviews.map((rev, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg shadow-sm mb-2">
              <p className="text-sm">{rev}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}