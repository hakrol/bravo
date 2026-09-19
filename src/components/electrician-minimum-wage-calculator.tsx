"use client";

import { useMemo, useState } from "react";

type ElectricianMinimumWageCalculatorProps = {
  skilledRate: number;
  otherRate: number;
};

const weeklyHourOptions = [37.5, 36.5, 35.5, 33.6] as const;

export function ElectricianMinimumWageCalculator({
  skilledRate,
  otherRate,
}: ElectricianMinimumWageCalculatorProps) {
  const [category, setCategory] = useState<"skilled" | "other">("skilled");
  const [weeklyHours, setWeeklyHours] = useState(37.5);
  const hourlyRate = category === "skilled" ? skilledRate : otherRate;
  const values = useMemo(() => {
    const dailyHours = weeklyHours / 5;
    const annualHours = weeklyHours * 52;

    return [
      { label: "Per time", value: hourlyRate },
      { label: `Per dag (${formatNumber(dailyHours, 1)} t)`, value: hourlyRate * dailyHours },
      { label: `Per uke (${formatNumber(weeklyHours, 1)} t)`, value: hourlyRate * weeklyHours },
      { label: "Per måned", value: (hourlyRate * annualHours) / 12 },
      { label: "Per år", value: hourlyRate * annualHours },
    ];
  }, [hourlyRate, weeklyHours]);

  return (
    <div className="rounded-[5px] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Arbeidstakergruppe
          <select
            className="h-11 rounded-[5px] border border-slate-300 bg-white px-3 font-normal text-slate-950 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-green-800/15"
            onChange={(event) => setCategory(event.target.value as "skilled" | "other")}
            value={category}
          >
            <option value="skilled">Faglært som utfører fagarbeid</option>
            <option value="other">Andre arbeidstakere</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-800">
          Timer per uke
          <select
            className="h-11 rounded-[5px] border border-slate-300 bg-white px-3 font-normal text-slate-950 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-green-800/15"
            onChange={(event) => setWeeklyHours(Number(event.target.value))}
            value={weeklyHours}
          >
            {weeklyHourOptions.map((hours) => (
              <option key={hours} value={hours}>
                {formatNumber(hours, 1)} timer
              </option>
            ))}
          </select>
        </label>
      </div>

      <dl className="mt-6 grid gap-px overflow-hidden rounded-[5px] border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-5">
        {values.map((item) => (
          <div className="bg-[#fbfbf8] px-4 py-4" key={item.label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              {item.label}
            </dt>
            <dd className="mt-1.5 text-lg font-bold tabular-nums text-slate-950">
              {formatCurrency(item.value)}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        Dette er en matematisk omregning av minstelønnen, ikke faktisk gjennomsnittslønn.
        Måned er beregnet som uketimer × 52 ÷ 12. Overtid, tillegg, ferie, fravær og andre
        forhold kan påvirke faktisk lønn.
      </p>
    </div>
  );
}

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString("nb-NO")} kr`;
}

function formatNumber(value: number, maximumFractionDigits: number) {
  return value.toLocaleString("nb-NO", { maximumFractionDigits });
}
