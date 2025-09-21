//src\components\admin\itineraries\itinerariesFormModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, Disclosure } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { AD_SLOTS } from '@/lib/adSlots';
import { FIELD_OPTIONS } from '@/lib/fieldOption';
import { ItineraryZ } from '@/lib/schemas/itinerary';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

/* helpers */
const toArray = (v: any): string[] =>
  Array.isArray(v) ? v.filter(Boolean)
  : typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean)
  : [];

// NEW: coerce any value (object/string/number) to a label string
const toLabel = (v: any): string => {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object') {
    if (typeof (v as any).name === 'string') return (v as any).name.trim();
    if (typeof (v as any).title === 'string') return (v as any).title.trim();
  }
  return String(v ?? '').trim();
};


/* DayPlanner */
type DayPlan = { day: number; places: string[] };

/* ---------- Chip Picker (select from options + add custom) ---------- */

function ChipPicker({
  label, value, options, onChange, placeholder
}: {
  label: string;
  value: string[] | undefined;
  options: readonly string[];       // ✅ accepts readonly and mutable
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const selected = Array.isArray(value) ? value : [];
  const toggle = (v: string) => {
    const exist = selected.includes(v);
    onChange(exist ? selected.filter(x => x !== v) : [...selected, v]);
  };
  const [txt, setTxt] = useState("");

  const addCustom = () => {
    const v = txt.trim();
    if (!v) return;
    if (!selected.includes(v)) onChange([...selected, v]);
    setTxt("");
  };

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      {/* options from catalog */}
      <div className="mt-1 flex flex-wrap gap-2">
        {options.map(opt => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={
                "px-3 py-1 rounded-full text-xs border " +
                (active
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
              }
              title={opt}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* selected list (reorder/remove quickly) */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
            >
              {v}
              <button
                type="button"
                className="ml-1 text-gray-500"
                onClick={() => onChange(selected.filter(x => x !== v))}
                aria-label={`Remove ${v}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* add custom */}
      <div className="mt-2 flex gap-2">
        <input
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          placeholder={placeholder}
          className="flex-1 rounded-xl border p-2 text-sm"
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-xl border px-3 py-2 text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/* ---------- Estimated Cost editor (friendly fields) ---------- */

type Cost = { min?: number | null; max?: number | null; currency?: string | null; notes?: string | null };

function EstimatedCostEditor({
  value,
  onChange,
}: {
  value: Cost | undefined;
  onChange: (c: Cost) => void;
}) {
  const v: Cost = value || {};
  const set = (patch: Partial<Cost>) => onChange({ ...v, ...patch });

  return (
    <div className="rounded-xl border p-3">
      <label className="text-sm font-medium">Estimated Cost</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
        <div>
          <div className="text-xs text-gray-500 mb-1">Min</div>
          <input
            type="number"
            min={0}
            value={v.min ?? ""}
            onChange={(e) => set({ min: e.target.value === "" ? null : Number(e.target.value) })}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., 5000"
          />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Max</div>
          <input
            type="number"
            min={0}
            value={v.max ?? ""}
            onChange={(e) => set({ max: e.target.value === "" ? null : Number(e.target.value) })}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g., 15000"
          />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Currency</div>
          <select
            value={v.currency ?? "INR"}
            onChange={(e) => set({ currency: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>
      <div className="mt-2">
        <div className="text-xs text-gray-500 mb-1">Notes (supports “10% off” etc.)</div>
        <textarea
          rows={2}
          value={v.notes ?? ""}
          onChange={(e) => set({ notes: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          placeholder="e.g., Early-bird 10% off till 30th Sept"
        />
      </div>
    </div>
  );
}


export default function ItineraryFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;

  const createDefaultForm = () => ({
    id: uuidv4(),
    title: '',
    slug: '',
    description: '',
    days: 1,
    starting_point: '',
    ending_point: '',
    regions_covered: [] as string[],
    idealfor: [] as string[],
    theme: [] as string[],
    season: '',
    visit_season: [] as string[],       // ✅ snake_case everywhere
    tags: [] as string[],
    estimated_cost: { min: null, max: null, currency: "INR", notes: "" } as {
      min: number | null; max: number | null; currency: string | null; notes: string | null;
    },
    travel_mode: [] as string[],
    highlights: [] as string[],
    places_per_day: [] as DayPlan[],
    maplink: '',
    image: '',
    gallery: [] as string[],
    cover_image_alt: '',
    media: [] as string[],
    tips: [] as string[],
    warnings: [] as string[],
    contact: '',
    email: '',
    website: '',
    socialmedia: { facebook: '', instagram: '', youtube: '' } as {
      facebook?: string; instagram?: string; youtube?: string;
    },
    customizable: false,
    author: '',
    ratings: 0,
    reviews: [] as string[],
    view_count: 0,
    click_count: 0,
    bookings_count: 0,
    lastbookedat: '',
    meta_title: '',
    meta_description: '',
    popularityindex: 0,
    visibilitystatus: 'visible' as 'visible' | 'hidden' | 'draft',
    highlight: false,
    sponsoredby: '',
    adslot: 'none' as typeof AD_SLOTS[number],
    adactive: false,
    isfeaturedforhome: false,
    ai_score: 0,
    search_keywords: [] as string[],
    searchboost: 0,
    summary: '',
    include_in_ai_search: true,
    faq_answers: [] as {question: string; answer: string;}[],
    approval_status: 'pending' as 'pending' | 'approved' | 'rejected',
    created_at: new Date().toISOString(),
  });

    const mapInitialData = (data: any) =>
      data
        ? {
            ...createDefaultForm(),
            ...data,
            socialmedia: {
              facebook: data.socialmedia?.facebook ?? '',
              instagram: data.socialmedia?.instagram ?? '',
              youtube: data.socialmedia?.youtube ?? '',
            },
            places_per_day: Array.isArray(data.places_per_day)
              ? data.places_per_day.map((d: any, i: number) => ({
                  day: Number(d?.day) || i + 1,
                  places: Array.isArray(d?.places)
                    ? d.places.map(toLabel).filter(Boolean)
                    : [],
                }))
              : [],
            approval_status: data.approval_status ?? 'pending',
            // accept either visit_season or legacy visitseason
            visit_season: toArray(data.visit_season ?? data.visitseason),
          }
        : createDefaultForm();


  const [form, setForm] = useState(() => mapInitialData(initialData));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(mapInitialData(initialData));
  }, [initialData]);

  const set = (key: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

  const setSocial = (platform: string, value: string) =>
    setForm((prev: any) => ({
      ...prev,
      socialmedia: { ...(prev.socialmedia ?? {}), [platform]: value },
    }));

  /* inputs */
  const Input = (label: string, key: string, type: 'text' | 'number' | 'email' = 'text') => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={form[key] ?? ''}
        onChange={e => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
      />
    </div>
  );
  const TextArea = (label: string, key: string, rows = 3) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={rows}
        value={form[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
      />
    </div>
  );
  const Select = (label: string, key: string, options: string[]) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={form[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
      >
        <option value="">---</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
  const Multi = (label: string, key: string, options: string[]) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        multiple
        value={form[key] ?? []}
        onChange={e =>
          set(
            key,
            Array.from(e.target.selectedOptions).map(o => o.value)
          )
        }
        className="w-full border px-3 py-2 rounded mt-1 h-28"
      >
        {options.map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
  const Check = (label: string, key: string) => (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={!!form[key]}
        onChange={e => set(key, e.target.checked)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
  const renderArray = (label: string, key: string, placeholder = 'Comma separated') => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={Array.isArray(form[key]) ? form[key].join(', ') : ''}
        onChange={e =>
          set(
            key,
            e.target.value
              .split(',')
              .map((x: string) => x.trim())
              .filter(Boolean)
          )
        }
        className="w-full border px-3 py-2 rounded mt-1"
        rows={2}
        placeholder={placeholder}
      />
    </div>
  );
  const renderJSON = (label: string, key: string) => (
    <div>
      <label className="text-sm font-medium">{label} (JSON)</label>
      <textarea
        value={JSON.stringify(form[key] ?? {}, null, 2)}
        onChange={e => {
          try {
            set(key, JSON.parse(e.target.value));
          } catch {}
        }}
        className="w-full border px-3 py-2 font-mono rounded mt-1"
        rows={3}
      />
    </div>
  );

  /* save (Zod validated) */
// ----------- SAVE HANDLER (with deep logging) -------------
const save = async () => {
  setLoading(true);
  try {
    const slug = await generateSlug(supabase, form.title, form.slug);

    // Normalize arrays & JSON ahead of validation
    const candidate = {
      ...form,
      // slug you computed above
      slug,

      // chip/multi-selects → string[]
      regions_covered: toArray(form.regions_covered),
      idealfor:       toArray(form.idealfor),
      theme:          toArray(form.theme),
      visit_season:   toArray((form as any).visit_season ?? (form as any).visitseason),
      tags:           toArray(form.tags),
      travel_mode:    toArray(form.travel_mode),

      // free lists
      highlights:     toArray(form.highlights),
      gallery:        toArray(form.gallery),
      tips:           toArray(form.tips),
      warnings:       toArray(form.warnings),
      reviews:        toArray(form.reviews),
      media:          toArray(form.media),
      search_keywords:toArray(form.search_keywords),

      // daily plan → normalized array of objects
      places_per_day: Array.isArray(form.places_per_day)
        ? form.places_per_day.map((d: any, i: number) => ({
            day: Number(d?.day) || i + 1,
            // convert objects like {name:"..."} or {title:"..."} to strings
            places: Array.isArray(d?.places) ? d.places.map(toLabel).filter(Boolean) : [],
          }))
        : [],

      // numbers/dates → null if empty string
      ai_score:        form.ai_score        === '' ? null : form.ai_score,
      searchboost:     form.searchboost     === '' ? null : form.searchboost,
      ratings:         form.ratings         === '' ? null : form.ratings,
      popularityindex: form.popularityindex === '' ? null : form.popularityindex,
      lastbookedat:    form.lastbookedat    === '' ? null : form.lastbookedat,

      // enums/safe values
      approval_status:  (form.approval_status  ?? 'pending') as 'pending'|'approved'|'rejected',
      visibilitystatus: (form.visibilitystatus ?? 'visible') as 'visible'|'hidden'|'draft',

      // adslot guard (matches your DB check)
      adslot: (['none','homepage','featured','nearby'] as const).includes(form.adslot)
        ? form.adslot
        : 'none',

      // social structure (avoid undefined)
      socialmedia: {
        facebook:  form.socialmedia?.facebook  ?? '',
        instagram: form.socialmedia?.instagram ?? '',
        youtube:   form.socialmedia?.youtube   ?? '',
      },

      // image normalization – store null instead of empty string
      image: form.image ? String(form.image) : null,
    };

    // If you changed the DB column to jsonb (object), ensure it's truly an array:
    if (candidate.places_per_day != null && !Array.isArray(candidate.places_per_day)) {
      console.warn('[save] places_per_day was not array; coercing to []');
      (candidate as any).places_per_day = [];
    }


    // Optional: enforce adslot allowed set (matches your DB check constraint)
    const allowedAdslots = new Set(['none', 'homepage', 'featured', 'nearby']);
    if (candidate.adslot && !allowedAdslots.has(candidate.adslot)) {
      console.warn('[save] adslot not allowed by DB check; forcing "none"', candidate.adslot);
      (candidate as any).adslot = 'none';
    }

    // const payload = ItineraryZ.parse(candidate);
    const payload = candidate;

    console.group('[Admin Itinerary] Submitting payload');
    console.log('mode:', isEditMode ? 'edit' : 'create');
    console.log('payload:', payload);
    console.groupEnd();

    // ... supabase insert/update with .select(...)


    let resp;
    if (isEditMode) {
      // return=representation gives us the row back (and better PostgREST messages)
      resp = await supabase
        .from('itineraries')
        .update(payload)
        .eq('id', form.id)
        .select('id, slug, approval_status, adslot, visit_season, places_per_day');
    } else {
      resp = await supabase
        .from('itineraries')
        .insert([payload])
        .select('id, slug, approval_status, adslot, visit_season, places_per_day');
    }

    const { data, error } = resp;

    if (error) {
      // Log everything Supabase exposes
      console.group('[Admin Itinerary] Supabase error');
      console.error('code:', (error as any).code);
      console.error('message:', error.message);
      console.error('details:', (error as any).details);
      console.error('hint:', (error as any).hint);
      console.groupEnd();

      // Surface DB code toasts
      // Common codes:
      // 22P02 = invalid_text_representation (type cast)
      // 23505 = unique_violation (slug)
      // 23514 = check_violation (adslot check, etc.)
      toast.error(
        `Save failed: ${(error as any).code || ''} ${error.message}`
      );
      setLoading(false);
      return;
    }

    console.group('[Admin Itinerary] Supabase OK');
    console.log('returned data:', data);
    console.groupEnd();

    toast.success(isEditMode ? 'Itinerary updated' : 'Itinerary created');
    onSave();
    onClose();
  } catch (err: any) {
    console.group('[Admin Itinerary] Exception');
    console.error(err);
    console.groupEnd();
    if (err?.issues?.length) {
      toast.error(err.issues[0]?.message || 'Validation failed');
    } else {
      toast.error(err?.message || 'Error saving data');
    }
  } finally {
    setLoading(false);
  }
};


  /* images */
  const upImage = async (file: File, place: 'main' | 'gallery') => {
    const url = await uploadImageToSupabase({ file, category: 'itineraries', id: form.id, type: place });
    if (!url) return toast.error('Upload failed');
    place === 'main' ? set('image', url) : set('gallery', [...(form.gallery ?? []), url]);
  };
  const delImage = async (url: string, idx?: number) => {
    const ok = await deleteImageFromSupabase(url);
    if (!ok) return toast.error('Delete failed');
    if (idx == null) set('image', '');
      else set('gallery', (form.gallery ?? []).filter((_: string, i: number) => i !== idx));
  };

  /* UI */
  const visitSeasonOptions =
    FIELD_OPTIONS?.itineraries?.visit_season ??
    FIELD_OPTIONS?.itineraries?.visit_season ??
    [];

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" />
      <div className="bg-white p-6 max-h-[92vh] overflow-y-auto w-full max-w-4xl rounded-xl space-y-8 z-10">
        <Dialog.Title className="text-xl font-bold">{isEditMode ? 'Edit Itinerary' : 'Add Itinerary'}</Dialog.Title>

        {/* BASIC DETAILS */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                <span className={open ? '' : 'opacity-70'}>📝 Basic Info</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('Title', 'title')}
                  {Input('Days', 'days', 'number')}
                  {Input('Starting Point', 'starting_point')}
                  {Input('Ending Point', 'ending_point')}
                  <ChipPicker
                    label="Regions Covered"
                    value={form.regions_covered}
                    options={FIELD_OPTIONS.itineraries.regions_covered || []}
                    onChange={(next) => set('regions_covered', next)}
                  />

                  <ChipPicker
                    label="Ideal For"
                    value={form.idealfor}
                    options={FIELD_OPTIONS.itineraries.idealfor || []}
                    onChange={(next) => set('idealfor', next)}
                  />

                  <ChipPicker
                    label="Theme"
                    value={form.theme}
                    options={FIELD_OPTIONS.itineraries.theme || []}
                    onChange={(next) => set('theme', next)}
                  />

                  {Input('Season (single value)', 'season')}

                  <ChipPicker
                    label="Visit Season"
                    value={form.visit_season}
                    options={visitSeasonOptions || []}
                    onChange={(next) => set('visit_season', next)}
                  />

                  <ChipPicker
                    label="Tags"
                    value={form.tags}
                    options={FIELD_OPTIONS.itineraries.tags || []}
                    onChange={(next) => set('tags', next)}
                  />

                  <ChipPicker
                    label="Travel Mode"
                    value={form.travel_mode}
                    options={FIELD_OPTIONS.itineraries.travel_mode || []}
                    onChange={(next) => set('travel_mode', next)}
                  />

                  {Input('Author', 'author')}
                  {Input('Ratings', 'ratings', 'number')}
                  {Input('Region', 'region')}
                </div>
                {TextArea('Description', 'description', 4)}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* HIGHLIGHTS & PLAN */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🌟 Highlights & Daily Plan</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderArray('Highlights', 'highlights')}
                  <DayPlanner
                    value={Array.isArray(form.places_per_day) ? form.places_per_day : []}
                    onChange={(v) => set('places_per_day', v)}
                  />
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* IMAGES & MEDIA */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🖼️ Images & Media</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="mb-4">
                  <label className="block font-medium text-sm mb-1">Main Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files?.[0] && upImage(e.target.files[0], 'main')}
                    className="border px-3 py-2 w-full"
                  />
                  {form.image && (
                    <div className="flex items-center gap-2 mt-2">
                      <img src={form.image} alt="Main" className="w-32 h-20 object-cover" />
                      <button onClick={() => delImage(form.image!)} className="text-red-600 text-sm">
                        Delete
                      </button>
                    </div>
                  )}
                  {Input('Cover Image Alt Text', 'cover_image_alt')}
                </div>
                <div className="mb-4">
                  <label className="block font-medium text-sm mb-1">Gallery Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(f => upImage(f, 'gallery'));
                    }}
                    className="border px-3 py-2 w-full"
                  />
                  <div className="flex flex-wrap gap-3 mt-2">
                    {(form.gallery ?? []).map((img: string, idx: number) => (
                      <div key={idx} className="relative">
                        <img src={img} alt="Gallery" className="w-28 h-20 object-cover rounded" />
                        <button
                          onClick={() => delImage(img, idx)}
                          className="absolute top-0 right-0 text-red-600 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {renderArray('Media (YouTube, Instagram, etc.)', 'media')}
                {Input('Map Link', 'maplink')}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* CONTACT & SOCIAL */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📞 Contact & Social</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('Contact', 'contact')}
                  {Input('Email', 'email')}
                  {Input('Website', 'website')}
                  <div>
                    <label className="text-sm font-medium">Social Media</label>
                    {['facebook', 'instagram', 'youtube'].map(platform => (
                      <input
                        key={platform}
                        placeholder={platform.charAt(0).toUpperCase() + platform.slice(1) + ' URL'}
                        value={form.socialmedia?.[platform] || ''}
                        onChange={e => setSocial(platform, e.target.value)}
                        className="w-full border px-3 py-2 rounded mt-1 mb-1"
                      />
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* GUIDANCE & TIPS */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📘 Tips & Guidance</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderArray('Tips', 'tips')}
                  {renderArray('Warnings', 'warnings')}
                  {renderArray('Reviews (IDs)', 'reviews')}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* COST & PROMOTION */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>💰 Cost & Promotion</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EstimatedCostEditor
                    value={form.estimated_cost}
                    onChange={(c) => set('estimated_cost', c)}
                  />
                  {Input('Meta Title', 'meta_title')}
                  {TextArea('Meta Description', 'meta_description')}
                  {Input('Popularity Index', 'popularityindex', 'number')}
                  {Select('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
                  {Input('Sponsored By', 'sponsoredby')}
                  {Check('Highlight on Home', 'highlight')}
                  {Select('Ad Slot', 'adslot', [...AD_SLOTS])}
                  {Check('Ad Active', 'adactive')}
                  {Check('Featured for Home', 'isfeaturedforhome')}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* ✅ APPROVAL */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>✅ Approval</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Approval Status</label>
                    <select
                      value={form.approval_status ?? 'pending'}
                      onChange={(e) => set('approval_status', e.target.value)}
                      className="w-full border px-3 py-2 rounded mt-1"
                    >
                      <option value="pending">pending</option>
                      <option value="approved">approved</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </div>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* 🤖 AI & Advanced */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🤖 AI & Advanced</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('AI Score', 'ai_score', 'number')}
                  {Multi('Search Keywords', 'search_keywords', [])}
                  {Input('Search Boost', 'searchboost', 'number')}
                  {TextArea('AI Summary', 'summary')}
                  {Check('Include in AI Search', 'include_in_ai_search')}
                </div>
                <div className="mb-4 mt-4">
                  <label className="block font-medium text-sm mb-1">FAQ Answers</label>
                  {(form.faq_answers || []).map((item: any, idx: number) => (
                    <div key={idx} className="border p-2 rounded mb-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={item.question || ''}
                        onChange={e => {
                          const updated = [...form.faq_answers];
                          updated[idx].question = e.target.value;
                          set('faq_answers', updated);
                        }}
                        className="w-full border mb-1 px-2 py-1 rounded"
                      />
                      <textarea
                        placeholder="Answer"
                        value={item.answer || ''}
                        onChange={e => {
                          const updated = [...form.faq_answers];
                          updated[idx].answer = e.target.value;
                          set('faq_answers', updated);
                        }}
                        className="w-full border px-2 py-1 rounded"
                        rows={2}
                      />
                      <div className="text-right mt-1">
                        <button
                          onClick={() => {
                            const updated = [...form.faq_answers];
                            updated.splice(idx, 1);
                            set('faq_answers', updated);
                          }}
                          className="text-red-500 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    onClick={() =>
                      set('faq_answers', [
                        ...(form.faq_answers || []),
                        { question: '', answer: '' },
                      ])
                    }
                  >
                    Add FAQ
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  <span>
                    Created At:{' '}
                    {form.created_at
                      ? new Date(form.created_at).toLocaleString()
                      : '(not set)'}
                  </span>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
            type="button"
          >
            {loading ? 'Saving…' : isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

/* DayPlanner */
function DayPlanner({
  value,
  onChange,
}: {
  value: DayPlan[];
  onChange: (v: DayPlan[]) => void;
}) {
  const [items, setItems] = useState<DayPlan[]>(Array.isArray(value) ? value : []);

  // Sync down when the prop changes (but avoid churn by comparing JSON)
  useEffect(() => {
    const a = JSON.stringify(items);
    const b = JSON.stringify(value || []);
    if (a !== b) setItems(Array.isArray(value) ? value : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  // Notify parent when local items change
  useEffect(() => {
    onChange(items);
    // intentionally omit onChange (parent may pass a new function every render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const addDay = () => {
    const day = (items.at(-1)?.day ?? 0) + 1;
    setItems([...items, { day, places: [] }]);
  };

  const removeDay = (idx: number) => {
    const next = [...items];
    next.splice(idx, 1);
    setItems(next);
  };

  const setPlaces = (idx: number, nextPlaces: string[]) => {
    const next = [...items];
    next[idx] = { ...next[idx], places: nextPlaces };
    setItems(next);
  };

  return (
    <div className="col-span-1 md:col-span-2">
      <div className="text-sm font-medium">Day planner (places per day)</div>
      <div className="mt-2 space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">Day {it.day}</div>
              <button
                type="button"
                className="text-xs rounded border px-2 py-1"
                onClick={() => removeDay(idx)}
              >
                Remove
              </button>
            </div>
            <Chips
              label="Plans"
              value={it.places}
              onChange={(v) => setPlaces(idx, v)}
            />
          </div>
        ))}
      </div>
      <div className="mt-2">
        <button
          type="button"
          className="rounded-xl border px-3 py-2 text-sm"
          onClick={addDay}
        >
          Add day
        </button>
      </div>
    </div>
  );
}

/* Chips */
function Chips({ label, value, onChange }: {
  label: string;
  value: string[] | string | null | undefined;
  onChange: (v: string[]) => void;
}) {
  const arr: string[] = Array.isArray(value)
    ? value.map(toLabel).filter(Boolean)
    : (typeof value === 'string'
        ? value.split(',').map(toLabel).filter(Boolean)
        : []);

  const [txt, setTxt] = useState('');
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
        <input
          className="flex-1 rounded-xl border p-2 text-sm"
          placeholder="Type and press Add"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
        />
        <button
          type="button"
          className="rounded-xl border px-3 py-2 text-sm"
          onClick={() => {
            const v = txt.trim();
            if (!v) return;
            onChange([...arr, v]);
            setTxt('');
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
