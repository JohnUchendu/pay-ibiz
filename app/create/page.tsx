// app/create/page.tsx
'use client';
import { useState, useContext } from 'react';
import QRCode from 'qrcode';
import { SupabaseClientContext } from '@/components/SupabaseProvider';
import { motion } from 'framer-motion';

export default function CreateQR() {
  const supabase = useContext(SupabaseClientContext);
  const [form, setForm] = useState({
    amount: '',
    currency: 'NGN' as 'NGN' | 'CRYPTO',
    description: '',
    receiver_email: '',
    qr_type: 'single-use' as 'single-use' | 'permanent',
  });
  const [qrImg, setQrImg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError('Supabase client not initialized');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Please log in to create a QR code');
      return;
    }

    const qrData: any = {
      creator_id: user.id,
      amount: Number(form.amount),
      currency: form.currency,
      description: form.description,
      receiver_email: form.receiver_email,
      qr_type: form.qr_type,
    };

    if (form.qr_type === 'single-use') {
      qrData.expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    }

    const { data: qr, error: insertError } = await supabase
      .from('qr_codes')
      .insert(qrData)
      .select()
      .single();

    if (insertError) {
      setError('Failed to create QR code: ' + insertError.message);
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_URL}/pay/${qr.id}`;
    try {
      const dataUrl = await QRCode.toDataURL(url);
      setQrImg(dataUrl);
    } catch (err) {
      setError('Failed to generate QR code image');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-accent rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">Create QR</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary">Amount</label>
          <input
            required
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary">Currency</label>
          <select
            value={form.currency}
            onChange={e => setForm({ ...form, currency: e.target.value as any })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          >
            <option value="NGN">Fiat (Monnify)</option>
            <option value="CRYPTO">Crypto (Ivorypay)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary">QR Type</label>
          <select
            value={form.qr_type}
            onChange={e => setForm({ ...form, qr_type: e.target.value as any })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          >
            <option value="single-use">Single-Use (Expires in 24h)</option>
            <option value="permanent">Permanent (No Expiry)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary">Description</label>
          <input
            required
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary">Your Email</label>
          <input
            required
            type="email"
            placeholder="Your Email"
            value={form.receiver_email}
            onChange={e => setForm({ ...form, receiver_email: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-secondary text-accent py-3 rounded-lg hover:bg-teal-600 transition-all shadow"
        >
          Generate
        </button>
      </form>
      {qrImg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <img src={qrImg} alt="QR Code" className="mx-auto rounded-lg shadow-lg" />
        </motion.div>
      )}
    </motion.div>
  );
}