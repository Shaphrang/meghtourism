//src\app\agency\(private)\itineraries\page.tsx

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export default async function ItinerariesPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const { data: agency } = await supabase
    .from("tourism_agencies").select("id,name").eq("owner_user_id", user?.id ?? "").single();

  const { data: rows } = await supabase
    .from("itineraries")
    .select("id,title,approval_status,visibilitystatus,is_active,updated_at")
    .eq("provider_id", agency?.id ?? "")
    .order("updated_at", { ascending: false });

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Itineraries</h1>
      {agency && <NewItinerary providerId={agency.id} />}
      <ul className="divide-y">
        {(rows ?? []).map(r => (
          <li key={r.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-gray-600">
                {r.is_active ? "" : "Inactive · "} {r.visibilitystatus} · {r.approval_status}
              </div>
            </div>
            <div className="flex gap-2">
              <a className="rounded-lg border px-3 py-1 text-sm" href={`/agency/itineraries/${r.id}`}>Edit</a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

// tiny client component inline (keeps files minimal)
function NewItinerary({ providerId }: { providerId: string }) {
  return <ClientCreate providerId={providerId} />;
}

"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function ClientCreate({ providerId }: { providerId: string }) {
  const supabase = createClientComponentClient();
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const createRow = async () => {
    if (!title.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("itineraries").insert({
      title, provider_id: providerId, visibilitystatus: "draft", is_active: true
    });
    setBusy(false);
    if (!error) location.reload();
  };

  return (
    <div className="rounded-2xl border p-3 flex gap-2">
      <input className="flex-1 rounded-xl border p-2" placeholder="New itinerary title"
             value={title} onChange={e=>setTitle(e.target.value)} />
      <button onClick={createRow} disabled={busy} className="rounded-xl bg-gray-900 text-white px-4">
        {busy ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
