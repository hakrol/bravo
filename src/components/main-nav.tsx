"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const navItems = [
  { href: "/yrker", label: "Yrker" },
  { href: "/ressurser", label: "Ressurser" },
  { href: "/blogg", label: "Blogg" },
  { href: "/om", label: "Om" },
] as const;

const toolItems = [
  { href: "/lonnskalkulator", label: "Lønnskalkulator" },
  { href: "/lanekalkulator", label: "Lånekalkulator" },
  { href: "/lonnsjekk", label: "Lønnssjekk" },
] as const;

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
        {navItems.slice(0, 1).map((item) => {
          const active = pathname ? isActivePath(pathname, item.href) : false;

          return (
            <Link
              key={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "relative inline-flex items-center justify-center rounded-[5px] px-4 py-2.5 text-sm font-semibold transition duration-200",
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

        <div className="group relative">
          <Link
            aria-current={pathname && isActivePath(pathname, "/verktoy") ? "page" : undefined}
            className={[
              "relative inline-flex items-center justify-center rounded-[5px] px-4 py-2.5 text-sm font-semibold transition duration-200",
              pathname &&
              (isActivePath(pathname, "/verktoy") ||
                toolItems.some((item) => isActivePath(pathname, item.href)))
                ? "bg-[rgba(20,83,45,0.08)] text-[var(--primary-strong)] shadow-[inset_0_0_0_1px_rgba(20,83,45,0.08)]"
                : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
            ].join(" ")}
            href="/verktoy"
          >
            Verktøy
          </Link>
          <div className="pointer-events-none absolute right-0 top-full z-50 pt-2 opacity-0 transition duration-150 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
            <div className="grid min-w-56 gap-1 rounded-[5px] border border-[var(--border)] bg-white p-2 shadow-[0_24px_64px_rgba(27,36,48,0.16)]">
              {toolItems.map((item) => {
                const active = pathname ? isActivePath(pathname, item.href) : false;

                return (
                  <Link
                    key={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "rounded-[5px] px-4 py-3 text-sm font-semibold transition duration-200",
                      active
                        ? "bg-[rgba(20,83,45,0.1)] text-[var(--primary-strong)]"
                        : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
                    ].join(" ")}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {navItems.slice(1).map((item) => {
          const active = pathname ? isActivePath(pathname, item.href) : false;

          return (
            <Link
              key={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "relative inline-flex items-center justify-center rounded-[5px] px-4 py-2.5 text-sm font-semibold transition duration-200",
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
              "flex items-center justify-between rounded-[5px] px-4 py-3 text-base font-semibold transition duration-200",
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
                  "flex items-center justify-between rounded-[5px] px-4 py-3 text-base font-semibold transition duration-200",
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
        </nav>
      </div>
    </div>
  );
}
