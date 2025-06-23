'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function TravelTipFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const [form, setForm] = useState(
    initialData || {
      id: uuidv4(),
      title: '',
      slug: '',
      summary: '',
      content: '',
      image: '',
      tags: [] as string[],
      category: '',
      applicability: [] as string[],
      location: '',
      season: '',
      related_places: [] as string[],
      media: [] as string[],
      source_url: '',
      author: '',
      priority_level: '',
      highlight: false,
      visibilitystatus: '',
      popularityindex: 0,
      region: '',
      theme: [] as string[],
    }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        const { error } = await supabase.from('traveltips').update(form).eq('id', form.id);
        if (error) throw error;
        toast.success('Travel tip updated');
      } else {
        const { error } = await supabase.from('traveltips').insert([form]);
        if (error) throw error;
        toast.success('Travel tip created');
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

  const renderTextArea = (label: string, key: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={form[key] || ''}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full border px-3 py-2 rounded"
        rows={3}
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

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-4xl overflow-y-auto max-h-[95vh]">
        <Dialog.Title className="text-xl font-bold mb-4">{isEditMode ? 'Edit Travel Tip' : 'Add Travel Tip'}</Dialog.Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Title', 'title')}
          {renderInput('Slug', 'slug')}
          {renderInput('Category', 'category')}
          {renderInput('Location', 'location')}
          {renderInput('Season', 'season')}
          {renderInput('Source URL', 'source_url')}
          {renderInput('Author', 'author')}
          {renderInput('Priority Level', 'priority_level')}
          {renderInput('Popularity Index', 'popularityindex', 'number')}
          {renderInput('Region', 'region')}
        </div>

        {renderTextArea('Summary', 'summary')}
        {renderTextArea('Content', 'content')}

        {renderArray('Tags', 'tags')}
        {renderArray('Applicability', 'applicability')}
        {renderArray('Related Places', 'related_places')}
        {renderArray('Media', 'media')}
        {renderArray('Theme', 'theme')}

        {renderCheckbox('Highlight', 'highlight')}
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
              const url = await uploadImageToSupabase({ file, category: 'traveltips', id: form.id, type: 'main' });
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

        {/* Gallery / Media Upload */}
        <div className="mb-4">
          <label className="block font-medium text-sm mb-1">Media</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              const uploaded: string[] = [];
              for (const file of files) {
                const url = await uploadImageToSupabase({ file, category: 'traveltips', id: form.id, type: 'gallery' });
                if (url) uploaded.push(url);
              }
              if (uploaded.length) {
                toast.success('Media uploaded');
                handleChange('media', [...(form.media || []), ...uploaded]);
              } else {
                toast.error('Media upload failed');
              }
            }}
            className="border px-3 py-2 w-full"
          />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {(form.media || []).map((url: string, i: number) => {
              const storagePath = url.split('/storage/v1/object/public/')[1];
              return (
                <div key={i} className="relative group">
                  <img src={url} className="h-24 object-cover rounded w-full" alt={`Media ${i}`} />
                  <button
                    type="button"
                    onClick={async () => {
                      const deleted = await deleteImageFromSupabase(storagePath);
                      if (deleted) {
                        const updated = (form.media || []).filter((_: string, index: number) => index !== i);
                        handleChange('media', updated);
                        toast.success('Removed');
                      } else {
                        toast.error('Failed to delete');
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