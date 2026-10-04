"use client";

import { useId, useState } from "react";
import { formatMinimumWageChartYear, getMinimumWageChartYearTicks, useMinimumWageChartLayout } from "@/components/minimum-wage-chart-mobile";
import { formatFreightRate, type FreightMinimumWagePoint } from "@/lib/freight-minimum-wage";

export function FreightMinimumWageChart({ points, endDate, scopeEventDate }: { points: FreightMinimumWagePoint[]; endDate: string; scopeEventDate: string }) {
  const layout = useMinimumWageChartLayout(340);
  const id = useId();
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const startDate = "2016-01-01";
  const baseline = points.filter((point) => point.effectiveFrom <= startDate).at(-1);
  const visible = points.filter((point) => point.effectiveFrom > startDate && point.effectiveFrom <= endDate);
  const latest = points.filter((point) => point.effectiveFrom <= endDate).at(-1);
  if (!baseline || !latest) return null;
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  const { width, height, plot } = layout;
  const x = (date: string) => plot.left + (Date.parse(`${date}T00:00:00Z`) - start) / (end - start) * (width - plot.left - plot.right);
  const y = (rate: number) => plot.top + 30 + (height - plot.top - plot.bottom - 30) * (1 - (rate - 140) / 100);
  const path = [`M ${x(startDate)} ${y(baseline.hourlyRate)}`, ...visible.map((point) => `H ${x(point.effectiveFrom)} V ${y(point.hourlyRate)}`), `H ${x(endDate)}`].join(" ");
  const active = points.find((point) => point.effectiveFrom === activeDate);
  const years = Array.from({ length: Number(endDate.slice(0, 4)) - 2016 + 1 }, (_, index) => 2016 + index);
  const increase = latest.hourlyRate - baseline.hourlyRate;
  return <figure className="rounded-[11px] border border-[#dde4ee] bg-white px-5 pb-5 pt-6 shadow-[0_10px_35px_rgba(19,37,64,0.04)] sm:p-7">
    <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#19243b] sm:text-[2.1rem]">Utvikling i minstelønn for godstransport</h2>
    <p className="mt-2 text-[1.03rem] leading-[1.8] text-[#52627d]">Lovpålagt timelønn fra 2016 til 2026. Den foreslåtte satsen er ikke tatt med.</p>
    <svg aria-labelledby={`${id}-title ${id}-desc`} className="mt-5 block w-full" role="img" viewBox={`0 0 ${width} ${height}`}>
      <title id={`${id}-title`}>Lovpålagt minstelønn: 158,32 til 229,00 kroner per time</title>
      <desc id={`${id}-desc`}>Trappelinjen viser faktiske satsendringer. En egen markør viser utvidelsen til kjøretøy over 2,5 tonn 1. juni 2025. Historikktabellen viser alle periodene.</desc>
      {[140, 160, 180, 200, 220, 240].map((rate) => <g key={rate}><line stroke="#e3e9f2" x1={plot.left} x2={width - plot.right} y1={y(rate)} y2={y(rate)} /><text fill="#52627d" fontSize={layout.isMobile ? 11 : 13} textAnchor="end" x={plot.left - 10} y={y(rate) + 4}>{rate}</text></g>)}
      {getMinimumWageChartYearTicks(years, layout.isMobile).map((year) => <text fill="#52627d" fontSize={layout.isMobile ? 11 : 13} key={year} textAnchor="middle" x={x(`${year}-01-01`)} y={height - 18}>{formatMinimumWageChartYear(year, layout.isMobile)}</text>)}
      <line stroke="#b45309" strokeDasharray="5 4" x1={x(scopeEventDate)} x2={x(scopeEventDate)} y1={plot.top + 10} y2={height - plot.bottom} />
      <text fill="#92400e" fontSize={layout.isMobile ? 10 : 12} textAnchor="end" x={x(scopeEventDate) - 6} y={plot.top + 9}>Varebiler fra 01.06.2025</text>
      <path d={path} fill="none" stroke="#15533d" strokeLinejoin="round" strokeWidth="3" />
      {[baseline, ...visible].map((point) => <g key={point.effectiveFrom}><circle cx={x(point === baseline ? startDate : point.effectiveFrom)} cy={y(point.hourlyRate)} fill="#15533d" r="4.5" /><circle aria-label={`Fra ${point.effectiveFrom}: ${formatFreightRate(point.hourlyRate)} per time`} cx={x(point === baseline ? startDate : point.effectiveFrom)} cy={y(point.hourlyRate)} fill="transparent" onBlur={() => setActiveDate(null)} onClick={() => setActiveDate(point.effectiveFrom)} onFocus={() => setActiveDate(point.effectiveFrom)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveDate(point.effectiveFrom); } }} onMouseEnter={() => setActiveDate(point.effectiveFrom)} onMouseLeave={() => setActiveDate(null)} r="16" role="button" tabIndex={0}><title>{point.effectiveFrom}: {formatFreightRate(point.hourlyRate)}</title></circle></g>)}
      <text fill="#19243b" fontSize={layout.isMobile ? 11 : 15} fontWeight="700" x={width - plot.right + 8} y={y(latest.hourlyRate) + 5}>{formatFreightRate(latest.hourlyRate)}</text>
    </svg>
    <p aria-live="polite" className="min-h-6 text-center text-sm font-semibold text-[#15533d]">{active ? `Fra ${new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${active.effectiveFrom}T00:00:00Z`))}: ${formatFreightRate(active.hourlyRate)} per time` : `Økning siden 2016: ${formatFreightRate(increase)} per time (${(increase / baseline.hourlyRate * 100).toLocaleString("nb-NO", { maximumFractionDigits: 1 })} % nominelt)`}</p>
    <figcaption className="mt-3 text-xs leading-5 text-slate-500">Den stiplede markøren viser at vektgrensen ble senket fra over 3,5 til over 2,5 tonn 1. juni 2025. Timesatsen var fortsatt 222,00 kr frem til 15. juni. Første sats gjaldt fra 1. juli 2015; grafen begynner i 2016.</figcaption>
  </figure>;
}
