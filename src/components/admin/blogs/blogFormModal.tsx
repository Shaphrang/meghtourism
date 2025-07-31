'use client';

import { useState } from 'react';
import { Dialog, Disclosure } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { AD_SLOTS } from '@/lib/adSlots'; // array of slot names
import { LOCATION_ZONES } from '@/lib/locationZones'; // array of locations
import { DISTRICTS } from '@/lib/districts'; // array of districts
import { BLOG_CATEGORIES } from '@/lib/blogCategories'; // array of categories

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

const defaultSocialmedia = { facebook: '', instagram: '', youtube: '', twitter: '' };

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
      cover_image_alt: '',
      gallery: [] as string[],
      media: [] as string[],
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
      visibilitystatus: 'visible',
      published_at: '',
      district: '',
      location: '',
      contact: '',
      email: '',
      website: '',
      socialmedia: { ...defaultSocialmedia },
      meta_title: '',
      meta_description: '',
      highlight: false,
      sponsoredby: '',
      adslot: '',
      adactive: false,
      isfeaturedforhome: false,
      ai_score: 0,
      search_keywords: [] as string[],
      searchboost: 0,
      summary_ai: '',
      include_in_ai_search: true,
      faq_answers: [] as { question: string; answer: string }[],
      view_count: 0,
      click_count: 0,
      created_at: new Date().toISOString(),
    }
  );

  // Helper: Change handler
  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // Helper: Change nested (object) field
  const handleNestedChange = (objKey: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [objKey]: { ...prev[objKey], [field]: value },
    }));
  };

  // Helper: Validate Required Fields
  const validateForm = () => {
    if (!form.title) return 'Title is required';
    if (!form.author) return 'Author is required';
    if (!form.content) return 'Content is required';
    if (!form.category) return 'Category is required';
    if (!form.cover_image) return 'Cover image is required';
    return null;
  };

  // Handle Submit
  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    try {
      // Auto-generate slug and cover_image_alt if not set
      const slug = await generateSlug(supabase, form.title, form.slug);
      const payload = {
        ...form,
        slug,
        cover_image_alt: form.cover_image_alt || form.title,
        created_at: form.created_at || new Date().toISOString(),
      };
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

  // ---------- Input Render Helpers ----------

  // Simple text/number/date input
  const renderInput = (label: string, key: string, type = 'text', extraProps: any = {}) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <input
        type={type}
        value={form[key] ?? ''}
        onChange={e => handleChange(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border px-3 py-2 rounded"
        {...extraProps}
      />
    </div>
  );

  // Textarea input
  const renderTextArea = (label: string, key: string, rows = 4) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={form[key] ?? ''}
        onChange={e => handleChange(key, e.target.value)}
        className="w-full border px-3 py-2 rounded"
        rows={rows}
      />
    </div>
  );

  // Dropdown select
  const renderSelect = (label: string, key: string, options: string[]) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <select
        value={form[key] ?? ''}
        onChange={e => handleChange(key, e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  // Array of string, comma separated
  const renderArrayInput = (label: string, key: string, placeholder?: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={(form[key] || []).join(', ')}
        onChange={e => handleChange(key, e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
        className="w-full border px-3 py-2 rounded"
        placeholder={placeholder || 'Comma-separated values'}
        rows={2}
      />
    </div>
  );

  // Boolean switch
  const renderSwitch = (label: string, key: string) => (
    <div className="flex items-center gap-2 mb-3">
      <label className="font-medium text-sm">{label}</label>
      <input
        type="checkbox"
        checked={!!form[key]}
        onChange={e => handleChange(key, e.target.checked)}
        className="ml-2"
      />
    </div>
  );

  // ---------- Main Render ----------

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-4xl overflow-y-auto max-h-[95vh]">
        <Dialog.Title className="text-xl font-bold mb-4">
          {isEditMode ? 'Edit Blog' : 'Add Blog'}
        </Dialog.Title>

        {/* BASIC DETAILS */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                <span className={open ? '' : 'opacity-70'}>📝 Basic Info</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Title', 'title')}
                  {renderInput('Author', 'author')}
                  {renderSelect('Category', 'category', BLOG_CATEGORIES)}
                  {renderInput('Region', 'region')}
                  {renderInput('Estimated Read Time (min)', 'estimated_read_time', 'number')}
                  {renderInput('Source URL', 'source_url')}
                  {renderInput('Published At', 'published_at', 'datetime-local')}
                </div>
                {renderSelect('District', 'district', DISTRICTS)}
                {renderSelect('Location', 'location', LOCATION_ZONES)}
                {renderTextArea('Summary', 'summary')}
                {renderTextArea('Content', 'content', 8)}
                {renderArrayInput('Tags', 'tags', 'Comma-separated')}
                {renderArrayInput('Theme', 'theme', 'Comma-separated')}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* MEDIA */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🖼 Media</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                {/* Cover Image */}
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
                  {form.cover_image && (
                    <img src={form.cover_image} className="mt-2 h-32 object-cover rounded" alt="" />
                  )}
                  {renderInput('Cover Image Alt Text', 'cover_image_alt')}
                </div>
                {/* Gallery */}
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
                          >✕</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Media (YouTube, Reels, etc.) */}
                {renderArrayInput('Media Links (YouTube, Reels, etc.)', 'media', 'Comma-separated URLs')}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* CONTACT & SOCIAL */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📞 Contact & Social</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Contact Phone', 'contact')}
                  {renderInput('Email', 'email')}
                  {renderInput('Website', 'website')}
                </div>
                <div className="mb-3">
                  <label className="block font-medium text-sm mb-1">Social Media</label>
                  {['facebook', 'instagram', 'youtube', 'twitter'].map((platform) => (
                    <input
                      key={platform}
                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                      value={form.socialmedia?.[platform] || ''}
                      onChange={e =>
                        handleNestedChange('socialmedia', platform, e.target.value)
                      }
                      className="w-full border px-3 py-2 rounded mb-1"
                    />
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* INTERNAL LINKS */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🔗 Related Content</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                {renderArrayInput('Related Places (IDs)', 'related_places')}
                {renderArrayInput('Related Events (IDs)', 'related_events')}
                {renderArrayInput('Comments (IDs)', 'comments')}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* PROMOTION & VISIBILITY */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🚀 Promotion & Visibility</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderSelect('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
                  {renderSwitch('Highlight (Show in homepage)', 'highlight')}
                  {renderInput('Sponsored By', 'sponsoredby')}
                  {renderSelect('Ad Slot', 'adslot', ['', ...AD_SLOTS])}
                  {renderSwitch('Ad Active', 'adactive')}
                  {renderSwitch('Featured for Home', 'isfeaturedforhome')}
                  {renderInput('Likes', 'likes', 'number')}
                  {renderInput('View Count', 'view_count', 'number')}
                  {renderInput('Click Count', 'click_count', 'number')}
                </div>
                {renderInput('Meta Title', 'meta_title')}
                {renderTextArea('Meta Description', 'meta_description')}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* AI & ADVANCED */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🤖 AI & Advanced</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('AI Score', 'ai_score', 'number')}
                  {renderInput('Search Boost', 'searchboost', 'number')}
                  {renderSwitch('Include in AI Search', 'include_in_ai_search')}
                </div>
                {renderArrayInput('Search Keywords', 'search_keywords', 'Comma-separated alternatives')}
                {renderTextArea('AI Summary', 'summary_ai')}
                {/* FAQ Answers */}
                <div className="mb-3">
                  <label className="block font-medium text-sm mb-1">FAQ Answers</label>
                  {(form.faq_answers || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        placeholder="Question"
                        value={item.question}
                        onChange={e => {
                          const faqs = [...form.faq_answers];
                          faqs[idx].question = e.target.value;
                          handleChange('faq_answers', faqs);
                        }}
                        className="flex-1 border px-2 py-1 rounded"
                      />
                      <input
                        placeholder="Answer"
                        value={item.answer}
                        onChange={e => {
                          const faqs = [...form.faq_answers];
                          faqs[idx].answer = e.target.value;
                          handleChange('faq_answers', faqs);
                        }}
                        className="flex-1 border px-2 py-1 rounded"
                      />
                      <button
                        onClick={() => {
                          const faqs = form.faq_answers.filter((_: any, i: number) => i !== idx);
                          handleChange('faq_answers', faqs);
                        }}
                        className="px-2 text-red-500"
                      >✕</button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleChange('faq_answers', [...(form.faq_answers || []), { question: '', answer: '' }])}
                    className="mt-1 px-2 py-1 bg-gray-200 rounded"
                  >Add FAQ</button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white px-4 py-2 rounded"
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
