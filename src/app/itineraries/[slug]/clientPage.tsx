"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Itinerary } from "@/types/itineraries";
import { Destination } from "@/types/destination";
import { Homestay } from "@/types/homestay";
import Image from "next/image";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import NearbyListings from "@/components/common/nearbyListings";

export default function ClientPage() {
  const { slug } = useParams();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const fixedSlug = normalizeSlug(String(slug));
      const { data: itin } = await supabase
        .from("itineraries")
        .select("*")
        .eq("slug", fixedSlug)
        .single();
      if (itin) {
        setItinerary(itin);
      }
    }
    fetchData();
  }, [slug]);

  if (!itinerary) return <p className="p-4">Loading...</p>;

  const gallery = itinerary.gallery?.length
    ? itinerary.gallery
    : itinerary.image
    ? [itinerary.image]
    : [];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: itinerary.title || "Itinerary", url: window.location.href });
    } else {
      alert("Sharing not supported on this device");
    }
  };

  return (
    <main className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {gallery.length > 0 && (
        <Swiper spaceBetween={10} slidesPerView={1.2} className="w-full h-64 md:h-96">
          {gallery.map((img, idx) => (
            <SwiperSlide key={idx} className="relative w-full h-full rounded-lg overflow-hidden">
              {img && img.startsWith('https') ? (
                <Image src={img} alt={itinerary.title || "Itinerary"} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <section className="p-4">
        <h1 className="text-2xl font-bold">{itinerary.title}</h1>
        <p className="text-sm text-gray-600">
          {itinerary.days && `${itinerary.days} Days`} {itinerary.theme?.length ? `• ${itinerary.theme.join(', ')}` : ''}
        </p>
        <p className="text-sm text-gray-500">
          Start: {itinerary.starting_point} {itinerary.season && `• Best Season: ${itinerary.season}`}
        </p>
        <button
          onClick={handleShare}
          className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600"
        >
          <Share2 size={16} /> Share Plan
        </button>
      </section>

      {itinerary.description && (
        <section className="p-4">
          <DescriptionToggle text={itinerary.description} />
        </section>
      )}

      {Array.isArray(itinerary.places_per_day) && itinerary.places_per_day.length > 0 && (
        <section className="p-4">
          <h2 className="text-lg font-semibold mb-2">Day-wise Plan</h2>
          <div className="flex flex-col gap-3">
            {itinerary.places_per_day.map((day: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-xl shadow p-4">
                <button
                  onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                  className="flex items-center justify-between w-full"
                >
                  <span className="font-semibold">Day {index + 1}: {day.location}</span>
                  {expandedDay === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedDay === index && Array.isArray(day.activities) && (
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                    {day.activities.map((a: string, i: number) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {itinerary.tips?.length ? (
        <section className="p-4">
          <h2 className="text-lg font-semibold mb-2">Travel Tips</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {itinerary.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <NearbyListings
        type="destinations"
        filterBy="district"
        matchValue={itinerary.district}
        title="Nearby Attractions"
      />
      <NearbyListings
        type="homestays"
        filterBy="district"
        matchValue={itinerary.district}
        title="Nearby Stays"
      />

      {Array.isArray((itinerary as any).reviews) && (itinerary as any).reviews.length > 0 && (
        <section className="p-4">
          <h2 className="text-lg font-semibold mb-2">Reviews</h2>
          {(itinerary as any).reviews.map((rev: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="text-sm">{rev.comment || rev}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}