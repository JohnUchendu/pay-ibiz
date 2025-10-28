'use client';
import { useContext, useState } from 'react';
import { SupabaseClientContext } from '@/components/SupabaseProvider';

export default function Login() {
  const supabase = useContext(SupabaseClientContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    await supabase.auth.signInWithOtp({ email });
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />
      <button
        onClick={login}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </div>
  );
}