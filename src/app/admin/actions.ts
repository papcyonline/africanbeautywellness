"use server";

import { updateRegistration } from "@/lib/registrations";
import type { Registration } from "./sample-data";

// Persists an admin edit / approve / reject. No-op (returns false) until
// Supabase is configured, so the dashboard still updates optimistically.
export async function updateRegistrationAction(
  uid: string | undefined,
  patch: Partial<Registration>
): Promise<boolean> {
  return updateRegistration(uid, patch);
}
