"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const navItems: ReadonlyArray<{
  href: string;
  label: string;
  decoration?: "norway-flag";
}> = [
  { href: "/lonn-i-norge", label: "Lønn i Norge", decoration: "norway-flag" },
  { href: "/blogg", label: "Blogg" },
  { href: "/lonnsjekk", label: "Lønnssjekk" },
  { href: "/om", label: "Om" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="flex items-center justify-end">
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Lukk hovedmeny" : "Åpne hovedmeny"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-[5px] border border-[var(--border)] bg-white text-[var(--foreground)] shadow-[0_10px_24px_rgba(27,36,48,0.08)] transition hover:border-[rgba(20,83,45,0.28)] hover:text-[var(--primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)] lg:hidden"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="sr-only">{isOpen ? "Lukk hovedmeny" : "Åpne hovedmeny"}</span>
        <span aria-hidden="true" className="relative h-4 w-5">
          <span
            className={[
              "absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition duration-200",
              isOpen ? "translate-y-[7px] rotate-45" : "",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition duration-200",
              isOpen ? "opacity-0" : "opacity-100",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition duration-200",
              isOpen ? "-translate-y-[7px] -rotate-45" : "",
            ].join(" ")}
          />
        </span>
      </button>

      <nav aria-label="Hovedmeny" className="hidden items-center gap-1 lg:flex">
        {navItems.map((item) => {
          const active = pathname ? isActivePath(pathname, item.href) : false;

          return (
            <Link
              key={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "inline-flex items-center justify-center rounded-[5px] px-4 py-2.5 text-sm font-semibold transition duration-200",
                active
                  ? "bg-[rgba(20,83,45,0.08)] text-[var(--primary-strong)]"
                  : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
              ].join(" ")}
              href={item.href}
            >
              <NavItemLabel decoration={item.decoration} label={item.label} />
            </Link>
          );
        })}
      </nav>

      <div
        aria-hidden={!isOpen}
        className={[
          "absolute left-3 right-3 top-[calc(100%+0.75rem)] z-50 origin-top rounded-[5px] border border-[var(--border)] bg-white p-2 shadow-[0_24px_64px_rgba(27,36,48,0.18)] transition duration-200 lg:hidden",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0",
        ].join(" ")}
        id={menuId}
      >
        <nav aria-label="Mobil hovedmeny" className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname ? isActivePath(pathname, item.href) : false;

            return (
              <Link
                key={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex items-center justify-between rounded-[5px] px-4 py-3 text-base font-semibold transition duration-200",
                  active
                    ? "bg-[rgba(20,83,45,0.1)] text-[var(--primary-strong)]"
                    : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
                ].join(" ")}
                href={item.href}
                tabIndex={isOpen ? undefined : -1}
              >
                <NavItemLabel decoration={item.decoration} label={item.label} />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function NavItemLabel({
  label,
  decoration,
}: {
  label: string;
  decoration?: "norway-flag";
}) {
  if (decoration !== "norway-flag") {
    return <span>{label}</span>;
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span>{label}</span>
      <span
        aria-hidden="true"
        className="relative h-4 w-6 overflow-hidden rounded-[3px] border border-black/10 shadow-sm"
      >
        <span className="absolute inset-0 bg-[#ba0c2f]" />
        <span className="absolute inset-y-0 left-[28%] w-[14%] bg-white" />
        <span className="absolute inset-y-0 left-[32.5%] w-[5%] bg-[#00205b]" />
        <span className="absolute inset-x-0 top-[39%] h-[20%] bg-white" />
        <span className="absolute inset-x-0 top-[46%] h-[6%] bg-[#00205b]" />
      </span>
    </span>
  );
}
