"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Homestay } from "@/types/homestay";
import { Destination } from "@/types/destination";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";

export default function ClientPage() {
  const { slug } = useParams();
  const supabase = createClientComponentClient();

  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [nearby, setNearby] = useState<Destination[]>([]);
  const [similar, setSimilar] = useState<Homestay[]>([]);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const rawSlug = String(slug);
      const fixedSlug = rawSlug.replace(/_/g, "-");
      const { data: stay } = await supabase
        .from("homestays")
        .select("*")
        .eq("slug", fixedSlug)
        .single();

      if (stay) {
        setHomestay(stay);
        const { data: sim } = await supabase
          .from("homestays")
          .select("*")
          .neq("id", stay.id)
          .limit(4);
        setSimilar(sim || []);
      }

      const { data: attractions } = await supabase
        .from("destinations")
        .select("*")
        .limit(4);
      setNearby(attractions || []);
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
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
          >
            <Image src={img} alt={homestay.name || "Homestay"} fill className="object-cover" />
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

      {nearby.length > 0 && (
        <section className="p-4">
          <h3 className="text-base font-semibold mb-2">Nearby Attractions</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {nearby.map((n) => (
              <div
                key={n.id}
                className="min-w-[160px] bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="h-24 relative bg-gray-100">
                  {n.image ? (
                    <Image src={n.image} alt={n.name || "Attraction"} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{n.name}</p>
                  {n.district && <p className="text-xs text-gray-500 truncate">{n.district}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="p-4">
          <h3 className="text-base font-semibold mb-2">Similar Stays</h3>
          <div className="flex flex-col gap-3">
            {similar.map((stay) => (
              <div key={stay.id} className="flex gap-3 bg-gray-50 rounded-lg p-3 shadow-sm">
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                  {stay.image ? (
                    <Image src={stay.image} alt={stay.name || "Stay"} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-semibold">{stay.name}</p>
                  <p className="text-sm text-gray-500 truncate">{stay.location}</p>
                  {stay.pricepernight && (
                    <p className="text-green-600 text-sm">
                      ₹{stay.pricepernight.toLocaleString()}/night
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
