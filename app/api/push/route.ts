// app/api/push/route.ts
import { supabaseAdmin } from '@/lib/supabase';
import { sendPush } from '@/lib/firebase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, title, body } = await req.json();

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('push_token')
    .eq('id', userId)
    .single();

  if (!profile?.push_token) {
    return NextResponse.json({ error: 'No push token found' }, { status: 400 });
  }

  await sendPush(userId, `${title}: ${body}`);
  return NextResponse.json({ success: true });
}