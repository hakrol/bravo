"use client";

import { useMemo, useState } from "react";
import { formatMinimumWageChartYear, getMinimumWageChartYearTicks, type MinimumWageChartLayout, useMinimumWageChartLayout } from "@/components/minimum-wage-chart-mobile";

type Point = { effectiveFrom: string; seasonalUnder18Rate: number; seasonalAdultUpTo12WeeksRate: number; seasonalAdultOver12WeeksRate: number; permanentUnder18Rate: number; permanentUnskilledRate: number; skilledSupplement: number };
type SeriesKey = Exclude<keyof Point, "effectiveFrom">;

const series: readonly { key: SeriesKey; label: string; shortLabel: string }[] = [
  { key: "permanentUnskilledRate", label: "Fast ansatt, ufaglært", shortLabel: "Fast ufaglært" },
  { key: "seasonalAdultUpTo12WeeksRate", label: "Sesongarbeider over 18 år, inntil 12 uker", shortLabel: "Sesong 0–12 uker" },
  { key: "seasonalAdultOver12WeeksRate", label: "Sesongarbeider over 18 år, 12 uker–6 måneder", shortLabel: "Sesong 12 uker–6 md." },
  { key: "seasonalUnder18Rate", label: "Sesongarbeider under 18 år", shortLabel: "Sesong under 18" },
  { key: "permanentUnder18Rate", label: "Fast ansatt under 18 år", shortLabel: "Fast under 18" },
  { key: "skilledSupplement", label: "Fagarbeidertillegg", shortLabel: "Fagtillegg" },
] as const;

export function AgricultureMinimumWageChart({ points, today }: { points: Point[]; today: string }) {
  const [seriesKey, setSeriesKey] = useState<SeriesKey>("permanentUnskilledRate");
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const layout = useMinimumWageChartLayout(330);
  const model = useMemo(() => makeModel(points, today, seriesKey, layout), [layout, points, seriesKey, today]);
  const selected = series.find((item) => item.key === seriesKey) ?? series[0];
  const latest = points.at(-1);
  const active = points.find((point) => point.effectiveFrom === activeDate);
  if (!model || !latest) return null;

  return <figure className="rounded-[11px] border border-[#dde4ee] bg-white px-5 pb-5 pt-6 shadow-[0_10px_35px_rgba(19,37,64,0.04)] sm:px-7 sm:pb-7 sm:pt-7">
    <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#19243b] sm:text-[2.1rem]">Utvikling i minstelønn</h2>
    <p className="mt-2 text-[1.03rem] leading-[1.8] text-[#52627d] sm:text-lg">Lovpålagt sats per time etter faktisk ikrafttredelsesdato.</p>
    <div aria-label="Velg arbeidstakerkategori" className="mt-5 flex flex-wrap gap-2" role="group">
      {series.map((item) => <button aria-pressed={seriesKey === item.key} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${seriesKey === item.key ? "border-[#15533d] bg-[#e8f4eb] text-[#15533d]" : "border-slate-200 bg-white text-slate-600 hover:border-[#93b4a5]"}`} key={item.key} onClick={() => { setSeriesKey(item.key); setActiveDate(null); }} type="button">{item.shortLabel}</button>)}
    </div>
    <div className="mt-6 overflow-hidden sm:overflow-x-auto">
      <svg aria-label={`Stegdiagram for ${selected.label.toLowerCase()}.`} className="block w-full" role="img" viewBox={`0 0 ${layout.width} ${layout.height}`}>
        <title>Historisk utvikling i lovpålagt minstelønn i jordbruk og gartneri</title>
        <desc>Steglinjen endres på datoen en ny lovpålagt sats trådte i kraft.</desc>
        {model.ticks.map((tick) => { const y = model.y(tick); return <g key={tick}><line stroke="#e3e9f2" x1={layout.plot.left} x2={layout.width - layout.plot.right} y1={y} y2={y} /><text fill="#52627d" fontSize={layout.isMobile ? "11" : "13"} textAnchor="end" x={layout.plot.left - 9} y={y + 4}>{tick}</text></g>; })}
        {getMinimumWageChartYearTicks(model.years, layout.isMobile).map((year) => { const x = model.x(`${year}-01-01`); return <g key={year}><line stroke="#edf0f5" x1={x} x2={x} y1={layout.plot.top} y2={layout.height - layout.plot.bottom} /><text fill="#52627d" fontSize={layout.isMobile ? "11" : "13"} textAnchor="middle" x={x} y={layout.height - 17}>{formatMinimumWageChartYear(year, layout.isMobile)}</text></g>; })}
        <path d={model.path} fill="none" stroke="#15533d" strokeLinejoin="round" strokeWidth="3" />
        {points.map((point) => <g key={point.effectiveFrom}><circle cx={model.x(point.effectiveFrom)} cy={model.y(point[seriesKey])} fill="#15533d" r="4.5" /><circle aria-label={`${formatDate(point.effectiveFrom)}: ${formatRate(point[seriesKey])}`} cx={model.x(point.effectiveFrom)} cy={model.y(point[seriesKey])} fill="transparent" onBlur={() => setActiveDate(null)} onClick={() => setActiveDate(point.effectiveFrom)} onFocus={() => setActiveDate(point.effectiveFrom)} onMouseEnter={() => setActiveDate(point.effectiveFrom)} onMouseLeave={() => setActiveDate(null)} r="18" role="button" tabIndex={0} /></g>)}
        <text fill="#19243b" fontSize={layout.isMobile ? "11" : "15"} fontWeight="700" x={layout.width - layout.plot.right + (layout.isMobile ? 7 : 13)} y={model.y(latest[seriesKey]) + 5}>{formatRate(latest[seriesKey])}</text>
        {active ? <Tooltip layout={layout} model={model} point={active} seriesKey={seriesKey} /> : null}
      </svg>
    </div>
    <div className="mt-1 flex items-center justify-center gap-2 text-sm text-[#52627d]"><span className="size-3.5 rounded-full bg-[#15533d]" />{selected.label}</div>
    <figcaption className="mt-4 text-center text-xs leading-5 text-slate-500">Diagrammet viser vedtatte, allmenngjorte satser. Tariffoppgjøret i 2026 er ikke lagt inn som lovpålagt minstelønn.</figcaption>
  </figure>;
}

function makeModel(points: Point[], today: string, key: SeriesKey, layout: MinimumWageChartLayout) {
  if (!points.length) return null;
  const start = Date.parse(`${points[0].effectiveFrom}T00:00:00Z`); const end = Date.parse(`${today}T00:00:00Z`);
  const x = (date: string) => layout.plot.left + ((Date.parse(`${date}T00:00:00Z`) - start) / (end - start)) * (layout.width - layout.plot.left - layout.plot.right);
  const values = points.map((point) => point[key]);
  const step = key === "skilledSupplement" ? 2 : 20;
  const minimum = Math.max(0, Math.floor(Math.min(...values) / step) * step - step);
  const maximum = Math.ceil(Math.max(...values) / step) * step + step;
  const y = (value: number) => layout.plot.top + (layout.height - layout.plot.top - layout.plot.bottom) * (1 - (value - minimum) / (maximum - minimum));
  const commands = [`M ${x(points[0].effectiveFrom)} ${y(points[0][key])}`];
  points.slice(1).forEach((point) => commands.push(`H ${x(point.effectiveFrom)} V ${y(point[key])}`)); commands.push(`H ${x(today)}`);
  return { x, y, path: commands.join(" "), ticks: Array.from({ length: Math.round((maximum - minimum) / step) + 1 }, (_, index) => minimum + index * step), years: Array.from({ length: Number(today.slice(0, 4)) - Number(points[0].effectiveFrom.slice(0, 4)) + 1 }, (_, index) => Number(points[0].effectiveFrom.slice(0, 4)) + index) };
}

function Tooltip({ layout, model, point, seriesKey }: { layout: MinimumWageChartLayout; model: NonNullable<ReturnType<typeof makeModel>>; point: Point; seriesKey: SeriesKey }) {
  const x = model.x(point.effectiveFrom); const y = model.y(point[seriesKey]); const width = 210;
  const boxX = Math.min(Math.max(x - width / 2, layout.plot.left), layout.width - layout.plot.right - width); const boxY = Math.max(layout.plot.top + 4, y - 74);
  return <g pointerEvents="none"><rect fill="#19243b" height="60" rx="8" width={width} x={boxX} y={boxY} /><text fill="#cfe5d8" fontSize="12" x={boxX + 12} y={boxY + 21}>Fra {formatDate(point.effectiveFrom)}</text><text fill="white" fontSize="16" fontWeight="700" x={boxX + 12} y={boxY + 45}>{formatRate(point[seriesKey])} / time</text></g>;
}

function formatRate(value: number) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
