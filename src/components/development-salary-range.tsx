"use client";

import { useState } from "react";
import { SalaryRangeExplorer } from "@/components/salary-range-explorer";
import { salaryRangeTestDataset } from "@/lib/development-salary-range-data";

export function DevelopmentSalaryRange() {
  const [scenario, setScenario] = useState("10");
  const points = salaryRangeTestDataset.points.slice(-(scenario === "missing" ? 10 : Number(scenario)))
    .map((point, index) => scenario === "missing" ? {
      ...point, all: index === 4 ? null : point.all, women: index === 3 ? null : point.women, men: index === 6 ? null : point.men,
    } : point);
  return <section aria-label="Interaktivt lønnsspenn">
    <div role="group" aria-label="Testdata for lønnsspenn" className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm font-semibold text-slate-600">Testperiode</span>
      {[{ id: "10", label: "10 år" }, { id: "5", label: "5 år" }, { id: "1", label: "1 år" }, { id: "missing", label: "Manglende data" }].map((option) => (
        <button key={option.id} type="button" aria-pressed={scenario === option.id} onClick={() => setScenario(option.id)}
          className={`min-h-10 rounded-md px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] ${scenario === option.id ? "bg-[#0b376d] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
          {option.label}
        </button>
      ))}
    </div>
    <SalaryRangeExplorer key={scenario} dataset={{ ...salaryRangeTestDataset, points }} />
  </section>;
}
