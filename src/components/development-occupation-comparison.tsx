"use client";

import { useState } from "react";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { occupationComparisonTestDataset } from "@/lib/development-occupation-comparison-data";

export function DevelopmentOccupationComparison() {
  const [scenario, setScenario] = useState("complete");
  const [referenceCode, setReferenceCode] = useState("7412");
  const dataset = {
    ...occupationComparisonTestDataset,
    points: occupationComparisonTestDataset.points.map((point) => scenario !== "missing" ? point : {
      ...point,
      medianMonthlySalary: point.occupationCode === "7421" ? null : point.medianMonthlySalary,
      nominalGrowth: point.occupationCode === "7411" ? null : point.nominalGrowth,
      employees: point.occupationCode === "7422" ? null : point.employees,
    }),
  };
  return <section aria-label="Interaktiv yrkessammenligning">
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <div role="group" aria-label="Testdata for yrkessammenligning" className="flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm font-semibold text-slate-600">Testdata</span>
        {[{ id: "complete", label: "Alle tall" }, { id: "missing", label: "Manglende data" }].map((option) => <button key={option.id} type="button" aria-pressed={scenario === option.id} onClick={() => setScenario(option.id)}
          className={`min-h-10 rounded-md px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] ${scenario === option.id ? "bg-[#0b376d] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>{option.label}</button>)}
      </div>
      <label className="flex max-w-full flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
        Referanseyrke
        <select value={referenceCode} onChange={(event) => setReferenceCode(event.target.value)} className="min-h-10 max-w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-[#0b376d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d]">
          {dataset.points.map((point) => <option key={point.occupationCode} value={point.occupationCode}>{point.occupationName}</option>)}
        </select>
      </label>
    </div>
    <OccupationSalaryComparisonExplorer key={referenceCode} dataset={dataset} selectedOccupationCode={referenceCode} />
  </section>;
}
