import type { Metadata } from "next";
import ArrowLink from "@/components/ArrowLink";
import styles from "@/components/legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern your use of the Africa Beauty & Wellness platform.",
};

export default function TermsPage() {
  return (
    <section className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <p className="eyebrow">Legal</p>
        <h1 className={styles.title}>Terms of Use</h1>
        <p className={styles.updated}>Last updated: to be finalised before launch</p>

        <p className={styles.disclaimer}>
          This is a placeholder for the pre-launch preview and must be reviewed
          and completed by a qualified professional before launch.
        </p>

        <div className={styles.body}>
          <h2>1. Acceptance</h2>
          <p>
            By using this website and registering your interest, you agree to
            these terms. If you do not agree, please do not use the platform.
          </p>

          <h2>2. Registration</h2>
          <p>
            You agree to provide accurate information about your company and to
            keep it up to date. We may approve, decline, or remove any
            registration or listing at our discretion.
          </p>

          <h2>3. Listings and payments</h2>
          <p>
            A free expression of interest is available to all eligible
            businesses. The featured listing is a paid option. Payment terms,
            pricing, and any refund policy will be set out here before the paid
            tier goes live.
          </p>

          <h2>4. Your content</h2>
          <p>
            You retain ownership of the materials you upload. By submitting them
            for a featured listing, you grant us permission to display them as
            part of your public company profile.
          </p>

          <h2>5. Availability</h2>
          <p>
            This platform is under active development. Features, availability,
            and these terms may change as the project grows.
          </p>

          <h2>6. Contact</h2>
          <p>
            For questions about these terms, contact us at the address that will
            be published here before launch.
          </p>
        </div>

        <ArrowLink href="/" variant="ghost" back className={styles.back}>
          Back to the vision
        </ArrowLink>
      </div>
    </section>
  );
}
