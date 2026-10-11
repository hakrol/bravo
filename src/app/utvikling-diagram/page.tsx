import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DevelopmentDiagramTabs } from "@/components/development-diagram-tabs";
import { isDevAreaAvailable } from "@/lib/dev-area";

export const metadata: Metadata = {
  title: "Utvikling-diagram",
  description: "Arbeidsområde for nye diagrammer.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function DevelopmentDiagramPage() {
  if (process.env.NODE_ENV !== "development" || !isDevAreaAvailable()) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/dev"
          className="text-sm font-semibold text-[var(--primary-strong)] hover:underline"
        >
          Tilbake til utviklingsområdet
        </Link>
        <header className="mb-8 mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
            Diagramverksted
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Utvikling-diagram
          </h1>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">
            Velg et diagram for å jobbe med utforming og interaksjon.
          </p>
        </header>
        <DevelopmentDiagramTabs />
      </div>
    </div>
  );
}
