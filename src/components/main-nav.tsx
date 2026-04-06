"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/blogg", label: "Blogg" },
  { href: "/lonnsjekk", label: "Lønnssjekk" },
  { href: "/om", label: "Om" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hovedmeny"
      className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
    >
      {navItems.map((item) => {
        const active = pathname ? isActivePath(pathname, item.href) : false;

        return (
          <Link
            key={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold transition duration-200",
              active
                ? "text-[var(--primary-strong)]"
                : "text-[var(--foreground)] hover:text-[var(--primary-strong)]",
            ].join(" ")}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
