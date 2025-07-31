'use client';

import { useState, useEffect } from 'react';
import { Dialog, Disclosure } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { LOCATION_ZONES } from '@/lib/locationZones';
import { AD_SLOTS } from '@/lib/adSlots';
import { FIELD_OPTIONS } from '@/lib/fieldOption';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function ThrillFormModal({ initialData, onClose, onSave }: Props) {
  // Default form values (matches interface)
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
    activity_type: '',
    difficulty_level: '',
    duration: '',
    age_limit: '',
    equipment_provided: false,
    safety_measures: [],
    price: 0,
    averagecostestimate: {},
    timing: '',
    season: '',
    visitseason: [],
    isrecurring: false,
    frequency: '',
    availability: false,
    seasonalonly: false,
    tags: [],
    theme: [],
    suitablefor: [],
    accessibility: [],
    contact: '',
    email: '',
    website: '',
    socialmedia: { facebook: '', instagram: '', youtube: '' },
    tips: [],
    warnings: [],
    view_count: 0,
    click_count: 0,
    popularityindex: 0,
    meta_title: '',
    meta_description: '',
    visibilitystatus: 'visible',
    sponsoredby: '',
    highlight: false,
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
          gallery: data.gallery ?? [],
          media: data.media ?? [],
          tags: data.tags ?? [],
          theme: data.theme ?? [],
          suitablefor: data.suitablefor ?? [],
          accessibility: data.accessibility ?? [],
          tips: data.tips ?? [],
          warnings: data.warnings ?? [],
          visitseason: data.visitseason ?? [],
          safety_measures: data.safety_measures ?? [],
          faq_answers: data.faq_answers ?? [],
          averagecostestimate: data.averagecostestimate ?? {},
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

  // ----- INPUT COMPONENTS -----
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

  // ------ IMAGE/GALLERY HANDLERS ------
  const upImage = async (file: File, place: 'main' | 'gallery') => {
    const url = await uploadImageToSupabase({ file, category: 'thrills', id: form.id, type: place });
    if (!url) return toast.error('Upload failed');
    place === 'main' ? set('image', url) : set('gallery', [...(form.gallery ?? []), url]);
  };
  const delImage = async (url: string, idx?: number) => {
    const ok = await deleteImageFromSupabase(url.split('/storage/v1/object/public/')[1]);
    if (!ok) return toast.error('Delete failed');
    if (idx == null) set('image', '');
      else set('gallery', (form.gallery ?? []).filter((_: string, i: number) => i !== idx));
  };

  // ------ SAVE HANDLER ------
  const save = async () => {
    setLoading(true);
    try {
      const slug = await generateSlug(supabase, form.name, form.slug);
      const payload = { ...form, slug };
      if (isEditMode) {
        const { error } = await supabase.from('thrills').update(payload).eq('id', form.id);
        if (error) throw error;
        toast.success('Thrill updated');
      } else {
        const { error } = await supabase.from('thrills').insert([payload]);
        if (error) throw error;
        toast.success('Thrill created');
      }
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error saving data');
    } finally {
      setLoading(false);
    }
  };

  // ------ UI -------
  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" />
      <div className="bg-white p-6 max-h-[92vh] overflow-y-auto w-full max-w-4xl rounded-xl space-y-8 z-10">
        <Dialog.Title className="text-xl font-bold">{isEditMode ? 'Edit Thrill' : 'Add Thrill'}</Dialog.Title>

        {/* BASIC DETAILS */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                <span className={open ? '' : 'opacity-70'}>📝 Basic Info</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('Name', 'name')}
                  {Input('Area', 'area')}
                  {Input('District', 'district')}
                  {Input('Address', 'address')}
                  {Input('Description', 'description')}
                  {Select('Location Zone', 'location', LOCATION_ZONES as string[])}
                  {Input('Price', 'price', 'number')}
                  {Input('Duration', 'duration')}
                  {Input('Timing', 'timing')}
                  {Multi('Season', 'season', [...FIELD_OPTIONS.thrills.season])}
                  {Multi('Visit Season', 'visitseason', [...FIELD_OPTIONS.thrills.visitseason])}
                  {Select('Activity Type', 'activity_type', [...FIELD_OPTIONS.thrills.activity_type])}
                  {Select('Difficulty Level', 'difficulty_level', [...FIELD_OPTIONS.thrills.difficulty_level])}
                  {Input('Age Limit', 'age_limit')}
                  {Check('Equipment Provided', 'equipment_provided')}
                  {Multi('Safety Measures', 'safety_measures', [...FIELD_OPTIONS.thrills.safety_measures])}
                  {Input('Contact', 'contact')}
                  {Input('Email', 'email')}
                  {Input('Website', 'website')}
                  {Input('Frequency', 'frequency')}
                  {Check('Is Recurring?', 'isrecurring')}
                  {Check('Available Now?', 'availability')}
                  {Check('Seasonal Only?', 'seasonalonly')}
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
                      <button onClick={() => delImage(form.image)} className="text-red-600 text-sm">
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
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* CLASSIFICATION */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🏷️ Classification</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Multi('Tags', 'tags', [...FIELD_OPTIONS.thrills.tags])}
                  {Multi('Theme', 'theme', [...FIELD_OPTIONS.thrills.theme])}
                  {Multi('Suitable For', 'suitablefor', [...FIELD_OPTIONS.thrills.suitablefor])}
                  {Multi('Accessibility', 'accessibility', [...FIELD_OPTIONS.thrills.accessibility])}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* TIPS & WARNINGS */}
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
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* SOCIAL & CONTACT */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📞 Social & Contact</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* ADMIN & SEO */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>⚙️ Admin & SEO</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('Popularity Index', 'popularityindex', 'number')}
                  {Input('Meta Title', 'meta_title')}
                  {TextArea('Meta Description', 'meta_description')}
                  {Select('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
                  {Input('Sponsored By', 'sponsoredby')}
                  {Check('Highlight', 'highlight')}
                  {Select('Ad Slot', 'adslot', [...AD_SLOTS])}
                  {Check('Ad Active', 'adactive')}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('AI Score', 'ai_score', 'number')}
                  {renderArray('Search Keywords', 'search_keywords')}
                  {Input('Search Boost', 'searchboost', 'number')}
                  {TextArea('AI Summary', 'summary')}
                  {Check('Include in AI Search', 'include_in_ai_search')}
                  {renderJSON('Average Cost Estimate', 'averagecostestimate')}
                </div>
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

        {/* FINAL BUTTONS */}
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
      </div>
    </Dialog>
  );
}
