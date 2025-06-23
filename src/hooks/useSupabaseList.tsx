// src/hooks/useSupabaseList.tsx
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Options {
  search?: string;
  filter?: { field: string; value: string };
  sortBy?: string;
  ascending?: boolean;
  page?: number;
  pageSize?: number;
}

export default function useSupabaseList<T>(table: string, options: Options = {}) {
  const supabase = createClientComponentClient();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    search,
    filter,
    sortBy = 'created_at',
    ascending = false,
    page = 1,
    pageSize = 6,
  } = options;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let query = supabase.from(table).select('*', { count: 'exact' });

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      if (filter) {
        query = query.eq(filter.field, filter.value);
      }

      if (sortBy) {
        query = query.order(sortBy, { ascending });
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await query.range(from, to);

      if (error) setError(error.message);
      else setData(data as T[]);

      setLoading(false);
    };

    fetchData();
  }, [table, search, filter?.field, filter?.value, sortBy, ascending, page, pageSize]);

  return { data, loading, error };
}
