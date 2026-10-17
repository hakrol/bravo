"use client";

import { useId, useState } from "react";
import { SalaryGrowthExplorer } from "@/components/salary-growth-explorer";
import type { SalaryGrowthSnapshot } from "@/lib/salary-growth-snapshot";

type Option = { id: string; snapshot: SalaryGrowthSnapshot };

export function BlogSalaryGrowthPicker({ initialId, options }: { initialId: string; options: Option[] }) {
  const id = useId();
  const [selectedId, setSelectedId] = useState(initialId);
  const selected = options.find((option) => option.id === selectedId) ?? options[0];

  return (
    <div className="not-prose my-10 min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">Velg fagretning for lønnsutvikling</label>
      <select id={id} value={selected.id} onChange={(event) => setSelectedId(event.target.value)}
        className="min-h-11 w-full max-w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d]">
        {options.map((option) => <option key={option.id} value={option.id}>
          {option.snapshot.title.replace(/^Slik har lønnen til /, "").replace(/ utviklet seg$/, "")}
        </option>)}
      </select>
      <SalaryGrowthExplorer key={selected.id} snapshot={selected.snapshot} />
    </div>
  );
}
