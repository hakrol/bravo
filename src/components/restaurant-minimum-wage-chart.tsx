"use client";

import { useMemo, useState } from "react";

type ChartPoint = { effectiveFrom: string; adultRate: number };
type Unit = "time" | "måned" | "år";

const width = 920;
const height = 320;
const plot = { left: 88, right: 138, top: 20, bottom: 52 };
const units: { value: Unit; label: string; factor: number }[] = [
  { value: "time", label: "Time", factor: 1 },
  { value: "måned", label: "Måned", factor: (37.5 * 52) / 12 },
  { value: "år", label: "År", factor: 37.5 * 52 },
];

export function RestaurantMinimumWageChart({ points, today }: { points: ChartPoint[]; today: string }) {
  const [unit, setUnit] = useState<Unit>("time");
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const selected = units.find((item) => item.value === unit) ?? units[0];
  const model = useMemo(() => makeChartModel(points, today, selected.factor, unit), [points, selected.factor, today, unit]);
  const active = points.find((point) => point.effectiveFrom === activeDate);
  const latest = points.at(-1);

  if (!model || !latest) return null;

  return (
    <figure className="rounded-[11px] border border-[#dde4ee] bg-white px-5 pb-5 pt-6 shadow-[0_10px_35px_rgba(19,37,64,0.04)] sm:px-7 sm:pb-7 sm:pt-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#19243b] sm:text-[2.1rem] sm:leading-[1.1]">Utvikling i minstelønn i restaurant</h2>
          <p className="mt-2 text-[1.03rem] leading-[1.8] text-[#52627d] sm:text-lg sm:leading-[1.95]">Lovpålagt voksensats per {unit}, fra ordningen startet i 2018.</p>
        </div>
        <div aria-label="Vis sats per" className="inline-flex rounded-full border border-[#dde4ee] bg-white p-1 shadow-sm" role="group">
          {units.map((item) => <button aria-pressed={unit === item.value} className={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15533d] ${unit === item.value ? "bg-[#15533d] text-white" : "text-[#34415a] hover:bg-slate-100"}`} key={item.value} onClick={() => { setUnit(item.value); setActiveDate(null); }} type="button">{item.label}</button>)}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg aria-label={`Trappegraf for lovpålagt voksensats i restaurant fra 1. januar 2018 til ${formatDate(today)}. Satsen har økt fra ${formatValue(points[0].adultRate * selected.factor, unit)} til ${formatValue(latest.adultRate * selected.factor, unit)} per ${unit}.`} className="w-full min-w-[680px]" role="img" viewBox={`0 0 ${width} ${height}`}>
          <title>Historisk utvikling i lovpålagt minstelønn i restaurant</title>
          <desc>Grafen viser satsen som en trappelinje med endring på datoen hver ny forskrift trådte i kraft.</desc>
          {model.ticks.map((tick) => { const y = model.y(tick); return <g key={tick}><line stroke="#e3e9f2" x1={plot.left} x2={width - plot.right} y1={y} y2={y} /><text fill="#52627d" fontSize="13" textAnchor="end" x={plot.left - 12} y={y + 5}>{formatAxis(tick)}</text></g>; })}
          {model.years.map((year) => { const x = model.x(`${year}-01-01`); return <g key={year}><line stroke="#edf0f5" x1={x} x2={x} y1={plot.top} y2={height - plot.bottom} /><text fill="#52627d" fontSize="13" textAnchor="middle" x={x} y={height - 17}>{year}</text></g>; })}
          <path d={model.path} fill="none" stroke="#15533d" strokeLinejoin="round" strokeWidth="3" />
          {points.map((point) => <g key={point.effectiveFrom}>
            <circle cx={model.x(point.effectiveFrom)} cy={model.y(point.adultRate * selected.factor)} fill="#15533d" r="4.5" />
            <circle aria-label={`${formatDate(point.effectiveFrom)}: ${formatValue(point.adultRate * selected.factor, unit)} per ${unit}`} cx={model.x(point.effectiveFrom)} cy={model.y(point.adultRate * selected.factor)} fill="transparent" onBlur={() => setActiveDate(null)} onClick={() => setActiveDate(point.effectiveFrom)} onFocus={() => setActiveDate(point.effectiveFrom)} onMouseEnter={() => setActiveDate(point.effectiveFrom)} onMouseLeave={() => setActiveDate(null)} r="18" role="button" style={{ cursor: "pointer", touchAction: "manipulation" }} tabIndex={0} />
          </g>)}
          <text fill="#19243b" fontSize="15" fontWeight="700" x={width - plot.right + 13} y={model.y(latest.adultRate * selected.factor) + 5}>{formatValue(latest.adultRate * selected.factor, unit)}</text>
          {active && <ChartTooltip factor={selected.factor} model={model} point={active} unit={unit} />}
        </svg>
      </div>
      <div className="mt-1 flex items-center justify-center gap-2 text-sm text-[#52627d]"><span className="size-3.5 rounded-full bg-[#15533d]" />Lovpålagt voksensats</div>
      <figcaption className="mt-4 text-center text-xs leading-5 text-slate-500">Trappelinjen følger de faktiske ikrafttredelsesdatoene. I 2017 fantes det ingen allmenngjort minstelønn for bransjen.{unit !== "time" ? " Måned og år er omregnet med 37,5 timer per uke, ikke egne lovpålagte satser." : ""} Foreslått 2026-sats er ikke inkludert.</figcaption>
    </figure>
  );
}

function makeChartModel(points: ChartPoint[], today: string, factor: number, unit: Unit) {
  if (points.length === 0) return null;
  const start = Date.parse(`${points[0].effectiveFrom}T00:00:00Z`);
  const end = Date.parse(`${today}T00:00:00Z`);
  const x = (date: string) => plot.left + ((Date.parse(`${date}T00:00:00Z`) - start) / (end - start)) * (width - plot.left - plot.right);
  const values = points.map((point) => point.adultRate * factor);
  const step = unit === "time" ? 20 : unit === "måned" ? 5000 : 50000;
  const minimum = Math.max(0, Math.floor(Math.min(...values) / step) * step - step);
  const maximum = Math.ceil(Math.max(...values) / step) * step + step;
  const y = (value: number) => plot.top + (height - plot.top - plot.bottom) * (1 - (value - minimum) / (maximum - minimum));
  const commands = [`M ${x(points[0].effectiveFrom)} ${y(points[0].adultRate * factor)}`];
  points.slice(1).forEach((point) => commands.push(`H ${x(point.effectiveFrom)} V ${y(point.adultRate * factor)}`));
  commands.push(`H ${x(today)}`);
  const firstYear = Number(points[0].effectiveFrom.slice(0, 4));
  const lastYear = Number(today.slice(0, 4));
  const ticks = Array.from({ length: Math.round((maximum - minimum) / step) + 1 }, (_, index) => minimum + index * step);
  return { x, y, path: commands.join(" "), ticks, years: Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index) };
}

function ChartTooltip({ factor, model, point, unit }: { factor: number; model: NonNullable<ReturnType<typeof makeChartModel>>; point: ChartPoint; unit: Unit }) {
  const x = model.x(point.effectiveFrom);
  const value = point.adultRate * factor;
  const y = model.y(value);
  const boxWidth = 214;
  const boxHeight = 60;
  const boxX = Math.min(Math.max(x - boxWidth / 2, plot.left), width - plot.right - boxWidth);
  const boxY = Math.max(plot.top + 4, y - boxHeight - 14);
  return <g pointerEvents="none"><rect fill="#19243b" height={boxHeight} rx="8" width={boxWidth} x={boxX} y={boxY} /><path d={`M ${x - 6} ${boxY + boxHeight} L ${x} ${boxY + boxHeight + 7} L ${x + 6} ${boxY + boxHeight} Z`} fill="#19243b" /><text fill="#cfe5d8" fontSize="12" x={boxX + 12} y={boxY + 21}>Gjeldende fra {formatDate(point.effectiveFrom)}</text><text fill="white" fontSize="16" fontWeight="700" x={boxX + 12} y={boxY + 45}>{formatValue(value, unit)} / {unit}</text></g>;
}

function formatAxis(value: number) { return value.toLocaleString("nb-NO", { maximumFractionDigits: 0 }); }
function formatValue(value: number, unit: Unit) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: unit === "time" ? 2 : 0, maximumFractionDigits: unit === "time" ? 2 : 0 })} kr`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
