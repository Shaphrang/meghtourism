'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import GenericFormModal from './genericFormModal'
import DeleteConfirmModal from '../deleteConfirmModal'
import { CategoryKey } from '@/lib/defaultForms'

interface Props { category: CategoryKey }
export default function GenericAdmin({ category }: Props) {
  const [items, setItems] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)

  const fetchItems = async () => {
    const { data } = await supabase.from(category).select('*').order('created_at', { ascending: false })
    setItems(data || [])
      console.log('DATA', data)
  }
  useEffect(() => { fetchItems() }, [category])
  console.log('DATA', category)

  const openAdd = () => { setEditing(null); setShowModal(true) }
  const openEdit = (item: any) => { setEditing(item); setShowModal(true) }
  const confirmDelete = (item: any) => { setSelected(item); setShowDelete(true) }
  const handleDelete = async () => {
    if (selected) {
      await supabase.from(category).delete().eq('id', selected.id)
      setShowDelete(false)
      fetchItems()
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold capitalize">{category.replace('_', ' ')}</h2>
        <button onClick={openAdd} className="bg-emerald-600 text-white px-4 py-2 rounded">+ Add</button>
      </div>
      {items.length === 0 ? <p className="text-gray-500">No records.</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="border rounded p-4 bg-white shadow-sm">
              <h3 className="font-medium mb-1">{item.name || item.title || item.question}</h3>
              <div className="flex gap-3 text-sm text-blue-600">
                <button onClick={() => openEdit(item)}>Edit</button>
                <button className="text-red-500" onClick={() => confirmDelete(item)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <GenericFormModal
          category={category}
          initialData={editing}
          onClose={() => setShowModal(false)}
          onSave={fetchItems}
        />
      )}

      {showDelete && (
        <DeleteConfirmModal
          open={showDelete}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
          itemName={selected?.name || selected?.title || 'item'}
        />
      )}
    </div>
  )
}