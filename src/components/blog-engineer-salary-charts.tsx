"use client";

import { useId, useState } from "react";
import snapshot from "@/content/blog/data/sivilingeniorer-lonn-2025.json";
import { OccupationSalaryComparisonExplorer } from "@/components/occupation-salary-comparison-explorer";
import { RealWageGrowthExplorer } from "@/components/real-wage-growth-explorer";
import { SalaryGenderGapExplorer } from "@/components/salary-gender-gap-explorer";
import type { OccupationSalaryComparisonDataset } from "@/lib/occupation-salary-comparison";
import type { RealWageDataset } from "@/lib/real-wage-growth";
import type { SalaryGenderGapDataset, SalaryGenderGapPoint } from "@/lib/salary-gender-gap";

const occupations = [...snapshot.occupations].sort((a, b) => b.history.at(-1)!.median - a.history.at(-1)!.median);
const inflation = occupations[0].history;
const comparison = {
  year: snapshot.salaryYear,
  salaryPopulation: snapshot.salaryPopulation,
  employmentPopulation: snapshot.employmentPopulation,
  source: "SSB tabell 11418, 11658 og 14700",
  inflation: {
    year: snapshot.salaryYear,
    annualGrowth: (inflation.at(-1)!.cpi / inflation.at(-2)!.cpi - 1) * 100,
    source: "SSB tabell 14700 · november til november",
  },
  points: occupations.map((occupation) => ({
    occupationCode: occupation.code,
    occupationName: occupation.label,
    href: occupation.href,
    year: snapshot.salaryYear,
    medianMonthlySalary: occupation.history.at(-1)!.median,
    nominalGrowth: (occupation.history.at(-1)!.median / occupation.history.at(-2)!.median - 1) * 100,
    employees: occupation.workforce.employees,
    employeesPeriodLabel: occupation.workforce.periodLabel,
    source: "SSB tabell 11418 og 11658",
  })),
} satisfies OccupationSalaryComparisonDataset;

export function EngineerSalaryExplorer({ view }: { view: "comparison" | "real" | "gender" }) {
  const id = useId();
  const [code, setCode] = useState("2146");
  const occupation = occupations.find((item) => item.code === code)!;
  const subject = occupation.label.toLocaleLowerCase("nb-NO");
  const genderPoints = occupation.history.filter((point): point is typeof point & SalaryGenderGapPoint =>
    point.women !== null && point.men !== null);
  const genderDataset = {
    title: `Lønnsforskjellen blant ${subject}`,
    source: "SSB tabell 11418",
    points: genderPoints,
  } satisfies SalaryGenderGapDataset;
  const realDataset = {
    title: `Kjøpekraften til ${subject}`,
    source: "SSB tabell 11418 og 14700 · KPI for november",
    baseline: occupation.history[0],
    points: occupation.history.slice(1),
  } satisfies RealWageDataset;
  const label = view === "comparison" ? "Velg fagretning å sammenligne med"
    : view === "real" ? "Velg fagretning for reallønn" : "Velg fagretning for lønnsforskjell";

  return (
    <div className="not-prose my-10 min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">{label}</label>
      <select id={id} value={code} onChange={(event) => setCode(event.target.value)}
        className="min-h-11 w-full max-w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d]">
        {occupations.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
      </select>
      {view !== "comparison" && occupation.history.some((point) => point.women === null || point.men === null) ? (
        <p className="mt-3 text-sm text-slate-600">
          {code === "2153" ? "For telekommunikasjon er kvinnelønn bare publisert for 2025. Historisk lønnsgap og årlig reallønnsvekst for kvinner kan derfor ikke beregnes."
            : "For miljøteknikk er kjønnstallene for 2016–2018 ikke publisert. Lønnsgap vises fra 2019 og årlig reallønnsvekst for kvinner og menn fra 2020."}
        </p>
      ) : null}
      {view === "comparison" ? <OccupationSalaryComparisonExplorer key={code} dataset={comparison} selectedOccupationCode={code} />
        : view === "real" ? <RealWageGrowthExplorer key={code} dataset={realDataset} />
          : <SalaryGenderGapExplorer key={code} dataset={genderDataset} />}
    </div>
  );
}
