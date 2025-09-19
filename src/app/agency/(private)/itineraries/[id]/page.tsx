//src\app\agency\(private)\itineraries\[id]\page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import AgencyImageUploader from "@/components/agencyImageUploader"; // path to your uploaded file

export const dynamic = "force-dynamic";

export default async function EditItinerary({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/agency/login");

  const { data: agency } = await supabase
    .from("tourism_agencies").select("id,name").eq("owner_user_id", user.id).single();

  const { data: itin } = await supabase
    .from("itineraries")
    .select("id,title,cover_image_path")
    .eq("id", params.id)
    .single();

  if (!agency || !itin) return <main className="p-6">Not found.</main>;

  const publicUrl = (path?: string | null) =>
    path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${encodeURI(path)}` : null;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Edit: {itin.title}</h1>

      <section className="space-y-2">
        <div className="text-sm font-medium">Cover image</div>
        <AgencyImageUploader
          agencyId={agency.id}
          category="itineraries"
          rowId={itin.id}
          type="main"
          name={itin.title}
          onUploaded={async (_url, path) => {
            // store storage PATH on the row (recommended)
            "use server";
            // ← NOTE: If you prefer, handle update via a client form:
            // const supabase = createClientComponentClient(); supabase.from("itineraries").update({ cover_image_path: path }).eq("id", itin.id)
          }}
        />
        {itin.cover_image_path && (
          <img
            className="rounded-xl border max-w-md"
            src={publicUrl(itin.cover_image_path) ?? ""}
            alt="Cover"
          />
        )}
      </section>
    </main>
  );
}
