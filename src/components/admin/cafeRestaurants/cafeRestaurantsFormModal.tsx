'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Disclosure } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { generateSlug } from '@/lib/generateSlug';
import { slugify } from '@/lib/utils';

import { LOCATION_ZONES } from '@/lib/locationZones';
import { DISTRICTS } from '@/lib/districts';
import { AD_SLOTS } from '@/lib/adSlots';
import { FIELD_OPTIONS } from '@/lib/fieldOption';
import { supabase } from '@/lib/supabaseClient';


interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function CafeRestaurantFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const cafeOptions = FIELD_OPTIONS.cafes;

  // Default form
  const createDefaultForm = () => ({
    id: crypto.randomUUID(),
    name: '',
    slug: '',
    description: '',
    type: '',
    cuisine: [],
    tags: [],
    theme: [],
    visitseason: [],
    features: [],
    dietaryoptions: [],
    accessibility: [],
    menu: [],
    popularitems: [],
    location: '',
    area: '',
    district: '',
    address: '',
    latitude: '',
    longitude: '',
    maplink: '',
    pricelevel: '',
    timing: '',
    season: '',
    averagecost: '',
    popularityindex: '',
    visibilitystatus: 'visible',
    isfeaturedforhome: false,
    highlight: false,
    sponsoredby: '',
    distancefromshillong: '',
    distancefromguwahati: '',
    image: '',
    gallery: [],
    cover_image_alt: '',
    media: [],
    contact: '',
    email: '',
    website: '',
    socialmedia: {},
    isfamilyfriendly: false,
    isrecurring: false,
    frequency: '',
    tips: [],
    warnings: [],
    reviews: [],
    adslot: 'none',
    adactive: false,
    view_count: '',
    click_count: '',
    meta_title: '',
    meta_description: '',
    ai_score: '',
    searchboost: '',
    include_in_ai_search: false,
    search_keywords: [],
    summary: '',
    faq_answers: [],
    created_at: '',
  });

  // Map initial data to form
  const mapInitialData = (data: any) => data
    ? { ...createDefaultForm(), ...data }
    : createDefaultForm();

  const [form, setForm] = useState(() => mapInitialData(initialData));
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    if (!form.name) return 'Name is required';
    if (!form.type) return 'Type is required';
    if (!form.location) return 'Location is required';
    if (!form.district) return 'District is required';
    if (!form.image) return 'Image is required';
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    setLoading(true);
    try {
      const slug = await generateSlug(supabase, form.name, form.slug);
      const payload = {
        ...form,
        slug,
        cover_image_alt: form.cover_image_alt || form.name,
        created_at: form.created_at || new Date().toISOString(),
        adslot: form.adslot,
        adactive: form.adactive,
      };
      //delete payload.adSlot;
      //delete payload.adActive;
      if (isEditMode) {
        const { error } = await supabase
          .from('cafes_and_restaurants')
          .update(payload)
          .eq('id', form.id);
        if (error) throw error;
        toast.success('Entry updated');
      } else {
        const { error } = await supabase
          .from('cafes_and_restaurants')
          .insert([payload]);
        if (error) throw error;
        toast.success('Entry created');
      }
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error saving data');
    }
    setLoading(false);
  };

  // --- Render Helpers ---
  const renderInput = (label: string, key: string, type: string = 'text') => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <input
        type={type}
        value={form[key] || ''}
        onChange={e => handleChange(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );

  const renderTextArea = (label: string, key: string, rows: number = 3) => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={form[key] || ''}
        onChange={e => handleChange(key, e.target.value)}
        className="w-full border px-3 py-2 rounded"
        rows={rows}
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

  const renderCheckbox = (label: string, key: string) => (
    <div className="mb-3 flex items-center gap-2">
      <input type="checkbox" checked={form[key] || false} onChange={e => handleChange(key, e.target.checked)} />
      <label className="text-sm">{label}</label>
    </div>
  );

  const renderArray = (label: string, key: string, placeholder = "Comma-separated") => (
    <div className="mb-3">
      <label className="block font-medium text-sm mb-1">{label}</label>
      <textarea
        value={Array.isArray(form[key]) ? form[key].join(', ') : ''}
        onChange={e => handleChange(key, e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
        className="w-full border px-3 py-2 rounded"
        placeholder={placeholder}
        rows={2}
      />
    </div>
  );

  // --- Main Modal ---
  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-4xl overflow-y-auto max-h-[95vh]">
        <Dialog.Title className="text-xl font-bold mb-4">{isEditMode ? 'Edit Cafe/Restaurant' : 'Add Cafe/Restaurant'}</Dialog.Title>

        {/* BASIC DETAILS */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                <span className={open ? '' : 'opacity-70'}>🍽️ Basic Info</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput('Name', 'name')}
                    {renderSelect('Type', 'type', [...cafeOptions.type])}
                    {renderSelect('Location Zone', 'location', LOCATION_ZONES)}
                    {renderSelect('District', 'district', DISTRICTS)}
                    {renderInput('Area/Locality', 'area')}
                    {renderInput('Address', 'address')}
                    {renderInput('Latitude', 'latitude', 'number')}
                    {renderInput('Longitude', 'longitude', 'number')}
                    {renderInput('Map Link', 'maplink')}
                    {renderInput('Price Level', 'pricelevel')}
                    {renderInput('Timing', 'timing')}
                    {renderInput('Season', 'season')}
                    {renderInput('Average Cost (INR)', 'averagecost', 'number')}
                    {renderInput('Popularity Index', 'popularityindex', 'number')}
                    {renderSelect('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
                    {renderCheckbox('Highlight (Show in Home)', 'highlight')}
                    {renderInput('Sponsored By', 'sponsoredby')}
                    {renderInput('Distance from Shillong (km/min)', 'distancefromshillong')}
                    {renderInput('Distance from Guwahati (km/min)', 'distancefromguwahati')}
                  </div>
                  {renderTextArea('Description', 'description', 4)}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* EXPERIENCE */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🍴 Experience & Menu</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderMultiSelect('Cuisine', 'cuisine', [...cafeOptions.cuisine])}
                    {renderMultiSelect('Tags', 'tags', [...cafeOptions.tags])}
                    {renderMultiSelect('Theme', 'theme', [...cafeOptions.theme])}
                    {renderMultiSelect('Visit Season', 'visitseason', [...cafeOptions.visitseason])}
                    {renderMultiSelect('Features', 'features', [...cafeOptions.features])}
                    {renderMultiSelect('Dietary Options', 'dietaryoptions', [...cafeOptions.dietaryoptions])}
                    {renderMultiSelect('Accessibility', 'accessibility', [...cafeOptions.accessibility])}

                    {renderArray('Menu', 'menu')}
                    {renderArray('Popular Items', 'popularitems')}
                  </div>
                  {renderCheckbox('Family Friendly', 'isfamilyfriendly')}
                  {renderCheckbox('Recurring Event/Popup', 'isrecurring')}
                  {renderInput('Frequency', 'frequency')}
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
                <div>
                  {/* Main Image Upload */}
                  <div className="mb-4">
                    <label className="block font-medium text-sm mb-1">Main Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadImageToSupabase({ file, category: 'cafes_and_restaurants', id: form.id, type: 'main', name: form.name });
                        if (url) {
                          handleChange('image', url);
                          toast.success('Image uploaded');
                        } else {
                          toast.error('Image upload failed');
                        }
                      }}
                      className="border px-3 py-2 w-full"
                    />
                    {form.image && <img src={form.image} className="mt-2 h-32 object-cover rounded" alt={form.cover_image_alt || form.name || "Main image"} />}
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
                          const url = await uploadImageToSupabase({ file, category: 'cafes_and_restaurants', id: form.id, type: 'gallery', name: form.name });
                          if (url) uploaded.push(url);
                        }
                        if (uploaded.length) {
                          handleChange('gallery', [...(form.gallery || []), ...uploaded]);
                          toast.success('Gallery images uploaded');
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
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* CONTACT */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📞 Contact & Social</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput('Contact', 'contact')}
                  {renderInput('Email', 'email')}
                  {renderInput('Website', 'website')}
                  <div className="mb-3">
                    <label className="block font-medium text-sm mb-1">Social Media</label>
                    {['facebook', 'instagram', 'youtube'].map((platform) => (
                      <input
                        key={platform}
                        placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                        value={form.socialmedia?.[platform] || ''}
                        onChange={e => handleNestedChange('socialmedia', platform, e.target.value)}
                        className="w-full border px-3 py-2 rounded mb-1"
                      />
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* INTERNAL LINKS & VISITOR INFO */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🔗 Visitor Tips & Guidance</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div>
                  {renderArray('Tips', 'tips')}
                  {renderArray('Warnings', 'warnings')}
                  {renderArray('Reviews (IDs)', 'reviews')}
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
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSelect('Ad Slot', 'adslot', ['', ...AD_SLOTS])}
                    {renderCheckbox('Ad Active', 'adactive')}
                    {renderCheckbox('Featured for Home', 'isfeaturedforhome')}
                    {renderInput('View Count', 'view_count', 'number')}
                    {renderInput('Click Count', 'click_count', 'number')}
                  </div>
                  {renderInput('Meta Title', 'meta_title')}
                  {renderTextArea('Meta Description', 'meta_description')}
                </div>
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
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput('AI Score', 'ai_score', 'number')}
                    {renderInput('Search Boost', 'searchboost', 'number')}
                    {renderCheckbox('Include in AI Search', 'include_in_ai_search')}
                  </div>
                  {renderArray('Search Keywords', 'search_keywords', 'Comma-separated alternatives')}
                  {renderTextArea('AI Summary', 'summary')}
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
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* FOOTER BUTTONS */}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
