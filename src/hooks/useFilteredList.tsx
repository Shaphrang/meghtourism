import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface FilterRule {
  field: string
  op: 'eq' | 'ilike' | 'in' | 'range' | 'gte' | 'lte' | 'contains'
  value: any
}

interface SortRule {
  field: string
  ascending: boolean
}

interface Options {
  filters?: FilterRule[]
  sort?: SortRule
  page?: number
  pageSize?: number
}

export default function useFilteredList<T>(table: string, opts: Options = {}) {
  const supabase = createClientComponentClient()
  const [data, setData] = useState<T[]>([])
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { filters = [], sort, page = 1, pageSize = 6 } = opts

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let query = supabase.from(table).select('*', { count: 'exact' })

      filters.forEach(f => {
        if (f.value === undefined || f.value === null || f.value === '' || (Array.isArray(f.value) && f.value.length === 0)) return
        switch (f.op) {
          case 'eq':
            query = query.eq(f.field, f.value)
            break
          case 'ilike':
            query = query.ilike(f.field, `%${f.value}%`)
            break
          case 'in':
            query = query.in(f.field, f.value)
            break
          case 'contains':
            query = query.contains(f.field, f.value)
            break
          case 'gte':
            query = query.gte(f.field, f.value)
            break
          case 'lte':
            query = query.lte(f.field, f.value)
            break
          case 'range':
            if (Array.isArray(f.value)) {
              query = query.gte(f.field, f.value[0]).lte(f.field, f.value[1])
            }
            break
          default:
            break
        }
      })

      if (sort) {
        query = query.order(sort.field, { ascending: sort.ascending })
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await query.range(from, to)
      if (error) {
        setError(error.message)
        setData([])
        setTotalCount(null)
      } else {
        setData((data ?? []) as T[])
        if (typeof count === 'number') setTotalCount(count)
        setError(null)
      }
      setLoading(false)
    }
    fetchData()
  }, [table, JSON.stringify(filters), sort?.field, sort?.ascending, page, pageSize])

  return { data, totalCount, loading, error }
}




