"use client";

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

  if (isAdminPath(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <MainHeader />
      <div className="flex-1">{children}</div>
      <MainFooter />
    </>
  );
}
