import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isAuthEnabled, verifySession } from "@/lib/adminAuth";
import LoginForm from "./LoginForm";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!isAuthEnabled()) redirect("/admin");
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (verifySession(token)) redirect("/admin");

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <span className={styles.emblem} aria-hidden="true" />
        <h1 className={styles.title}>Admin access</h1>
        <p className={styles.sub}>Africa Beauty &amp; Wellness</p>
        <LoginForm />
      </div>
    </div>
  );
}
