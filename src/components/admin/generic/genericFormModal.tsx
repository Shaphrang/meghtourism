'use client'
import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { v4 as uuidv4 } from 'uuid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { uploadImageToSupabase } from '@/lib/uploadToSupabase'
import { deleteImageFromSupabase } from '@/lib/deleteImageFromSupabase'
import { FIELD_OPTIONS } from '@/lib/fieldOption'
import { DEFAULT_FORMS, CategoryKey } from '@/lib/defaultForms'

interface Props {
  category: CategoryKey
  initialData?: any
  onClose: () => void
  onSave: () => void
}

export default function GenericFormModal({ category, initialData, onClose, onSave }: Props) {
  const defaults = DEFAULT_FORMS[category]
  const isEditMode = !!initialData

  const createDefault = () => ({ ...defaults, id: uuidv4() })

  const [form, setForm] = useState<any>(isEditMode ? { ...defaults, ...initialData } : createDefault())

  useEffect(() => {
    setForm(isEditMode ? { ...defaults, ...initialData } : createDefault())
  }, [initialData])

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    const table = category
    const { id, ...rest } = form
    if (isEditMode) {
      await supabase.from(table).update(rest).eq('id', id)
    } else {
      await supabase.from(table).insert([{ id, ...rest }])
    }
    onSave()
    onClose()
  }

  const renderField = (key: string, value: any) => {
    const options = (FIELD_OPTIONS as any)[category]?.[key]
    if (key === 'image') {
      return (
        <div className="mb-3" key={key}>
          <label className="block text-sm font-medium mb-1">{key}</label>
          <input type="file" accept="image/*" onChange={async e => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = await uploadImageToSupabase({ file, category, id: form.id, type: 'main' });
            if (url) handleChange(key, url);
          }} className="w-full" />
          {value && <img src={value} alt="preview" className="mt-2 h-32 object-cover rounded" />}
        </div>
      )
    }
    if (key === 'gallery' && Array.isArray(value)) {
      return (
        <div className="mb-3" key={key}>
          <label className="block text-sm font-medium mb-1">{key}</label>
          <input type="file" multiple accept="image/*" onChange={async e => {
            const files = Array.from(e.target.files || [])
            const uploaded: string[] = []
            for (const file of files) {
              const url = await uploadImageToSupabase({ file, category, id: form.id, type: 'gallery' });
              if (url) uploaded.push(url)
            }
            if (uploaded.length) handleChange(key, [...value, ...uploaded])
          }} className="w-full" />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {value.map((url: string, i: number) => {
              const storagePath = url.split('/storage/v1/object/public/')[1]
              return (
                <div key={i} className="relative group">
                  <img src={url} className="h-24 object-cover rounded w-full" />
                  <button type="button" onClick={async () => {
                    const deleted = await deleteImageFromSupabase(storagePath)
                    if (deleted) {
                      const updated = value.filter((_: string, idx: number) => idx !== i)
                      handleChange(key, updated)
                    }
                  }} className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100">✕</button>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    if (Array.isArray(value)) {
      if (options) {
        return (
          <div className="mb-3" key={key}>
            <label className="block text-sm font-medium mb-1">{key}</label>
            <select multiple value={value} onChange={e => {
              const selected = Array.from(e.target.selectedOptions).map(o => o.value)
              handleChange(key, selected)
            }} className="w-full border rounded p-2 h-32" >
              {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )
      }
      // dynamic string[]
      return (
        <div className="mb-3" key={key}>
          <label className="block text-sm font-medium mb-1">{key}</label>
          <textarea className="w-full border rounded p-2" value={value.join('\n')} onChange={e => handleChange(key, e.target.value.split('\n').filter(Boolean))} />
        </div>
      )
    }
    if (typeof value === 'boolean') {
      return (
        <div className="mb-3 flex items-center gap-2" key={key}>
          <input type="checkbox" checked={value} onChange={e => handleChange(key, e.target.checked)} />
          <label className="text-sm">{key}</label>
        </div>
      )
    }
    if (typeof value === 'number') {
      return (
        <div className="mb-3" key={key}>
          <label className="block text-sm font-medium mb-1">{key}</label>
          <Input type="number" value={value} onChange={e => handleChange(key, Number(e.target.value))} />
        </div>
      )
    }
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="mb-3" key={key}>
          <label className="block text-sm font-medium mb-1">{key}</label>
          <textarea className="w-full border rounded p-2 font-mono" rows={4} value={JSON.stringify(value, null, 2)} onChange={e => {
            try { handleChange(key, JSON.parse(e.target.value)) } catch {}
          }} />
        </div>
      )
    }
    // string
    if (options) {
      return (
        <div className="mb-3" key={key}>
          <label className="block text-sm font-medium mb-1">{key}</label>
          <select className="w-full border rounded p-2" value={value} onChange={e => handleChange(key, e.target.value)}>
            <option value="">Select...</option>
            {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      )
    }
    return (
      <div className="mb-3" key={key}>
        <label className="block text-sm font-medium mb-1">{key}</label>
        <Input value={value} onChange={e => handleChange(key, e.target.value)} />
      </div>
    )
  }

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="bg-white p-6 w-full max-w-3xl z-10 overflow-y-auto max-h-[90vh] rounded-xl">
        <Dialog.Title className="text-lg font-bold mb-4">{isEditMode ? `Edit ${category}` : `Add ${category}`}</Dialog.Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(form).map(([k, v]) => renderField(k, v))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditMode ? 'Update' : 'Create'}</Button>
        </div>
      </div>
    </Dialog>
  )
}