"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Homestay } from "@/types/homestay";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
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
    <main className="bg-gradient-to-b from-indigo-50 to-white text-gray-800 w-full min-h-screen overflow-x-hidden pb-10">
      {/* Full Width Image */}
      <div className="w-full">
        <Swiper spaceBetween={10} slidesPerView={1} className="w-full h-64 sm:h-80 md:h-96">
          {gallery.map((img, idx) => (
            <SwiperSlide key={idx} className="relative w-full h-full">
              {img && img.startsWith("https") ? (
                <Image src={img} alt={homestay.name || "Homestay"} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-md mx-auto px-4 pt-5 pb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{homestay.name}</h1>

        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
          {homestay.address && (
            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <MapPin size={14} /> {homestay.address}
            </span>
          )}
        </div>

        {homestay.pricepernight && (
          <p className="text-green-600 font-medium text-base mt-2">
            ₹{homestay.pricepernight.toLocaleString()}/night
          </p>
        )}

        {/* Contact */}
        {homestay.contact && (
          <div className="mb-4 text-center">
            {showContact ? (
              <p className="text-sm font-medium text-blue-600 flex justify-center items-center gap-1">
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

        {/* Description */}
        {homestay.description && (
          <section className="pt-4">
            <DescriptionToggle text={homestay.description} />
          </section>
        )}

        {/* Room Info */}
        {homestay.occupancy && (
          <section className="pt-6">
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

        {/* Amenities */}
        {homestay.amenities?.length ? (
          <section className="pt-6">
            <h3 className="text-base font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {homestay.amenities.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                >
                  {a}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {/* Nearby Sections */}
        <div className="pt-6 space-y-6">
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
        </div>

        {/* Reviews */}
        {homestay.reviews?.length ? (
          <section className="pt-6">
            <h3 className="text-base font-semibold mb-2">Guest Reviews</h3>
            {homestay.reviews.map((rev, i) => (
              <div key={i} className="mb-3">
                <p className="text-sm">{rev}</p>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
