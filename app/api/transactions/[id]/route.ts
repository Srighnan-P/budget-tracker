// app/api/transactions/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'You must be logged in to view this transaction.' }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .eq('user_email', session.user.email)
    .single();

  if (error) {
    console.error('GET /api/transactions/[id] error:', error);
    return NextResponse.json({ error: 'Transaction not found or you do not have access.' }, { status: 404 });
  }
  return NextResponse.json({ data });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'You must be logged in to update this transaction.' }, { status: 401 });

  const { id } = await params;
  const { name, type, amount } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "The 'name' field is required to update a transaction." }, { status: 400 });
  }
  if (!['income', 'expense'].includes(type)) {
    return NextResponse.json({ error: "The 'type' field must be either 'income' or 'expense'." }, { status: 400 });
  }
  if (typeof amount !== 'number') {
    return NextResponse.json({ error: "The 'amount' field must be a number." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('transactions')
    .update({ name, type, amount })
    .eq('id', id)
    .eq('user_email', session.user.email)
    .select()
    .single();

  if (error) {
    console.error('PUT /api/transactions/[id] error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while updating the transaction. Please try again later.' }, { status: 500 });
  }
  return NextResponse.json({ data });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'You must be logged in to delete this transaction.' }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_email', session.user.email);

  if (error) {
    console.error('DELETE /api/transactions/[id] error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while deleting the transaction. Please try again later.' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

