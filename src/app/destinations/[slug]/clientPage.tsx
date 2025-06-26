"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Destination } from "@/types/destination";
import { Homestay } from "@/types/homestay";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ClientPage() {
  const { slug } = useParams();
  const supabase = createClientComponentClient();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [nearby, setNearby] = useState<Destination[]>([]);
  const [showFullDesc, setShowFullDesc] = useState(false);

useEffect(() => {
  async function fetchData() {
    const rawSlug = String(slug);
    const fixedSlug = rawSlug.replace(/_/g, '-');
    console.log("Fixed slug used for DB:", fixedSlug);

    const { data: dest } = await supabase
      .from('destinations')
      .select('*')
      .eq('slug', fixedSlug)
      .single();

    setDestination(dest);

    const { data: related } = await supabase
      .from('destinations')
      .select('*')
      .neq('id', dest?.id || '')
      .limit(4);
    setNearby(related || []);

    const { data: stays } = await supabase
      .from('homestays')
      .select('*')
      .limit(4);
    setHomestays(stays || []);
  }

  fetchData();
}, [slug]);

  if (!destination) return <p className="p-4">Loading...</p>;

  return (
    <main className="px-4 pb-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-[200px] sm:h-[300px] relative rounded-xl overflow-hidden"
      >
        {destination.image && destination.image.startsWith('https') ? (
          <Image src={destination.image} alt={destination.name || ""} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">No Image</div>
        )}
      </motion.div>

      {/* Title & Tags */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4">
        <h1 className="text-xl font-bold text-gray-800">{destination.name}</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {destination.tags?.map((tag, i) => (
            <span key={i} className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4">
          <p className={`text-sm text-gray-700 transition-all duration-300 ${showFullDesc ? "" : "line-clamp-3"}`}>
            {destination.description}
          </p>
          <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-emerald-600 text-sm mt-1 hover:underline">
            {showFullDesc ? "Show Less" : "Show More"}
          </button>
        </motion.div>
      )}

      {/* Nearby Homestays */}
      {homestays.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Nearby Homestays</h2>
          <div className="space-y-3">
            {homestays.map((stay) => (
              <div key={stay.id} className="bg-white rounded-xl shadow-sm p-3 flex gap-3">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  {stay.image && stay.image.startsWith('https') ? (
                    <Image src={stay.image} alt={stay.name || ""} width={96} height={96} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-500">No Image</div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <h3 className="font-medium text-sm text-gray-800">{stay.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{stay.location}</p>
                  <p className="text-xs text-emerald-600 font-semibold">₹{stay.pricepernight?.toLocaleString()}/night</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Nearby Attractions */}
      {nearby.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Nearby Attractions</h2>
          <div className="flex space-x-3 overflow-x-auto pb-1">
            {nearby.map((n) => (
              <div key={n.id} className="w-[160px] flex-shrink-0 bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="w-full h-24 bg-gray-100">
                  {n.image && n.image.startsWith('https') ? (
                    <Image src={n.image} alt={n.name || ""} width={160} height={96} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{n.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{n.district}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Contact Form */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Contact for Help or Booking</h2>
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
          <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">
            Send Message
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
