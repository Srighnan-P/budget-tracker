import { NextResponse, NextRequest } from 'next/server';
import { auth } from "@/auth";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const session = await auth();
  const user_email = session?.user?.email;
  const { name, budget_limit } = await req.json();

  if (!user_email) {
    return NextResponse.json({ error: 'You must be logged in to update a category.' }, { status: 401 });
  }
  if (!name) {
    return NextResponse.json({ error: "The 'name' field is required to update a category." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('categories')
    .update({ name, budget_limit })
    .eq('id', params.id)
    .eq('user_email', user_email)
    .select()
    .single();

  if (error) {
    console.error('PUT /api/categories/[id] error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while updating the category. Please try again later.' }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}

export async function DELETE(
  req: Request, 
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const session = await auth();
  const user_email = session?.user?.email;

  if (!user_email) {
    return NextResponse.json({ error: 'You must be logged in to delete a category.' }, { status: 401 });
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', params.id)
    .eq('user_email', user_email);

  if (error) {
    console.error('DELETE /api/categories/[id] error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while deleting the category. Please try again later.' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
