//src\app\agency\(private)\itineraries\[id]\page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import CoverImageSection from "./CoverImageSection";

export const dynamic = "force-dynamic";

export default async function EditItinerary({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/agency/login");

  const { data: agency } = await supabase
    .from("tourism_agencies")
    .select("id,name")
    .eq("owner_user_id", user.id)
    .single();

  const { data: itinerary } = await supabase
    .from("itineraries")
    .select("id,title,image")
    .eq("id", params.id)
    .single();

  if (!agency || !itinerary) {
    return <main className="p-6">Not found.</main>;
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Edit: {itinerary.title ?? "Itinerary"}</h1>
      <CoverImageSection
        agencyId={agency.id}
        itineraryId={itinerary.id}
        title={itinerary.title ?? "Itinerary"}
        coverImagePath={itinerary.image ?? null}
      />
    </main>
  );
}
