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
import NearbyListings from "@/components/common/nearbyListings";
import ShareBar from "@/components/common/shareBar";

export default function ClientPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const fixedSlug = normalizeSlug(String(slug));
      const { data: dest } = await supabase
        .from("destinations")
        .select("*")
        .eq("slug", fixedSlug)
        .single();
      setDestination(dest);
    }
    fetchData();
  }, [slug]);

  if (!destination) return <p className="p-4">Loading...</p>;

  return (
    <main className="pb-10 text-gray-800 bg-white w-full">
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
          <h1 className="text-xl font-bold text-gray-800">{destination.name}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {destination.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full"
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

        <ShareBar title={destination.name} text={destination.description?.slice(0, 80)} />

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

        <NearbyListings
          type="homestays"
          location={destination.location}
          title="Nearby Homestays"
        />
        <NearbyListings
          type="destinations"
          location={destination.location}
          excludeId={destination.id}
          title="Nearby Attractions"
        />

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
      </div>
    </main>
  );
}
