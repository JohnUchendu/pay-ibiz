// app/admin/qrs/page.tsx
'use client';
import { useState, useEffect, useContext } from 'react';
import { SupabaseClientContext } from '@/components/SupabaseProvider';
import { motion } from 'framer-motion';

export default function AdminQRs() {
  const supabase = useContext(SupabaseClientContext);
  const [qrs, setQrs] = useState<any[]>([]);

  useEffect(() => {
    const fetchQRs = async () => {
      const { data } = await supabase.from('qr_codes').select('*');
      setQrs(data || []);
    };
    fetchQRs();
  }, [supabase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">Manage QR Codes</h1>
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
              <tr key={qr.id} className="border-b hover:bg-neutral transition-all">
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
  );
}