import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft } from "@phosphor-icons/react/dist/ssr";

type Variant = "primary" | "light" | "outline-light" | "ghost";

// A pill button/link with a circular arrow chip. On hover the tilted arrow
// launches off along its diagonal and a fresh one flies in behind it.
export default function ArrowLink({
  href,
  children,
  variant = "primary",
  className = "",
  back = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  back?: boolean;
}) {
  const cls =
    `btn btn-${variant} arrowBtn ${back ? "arrowBtn-left" : ""} ${className}`.trim();
  const Arrow = back ? ArrowDownLeft : ArrowUpRight;

  const chip = (
    <span className="chip" aria-hidden="true">
      <i className="a a1">
        <Arrow size={15} weight="bold" />
      </i>
      <i className="a a2">
        <Arrow size={15} weight="bold" />
      </i>
    </span>
  );

  const label = <span className="btnLabel">{children}</span>;
  const inner = back ? (
    <>
      {chip}
      {label}
    </>
  ) : (
    <>
      {label}
      {chip}
    </>
  );

  if (href.startsWith("#")) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
