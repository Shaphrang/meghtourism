export const dynamic = 'force-dynamic';

import type { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import ClientPage from './clientPage';

export default function Page() {
  return <ClientPage />;
}
