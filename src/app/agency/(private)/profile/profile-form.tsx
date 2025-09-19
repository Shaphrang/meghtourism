//src\app\agency\(private)\profile\profile-form.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AgencyImageUploader from "../../../../components/agencyImageUploader";

/** Build a public URL for images/<path> */
function publicImageUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path; // already a full URL
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/images/${encodeURI(path)}`;
}

export default function ProfileForm({ agency }: { agency: any }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Form state seeded from the server-provided agency row
  const [form, setForm] = useState(agency ?? {});
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Keep form in sync if server sends a fresher row (nav replacements etc.)
  useEffect(() => setForm(agency ?? {}), [agency]);

  const showToast = (msg: string, then?: () => void) => {
    setToast(msg);
    // Keep toast visible briefly, then optionally run "then" (redirect)
    setTimeout(() => {
      setToast(null);
      if (then) then();
    }, 900);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    // Only the allowed/known columns for tourism_agencies
    const payload = {
      short_description: form.short_description ?? null,
      about: form.about ?? null,
      // logo_url and cover_image_url are set via uploaders below
      logo_url: form.logo_url ?? null,
      cover_image_url: form.cover_image_url ?? null,
      email: form.email ?? null,
      phone: form.phone ?? null,
      whatsapp: form.whatsapp ?? null,
      website: form.website ?? null,
      address: form.address ?? null,
      city: form.city ?? null,
      district: form.district ?? null,
      pincode: form.pincode ?? null,
      gstin: form.gstin ?? null,
      years_in_service: form.years_in_service ? Number(form.years_in_service) : null,
      social: form.social || null,
      show_public_profile: !!form.show_public_profile,
    };

    console.debug("[Profile] updating agency", agency.id, payload);
    const { error } = await supabase
      .from("tourism_agencies")
      .update(payload)
      .eq("id", agency.id);

    setBusy(false);

    if (error) {
      console.error("[Profile] update error:", error);
      showToast(`Save failed (${error.code ?? ""}): ${error.message}`);
      return;
    }

    // Optional refetch for immediate local state reflect (not strictly needed since we redirect)
    const { data: reloaded } = await supabase
      .from("tourism_agencies")
      .select("*")
      .eq("id", agency.id)
      .single();
    if (reloaded) setForm(reloaded);

    // ✅ Show toast, then redirect to /agency (dashboard)
    showToast("Profile updated", () => router.replace("/agency"));
  };

  const logoUrl = publicImageUrl(form.logo_url);
  const coverUrl = publicImageUrl(form.cover_image_url);

  return (
    <main className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <h1 className="text-xl font-bold">Agency profile</h1>

      <form onSubmit={save} className="mt-4 space-y-4">
        {/* Read-only name from registration */}
        <Read label="Name" value={agency?.name} />

        {/* Contact / basics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Email">
            <input
              className="w-full rounded-xl border p-2"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <input
              className="w-full rounded-xl border p-2"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Website">
            <input
              className="w-full rounded-xl border p-2"
              value={form.website || ""}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </Field>
          <Field label="GSTIN">
            <input
              className="w-full rounded-xl border p-2"
              value={form.gstin || ""}
              onChange={(e) => setForm({ ...form, gstin: e.target.value })}
            />
          </Field>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="City">
            <input
              className="w-full rounded-xl border p-2"
              value={form.city || ""}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </Field>
          <Field label="District">
            <input
              className="w-full rounded-xl border p-2"
              value={form.district || ""}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            />
          </Field>
          <Field label="Pincode">
            <input
              className="w-full rounded-xl border p-2"
              value={form.pincode || ""}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />
          </Field>
        </div>

        {/* Description */}
        <Field label="Short description">
          <textarea
            rows={3}
            className="w-full rounded-xl border p-2"
            value={form.short_description || ""}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          />
        </Field>

        <Field label="About">
          <textarea
            rows={6}
            className="w-full rounded-xl border p-2"
            value={form.about || ""}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
          />
        </Field>

        {/* IMAGES — Replace text fields with uploaders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Logo */}
          <div>
            <div className="text-sm font-medium">Logo</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="w-28 h-28 rounded-xl border overflow-hidden bg-gray-50">
                {logoUrl ? (
                  <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-xs text-gray-500">
                    No logo
                  </div>
                )}
              </div>
              <AgencyImageUploader
                agencyId={agency.id}
                category="agency"
                rowId={agency.id}
                type="main"
                name={(agency.name || "agency") + "-logo"}
                onUploaded={(_url, path) => {
                  setForm((f: any) => ({ ...f, logo_url: path }));
                }}
              />
            </div>
          </div>

          {/* Cover image */}
          <div>
            <div className="text-sm font-medium">Cover image</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="w-40 h-28 rounded-xl border overflow-hidden bg-gray-50">
                {coverUrl ? (
                  <img src={coverUrl} className="w-full h-full object-cover" alt="Cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-xs text-gray-500">
                    No image
                  </div>
                )}
              </div>
              <AgencyImageUploader
                agencyId={agency.id}
                category="agency"
                rowId={agency.id}
                type="main"
                name={(agency.name || "agency") + "-cover"}
                onUploaded={(_url, path) => {
                  setForm((f: any) => ({ ...f, cover_image_url: path }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-2">
          <button disabled={busy} className="rounded-xl bg-gray-900 text-white px-4 py-2">
            {busy ? "Saving..." : "Save"}
          </button>
          <span className="text-xs text-gray-500">
            Changes will reflect on your public profile later.
          </span>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-full bg-gray-900 text-white px-4 py-2 text-sm shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: any) {
  return (
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
function Read({ label, value }: any) {
  return (
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-1 rounded-xl border bg-gray-50 p-2 text-sm">{value}</div>
    </div>
  );
}
