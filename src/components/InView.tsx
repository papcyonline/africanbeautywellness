"use client";

import { useEffect, useRef, useState } from "react";

// Adds an `in` class the first time the element scrolls into view, so CSS can
// run scroll-reveal animations. The `io` base class + `.js` gating (see
// globals.css) keeps content visible when JavaScript is unavailable.
export default function InView({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`io ${seen ? "in" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}
