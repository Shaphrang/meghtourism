import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function useDeleteReview() {
  const supabase = createClientComponentClient();

  return async (id: string) => {
    const { error } = await supabase
      .from('ratings_reviews')
      .delete()
      .eq('id', id);
    return { error };
  };
}