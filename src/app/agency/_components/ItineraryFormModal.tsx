"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, Disclosure } from "@headlessui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AgencyImageUploader from "../../../components/agencyImageUploader";
import { useCallback } from "react";

/* helpers */
function toArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}
function publicImageUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
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
  image: string | null;
  gallery: string[] | null;
  tips: string[] | null;
  warnings: string[] | null;
  customizable: boolean | null;
  districts: string[] | null;
  visit_season: string[] | null;
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
    // use functional update so it doesn’t depend on previous `form` identity
    setForm((f) => ({ ...f, places_per_day: val }));
    }, []);


  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 900);
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
              "visit_season",
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
            visit_season: toArray(row.visit_season),
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

  const imgUrl = useMemo(() => publicImageUrl(form?.image), [form?.image]);

  const save = async () => {
    setSaving(true);

    const payload: Partial<ItineraryRow> & { provider_id?: string } = {
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
      visit_season: toArray(form.visit_season),
    };

    let error;
    if (mode === "create") {
      payload.provider_id = providerId;
      ({ error } = await supabase.from("itineraries").insert(payload as any));
    } else {
      ({ error } = await supabase.from("itineraries").update(payload as any).eq("id", rowId!));
    }

    setSaving(false);
    if (error) {
      console.error("[ItineraryFormModal] save error:", error);
      showToast(`Save failed: ${error.message}`);
      return;
    }

    showToast("Saved");
    onSaved(); // refresh list in parent
    onClose(); // close modal
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-2xl z-10 w-full max-w-4xl overflow-y-auto max-h-[95vh]">
        <Dialog.Title className="text-lg font-semibold">
          {mode === "create" ? "Create Itinerary" : "Edit Itinerary"}
        </Dialog.Title>

        {busy ? (
          <div className="mt-4 space-y-2">
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          <>
            {/* Essentials */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Title">
                <input
                  className="w-full rounded-xl border p-2"
                  value={form.title ?? ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </Field>
              <Field label="Days">
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-xl border p-2"
                  value={form.days ?? ""}
                  onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
                />
              </Field>
              <Field label="Starting point">
                <input
                  className="w-full rounded-xl border p-2"
                  value={form.starting_point ?? ""}
                  onChange={(e) => setForm({ ...form, starting_point: e.target.value })}
                />
              </Field>
              <Field label="Ending point">
                <input
                  className="w-full rounded-xl border p-2"
                  value={form.ending_point ?? ""}
                  onChange={(e) => setForm({ ...form, ending_point: e.target.value })}
                />
              </Field>
              <Field label="Description" full>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border p-2"
                  value={form.description ?? ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>
            </div>

            {/* Collapsible sections */}
            <Disclosure defaultOpen>
              {({ open }) => (
                <div className="mt-4">
                  <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                    <span className={open ? "" : "opacity-70"}>🧭 Tags & Meta</span>
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Chips label="Regions covered" value={form.regions_covered} onChange={(v) => setForm({ ...form, regions_covered: v })} />
                      <Chips label="Ideal for" value={form.idealfor} onChange={(v) => setForm({ ...form, idealfor: v })} />
                      <Chips label="Theme" value={form.theme} onChange={(v) => setForm({ ...form, theme: v })} />
                      <Field label="Season">
                        <input className="w-full rounded-xl border p-2" value={form.season ?? ""} onChange={(e) => setForm({ ...form, season: e.target.value })} />
                      </Field>
                      <Chips label="Tags" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
                      <Chips label="Travel mode" value={form.travel_mode} onChange={(v) => setForm({ ...form, travel_mode: v })} />
                      <Chips label="Highlights" value={form.highlights} onChange={(v) => setForm({ ...form, highlights: v })} />
                    </div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <div className="mt-4">
                  <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                    <span className={open ? "" : "opacity-70"}>📅 Planner & Cost</span>
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <CostEditor value={form.estimated_cost} onChange={(v) => setForm({ ...form, estimated_cost: v })} />
                      <Toggle label="Customizable" checked={!!form.customizable} onChange={(v) => setForm({ ...form, customizable: v })} />
                    </div>
                    <DayPlanner
                        value={(form.places_per_day as DayPlan[]) || []}
                        onChange={handleDayPlanChange}
                        />
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <div className="mt-4">
                  <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                    <span className={open ? "" : "opacity-70"}>🖼️ Images</span>
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium">Cover image</div>
                      <div className="mt-1 flex items-center gap-3">
                        <div className="w-28 h-28 rounded-xl border overflow-hidden bg-gray-50">
                          {imgUrl ? (
                            <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-xs text-gray-500">No image</div>
                          )}
                        </div>

                        {/* Disable uploader until row exists (edit mode) to keep storage paths clean */}
                        {mode === "edit" && rowId ? (
                          <AgencyImageUploader
                            agencyId={providerId}
                            category="itineraries"
                            rowId={rowId}
                            type="main"
                            name={form.title || "itinerary"}
                            onUploaded={async (_url, path) => {
                              setForm((f: any) => ({ ...f, image: path }));
                            }}
                          />
                        ) : (
                          <button className="rounded-xl border px-3 py-2 text-sm opacity-60 cursor-not-allowed" title="Save once, then upload image">
                            Save once to enable uploads
                          </button>
                        )}
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-medium">Gallery</div>
                        <div className="mt-1 flex flex-wrap gap-3">
                          {toArray(form.gallery).map((p: string, idx: number) => {
                            const u = publicImageUrl(p);
                            return (
                              <div key={idx} className="w-20 h-20 rounded-xl border overflow-hidden relative">
                                {u ? <img src={u} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full grid place-items-center text-[10px] text-gray-500">image</div>}
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 bg-white/90 border rounded px-1 text-[10px]"
                                  onClick={() => {
                                    const next = [...toArray(form.gallery)];
                                    next.splice(idx, 1);
                                    setForm((f: any) => ({ ...f, gallery: next }));
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}

                          {mode === "edit" && rowId ? (
                            <AgencyImageUploader
                              agencyId={providerId}
                              category="itineraries"
                              rowId={rowId}
                              type="gallery"
                              name={(form.title || "itinerary") + "-gallery"}
                              onUploaded={async (_url, path) => {
                                setForm((f: any) => ({ ...f, gallery: [...toArray(f.gallery), path] }));
                              }}
                            />
                          ) : (
                            <button className="rounded-xl border px-3 py-2 text-sm opacity-60 cursor-not-allowed" title="Save once, then upload images">
                              Save once to add gallery
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <div className="mt-4">
                  <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                    <span className={open ? "" : "opacity-70"}>⚙️ Extra</span>
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Chips label="Tips" value={form.tips} onChange={(v) => setForm({ ...form, tips: v })} />
                      <Chips label="Warnings" value={form.warnings} onChange={(v) => setForm({ ...form, warnings: v })} />
                      <Chips label="Districts" value={form.districts} onChange={(v) => setForm({ ...form, districts: v })} />
                      <Chips label="Visit season" value={form.visit_season} onChange={(v) => setForm({ ...form, visit_season: v })} />
                    </div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
              <button onClick={save} disabled={saving} className="bg-gray-900 text-white px-4 py-2 rounded disabled:opacity-60">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </>
        )}

        {/* Small toast */}
        {toast && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="rounded-full bg-gray-900 text-white px-4 py-2 text-sm shadow-lg">{toast}</div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

/* tiny UI atoms */
function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
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
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-1 flex flex-wrap gap-2">
        {arr.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            {v}
            <button type="button" className="ml-1 text-gray-500" onClick={() => { const next = [...arr]; next.splice(i, 1); onChange(next); }}>
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input className="flex-1 rounded-xl border p-2 text-sm" placeholder="Type and press Add" value={txt} onChange={(e) => setTxt(e.target.value)} />
        <button type="button" className="rounded-xl border px-3 py-2 text-sm" onClick={() => { const v = txt.trim(); if (!v) return; onChange([...arr, v]); setTxt(""); }}>
          Add
        </button>
      </div>
    </div>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div>
      <div className="text-sm font-medium">{label}</div>
      <label className="mt-2 inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span>{checked ? "Yes" : "No"}</span>
      </label>
    </div>
  );
}
function DayPlanner({ value, onChange }: { value: DayPlan[]; onChange: (v: DayPlan[]) => void }) {
  const [items, setItems] = useState<DayPlan[]>(Array.isArray(value) ? value : []);
  useEffect(() => onChange(items), [items, onChange]);
  const addDay = () => { const day = (items.at(-1)?.day ?? 0) + 1; setItems([...items, { day, places: [] }]); };
  return (
    <div className="md:col-span-2">
      <div className="text-sm font-medium">Day planner (places per day)</div>
      <div className="mt-2 space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">Day {it.day}</div>
              <button type="button" className="text-xs rounded border px-2 py-1" onClick={() => { const next = [...items]; next.splice(idx, 1); setItems(next); }}>
                Remove
              </button>
            </div>
            <Chips label="Places (chips)" value={it.places} onChange={(v) => { const next = [...items]; next[idx] = { ...next[idx], places: v }; setItems(next); }} />
          </div>
        ))}
      </div>
      <div className="mt-2">
        <button type="button" className="rounded-xl border px-3 py-2 text-sm" onClick={addDay}>Add day</button>
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
      <div className="text-sm font-medium">Estimated cost</div>
      <div className="mt-1 grid grid-cols-3 gap-2">
        <input className="rounded-xl border p-2 text-sm" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        <input className="rounded-xl border p-2 text-sm" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} />
        <input className="rounded-xl border p-2 text-sm" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} />
      </div>
    </div>
  );
}
