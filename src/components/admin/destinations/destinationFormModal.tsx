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
import { DISTRICTS } from '@/lib/districts';
import HorizontalCheckboxGroup from '@/components/common/horizontalCheckboxGroup';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function DestinationFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const [isUploading, setIsUploading] = useState(false);


  // 3. Helper to auto-generate address
  const autoAddress = (area: string, location: string, district: string) => {
    return [area, location, district].filter(Boolean).join(', ');
  };

  // 1. Remove fields from default form
  const createDefaultForm = () => ({
    id: uuidv4(),
    name: '',
    // slug: '', // removed
    description: '',
    location: '',
    area: '',
    district: '',
    address: '', // Will be auto-filled
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
    tags: [],
    theme: [],
    visitseason: [],
    isoffbeat: false,
    isnaturalspot: false,
    ishistorical: false,
    requirespermit: false,
    averagecostestimate: {},
    distancefromshillong: '', // will validate as integer
    distancefromguwahati: '', // will validate as integer
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

  // Init state
  const [form, setForm] = useState(() => ({ ...createDefaultForm(), ...initialData }));
  useEffect(() => {
    console.log('Initial gallery data:', initialData?.gallery);
    setForm(() => ({ ...createDefaultForm(), ...initialData }));
  }, [initialData]);

  // Watch area/location/district to auto-update address
  useEffect(() => {
    setForm((prev: any) => ({
      ...prev,
      address: autoAddress(prev.area, prev.location, prev.district),
    }));
  }, [form.area, form.location, form.district]);

  // --- Handlers
  const handleChange = (key: string, value: any) => {
    // 4. Only allow integers for distances
    if (key === 'distancefromshillong' || key === 'distancefromguwahati') {
      // Allow blank or integer
      if (value === '' || /^[0-9]+$/.test(value)) {
        setForm((prev: any) => ({ ...prev, [key]: value }));
      }
    } else {
      setForm((prev: any) => ({ ...prev, [key]: value }));
    }
  };
  const handleNestedChange = (objKey: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [objKey]: { ...prev[objKey], [field]: value },
    }));
  };

  // --- Uniform, explicit snake_case payload (removed all removed fields)
  const buildPayload = () => ({
    id: form.id,
    name: form.name,
    description: form.description,
    location: form.location,
    area: form.area,
    district: form.district,
    category: form.category,
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
    tags: form.tags,
    theme: form.theme,
    suitablefor: form.suitablefor,
    warnings: form.warnings,
    visitseason: form.visitseason,
    isoffbeat: form.isoffbeat,
    isnaturalspot: form.isnaturalspot,
    ishistorical: form.ishistorical,
    requirespermit: form.requirespermit,
    averagecostestimate: form.averagecostestimate,
    distancefromshillong: form.distancefromshillong ? parseInt(form.distancefromshillong) : null,
    distancefromguwahati: form.distancefromguwahati ? parseInt(form.distancefromguwahati) : null,
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

const handleSubmit = async () => {
  try {
    const payload = {
      ...buildPayload(),
      cover_image_alt: form.cover_image_alt || form.name,
    };

    // Add this:
    console.log('Saving payload.gallery:', payload.gallery);

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
  const renderInput = (label: string, key: string, type = 'text', readOnly = false) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <input
        type={type}
        value={form[key] || ''}
        readOnly={readOnly}
        onChange={(e) => handleChange(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className={`w-full border px-3 py-2 rounded ${readOnly ? 'bg-gray-100 text-gray-500' : ''}`}
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
                  {/* Slug REMOVED */}
                  {renderSelect('Location Zone', 'location', LOCATION_ZONES)}
                  {renderInput('Area/Locality', 'area')}
                  {/* 2. District select from districts list */}
                  {renderSelect('District', 'district', DISTRICTS)}
                  {renderSelect('Category', 'category', [...FIELD_OPTIONS.destinations.category])}

                  {/* 3. Address readonly */}
                  {/*{renderInput('Address (autofilled)', 'address', 'text', true)}*/}
                  {/* 4. Distance fields integer-only */}
                  {renderInput('Distance from Shillong (minutes)', 'distancefromshillong', 'text')}
                  {renderInput('Distance from Guwahati (minutes)', 'distancefromguwahati', 'text')}
                </div>
                {renderTextArea('Description', 'description', 4)}
                {renderTextArea('How to Reach', 'howtoreach', 2)}
                {renderSelect('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
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
                <div className="flex flex-col gap-1">
                  <HorizontalCheckboxGroup
                    label="Tags:"
                    value={form.tags || []}
                    options={[...FIELD_OPTIONS.destinations.tags]}
                    onChange={(selected) => handleChange('tags', selected)}
                  />
                    <HorizontalCheckboxGroup
                    label="Themes:"
                    value={form.themes || []}
                    options={[...FIELD_OPTIONS.destinations.themes]}
                    onChange={(selected) => handleChange('themes', selected)}
                  />
                    <HorizontalCheckboxGroup
                    label="Visit Season:"
                    value={form.visitseason || []}
                    options={[...FIELD_OPTIONS.destinations.visitseason]}
                    onChange={(selected) => handleChange('visitseason', selected)}
                  />
                    <HorizontalCheckboxGroup
                    label="Highlights:"
                    value={form.highlights || []}
                    options={[...FIELD_OPTIONS.destinations.highlights]}
                    onChange={(selected) => handleChange('highlights', selected)}
                  />
                    <HorizontalCheckboxGroup
                    label="Best Time To Visit:"
                    value={form.besttimetovisit || []}
                    options={[...FIELD_OPTIONS.destinations.besttimetovisit]}
                    onChange={(selected) => handleChange('besttimetovisit', selected)}
                  /><HorizontalCheckboxGroup
                    label="Things To Do:"
                    value={form.thingstodo || []}
                    options={[...FIELD_OPTIONS.destinations.thingstodo]}
                    onChange={(selected) => handleChange('thingstodo', selected)}
                  />
                    <HorizontalCheckboxGroup
                    label="Suitable For:"
                    value={form.suitablefor || []}
                    options={[...FIELD_OPTIONS.destinations.suitablefor]}
                    onChange={(selected) => handleChange('suitablefor', selected)}
                  />
                    <HorizontalCheckboxGroup
                    label="Warnings:"
                    value={form.warnings || []}
                    options={[...FIELD_OPTIONS.destinations.warnings]}
                    onChange={(selected) => handleChange('warnings', selected)}
                  />
                  {renderInput('Duration to Spend', 'durationtospend')}
                  {renderInput('Special Notice', 'specialnotice')}
                  {renderCheckbox('Is Offbeat', 'isoffbeat')}
                  {renderCheckbox('Is Natural Spot', 'isnaturalspot')}
                  {renderCheckbox('Is Historical', 'ishistorical')}
                  {renderCheckbox('Requires Permit', 'requirespermit')}
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
                      if (!files.length) return;

                      setIsUploading(true);
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
                        setForm((prev: any) => ({
                          ...prev,
                          gallery: [...(prev.gallery || []), ...uploaded],
                        }));
                      } else {
                        toast.error('Gallery upload failed');
                      }
                      setIsUploading(false);
                    }}
                    className="border px-3 py-2 w-full"
                  />


                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(form.gallery || []).map((url: string, i: number) => {
                      console.log('form.gallery1:', form.gallery);
                      const storagePath = url.split('/storage/v1/object/public/')[1];
                                                                    console.log('form.gallery2:', form.gallery);
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
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* SEO & Visibility */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🚀 SEO & Visibility</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('View Count', 'view_count', 'number')}
                  {renderInput('Click Count', 'click_count', 'number')}
                  {renderCheckbox('Highlight (Home)', 'highlight')}
                </div>
                {renderInput('Meta Title', 'meta_title')}
                {renderTextArea('Meta Description', 'meta_description')}
                {renderInput('Popularity Index', 'popularityindex', 'number')}
                {renderInput('Sponsored By', 'sponsoredby')}
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
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded" disabled={isUploading}>
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
            disabled={isUploading}
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
          {isUploading && (
            <div className="text-xs text-amber-500 mt-2">Uploading images, please wait...</div>
          )}

        </div>
      </div>
    </Dialog>
  );
}
