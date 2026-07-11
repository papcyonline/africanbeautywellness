"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ArrowLink from "./ArrowLink";
import styles from "./site-header.module.css";

export default function SiteHeader() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent only at the top of a page that has a dark hero behind it.
  const transparent = overHero && !scrolled;

  // The admin portal has its own chrome.
  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={`${styles.header} ${
        transparent ? styles.transparent : styles.solid
      }`}
    >
      <div className={`container ${styles.inner}`}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="Africa Beauty and Wellness, home"
        >
          <span className={styles.emblem} aria-hidden="true" />
          <span className={styles.brandText}>
            <span className={styles.mark}>Africa Beauty &amp; Wellness</span>
            <span className={styles.sub}>Manufacturing Platform</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <a href="/#vision">Vision</a>
          <a href="/#who">Who We Seek</a>
          <a href="/#why">Why Join</a>
        </nav>

        <ArrowLink href="/register" variant="primary" className={styles.cta}>
          Join the Vision
        </ArrowLink>
      </div>
    </header>
  );
}
