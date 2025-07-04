// app/api/transactions/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from "@/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const session = await auth();
  const user_email = session?.user?.email;
  if (!user_email) return NextResponse.json({ error: 'You must be logged in to view transactions.' }, { status: 401 });

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_email', user_email)
    .order('id', { ascending: false });

  if (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while fetching transactions. Please try again later.' }, { status: 500 });
  }
  return NextResponse.json({ data });
}

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
    .insert([{ user_email, name, type, amount, category_id }])
    .select()
    .single();

  if (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while creating the transaction. Please try again later.' }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const user_email = session?.user?.email;
  const { name, type, amount, category_id } = await req.json();

  if (!name || !['income', 'expense'].includes(type) || typeof amount !== 'number') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('transactions')
    .update({ name, type, amount, category_id })
    .eq('id', params.id)
    .eq('user_email', user_email)
    .select()
    .single();

  if (error) {
    console.error('PUT /api/transactions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const user_email = session?.user?.email;

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', params.id)
    .eq('user_email', user_email);

  if (error) {
    console.error('DELETE /api/transactions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}