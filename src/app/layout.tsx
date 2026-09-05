import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AdsenseScript } from "@/components/adsense-script";
import { AppShell } from "@/components/app-shell";
import {
  clickioDefaultConsentMode,
  clickioTcfStub,
} from "@/lib/clickio-consent";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
});

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  category: "business",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="no" className={manrope.className}>
      <head suppressHydrationWarning>
        <Script
          id="clickio-tcf-stub"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: clickioTcfStub }}
        />
        <Script
          id="clickio-default-consent-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: clickioDefaultConsentMode }}
        />
        <Script
          id="clickio-consent"
          src="https://clickiocmp.com/t/consent_249773.js"
          strategy="beforeInteractive"
        />
      </head>
      <body suppressHydrationWarning className="flex min-h-screen flex-col">
        <AdsenseScript />
        <AppShell>{children}</AppShell>
        <Analytics />
        <SpeedInsights />
      </body>
      {googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null}
    </html>
  );
}
