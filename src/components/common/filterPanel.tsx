'use client'
import { useState } from 'react'

export interface FilterConfig {
  field: string
  label: string
  type: 'select' | 'multi' | 'range'
  options?: string[]
}

interface Props {
  config: FilterConfig[]
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
  className?: string
}

export default function FilterPanel({ config, values, onChange, className = '' }: Props) {
  const [local, setLocal] = useState(values)

  const update = (field: string, value: any) => {
    const newVals = { ...local, [field]: value }
    setLocal(newVals)
    onChange(newVals)
  }

  return (
    <div className={`flex gap-3 overflow-x-auto scrollbar-hide ${className}`}>
      {config.map(f => {
        if (f.type === 'select') {
          return (
            <select
              key={f.field}
              value={local[f.field] || ''}
              onChange={e => update(f.field, e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="">All {f.label}</option>
              {f.options?.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )
        }
        if (f.type === 'multi') {
          return (
            <select
              key={f.field}
              multiple
              value={local[f.field] || []}
              onChange={e => update(f.field, Array.from(e.target.selectedOptions).map(o => o.value))}
              className="border px-2 py-1 rounded text-sm"
            >
              {f.options?.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )
        }
        if (f.type === 'range') {
          return (
            <div key={f.field} className="flex items-center text-sm gap-1">
              <input
                type="number"
                placeholder="Min"
                value={local[f.field]?.min ?? ''}
                onChange={e => update(f.field, { ...local[f.field], min: e.target.value ? Number(e.target.value) : '' })}
                className="w-16 border rounded px-1 py-1"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={local[f.field]?.max ?? ''}
                onChange={e => update(f.field, { ...local[f.field], max: e.target.value ? Number(e.target.value) : '' })}
                className="w-16 border rounded px-1 py-1"
              />
            </div>
          )
        }
        return null
      })}
    </div>
  )
}