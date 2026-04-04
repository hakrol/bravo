"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MainFooter } from "@/components/main-footer";
import { MainHeader } from "@/components/main-header";

type AppShellProps = Readonly<{
  children: React.ReactNode;
}>;

function isAdminPath(pathname: string | null) {
  return pathname === "/admin" || pathname?.startsWith("/admin/") === true;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const headerRegionRef = useRef<HTMLDivElement>(null);
  const mainRegionRef = useRef<HTMLElement>(null);
  const footerRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const regions = [headerRegionRef.current, mainRegionRef.current, footerRegionRef.current].filter(
      (region): region is HTMLElement => region !== null,
    );

    const syncInertState = (region: HTMLElement) => {
      const isAriaHidden =
        region.getAttribute("aria-hidden") === "true" || region.dataset.ariaHidden === "true";

      if (isAriaHidden) {
        region.setAttribute("inert", "");
        return;
      }

      region.removeAttribute("inert");
    };

    const observer = new MutationObserver((mutations) => {
      const changedRegions = new Set<HTMLElement>();

      for (const mutation of mutations) {
        changedRegions.add(mutation.target as HTMLElement);
      }

      changedRegions.forEach(syncInertState);
    });

    regions.forEach((region) => {
      syncInertState(region);
      observer.observe(region, {
        attributes: true,
        attributeFilter: ["aria-hidden", "data-aria-hidden"],
      });
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (isAdminPath(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <div ref={headerRegionRef}>
        <MainHeader />
      </div>
      <main ref={mainRegionRef} className="flex-1">
        {children}
      </main>
      <div ref={footerRegionRef}>
        <MainFooter />
      </div>
    </>
  );
}
