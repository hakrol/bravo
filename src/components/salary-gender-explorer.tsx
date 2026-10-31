"use client";

import { useId, useRef, useState } from "react";
import { SalaryGenderInfoDialog } from "@/components/salary-gender-info-dialog";
import styles from "./salary-range-explorer.module.css";

type SalaryView = "monthly" | "annual" | "hourly";

export type SalaryGenderExplorerProps = {
  occupationLabel: string;
  period: string;
  source: string;
  womenMonthlyMedian: number | string | null;
  menMonthlyMedian: number | string | null;
  monthlyHours?: number | string;
};

const views: { id: SalaryView; label: string }[] = [
  { id: "monthly", label: "Månedslønn" },
  { id: "annual", label: "Årslønn" },
  { id: "hourly", label: "Timelønn" },
];
const genders = [
  { key: "women", label: "Kvinner", color: "#ec1f74" },
  { key: "men", label: "Menn", color: "#2563eb" },
] as const;
const numberFormatter = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });

function positiveNumber(value: number | string | null | undefined) {
  const parsed = typeof value === "string" ? Number(value.replace(/\s/g, "").replace(",", ".")) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function SalaryGenderExplorer({
  occupationLabel, period, source, womenMonthlyMedian, menMonthlyMedian, monthlyHours = 162.5,
}: SalaryGenderExplorerProps) {
  const id = useId();
  const [view, setView] = useState<SalaryView>("monthly");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const hours = positiveNumber(monthlyHours);
  const monthly = { women: positiveNumber(womenMonthlyMedian), men: positiveNumber(menMonthlyMedian) };
  const multiplier = view === "annual" ? 12 : view === "hourly" && hours !== null ? 1 / hours : 1;
  const values = { women: monthly.women === null ? null : monthly.women * multiplier, men: monthly.men === null ? null : monthly.men * multiplier };
  const maximum = Math.max(values.women ?? 0, values.men ?? 0);
  const scale = maximum > 0 ? 10 ** Math.floor(Math.log10(maximum)) : 1;
  const axisMax = Math.ceil(maximum / scale) * scale || 1;
  const salaryBasisLabel = view === "annual" ? "Median samlet årslønn (omregnet)"
    : view === "hourly" ? "Median samlet timelønn (estimat)" : "Median samlet månedslønn";
  const currency = (value: number) => `${numberFormatter.format(value)} kr`;

  return (
    <figure aria-labelledby={`${id}-title`} className="not-prose relative my-10 overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:my-12">
      <div className={styles.diagramContent} data-info-open={isInfoOpen} inert={isInfoOpen} aria-hidden={isInfoOpen || undefined}>
      <header className="relative px-5 pt-6 sm:px-7 sm:pt-7">
        <button ref={infoButtonRef} type="button" className={styles.infoButton} aria-label="Forklaring av median samlet månedslønn" aria-haspopup="dialog" aria-expanded={isInfoOpen} aria-controls={`${id}-info`}
          onClick={() => setIsInfoOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6" /><circle cx="12" cy="7.5" r="0.8" fill="currentColor" stroke="none" /></svg>
        </button>
        <p className="mb-3 pr-10 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#164e63]">Lønn etter kjønn</p>
        <h2 id={`${id}-title`} className="m-0 text-balance font-serif text-[1.6rem] font-semibold leading-tight tracking-[-0.025em] text-slate-950 sm:text-[2.15rem]">Lønn for {occupationLabel.toLowerCase()}</h2>
        <p className="mb-0 mt-3 text-sm text-slate-600">{salaryBasisLabel} · {period}</p>
        <div role="group" aria-label="Velg lønnsvisning" className="mt-5 flex flex-wrap gap-2">
          {views.map((item) => (
            <button key={item.id} type="button" aria-pressed={view === item.id} disabled={item.id === "hourly" && hours === null}
              onClick={() => setView(item.id)}
              className={`min-h-10 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] disabled:cursor-not-allowed disabled:opacity-40 ${view === item.id ? "bg-[#0b376d] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-6 sm:px-7">
        <div role="group" aria-label={`${salaryBasisLabel} for kvinner og menn`} className="space-y-6">
          {genders.map((gender) => {
            const value = values[gender.key];
            return (
              <div key={gender.key} className="w-full">
                <span className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm font-semibold text-slate-800">
                  <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: gender.color }} />{gender.label}</span>
                  <span className="text-xl font-extrabold tabular-nums text-slate-950 sm:text-2xl">{value === null ? "Ikke tilgjengelig" : currency(value)}</span>
                </span>
                <span aria-hidden="true" className="block h-11 overflow-hidden rounded-r bg-slate-50">
                  {value !== null ? <span className="block h-full rounded-r transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${value / axisMax * 100}%`, backgroundColor: gender.color }} /> : null}
                </span>
              </div>
            );
          })}
        </div>
        {maximum > 0 ? <div aria-hidden="true" className="mt-3 flex justify-end border-t border-slate-200 pt-2 text-xs tabular-nums text-slate-500"><span>{currency(axisMax)}</span></div> : null}
      </div>
      <figcaption className="flex flex-wrap justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:px-7">
        <span><strong className="font-semibold text-slate-700">Kilde:</strong> {source}</span><span>Periode: {period}</span>
      </figcaption>
      </div>
      {isInfoOpen ? <SalaryGenderInfoDialog id={`${id}-info`} onClose={() => setIsInfoOpen(false)} returnFocusRef={infoButtonRef} monthlyHours={hours} /> : null}
    </figure>
  );
}
