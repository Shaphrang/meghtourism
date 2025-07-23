import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  category: string;
  item_id: string;
  approved: boolean;
  created_at: string;
}

export default function useFetchReviews() {
  const supabase = createClientComponentClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ratings_reviews')
      .select('*')
      .order('created_at', { ascending: false });
    setReviews((data as Review[]) || []);
    setLoading(false);
    console.log('Review data', data)
  };

  useEffect(() => {
    fetchReviews();
    const channel = supabase
      .channel('admin-reviews')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ratings_reviews' }, fetchReviews)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { reviews, loading, refresh: fetchReviews };
}