// app/api/monnify/create/route.ts
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  const { qrId, amount } = await req.json();
  const { data: qr } = await supabaseAdmin.from('qr_codes').select('qr_type, creator_id').eq('id', qrId).single();

  const payload = {
    amount: Math.round(amount * 100),
    currency: 'NGN',
    reference: `qr_${qrId}_${Date.now()}`,
    customerEmail: 'payer@example.com',
    paymentDescription: 'QR Payment',
    splitConfig: {
      subAccounts: [
        { accountCode: process.env.MONNIFY_PLATFORM_SUBACCOUNT, percentage: 1 },
        { accountCode: await getMerchantSubaccount(qr.creator_id), percentage: 99 },
      ],
    },
  };

  // For permanent QRs, use virtual account
  if (qr.qr_type === 'permanent') {
    payload.reference = `va_${qr.creator_id}`; // Reusable virtual account
  }

  const res = await fetch('https://api.monnify.com/api/v2/transactions/initiate', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.MONNIFY_CONTRACT_CODE}:${process.env.MONNIFY_SK}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  await supabaseAdmin
    .from('qr_codes')
    .update({ monnify_ref: data.responseBody.transactionReference })
    .eq('id', qrId);

  return Response.json({ checkoutUrl: data.responseBody.checkoutUrl });
}

// Helper to get merchant's Monnify subaccount
async function getMerchantSubaccount(userId: string): Promise<string> {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('monnify_subaccount')
    .eq('id', userId)
    .single();
  return profile?.monnify_subaccount || 'DEFAULT_SUBACCOUNT';
}