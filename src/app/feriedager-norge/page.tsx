import type { Metadata } from "next";
import { HolidayCalendar } from "@/components/holiday-calendar";
import { siteConfig } from "@/lib/site-config";

const description =
  "Se feriedager, røde dager og offisielle helligdager i Norge i en komplett kalender for 2026.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feriedager i Norge 2026 – røde dager og helligdager",
  description,
  alternates: {
    canonical: "/feriedager-norge",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "/feriedager-norge",
    siteName: siteConfig.name,
    title: `Feriedager i Norge 2026 – røde dager og helligdager | ${siteConfig.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Feriedager i Norge 2026 – røde dager og helligdager | ${siteConfig.name}`,
    description,
  },
};

export default function FeriedagerNorgePage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <HolidayCalendar referenceDate={new Date().toISOString()} />
      </div>
    </main>
  );
}
