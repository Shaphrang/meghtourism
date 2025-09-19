//src\app\agency\(private)\itineraries\new-itinerary.tsx

"use client";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabaseClients";

export default function NewItinerary({ providerId }: { providerId: string }) {
  const supabase = getBrowserClient();
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const createItin = async () => {
    if (!providerId || !title.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("itineraries").insert({
      title,
      provider_id: providerId,        // ownership (RLS)
      visibilitystatus: "draft",
      is_active: true,
    });
    setBusy(false);
    if (!error) { setTitle(""); location.reload(); } // simplest refresh
  };

  return (
    <div className="rounded-2xl border p-3 flex gap-2">
      <input className="flex-1 rounded-xl border p-2" placeholder="New itinerary title"
             value={title} onChange={e=>setTitle(e.target.value)}/>
      <button onClick={createItin} disabled={busy} className="rounded-xl bg-gray-900 text-white px-4">
        {busy ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
