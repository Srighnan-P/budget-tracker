import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const user_email = session?.user?.email;
  const { name, budget_limit } = await req.json();

  const { data, error } = await supabase
    .from('categories')
    .update({ name, budget_limit })
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
    .from('categories')
    .delete()
    .eq('id', params.id)
    .eq('user_email', user_email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
