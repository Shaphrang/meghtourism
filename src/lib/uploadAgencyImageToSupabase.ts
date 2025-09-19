"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import imageCompression from "browser-image-compression";
import { slugify } from "@/lib/utils";

/**
 * Agency-scoped uploader for the single 'images' bucket.
 * Builds path: agencies/{agencyId}/{category}/{rowId}/{filename}
 * Returns: { url, path } (what AgencyImageUploader expects)
 */
export async function uploadToSupabase({
  file,
  agencyId,
  category,   // "itineraries" | "rentals" | "thrills" | "agency"
  rowId,      // the row id (e.g. itinerary id)
  type,       // "main" | "gallery"
  name = "",
}: {
  file: File;
  agencyId: string;
  category: "itineraries" | "rentals" | "thrills" | "agency";
  rowId: string;
  type: "main" | "gallery";
  name?: string;
}): Promise<{ url: string | null; path: string }> {
  const supabase = createClientComponentClient();

  // 1) compress client-side for fast uploads
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
  });

  // 2) build a nice filename keeping original extension
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = name ? slugify(name) : rowId;
  const filename =
    type === "main"
      ? `main-${safeName}.${ext}`
      : `gallery-${safeName}-${Date.now()}.${ext}`;

  // 3) IMPORTANT: agency-scoped path (works with/without RLS policies)
  const path = `agencies/${agencyId}/${category}/${rowId}/${filename}`;

  // 4) upload to your *existing* public bucket 'images'
  const { error } = await supabase.storage
    .from("images")
    .upload(path, compressed, { upsert: true });

  if (error) {
    console.error("Upload error:", error.message);
    return { url: null, path };
  }

  // 5) get a public URL and add cache-buster
  const { data } = supabase.storage.from("images").getPublicUrl(path);
  const url = data?.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : null;

  return { url, path };
}
