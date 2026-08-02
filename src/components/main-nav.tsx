"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const navItems = [
  { href: "/yrker", label: "Yrker" },
  { href: "/blogg", label: "Blogg" },
  { href: "/om", label: "Om" },
] as const;

const desktopNavLinkBase =
  "relative inline-flex items-center justify-center rounded-[5px] px-4 py-2.5 text-sm font-semibold transition duration-200 after:pointer-events-none after:absolute after:bottom-1.5 after:left-4 after:right-4 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[var(--nav-underline)] after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100 group-hover:after:scale-x-100";

const mobileNavLinkBase =
  "relative flex items-center justify-between rounded-[5px] px-4 py-3 text-base font-semibold transition duration-200 after:pointer-events-none after:absolute after:bottom-2 after:left-4 after:right-4 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[var(--nav-underline)] after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav() {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const menuId = useId();
  const isOpen = pathname !== null && openPathname === pathname;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPathname(null);
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
        onClick={() => setOpenPathname((current) => (current === pathname ? null : pathname))}
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
        {navItems.slice(0, 1).map((item) => {
          const active = pathname ? isActivePath(pathname, item.href) : false;

          return (
            <Link
              key={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                desktopNavLinkBase,
                active
                  ? "bg-[rgba(20,83,45,0.08)] text-[var(--primary-strong)] shadow-[inset_0_0_0_1px_rgba(20,83,45,0.08)]"
                  : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
              ].join(" ")}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}

        <Link
          aria-current={pathname && isActivePath(pathname, "/verktoy") ? "page" : undefined}
          className={[
            desktopNavLinkBase,
            pathname && isActivePath(pathname, "/verktoy")
              ? "bg-[rgba(20,83,45,0.08)] text-[var(--primary-strong)] shadow-[inset_0_0_0_1px_rgba(20,83,45,0.08)]"
              : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
          ].join(" ")}
          href="/verktoy"
        >
          Verktøy
        </Link>

        {navItems.slice(1).map((item) => {
          const active = pathname ? isActivePath(pathname, item.href) : false;

          return (
            <Link
              key={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                desktopNavLinkBase,
                active
                  ? "bg-[rgba(20,83,45,0.08)] text-[var(--primary-strong)] shadow-[inset_0_0_0_1px_rgba(20,83,45,0.08)]"
                  : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
              ].join(" ")}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}

        <Link
          aria-current={pathname && isActivePath(pathname, "/lonnsjekk") ? "page" : undefined}
          className="ml-2 inline-flex items-center justify-center rounded-[5px] bg-[var(--primary-strong)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(20,83,45,0.18)] transition hover:bg-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
          href="/lonnsjekk"
        >
          Lønnssjekk
        </Link>
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
          <Link
            aria-current={pathname && isActivePath(pathname, "/verktoy") ? "page" : undefined}
            className={[
              mobileNavLinkBase,
              pathname && isActivePath(pathname, "/verktoy")
                ? "bg-[rgba(20,83,45,0.1)] text-[var(--primary-strong)]"
                : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
            ].join(" ")}
            href="/verktoy"
            tabIndex={isOpen ? undefined : -1}
          >
            <span>Verktøy</span>
          </Link>
          {navItems.map((item) => {
            const active = pathname ? isActivePath(pathname, item.href) : false;

            return (
              <Link
                key={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  mobileNavLinkBase,
                  active
                    ? "bg-[rgba(20,83,45,0.1)] text-[var(--primary-strong)]"
                    : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
                ].join(" ")}
                href={item.href}
                tabIndex={isOpen ? undefined : -1}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            aria-current={pathname && isActivePath(pathname, "/lonnsjekk") ? "page" : undefined}
            className="mt-1 flex items-center justify-center rounded-[5px] bg-[var(--primary-strong)] px-4 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(20,83,45,0.18)] transition hover:bg-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
            href="/lonnsjekk"
            tabIndex={isOpen ? undefined : -1}
          >
            Lønnssjekk
          </Link>
        </nav>
      </div>
    </div>
  );
}
