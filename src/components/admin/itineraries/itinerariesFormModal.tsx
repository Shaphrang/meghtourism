'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { Dialog } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { AD_SLOTS } from '@/lib/adSlots';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function ItineraryFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const [form, setForm] = useState(
    initialData || {
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
      tags: [] as string[],
      estimated_cost: {},
      travel_mode: [] as string[],
      highlights: [] as string[],
      places_per_day: [] as any[],
      maplink: '',
      image: '',
      gallery: [] as string[],
      tips: [] as string[],
      warnings: [] as string[],
      contact: '',
      email: '',
      website: '',
      customizable: false,
      author: '',
      ratings: 0,
      reviews: [] as string[],
      visibilitystatus: '',
      region: '',
      adSlot: 'none',
      adActive: false,
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const slug = await generateSlug(supabase, form.title, form.slug);
      const payload = { ...form, slug };
      if (isEditMode) {
        const { error } = await supabase.from('itineraries').update(payload).eq('id', form.id);
        if (error) throw error;
        toast.success('Itinerary updated');
      } else {
        const { error } = await supabase.from('itineraries').insert([payload]);
        if (error) throw error;
        toast.success('Itinerary created');
      }
      onSave();
      onClose();
    } catch (err: any) {
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

  const renderJSON = (label: string, key: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label} (JSON)</label>
      <textarea
        value={JSON.stringify(form[key] || {}, null, 2)}
        onChange={(e) => {
          try {
            handleChange(key, JSON.parse(e.target.value));
          } catch {}
        }}
        className="w-full border px-3 py-2 font-mono rounded"
        rows={3}
      />
    </div>
  );

  const renderCheckbox = (label: string, key: string) => (
    <div className="mb-3 flex items-center gap-2">
      <input type="checkbox" checked={form[key]} onChange={(e) => handleChange(key, e.target.checked)} />
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

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-4xl overflow-y-auto max-h-[95vh]">
        <Dialog.Title className="text-xl font-bold mb-4">{isEditMode ? 'Edit Itinerary' : 'Add Itinerary'}</Dialog.Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Title', 'title')}
          {renderInput('Days', 'days', 'number')}
          {renderInput('Starting Point', 'starting_point')}
          {renderInput('Ending Point', 'ending_point')}
          {renderInput('Season', 'season')}
          {renderInput('Map Link', 'maplink')}
          {renderInput('Contact', 'contact')}
          {renderInput('Email', 'email')}
          {renderInput('Website', 'website')}
          {renderInput('Author', 'author')}
          {renderInput('Ratings', 'ratings', 'number')}
          {renderInput('Region', 'region')}
        </div>

        {renderInput('Description', 'description')}

        {renderArray('Regions Covered', 'regions_covered')}
        {renderArray('Ideal For', 'idealfor')}
        {renderArray('Theme', 'theme')}
        {renderArray('Tags', 'tags')}
        {renderJSON('Estimated Cost', 'estimated_cost')}
        {renderArray('Travel Mode', 'travel_mode')}
        {renderArray('Highlights', 'highlights')}
        {renderJSON('Places Per Day', 'places_per_day')}
        {renderArray('Tips', 'tips')}
        {renderArray('Warnings', 'warnings')}
        {renderArray('Reviews', 'reviews')}

        {renderCheckbox('Customizable', 'customizable')}
        {renderInput('Visibility Status', 'visibilitystatus')}

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block font-medium text-sm mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadImageToSupabase({ file, category: 'itineraries', id: form.id, type: 'main' });
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
                const url = await uploadImageToSupabase({ file, category: 'itineraries', id: form.id, type: 'gallery' });
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