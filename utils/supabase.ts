// lib/supabase.ts

import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// For client-side usage (like in useEffect or client components)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// For server-side usage (like in API routes or server components)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);