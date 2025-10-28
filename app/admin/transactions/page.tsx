// app/admin/transactions/page.tsx
'use client';
import { useState, useEffect, useContext } from 'react';
import { SupabaseClientContext } from '@/components/SupabaseProvider';
import { motion } from 'framer-motion';

export default function AdminTransactions() {
  const supabase = useContext(SupabaseClientContext);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await supabase.from('transactions').select('*');
      setTransactions(data || []);
    };
    fetchTransactions();
  }, [supabase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">Manage Transactions</h1>
      <div className="bg-accent rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-accent">
              <th className="p-4 text-left">QR ID</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Gateway</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className="border-b hover:bg-neutral transition-all">
                <td className="p-4">{tx.qr_id}</td>
                <td className="p-4">₦{tx.amount_gross}</td>
                <td className="p-4">{tx.gateway}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      tx.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {tx.status}
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