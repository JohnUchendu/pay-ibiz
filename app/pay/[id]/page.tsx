// app/pay/[id]/page.tsx
import { notFound } from 'next/navigation';
import MonnifyButton from '@/components/MonnifyButton';
import IvorypayButton from '@/components/IvorypayButton';
import { supabaseAdmin } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default async function Pay({ params }: { params: { id: string } }) {
  const { data: qr } = await supabaseAdmin
    .from('qr_codes')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!qr || (qr.status !== 'pending' && qr.qr_type === 'single-use') || 
      (qr.qr_type === 'single-use' && new Date(qr.expires_at) < new Date())) {
    notFound();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-accent rounded-lg shadow-lg text-center"
    >
      <h1 className="text-3xl font-bold text-primary">Pay ₦{qr.amount}</h1>
      <p className="my-4 text-gray-600">{qr.description}</p>
      {qr.qr_type === 'permanent' ? (
        <p className="text-sm text-gray-600 mb-4">Permanent QR for recurring payments</p>
      ) : (
        <CountdownTimer expiresAt={qr.expires_at} />
      )}
      {qr.currency === 'NGN' ? <MonnifyButton qr={qr} /> : <IvorypayButton qr={qr} />}
    </motion.div>
  );
}

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <p className="text-sm text-red-600 mb-4">Expires in: {timeLeft}</p>
  );
}