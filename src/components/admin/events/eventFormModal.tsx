'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-hot-toast';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function EventFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const [form, setForm] = useState(
    initialData || {
      id: uuidv4(),
      name: '',
      description: '',
      location: '',
      district: '',
      image: '',
      gallery: [],
      type: '',
      theme: [],
      tags: [],
      date: '',
      time: '',
      duration: '',
      ismultiday: false,
      season: '',
      entryfee: {},
      contact: '',
      email: '',
      website: '',
      latitude: null,
      longitude: null,
      maplink: '',
      address: '',
      expectedfootfall: '',
      highlights: [],
      nearbydestinations: [],
      availablefacilities: [],
      isrecurring: false,
      frequency: '',
      averagecostestimate: {},
      tips: [],
      warnings: [],
    }
  );

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        const { error } = await supabase.from('events').update(form).eq('id', form.id);
        if (error) throw error;
        toast.success('Event updated successfully');
      } else {
        const { error } = await supabase.from('events').insert([form]);
        if (error) throw error;
        toast.success('Event created successfully');
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
        onChange={(e) => handleChange(key, e.target.value)}
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

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="bg-white p-6 w-full max-w-3xl z-10 overflow-y-auto max-h-[90vh] rounded-xl">
        <Dialog.Title className="text-xl font-bold mb-4">
          {isEditMode ? 'Edit Event' : 'Add New Event'}
        </Dialog.Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Name', 'name')}
          {renderInput('Location', 'location')}
          {renderInput('District', 'district')}
          {renderInput('Date', 'date')}
          {renderInput('Time', 'time')}
          {renderInput('Duration', 'duration')}
          {renderInput('Season', 'season')}
          {renderInput('Contact', 'contact')}
          {renderInput('Email', 'email')}
          {renderInput('Website', 'website')}
          {renderInput('Map Link', 'maplink')}
          {renderInput('Address', 'address')}
          {renderInput('Expected Footfall', 'expectedfootfall')}
          {renderInput('Frequency', 'frequency')}
          {renderInput('Latitude', 'latitude')}
          {renderInput('Longitude', 'longitude')}
        </div>

        {renderInput('Description', 'description')}
        {renderArrayInput('Tags', 'tags')}
        {renderArrayInput('Theme', 'theme')}
        {renderArrayInput('Highlights', 'highlights')}
        {renderArrayInput('Nearby Destinations', 'nearbydestinations')}
        {renderArrayInput('Available Facilities', 'availablefacilities')}
        {renderArrayInput('Tips', 'tips')}
        {renderArrayInput('Warnings', 'warnings')}

        {renderCheckbox('Is Multiday', 'ismultiday')}
        {renderCheckbox('Is Recurring', 'isrecurring')}

        {renderJSONInput('Entry Fee', 'entryfee')}
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
              const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1200 });
              const filename = `${form.id}-main-${Date.now()}.${file.name.split('.').pop()}`;
              const { error } = await supabase.storage.from('events').upload(filename, compressed, { upsert: true });
              if (error) return toast.error('Upload failed: ' + error.message);
              const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events/${filename}`;
              handleChange('image', url);
              toast.success('Main image uploaded');
            }}
            className="border px-3 py-2 w-full"
          />
          {form.image && <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />}
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
                const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1200 });
                const filename = `${form.id}-gallery-${Date.now()}-${file.name}`;
                const { error } = await supabase.storage.from('events').upload(filename, compressed, { upsert: true });
                if (!error) {
                  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events/${filename}`;
                  uploaded.push(url);
                }
              }
              if (uploaded.length) toast.success('Gallery images uploaded');
              handleChange('gallery', [...(form.gallery || []), ...uploaded]);
            }}
            className="border px-3 py-2 w-full"
          />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {(form.gallery || []).map((url: string, i: number) => (
              <img key={i} src={url} className="h-24 object-cover rounded" />
            ))}
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
