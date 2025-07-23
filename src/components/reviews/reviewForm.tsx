"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface Props {
  category: string;
  itemId: string;
}

export default function ReviewForm({ category, itemId }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    rating: "5",
    review: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.rating) return;
    setLoading(true);
    const { error } = await supabase.from("ratings_reviews").insert([
      {
        category,
        item_id: itemId,
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        rating: Number(form.rating),
        review: form.review,
      },
    ]);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Failed to submit");
    } else {
      toast.success("Review submitted for approval");
      setForm({ name: "", email: "", phone: "", rating: "5", review: "" });
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="space-y-4 p-6 bg-zinc-50 rounded-xl border border-zinc-200 shadow-[0_3px_12px_rgba(0,0,0,0.06)] max-w-xl mx-auto"
>
      <h3 className="text-lg font-semibold text-gray-800">Leave a Review</h3>

      {/* Name */}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-600">Name *</label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your name"
          required
          value={form.name}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-600">Email (optional)</label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label htmlFor="phone" className="text-sm font-medium text-gray-600">Phone (optional)</label>
        <Input
          id="phone"
          name="phone"
          placeholder="Your contact number"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      {/* Rating */}
      {/* Star Rating Input */}
      <div className="space-y-1">
        <label htmlFor="rating" className="text-sm font-medium text-gray-600">Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setForm({ ...form, rating: String(star) })}
              className="text-2xl transition transform hover:scale-110"
              aria-label={`Rate ${star}`}
            >
              {star <= parseInt(form.rating) ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </div>


      {/* Review */}
      <div className="space-y-1">
        <label htmlFor="review" className="text-sm font-medium text-gray-600">Review *</label>
        <Textarea
          id="review"
          name="review"
          placeholder="Share your experience..."
          rows={4}
          value={form.review}
          onChange={handleChange}
          required
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
