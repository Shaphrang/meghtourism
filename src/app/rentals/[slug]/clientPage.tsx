"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Rental } from "@/types/rentals";
import { Destination } from "@/types/destination";
import { Homestay } from "@/types/homestay";
import Image from "next/image";
import { MapPin, Phone, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";

export default function ClientPage() {
  const { slug } = useParams();
  const supabase = createClientComponentClient();

  const [rental, setRental] = useState<Rental | null>(null);
  const [attractions, setAttractions] = useState<Destination[]>([]);
  const [stays, setStays] = useState<Homestay[]>([]);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const rawSlug = String(slug);
      const fixedSlug = rawSlug.replace(/_/g, "-");
      const { data } = await supabase
        .from("rentals")
        .select("*")
        .eq("slug", fixedSlug)
        .single();
      if (data) {
        setRental(data);
        const { data: near } = await supabase
          .from("destinations")
          .select("*")
          .limit(4);
        setAttractions(near || []);
        const { data: sim } = await supabase
          .from("homestays")
          .select("*")
          .limit(4);
        setStays(sim || []);
      }
    }
    fetchData();
  }, [slug]);

  if (!rental) return <p className="p-4">Loading...</p>;

  const gallery = rental.gallery?.length
    ? rental.gallery
    : rental.image
    ? [rental.image]
    : [];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: rental.title || rental.type || "Rental",
        url: window.location.href,
      });
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
              <Image src={img} alt={rental.title || rental.type || "Rental"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">{rental.title || rental.type}</h1>
            {rental.address && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin size={14} /> {rental.address}
              </p>
            )}
            {typeof rental.rentalrate === "object" && rental.rentalrate?.price && (
              <p className="text-base font-semibold text-green-600 mt-1">
                ₹{rental.rentalrate.price}/day
              </p>
            )}
            {rental.availability && (
              <p className="text-sm text-blue-700 font-medium mt-1">Status: {rental.availability}</p>
            )}
          </div>
          <button onClick={handleShare} className="text-blue-600 p-1">
            <Share2 size={20} />
          </button>
        </div>
      </section>

      {rental.description && (
        <section className="p-4">
          <DescriptionToggle text={rental.description} />
        </section>
      )}

      {rental.vehicle_features?.length ? (
        <section className="p-4">
          <h2 className="text-base font-semibold mb-2">What's Included</h2>
          <div className="flex flex-wrap gap-2">
            {rental.vehicle_features.map((f) => (
              <span key={f} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {rental.terms?.length ? (
        <section className="p-4">
          <h2 className="text-base font-semibold mb-2">Rental Policies</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {rental.terms.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {attractions.length > 0 && (
        <section className="p-4">
          <h3 className="font-semibold mb-2">Nearby Attractions</h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {attractions.map((a) => (
              <div key={a.id} className="min-w-[150px] rounded-xl shadow overflow-hidden">
                <div className="relative w-full h-24 bg-gray-100">
                  {a.image && a.image.startsWith('https') ? (
                    <Image src={a.image} alt={a.name || "Attraction"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <p className="p-2 text-sm font-medium truncate">{a.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {stays.length > 0 && (
        <section className="p-4">
          <h3 className="font-semibold mb-2">Nearby Stays</h3>
          <div className="flex flex-col gap-3">
            {stays.map((stay) => (
              <div key={stay.id} className="flex gap-3 bg-gray-50 rounded-xl shadow p-3">
                <div className="relative w-20 h-20 rounded-md overflow-hidden">
                  {stay.image && stay.image.startsWith('https') ? (
                    <Image src={stay.image} alt={stay.name || "Stay"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{stay.name}</p>
                  {stay.location && <p className="text-xs text-gray-500">{stay.location}</p>}
                  {stay.pricepernight && (
                    <p className="text-green-700 text-sm">₹{stay.pricepernight.toLocaleString()}/night</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {Array.isArray(rental.reviews) && rental.reviews.length > 0 && (
        <section className="p-4">
          <h3 className="font-semibold mb-2">Reviews</h3>
          {rental.reviews.map((rev, i) => (
            <div key={i} className="mb-2 border-b pb-2">
              <p className="text-sm">{rev}</p>
            </div>
          ))}
        </section>
      )}

      {rental.contact && (
        <div className="p-4 fixed bottom-10 left-0 right-0">
          <button
            onClick={() => setShowContact(true)}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl text-center"
          >
            {showContact ? (
              <span className="flex items-center justify-center gap-2">
                <Phone size={18} /> {rental.contact}
              </span>
            ) : (
              "Contact to Book"
            )}
          </button>
        </div>
      )}
    </main>
  );
}