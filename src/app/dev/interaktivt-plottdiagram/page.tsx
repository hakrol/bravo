import type { Metadata } from "next";
import Link from "next/link";
import { OccupationQuadrantExplorer } from "@/components/occupation-quadrant-explorer";
import { getOccupationQuadrantDataset } from "@/lib/occupation-quadrant-data";

export const metadata: Metadata = {
  title: "Interaktivt plottdiagram",
  description: "Kvadrantdiagram med median månedslønn og antall lønnstakere for norske yrker.",
};

export default async function InteractiveScatterPage() {
  const dataset = await getOccupationQuadrantDataset();
  return <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
    <div className="mx-auto w-full max-w-5xl">
      <Link href="/dev" className="text-sm font-semibold text-[var(--primary-strong)] hover:underline">Tilbake til utviklingsområdet</Link>
      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">Diagramverksted</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Interaktivt plottdiagram</h1>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">Utforsk sammenhengen mellom lønn og antall lønnstakere i fire kvadranter.</p>
      </header>
      <OccupationQuadrantExplorer dataset={dataset} />
    </div>
  </div>;
}
