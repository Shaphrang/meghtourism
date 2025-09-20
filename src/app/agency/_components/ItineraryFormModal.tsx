// src/app/agency/_components/ItineraryFormModal.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Dialog, Disclosure } from "@headlessui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { uploadImageToSupabase } from "@/lib/uploadToSupabase";
import { deleteImageFromSupabase } from "@/lib/deleteImageFromSupabase";
import { ItineraryZ } from "@/lib/schemas/itinerary";

/* helpers */
function toArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}
function publicImageUrl(path?: string | null) {
  // Back-compat for rows that still have storage paths.
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path; // already a URL
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/images/${encodeURI(path)}`;
}

/* types */
type DayPlan = { day: number; places: string[] };
type ItineraryRow = {
  id?: string;
  title: string | null;
  description: string | null;
  days: number | null;
  starting_point: string | null;
  ending_point: string | null;
  regions_covered: string[] | null;
  idealfor: string[] | null;
  theme: string[] | null;
  season: string | null;
  tags: string[] | null;
  estimated_cost: { currency?: string; min?: number; max?: number } | null;
  travel_mode: string[] | null;
  highlights: string[] | null;
  places_per_day: DayPlan[] | null;
  image: string | null;      // full URL (preferred) or legacy path
  gallery: string[] | null;  // full URLs (preferred) or legacy paths
  tips: string[] | null;
  warnings: string[] | null;
  customizable: boolean | null;
  districts: string[] | null;
  visit_season: string[] | null; // ✅ normalized
};

function emptyForm(): ItineraryRow {
  return {
    title: "",
    description: "",
    days: 1,
    starting_point: "",
    ending_point: "",
    regions_covered: [],
    idealfor: [],
    theme: [],
    season: null,
    tags: [],
    estimated_cost: null,
    travel_mode: [],
    highlights: [],
    places_per_day: [],
    image: null,
    gallery: [],
    tips: [],
    warnings: [],
    customizable: false,
    districts: [],
    visit_season: [],
  };
}

export default function ItineraryFormModal({
  open,
  mode, // 'create' | 'edit'
  providerId,
  rowId,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean;
  mode: "create" | "edit";
  providerId: string;
  rowId?: string;
  initial?: Partial<ItineraryRow>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClientComponentClient();
  const [form, setForm] = useState<ItineraryRow>(initial ? ({ ...emptyForm(), ...initial } as ItineraryRow) : emptyForm());
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleDayPlanChange = useCallback((val: DayPlan[]) => {
    setForm((f) => ({ ...f, places_per_day: val }));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1400);
  };

  // Load for edit
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (mode === "edit" && rowId) {
        const { data, error } = await supabase
          .from("itineraries")
          .select(
            [
              "id",
              "title",
              "description",
              "days",
              "starting_point",
              "ending_point",
              "regions_covered",
              "idealfor",
              "theme",
              "season",
              "tags",
              "estimated_cost",
              "travel_mode",
              "highlights",
              "places_per_day",
              "image",
              "gallery",
              "tips",
              "warnings",
              "customizable",
              "districts",
              "visit_season" // ✅ normalized
            ].join(",")
          )
          .eq("id", rowId)
          .single();

        if (cancelled) return;

        if (error) {
          console.error("[ItineraryFormModal] load error:", error);
          setForm((prev) => ({ ...prev, ...(initial || {}) }));
        } else {
          const row = (data ?? {}) as Partial<ItineraryRow>;
          setForm({
            ...(emptyForm() as any),
            ...row,
            regions_covered: toArray(row.regions_covered),
            idealfor: toArray(row.idealfor),
            theme: toArray(row.theme),
            tags: toArray(row.tags),
            travel_mode: toArray(row.travel_mode),
            highlights: toArray(row.highlights),
            gallery: toArray(row.gallery),
            tips: toArray(row.tips),
            warnings: toArray(row.warnings),
            districts: toArray(row.districts),
            visit_season: toArray(row.visit_season), // ✅
            places_per_day: Array.isArray(row.places_per_day) ? row.places_per_day : [],
            estimated_cost: row.estimated_cost ?? null,
          });
        }
      } else {
        // create mode
        setForm((prev) => ({ ...emptyForm(), ...(initial || {}) }));
      }
      setBusy(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, rowId, open]);

  // Show as-is (URL) or convert path -> URL if older data exists
  const imgUrl = useMemo(() => publicImageUrl(form?.image), [form?.image]);

  /* ─────────────── Images (admin-style) ─────────────── */

  // cover upload
  const upCover = async (file: File) => {
    if (!rowId) {
      showToast("Save once to enable uploads");
      return;
    }
    try {
      const url = await uploadImageToSupabase({
        file,
        category: "itineraries",
        id: rowId,
        type: "main",
        name: form.title || "itinerary",
      });
      if (!url) throw new Error("Upload failed");
      setForm((f) => ({ ...f, image: url })); // store full URL, like admin
      showToast("Cover image uploaded");
    } catch (e: any) {
      console.error("[ItineraryFormModal] cover upload error:", e);
      showToast(e?.message || "Upload failed");
    }
  };

  // gallery upload
  const upGallery = async (files: File[]) => {
    if (!rowId) {
      showToast("Save once to enable uploads");
      return;
    }
    try {
      for (const file of files) {
        const url = await uploadImageToSupabase({
          file,
          category: "itineraries",
          id: rowId,
          type: "gallery",
          name: (form.title || "itinerary") + "-gallery",
        });
        if (url) {
          setForm((f) => ({ ...f, gallery: [...toArray(f.gallery), url] }));
        }
      }
      showToast("Gallery updated");
    } catch (e: any) {
      console.error("[ItineraryFormModal] gallery upload error:", e);
      showToast(e?.message || "Upload failed");
    }
  };

  // cover delete
  const delCover = async () => {
    if (!form.image) return;
    try {
      const ok = await deleteImageFromSupabase(form.image);
      if (!ok) throw new Error("Delete failed");
      setForm((f) => ({ ...f, image: null }));
      showToast("Cover image removed");
    } catch (e: any) {
      console.error("[ItineraryFormModal] cover delete error:", e);
      showToast(e?.message || "Delete failed");
    }
  };

  // gallery delete
  const delGalleryItem = async (url: string, idx: number) => {
    try {
      const ok = await deleteImageFromSupabase(url);
      if (!ok) throw new Error("Delete failed");
      const next = [...toArray(form.gallery)];
      next.splice(idx, 1);
      setForm((f: any) => ({ ...f, gallery: next }));
      showToast("Image removed");
    } catch (e: any) {
      console.error("[ItineraryFormModal] gallery delete error:", e);
      showToast(e?.message || "Delete failed");
    }
  };

  /* ─────────────── Save (with Zod) ─────────────── */
  const save = async () => {
    setSaving(true);

    // Build raw payload from form state
    const raw: Partial<ItineraryRow> & { provider_id?: string } = {
      title: (form.title || "").trim() || "Untitled itinerary",
      description: form.description || null,
      days: form.days ? Number(form.days) : null,
      starting_point: form.starting_point || null,
      ending_point: form.ending_point || null,
      regions_covered: toArray(form.regions_covered),
      idealfor: toArray(form.idealfor),
      theme: toArray(form.theme),
      season: form.season || null,
      tags: toArray(form.tags),
      estimated_cost: form.estimated_cost || null,
      travel_mode: toArray(form.travel_mode),
      highlights: toArray(form.highlights),
      places_per_day: Array.isArray(form.places_per_day) ? form.places_per_day : [],
      image: form.image || null,
      gallery: toArray(form.gallery),
      tips: toArray(form.tips),
      warnings: toArray(form.warnings),
      customizable: !!form.customizable,
      districts: toArray(form.districts),
      visit_season: toArray(form.visit_season), // ✅ normalized
      // visibilitystatus default handled below
    };

    // Normalize images to public URLs before validation (supports legacy paths)
    const normalized = {
      ...raw,
      image: raw.image ? publicImageUrl(raw.image) : null,
      gallery: (raw.gallery ?? []).map((g) => publicImageUrl(g) || g).filter(Boolean) as string[],
    };

    try {
      // Validate with Zod
      const validated = ItineraryZ.parse({
        ...normalized,
        regions_covered: normalized.regions_covered ?? [],
        idealfor: normalized.idealfor ?? [],
        theme: normalized.theme ?? [],
        tags: normalized.tags ?? [],
        travel_mode: normalized.travel_mode ?? [],
        highlights: normalized.highlights ?? [],
        places_per_day: normalized.places_per_day ?? [],
        gallery: normalized.gallery ?? [],
        tips: normalized.tips ?? [],
        warnings: normalized.warnings ?? [],
        districts: normalized.districts ?? [],
        visit_season: normalized.visit_season ?? [],
        visibilitystatus: (initial as any)?.visibilitystatus ?? "draft",
      });

      let error;
      if (mode === "create") {
        // RLS-safe create
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        if (!user?.id) throw new Error("Not authenticated");

        (validated as any).provider_id = providerId;
        (validated as any).created_by = user.id;
        (validated as any).approval_status = "pending";

        ({ error } = await supabase.from("itineraries").insert(validated as any));
      } else {
        ({ error } = await supabase.from("itineraries").update(validated as any).eq("id", rowId!));
      }

      if (error) {
        console.error("[ItineraryFormModal] save error:", error);
        showToast(`Save failed: ${error.message}`);
        setSaving(false);
        return;
      }

      showToast("Saved");
      onSaved(); // refresh list in parent
      onClose(); // close modal
    } catch (e: any) {
      // Zod or runtime errors
      if (e?.issues?.length) {
        const first = e.issues[0];
        showToast(first?.message || "Validation failed");
      } else {
        console.error("[ItineraryFormModal] save exception:", e);
        showToast(e?.message || "Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ─────────────── UI (PWA-style) ─────────────── */
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-[60] flex"
    >
      {/* Dim background */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Sheet (mobile full-screen, desktop card) */}
      <div className="relative z-10 mx-auto w-full max-w-4xl sm:my-6 sm:rounded-2xl sm:overflow-hidden sm:shadow-2xl">
        {/* App bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wide/loose opacity-80">
                {mode === "create" ? "New itinerary" : "Edit itinerary"}
              </div>
              <div className="text-lg font-semibold truncate">
                {form.title || "Untitled itinerary"}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl bg-white/90 text-slate-900 hover:bg-white px-3 py-1.5 text-sm font-medium transition"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content scrollable area */}
        <div className="bg-white max-h-[calc(100vh-11rem)] sm:max-h-[70vh] overflow-y-auto">
          <div className="px-4 pb-28 pt-4 sm:pb-6">
            {busy ? (
              <div className="space-y-3">
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-24 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
                {/* Essentials */}
                <Card>
                  <SectionTitle title="Basics" />
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="Title">
                      <Input
                        value={form.title ?? ""}
                        onChange={(v) => setForm({ ...form, title: v })}
                        placeholder="e.g., 7-Day Meghalaya Backpacking"
                      />
                    </Field>
                    <Field label="Days">
                      <Input
                        type="number"
                        min={1}
                        value={form.days ?? ""}
                        onChange={(v) => setForm({ ...form, days: Number(v || 0) })}
                        placeholder="e.g., 7"
                      />
                    </Field>
                    <Field label="Starting point">
                      <Input
                        value={form.starting_point ?? ""}
                        onChange={(v) => setForm({ ...form, starting_point: v })}
                        placeholder="e.g., Guwahati"
                      />
                    </Field>
                    <Field label="Ending point">
                      <Input
                        value={form.ending_point ?? ""}
                        onChange={(v) => setForm({ ...form, ending_point: v })}
                        placeholder="e.g., Shillong"
                      />
                    </Field>
                    <Field label="Description" full>
                      <Textarea
                        rows={4}
                        value={form.description ?? ""}
                        onChange={(v) => setForm({ ...form, description: v })}
                        placeholder="Brief summary and what to expect…"
                      />
                    </Field>
                  </div>
                </Card>

                {/* Tags & Meta */}
                <Collapse title="Tags & Meta" defaultOpen>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Chips label="Regions covered" value={form.regions_covered} onChange={(v) => setForm({ ...form, regions_covered: v })} />
                    <Chips label="Ideal for" value={form.idealfor} onChange={(v) => setForm({ ...form, idealfor: v })} />
                    <Chips label="Theme" value={form.theme} onChange={(v) => setForm({ ...form, theme: v })} />
                    <Field label="Season">
                      <Input value={form.season ?? ""} onChange={(v) => setForm({ ...form, season: v })} placeholder="e.g., Oct–Mar" />
                    </Field>
                    <Chips label="Tags" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
                    <Chips label="Travel mode" value={form.travel_mode} onChange={(v) => setForm({ ...form, travel_mode: v })} />
                    <Chips label="Highlights" value={form.highlights} onChange={(v) => setForm({ ...form, highlights: v })} />
                  </div>
                </Collapse>

                {/* Planner & Cost */}
                <Collapse title="Planner & Cost">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <CostEditor value={form.estimated_cost} onChange={(v) => setForm({ ...form, estimated_cost: v })} />
                    <Toggle label="Customizable" checked={!!form.customizable} onChange={(v) => setForm({ ...form, customizable: v })} />
                  </div>
                  <DayPlanner
                    value={(form.places_per_day as DayPlan[]) || []}
                    onChange={handleDayPlanChange}
                  />
                </Collapse>

                {/* Images */}
                <Collapse title="Images">
                  <div className="md:col-span-2">
                    <div className="text-sm font-medium">Cover image</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="w-28 h-28 rounded-2xl border overflow-hidden bg-gray-50 ring-1 ring-black/5">
                        {imgUrl ? (
                          <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-xs text-gray-500">No image</div>
                        )}
                      </div>

                      {mode === "edit" && rowId ? (
                        <div className="flex items-center gap-2">
                          <label className="rounded-xl border px-3 py-2 text-sm bg-white hover:bg-gray-50 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && upCover(e.target.files[0])}
                            />
                            Upload
                          </label>
                          {form.image && (
                            <button className="rounded-xl border px-3 py-2 text-sm" onClick={delCover}>
                              Remove
                            </button>
                          )}
                        </div>
                      ) : (
                        <button className="rounded-xl border px-3 py-2 text-sm opacity-60 cursor-not-allowed" title="Save once, then upload image">
                          Save once to enable uploads
                        </button>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-medium">Gallery</div>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {toArray(form.gallery).map((u: string, idx: number) => (
                          <div key={idx} className="w-20 h-20 rounded-xl border overflow-hidden relative ring-1 ring-black/5">
                            <img src={publicImageUrl(u) || ""} className="w-full h-full object-cover" alt="" />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-white/95 border rounded px-1 text-[10px] shadow"
                              onClick={() => delGalleryItem(u, idx)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}

                        {mode === "edit" && rowId ? (
                          <label className="rounded-xl border px-3 py-2 text-sm bg-white hover:bg-gray-50 cursor-pointer">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length) upGallery(files as File[]);
                              }}
                            />
                            Add images
                          </label>
                        ) : (
                          <button className="rounded-xl border px-3 py-2 text-sm opacity-60 cursor-not-allowed" title="Save once, then upload images">
                            Save once to add gallery
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Collapse>

                {/* Extra */}
                <Collapse title="Extra">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Chips label="Tips" value={form.tips} onChange={(v) => setForm({ ...form, tips: v })} />
                    <Chips label="Warnings" value={form.warnings} onChange={(v) => setForm({ ...form, warnings: v })} />
                    <Chips label="Districts" value={form.districts} onChange={(v) => setForm({ ...form, districts: v })} />
                    <Chips label="Visit season" value={form.visit_season} onChange={(v) => setForm({ ...form, visit_season: v })} />
                  </div>
                </Collapse>
              </>
            )}
          </div>
        </div>

        {/* Sticky bottom action bar (safe-area aware) */}
        <div className="bg-white border-t sticky bottom-0 z-10 px-4 pb-2 py-3 sm:rounded-b-2xl [padding-bottom:env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="h-11 rounded-xl border px-4 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="h-11 rounded-xl px-5 text-sm font-medium text-white bg-gradient-to-br from-indigo-600 to-slate-900 shadow hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* Tiny toast (centered) */}
        {toast && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-24 sm:bottom-8 z-[70]">
            <div className="rounded-full bg-gray-900 text-white px-4 py-2 text-sm shadow-lg">
              {toast}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

/* ---------- PWA-styled atoms ---------- */
function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-white p-4 shadow-sm">{children}</section>;
}
function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold text-gray-800">{title}</h3>;
}
function Collapse({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <section className="rounded-2xl border bg-white p-3 shadow-sm mt-4">
          <Disclosure.Button className="w-full flex items-center justify-between text-left">
            <div className="text-sm font-semibold text-gray-800">{title}</div>
            <span className="text-xs text-gray-500">{open ? "Hide" : "Show"}</span>
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="mt-3">{children}</div>
          </Disclosure.Panel>
        </section>
      )}
    </Disclosure>
  );
}
function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
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
  min,
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
}) {
  return (
    <input
      value={value as any}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      min={min}
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
function Chips({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[] | string | null | undefined;
  onChange: (v: string[]) => void;
}) {
  const arr = toArray(value);
  const [txt, setTxt] = useState("");
  return (
    <div>
      <div className="text-sm font-medium text-gray-800">{label}</div>
      <div className="mt-1 flex flex-wrap gap-2">
        {arr.map((v, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full border"
          >
            {v}
            <button
              type="button"
              className="ml-1 text-gray-500 hover:text-gray-700"
              onClick={() => {
                const next = [...arr];
                next.splice(i, 1);
                onChange(next);
              }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className="flex-1 h-11 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Type and press Add"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
        />
        <button
          type="button"
          className="h-11 rounded-xl border px-3 text-sm bg-white hover:bg-gray-50"
          onClick={() => {
            const v = txt.trim();
            if (!v) return;
            onChange([...arr, v]);
            setTxt("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-800">{label}</div>
      <label className="mt-2 inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 rounded border"
        />
        <span>{checked ? "Yes" : "No"}</span>
      </label>
    </div>
  );
}
function DayPlanner({ value, onChange }: { value: DayPlan[]; onChange: (v: DayPlan[]) => void }) {
  const [items, setItems] = useState<DayPlan[]>(Array.isArray(value) ? value : []);
  useEffect(() => onChange(items), [items, onChange]);
  const addDay = () => {
    const day = (items.at(-1)?.day ?? 0) + 1;
    setItems([...items, { day, places: [] }]);
  };
  return (
    <div className="md:col-span-2 mt-2">
      <div className="text-sm font-medium text-gray-800">Day planner (places per day)</div>
      <div className="mt-2 space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-2xl border p-3 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">Day {it.day}</div>
              <button
                type="button"
                className="text-xs rounded-lg border px-2 py-1 hover:bg-gray-50"
                onClick={() => {
                  const next = [...items];
                  next.splice(idx, 1);
                  setItems(next);
                }}
              >
                Remove
              </button>
            </div>
            <Chips
              label="Places (chips)"
              value={it.places}
              onChange={(v) => {
                const next = [...items];
                next[idx] = { ...next[idx], places: v };
                setItems(next);
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2">
        <button
          type="button"
          className="h-11 rounded-xl border px-3 text-sm bg-white hover:bg-gray-50"
          onClick={addDay}
        >
          Add day
        </button>
      </div>
    </div>
  );
}
function CostEditor({
  value,
  onChange,
}: {
  value: { currency?: string; min?: number; max?: number } | null | undefined;
  onChange: (v: { currency?: string; min?: number; max?: number } | null) => void;
}) {
  const [currency, setCurrency] = useState(value?.currency ?? "INR");
  const [min, setMin] = useState<string>(value?.min?.toString?.() ?? "");
  const [max, setMax] = useState<string>(value?.max?.toString?.() ?? "");
  useEffect(() => {
    if (!currency && !min && !max) onChange(null);
    else onChange({ currency: currency || "INR", min: min ? Number(min) : undefined, max: max ? Number(max) : undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, min, max]);
  return (
    <div>
      <div className="text-sm font-medium text-gray-800">Estimated cost</div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <input
          className="h-11 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
        <input
          className="h-11 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <input
          className="h-11 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
      </div>
    </div>
  );
}
