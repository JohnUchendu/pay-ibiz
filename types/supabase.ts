// types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          bank_account: Json | null;
          monnify_subaccount: string | null;
          ivorypay_merchant_id: string | null;
          push_token: string | null;
          created_at: string;
        };
      };
      qr_codes: {
        Row: {
          id: string;
          creator_id: string;
          amount: number;
          currency: 'NGN' | 'CRYPTO';
          description: string | null;
          status: 'pending' | 'paid' | 'expired';
          monnify_ref: string | null;
          ivorypay_txn: string | null;
          receiver_email: string;
          expires_at: string;
          created_at: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          qr_id: string;
          payer_email: string | null;
          amount_gross: number;
          platform_fee: number;
          gateway: 'monnify' | 'ivorypay';
          status: string;
          webhook_payload: Json | null;
          created_at: string;
        };
      };
    };
  };
}