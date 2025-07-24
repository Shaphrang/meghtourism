"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Destination } from "@/types/destination";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { normalizeSlug } from "@/lib/utils";
import useRelatedForDestination from "@/hooks/useRelatedForDestination";
import HorizontalSection from "@/components/common/horizonatlSection";
import ReviewSection from "@/components/reviews/reviewSection";
import AverageRating from "@/components/reviews/averageRating";
import Head from "next/head";

export default function ClientPage() {
  const { slug } = useParams();
  const itemSlug = normalizeSlug(String(slug));
  const [destination, setDestination] = useState<Destination | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const related = useRelatedForDestination(destination);

  useEffect(() => {
    async function fetchData() {
      const { data: dest } = await supabase
        .from("destinations")
        .select("*")
        .eq("slug", itemSlug)
        .single();
      setDestination(dest);
    }
    fetchData();
  }, [itemSlug]);

  if (!destination)
    return (
      <>
        <Head>
          <title>Loading Destination... | Meghtourism</title>
        </Head>
        <p className="p-4">Loading...</p>
      </>
    );

  const desc = destination.description?.slice(0, 150) || "";
  const img = destination.image || destination.gallery?.[0] || "";

  return (
    <>
      <Head>
        <title>{destination.name} | Meghtourism</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={`${destination.name} | Meghtourism`} />
        <meta property="og:description" content={desc} />
        {img && <meta property="og:image" content={img} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${destination.name} | Meghtourism`} />
        <meta name="twitter:description" content={desc} />
        {img && <meta name="twitter:image" content={img} />}
      </Head>

      <main className="bg-gradient-to-b from-emerald-50 to-white text-gray-800 w-full min-h-screen pb-10">
      {/* Full-width hero image */}
      <div className="w-screen h-64 sm:h-80 md:h-96 relative -mx-[calc((100vw-100%)/2)]">
        {destination.image && destination.image.startsWith("https") ? (
          <Image
            src={destination.image}
            alt={destination.name || ""}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="max-w-screen-md mx-auto px-4">
        {/* Title & Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{destination.name}</h1>
            <AverageRating category="destination" itemId={itemSlug} />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {destination.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          {destination.address && (
            <p className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin size={14} className="mr-1" /> {destination.address}
            </p>
          )}
        </motion.div>

        {/* Description */}
        {destination.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4"
          >
            <p
              className={`text-sm text-gray-700 transition-all duration-300 ${
                showFullDesc ? "" : "line-clamp-3"
              }`}
            >
              {destination.description}
            </p>
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="text-emerald-600 text-sm mt-1 hover:underline"
            >
              {showFullDesc ? "Show Less" : "Show More"}
            </button>
          </motion.div>
        )}

        <div className="pt-6 space-y-6">
          <HorizontalSection
            title="Nearby Homestays"
            type="homestays"
            items={related.homestays}
          />
          <HorizontalSection
            title="🎉 What's Happening"
            type="events"
            items={related.events}
          />
          <HorizontalSection
            title="🌄 Adventure Nearby"
            type="thrills"
            items={related.thrills}
          />
          <HorizontalSection
            title="🍴 Places to Eat"
            type="cafesRestaurants"
            items={related.restaurants}
          />
          <HorizontalSection
            title="📜 Itineraries"
            type="itineraries"
            items={related.itineraries}
          />
          <HorizontalSection
            title="🛵 Get a Rental"
            type="rentals"
            items={related.rentals}
          />
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Contact for Help or Booking
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message submitted!");
              console.log("Form submitted");
            }}
            className="space-y-3"
          >
            <Input name="name" placeholder="Name" required />
            <Input name="email" placeholder="Email" type="email" required />
            <Input name="phone" placeholder="Phone" required />
            <Textarea name="message" placeholder="Message" rows={3} required />
            <Button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Send Message
            </Button>
          </form>
        </motion.div>
        {/*Reviews*/}
        <ReviewSection category="destination" itemId={itemSlug} />
      </div>
    </main>
    </>
  );
}
