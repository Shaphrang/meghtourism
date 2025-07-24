"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Rental } from "@/types/rentals";
import { Destination } from "@/types/destination";
import { Homestay } from "@/types/homestay";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import NearbyListings from "@/components/common/nearbyListings";
import ShareBar from "@/components/common/shareBar";
import ReviewSection from "@/components/reviews/reviewSection";
import AverageRating from "@/components/reviews/averageRating";
import Head from "next/head";

export default function ClientPage() {
  const { slug } = useParams();
  const itemSlug = normalizeSlug(String(slug));
  const [rental, setRental] = useState<Rental | null>(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("rentals")
        .select("*")
        .eq("slug", itemSlug)
        .single();
      if (data) {
        setRental(data);
      }
    }
    fetchData();
  }, [itemSlug]);

  if (!rental)
    return (
      <>
        <Head>
          <title>Loading Rental... | Meghtourism</title>
        </Head>
        <p className="p-4">Loading...</p>
      </>
    );

  const gallery = rental.gallery?.length
    ? rental.gallery
    : rental.image
    ? [rental.image]
    : [];

  const desc = rental.description?.slice(0, 150) || "";
  const img = rental.image || rental.gallery?.[0] || "";


  return (
    <>
      <Head>
        <title>{rental.title || rental.type} | Meghtourism</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={`${rental.title || rental.type} | Meghtourism`} />
        <meta property="og:description" content={desc} />
        {img && <meta property="og:image" content={img} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${rental.title || rental.type} | Meghtourism`} />
        <meta name="twitter:description" content={desc} />
        {img && <meta name="twitter:image" content={img} />}
      </Head>

      <main className="bg-gradient-to-b from-slate-50 to-white w-full min-h-screen text-gray-800 pb-10 px-4">
      <div className="max-w-screen-md mx-auto">
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
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-bold">{rental.title || rental.type}</h1>
              <AverageRating category="rental" itemId={itemSlug} />
            </div>
            {rental.address && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin size={14} /> {rental.address}
              </p>
            )}
            {typeof rental.rentalrate === "object" && rental.rentalrate?.price && (
              <p className="text-green-600 font-medium text-base mt-2">
                ₹{rental.rentalrate.price}/day
              </p>
            )}
            {rental.availability && (
              <p className="text-sm text-blue-700 font-medium mt-1">Status: {rental.availability}</p>
            )}
          </div>
        </div>
      </section>

      <ShareBar title={rental.title || rental.type} text={rental.description?.slice(0,80)} />

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

      <NearbyListings
        type="destinations"
        location={rental.location}
        title="Nearby Attractions"
      />

      <NearbyListings
        type="homestays"
        location={rental.location}
        title="Nearby Stays"
      />

      <ReviewSection category="rental" itemId={itemSlug} />

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
      </div>
    </main>
    </>
  );
}