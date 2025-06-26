"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Thrill } from "@/types/thrill";
import { Destination } from "@/types/destination";
import { Homestay } from "@/types/homestay";
import Image from "next/image";
import { MapPin, Share2, Clock, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";

export default function ClientPage() {
  const { slug } = useParams();
  const supabase = createClientComponentClient();

  const [thrill, setThrill] = useState<Thrill | null>(null);
  const [attractions, setAttractions] = useState<Destination[]>([]);
  const [stays, setStays] = useState<Homestay[]>([]);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const rawSlug = String(slug);
      const fixedSlug = rawSlug.replace(/_/g, "-");
      const { data: th } = await supabase
        .from("thrills")
        .select("*")
        .eq("slug", fixedSlug)
        .single();

      if (th) {
        setThrill(th);
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
            <Image src={img} alt={thrill.name || "Adventure"} fill className="object-cover" />
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

      {attractions.length > 0 && (
        <section className="p-4">
          <h2 className="text-lg font-semibold mb-2">Nearby Attractions</h2>
          <div className="flex gap-4 overflow-x-auto">
            {attractions.map((a) => (
              <div key={a.id} className="min-w-[140px] bg-white rounded-lg shadow">
                <div className="h-24 relative">
                  {a.image ? (
                    <Image src={a.image} alt={a.name || "Attraction"} fill className="object-cover rounded-t-lg" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {stays.length > 0 && (
        <section className="p-4 pb-8">
          <h2 className="text-lg font-semibold mb-2">Nearby Homestays</h2>
          <div className="flex flex-col gap-3">
            {stays.map((stay) => (
              <div key={stay.id} className="flex gap-3 bg-gray-50 rounded-lg shadow p-3">
                <div className="w-20 h-20 relative rounded-md overflow-hidden">
                  {stay.image ? (
                    <Image src={stay.image} alt={stay.name || "Stay"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-sm">{stay.name}</p>
                  {stay.location && <p className="text-xs text-gray-500">{stay.location}</p>}
                  {stay.pricepernight && (
                    <p className="text-green-600 text-sm">₹{stay.pricepernight.toLocaleString()}/night</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}