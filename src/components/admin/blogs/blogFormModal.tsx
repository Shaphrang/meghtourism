'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
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

export default function BlogFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const [form, setForm] = useState(
    initialData || {
      id: uuidv4(),
      title: '',
      slug: '',
      summary: '',
      content: '',
      author: '',
      cover_image: '',
      gallery: [] as string[],
      category: '',
      tags: [] as string[],
      theme: [] as string[],
      region: '',
      estimated_read_time: 0,
      source_url: '',
      related_places: [] as string[],
      related_events: [] as string[],
      comments: [] as string[],
      likes: 0,
      visibilitystatus: '',
      published_at: '',
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
        const { error } = await supabase.from('blogs').update(payload).eq('id', form.id);
        if (error) throw error;
        toast.success('Blog updated successfully');
      } else {
        const { error } = await supabase.from('blogs').insert([payload]);
        if (error) throw error;
        toast.success('Blog created successfully');
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
        rows={4}
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
        rows={2}
      />
    </div>
  );

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-4xl overflow-y-auto max-h-[95vh]">
        <Dialog.Title className="text-xl font-bold mb-4">{isEditMode ? 'Edit Blog' : 'Add Blog'}</Dialog.Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Title', 'title')}
          {renderInput('Author', 'author')}
          {renderInput('Category', 'category')}
          {renderInput('Region', 'region')}
          {renderInput('Estimated Read Time', 'estimated_read_time', 'number')}
          {renderInput('Source URL', 'source_url')}
          {renderInput('Published At', 'published_at')}
        </div>

        {renderTextArea('Summary', 'summary')}
        {renderTextArea('Content', 'content')}

        {renderArrayInput('Tags', 'tags')}
        {renderArrayInput('Theme', 'theme')}
        {renderArrayInput('Related Places', 'related_places')}
        {renderArrayInput('Related Events', 'related_events')}
        {renderArrayInput('Comments', 'comments')}

        {renderInput('Likes', 'likes', 'number')}
        {renderInput('Visibility Status', 'visibilitystatus')}

        {/* Cover Image Upload */}
        <div className="mb-4">
          <label className="block font-medium text-sm mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadImageToSupabase({ file, category: 'blogs', id: form.id, type: 'main' });
              if (url) {
                handleChange('cover_image', url);
                toast.success('Cover image uploaded');
              } else {
                toast.error('Cover image upload failed');
              }
            }}
            className="border px-3 py-2 w-full"
          />
          {form.cover_image && <img src={form.cover_image} className="mt-2 h-32 object-cover rounded" />}
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
                const url = await uploadImageToSupabase({ file, category: 'blogs', id: form.id, type: 'gallery' });
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