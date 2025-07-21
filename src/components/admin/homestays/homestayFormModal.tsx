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

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function HomestayFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const createDefaultForm = () => ({
      id: uuidv4(),
      name: '',
      description: '',
      location: '',
      district: '',
      image: '',
      gallery: [],
      pricepernight: '',
      occupancy: '',
      mealincluded: false,
      priceincludes: [],
      amenities: [],
      contact: '',
      email: '',
      website: '',
      ratings: null,
      reviews: [],
      tags: [],
      latitude: null,
      longitude: null,
      maplink: '',
      address: '',
      distancefromshillong: '',
      nearbydestinations: [],
      averagecostestimate: {},
      tips: [],
      warnings: [],
      adSlot: 'none',
      adActive: false,
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
        {renderInput('Map Link', 'maplink')}
        {renderInput('Ratings', 'ratings', 'number')}
        {renderAdSlot()}
        {renderCheckbox('Ad Active', 'adActive')}

        {renderCheckbox('Meal Included', 'mealincluded')}

        {renderArrayInput('Price Includes', 'priceincludes')}
        {renderArrayInput('Amenities', 'amenities')}
        {renderArrayInput('Tags', 'tags')}
        {renderArrayInput('Tips', 'tips')}
        {renderArrayInput('Warnings', 'warnings')}
        {renderArrayInput('Nearby Destinations', 'nearbydestinations')}
        {renderArrayInput('Reviews', 'reviews')}

        {renderJSONInput('Average Cost Estimate', 'averagecostestimate')}

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
