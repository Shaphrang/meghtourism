import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function useSupabaseNearby<T>(
  table: string,
  location: string | null,
  excludeId?: string,
  limit = 4
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      let query = supabase.from(table).select("*").eq("location", location);
      if (excludeId) {
        query = query.neq("id", excludeId).neq("slug", excludeId);
      }
      const { data, error } = await query.limit(limit);
      if (error) {
        setError(error.message);
        setData([]);
      } else {
        setData((data ?? []) as T[]);
      }
      setLoading(false);
    };

    fetchData();
  }, [table, location, excludeId, limit]);

  return { data, loading, error };
}