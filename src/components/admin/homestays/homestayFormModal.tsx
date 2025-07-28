'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { Dialog } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-hot-toast';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { LOCATION_ZONES } from '@/lib/locationZones';
import { AD_SLOTS } from '@/lib/adSlots';
import { FIELD_OPTIONS } from '@/lib/fieldOption';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function HomestayFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const createDefaultForm = () => ({
    // 🔑 Core Identity
    id: uuidv4(),
    name: '',
    description: '',

    // 📍 Location Info
    location: '',
    area: '',
    address: '',
    district: '',
    distancefromshillong: '',
    distancefromguwahati: '',

    // 🖼 Media & Visuals
    image: '',
    gallery: [],
    cover_image_alt: '',
    media: [],

    // 💰 Price & Room Info
    pricepernight: null,
    rooms: [],
    totalrooms: 0,
    checkin_time: '',
    checkout_time: '',
    cancellationpolicy: '',

    // 🌟 Features & Services
    occupancy: null,
    amenities: [],
    mealincluded: false,
    priceincludes: [],
    petfriendly: false,
    wifi: false,
    hasparking: false,
    hasbalcony: false,

    // 📞 Contact & Booking
    contact: '',
    email: '',
    website: '',
    instant_booking: false,
    availability_status: 'available',

    // 🧭 Nearby & Experiences
    nearbydestinations: [],
    nearby_points_of_interest: [],
    localexperience: [],
    suitablefor: [],
    accessibilityfeatures: [],

    // 💸 Cost Estimates
    averagecostestimate: {},

    // 📘 Visitor Guidance
    tips: [],
    warnings: [],

    // 🏷️ Tags & Themes
    tags: [],
    theme: [],
    visitseason: [],

    // 📣 SEO & Visibility
    meta_title: '',
    meta_description: '',
    visibilitystatus: 'visible',
    summary: '',
    sponsoredby: '',

    // 📈 Analytics & Performance (optional in form)
    view_count: 0,
    click_count: 0,
    bookings_count: 0,
    lastbookedat: '',
    viewcount: 0,

    // 💼 Business Details
    gst_number: '',
    business_type: 'individual',
    specialoffers: '',

    // 📢 Ads & Marketing
    adSlot: 'none',
    adActive: false,

    // 🧠 AI Functionality
    include_in_ai_search: true,
    search_keywords: [],
    faq_answers: [],
    ai_score: null,
    searchboost: null,

    // 🗺️ Map
    latitude: null,
    longitude: null,
    maplink: '',

    // 🕓 Timestamps
    created_at: '',
  });


  const mapInitialData = (data: any) => {
    if (!data) return createDefaultForm();
    const { adslot, adactive, ...rest } = data;
    return {
      ...createDefaultForm(),
      ...rest,
      id: data.id,
      adSlot: adslot ?? 'none',
      adActive: adactive ?? false,
    };
  };

  const [form, setForm] = useState(() => mapInitialData(initialData));

  useEffect(() => {
    setForm(mapInitialData(initialData));
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

      const addRoom = () => {
      const newRoom = {
        name: '',
        description: '',
        pricepernight: 0,
        occupancy: 1,
        availabilitystatus: 'available',
      };
      setForm((prev: any) => ({
        ...prev,
        rooms: [...(prev.rooms || []), newRoom],
      }));
    };

    const updateRoom = (index: number, field: string, value: any) => {
      const updatedRooms = [...(form.rooms || [])];
      updatedRooms[index] = { ...updatedRooms[index], [field]: value };
      setForm((prev: any) => ({ ...prev, rooms: updatedRooms }));
    };
    const removeRoom = (index: number) => {
      const updatedRooms = (form.rooms || []).filter((_: unknown, i: number) => i !== index);
      setForm((prev: typeof form) => ({ ...prev, rooms: updatedRooms }));
    };


  const handleSubmit = async () => {
    try {
      const slug = await generateSlug(supabase, form.name, (form as any).slug);
      const { adSlot, adActive, ...rest } = form;
      const payload = { ...rest, slug, adslot: adSlot, adactive: adActive };
      if (isEditMode) {
        const { error } = await supabase.from('homestays').update(payload).eq('id', form.id);
        if (error) throw error;
        toast.success('Homestay updated successfully');
      } else {
        const { error } = await supabase.from('homestays').insert([payload]);
        if (error) throw error;
        toast.success('Homestay created successfully');
      }
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const renderInput = (label: string, key: string, type = 'text') => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <input
        type={type}
        value={form[key] || ''}
        onChange={(e) => handleChange(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );

  const renderArrayInput = (label: string, key: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={(form[key] || []).join(', ')}
        onChange={(e) => handleChange(key, e.target.value.split(',').map((s) => s.trim()))}
        className="w-full border px-3 py-2 rounded"
        placeholder="Comma-separated values"
      />
    </div>
  );

  const renderCheckbox = (label: string, key: string) => (
    <div className="mb-3 flex items-center gap-2">
      <input
        type="checkbox"
        checked={form[key] || false}
        onChange={(e) => handleChange(key, e.target.checked)}
      />
      <label className="text-sm">{label}</label>
    </div>
  );
  
  const renderAdSlot = () => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">Ad Slot</label>
      <select
        value={form.adSlot}
        onChange={(e) => handleChange('adSlot', e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        {AD_SLOTS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
    const renderSelect = (label: string, key: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <select
        value={form[key] || ''}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      >
        <option value="" disabled>
          Select a location...
        </option>
        {LOCATION_ZONES.map((zone) => (
          <option key={zone} value={zone}>
            {zone}
          </option>
        ))}
      </select>
    </div>
  );

  const renderJSONInput = (label: string, key: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label} (JSON)</label>
      <textarea
        value={JSON.stringify(form[key] || {}, null, 2)}
        onChange={(e) => {
          try {
            handleChange(key, JSON.parse(e.target.value));
          } catch {
            // Ignore parse errors
          }
        }}
        className="w-full border px-3 py-2 font-mono rounded"
        rows={4}
      />
    </div>
  );

    const renderMultiSelect = (label: string, key: string, options: string[]) => (
      <div className="mb-3">
        <label className="block font-medium text-sm mb-1">{label}</label>
        <select
          multiple
          value={form[key] || []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
            handleChange(key, selected);
          }}
          className="w-full border px-3 py-2 rounded h-32"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );

      const renderRooms = () => (
        <div className="mb-6">
          <label className="block font-semibold text-base mb-2">Rooms</label>
          {(form.rooms || []).map((room: any, index: number) => (
            <div key={index} className="border rounded p-4 mb-3 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={room.name}
                  placeholder="Room Name"
                  onChange={(e) =>
                    updateRoom(index, 'name', e.target.value)
                  }
                  className="border px-3 py-2 rounded"
                />
                <input
                  type="number"
                  value={room.pricepernight}
                  placeholder="Price Per Night"
                  onChange={(e) =>
                    updateRoom(index, 'pricepernight', Number(e.target.value))
                  }
                  className="border px-3 py-2 rounded"
                />
                <input
                  type="number"
                  value={room.occupancy}
                  placeholder="Occupancy"
                  onChange={(e) =>
                    updateRoom(index, 'occupancy', Number(e.target.value))
                  }
                  className="border px-3 py-2 rounded"
                />
                <select
                  value={room.availabilitystatus || ''}
                  onChange={(e) =>
                    updateRoom(index, 'availabilitystatus', e.target.value)
                  }
                  className="border px-3 py-2 rounded"
                >
                  <option value="">Availability</option>
                  <option value="available">Available</option>
                  <option value="full">Full</option>
                  <option value="limited">Limited</option>
                </select>
              </div>
              <textarea
                value={room.description || ''}
                placeholder="Room Description"
                onChange={(e) =>
                  updateRoom(index, 'description', e.target.value)
                }
                className="w-full border px-3 py-2 mt-3 rounded"
              />
              <button
                onClick={() => removeRoom(index)}
                className="absolute top-2 right-2 text-sm text-red-600"
              >
                ✕ Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRoom}
            className="mt-2 text-sm bg-emerald-500 text-white px-4 py-2 rounded"
          >
            + Add Room
          </button>
        </div>
      );


  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="bg-white p-6 w-full max-w-4xl z-10 overflow-y-auto max-h-[90vh] rounded-xl">
        <Dialog.Title className="text-xl font-bold mb-4">
          {isEditMode ? 'Edit Homestay' : 'Add New Homestay'}
        </Dialog.Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Name', 'name')}
          {renderSelect('Location Zone', 'location')}
          {renderInput('District', 'district')}
          {renderInput('Price Per Night', 'pricepernight', 'number')}
          {renderInput('Occupancy', 'occupancy', 'number')}
          {renderInput('Latitude', 'latitude', 'number')}
          {renderInput('Longitude', 'longitude', 'number')}
          {renderInput('Distance from Shillong', 'distancefromshillong')}
        </div>

        {renderInput('Description', 'description')}
        {renderInput('Address', 'address')}
        {renderInput('Contact', 'contact')}
        {renderInput('Email', 'email')}
        {renderInput('Website', 'website')}
        {renderInput('Cover Image Alt Text', 'cover_image_alt')}
        {renderArrayInput('Media (YouTube, Instagram links)', 'media')}

        {renderInput('Map Link', 'maplink')}
        {renderInput('Ratings', 'ratings', 'number')}
        {renderAdSlot()}
        {renderCheckbox('Ad Active', 'adActive')}

        {renderCheckbox('Meal Included', 'mealincluded')}

        {renderArrayInput('Price Includes', 'priceincludes')}
        {renderRooms()}
        {renderArrayInput('Amenities', 'amenities')}
        {renderArrayInput('Tags', 'tags')}
        {renderArrayInput('Tips', 'tips')}
        {renderArrayInput('Warnings', 'warnings')}
        {renderArrayInput('Nearby Destinations', 'nearbydestinations')}

        {renderMultiSelect('Tags', 'tags', FIELD_OPTIONS.homestays.tags as unknown as string[])}
        {renderMultiSelect('Theme', 'theme', FIELD_OPTIONS.homestays.theme as unknown as string[])}
        {renderMultiSelect('Visit Season', 'visitseason', FIELD_OPTIONS.homestays.visitseason as unknown as string[])}
        {renderMultiSelect('Amenities', 'amenities', FIELD_OPTIONS.homestays.amenities as unknown as string[])}
        {renderMultiSelect('Price Includes', 'priceincludes', FIELD_OPTIONS.homestays.priceincludes as unknown as string[])}
        {renderMultiSelect('Local Experience', 'localexperience', FIELD_OPTIONS.homestays.localexperience as unknown as string[])}
        {renderMultiSelect('Suitable For', 'suitablefor', FIELD_OPTIONS.homestays.suitablefor as unknown as string[])}
        {renderMultiSelect('Accessibility Features', 'accessibilityfeatures', FIELD_OPTIONS.homestays.accessibilityfeatures as unknown as string[])}
        {renderMultiSelect('House Rules', 'house_rules', FIELD_OPTIONS.homestays.houserules as unknown as string[])}

        {renderArrayInput('Reviews', 'reviews')}

        {renderJSONInput('Average Cost Estimate', 'averagecostestimate')}

        {renderInput('Meta Title', 'meta_title')}

        {renderInput('Sponsored By', 'sponsoredby')}
        {renderInput('Summary (AI Preview)', 'summary')}
        {renderInput('Meta Description', 'meta_description')}

        <div className="mb-3">
          <label className="block font-medium text-sm mb-1">Visibility Status</label>
          <select
            value={form.visibilitystatus}
            onChange={(e) => handleChange('visibilitystatus', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {renderCheckbox('Include in AI Search', 'include_in_ai_search')}
        {renderArrayInput('Search Keywords', 'search_keywords')}
        {renderInput('AI Score (0–100)', 'ai_score', 'number')}
        {renderInput('Search Boost (0–100)', 'searchboost', 'number')}
        {renderJSONInput('FAQ Answers', 'faq_answers')}

        {renderInput('GST Number', 'gst_number')}

        <div className="mb-3">
          <label className="block font-medium text-sm mb-1">Business Type</label>
          <select
            value={form.business_type}
            onChange={(e) => handleChange('business_type', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="individual">Individual</option>
            <option value="agency">Agency</option>
          </select>
        </div>




        {/* Image Upload */}
        <div className="mb-4">
          <label className="block font-medium text-sm mb-1">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadImageToSupabase({
                file,
                category: 'homestays',
                id: form.id,
                type: 'main',
              });
              if (url) {
                handleChange('image', url);
                toast.success('Main image uploaded');
              } else {
                toast.error('Main image upload failed');
              }
            }}
            className="border px-3 py-2 w-full"
          />
          {form.image && (
            <img
              src={form.image}
              alt="Main Preview"
              className="mt-2 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* Gallery Upload */}
        <div className="mb-4">
          <label className="block font-medium text-sm mb-1">Gallery Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              const uploaded: string[] = [];
              for (const file of files) {
                const url = await uploadImageToSupabase({
                  file,
                  category: 'homestays',
                  id: form.id,
                  type: 'gallery',
                });
                if (url) uploaded.push(url);
              }
              if (uploaded.length) {
                toast.success('Gallery images uploaded');
                handleChange('gallery', [...(form.gallery || []), ...uploaded]);
              } else {
                toast.error('Gallery upload failed');
              }
            }}
            className="border px-3 py-2 w-full"
          />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {(form.gallery || []).map((url: string, i: number) => {
              const storagePath = url.split('/storage/v1/object/public/')[1];
              return (
                <div key={i} className="relative group">
                  <img src={url} className="h-24 object-cover rounded w-full" alt={`Gallery ${i}`} />
                  <button
                    type="button"
                    onClick={async () => {
                      const deleted = await deleteImageFromSupabase(storagePath);
                      if (deleted) {
                        const updatedGallery = (form.gallery || []).filter((_: string, index: number) => index !== i);
                        handleChange('gallery', updatedGallery);
                        toast.success('Image removed');
                      } else {
                        toast.error('Failed to delete image');
                      }
                    }}
                    className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-emerald-600 text-white px-4 py-2 rounded">
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
