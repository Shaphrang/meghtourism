"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TravelTip } from "@/types/travelTips";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import DescriptionToggle from "@/components/common/descriptionToggle";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import Head from "next/head";

export default function ClientPage() {
  const { slug } = useParams();
  const itemSlug = normalizeSlug(String(slug));
  const [tip, setTip] = useState<TravelTip | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("traveltips")
        .select("*")
        .eq("slug", itemSlug)
        .single();
      setTip(data);
    }
    fetchData();
  }, [itemSlug]);

  if (!tip)
    return (
      <>
        <Head>
          <title>Loading Tip... | Meghtourism</title>
        </Head>
        <p className="p-4">Loading...</p>
      </>
    );

  const gallery = tip.media?.length ? tip.media : tip.image ? [tip.image] : [];
  const desc = tip.summary?.slice(0, 150) || "";

  return (
    <>
      <Head>
        <title>{tip.title} | Meghtourism</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={`${tip.title} | Meghtourism`} />
        <meta property="og:description" content={desc} />
        {gallery[0] && <meta property="og:image" content={gallery[0]} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${tip.title} | Meghtourism`} />
        <meta name="twitter:description" content={desc} />
        {gallery[0] && <meta name="twitter:image" content={gallery[0]} />}
      </Head>

      <main className="w-full min-h-screen bg-white text-gray-800 pb-10">
        {gallery.length > 0 && (
          <Swiper spaceBetween={10} slidesPerView={1} className="w-screen h-64 md:h-96">
            {gallery.map((img, idx) => (
              <SwiperSlide key={idx} className="relative w-full h-full">
                {img && img.startsWith("https") ? (
                  <Image src={img} alt={tip.title || "Travel Tip"} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className="max-w-screen-md mx-auto px-4 pt-4">
          <h1 className="text-2xl font-bold">{tip.title}</h1>
          {tip.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tip.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {tip.content && (
            <section className="pt-4">
              <DescriptionToggle text={tip.content} />
            </section>
          )}
        </div>
      </main>
    </>
  );
}