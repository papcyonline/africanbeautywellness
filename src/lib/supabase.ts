import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True once the Supabase env vars are set. */
export const isSupabaseConfigured = Boolean(url && serviceKey);

/**
 * Server-only Supabase client using the service-role key (bypasses RLS).
 * Never import this into a Client Component. Returns null until configured,
 * so callers fall back gracefully.
 */
export function getServiceClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
