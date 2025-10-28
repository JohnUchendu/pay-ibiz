// app/api/monnify/webhook/route.ts
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { sendPush } from '@/lib/firebase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  if (body.paymentStatus !== 'PAID') return new Response('OK');

  const ref = body.transactionReference;
  const { data: qr } = await supabaseAdmin.from('qr_codes').select('*').eq('monnify_ref', ref).single();

  // Only update status for single-use QRs
  if (qr.qr_type === 'single-use') {
    await supabaseAdmin.from('qr_codes').update({ status: 'paid' }).eq('id', qr.id);
  }

  await supabaseAdmin.from('transactions').insert({
    qr_id: qr.id,
    amount_gross: body.amount / 100,
    platform_fee: body.amount * 0.01 / 100,
    gateway: 'monnify',
    status: 'success',
  });

  await resend.emails.send({
    to: [qr.receiver_email], subject: 'Payment Received', html: `<p>₦${qr.amount} paid.</p>`,
    from: ''
  });
  await sendPush(qr.creator_id, `Payment of ₦${qr.amount} received!`);

  return new Response('OK');
}