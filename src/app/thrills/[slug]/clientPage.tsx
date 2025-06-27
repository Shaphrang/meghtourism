"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Thrill } from "@/types/thrill";
import { Destination } from "@/types/destination";
import { Homestay } from "@/types/homestay";
import Image from "next/image";
import { MapPin, Share2, Clock, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import NearbyListings from "@/components/common/nearbyListings";

export default function ClientPage() {
  const { slug } = useParams();

  const [thrill, setThrill] = useState<Thrill | null>(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const fixedSlug = normalizeSlug(String(slug));
      const { data: th } = await supabase
        .from("thrills")
        .select("*")
        .eq("slug", fixedSlug)
        .single();

      if (th) {
        setThrill(th);
      }
    }
    fetchData();
  }, [slug]);

  if (!thrill) return <p className="p-4">Loading...</p>;

  const gallery = thrill.gallery?.length
    ? thrill.gallery
    : thrill.image
    ? [thrill.image]
    : [];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: thrill.name || "Adventure", url: window.location.href });
    } else {
      alert("Sharing not supported on this device");
    }
  };

  return (
    <main className="bg-white text-gray-800 w-full min-h-screen">
      <Swiper spaceBetween={10} slidesPerView={1.1} className="w-full h-64 md:h-96">
        {gallery.map((img, idx) => (
          <SwiperSlide key={idx} className="relative rounded-xl overflow-hidden">
            {img && img.startsWith('https') ? (
              <Image src={img} alt={thrill.name || "Adventure"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <section className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">{thrill.name}</h1>
          <button onClick={handleShare} className="text-blue-600">
            <Share2 size={20} />
          </button>
        </div>
        {thrill.location && (
          <p className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <MapPin size={16} /> {thrill.location}
          </p>
        )}
        {thrill.priceperperson && (
          <p className="text-green-700 font-semibold text-lg mt-2">
            ₹{thrill.priceperperson.toLocaleString()}/person
          </p>
        )}
        {thrill.duration && (
          <p className="text-sm text-gray-600 mt-1">
            <Clock size={14} className="inline mr-1" /> Duration: {thrill.duration}
          </p>
        )}
        {thrill.difficultylevel && (
          <span className="text-xs inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full mt-2">
            Difficulty: {thrill.difficultylevel}
          </span>
        )}
        {thrill.contact && (
          <div className="mt-2">
            {showContact ? (
              <p className="text-sm font-medium text-blue-600">{thrill.contact}</p>
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

      {thrill.highlights?.length ? (
        <section className="p-4">
          <h2 className="text-lg font-semibold mb-2">Highlights</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {thrill.highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {thrill.inclusions?.length ? (
        <section className="p-4">
          <h2 className="text-lg font-semibold mb-2">What's Included</h2>
          <div className="flex flex-wrap gap-2">
            {thrill.inclusions.map((a, i) => (
              <span key={i} className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                {a}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {thrill.description && (
        <section className="p-4">
          <DescriptionToggle text={thrill.description} />
        </section>
      )}

      {Array.isArray((thrill as any).reviews) && (thrill as any).reviews.length > 0 && (
        <section className="p-4">
          <h2 className="text-lg font-semibold mb-2">Reviews</h2>
          {(thrill as any).reviews.map((rev: any, i: number) => (
            <div key={i} className="mb-3">
              <p className="font-semibold text-sm text-gray-800">{rev.name || rev.user}</p>
              {rev.date && <p className="text-xs text-gray-500">{rev.date}</p>}
              {rev.rating && (
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: rev.rating }, (_, idx) => (
                    <Star key={idx} size={14} className="text-yellow-500 fill-yellow-300" />
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-700 mt-1">{rev.comment}</p>
            </div>
          ))}
        </section>
      )}

      <NearbyListings
        type="destinations"
        location={thrill.location ?? null}
        title="Nearby Attractions"
      />

      <NearbyListings
        type="homestays"
        location={thrill.location ?? null}
        title="Nearby Homestays"
      />
    </main>
  );
}