// components/SupabaseProvider.tsx
'use client';
import { createContext, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

export const SupabaseClientContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    typeof window !== 'undefined'
      ? createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll: () => {
                if (typeof document === 'undefined') return [];
                return document.cookie.split(';').map(cookie => {
                  const [name, value] = cookie.trim().split('=');
                  return { name, value };
                });
              },
              setAll: (cookies) => {
                if (typeof document === 'undefined') return;
                cookies.forEach(({ name, value, options }) => {
                  document.cookie = `${name}=${value}; path=/; ${
                    options?.maxAge ? `max-age=${options.maxAge};` : ''
                  } ${options?.sameSite ? `SameSite=${options.sameSite};` : ''} ${
                    options?.secure ? 'Secure' : ''
                  }`;
                });
              },
            },
          }
        )
      : null
  );

  return (
    <SupabaseClientContext.Provider value={supabase}>
      {children}
    </SupabaseClientContext.Provider>
  );
}