"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

// A split-screen image that is revealed by staggered vertical "slices" the
// first time it scrolls into view. Slices are solid-colour covers (no
// gradients) that wipe away in alternating directions.
export default function SlicedImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  overlay,
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  overlay?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className={`sliced ${seen ? "in" : ""} ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={priority ? undefined : "blur"}
        style={{ objectFit: "cover" }}
      />
      <span className="slices" aria-hidden="true">
        <i className="slice" />
        <i className="slice" />
        <i className="slice" />
        <i className="slice" />
        <i className="slice" />
      </span>
      {overlay ? <div className="slicedOverlay">{overlay}</div> : null}
    </figure>
  );
}
