import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Options {
  search?: string;
  filter?: { field: string; value: any } | null; // ✅ updated
  sortBy?: string;
  ascending?: boolean;
  page?: number;
  pageSize?: number;
}

export default function useSupabaseList<T>(table: string, options: Options = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClientComponentClient();
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
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
        setTotalCount(null);
        setLoading(false);
        return;
      }

      let query = supabase.from(table).select('*', { count: 'exact' });

      if (search) query = query.ilike('name', `%${search}%`);
      if (filter && filter.value != null && filter.value !== "") {
        if (typeof filter.value === 'object' && (filter.value.gte !== undefined || filter.value.lte !== undefined)) {
          if (filter.value.gte !== undefined) query = query.gte(filter.field, filter.value.gte)
          if (filter.value.lte !== undefined) query = query.lte(filter.field, filter.value.lte)
        } else if (filter.field === 'tags') {
            query = query.contains('tags', [filter.value]);
          } else if (table === "cafes_and_restaurants" && filter.field === "cuisine") {
            query = query.contains('cuisine', [filter.value]);
          } else {
            query = query.eq(filter.field, filter.value);
          }
      }

      if (sortBy) query = query.order(sortBy, { ascending });

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      try {
        const { data, error, count } = await query.range(from, to);

        console.log(`📦 [${table}] fetched rows:`, data);
        console.log(`🧮 [${table}] total count:`, count);
        console.log(`❌ Supabase error:`, error);

        if (error) {
          setError(error.message);
          setData([]);
        } else {
          setData(data as T[]);
          if (typeof count === 'number') {
            setTotalCount(count);
          }
          setError(null);
        }
      } catch (err: any) {
        console.error(`❌ Supabase range error for [${table}]`, err);
        setError(err.message || 'Unexpected Supabase error');
        setData([]);
        setTotalCount(null);
      }

      setLoading(false);
    };

    fetchData();
  }, [table, search, filter?.field, filter?.value, sortBy, ascending, page, pageSize]);

  return { data, totalCount, loading, error };
}
