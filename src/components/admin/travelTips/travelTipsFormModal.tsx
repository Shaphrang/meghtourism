'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { Dialog, Disclosure } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { uploadImageToSupabase } from '@/lib/uploadToSupabase';
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase';
import { AD_SLOTS } from '@/lib/adSlots';
import { FIELD_OPTIONS } from '@/lib/fieldOption';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function TravelTipFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;
  const blankSocial = { facebook: '', instagram: '', youtube: '' };

  const createDefaultForm = () => ({
    id: uuidv4(),
    title: '',
    slug: '',
    summary: '',
    content: '',
    image: '',
    gallery: [],
    cover_image_alt: '',
    tags: [],
    category: '',
    applicability: [],
    location: '',
    district: '',
    region: '',
    season: '',
    visitseason: [],
    related_places: [],
    media: [],
    source_url: '',
    author: '',
    priority_level: '',
    highlight: false,
    visibilitystatus: 'visible',
    popularityindex: 0,
    meta_title: '',
    meta_description: '',
    sponsoredby: '',
    adslot: 'none',
    adactive: false,
    isfeaturedforhome: false,
    ai_score: 0,
    search_keywords: [],
    searchboost: 0,
    include_in_ai_search: true,
    faq_answers: [],
    contact: '',
    email: '',
    website: '',
    socialmedia: blankSocial,
    theme: [],
    viewcount: 0,
    view_count: 0,
    click_count: 0,
    created_at: new Date().toISOString(),
  });

  const mapInitialData = (data: any) =>
    data
      ? {
          ...createDefaultForm(),
          ...data,
          socialmedia: {
            ...blankSocial,
            ...(data.socialmedia || {}),
          },
        }
      : createDefaultForm();

  const [form, setForm] = useState(() => mapInitialData(initialData));
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

  const setSocial = (platform: string, value: string) =>
    setForm((prev: any) => ({
      ...prev,
      socialmedia: { ...(prev.socialmedia ?? blankSocial), [platform]: value },
    }));

  // Render helpers
  const Input = (label: string, key: string, type: 'text' | 'number' | 'email' | 'url' = 'text', disabled = false) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={form[key] ?? ''}
        onChange={e => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
        disabled={disabled}
      />
    </div>
  );
  const TextArea = (label: string, key: string, rows = 3, disabled = false) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        rows={rows}
        value={form[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
        disabled={disabled}
      />
    </div>
  );
  const Select = (label: string, key: string, options: string[], disabled = false) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={form[key] ?? ''}
        onChange={e => set(key, e.target.value)}
        className="w-full border px-3 py-2 rounded mt-1"
        disabled={disabled}
      >
        <option value="">---</option>
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
  const Multi = (label: string, key: string, options: string[], disabled = false) => (
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
        disabled={disabled}
      >
        {options.map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
  const Check = (label: string, key: string, disabled = false) => (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={!!form[key]}
        onChange={e => set(key, e.target.checked)}
        disabled={disabled}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
  const renderArray = (label: string, key: string, disabled = false) => (
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
        placeholder="Comma separated"
        disabled={disabled}
      />
    </div>
  );

  // File/image handlers (same as before)
  const upImage = async (file: File, place: 'main' | 'gallery') => {
    const url = await uploadImageToSupabase({ file, category: 'traveltips', id: form.id, type: place });
    if (!url) return toast.error('Upload failed');
    place === 'main' ? set('image', url) : set('gallery', [...(form.gallery ?? []), url]);
  };
  const delImage = async (url: string, idx?: number) => {
    const ok = await deleteImageFromSupabase(url.split('/storage/v1/object/public/')[1]);
    if (!ok) return toast.error('Delete failed');
    if (idx == null) set('image', '');
    else set('gallery', (form.gallery ?? []).filter((_: any, i: number) => i !== idx));
  };

  // Save handler
  const save = async () => {
    setLoading(true);
    try {
      const slug = await generateSlug(supabase, form.title, form.slug);
      const payload = { ...form, slug };
      if (isEditMode) {
        const { error } = await supabase.from('traveltips').update(payload).eq('id', form.id);
        if (error) throw error;
        toast.success('Travel tip updated');
      } else {
        const { error } = await supabase.from('traveltips').insert([payload]);
        if (error) throw error;
        toast.success('Travel tip created');
      }
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error saving data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-4xl overflow-y-auto max-h-[95vh]">
        <Dialog.Title className="text-xl font-bold mb-4">{isEditMode ? 'Edit Travel Tip' : 'Add Travel Tip'}</Dialog.Title>

        {/* CORE & CONTENT */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                <span className={open ? '' : 'opacity-70'}>📝 Basic Info</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('Title', 'title')}
                  {Input('Slug', 'slug')}
                  {Select('Category', 'category', [...FIELD_OPTIONS.traveltips.category])}
                  {Multi('Tags', 'tags', [...FIELD_OPTIONS.traveltips.tags])}
                  {Multi('Theme', 'theme', [...FIELD_OPTIONS.traveltips.theme])}
                  {Multi('Applicability', 'applicability', [...FIELD_OPTIONS.traveltips.applicability])}
                  {Input('Location', 'location')}
                  {Input('District', 'district')}
                  {Input('Region', 'region')}
                  {Select('Season', 'season', [...FIELD_OPTIONS.traveltips.season])}
                  {Multi('Visit Season', 'visitseason', [...FIELD_OPTIONS.traveltips.visitseason])}
                  {renderArray('Related Places (slugs)', 'related_places')}
                  {Input('Source URL', 'source_url')}
                  {Input('Author', 'author')}
                  {Input('Priority Level', 'priority_level')}
                </div>
                {TextArea('Summary', 'summary')}
                {TextArea('Content', 'content', 6)}
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
                  <label className="font-medium">Main Image</label>
                  <input type="file" onChange={e => e.target.files?.[0] && upImage(e.target.files[0], 'main')} />
                  {form.image && (
                    <div className="flex items-center gap-2 mt-2">
                      <img src={form.image} alt="Main" className="w-32 h-20 object-cover" />
                      <button onClick={() => delImage(form.image!)} className="text-red-600 text-sm">Delete</button>
                    </div>
                  )}
                  {Input('Cover Image Alt Text', 'cover_image_alt')}
                </div>
                <div className="mt-4">
                  <label className="font-medium">Gallery Images</label>
                  <input
                    type="file"
                    multiple
                    onChange={e => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(f => upImage(f, 'gallery'));
                    }}
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
                {renderArray('Media URLs (YouTube, Instagram, etc.)', 'media')}
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

        {/* PROMOTION, SEO, VISIBILITY */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>💡 Promotion, SEO & Visibility</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Input('Meta Title', 'meta_title')}
                  {TextArea('Meta Description', 'meta_description')}
                  {Input('Popularity Index', 'popularityindex', 'number')}
                  {Select('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
                  {Check('Highlight', 'highlight')}
                  {Input('Sponsored By', 'sponsoredby')}
                  {Select('Ad Slot', 'adslot', [...AD_SLOTS])}
                  {Check('Ad Active', 'adactive')}
                  {Check('Featured for Home', 'isfeaturedforhome')}
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
                  {Multi('Search Keywords', 'search_keywords', [])}
                  {Input('Search Boost', 'searchboost', 'number')}
                  {Check('Include in AI Search', 'include_in_ai_search')}
                </div>
                {/* FAQ Answers - Dynamic */}
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
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* ANALYTICS & SYSTEM */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📊 Analytics & System</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Input('View Count', 'viewcount', 'number')}
                  {Input('View Count (new)', 'view_count', 'number')}
                  {Input('Click Count', 'click_count', 'number')}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Created At:{' '}
                  {form.created_at
                    ? new Date(form.created_at).toLocaleString()
                    : '(not set)'}
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
