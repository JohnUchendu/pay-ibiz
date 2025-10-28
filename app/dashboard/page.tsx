// app/dashboard/page.tsx
'use client';
import { useState, useEffect, useContext } from 'react';
import { SupabaseClientContext } from '@/components/SupabaseProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const supabase = useContext(SupabaseClientContext);
  const [qrs, setQrs] = useState<any[]>([]);

  useEffect(() => {
    const fetchQrs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('qr_codes').select('*').eq('creator_id', user.id);
      setQrs(data || []);
    };
    fetchQrs();
  }, [supabase]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-primary">Your QR Codes</h1>
        <Link
          href="/dashboard/profile"
          className="inline-block bg-secondary text-accent py-2 px-4 rounded-lg hover:bg-teal-600 transition-all mb-4 shadow"
        >
          Edit Profile
        </Link>
        <div className="bg-accent rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-accent">
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {qrs.map(qr => (
                <tr
                  key={qr.id}
                  className="border-b hover:bg-neutral transition-all"
                >
                  <td className="p-4">{qr.description}</td>
                  <td className="p-4">₦{qr.amount}</td>
                  <td className="p-4">{qr.qr_type === 'permanent' ? 'Permanent' : 'Single-Use'}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        qr.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                        qr.status === 'paid' ? 'bg-green-200 text-green-800' :
                        'bg-red-200 text-red-800'
                      }`}
                    >
                      {qr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}