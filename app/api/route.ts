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
  const { name, type, amount, category_id } = await req.json();

  if (!user_email) {
    return NextResponse.json({ error: 'You must be logged in to create a transaction.' }, { status: 401 });
  }
  if (!name) {
    return NextResponse.json({ error: "The 'name' field is required to create a transaction." }, { status: 400 });
  }
  if (!['income', 'expense'].includes(type)) {
    return NextResponse.json({ error: "The 'type' field must be either 'income' or 'expense'." }, { status: 400 });
  }
  if (typeof amount !== 'number') {
    return NextResponse.json({ error: "The 'amount' field must be a number." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ user_email, name, type, amount, category_id }]);

  if (error) {
    console.error('POST /api error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while creating the transaction. Please try again later.' }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}

export async function GET() {
  const session = await auth();
  const user_email = session?.user?.email;

  if (!user_email) return NextResponse.json({ error: 'You must be logged in to view transactions.' }, { status: 401 });

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_email', user_email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('GET /api error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while fetching transactions. Please try again later.' }, { status: 500 });
  }
  return NextResponse.json({ data });
}
