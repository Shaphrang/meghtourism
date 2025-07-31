'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Dialog } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { LOCATION_ZONES } from '@/lib/locationZones';
import { AD_SLOTS } from '@/lib/adSlots';
import { FIELD_OPTIONS } from '@/lib/fieldOption';
import type { Homestay } from '@/types/homestay';

interface Props {
  initialData?: Partial<Homestay>;
  onClose: () => void;
  onSave: () => void;
}

export default function HomestayFormModal({ initialData, onClose, onSave }: Props) {
  const blankRoom = () => ({
    name: '',
    description: '',
    pricepernight: 0,
    occupancy: 1,
    availabilitystatus: 'available' as const,
  });

  const createDefaultForm = (): Homestay => ({
    id: uuidv4(),
    name: '',
    description: '',
    location: '',
    area: '',
    address: '',
    district: '',
    distancefromshillong: '',
    distancefromguwahati: '',
    image: '',
    gallery: [],
    cover_image_alt: '',
    media: [],
    pricepernight: null,
    rooms: [],
    totalrooms: 0,
    checkin_time: '',
    checkout_time: '',
    cancellationpolicy: '',
    house_rules: [],
    occupancy: 0,
    amenities: [],
    mealincluded: false,
    priceincludes: [],
    petfriendly: false,
    wifi: false,
    hasparking: false,
    hasbalcony: false,
    contact: '',
    email: '',
    website: '',
    instant_booking: false,
    availability_status: 'available',
    nearbydestinations: [],
    nearby_points_of_interest: [],
    localexperience: [],
    suitablefor: [],
    accessibilityfeatures: [],
    averagecostestimate: {},
    tips: [],
    warnings: [],
    tags: [],
    theme: [],
    visitseason: [],
    view_count: 0,
    click_count: 0,
    bookings_count: 0,
    lastbookedat: '',
    viewcount: 0,
    isfeaturedforhome: false,
    specialoffers: '',
    popularityindex: 0,
    meta_title: '',
    meta_description: '',
    visibilitystatus: 'visible',
    sponsoredby: '',
    gst_number: '',
    business_type: 'individual',
    adslot: 'none',
    adactive: false,
    ai_score: 0,
    search_keywords: [],
    searchboost: 0,
    summary: '',
    include_in_ai_search: true,
    faq_answers: [],
    created_at: new Date().toISOString(),
  });

  const mapInitial = (data?: Partial<Homestay>): Homestay =>
    data
      ? {
          ...createDefaultForm(),
          ...data,
          rooms: data.rooms?.map((r) => ({ ...blankRoom(), ...r })) ?? [],
          gallery: data.gallery ?? [],
        }
      : createDefaultForm();

  const [form, setForm] = useState<Homestay>(() => mapInitial(initialData));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(mapInitial(initialData));
  }, [initialData]);

  const set = <K extends keyof Homestay>(key: K, value: Homestay[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));
      const validate = () => {
        if (!form.name.trim()) return toast.error('Name is required'), false;
        if ((form.contact?.trim() ?? '') === '' && (form.email?.trim() ?? '') === '')
          return toast.error('Contact or email is required'), false;
        return true;
      };



  const addRoom = () => setForm((p) => ({ ...p, rooms: [...(p.rooms ?? []), blankRoom()] }));
  const updRoom = (i: number, field: string, val: any) =>
    setForm((p) => {
      const rooms = [...(p.rooms ?? [])];
      rooms[i] = { ...rooms[i], [field]: val };
      return { ...p, rooms };
    });
  const delRoom = (i: number) =>
    setForm((p) => {
      const rooms = (p.rooms ?? []).filter((_, idx) => idx !== i);
      return { ...p, rooms };
    });

  const upImage = async (file: File, place: 'main' | 'gallery') => {
    const url = await uploadImageToSupabase({ file, category: 'homestays', id: form.id, type: place });
    if (!url) return toast.error('Upload failed');
    place === 'main' ? set('image', url) : set('gallery', [...(form.gallery ?? []), url]);
  };

  const delImage = async (url: string, idx?: number) => {
    const ok = await deleteImageFromSupabase(url.split('/storage/v1/object/public/')[1]);
    if (!ok) return toast.error('Delete failed');
    if (idx == null) set('image', '');
    else set('gallery', (form.gallery ?? []).filter((_, i) => i !== idx));
  };

  const save = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const slug = await generateSlug(supabase, form.name);
      const payload = { ...form, slug, totalrooms: form.rooms?.length ?? 0 };

      if (initialData?.id) {
        const { error } = await supabase.from('homestays').update(payload).eq('id', form.id);
        if (error) throw error;
        toast.success('Homestay updated');
      } else {
        const { error } = await supabase.from('homestays').insert(payload);
        if (error) throw error;
        toast.success('Homestay created');
      }
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.message ?? 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  // Reusable input components
  const Input = (label: string, key: keyof Homestay, type: 'text' | 'number' | 'email' | 'url' = 'text') => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={(form[key] as any) ?? ''}
        onChange={(e) => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
      />
    </div>
  );

  const TextArea = (label: string, key: keyof Homestay, rows = 3) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={rows}
        value={(form[key] as any) ?? ''}
        onChange={(e) => set(key, e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
      />
    </div>
  );

  const Select = (label: string, key: keyof Homestay, options: string[]) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={(form[key] as string) ?? ''}
        onChange={(e) => set(key, e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
      >
        <option value="">---</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  const Multi = (label: string, key: keyof Homestay, options: string[]) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        multiple
        value={(form[key] as string[]) ?? []}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          set(
            key,
            Array.from(e.target.selectedOptions).map((o) => o.value),
          )
        }
        className="w-full border px-3 py-2 rounded mt-1 h-32"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  const Check = (label: string, key: keyof Homestay) => (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={Boolean(form[key])}
        onChange={(e) => set(key, e.target.checked as any)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );

  // JSX structure defined separately due to size – tell me to send it if not yet received

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div className="bg-white p-6 max-h-[90vh] overflow-y-auto w-full max-w-6xl rounded-lg space-y-6 z-10">
        <Dialog.Title className="text-xl font-bold">
          {initialData ? 'Edit Homestay' : 'New Homestay'}
        </Dialog.Title>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* 🏠 Core */}
  {Input('Name', 'name')}
  {Input('Description', 'description')}

  {/* 📍 Location */}
  {Input('Location', 'location')}
  {Input('District', 'district')}
  {Input('Area / Locality', 'area')}
  {Input('Full Address', 'address')}
  {Input('Distance from Shillong', 'distancefromshillong')}
  {Input('Distance from Guwahati', 'distancefromguwahati')}

  {/* 📞 Contact & Booking */}
  {Input('Phone', 'contact')}
  {Input('Email', 'email', 'email')}
  {Input('Website', 'website', 'url')}
  {Select('Availability Status', 'availability_status', ['available', 'limited', 'unavailable'])}
  {Check('Instant Booking', 'instant_booking')}
</div>

{/* 🖼 Media */}
<div className="mt-6 space-y-4">
  <label className="font-medium">Main Image</label>
  <input type="file" onChange={(e) => e.target.files?.[0] && upImage(e.target.files[0], 'main')} />
  {form.image && (
    <div className="flex items-center gap-2 mt-2">
      <img src={form.image} alt="Main" className="w-32 h-20 object-cover" />
      {form.image && (
        <button onClick={() => delImage(form.image!)} className="text-red-600 text-sm">
          Delete
        </button>
      )}

    </div>
  )}
  {Input('Cover Image Alt Text', 'cover_image_alt')}
</div>

<div className="mt-4 space-y-2">
  <label className="font-medium">Gallery Images</label>
  <input type="file" multiple onChange={(e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => upImage(file, 'gallery'));
  }} />
  <div className="flex flex-wrap gap-3 mt-2">
    {(form.gallery ?? []).map((img, idx) => (
      <div key={idx} className="relative">
        <img src={img} alt="Gallery" className="w-28 h-20 object-cover rounded" />
        <button onClick={() => delImage(img, idx)} className="absolute top-0 right-0 text-red-600 text-xs">✕</button>
      </div>
    ))}
  </div>
</div>

{/* 💰 Price & Rooms */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {Input('Base Price / Night', 'pricepernight', 'number')}
  {Input('Total Rooms', 'totalrooms', 'number')}
  {Input('Check-in Time', 'checkin_time')}
  {Input('Check-out Time', 'checkout_time')}
  {TextArea('Cancellation Policy', 'cancellationpolicy')}
  {Multi('House Rules', 'house_rules', [...FIELD_OPTIONS.homestays.houserules])}
</div>

<div className="mt-6">
  <h3 className="font-semibold mb-2">Rooms</h3>
  {(form.rooms ?? []).map((room, i) => (
    <div key={i} className="border p-4 rounded mb-3 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border px-3 py-2 rounded"
          value={room.name}
          onChange={(e) => updRoom(i, 'name', e.target.value)}
          placeholder="Room Name"
        />
        <input
          className="border px-3 py-2 rounded"
          value={room.pricepernight}
          type="number"
          onChange={(e) => updRoom(i, 'pricepernight', Number(e.target.value))}
          placeholder="Price/Night"
        />
        <input
          className="border px-3 py-2 rounded"
          value={room.occupancy}
          type="number"
          onChange={(e) => updRoom(i, 'occupancy', Number(e.target.value))}
          placeholder="Max Occupancy"
        />
        <select
          value={room.availabilitystatus}
          onChange={(e) => updRoom(i, 'availabilitystatus', e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="available">Available</option>
          <option value="full">Full</option>
          <option value="limited">Limited</option>
        </select>
      </div>
      <textarea
        className="border px-3 py-2 rounded w-full"
        value={room.description}
        onChange={(e) => updRoom(i, 'description', e.target.value)}
        placeholder="Room Description"
      />
      <div className="text-right">
        <button onClick={() => delRoom(i)} className="text-red-600 text-sm">Remove Room</button>
      </div>
    </div>
  ))}
  <button onClick={addRoom} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Add Room</button>
</div>

{/* 🌟 Features & Services */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {Multi('Amenities', 'amenities', [...FIELD_OPTIONS.homestays.amenities])}
  {Multi('Included in Price', 'priceincludes', [...FIELD_OPTIONS.homestays.priceincludes])}
  {Check('Meal Included', 'mealincluded')}
  {Check('Pet Friendly', 'petfriendly')}
  {Check('WiFi Available', 'wifi')}
  {Check('Parking Available', 'hasparking')}
  {Check('Has Balcony', 'hasbalcony')}
</div>

{/* 🎯 Experiences & Tips */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
{Multi('Tags', 'tags', [...FIELD_OPTIONS.homestays.tags])}
{Multi('Theme', 'theme', [...FIELD_OPTIONS.homestays.theme])}
{Multi('Visit Season', 'visitseason', [...FIELD_OPTIONS.homestays.visitseason])}
{Multi('Local Experience', 'localexperience', [...FIELD_OPTIONS.homestays.localexperience])}
{Multi('Suitable For', 'suitablefor', [...FIELD_OPTIONS.homestays.suitablefor])}
{Multi('Accessibility Features', 'accessibilityfeatures', [...FIELD_OPTIONS.homestays.accessibilityfeatures])}


  {Multi('Tips', 'tips', [])}
  {Multi('Warnings', 'warnings', [])}
</div>

{/* 📊 SEO & Visibility */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {Input('Meta Title', 'meta_title')}
  {TextArea('Meta Description', 'meta_description')}
  {Select('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
  {Input('Popularity Index', 'popularityindex', 'number')}
  {Input('Sponsored By', 'sponsoredby')}
</div>

{/* 📢 Ads */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {Select('Ad Slot', 'adslot', [...AD_SLOTS])}
  {Check('Ad Active', 'adactive')}
</div>

{/* 🧠 AI Config */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {Input('AI Score', 'ai_score', 'number')}
  {Multi('Search Keywords', 'search_keywords', [])}
  {Input('Search Boost', 'searchboost', 'number')}
  {TextArea('AI Summary', 'summary')}
  {Check('Include in AI Search', 'include_in_ai_search')}
</div>

{/* 💼 Business Info */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {Input('GST Number', 'gst_number')}
  {Select('Business Type', 'business_type', ['individual', 'agency'])}
</div>


        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={save} disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded">
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
