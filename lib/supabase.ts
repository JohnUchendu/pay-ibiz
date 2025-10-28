// lib/supabase.ts
import { createServerClient, createBrowserClient } from '@supabase/ssr';

export function getSupabaseClient(isServer: boolean = false) {
  if (isServer) {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      }
    );
  }

  return typeof window !== 'undefined'
    ? createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => {
              return document.cookie.split(';').map(cookie => {
                const [name, value] = cookie.trim().split('=');
                return { name, value };
              });
            },
            setAll: (cookies) => {
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
    : null;
}

export const supabase = getSupabaseClient(false); // Client-side
export const supabaseAdmin = getSupabaseClient(true); // Server-side