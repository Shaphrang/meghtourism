"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Star } from "lucide-react";

interface Props {
  category: string;
  itemId: string;
}

export default function AverageRating({ category, itemId }: Props) {
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    async function fetchAverage() {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("category", category)
        .eq("item_id", itemId)
        .eq("approved", true);
      if (!error && data) {
        const ratings = data.map((r) => r.rating as number);
        const total = ratings.reduce((a, b) => a + b, 0);
        setCount(ratings.length);
        setAverage(ratings.length ? total / ratings.length : null);
      }
    }
    fetchAverage();
  }, [category, itemId]);

  if (average === null || count === 0)
    return <div className="text-sm text-gray-600">No reviews yet</div>;

  return (
    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
      <Star size={16} className="text-yellow-500 fill-yellow-300" />
      {average.toFixed(1)}
      <span className="text-gray-500">· Based on {count} reviews</span>
    </div>
  );
}