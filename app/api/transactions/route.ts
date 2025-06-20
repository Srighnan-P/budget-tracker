// app/api/transactions/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from "@/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = auth();
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}