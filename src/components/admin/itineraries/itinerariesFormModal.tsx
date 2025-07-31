'use client';

import { useState, useEffect } from 'react';
import { Dialog, Disclosure } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { AD_SLOTS } from '@/lib/adSlots';
import { FIELD_OPTIONS } from '@/lib/fieldOption';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function ItineraryFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const createDefaultForm = () => ({
    id: uuidv4(),
    title: '',
    slug: '',
    description: '',
    days: 1,
    starting_point: '',
    ending_point: '',
    regions_covered: [],
    idealfor: [],
    theme: [],
    season: '',
    visitseason: [],
    tags: [],
    estimated_cost: {},
    travel_mode: [],
    highlights: [],
    places_per_day: [],
    maplink: '',
    image: '',
    gallery: [],
    cover_image_alt: '',
    media: [],
    tips: [],
    warnings: [],
    contact: '',
    email: '',
    website: '',
    socialmedia: { facebook: '', instagram: '', youtube: '' },
    customizable: false,
    author: '',
    ratings: 0,
    reviews: [],
    viewcount: 0,
    view_count: 0,
    click_count: 0,
    bookings_count: 0,
    lastbookedat: '',
    meta_title: '',
    meta_description: '',
    popularityindex: 0,
    visibilitystatus: 'visible',
    highlight: false,
    sponsoredby: '',
    adslot: 'none',
    adactive: false,
    isfeaturedforhome: false,
    ai_score: 0,
    search_keywords: [],
    searchboost: 0,
    summary: '',
    include_in_ai_search: true,
    faq_answers: [],
    created_at: new Date().toISOString(),
  });

  const mapInitialData = (data: any) =>
    data
      ? {
          ...createDefaultForm(),
          ...data,
          socialmedia: {
            facebook: data.socialmedia?.facebook ?? '',
            instagram: data.socialmedia?.instagram ?? '',
            youtube: data.socialmedia?.youtube ?? '',
          },
        }
      : createDefaultForm();

  const [form, setForm] = useState(() => mapInitialData(initialData));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(mapInitialData(initialData));
  }, [initialData]);

  const set = (key: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

  const setSocial = (platform: string, value: string) =>
    setForm((prev: any) => ({
      ...prev,
      socialmedia: { ...(prev.socialmedia ?? {}), [platform]: value },
    }));

  // --------- INPUT RENDERERS ---------
  const Input = (label: string, key: string, type: 'text' | 'number' | 'email' = 'text') => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={form[key] ?? ''}
        onChange={e => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
      />
    </div>
  );
  const TextArea = (label: string, key: string, rows = 3) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={rows}
        value={form[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
      />
    </div>
  );
  const Select = (label: string, key: string, options: string[]) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={form[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
      >
        <option value="">---</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
  const Multi = (label: string, key: string, options: string[]) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        multiple
        value={form[key] ?? []}
        onChange={e =>
          set(
            key,
            Array.from(e.target.selectedOptions).map(o => o.value)
          )
        }
        className="w-full border px-3 py-2 rounded mt-1 h-28"
      >
        {options.map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
  const Check = (label: string, key: string) => (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={!!form[key]}
        onChange={e => set(key, e.target.checked)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
  const renderArray = (label: string, key: string, placeholder = 'Comma separated') => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={Array.isArray(form[key]) ? form[key].join(', ') : ''}
        onChange={e =>
          set(
            key,
            e.target.value
              .split(',')
              .map((x: string) => x.trim())
              .filter(Boolean)
          )
        }
        className="w-full border px-3 py-2 rounded mt-1"
        rows={2}
        placeholder={placeholder}
      />
    </div>
  );
  const renderJSON = (label: string, key: string) => (
    <div>
      <label className="text-sm font-medium">{label} (JSON)</label>
      <textarea
        value={JSON.stringify(form[key] ?? {}, null, 2)}
        onChange={e => {
          try {
            set(key, JSON.parse(e.target.value));
          } catch {}
        }}
        className="w-full border px-3 py-2 font-mono rounded mt-1"
        rows={3}
      />
    </div>
  );

  // ----------- SAVE HANDLER -------------
  const save = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // ----------- IMAGE & GALLERY -----------
  const upImage = async (file: File, place: 'main' | 'gallery') => {
    const url = await uploadImageToSupabase({ file, category: 'itineraries', id: form.id, type: place });
    if (!url) return toast.error('Upload failed');
    place === 'main' ? set('image', url) : set('gallery', [...(form.gallery ?? []), url]);
  };
  const delImage = async (url: string, idx?: number) => {
    const ok = await deleteImageFromSupabase(url.split('/storage/v1/object/public/')[1]);
    if (!ok) return toast.error('Delete failed');
    if (idx == null) set('image', '');
      else set('gallery', (form.gallery ?? []).filter((_: string, i: number) => i !== idx));
  };

  // ----------- UI -------------
  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" />
      <div className="bg-white p-6 max-h-[92vh] overflow-y-auto w-full max-w-4xl rounded-xl space-y-8 z-10">
        <Dialog.Title className="text-xl font-bold">{isEditMode ? 'Edit Itinerary' : 'Add Itinerary'}</Dialog.Title>

        {/* BASIC DETAILS */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                <span className={open ? '' : 'opacity-70'}>📝 Basic Info</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('Title', 'title')}
                  {Input('Days', 'days', 'number')}
                  {Input('Starting Point', 'starting_point')}
                  {Input('Ending Point', 'ending_point')}
                  {Multi('Regions Covered', 'regions_covered', [...FIELD_OPTIONS.itineraries.regions_covered])}
                  {Multi('Ideal For', 'idealfor', [...FIELD_OPTIONS.itineraries.idealfor])}
                  {Multi('Theme', 'theme', [...FIELD_OPTIONS.itineraries.theme])}
                  {Input('Season', 'season')}
                  {Multi('Visit Season', 'visitseason', [...FIELD_OPTIONS.itineraries.visitseason])}
                  {Multi('Tags', 'tags', [...FIELD_OPTIONS.itineraries.tags])}
                  {Multi('Travel Mode', 'travel_mode', [...FIELD_OPTIONS.itineraries.travel_mode])}
                  {Input('Author', 'author')}
                  {Input('Ratings', 'ratings', 'number')}
                  {Input('Region', 'region')}
                </div>
                {TextArea('Description', 'description', 4)}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* HIGHLIGHTS & PLAN */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🌟 Highlights & Daily Plan</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderArray('Highlights', 'highlights')}
                  {renderJSON('Places Per Day', 'places_per_day')}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* IMAGES & MEDIA */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🖼️ Images & Media</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="mb-4">
                  <label className="block font-medium text-sm mb-1">Main Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files?.[0] && upImage(e.target.files[0], 'main')}
                    className="border px-3 py-2 w-full"
                  />
                  {form.image && (
                    <div className="flex items-center gap-2 mt-2">
                      <img src={form.image} alt="Main" className="w-32 h-20 object-cover" />
                      <button onClick={() => delImage(form.image!)} className="text-red-600 text-sm">
                        Delete
                      </button>
                    </div>
                  )}
                  {Input('Cover Image Alt Text', 'cover_image_alt')}
                </div>
                <div className="mb-4">
                  <label className="block font-medium text-sm mb-1">Gallery Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(f => upImage(f, 'gallery'));
                    }}
                    className="border px-3 py-2 w-full"
                  />
                  <div className="flex flex-wrap gap-3 mt-2">
                    {(form.gallery ?? []).map((img: string, idx: number) => (
                      <div key={idx} className="relative">
                        <img src={img} alt="Gallery" className="w-28 h-20 object-cover rounded" />
                        <button
                          onClick={() => delImage(img, idx)}
                          className="absolute top-0 right-0 text-red-600 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {renderArray('Media (YouTube, Instagram, etc.)', 'media')}
                {Input('Map Link', 'maplink')}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* CONTACT & SOCIAL */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📞 Contact & Social</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('Contact', 'contact')}
                  {Input('Email', 'email')}
                  {Input('Website', 'website')}
                  <div>
                    <label className="text-sm font-medium">Social Media</label>
                    {['facebook', 'instagram', 'youtube'].map(platform => (
                      <input
                        key={platform}
                        placeholder={platform.charAt(0).toUpperCase() + platform.slice(1) + ' URL'}
                        value={form.socialmedia?.[platform] || ''}
                        onChange={e => setSocial(platform, e.target.value)}
                        className="w-full border px-3 py-2 rounded mt-1 mb-1"
                      />
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* GUIDANCE & TIPS */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📘 Tips & Guidance</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderArray('Tips', 'tips')}
                  {renderArray('Warnings', 'warnings')}
                  {renderArray('Reviews (IDs)', 'reviews')}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* COST & PROMOTION */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>💰 Cost & Promotion</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderJSON('Estimated Cost', 'estimated_cost')}
                  {Input('Meta Title', 'meta_title')}
                  {TextArea('Meta Description', 'meta_description')}
                  {Input('Popularity Index', 'popularityindex', 'number')}
                  {Select('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
                  {Input('Sponsored By', 'sponsoredby')}
                  {Check('Highlight on Home', 'highlight')}
                  {Select('Ad Slot', 'adslot', [...AD_SLOTS])}
                  {Check('Ad Active', 'adactive')}
                  {Check('Featured for Home', 'isfeaturedforhome')}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* AI ADVANCED */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🤖 AI & Advanced</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('AI Score', 'ai_score', 'number')}
                  {Multi('Search Keywords', 'search_keywords', [])}
                  {Input('Search Boost', 'searchboost', 'number')}
                  {TextArea('AI Summary', 'summary')}
                  {Check('Include in AI Search', 'include_in_ai_search')}
                </div>

                {/* FAQ Answers - Dynamic add/edit/remove */}
                <div className="mb-4 mt-4">
                  <label className="block font-medium text-sm mb-1">FAQ Answers</label>
                  {(form.faq_answers || []).map((item: any, idx: number) => (
                    <div key={idx} className="border p-2 rounded mb-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={item.question || ''}
                        onChange={e => {
                          const updated = [...form.faq_answers];
                          updated[idx].question = e.target.value;
                          set('faq_answers', updated);
                        }}
                        className="w-full border mb-1 px-2 py-1 rounded"
                      />
                      <textarea
                        placeholder="Answer"
                        value={item.answer || ''}
                        onChange={e => {
                          const updated = [...form.faq_answers];
                          updated[idx].answer = e.target.value;
                          set('faq_answers', updated);
                        }}
                        className="w-full border px-2 py-1 rounded"
                        rows={2}
                      />
                      <div className="text-right mt-1">
                        <button
                          onClick={() => {
                            const updated = [...form.faq_answers];
                            updated.splice(idx, 1);
                            set('faq_answers', updated);
                          }}
                          className="text-red-500 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    onClick={() =>
                      set('faq_answers', [
                        ...(form.faq_answers || []),
                        { question: '', answer: '' },
                      ])
                    }
                  >
                    Add FAQ
                  </button>
                </div>
                {/* Created At Timestamp */}
                <div className="text-xs text-gray-400 mt-2">
                  <span>
                    Created At:{' '}
                    {form.created_at
                      ? new Date(form.created_at).toLocaleString()
                      : '(not set)'}
                  </span>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* FINAL ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded"
            type="button"
          >
            {loading ? 'Saving…' : isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div> {/* closes the main inner modal div */}
    </Dialog>
  );
}
