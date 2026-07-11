import type { Metadata } from "next";
import ArrowLink from "@/components/ArrowLink";
import styles from "@/components/legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Africa Beauty & Wellness collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <section className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <p className="eyebrow">Legal</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: to be finalised before launch</p>

        <p className={styles.disclaimer}>
          This is a placeholder policy for the pre-launch preview. It must be
          reviewed and completed by a qualified professional before the site
          collects any real data.
        </p>

        <div className={styles.body}>
          <h2>1. Who we are</h2>
          <p>
            Africa Beauty &amp; Wellness (&ldquo;we&rdquo;,
            &ldquo;us&rdquo;) is building a beauty and wellness manufacturing
            initiative based in Cameroon. This policy explains how we handle
            information you share with us.
          </p>

          <h2>2. Information we collect</h2>
          <p>When you register your interest, we may collect:</p>
          <ul>
            <li>Company details — name, country, website, business type</li>
            <li>Contact details — contact person, email, phone number</li>
            <li>Business information — products, manufacturing capability, ingredients used</li>
            <li>Files you upload — company profile and product catalogue</li>
          </ul>

          <h2>3. How we use your information</h2>
          <p>
            We use your information to manage your registration, keep you updated
            on the project, assess fit for future manufacturing opportunities,
            and, where you choose a featured listing, to display your public
            company profile.
          </p>

          <h2>4. Sharing</h2>
          <p>
            We do not sell your personal information. We may share it with
            service providers who help us operate the platform (for example,
            hosting and payment processing) under appropriate safeguards.
          </p>

          <h2>5. Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            information at any time by contacting us.
          </p>

          <h2>6. Contact</h2>
          <p>
            For any privacy questions, contact us at the address that will be
            published here before launch.
          </p>
        </div>

        <ArrowLink href="/" variant="ghost" back className={styles.back}>
          Back to the vision
        </ArrowLink>
      </div>
    </section>
  );
}
