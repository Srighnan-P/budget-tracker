// lib/supabase.ts

import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// For client-side usage (like in useEffect or client components)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// For server-side usage (like in API routes or server components)
export const supabaseAdmin = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);