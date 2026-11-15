"use client";

import { useState } from "react";
import { OccupationQuadrantExplorer } from "@/components/occupation-quadrant-explorer";
import {
  occupationQuadrantClosePointsTestDataset,
  occupationQuadrantTestDataset,
} from "@/lib/development-occupation-quadrant-data";

const scenarios = [
  { id: "original", label: "Opprinnelige testdata", dataset: occupationQuadrantTestDataset },
  { id: "close-points", label: "3 tettliggende punkter", dataset: occupationQuadrantClosePointsTestDataset },
] as const;

/**
 * KUN UTVIKLING: Testdatavelgeren tilhører verkstedet under /utvikling-diagram.
 * Ved bruk i blogginnlegg: gjenbruk OccupationQuadrantExplorer direkte med innleggets
 * eget datasett. Ikke importer denne komponenten eller development-datasettene.
 */
export function DevelopmentOccupationQuadrant() {
  const [scenarioId, setScenarioId] = useState<(typeof scenarios)[number]["id"]>("original");
  const scenario = scenarios.find((item) => item.id === scenarioId)!;

  return <section aria-label="Test av interaktivt plottdiagram">
    <div data-development-only="true" className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-black">
      <p className="m-0 text-xs font-bold uppercase tracking-wide">Kun utvikling · testdatavelger</p>
      <p className="mb-3 mt-2 text-sm leading-5">Veksle mellom to fiktive datasett. Denne velgeren følger ikke med når diagrammet brukes i blogginnlegg.</p>
      <div role="group" aria-label="Testdatasett for plottdiagram" className="flex flex-wrap gap-2">
        {scenarios.map((option) => <button key={option.id} type="button" aria-pressed={scenarioId === option.id}
          onClick={() => setScenarioId(option.id)}
          className={`min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] ${scenarioId === option.id ? "bg-[#0b376d] text-white" : "border border-slate-200 bg-white text-black hover:bg-slate-100"}`}>
          {option.label}
        </button>)}
      </div>
    </div>
    <OccupationQuadrantExplorer key={scenario.id} dataset={scenario.dataset} />
  </section>;
}
