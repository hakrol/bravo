"use client";

import { useMemo, useState } from "react";
import {
  formatMinimumWageChartYear,
  getMinimumWageChartYearTicks,
  type MinimumWageChartLayout,
  useMinimumWageChartLayout,
} from "@/components/minimum-wage-chart-mobile";

type ChartPoint = { effectiveFrom: string; skilledRate: number; otherRate: number };
type Unit = "time" | "måned" | "år";
type ActivePoint = { effectiveFrom: string; series: "skilled" | "other" };

const units: { value: Unit; label: string; factor: number }[] = [
  { value: "time", label: "Time", factor: 1 },
  { value: "måned", label: "Måned", factor: (37.5 * 52) / 12 },
  { value: "år", label: "År", factor: 37.5 * 52 },
];

export function ElectricianMinimumWageChart({ points, today }: { points: ChartPoint[]; today: string }) {
  const [unit, setUnit] = useState<Unit>("time");
  const [activePoint, setActivePoint] = useState<ActivePoint | null>(null);
  const selected = units.find((item) => item.value === unit) ?? units[0];
  const layout = useMinimumWageChartLayout(300);
  const model = useMemo(() => makeChartModel(points, today, selected.factor, unit, layout), [layout, points, selected.factor, today, unit]);
  const active = points.find((point) => point.effectiveFrom === activePoint?.effectiveFrom);
  const latest = points.at(-1);

  if (!model || !latest) return null;

  return (
    <figure className="rounded-[11px] border border-[#dde4ee] bg-white px-5 pb-5 pt-6 shadow-[0_10px_35px_rgba(19,37,64,0.04)] sm:px-7 sm:pb-7 sm:pt-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#19243b] sm:text-[2.1rem] sm:leading-[1.1]">Utvikling i minstelønn for elektrikere</h2>
          <p className="mt-2 text-[1.03rem] leading-[1.8] text-[#52627d] sm:text-lg sm:leading-[1.95]">Minstelønn per {unit}. Faglærte og andre arbeidstakere, fra ordningen startet i {points[0].effectiveFrom.slice(0, 4)}.</p>
        </div>
        <div aria-label="Vis sats per" className="inline-flex rounded-full border border-[#dde4ee] bg-white p-1 shadow-sm" role="group">
          {units.map((item) => <button aria-pressed={unit === item.value} className={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15533d] ${unit === item.value ? "bg-[#15533d] text-white" : "text-[#34415a] hover:bg-slate-100"}`} key={item.value} onClick={() => { setUnit(item.value); setActivePoint(null); }} type="button">{item.label}</button>)}
        </div>
      </div>

      <div className="mt-6 overflow-hidden sm:overflow-x-auto">
        <svg aria-label={`Trappegraf for lovpålagt minstelønn for elektrikere fra ${formatDate(points[0].effectiveFrom)} til ${formatDate(today)}. Mørkegrønn linje viser satsen for faglærte. Lys grønn linje viser satsen for andre arbeidstakere.`} className="block w-full" role="img" viewBox={`0 0 ${layout.width} ${layout.height}`}>
          <title>Historisk utvikling i lovpålagt minstelønn for elektrikere</title>
          <desc>Grafen viser satsene som trappelinjer med endring på datoen hver nye sats trådte i kraft.</desc>
          {model.ticks.map((tick) => { const y = model.y(tick); return <g key={tick}><line stroke="#e3e9f2" x1={layout.plot.left} x2={layout.width - layout.plot.right} y1={y} y2={y} /><text fill="#52627d" fontSize={layout.isMobile ? "11" : "13"} textAnchor="end" x={layout.plot.left - 10} y={y + 4}>{formatAxis(tick)}</text></g>; })}
          {getMinimumWageChartYearTicks(model.years, layout.isMobile).map((year) => { const x = model.x(`${year}-01-01`); return <g key={year}><line stroke="#e9edf4" x1={x} x2={x} y1={layout.plot.top} y2={layout.height - layout.plot.bottom} /><text fill="#52627d" fontSize={layout.isMobile ? "11" : "13"} textAnchor="middle" x={x} y={layout.height - 17}>{formatMinimumWageChartYear(year, layout.isMobile)}</text></g>; })}
          <path d={model.skilledPath} fill="none" stroke="#15533d" strokeWidth="2.5" />
          <path d={model.otherPath} fill="none" stroke="#93b4a5" strokeWidth="2.5" />
          {points.map((point) => <g key={`dots-${point.effectiveFrom}`}>
            <circle cx={model.x(point.effectiveFrom)} cy={model.y(point.skilledRate * selected.factor)} fill="#15533d" r="4.5" />
            <circle cx={model.x(point.effectiveFrom)} cy={model.y(point.otherRate * selected.factor)} fill="#93b4a5" r="4.5" />
            <ChartHitPoint label={`Faglært fra ${formatDate(point.effectiveFrom)}: ${formatValue(point.skilledRate * selected.factor, unit)}`} onClose={() => setActivePoint(null)} onOpen={() => setActivePoint({ effectiveFrom: point.effectiveFrom, series: "skilled" })} x={model.x(point.effectiveFrom)} y={model.y(point.skilledRate * selected.factor)} />
            <ChartHitPoint label={`Andre arbeidstakere fra ${formatDate(point.effectiveFrom)}: ${formatValue(point.otherRate * selected.factor, unit)}`} onClose={() => setActivePoint(null)} onOpen={() => setActivePoint({ effectiveFrom: point.effectiveFrom, series: "other" })} x={model.x(point.effectiveFrom)} y={model.y(point.otherRate * selected.factor)} />
          </g>)}
          <text fill="#19243b" fontSize={layout.isMobile ? "11" : "15"} x={layout.width - layout.plot.right + (layout.isMobile ? 7 : 13)} y={model.y(latest.skilledRate * selected.factor) + 5}>{formatValue(latest.skilledRate * selected.factor, unit)}</text>
          <text fill="#15533d" fontSize={layout.isMobile ? "11" : "15"} x={layout.width - layout.plot.right + (layout.isMobile ? 7 : 13)} y={model.y(latest.otherRate * selected.factor) + 5}>{formatValue(latest.otherRate * selected.factor, unit)}</text>
          {active && activePoint && <ChartTooltip factor={selected.factor} layout={layout} model={model} point={active} series={activePoint.series} unit={unit} />}
        </svg>
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-[#52627d]"><span className="inline-flex items-center gap-2"><span className="size-3.5 rounded-full bg-[#15533d]" />Faglært</span><span className="inline-flex items-center gap-2"><span className="size-3.5 rounded-full bg-[#93b4a5]" />Andre arbeidstakere</span></div>
      <figcaption className="mt-4 text-center text-xs leading-5 text-slate-500">Trappelinjene følger de faktiske ikrafttredelsesdatoene.{unit !== "time" ? " Måned og år er omregnet med 37,5 timer per uke, ikke egne lovpålagte satser." : ""} Foreslått 2026-sats er ikke inkludert.</figcaption>
    </figure>
  );
}

function makeChartModel(points: ChartPoint[], today: string, factor: number, unit: Unit, layout: MinimumWageChartLayout) {
  if (points.length === 0) return null;
  const { height, plot, width } = layout;
  const start = Date.parse(`${points[0].effectiveFrom}T00:00:00Z`);
  const end = Date.parse(`${today}T00:00:00Z`);
  const x = (date: string) => plot.left + ((Date.parse(`${date}T00:00:00Z`) - start) / Math.max(end - start, 1)) * (width - plot.left - plot.right);
  const values = points.flatMap((point) => [point.skilledRate * factor, point.otherRate * factor]);
  const step = unit === "time" ? 20 : unit === "måned" ? 5000 : 50000;
  const minimum = Math.max(0, Math.floor(Math.min(...values) / step) * step - step);
  const maximum = Math.ceil(Math.max(...values) / step) * step + step;
  const y = (value: number) => plot.top + (height - plot.top - plot.bottom) * (1 - (value - minimum) / (maximum - minimum));
  const path = (key: "skilledRate" | "otherRate") => {
    const commands = [`M ${x(points[0].effectiveFrom)} ${y(points[0][key] * factor)}`];
    points.slice(1).forEach((point) => commands.push(`H ${x(point.effectiveFrom)} V ${y(point[key] * factor)}`));
    commands.push(`H ${x(today)}`);
    return commands.join(" ");
  };
  const firstYear = Number(points[0].effectiveFrom.slice(0, 4));
  const lastYear = Number(today.slice(0, 4));
  const ticks = Array.from({ length: Math.round((maximum - minimum) / step) + 1 }, (_, index) => minimum + index * step);
  return { x, y, skilledPath: path("skilledRate"), otherPath: path("otherRate"), ticks, years: Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index) };
}

function ChartHitPoint({ label, onClose, onOpen, x, y }: { label: string; onClose: () => void; onOpen: () => void; x: number; y: number }) {
  return <circle aria-label={label} cx={x} cy={y} fill="transparent" onBlur={onClose} onClick={onOpen} onFocus={onOpen} onMouseEnter={onOpen} onMouseLeave={onClose} r="18" role="button" style={{ cursor: "pointer", touchAction: "manipulation" }} tabIndex={0} />;
}

function ChartTooltip({ factor, layout, model, point, series, unit }: { factor: number; layout: MinimumWageChartLayout; model: NonNullable<ReturnType<typeof makeChartModel>>; point: ChartPoint; series: ActivePoint["series"]; unit: Unit }) {
  const { plot, width } = layout;
  const x = model.x(point.effectiveFrom);
  const value = (series === "skilled" ? point.skilledRate : point.otherRate) * factor;
  const y = model.y(value);
  const boxWidth = 210;
  const boxHeight = 58;
  const boxX = Math.min(Math.max(x - boxWidth / 2, plot.left), width - plot.right - boxWidth);
  const boxY = Math.max(plot.top + 4, y - boxHeight - 14);
  return <g pointerEvents="none"><rect fill="#19243b" height={boxHeight} rx="8" width={boxWidth} x={boxX} y={boxY} /><path d={`M ${x - 6} ${boxY + boxHeight} L ${x} ${boxY + boxHeight + 7} L ${x + 6} ${boxY + boxHeight} Z`} fill="#19243b" /><text fill="#cfe5d8" fontSize="12" x={boxX + 12} y={boxY + 21}>{series === "skilled" ? "Faglært" : "Andre arbeidstakere"} · {formatDate(point.effectiveFrom)}</text><text fill="white" fontSize="16" fontWeight="700" x={boxX + 12} y={boxY + 44}>{formatValue(value, unit)} / {unit}</text></g>;
}

function formatAxis(value: number) { return value.toLocaleString("nb-NO", { maximumFractionDigits: 0 }); }
function formatValue(value: number, unit: Unit) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: unit === "time" ? 2 : 0, maximumFractionDigits: unit === "time" ? 2 : 0 })} kr`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
