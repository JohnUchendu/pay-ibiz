// components/PushSubscribe.tsx
'use client';
import { useEffect, useContext } from 'react';
import { SupabaseClientContext } from '@/components/SupabaseProvider';

export default function PushSubscribe() {
  const supabase = useContext(SupabaseClientContext);

  useEffect(() => {
    const subscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then(reg => {
          reg.pushManager.subscribe({ userVisibleOnly: true }).then(sub => {
            supabase
              .from('profiles')
              .update({ push_token: sub.endpoint })
              .eq('id', user.id);
          });
        });
      }
    };
    subscribe();
  }, [supabase]);

  return null;
}