'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { Dialog } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { LOCATION_ZONES } from '@/lib/locationZones';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function CafeRestaurantFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const [form, setForm] = useState(
    initialData || {
      id: uuidv4(),
      name: '',
      description: '',
      type: '',
      cuisine: [] as string[],
      tags: [] as string[],
      location: '',
      district: '',
      address: '',
      latitude: 0,
      longitude: 0,
      maplink: '',
      image: '',
      gallery: [] as string[],
      menu: [] as string[],
      pricelevel: '',
      popularitems: [] as string[],
      timing: '',
      contact: '',
      email: '',
      website: '',
      features: [] as string[],
      dietaryoptions: [] as string[],
      averagecost: 0,
      ratings: 0,
      reviews: [] as string[],
      isfamilyfriendly: false,
      accessibility: [] as string[],
      season: '',
      popularityindex: 0,
      visibilitystatus: '',
    }
  );

  const handleChange = (key: string, value: any) => {
    console.log(`Form change: ${key} =`, value);
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    console.log("Submitting form data:", form);
    try {
      const slug = await generateSlug(supabase, form.name, (form as any).slug);
      const payload = { ...form, slug };
      if (isEditMode) {
        const { error, data } = await supabase
          .from('cafes_and_restaurants')
          .update(payload)
          .eq('id', form.id);
        console.log("Update result:", { data, error });
        if (error) throw error;
        toast.success('Entry updated');
      } else {
        const { error, data } = await supabase
          .from('cafes_and_restaurants')
          .insert([payload]);
        console.log("Insert result:", { data, error });
        if (error) throw error;
        toast.success('Entry created');
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error("Error during submit:", err);
      toast.error(err.message || 'Error saving data');
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

  const renderArray = (label: string, key: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={(form[key] || []).join(', ')}
        onChange={(e) => handleChange(key, e.target.value.split(',').map((s) => s.trim()))}
        className="w-full border px-3 py-2 rounded"
        placeholder="Comma-separated values"
        rows={2}
      />
    </div>
  );

  const renderCheckbox = (label: string, key: string) => (
    <div className="mb-3 flex items-center gap-2">
      <input type="checkbox" checked={form[key]} onChange={(e) => handleChange(key, e.target.checked)} />
      <label className="text-sm">{label}</label>
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


  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-4xl overflow-y-auto max-h-[95vh]">
        <Dialog.Title className="text-xl font-bold mb-4">{isEditMode ? 'Edit Entry' : 'Add Entry'}</Dialog.Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Name', 'name')}
          {renderInput('Type', 'type')}
          {renderSelect('Location Zone', 'location')}
          {renderInput('District', 'district')}
          {renderInput('Latitude', 'latitude', 'number')}
          {renderInput('Longitude', 'longitude', 'number')}
          {renderInput('Map Link', 'maplink')}
          {renderInput('Price Level', 'pricelevel')}
          {renderInput('Timing', 'timing')}
          {renderInput('Contact', 'contact')}
          {renderInput('Email', 'email')}
          {renderInput('Website', 'website')}
          {renderInput('Average Cost', 'averagecost', 'number')}
          {renderInput('Ratings', 'ratings', 'number')}
          {renderInput('Popularity Index', 'popularityindex', 'number')}
          {renderInput('Visibility Status', 'visibilitystatus')}
          {renderInput('Season', 'season')}
        </div>

        {renderInput('Description', 'description')}
        {renderInput('Address', 'address')}

        {renderArray('Cuisine', 'cuisine')}
        {renderArray('Tags', 'tags')}
        {renderArray('Menu', 'menu')}
        {renderArray('Popular Items', 'popularitems')}
        {renderArray('Features', 'features')}
        {renderArray('Dietary Options', 'dietaryoptions')}
        {renderArray('Reviews', 'reviews')}
        {renderArray('Accessibility', 'accessibility')}

        {renderCheckbox('Family Friendly', 'isfamilyfriendly')}

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block font-medium text-sm mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadImageToSupabase({ file, category: 'cafes_and_restaurants', id: form.id, type: 'main' });
              console.log("Image upload result:", url);
              if (url) {
                handleChange('image', url);
                toast.success('Image uploaded');
              } else {
                toast.error('Image upload failed');
              }
            }}
            className="border px-3 py-2 w-full"
          />
          {form.image && <img src={form.image} className="mt-2 h-32 object-cover rounded" />}
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
                const url = await uploadImageToSupabase({ file, category: 'cafes_and_restaurants', id: form.id, type: 'gallery' });
                if (url) uploaded.push(url);
              }
              console.log("Gallery upload results:", uploaded);
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
                        const updated = (form.gallery || []).filter((_: string, index: number) => index !== i);
                        handleChange('gallery', updated);
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
