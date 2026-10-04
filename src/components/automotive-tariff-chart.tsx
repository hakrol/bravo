"use client";

import { useId, useState } from "react";
import { automotiveCategories, formatAutomotiveRate, type AutomotiveRates, type AutomotiveTariffPoint } from "@/lib/automotive-minimum-wage";
import { useMinimumWageChartLayout } from "@/components/minimum-wage-chart-mobile";

export function AutomotiveTariffChart({ points }: { points: AutomotiveTariffPoint[] }) {
  const [category, setCategory] = useState<keyof AutomotiveRates>("newlyQualifiedSkilled");
  const id = useId();
  const layout = useMinimumWageChartLayout(320);
  const first = points[0];
  const last = points.at(-1);
  if (!first || !last) return null;
  const selected = automotiveCategories.find((item) => item.key === category)!;
  const left = 45, right = layout.width - 35, top = 25, bottom = layout.height - 40;
  const x = (year: number) => left + (year - first.year) / (last.year - first.year) * (right - left);
  const y = (rate: number) => bottom - (rate - 140) / 130 * (bottom - top);
  const path = points.map((point, index) => `${index ? "L" : "M"}${x(point.year)},${y(point[category])}`).join(" ");
  const increase = last[category] - first[category];
  return <figure className="rounded-[11px] border border-[#dde4ee] bg-white p-5 shadow-[0_10px_35px_rgba(19,37,64,0.04)] sm:p-7">
    <h3 className="text-2xl font-bold tracking-[-0.03em] text-[#19243b]">Utvikling i Biloverenskomstens minstelønn</h3>
    <p className="mt-2 text-sm leading-6 text-[#52627d]">Tariffbaserte minstesatser per time, 2016–2026.</p>
    <div aria-label="Velg arbeidstakerkategori" className="mt-5 flex flex-wrap gap-2" role="group">{automotiveCategories.map((item) => <button aria-pressed={item.key === category} className={`rounded-full border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15533d] ${item.key === category ? "border-[#15533d] bg-[#e8f4eb] text-[#15533d]" : "border-slate-200 text-slate-600"}`} key={item.key} onClick={() => setCategory(item.key)} type="button">{item.label}</button>)}</div>
    <svg aria-labelledby={`${id}-title ${id}-desc`} className="mt-6 block w-full" role="img" viewBox={`0 0 ${layout.width} ${layout.height}`}>
      <title id={`${id}-title`}>{selected.label}: tariffutvikling 2016–2026</title>
      <desc id={`${id}-desc`}>Fra {formatAutomotiveRate(first[category])} til {formatAutomotiveRate(last[category])}. Punktene viser dokumenterte avtalesatser etter år. Den fullstendige tabellen står under grafen. Dette er ikke historisk lovpålagt minstelønn.</desc>
      {[150, 175, 200, 225, 250].map((rate) => <g key={rate}><line stroke="#e3e9f2" x1={left} x2={right} y1={y(rate)} y2={y(rate)} /><text fill="#52627d" fontSize="12" textAnchor="end" x={left - 8} y={y(rate) + 4}>{rate}</text></g>)}
      {[2016, 2018, 2020, 2022, 2024, 2026].filter((_, i) => !layout.isMobile || i % 2 === 0 || i === 5).map((year) => <text fill="#52627d" fontSize="12" key={year} textAnchor="middle" x={x(year)} y={bottom + 25}>{year}</text>)}
      <path d={path} fill="none" stroke="#15533d" strokeWidth="3" />
      {points.map((point) => <circle cx={x(point.year)} cy={y(point[category])} fill="#15533d" key={point.year} r="4"><title>{point.period}: {formatAutomotiveRate(point[category])}</title></circle>)}
    </svg>
    <p aria-live="polite" className="mt-2 text-sm font-semibold text-[#15533d]">{selected.label}: +{formatAutomotiveRate(increase)} per time ({(increase / first[category] * 100).toLocaleString("nb-NO", { maximumFractionDigits: 1 })} % nominelt).</p>
    <figcaption className="mt-3 text-xs leading-5 text-slate-500">Årsaksen viser avtaleår. Linjene binder sammen dokumenterte satser og viser ikke nøyaktige endringsdatoer eller satser mellom punktene. Se datoene i tabellen.</figcaption>
  </figure>;
}
