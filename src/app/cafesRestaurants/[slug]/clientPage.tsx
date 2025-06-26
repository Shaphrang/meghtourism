"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CafeAndRestaurant } from "@/types/cafeRestaurants";
import { Destination } from "@/types/destination";
import { Homestay } from "@/types/homestay";
import Image from "next/image";
import { MapPin, Phone, Clock, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";

export default function ClientPage() {
  const { slug } = useParams();
  const supabase = createClientComponentClient();

  const [cafe, setCafe] = useState<CafeAndRestaurant | null>(null);
  const [attractions, setAttractions] = useState<Destination[]>([]);
  const [stays, setStays] = useState<Homestay[]>([]);

  useEffect(() => {
    async function fetchData() {
      const rawSlug = String(slug);
      const fixedSlug = rawSlug.replace(/_/g, "-");
      const { data } = await supabase
        .from("cafes_and_restaurants")
        .select("*")
        .eq("slug", fixedSlug)
        .single();
      setCafe(data);

      const { data: dest } = await supabase
        .from("destinations")
        .select("*")
        .limit(4);
      setAttractions(dest || []);

      const { data: staysData } = await supabase
        .from("homestays")
        .select("*")
        .limit(4);
      setStays(staysData || []);
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

      {attractions.length > 0 && (
        <section className="px-4 pb-4">
          <h2 className="font-semibold mb-2">Nearby Attractions</h2>
          <div className="flex gap-3 overflow-x-auto">
            {attractions.map((a) => (
              <div key={a.id} className="min-w-[160px] rounded-lg shadow bg-white overflow-hidden">
                <div className="h-24 relative bg-gray-100">
                  {a.image ? (
                    <Image src={a.image} alt={a.name || 'Attraction'} fill className="object-cover rounded-t-lg" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div className="p-2">
                  <p className="font-medium text-sm truncate">{a.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {stays.length > 0 && (
        <section className="px-4 pb-4">
          <h2 className="font-semibold mb-2">Nearby Stays</h2>
          <div className="flex flex-col gap-3">
            {stays.map((stay) => (
              <div key={stay.id} className="flex gap-3 bg-gray-50 rounded-lg p-3 shadow-sm">
                <div className="w-20 h-20 relative bg-gray-100 rounded-md overflow-hidden">
                  {stay.image ? (
                    <Image src={stay.image} alt={stay.name || 'Stay'} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{stay.name}</p>
                  {stay.location && <p className="text-sm text-gray-500">{stay.location}</p>}
                  {stay.pricepernight && (
                    <p className="text-green-600 font-medium">₹{stay.pricepernight.toLocaleString()}/night</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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