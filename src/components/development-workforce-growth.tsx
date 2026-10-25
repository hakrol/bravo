"use client";

import { useId, useState } from "react";
import { WorkforceGrowthExplorer } from "@/components/workforce-growth-explorer";
import type { WorkforceGrowthDataset } from "@/lib/workforce-growth";

export function DevelopmentWorkforceGrowth({ datasets }: { datasets: WorkforceGrowthDataset[] }) {
  const id = useId();
  const [occupationCode, setOccupationCode] = useState(datasets[0]?.occupationCode ?? "");
  const dataset = datasets.find((item) => item.occupationCode === occupationCode) ?? datasets[0];
  if (!dataset) return <p className="py-6 text-sm text-slate-600">Ingen SSB-data tilgjengelig.</p>;
  return <div>
    <label htmlFor={id} className="mb-2 block text-xs font-semibold text-slate-600">Velg yrke</label>
    <select id={id} value={dataset.occupationCode} onChange={(event) => setOccupationCode(event.target.value)}
      className="min-h-11 w-full max-w-sm rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d]">
      {datasets.map((item) => <option key={item.occupationCode} value={item.occupationCode}>{item.occupationLabel}</option>)}
    </select>
    <WorkforceGrowthExplorer key={dataset.occupationCode} dataset={dataset} />
  </div>;
}
