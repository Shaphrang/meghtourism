"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Homestay } from "@/types/homestay";
import { Destination } from "@/types/destination";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import NearbyListings from "@/components/common/nearbyListings";

export default function ClientPage() {
  const { slug } = useParams();

  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const fixedSlug = normalizeSlug(String(slug));
      const { data: stay } = await supabase
        .from("homestays")
        .select("*")
        .eq("slug", fixedSlug)
        .single();

      if (stay) {
        setHomestay(stay);
      }
    }

    fetchData();
  }, [slug]);

  if (!homestay) return <p className="p-4">Loading...</p>;

  const gallery = homestay.gallery?.length
    ? homestay.gallery
    : homestay.image
    ? [homestay.image]
    : [];

  return (
    <main className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden relative pb-20">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        centeredSlides
        className="w-full h-64 md:h-96"
      >
        {gallery.map((img, idx) => (
          <SwiperSlide
            key={idx}
            className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {img && img.startsWith('https') ? (
              <Image src={img} alt={homestay.name || "Homestay"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="p-4">
        <h1 className="text-2xl font-bold mb-1">{homestay.name}</h1>
        {homestay.address && (
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>{homestay.address}</span>
          </p>
        )}
        {homestay.pricepernight && (
          <p className="text-base font-semibold text-green-600 mt-2">
            ₹{homestay.pricepernight.toLocaleString()}/night
          </p>
        )}
        {homestay.contact && (
          <div className="mt-3">
            {showContact ? (
              <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                <Phone size={16} /> {homestay.contact}
              </p>
            ) : (
              <button
                onClick={() => setShowContact(true)}
                className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow hover:bg-blue-100 transition"
              >
                📞 Reveal Contact Number
              </button>
            )}
          </div>
        )}
      </section>

      {homestay.description && (
        <section className="p-4">
          <DescriptionToggle text={homestay.description} />
        </section>
      )}

      {homestay.occupancy && (
        <section className="px-4 pb-4">
          <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold">Room Info</h2>
            <p className="text-sm text-gray-600">Occupancy: {homestay.occupancy}</p>
            {homestay.pricepernight && (
              <p className="text-green-600 font-medium mt-1">
                ₹{homestay.pricepernight.toLocaleString()}/night
              </p>
            )}
          </div>
        </section>
      )}

      {homestay.amenities?.length ? (
        <section className="p-4">
          <h3 className="text-base font-semibold mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {homestay.amenities.map((a) => (
              <span key={a} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {a}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <NearbyListings
        type="destinations"
        location={homestay.location ?? null}
        title="Nearby Attractions"
      />

      <NearbyListings
        type="homestays"
        location={homestay.location ?? null}
        excludeId={homestay.id}
        title="Similar Stays"
      />

      {homestay.reviews?.length ? (
        <section className="p-4">
          <h3 className="text-base font-semibold mb-2">Guest Reviews</h3>
          {homestay.reviews.map((rev, i) => (
            <div key={i} className="mb-3">
              <p className="text-sm">{rev}</p>
            </div>
          ))}
        </section>
      ) : null}
    </main>
  );
}
