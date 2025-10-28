// components/Navbar.tsx
'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SupabaseClientContext } from '@/components/SupabaseProvider';
import { motion } from 'framer-motion';

export default function Navbar() {
  const supabase = useContext(SupabaseClientContext);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-primary text-accent sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              QR Pay
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
            {isLoggedIn && (
              <>
                <Link href="/dashboard" className="hover:text-secondary transition-colors">
                  Dashboard
                </Link>
                <Link href="/create" className="hover:text-secondary transition-colors">
                  Create QR
                </Link>
                <Link href="/dashboard/profile" className="hover:text-secondary transition-colors">
                  Profile
                </Link>
              </>
            )}
            <button
              onClick={isLoggedIn ? handleLogout : () => router.push('/login')}
              className="bg-secondary text-accent px-4 py-2 rounded-lg hover:bg-teal-600 transition-all"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-primary"
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link href="/" className="block text-accent hover:text-secondary" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            {isLoggedIn && (
              <>
                <Link href="/dashboard" className="block text-accent hover:text-secondary" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/create" className="block text-accent hover:text-secondary" onClick={() => setIsOpen(false)}>
                  Create QR
                </Link>
                <Link href="/dashboard/profile" className="block text-accent hover:text-secondary" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
              </>
            )}
            <button
              onClick={isLoggedIn ? handleLogout : () => router.push('/login')}
              className="w-full text-left text-accent hover:text-secondary"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}