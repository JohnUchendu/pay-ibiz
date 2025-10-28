// app/page.tsx
'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SupabaseClientContext } from '@/components/SupabaseProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const supabase = useContext(SupabaseClientContext);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.push('/dashboard');
    };
    checkUser();
  }, [supabase, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-primary to-neutral">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl p-6"
      >
        <h1 className="text-5xl font-bold text-accent mb-4">QR Pay</h1>
        <p className="text-lg text-gray-800 mb-8">
          Create and share QR codes for instant fiat or crypto payments. Secure, fast, and non-custodial.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block bg-secondary text-accent py-3 px-6 rounded-lg hover:bg-teal-600 transition-all shadow-lg"
          >
            Get Started
          </Link>
          <Link
            href="/create"
            className="inline-block bg-accent text-primary py-3 px-6 rounded-lg hover:bg-gray-200 transition-all shadow-lg"
          >
            Create QR Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
}