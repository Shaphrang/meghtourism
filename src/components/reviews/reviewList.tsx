"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Star } from "lucide-react";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface Props {
  category: string;
  itemId: string;
}

export default function ReviewList({ category, itemId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, user_name, rating, review_text, created_at")
        .eq("category", category)
        .eq("item_id", itemId)
        .eq("approved", true)
        .order("created_at", { ascending: false });
      if (!error && data) setReviews(data as Review[]);
    }
    fetchReviews();
  }, [category, itemId]);

  if (!reviews.length)
    return <p className="text-sm text-gray-600">No reviews yet.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <div key={rev.id} className="border-b pb-3">
          <p className="font-medium text-sm text-gray-800">{rev.user_name}</p>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: rev.rating }).map((_, i) => (
              <Star key={i} size={14} className="text-yellow-500 fill-yellow-300" />
            ))}
          </div>
          <p className="text-sm mt-1">{rev.review_text}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(rev.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}