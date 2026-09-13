"use client";

import { useState } from "react";
import tariff from "@/content/blog/data/elektriker-tariff-2026.json";

const steps = tariff.steps.map((step) => ({
  ...step,
  hourly: tariff.baseHourlyRate * (1 + step.percent / 100),
  monthly: tariff.baseHourlyRate * (1 + step.percent / 100) * tariff.monthlyHours,
}));

function currency(value: number, decimals = 0) {
  return `${value.toLocaleString("nb-NO", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} kr`;
}

export function ElectricianSeniorityChart() {
  const [selectedYears, setSelectedYears] = useState(0);
  const selected = steps.find((step) => step.years === selectedYears) ?? steps[0];

  return (
    <section className="my-8 rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)] sm:p-6" aria-label="Elektrikerlønn etter ansiennitet">
      <h3 className="text-xl font-bold tracking-[-0.025em] text-slate-950">Lønnsutvikling etter ansiennitet</h3>
      <p className="mt-1 text-sm text-slate-500">LOK 2026 · Grunnsats med fagarbeidertillegg · Omregnet månedslønn</p>
      <div className="mt-4 sm:hidden"><StepChart selectedYears={selectedYears} compact /></div>
      <div className="mt-4 hidden sm:block"><StepChart selectedYears={selectedYears} /></div>
      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium text-slate-700">Velg ansiennitet som fagarbeider</legend>
        <div className="flex flex-wrap gap-2">
          {steps.map((step) => (
            <button
              key={step.years}
              type="button"
              aria-pressed={step.years === selectedYears}
              onClick={() => setSelectedYears(step.years)}
              className={`min-h-11 rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${step.years === selectedYears ? "border-[#e95d0f] bg-[#e95d0f] text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
            >
              {step.years} år
            </button>
          ))}
        </div>
      </fieldset>
      <p aria-live="polite" aria-atomic="true" className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        Fra {selected.years} år: {selected.percent} % fagarbeidertillegg · {currency(selected.hourly, 2)} per time · ca. {currency(selected.monthly)} per måned.
      </p>
      <p className="mt-3 text-xs leading-5 text-slate-500">Satser fra 1. mai 2026, før skatt og andre tillegg. Månedslønn er beregnet med 162,5 timer. Y-aksen starter på 46 000 kr. Kilde: <a className="underline underline-offset-2" href={tariff.sourceUrl}>Landsoverenskomsten § 3 A og C</a>.</p>
    </section>
  );
}

function StepChart({ selectedYears, compact = false }: { selectedYears: number; compact?: boolean }) {
  const width = compact ? 350 : 1000;
  const height = compact ? 280 : 340;
  const margin = { top: 40, right: compact ? 30 : 65, bottom: 66, left: compact ? 50 : 76 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (year: number) => margin.left + year / 17 * plotWidth;
  const y = (salary: number) => margin.top + (50000 - salary) / 4000 * plotHeight;
  const selected = steps.find((step) => step.years === selectedYears) ?? steps[0];
  const path = steps.map((step, index) => `${index === 0 ? "M" : "H"} ${x(step.years)} ${index === 0 ? "" : "V"} ${y(step.monthly)}`).join(" ");

  return (
    <svg className="h-auto w-full" viewBox={`0 0 ${width} ${height}`} role="img">
      <title>{`Omregnet månedslønn etter ansiennitet: ${steps.map((step) => `${step.years} år: ${currency(step.monthly)}, ${step.percent} prosent tillegg`).join("; ")}`}</title>
      {[46000, 47000, 48000, 49000, 50000].map((tick) => (
        <g key={tick}>
          <line x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} stroke="#d7dde0" strokeDasharray="3 4" />
          <text x={margin.left - 9} y={y(tick) + 4} textAnchor="end" fill="#64748b" fontSize={compact ? 10 : 14}>{tick / 1000} 000</text>
        </g>
      ))}
      <line x1={margin.left} x2={width - margin.right} y1={y(46000)} y2={y(46000)} stroke="#b8c0c5" />
      <line x1={x(selectedYears)} x2={x(selectedYears)} y1={y(selected.monthly)} y2={y(46000)} stroke="#9aa5aa" />
      <path d={path} fill="none" stroke="#14532d" strokeLinejoin="round" strokeWidth="3" />
      {steps.map((step, index) => {
        const active = step.years === selectedYears;
        const showValue = !compact || active;
        return (
          <g key={step.years}>
            {showValue ? <text x={x(step.years)} y={y(step.monthly) - 16} textAnchor={compact && index === 0 ? "start" : compact && index === steps.length - 1 ? "end" : "middle"} fill={active ? "#14532d" : "#111827"} fontSize={compact ? 11 : 15} fontWeight={active ? 700 : 500}>{currency(step.monthly)}</text> : null}
            <circle cx={x(step.years)} cy={y(step.monthly)} r={active ? 7 : 4} fill={active ? "#e95d0f" : "white"} stroke={active ? "#e95d0f" : "#14532d"} strokeWidth="3" />
            <text x={x(step.years)} y={height - margin.bottom + 22} textAnchor="middle" fill="#374151" fontSize={compact ? 10 : 14}>{step.years}{compact ? "" : " år"}</text>
            {active ? <g transform={`translate(${x(step.years) - 21} ${height - margin.bottom + 30})`}><rect width="42" height="18" rx="4" fill="#e95d0f" /><text x="21" y="13" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">VALGT</text></g> : null}
          </g>
        );
      })}
      <text x={margin.left + plotWidth / 2} y={height - 2} textAnchor="middle" fill="#475569" fontSize={compact ? 11 : 14}>Ansiennitet i år</text>
    </svg>
  );
}
