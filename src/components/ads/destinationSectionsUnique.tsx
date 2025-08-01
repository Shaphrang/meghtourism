"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { Destination } from "@/types/destination";
import { MapPin, Tag, Calendar } from "lucide-react";

// --- Which slice for which type ---
const SECTION_MAP = {
  top10: { title: "✨ Must-See Picks", start: 0, end: 10 },
  trending: { title: "🚀 Now Trending", start: 10, end: 20 },
  hiddenGems: { title: "💎 Secret Gems", start: 20, end: 30 },
  bucketList: { title: "🗺️ Ultimate Bucket List", start: 30, end: 40 },
  recommended: { title: "🎯 Handpicked For You", start: 40, end: 50 },
};

export default function HorizontalSection({ type }: { type: keyof typeof SECTION_MAP }) {
  const [items, setItems] = useState<Destination[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: featured } = await supabase
        .from("destinations")
        .select("*")
        .eq("sectionflag", true)
        .limit(50);

      if (!featured) return;

      const shuffled = [...featured].sort(() => Math.random() - 0.5);
      const { start, end } = SECTION_MAP[type];
      setItems(shuffled.slice(start, end));
    }
    fetchData();
  }, [type]);

  if (!items.length) return null;

  return (
<section className="pt-2">
  <h2 className="text-sm font-semibold mb-2 mt-4">{SECTION_MAP[type].title}</h2>
  <div className="flex flex-nowrap gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2">
    {items.map((dest) => (
    <Link
    key={dest.id}
    href={`/destinations/${dest.slug ?? dest.id}`}
    className="
        flex-shrink-0
        min-w-[110px] max-w-[125px] h-[150px]
        md:min-w-[180px] md:max-w-[210px] md:h-[195px]
        rounded-xl overflow-hidden shadow bg-white hover:shadow-lg transition-all border border-gray-100 group
        flex flex-col
    "
    tabIndex={0}
    >
    {/* IMAGE (2/3rd of card) */}
    <div className="relative w-full h-[100px] md:h-[130px] bg-gray-100">
        <img
        src={dest.image || "/default-hero.jpg"}
        alt={dest.name}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        draggable={false}
        />
        <div className="absolute top-2 left-2 z-10 flex gap-1">
        {dest.category && (
            <span className="flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap shadow-sm min-h-[18px] md:min-h-[22px]">
            <Tag size={11} className="mr-1" />
            {Array.isArray(dest.category) ? dest.category[0] : dest.category}
            </span>
        )}
        {dest.visitseason && (
            <span className="flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap shadow-sm min-h-[18px] md:min-h-[22px]">
            <Calendar size={11} className="mr-1" />
            {Array.isArray(dest.visitseason) ? dest.visitseason[0] : dest.visitseason}
            </span>
        )}
        </div>
    </div>
    {/* INFO (1/3rd of card) */}
    <div className="flex-1 flex flex-col justify-center p-2 md:p-3 pb-1 md:pb-2 min-h-[50px] md:min-h-[65px]">
        <div className="font-semibold text-xs md:text-base truncate mb-0.5">{dest.name}</div>
        {dest.location && (
        <div className="flex items-center gap-1 text-[11px] md:text-xs text-gray-500 truncate">
            <MapPin size={11} className="md:w-3 md:h-3" />
            {dest.location}
        </div>
        )}
    </div>
    </Link>

    ))}
  </div>
</section>

  );
}
