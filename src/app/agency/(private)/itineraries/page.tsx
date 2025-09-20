//src\app\agency\(private)\itineraries\page.tsx
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import NewItinerary from "./new-itinerary";

export const dynamic = "force-dynamic";

export default async function ItinerariesPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: agency } = await supabase
    .from("tourism_agencies")
    .select("id,name")
    .eq("owner_user_id", user?.id ?? "")
    .single();

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
        {(rows ?? []).map((r) => (
          <li key={r.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-gray-600">
                {!r.is_active ? "Inactive - " : ""}
                {r.visibilitystatus} - {r.approval_status}
              </div>
            </div>
            <div className="flex gap-2">
              <a className="rounded-lg border px-3 py-1 text-sm" href={`/agency/itineraries/${r.id}`}>
                Edit
              </a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
