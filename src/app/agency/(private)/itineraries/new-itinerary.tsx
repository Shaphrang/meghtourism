// src/app/agency/(private)/itineraries/new-itinerary.tsx
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function NewItinerary({ providerId }: { providerId: string }) {
  const supabase = createClientComponentClient();
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createItin = async () => {
    const titleClean = title.trim();
    if (!providerId || !titleClean) return;

    setBusy(true);
    setError(null);

    try {
      // get current user id for RLS (created_by must equal auth.uid())
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) throw userErr;
      if (!user?.id) throw new Error("Not authenticated");

      const { error: insertError } = await supabase.from("itineraries").insert({
        title: titleClean,
        provider_id: providerId,
        created_by: user.id,         // ✅ required for RLS
        approval_status: "pending",  // explicit workflow
        visibilitystatus: "draft",
        is_active: true,
      });

      if (insertError) throw insertError;

      setTitle("");
      // simple refresh to show the new row
      window.location.reload();
    } catch (e: any) {
      setError(e?.message || "Failed to create itinerary");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border p-3 flex gap-2 items-start">
      <input
        className="flex-1 rounded-xl border p-2"
        placeholder="New itinerary title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={busy}
      />
      <div className="flex flex-col gap-1 items-stretch min-w-[96px]">
        <button
          onClick={createItin}
          disabled={busy || !title.trim()}
          className="rounded-xl bg-gray-900 text-white px-4 py-2 disabled:opacity-60"
        >
          {busy ? "Adding..." : "Add"}
        </button>
        {error && <span className="text-xs text-rose-600">{error}</span>}
      </div>
    </div>
  );
}
