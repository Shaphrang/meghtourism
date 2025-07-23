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
    user_name: "",
    email: "",
    phone: "",
    rating: "5",
    review_text: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user_name || !form.rating) return;
    setLoading(true);
    const { error } = await supabase.from("reviews").insert([
      {
        category,
        item_id: itemId,
        user_name: form.user_name,
        email: form.email || null,
        phone: form.phone || null,
        rating: Number(form.rating),
        review_text: form.review_text,
      },
    ]);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Failed to submit");
    } else {
      toast.success("Review submitted for approval");
      setForm({ user_name: "", email: "", phone: "", rating: "5", review_text: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        name="user_name"
        placeholder="Your Name"
        required
        value={form.user_name}
        onChange={handleChange}
      />
      <Input
        name="email"
        type="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        name="phone"
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={handleChange}
      />
      <select
        name="rating"
        value={form.rating}
        onChange={handleChange}
        className="w-full border rounded-md px-3 py-2 bg-transparent"
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <Textarea
        name="review_text"
        placeholder="Your Review"
        rows={3}
        value={form.review_text}
        onChange={handleChange}
        required
      />
      <Button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white">
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}