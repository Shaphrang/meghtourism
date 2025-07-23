import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function useApproveReview() {
  const supabase = createClientComponentClient();

  return async (id: string, approved: boolean) => {
    const { error } = await supabase
      .from('ratings_reviews')
      .update({ approved })
      .eq('id', id);
    return { error };
  };
}