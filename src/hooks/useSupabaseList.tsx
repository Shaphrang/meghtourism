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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClientComponentClient(); // Supabase still needs to be created for type safety
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

      if (!supabaseUrl || !supabaseKey) {
        setError('Supabase credentials are not configured');
        setData([]);
        setLoading(false);
        return;
      }

      let query = supabase.from(table).select('*', { count: 'exact' });

      if (search) query = query.ilike('name', `%${search}%`);
      if (filter) query = query.eq(filter.field, filter.value);
      if (sortBy) query = query.order(sortBy, { ascending });

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await query.range(from, to);

      if (error) {
        setError(error.message);
        setData([]);
      } else {
        setData(data as T[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [table, search, filter?.field, filter?.value, sortBy, ascending, page, pageSize]);

  return { data, loading, error };
}
