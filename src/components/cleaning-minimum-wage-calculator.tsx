"use client";

import { useMemo, useState } from "react";

type Category = "adult" | "under18";

export function CleaningMinimumWageCalculator({ adultRate, under18Rate }: { adultRate: number; under18Rate: number }) {
  const [category, setCategory] = useState<Category>("adult");
  const [weeklyHours, setWeeklyHours] = useState(37.5);
  const hourlyRate = category === "adult" ? adultRate : under18Rate;
  const safeWeeklyHours = Number.isFinite(weeklyHours) ? Math.min(Math.max(weeklyHours, 0), 80) : 0;
  const values = useMemo(() => {
    const annualHours = safeWeeklyHours * 52;
    return [
      { label: "Per time", value: hourlyRate },
      { label: "Per arbeidsdag", value: hourlyRate * (safeWeeklyHours / 5) },
      { label: "Per uke", value: hourlyRate * safeWeeklyHours },
      { label: "Per måned", value: (hourlyRate * annualHours) / 12 },
      { label: "Per år", value: hourlyRate * annualHours },
    ];
  }, [hourlyRate, safeWeeklyHours]);

  return (
    <div className="rounded-[20px] border border-[#cbded9] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-7">
      <div className="max-w-md">
        <ChoiceGroup<Category> label="Aldersgruppe" onChange={setCategory} options={[{ label: "Over 18 år", value: "adult" }, { label: "Under 18 år", value: "under18" }]} value={category} />
      </div>

      <div className="mt-7 rounded-[16px] bg-[#f4f8f7] p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label className="text-sm font-semibold text-slate-950" htmlFor="weekly-hours">Timer per uke</label>
          <div className="relative w-full sm:w-44">
            <input className="h-12 w-full rounded-[12px] border border-slate-300 bg-white px-4 pr-16 text-base font-semibold tabular-nums text-slate-950 outline-none transition focus:border-[#087f8c] focus:ring-4 focus:ring-cyan-800/10" id="weekly-hours" inputMode="decimal" max="80" min="0" onChange={(event) => setWeeklyHours(Number(event.target.value))} step="0.5" type="number" value={weeklyHours} />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">timer</span>
          </div>
        </div>
        <input aria-label="Velg antall timer per uke" className="mt-5 h-2 w-full cursor-pointer accent-[#087f8c]" max="80" min="0" onChange={(event) => setWeeklyHours(Number(event.target.value))} step="0.5" type="range" value={safeWeeklyHours} />
        <div className="mt-2 flex justify-between text-xs text-slate-500"><span>0 timer</span><span>80 timer</span></div>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-l-4 border-[#0e97a6] bg-[#eef9fa] px-4 py-3 text-sm text-slate-700">
        <p><strong className="text-slate-950">Timesats i beregningen:</strong> {formatCurrency(hourlyRate)}</p>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {values.map((item) => <div className="rounded-[14px] border border-slate-200 bg-[#fbfcfc] px-4 py-4 text-slate-950" key={item.label}><dt className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">{item.label}</dt><dd aria-live="polite" className="mt-2 whitespace-nowrap text-xl font-bold tabular-nums tracking-[-0.025em]">{formatCurrency(item.value)}</dd></div>)}
      </dl>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        Beregningen bruker {formatNumber(safeWeeklyHours)} timer per uke. Dette er en matematisk omregning av minstelønnssatsen, ikke egne lovpålagte måneds- eller årssatser.
      </p>
    </div>
  );
}

function ChoiceGroup<T extends string>({ label, onChange, options, value }: { label: string; onChange: (value: T) => void; options: readonly { label: string; value: T }[]; value: T }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-950">{label}</legend>
      <div className="mt-3 grid h-12 grid-cols-2 rounded-[12px] border border-slate-200 bg-slate-100 p-1">
        {options.map((option) => <button aria-pressed={value === option.value} className={`rounded-[9px] px-2 text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f8c] ${value === option.value ? "bg-white font-semibold text-slate-950 shadow-sm ring-1 ring-slate-300" : "font-medium text-slate-600 hover:text-slate-950"}`} key={option.value} onClick={() => onChange(option.value)} type="button">{option.label}</button>)}
      </div>
    </fieldset>
  );
}

function formatCurrency(value: number) { return `${Math.round(value).toLocaleString("nb-NO")} kr`; }
function formatNumber(value: number) { return value.toLocaleString("nb-NO", { maximumFractionDigits: 1 }); }
