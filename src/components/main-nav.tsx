"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const navItems = [
  { href: "/yrker", label: "Yrker" },
  { href: "/nyheter", label: "Nyheter" },
  { href: "/blogg", label: "Blogg" },
  { href: "/om", label: "Om" },
] as const;

const primaryTools = [
  {
    href: "/lonnsjekk",
    label: "Lønnsjekk",
    description: "Sammenlign lønnen din med markedet og se hvordan du ligger an.",
    imageSrc: "/images/mega-menu-lonnsjekk-v2.png",
  },
  {
    href: "/jobbtilbud",
    label: "Lønnstilbud",
    description: "Vurder lønnen i et jobbtilbud før du svarer eller forhandler.",
    imageSrc: "/images/mega-menu-lonnstilbud-v2.png",
  },
] as const;

const secondaryTools = [
  { href: "/lanekalkulator", label: "Lånekalkulator", icon: "loan" },
  { href: "/lonnskalkulator", label: "Lønnskalkulator", icon: "calculator" },
  { href: "/feriekalkulator", label: "Feriekalkulator", icon: "calendar" },
] as const;

const allToolPaths = [
  "/verktoy",
  ...primaryTools.map((tool) => tool.href),
  ...secondaryTools.map((tool) => tool.href),
  "/kalkulatorer",
  "/sammenlign-lonn",
  "/lonnsvekst",
  "/bruttolonn-kalkulator",
  "/arsverk-kalkulator",
  "/feriekalkulator",
  "/lanekalkulator",
  "/rente-og-avdrag-kalkulator",
  "/kilometergodtgjorelse-kalkulator",
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

function isToolPath(pathname: string) {
  return allToolPaths.some((path) => isActivePath(pathname, path));
}

function ToolIcon({ name }: { name: string }) {
  const commonProps = {
    "aria-hidden": true,
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };

  if (name === "chart") {
    return (
      <svg {...commonProps}>
        <path d="M4 19V9m6 10V5m6 14v-7m4 7H2" />
      </svg>
    );
  }

  if (name === "offer") {
    return (
      <svg {...commonProps}>
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M15 3v5h5M10 13h6m-6 4h4" />
      </svg>
    );
  }

  if (name === "loan") {
    return (
      <svg {...commonProps}>
        <path d="M3 10h18M5 10v8m5-8v8m4-8v8m5-8v8M3 21h18M12 3l9 5H3z" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...commonProps}>
        <rect height="16" rx="2" width="18" x="3" y="5" />
        <path d="M8 3v4m8-4v4M3 10h18m-13 4h.01m4 0h.01m4 0h.01m-8 3h.01m4 0h.01" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <rect height="16" rx="2" width="14" x="5" y="4" />
      <path d="M8 8h8M8 12h2m3 0h3m-8 4h2m3 0h3" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={["h-4 w-4 transition-transform duration-200", open ? "rotate-180" : ""].join(
        " ",
      )}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

type MainNavProps = Readonly<{
  onOpenChange?: (isOpen: boolean) => void;
}>;

export function MainNav({ onOpenChange }: MainNavProps) {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const [toolsOpenPathname, setToolsOpenPathname] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const mobileMenuId = useId();
  const desktopToolsId = useId();
  const mobileToolsId = useId();
  const isMobileMenuOpen = pathname !== null && openPathname === pathname;
  const areToolsOpen = pathname !== null && toolsOpenPathname === pathname;
  const toolsAreActive = pathname ? isToolPath(pathname) : false;

  useEffect(() => {
    onOpenChange?.(isMobileMenuOpen || areToolsOpen);
  }, [areToolsOpen, isMobileMenuOpen, onOpenChange]);

  useEffect(() => {
    if (!isMobileMenuOpen && !areToolsOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPathname(null);
        setToolsOpenPathname(null);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenPathname(null);
        setToolsOpenPathname(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [areToolsOpen, isMobileMenuOpen]);

  const closeMenus = () => {
    setOpenPathname(null);
    setToolsOpenPathname(null);
  };

  return (
    <div className="flex items-center justify-end" ref={navRef}>
      <button
        aria-controls={mobileMenuId}
        aria-expanded={isMobileMenuOpen}
        aria-label={isMobileMenuOpen ? "Lukk hovedmeny" : "Åpne hovedmeny"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-[5px] border border-[var(--border)] bg-white text-[var(--foreground)] shadow-[0_10px_24px_rgba(27,36,48,0.08)] transition hover:border-[rgba(20,83,45,0.28)] hover:text-[var(--primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)] lg:hidden"
        type="button"
        onClick={() => {
          setOpenPathname((current) => (current === pathname ? null : pathname));
          setToolsOpenPathname(null);
        }}
      >
        <span className="sr-only">
          {isMobileMenuOpen ? "Lukk hovedmeny" : "Åpne hovedmeny"}
        </span>
        <span aria-hidden="true" className="relative h-4 w-5">
          <span
            className={[
              "absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition duration-200",
              isMobileMenuOpen ? "translate-y-[7px] rotate-45" : "",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition duration-200",
              isMobileMenuOpen ? "opacity-0" : "opacity-100",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition duration-200",
              isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : "",
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

        <button
          aria-controls={desktopToolsId}
          aria-expanded={areToolsOpen}
          className={[
            desktopNavLinkBase,
            "gap-2",
            toolsAreActive || areToolsOpen
              ? "bg-[rgba(20,83,45,0.08)] text-[var(--primary-strong)] shadow-[inset_0_0_0_1px_rgba(20,83,45,0.08)] after:scale-x-100"
              : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
          ].join(" ")}
          type="button"
          onClick={() =>
            setToolsOpenPathname((current) => (current === pathname ? null : pathname))
          }
        >
          Verktøy
          <ChevronIcon open={areToolsOpen} />
        </button>

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
          Lønnsjekk
        </Link>
      </nav>

      <div
        aria-hidden={!areToolsOpen}
        className={[
          "absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 hidden origin-top rounded-[5px] border border-[rgba(20,83,45,0.16)] bg-[#f8fbf6] p-3 shadow-[0_28px_72px_rgba(27,36,48,0.18)] transition duration-200 lg:block",
          areToolsOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.99] opacity-0",
        ].join(" ")}
        id={desktopToolsId}
      >
        <div className="grid grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.8fr)] gap-3">
          <div className="grid grid-cols-2 gap-3">
            {primaryTools.map((tool) => (
              <Link
                className="group relative grid min-h-52 content-end overflow-hidden rounded-[5px] bg-[var(--primary-strong)] p-6 text-white transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
                href={tool.href}
                key={tool.href}
                onClick={closeMenus}
                tabIndex={areToolsOpen ? undefined : -1}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 transition duration-500 group-hover:scale-[1.02]"
                >
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="(min-width: 1280px) 26vw, 34vw"
                    src={tool.imageSrc}
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,63,43,0.98)_0%,rgba(20,63,43,0.9)_38%,rgba(20,63,43,0.18)_72%,transparent_100%)]"
                />
                <span className="relative z-10 grid gap-2">
                  <span className="flex items-center justify-between gap-4 text-2xl font-semibold tracking-[-0.04em]">
                    {tool.label}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                  <span className="max-w-[68%] text-sm leading-6 text-white/75">
                    {tool.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col rounded-[5px] bg-white p-5 shadow-[inset_0_0_0_1px_rgba(20,83,45,0.08)]">
            <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Flere verktøy
            </p>
            <div className="grid gap-1">
              {secondaryTools.map((tool) => (
                <Link
                  className="group flex items-center gap-3 rounded-[5px] px-2 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[rgba(20,83,45,0.07)] hover:text-[var(--primary-strong)]"
                  href={tool.href}
                  key={tool.href}
                  onClick={closeMenus}
                  tabIndex={areToolsOpen ? undefined : -1}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] bg-[rgba(20,83,45,0.08)] text-[var(--primary-strong)]">
                    <ToolIcon name={tool.icon} />
                  </span>
                  <span>{tool.label}</span>
                  <span aria-hidden="true" className="ml-auto transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </div>
            <Link
              className="mt-auto flex items-center justify-between border-t border-[var(--border)] px-2 pt-4 text-sm font-semibold text-[var(--primary-strong)] transition hover:text-[var(--primary)]"
              href="/verktoy"
              onClick={closeMenus}
              tabIndex={areToolsOpen ? undefined : -1}
            >
              Se alle verktøy
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div
        aria-hidden={!isMobileMenuOpen}
        className={[
          "absolute left-3 right-3 top-[calc(100%+0.75rem)] z-50 max-h-[calc(100vh-7rem)] origin-top overflow-y-auto rounded-[5px] border border-[var(--border)] bg-white p-2 shadow-[0_24px_64px_rgba(27,36,48,0.18)] transition duration-200 lg:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0",
        ].join(" ")}
        id={mobileMenuId}
      >
        <nav aria-label="Mobil hovedmeny" className="flex flex-col gap-1">
          <button
            aria-controls={mobileToolsId}
            aria-expanded={areToolsOpen}
            className={[
              mobileNavLinkBase,
              toolsAreActive || areToolsOpen
                ? "bg-[rgba(20,83,45,0.1)] text-[var(--primary-strong)]"
                : "text-[var(--foreground)] hover:bg-[rgba(20,83,45,0.06)] hover:text-[var(--primary-strong)]",
            ].join(" ")}
            tabIndex={isMobileMenuOpen ? undefined : -1}
            type="button"
            onClick={() =>
              setToolsOpenPathname((current) => (current === pathname ? null : pathname))
            }
          >
            <span>Verktøy</span>
            <ChevronIcon open={areToolsOpen} />
          </button>

          <div
            aria-hidden={!areToolsOpen}
            className={[
              "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200",
              areToolsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            ].join(" ")}
            id={mobileToolsId}
          >
            <div className="min-h-0">
              <div className="grid gap-2 px-1 py-2">
                {primaryTools.map((tool) => (
                  <Link
                    className="relative grid gap-2 overflow-hidden rounded-[5px] bg-[var(--primary-strong)] p-4 text-white transition hover:bg-[var(--primary)]"
                    href={tool.href}
                    key={tool.href}
                    onClick={closeMenus}
                    tabIndex={isMobileMenuOpen && areToolsOpen ? undefined : -1}
                  >
                    <span aria-hidden="true" className="absolute inset-0 overflow-hidden">
                      <Image
                        alt=""
                        className="object-cover object-center"
                        fill
                        sizes="100vw"
                        src={tool.imageSrc}
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,63,43,1)_0%,rgba(20,63,43,0.94)_48%,rgba(20,63,43,0.28)_100%)]"
                    />
                    <span className="flex items-center justify-between gap-3 font-semibold">
                      <span className="relative z-10 flex items-center gap-3">
                        {tool.label}
                      </span>
                      <span aria-hidden="true" className="relative z-10">→</span>
                    </span>
                    <span className="relative z-10 max-w-[68%] text-sm leading-5 text-white/75">
                      {tool.description}
                    </span>
                  </Link>
                ))}

                <div className="grid gap-1 py-1">
                  {secondaryTools.map((tool) => (
                    <Link
                      className="flex items-center gap-3 rounded-[5px] px-3 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[rgba(20,83,45,0.07)] hover:text-[var(--primary-strong)]"
                      href={tool.href}
                      key={tool.href}
                      onClick={closeMenus}
                      tabIndex={isMobileMenuOpen && areToolsOpen ? undefined : -1}
                    >
                      <span className="text-[var(--primary-strong)]">
                        <ToolIcon name={tool.icon} />
                      </span>
                      {tool.label}
                    </Link>
                  ))}
                </div>

                <Link
                  className="flex items-center justify-between border-t border-[var(--border)] px-3 pt-3 text-sm font-semibold text-[var(--primary-strong)]"
                  href="/verktoy"
                  onClick={closeMenus}
                  tabIndex={isMobileMenuOpen && areToolsOpen ? undefined : -1}
                >
                  Se alle verktøy
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

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
                onClick={closeMenus}
                tabIndex={isMobileMenuOpen ? undefined : -1}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            aria-current={pathname && isActivePath(pathname, "/lonnsjekk") ? "page" : undefined}
            className="mt-1 flex items-center justify-center rounded-[5px] bg-[var(--primary-strong)] px-4 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(20,83,45,0.18)] transition hover:bg-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
            href="/lonnsjekk"
            onClick={closeMenus}
            tabIndex={isMobileMenuOpen ? undefined : -1}
          >
            Lønnsjekk
          </Link>
        </nav>
      </div>
    </div>
  );
}
