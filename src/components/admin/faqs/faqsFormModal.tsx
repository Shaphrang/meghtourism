'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/generateSlug';
import { Dialog, Disclosure } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { AD_SLOTS } from '@/lib/adSlots'; // Adjust import path as needed
import { FIELD_OPTIONS } from '@/lib/fieldOption';

interface Props {
  initialData?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function FaqFormModal({ initialData, onClose, onSave }: Props) {
  const isEditMode = !!initialData;

  const createDefaultForm = () => ({
    id: uuidv4(),
    question: '',
    slug: '',
    answer: '',
    category: '',
    tags: [],
    theme: [],
    audience: '',
    priority: '',
    district: '',
    location: '',
    related_destinations: [],
    related_events: [],
    related_itineraries: [],
    language: '',
    view_count: '',
    click_count: '',
    meta_title: '',
    meta_description: '',
    visibilitystatus: 'visible',
    highlight: false,
    sponsoredby: '',
    adSlot: 'none',
    adActive: false,
    isfeaturedforhome: false,
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
    adSlot: initialData?.adslot ?? 'none',
    adActive: initialData?.adactive ?? false,
  }));

  useEffect(() => {
    setForm((prev: any) => ({
      ...createDefaultForm(),
      ...initialData,
      adSlot: initialData?.adslot ?? 'none',
      adActive: initialData?.adactive ?? false,
    }));
  }, [initialData]);

  // --- Handlers ---
  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // --- Submission
  const handleSubmit = async () => {
    try {
      const slug = await generateSlug(supabase, form.question, form.slug);
      const payload = {
        ...form,
        slug,
        adslot: form.adSlot,
        adactive: form.adActive,
        created_at: form.created_at || new Date().toISOString(),
      };
      let error;
      if (isEditMode) {
        ({ error } = await supabase.from('prebuilt_faqs').update(payload).eq('id', form.id));
      } else {
        ({ error } = await supabase.from('prebuilt_faqs').insert([payload]));
      }
      if (error) throw error;
      toast.success(`FAQ ${isEditMode ? 'updated' : 'created'} successfully`);
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error saving data');
    }
  };

  // --- UI Helpers
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
      <input type="checkbox" checked={!!form[key]} onChange={e => handleChange(key, e.target.checked)} />
      <label className="text-sm">{label}</label>
    </div>
  );

  // --- MAIN MODAL ---
  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white p-6 rounded-lg z-10 w-full max-w-3xl overflow-y-auto max-h-[95vh]">
        <Dialog.Title className="text-xl font-bold mb-4">{isEditMode ? 'Edit FAQ' : 'Add FAQ'}</Dialog.Title>

        {/* BASIC INFO */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mb-2">
                <span className={open ? '' : 'opacity-70'}>❓ Basic Info</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                {renderInput('Question', 'question')}
                {renderTextArea('Answer', 'answer')}
                {renderSelect('Category', 'category', [...FIELD_OPTIONS.faqs.category])}
                {renderMultiSelect('Tags', 'tags', [...FIELD_OPTIONS.faqs.tags])}
                {renderMultiSelect('Theme', 'theme', [...FIELD_OPTIONS.faqs.theme])}
                {renderInput('Audience', 'audience')}
                {renderSelect('Priority', 'priority', ['High', 'Medium', 'Low'])}
                {renderInput('Language', 'language')}
                {renderInput('District', 'district')}
                {renderInput('Location', 'location')}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* RELATIONS */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🔗 Relations</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                {renderArray('Related Destinations', 'related_destinations')}
                {renderArray('Related Events', 'related_events')}
                {renderArray('Related Itineraries', 'related_itineraries')}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* PROMOTION, SEO & VISIBILITY */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>🚀 Promotion & Visibility</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                {renderCheckbox('Highlight', 'highlight')}
                {renderInput('Sponsored By', 'sponsoredby')}
                {renderInput('Meta Title', 'meta_title')}
                {renderTextArea('Meta Description', 'meta_description')}
                {renderSelect('Visibility Status', 'visibilitystatus', ['visible', 'hidden', 'draft'])}
                {renderSelect('Ad Slot', 'adSlot', ['', ...AD_SLOTS])}
                {renderCheckbox('Ad Active', 'adActive')}
                {renderCheckbox('Featured For Home', 'isfeaturedforhome')}
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
                {renderInput('AI Score', 'ai_score', 'number')}
                {renderInput('Search Boost', 'searchboost', 'number')}
                {renderCheckbox('Include in AI Search', 'include_in_ai_search')}
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
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* ANALYTICS */}
        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left font-semibold text-lg mt-4 mb-2">
                <span className={open ? '' : 'opacity-70'}>📈 Analytics</span>
              </Disclosure.Button>
              <Disclosure.Panel>
                {renderInput('View Count', 'view_count', 'number')}
                {renderInput('Click Count', 'click_count', 'number')}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* SUBMIT */}
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
