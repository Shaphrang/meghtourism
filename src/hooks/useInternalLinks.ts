import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Params {
  sourceType: string;
  targetType: string;
  location: string | null;
  district?: string | null;
  limit?: number;
  excludeId?: string;
}

export default function useInternalLinks<T>({
  sourceType,
  targetType,
  location,
  district,
  limit = 10,
  excludeId,
}: Params) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      console.log(`🔍 Fetching ${targetType} related to ${sourceType}`);
      console.log('📍 Match fields:', { location, district });

      try {
        // Step 1: Fetch available columns from the table
        const { data: columnsData, error: columnError } = await supabase
          .from(targetType)
          .select('*')
          .limit(1);

        if (columnError) {
          console.error(`🚨 Unable to query ${targetType}:`, columnError.message);
          throw columnError;
        }

        const sample = columnsData?.[0] ?? {};
        const hasLocation = 'location' in sample;
        const hasDistrict = 'district' in sample;

        console.log(`🧠 Column presence in ${targetType}:`, {
          location: hasLocation,
          district: hasDistrict,
        });

        // Step 2: No usable fields → skip query
        if (!hasLocation && !hasDistrict) {
          console.warn(`⚠️ ${targetType} table has no location or district column. Skipping query.`);
          setData([]);
          setLoading(false);
          return;
        }

        let query = supabase.from(targetType).select('*');

        if (hasLocation && location) {
          query = query.eq('location', location);
        } else if (hasDistrict && district) {
          query = query.eq('district', district);
        } else {
          console.warn(`⚠️ No usable match value for ${targetType}`);
          setData([]);
          setLoading(false);
          return;
        }
        if (excludeId) {
          query = query.neq('id', excludeId).neq('slug', excludeId);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data: results, error: fetchError } = await query;

        if (fetchError) {
          console.error(`❌ Query error for ${targetType}:`, fetchError.message);
          throw fetchError;
        }

        console.log(`✅ Fetched ${results?.length ?? 0} items from ${targetType}`);
        setData((results ?? []) as T[]);
      } catch (err: any) {
        console.error(`🚨 Error fetching ${targetType}:`, err.message || err);
        setError(err.message || 'Unknown error');
        setData([]);
      }

      setLoading(false);
    };

    if (!location && !district) {
      console.warn(`⚠️ No location or district provided for ${targetType}`);
      setData([]);
      setLoading(false);
      return;
    }

    fetchData();
  }, [sourceType, targetType, location, district, limit, excludeId]);

  return { data, loading, error };
}
