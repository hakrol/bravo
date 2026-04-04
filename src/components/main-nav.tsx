"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/blogg", label: "Blogg" },
  { href: "/din-lonn", label: "Lønnssjekk" },
  {
    href: "/annet",
    label: "Analyse",
    children: [
      { href: "/kvinner-vs-menn", label: "Kvinner vs menn" },
      { href: "/topp-jobber", label: "Topp jobber" },
    ],
  },
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

        if ("children" in item) {
          return (
            <div key={item.href} className="group relative">
              <Link
                aria-current={active ? "page" : undefined}
                className={[
                  "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition duration-200",
                  active
                    ? "text-[var(--primary-strong)]"
                    : "text-[var(--foreground)] hover:text-[var(--primary-strong)]",
                ].join(" ")}
                href={item.href}
              >
                {item.label}
                <span aria-hidden="true" className="text-xs">
                  ▾
                </span>
              </Link>

              <div className="pt-2 sm:absolute sm:left-0 sm:top-full sm:z-30 sm:hidden sm:min-w-64 sm:group-hover:block sm:group-focus-within:block">
                <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white/95 p-2 shadow-[0_18px_48px_rgba(27,36,48,0.12)] backdrop-blur">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      className="flex px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:text-[var(--primary-strong)]"
                      href={child.href}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        }

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
