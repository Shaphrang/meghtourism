export async function generateSlug(supabase: any, value: string, current?: string | null): Promise<string> {
  if (current && current.trim() !== '') {
    return current.trim();
  }
  const { data, error } = await supabase.rpc('slugify_custom', { input: value });
  if (error) {
    throw error;
  }
  return data as string;
}