"use client";
import { useState } from "react";
import { uploadToSupabase } from "@/lib/uploadAgencyImageToSupabase";

export default function AgencyImageUploader({
  agencyId,
  category,
  rowId,
  type = "main",
  name = "",
  onUploaded,
}: {
  agencyId: string;
  category: "itineraries" | "rentals" | "thrills" | "agency";
  rowId: string;
  type?: "main" | "gallery";
  name?: string;
  onUploaded?: (url: string | null, path: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <input
      type="file"
      accept="image/*"
      disabled={busy}
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBusy(true);
        const { url, path } = await uploadToSupabase({
          file,
          agencyId,
          category,
          rowId,
          type,
          name,
        });
        setBusy(false);
        onUploaded?.(url, path);
      }}
    />
  );
}
