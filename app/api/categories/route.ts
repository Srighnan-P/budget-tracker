import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const session = await auth();
  const user_email = session?.user?.email;
  const { name, budget_limit } = await req.json();

  if (!user_email || !name) {
    return NextResponse.json({ error: 'Missing user or name' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ user_email, name, budget_limit }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function GET() {
  const session = await auth();
  const user_email = session?.user?.email;

  if (!user_email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_email', user_email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
