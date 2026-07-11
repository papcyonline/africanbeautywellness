"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site-footer.module.css";

export default function SiteFooter() {
  const pathname = usePathname();
  // The admin portal has its own chrome.
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <span className={styles.brandRow}>
              <span className={styles.emblem} aria-hidden="true" />
              <span className={styles.mark}>Africa Beauty &amp; Wellness</span>
            </span>
            <p className={styles.tagline}>
              The beginning of a pan-African beauty and wellness manufacturing
              movement. Made in Africa, from African ingredients.
            </p>
          </div>

          <nav className={styles.links} aria-label="Footer">
            <a href="/#vision">Our Vision</a>
            <a href="/#who">Who We Seek</a>
            <a href="/#why">Why Join</a>
            <Link href="/register">Join the Vision</Link>
          </nav>
        </div>

        <hr className="rule" />

        <div className={styles.bottom}>
          <span>
            &copy; {2026} Africa Beauty &amp; Wellness. All rights reserved.
          </span>
          <span className={styles.legal}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <span className={styles.credit}>Cameroon &middot; Pan-African</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
