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

  if (!user_email) {
    return NextResponse.json({ error: 'You must be logged in to create a category.' }, { status: 401 });
  }
  if (!name) {
    return NextResponse.json({ error: "The 'name' field is required to create a category." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ user_email, name, budget_limit }]);

  if (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while creating the category. Please try again later.' }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}

export async function GET() {
  const session = await auth();
  const user_email = session?.user?.email;

  if (!user_email) return NextResponse.json({ error: 'You must be logged in to view categories.' }, { status: 401 });

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_email', user_email);

  if (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while fetching categories. Please try again later.' }, { status: 500 });
  }
  return NextResponse.json({ data });
}
