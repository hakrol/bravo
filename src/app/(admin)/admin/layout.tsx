import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isAdminAvailable } from "@/lib/admin/auth";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: `%s | Admin | ${siteConfig.name}`,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

type AdminRootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  if (!isAdminAvailable()) {
    notFound();
  }

  return children;
}
