"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { accountantOccupationDetailPage } from "@/lib/occupation-detail-pages";

const navItems = [
  { href: "/", label: "Forside" },
  { href: "/yrker", label: "Yrker" },
  { href: "/kvinner-vs-menn", label: "Kvinner vs menn" },
  { href: "/topp-jobber", label: "Topp jobber" },
  {
    href: accountantOccupationDetailPage?.href ?? "/yrker",
    label: accountantOccupationDetailPage?.label ?? "Regnskapsforer",
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
  const [clientPathname, setClientPathname] = useState("");

  useEffect(() => {
    setClientPathname(pathname);
  }, [pathname]);

  return (
    <nav aria-label="Hovedmeny" className="flex flex-wrap items-center gap-2">
      {navItems.map((item) => {
        const active = clientPathname ? isActivePath(clientPathname, item.href) : false;

        return (
          <Link
            key={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition",
              active
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-slate-700 hover:bg-white hover:text-slate-950",
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
