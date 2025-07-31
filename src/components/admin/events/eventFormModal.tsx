'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { Dialog, Disclosure } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { LOCATION_ZONES } from '@/lib/locationZones';
import { AD_SLOTS } from '@/lib/adSlots';
import { FIELD_OPTIONS } from '@/lib/fieldOption'; // adjust path if needed

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function EventFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;

  const createDefaultForm = () => ({
    id: uuidv4(),
    name: '',
    slug: '',
    description: '',
    location: '',
    area: '',
    district: '',
    address: '',
    image: '',
    gallery: [],
    cover_image_alt: '',
    media: [],
    type: '',
    theme: [],
    tags: [],
    date: '',
    time: '',
    duration: '',
    ismultiday: false,
    isrecurring: false,
    frequency: '',
    season: '',
    visitseason: [],
    entryfee: {},
    averagecostestimate: {},
    highlights: [],
    nearbydestinations: [],
    availablefacilities: [],
    contact: '',
    email: '',
    website: '',
    organizer: '',
    latitude: '',
    longitude: '',
    expectedfootfall: '',
    tips: [],
    warnings: [],
    view_count: '',
    click_count: '',
    meta_title: '',
    meta_description: '',
    popularityindex: '',
    sponsoredby: '',
    visibilitystatus: 'visible',
    highlight: false,
    adslot: 'none',
    adactive: false,
    ai_score: '',
    search_keywords: [],
    searchboost: '',
    summary: '',
    include_in_ai_search: true,
    faq_answers: [],
    created_at: new Date().toISOString(),
  });

  const [form, setForm] = useState(() => ({
    ...createDefaultForm(),
    ...initialData,
    adslot: initialData?.adslot ?? 'none',
    adactive: initialData?.adactive ?? false,
  }));

  useEffect(() => {
    setForm((prev: any) => ({
      ...createDefaultForm(),
      ...initialData,
      adslot: initialData?.adslot ?? 'none',
      adactive: initialData?.adactive ?? false,
    }));
  }, [initialData]);

  // --- Handlers ---
  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };
  const handleNestedChange = (objKey: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [objKey]: { ...prev[objKey], [field]: value },
    }));
  };

  // --- Helpers ---
  const buildPayload = () => ({
    ...form,
    slug: form.slug,
    adslot: form.adslot,
    adactive: form.adactive,
    created_at: form.created_at || new Date().toISOString(),
  });

  const handleSubmit = async () => {
    try {
      const slug = await generateSlug(supabase, form.name, form.slug);
      const payload = { ...buildPayload(), slug, cover_image_alt: form.cover_image_alt || form.name };
      let error;
      if (isEditMode) {
        ({ error } = await supabase.from('events').update(payload).eq('id', form.id));
      } else {
        ({ error } = await supabase.from('events').insert([payload]));
      }
      if (error) throw error;
      toast.success(`Event ${isEditMode ? 'updated' : 'created'} successfully`);
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error saving data');
    }
  };

  // --- UI render helpers
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

  const renderTextArea = (label: string, key: string, rows = 3) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={form[key] || ''}
        onChange={(e) => handleChange(key, e.target.value)}
        rows={rows}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );

  const renderSelect = (label: string, key: string, options: string[]) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <select
        value={form[key] || ''}
        onChange={e => handleChange(key, e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select...</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const renderMultiSelect = (label: string, key: string, options: string[]) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <select
        multiple
        value={form[key] || []}
        onChange={e => {
          const selected = Array.from(e.target.selectedOptions, o => o.value);
          handleChange(key, selected);
        }}
        className="w-full border px-3 py-2 rounded"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="text-xs mt-1 opacity-70">{Array.isArray(form[key]) ? form[key].join(', ') : ''}</div>
    </div>
  );

  const renderArray = (label: string, key: string, placeholder?: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={Array.isArray(form[key]) ? form[key].join(', ') : ''}
        onChange={e =>
          handleChange(
            key,
            e.target.value
              .split(',')
              .map(x => x.trim())
              .filter(Boolean)
          )
        }
        placeholder={placeholder || 'Comma-separated values'}
        className="w-full border px-3 py-2 rounded"
        rows={2}
      />
    </div>
  );

  const renderJSON = (label: string, key: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label} (JSON)</label>
      <textarea
        value={JSON.stringify(form[key] ?? {}, null, 2)}
        onChange={e => {
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
      <input type="checkbox" checked={!!form[key]} onChange={e => handleChange(key, e.target.checked)} />
      <label className="text-sm">{label}</label>
    </div>
  );

  // --- MAIN MODAL UI ---
  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="bg-white p-6 w-full max-w-3xl z-10 overflow-y-auto max-h-[95vh] rounded-xl">
        <Dialog.Title className="text-xl font-bold mb-4">
          {isEditMode ? 'Edit Event' : 'Add New Event'}
        </Dialog.Title>

        {/* --- BASIC INFO --- */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                <span className={open ? '' : 'opacity-70'}>📝 Basic Info</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Name', 'name')}
                  {renderSelect('Type', 'type', [...FIELD_OPTIONS.events.type])}
                  {renderSelect('Location Zone', 'location', LOCATION_ZONES)}
                  {renderInput('Area', 'area')}
                  {renderInput('District', 'district')}
                  {renderInput('Address', 'address')}
                  {renderInput('Latitude', 'latitude')}
                  {renderInput('Longitude', 'longitude')}
                  {renderInput('Map Link', 'maplink')}
                </div>
                {renderTextArea('Description', 'description', 3)}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* --- SCHEDULE --- */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📅 Schedule & Date</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Date', 'date')}
                  {renderInput('Time', 'time')}
                  {renderInput('Duration', 'duration')}
                  {renderInput('Season', 'season')}
                  {renderMultiSelect('Visit Season', 'visitseason', [...FIELD_OPTIONS.events.visitseason])}
                  {renderCheckbox('Is Multiday', 'ismultiday')}
                  {renderCheckbox('Is Recurring', 'isrecurring')}
                  {renderInput('Frequency', 'frequency')}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* --- EXPERIENCE, TAGS & THEME --- */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🎟️ Experience & Highlights</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderMultiSelect('Tags', 'tags', [...FIELD_OPTIONS.events.tags])}
                  {renderMultiSelect('Theme', 'theme', [...FIELD_OPTIONS.events.theme])}
                  {renderArray('Highlights', 'highlights')}
                  {renderArray('Nearby Destinations', 'nearbydestinations')}
                  {renderMultiSelect('Available Facilities', 'availablefacilities', [...FIELD_OPTIONS.events.availablefacilities])}
                  {renderArray('Tips', 'tips')}
                  {renderArray('Warnings', 'warnings')}
                  {renderInput('Expected Footfall', 'expectedfootfall')}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* --- ENTRY & COST --- */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>💰 Entry & Cost</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                {renderJSON('Entry Fee', 'entryfee')}
                {renderJSON('Average Cost Estimate', 'averagecostestimate')}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* --- MEDIA --- */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🖼️ Media & Gallery</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                {/* Main Image Upload */}
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
                        category: 'events',
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
                  {renderInput('Cover Image Alt', 'cover_image_alt')}
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
                          category: 'events',
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
                          >✕</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {renderArray('Media (YouTube, Instagram, etc.)', 'media', 'Comma-separated links')}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* --- CONTACT & ORGANIZER --- */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📞 Contact & Organizer</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Contact', 'contact')}
                  {renderInput('Email', 'email')}
                  {renderInput('Website', 'website')}
                  {renderInput('Organizer', 'organizer')}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* --- PROMOTION, SEO & ADS --- */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🚀 Promotion, SEO & Ads</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderSelect('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
                  {renderCheckbox('Highlight', 'highlight')}
                  {renderInput('Sponsored By', 'sponsoredby')}
                  {renderInput('Meta Title', 'meta_title')}
                  {renderTextArea('Meta Description', 'meta_description')}
                  {renderInput('Popularity Index', 'popularityindex', 'number')}
                  {renderInput('View Count', 'view_count', 'number')}
                  {renderInput('Click Count', 'click_count', 'number')}
                  {renderSelect('Ad Slot', 'adslot', ['', ...AD_SLOTS])}
                  {renderCheckbox('Ad Active', 'adactive')}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* --- AI & ADVANCED --- */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🤖 AI & Advanced</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('AI Score', 'ai_score', 'number')}
                  {renderInput('Search Boost', 'searchboost', 'number')}
                  {renderCheckbox('Include in AI Search', 'include_in_ai_search')}
                  {renderArray('Search Keywords', 'search_keywords', 'Comma-separated alternatives')}
                  {renderTextArea('AI Summary', 'summary')}
                </div>
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
            </div>
          )}
        </Disclosure>

        {/* --- SUBMIT BUTTONS --- */}
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
