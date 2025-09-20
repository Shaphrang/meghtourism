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

  // Keep form in sync if server sends a fresher row
  useEffect(() => setForm(agency ?? {}), [agency]);

  const showToast = (msg: string, then?: () => void) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
      if (then) then();
    }, 1100);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    const payload = {
      short_description: form.short_description ?? null,
      about: form.about ?? null,
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

    const { data: reloaded } = await supabase
      .from("tourism_agencies")
      .select("*")
      .eq("id", agency.id)
      .single();
    if (reloaded) setForm(reloaded);

    showToast("Profile updated", () => router.replace("/agency"));
  };

  const logoUrl = publicImageUrl(form.logo_url);
  const coverUrl = publicImageUrl(form.cover_image_url);
  const locationText = [form.city, form.district].filter(Boolean).join(", ");

  return (
    <main className="min-h-[100svh] bg-gray-50">
      {/* Minimal, professional gradient app bar */}
      <header className="sticky top-0 z-40 text-white bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wide/loose opacity-80">Agency</div>
            <div className="text-lg font-semibold truncate">{agency?.name || "Agency Profile"}</div>
          </div>
          <button
            onClick={() => router.replace("/agency")}
            className="rounded-xl bg-white/90 text-slate-900 hover:bg-white px-3 py-1.5 text-sm font-medium transition"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <form onSubmit={save} className="mx-auto w-full max-w-3xl px-4 py-4">
        {/* Compact identity card */}
        <section className="rounded-2xl border bg-white shadow-sm p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border bg-gray-100 shrink-0 ring-1 ring-black/5">
              {logoUrl ? (
                <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" />
              ) : (
                <div className="w-full h-full grid place-items-center text-[11px] text-gray-500">Logo</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-semibold truncate">{agency?.name || "—"}</div>
              <div className="text-[12px] text-gray-500 truncate">{locationText || "Location not set"}</div>
              <div className="mt-2 flex items-center gap-2">
                {form.email ? <Badge>{form.email}</Badge> : <Badge muted>Email not set</Badge>}
                {form.phone ? <Badge>{form.phone}</Badge> : <Badge muted>Phone not set</Badge>}
              </div>
            </div>
          </div>
        </section>

        {/* Brand Images */}
        <section className="rounded-2xl border bg-white shadow-sm p-4 mt-4">
          <SectionTitle title="Brand Images" />
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cover */}
            <div>
              <div className="text-sm font-medium">Cover image</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="w-40 h-28 rounded-2xl border overflow-hidden bg-gray-50 ring-1 ring-black/5">
                  {coverUrl ? (
                    <img src={coverUrl} className="w-full h-full object-cover" alt="Cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-xs text-gray-500">No image</div>
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

            {/* Logo */}
            <div>
              <div className="text-sm font-medium">Logo</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="w-28 h-28 rounded-2xl border overflow-hidden bg-gray-50 ring-1 ring-black/5">
                  {logoUrl ? (
                    <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-xs text-gray-500">No logo</div>
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
          </div>
        </section>

        {/* Contact & business */}
        <Card title="Contact & Business">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Email">
              <Input
                value={form.email || ""}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="contact@agency.com"
              />
            </Field>
            <Field label="Phone">
              <Input
                value={form.phone || ""}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+91 98xxxxxxx"
              />
            </Field>
            <Field label="Website">
              <Input
                value={form.website || ""}
                onChange={(v) => setForm({ ...form, website: v })}
                placeholder="https://example.com"
              />
            </Field>
            <Field label="GSTIN">
              <Input
                value={form.gstin || ""}
                onChange={(v) => setForm({ ...form, gstin: v })}
                placeholder="GSTIN"
              />
            </Field>
          </div>
        </Card>

        {/* Location */}
        <Card title="Location">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="City">
              <Input
                value={form.city || ""}
                onChange={(v) => setForm({ ...form, city: v })}
                placeholder="City"
              />
            </Field>
            <Field label="District">
              <Input
                value={form.district || ""}
                onChange={(v) => setForm({ ...form, district: v })}
                placeholder="District"
              />
            </Field>
            <Field label="Pincode">
              <Input
                value={form.pincode || ""}
                onChange={(v) => setForm({ ...form, pincode: v })}
                placeholder="PIN"
              />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Address">
              <Textarea
                rows={3}
                value={form.address || ""}
                onChange={(v) => setForm({ ...form, address: v })}
                placeholder="Street address"
              />
            </Field>
          </div>
        </Card>

        {/* About */}
        <Card title="About">
          <Field label="Short description">
            <Textarea
              rows={3}
              value={form.short_description || ""}
              onChange={(v) => setForm({ ...form, short_description: v })}
              placeholder="A quick one-liner about your agency"
            />
          </Field>
          <div className="mt-3">
            <Field label="About">
              <Textarea
                rows={6}
                value={form.about || ""}
                onChange={(v) => setForm({ ...form, about: v })}
                placeholder="Tell more about your services, experience, and team…"
              />
            </Field>
          </div>
        </Card>

        {/* Normal action row at end */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-11 rounded-xl px-5 text-sm font-medium border bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="h-11 rounded-xl px-5 text-sm font-medium text-white bg-gradient-to-br from-indigo-600 to-slate-900 shadow hover:opacity-95 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70]">
          <div className="rounded-full bg-gray-900 text-white px-4 py-2 text-sm shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- UI atoms ---------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm p-4 mt-4">
      <SectionTitle title={title} />
      <div className="mt-3">{children}</div>
    </section>
  );
}
function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-sm font-semibold text-gray-800">{title}</h2>;
}
function Field({ label, children }: any) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-800">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="w-full h-11 rounded-xl border px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
    />
  );
}
function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
    />
  );
}
function Badge({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] ${
        muted ? "bg-gray-50 text-gray-500 border-gray-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"
      }`}
    >
      {children}
    </span>
  );
}
