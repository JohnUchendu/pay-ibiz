// app/dashboard/profile/page.tsx
'use client';
import { useState, useEffect, useContext } from 'react';
import { SupabaseClientContext } from '@/components/SupabaseProvider';
import PushSubscribe from '@/components/PushSubscribe';
import { motion } from 'framer-motion';

export default function Profile() {
  const supabase = useContext(SupabaseClientContext);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    phone: string | null;
    bank_account: { bank_name: string; account_number: string } | null;
    monnify_subaccount: string | null;
    ivorypay_merchant_id: string | null;
  }>({
    full_name: null,
    phone: null,
    bank_account: null,
    monnify_subaccount: null,
    ivorypay_merchant_id: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone, bank_account, monnify_subaccount, ivorypay_merchant_id')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
    };
    fetchProfile();
  }, [supabase]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        bank_account: profile.bank_account,
        monnify_subaccount: profile.monnify_subaccount,
        ivorypay_merchant_id: profile.ivorypay_merchant_id,
      })
      .eq('id', user.id);

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-accent rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">Your Profile</h1>
      <form onSubmit={saveProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary">Full Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={profile.full_name || ''}
            onChange={e => setProfile({ ...profile, full_name: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary">Phone Number</label>
          <input
            type="tel"
            placeholder="Phone Number"
            value={profile.phone || ''}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary">Bank Name</label>
          <input
            type="text"
            placeholder="Bank Name"
            value={profile.bank_account?.bank_name || ''}
            onChange={e =>
              setProfile({
                ...profile,
                bank_account: { ...profile.bank_account, bank_name: e.target.value } as any,
              })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary">Account Number</label>
          <input
            type="text"
            placeholder="Account Number"
            value={profile.bank_account?.account_number || ''}
            onChange={e =>
              setProfile({
                ...profile,
                bank_account: { ...profile.bank_account, account_number: e.target.value } as any,
              })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary">Monnify Subaccount Code</label>
          <input
            type="text"
            placeholder="Monnify Subaccount Code"
            value={profile.monnify_subaccount || ''}
            onChange={e => setProfile({ ...profile, monnify_subaccount: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary">Ivorypay Merchant ID</label>
          <input
            type="text"
            placeholder="Ivorypay Merchant ID"
            value={profile.ivorypay_merchant_id || ''}
            onChange={e => setProfile({ ...profile, ivorypay_merchant_id: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-secondary text-accent py-3 rounded-lg hover:bg-teal-600 transition-all shadow"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      <PushSubscribe />
    </motion.div>
  );
}