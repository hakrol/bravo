"use client";

import { useState } from "react";
import { SalaryGenderGapExplorer } from "@/components/salary-gender-gap-explorer";
import { salaryGenderGapTestDataset } from "@/lib/development-salary-gender-gap-data";

export function DevelopmentSalaryGenderGap() {
  const [yearCount, setYearCount] = useState(10);
  return (
    <section aria-label="Lønnsforskjell mellom kvinner og menn">
      <div role="group" aria-label="Antall år med testdata" className="flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm font-semibold text-slate-600">Testperiode</span>
        {[10, 5, 1].map((count) => (
          <button key={count} type="button" aria-pressed={yearCount === count} onClick={() => setYearCount(count)}
            className={`min-h-10 rounded-md px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] ${yearCount === count ? "bg-[#0b376d] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
            {count} år
          </button>
        ))}
      </div>
      <SalaryGenderGapExplorer key={yearCount} dataset={{ ...salaryGenderGapTestDataset, points: salaryGenderGapTestDataset.points.slice(0, yearCount) }} />
    </section>
  );
}
