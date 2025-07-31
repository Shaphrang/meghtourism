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
import { FIELD_OPTIONS } from '@/lib/fieldOption'; // Adjust path as needed


interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function DestinationFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;

  // --- Initial State
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
    highlights: [],
    besttimetovisit: '',
    thingstodo: [],
    durationtospend: '',
    specialnotice: '',
    entryfee: {},
    openinghours: {},
    howtoreach: '',
    nearbyattractions: [],
    traveltimes: {},
    latitude: '',
    longitude: '',
    tags: [],
    theme: [],
    visitseason: [],
    isoffbeat: false,
    isnaturalspot: false,
    ishistorical: false,
    requirespermit: false,
    rating: '',
    averagecostestimate: {},
    tips: [],
    warnings: [],
    distancefromshillong: '',
    distancefromguwahati: '',
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

  const [form, setForm] = useState(() => ({ ...createDefaultForm(), ...initialData }));
  useEffect(() => {
  setForm(() => ({ ...createDefaultForm(), ...initialData }));
}, [initialData]);


  // --- Handlers
  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };
  const handleNestedChange = (objKey: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [objKey]: { ...prev[objKey], [field]: value },
    }));
  };

  // --- Uniform, explicit snake_case payload
  const buildPayload = () => ({
    id: form.id,
    name: form.name,
    slug: form.slug,
    description: form.description,
    location: form.location,
    area: form.area,
    district: form.district,
    address: form.address,
    image: form.image,
    gallery: form.gallery,
    cover_image_alt: form.cover_image_alt,
    media: form.media,
    highlights: form.highlights,
    besttimetovisit: form.besttimetovisit,
    thingstodo: form.thingstodo,
    durationtospend: form.durationtospend,
    specialnotice: form.specialnotice,
    entryfee: form.entryfee,
    openinghours: form.openinghours,
    howtoreach: form.howtoreach,
    nearbyattractions: form.nearbyattractions,
    traveltimes: form.traveltimes,
    latitude: form.latitude,
    longitude: form.longitude,
    tags: form.tags,
    theme: form.theme,
    visitseason: form.visitseason,
    isoffbeat: form.isoffbeat,
    isnaturalspot: form.isnaturalspot,
    ishistorical: form.ishistorical,
    requirespermit: form.requirespermit,
    rating: form.rating,
    averagecostestimate: form.averagecostestimate,
    tips: form.tips,
    warnings: form.warnings,
    distancefromshillong: form.distancefromshillong,
    distancefromguwahati: form.distancefromguwahati,
    view_count: form.view_count,
    click_count: form.click_count,
    meta_title: form.meta_title,
    meta_description: form.meta_description,
    popularityindex: form.popularityindex,
    sponsoredby: form.sponsoredby,
    visibilitystatus: form.visibilitystatus,
    highlight: form.highlight,
    adslot: form.adslot,
    adactive: form.adactive,
    ai_score: form.ai_score,
    search_keywords: form.search_keywords,
    searchboost: form.searchboost,
    summary: form.summary,
    include_in_ai_search: form.include_in_ai_search,
    faq_answers: form.faq_answers,
    created_at: form.created_at || new Date().toISOString(),
  });

  // --- Save handler
  const handleSubmit = async () => {
    try {
      const slug = await generateSlug(supabase, form.name, form.slug);
      const payload = { ...buildPayload(), slug, cover_image_alt: form.cover_image_alt || form.name };

      const { error } = isEditMode
        ? await supabase.from('destinations').update(payload).eq('id', form.id)
        : await supabase.from('destinations').insert([payload]);
      if (error) throw error;
      toast.success(`Destination ${isEditMode ? 'updated' : 'created'} successfully`);
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

  const renderTextArea = (label: string, key: string, rows = 4) => (
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
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select...</option>
        {options.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );

  const renderArray = (label: string, key: string, placeholder?: string) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={Array.isArray(form[key]) ? form[key].join(', ') : ''}
        onChange={(e) =>
          handleChange(
            key,
            e.target.value
              .split(',')
              .map((x) => x.trim())
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
    <div className="text-xs mt-1 opacity-70">
      {Array.isArray(form[key]) ? form[key].join(', ') : ''}
    </div>
  </div>
);

  const renderCheckbox = (label: string, key: string) => (
    <div className="mb-3 flex items-center gap-2">
      <input
        type="checkbox"
        checked={!!form[key]}
        onChange={(e) => handleChange(key, e.target.checked)}
      />
      <label className="text-sm">{label}</label>
    </div>
  );

  // --- Main Modal ---
  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-4xl overflow-y-auto max-h-[95vh]">

        <Dialog.Title className="text-xl font-bold mb-4">
          {isEditMode ? 'Edit Destination' : 'Add Destination'}
        </Dialog.Title>

        {/* BASIC DETAILS */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                <span className={open ? '' : 'opacity-70'}>🏞️ Basic Info</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Name', 'name')}
                  {renderInput('Slug', 'slug')}
                  {renderSelect('Location Zone', 'location', LOCATION_ZONES)}
                  {renderInput('Area/Locality', 'area')}
                  {renderInput('District', 'district')}
                  {renderInput('Address', 'address')}
                  {renderInput('Latitude', 'latitude')}
                  {renderInput('Longitude', 'longitude')}
                  {renderInput('Map Link', 'maplink')}
                  {renderInput('Distance from Shillong (km)', 'distancefromshillong')}
                  {renderInput('Distance from Guwahati (km)', 'distancefromguwahati')}
                  {renderInput('Best Time to Visit', 'besttimetovisit')}
                  {renderInput('Duration to Spend', 'durationtospend')}
                  {renderInput('Meta Title', 'meta_title')}
                  {renderInput('Sponsored By', 'sponsoredby')}
                  {renderInput('Popularity Index', 'popularityindex', 'number')}
                </div>
                {renderTextArea('Description', 'description', 4)}
                {renderTextArea('How to Reach', 'howtoreach', 2)}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* EXPERIENCE & HIGHLIGHTS */}
        <Disclosure>
        {({ open }) => (
          <div>
            <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
              <span className={open ? '' : 'opacity-70'}>🌄 Experience & Highlights</span>
            </Disclosure.Button>
            <Disclosure.Panel>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderMultiSelect('Tags', 'tags', [...FIELD_OPTIONS.destinations.tags])}
                  {renderMultiSelect('Theme', 'theme', [...FIELD_OPTIONS.destinations.themes])}
                  {renderMultiSelect('Visit Season', 'visitseason', [...FIELD_OPTIONS.destinations.visitseason])}

                  {renderArray('Highlights', 'highlights')}
                  {renderArray('Things To Do', 'thingstodo')}
                  {renderArray('Nearby Attractions', 'nearbyattractions')}
                  {renderArray('Tips', 'tips')}
                  {renderArray('Warnings', 'warnings')}
                  {renderInput('Special Notice', 'specialnotice')}
                  {renderCheckbox('Is Offbeat', 'isoffbeat')}
                  {renderCheckbox('Is Natural Spot', 'isnaturalspot')}
                  {renderCheckbox('Is Historical', 'ishistorical')}
                  {renderCheckbox('Requires Permit', 'requirespermit')}
                  {renderInput('Rating', 'rating', 'number')}
                </div>
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>


        {/* MEDIA */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🖼️ Media</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                {/* Main Image */}
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
                        category: 'destinations',
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
                  {form.image && <img src={form.image} className="mt-2 h-32 object-cover rounded" />}
                  {renderInput('Cover Image Alt', 'cover_image_alt')}
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
                        const url = await uploadImageToSupabase({
                          file,
                          category: 'destinations',
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
                                const updated = (form.gallery || []).filter((_: string, index: number) => index !== i);
                                handleChange('gallery', updated);
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

        {/* ENTRY, HOURS, COST */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>💸 Entry, Timing, Cost</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderJSON('Entry Fee', 'entryfee')}
                  {renderJSON('Opening Hours', 'openinghours')}
                  {renderJSON('Average Cost Estimate', 'averagecostestimate')}
                  {renderJSON('Travel Times', 'traveltimes')}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* PROMOTION & ADS */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🚀 Promotion & Ads</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderSelect('Ad Slot', 'adslot', [...AD_SLOTS])}
                  {renderCheckbox('Ad Active', 'adactive')}
                  {renderInput('View Count', 'view_count', 'number')}
                  {renderInput('Click Count', 'click_count', 'number')}
                  {renderSelect('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
                  {renderCheckbox('Highlight (Home)', 'highlight')}
                </div>
                {renderInput('Meta Title', 'meta_title')}
                {renderTextArea('Meta Description', 'meta_description')}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* AI & ADVANCED */}
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
