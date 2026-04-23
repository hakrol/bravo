import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isDevAreaAvailable } from "@/lib/dev-area";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    default: "Dev",
    template: `%s | Dev | ${siteConfig.name}`,
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

type DevLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function DevLayout({ children }: DevLayoutProps) {
  if (!isDevAreaAvailable()) {
    notFound();
  }

  return children;
}
