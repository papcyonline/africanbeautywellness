import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRegistrations } from "@/lib/registrations";
import { isSupabaseConfigured } from "@/lib/supabase";
import { ADMIN_COOKIE, isAuthEnabled, verifySession } from "@/lib/adminAuth";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always fetch fresh data (falls back to sample data until Supabase is set up).
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (isAuthEnabled()) {
    const token = (await cookies()).get(ADMIN_COOKIE)?.value;
    if (!verifySession(token)) redirect("/admin/login");
  }
  const rows = await getRegistrations();
  return <AdminDashboard initial={rows} live={isSupabaseConfigured} />;
}
