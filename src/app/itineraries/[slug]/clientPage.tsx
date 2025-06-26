"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Itinerary } from "@/types/itineraries";
import { Destination } from "@/types/destination";
import { Homestay } from "@/types/homestay";
import Image from "next/image";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";

export default function ClientPage() {
  const { slug } = useParams();
  const supabase = createClientComponentClient();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [attractions, setAttractions] = useState<Destination[]>([]);
  const [stays, setStays] = useState<Homestay[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const rawSlug = String(slug);
      const fixedSlug = rawSlug.replace(/_/g, "-");
      const { data: itin } = await supabase
        .from("itineraries")
        .select("*")
        .eq("slug", fixedSlug)
        .single();
      if (itin) {
        setItinerary(itin);
        const { data: dest } = await supabase
          .from("destinations")
          .select("*")
          .limit(4);
        setAttractions(dest || []);
        const { data: homes } = await supabase
          .from("homestays")
          .select("*")
          .limit(4);
        setStays(homes || []);
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
              <Image src={img} alt={itinerary.title || "Itinerary"} fill className="object-cover" />
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

      {attractions.length > 0 && (
        <section className="p-4">
          <h3 className="text-base font-semibold mb-2">Nearby Attractions</h3>
          <div className="flex gap-3 overflow-x-auto">
            {attractions.map((a) => (
              <div key={a.id} className="min-w-[150px] rounded-xl shadow overflow-hidden">
                <div className="relative w-full h-24">
                  {a.image ? (
                    <Image src={a.image} alt={a.name || 'Attraction'} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">No image</div>
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
          <h3 className="text-base font-semibold mb-2">Nearby Stays</h3>
          <div className="flex flex-col gap-3">
            {stays.map((stay) => (
              <div key={stay.id} className="flex gap-3 bg-gray-50 rounded-lg p-3 shadow-sm">
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                  {stay.image ? (
                    <Image src={stay.image} alt={stay.name || 'Stay'} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{stay.name}</p>
                  {stay.location && <p className="text-sm text-gray-500 truncate">{stay.location}</p>}
                  {stay.pricepernight && (
                    <p className="text-green-600 text-sm">₹{stay.pricepernight.toLocaleString()}/night</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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