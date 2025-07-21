'use client'

export interface SortOption {
  label: string
  field: string
  ascending: boolean
}

interface Props {
  options: SortOption[]
  selected: number
  onChange: (index: number) => void
  className?: string
}

export default function SortDropdown({ options, selected, onChange, className = '' }: Props) {
  return (
    <select
      className={`border px-2 py-1 rounded text-sm ${className}`}
      value={selected}
      onChange={e => onChange(parseInt(e.target.value))}
    >
      {options.map((o, idx) => (
        <option key={idx} value={idx}>{o.label}</option>
      ))}
    </select>
  )
}