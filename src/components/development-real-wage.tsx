"use client";

import { useState } from "react";
import { RealWageGrowthExplorer } from "@/components/real-wage-growth-explorer";
import { realWageTestDataset } from "@/lib/development-real-wage-data";

export function DevelopmentRealWage() {
  const [scenario, setScenario] = useState("10");
  const count = scenario === "missing" ? 5 : Number(scenario);
  const start = realWageTestDataset.points.length - count;
  const points = realWageTestDataset.points.slice(start).map((point, index) => scenario === "missing"
    ? { ...point, women: index === 1 ? null : point.women, cpi: index === 3 ? null : point.cpi } : point);
  const baseline = start > 0 ? realWageTestDataset.points[start - 1] : realWageTestDataset.baseline;
  return <section aria-label="Interaktiv reallønn">
    <div role="group" aria-label="Testdata for reallønn" className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm font-semibold text-slate-600">Testperiode</span>
      {[{ id: "10", label: "10 år" }, { id: "5", label: "5 år" }, { id: "1", label: "1 år" }, { id: "missing", label: "Manglende data" }].map((option) => (
        <button key={option.id} type="button" aria-pressed={scenario === option.id} onClick={() => setScenario(option.id)}
          className={`min-h-10 rounded-md px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] ${scenario === option.id ? "bg-[#0b376d] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
          {option.label}
        </button>
      ))}
    </div>
    <RealWageGrowthExplorer key={scenario} dataset={{ ...realWageTestDataset, baseline, points }} />
  </section>;
}
