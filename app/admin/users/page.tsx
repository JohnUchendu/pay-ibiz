// app/admin/users/page.tsx
'use client';
import { useState, useEffect, useContext } from 'react';
import { SupabaseClientContext } from '@/components/SupabaseProvider';
import { motion } from 'framer-motion';

export default function AdminUsers() {
  const supabase = useContext(SupabaseClientContext);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('*');
      setUsers(data || []);
    };
    fetchUsers();
  }, [supabase]);

  const updateRole = async (userId: string, role: string) => {
    await supabase.from('profiles').update({ role }).eq('id', userId);
    setUsers(users.map(u => (u.id === userId ? { ...u, role } : u)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">Manage Users</h1>
      <div className="bg-accent rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-accent">
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-neutral transition-all">
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.full_name || 'N/A'}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={e => updateRole(user.id, e.target.value)}
                    className="p-2 border rounded-lg"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}