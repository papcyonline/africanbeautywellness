import type { Metadata } from "next";
import RegistrationForm from "./RegistrationForm";
import { isSupabaseConfigured } from "@/lib/supabase";
import styles from "./register.module.css";

export const metadata: Metadata = {
  title: "Join the Vision",
  description:
    "Register your company's interest in the Africa Beauty & Wellness manufacturing initiative.",
};

export default function RegisterPage() {
  return (
    <section className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <p className="eyebrow">Member Portal</p>
        <h1 className={styles.title}>Register your interest</h1>
        <p className={styles.body}>
          Tell us about your business and take your place in a continental
          manufacturing movement. It takes a few minutes.
        </p>

        {!isSupabaseConfigured && (
          <p className={styles.note}>
            Preview: this form is complete but not yet connected to our
            database. Saving registrations is the next build step.
          </p>
        )}

        <RegistrationForm />
      </div>
    </section>
  );
}
