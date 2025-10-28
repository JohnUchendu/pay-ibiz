// app/admin/page.tsx
'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SupabaseClientContext } from '@/components/SupabaseProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const supabase = useContext(SupabaseClientContext);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role !== 'admin') {
        router.push('/dashboard');
      }
    };
    checkAdmin();
  }, [supabase, router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/users"
          className="p-4 bg-accent rounded-lg shadow hover:bg-neutral transition-all"
        >
          <h2 className="text-xl font-semibold text-primary">Manage Users</h2>
          <p className="text-gray-600">View and edit user profiles</p>
        </Link>
        <Link
          href="/admin/qrs"
          className="p-4 bg-accent rounded-lg shadow hover:bg-neutral transition-all"
        >
          <h2 className="text-xl font-semibold text-primary">Manage QRs</h2>
          <p className="text-gray-600">View all QR codes</p>
        </Link>
        <Link
          href="/admin/transactions"
          className="p-4 bg-accent rounded-lg shadow hover:bg-neutral transition-all"
        >
          <h2 className="text-xl font-semibold text-primary">Manage Transactions</h2>
          <p className="text-gray-600">View payment history</p>
        </Link>
      </div>
    </motion.div>
  );
}