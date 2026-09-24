"use client";

import { useMemo, useState } from "react";

type ChartPoint = { effectiveFrom: string; adultRate: number; under18Rate: number };
type Unit = "time" | "måned" | "år";
type YearPoint = ChartPoint & { year: number };
type ActivePoint = { year: number; series: "adult" | "young" };

const width = 920;
const height = 300;
const plot = { left: 88, right: 132, top: 15, bottom: 48 };
const units: { value: Unit; label: string; factor: number }[] = [
  { value: "time", label: "Time", factor: 1 },
  { value: "måned", label: "Måned", factor: (37.5 * 52) / 12 },
  { value: "år", label: "År", factor: 37.5 * 52 },
];

export function CleaningMinimumWageChart({ points, today }: { points: ChartPoint[]; today: string }) {
  const [unit, setUnit] = useState<Unit>("time");
  const [activePoint, setActivePoint] = useState<ActivePoint | null>(null);
  const selected = units.find((item) => item.value === unit) ?? units[0];
  const yearPoints = useMemo(() => getYearEndPoints(points, today), [points, today]);
  const model = useMemo(() => makeChartModel(yearPoints, selected.factor), [yearPoints, selected.factor]);
  const active = yearPoints.find((point) => point.year === activePoint?.year);
  const latest = yearPoints.at(-1);

  if (!model || !latest) return null;

  return (
    <figure className="rounded-[11px] border border-[#dde4ee] bg-white px-5 pb-5 pt-6 shadow-[0_10px_35px_rgba(19,37,64,0.04)] sm:px-7 sm:pb-7 sm:pt-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#19243b] sm:text-[2.1rem] sm:leading-[1.1]">Utvikling i minstelønn for renholdere</h2>
          <p className="mt-2 text-[1.03rem] leading-[1.8] text-[#52627d] sm:text-lg sm:leading-[1.95]">Minstelønn per {unit}. Over 18 år og under 18 år. {yearPoints[0].year}–{latest.year}.</p>
        </div>
        <div aria-label="Vis sats per" className="inline-flex rounded-full border border-[#dde4ee] bg-white p-1 shadow-sm" role="group">
          {units.map((item) => (
            <button aria-pressed={unit === item.value} className={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15533d] ${unit === item.value ? "bg-[#15533d] text-white" : "text-[#34415a] hover:bg-slate-100"}`} key={item.value} onClick={() => { setUnit(item.value); setActivePoint(null); }} type="button">{item.label}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg aria-label={`Lønnsutvikling ${yearPoints[0].year} til ${latest.year}. Mørkegrønn linje viser satsen over 18 år. Lys grønn linje viser satsen under 18 år.`} className="w-full min-w-[660px]" role="img" viewBox={`0 0 ${width} ${height}`}>
          {model.ticks.map((tick) => {
            const y = model.y(tick);
            return <g key={tick}><line stroke="#e3e9f2" x1={plot.left} x2={width - plot.right} y1={y} y2={y} /><text fill="#52627d" fontSize="13" textAnchor="end" x={plot.left - 12} y={y + 5}>{formatAxis(tick)}</text></g>;
          })}
          {yearPoints.map((point, index) => {
            const x = model.x(index);
            return <g key={`grid-${point.year}`}><line stroke="#e9edf4" x1={x} x2={x} y1={plot.top} y2={height - plot.bottom} /><text fill="#52627d" fontSize="13" textAnchor="middle" x={x} y={height - 17}>{point.year}</text></g>;
          })}
          <path d={model.adultPath} fill="none" stroke="#15533d" strokeWidth="2.5" />
          <path d={model.youngPath} fill="none" stroke="#93b4a5" strokeWidth="2.5" />
          {yearPoints.map((point, index) => <g key={`dots-${point.year}`}>
            <circle cx={model.x(index)} cy={model.y(point.adultRate * selected.factor)} fill="#15533d" r="4.5" />
            <circle cx={model.x(index)} cy={model.y(point.under18Rate * selected.factor)} fill="#93b4a5" r="4.5" />
            <ChartHitPoint label={`Over 18 år i ${point.year}: ${formatValue(point.adultRate * selected.factor, unit)}`} onClose={() => setActivePoint(null)} onOpen={() => setActivePoint({ year: point.year, series: "adult" })} x={model.x(index)} y={model.y(point.adultRate * selected.factor)} />
            <ChartHitPoint label={`Under 18 år i ${point.year}: ${formatValue(point.under18Rate * selected.factor, unit)}`} onClose={() => setActivePoint(null)} onOpen={() => setActivePoint({ year: point.year, series: "young" })} x={model.x(index)} y={model.y(point.under18Rate * selected.factor)} />
          </g>)}
          <text fill="#19243b" fontSize="15" x={width - plot.right + 13} y={model.y(latest.adultRate * selected.factor) + 5}>{formatValue(latest.adultRate * selected.factor, unit)}</text>
          <text fill="#15533d" fontSize="15" x={width - plot.right + 13} y={model.y(latest.under18Rate * selected.factor) + 5}>{formatValue(latest.under18Rate * selected.factor, unit)}</text>
          {active && activePoint && <ChartTooltip factor={selected.factor} model={model} point={active} series={activePoint.series} unit={unit} />}
        </svg>
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-[#52627d]"><span className="inline-flex items-center gap-2"><span className="size-3.5 rounded-full bg-[#15533d]" />Over 18 år</span><span className="inline-flex items-center gap-2"><span className="size-3.5 rounded-full bg-[#93b4a5]" />Under 18 år</span></div>
      <figcaption className="mt-4 text-center text-xs leading-5 text-slate-500">Punktene viser satsen ved utgangen av hvert år. Linjene illustrerer utviklingen.{unit !== "time" ? " Måned og år er omregnet med 37,5 timer per uke, ikke egne lovpålagte satser." : ""} Foreslått 2026-sats er ikke inkludert.</figcaption>
    </figure>
  );
}

function getYearEndPoints(points: ChartPoint[], today: string): YearPoint[] {
  if (points.length === 0) return [];
  const firstYear = Math.max(2016, Number(points[0].effectiveFrom.slice(0, 4)));
  const lastYear = Math.min(Number(today.slice(0, 4)), Number(points.at(-1)?.effectiveFrom.slice(0, 4)));
  return Array.from({ length: lastYear - firstYear + 1 }, (_, index) => {
    const year = firstYear + index;
    const date = year === lastYear ? today : `${year}-12-31`;
    const rate = [...points].reverse().find((point) => point.effectiveFrom <= date);
    return rate ? { ...rate, year } : null;
  }).filter((point): point is YearPoint => point !== null);
}

function makeChartModel(points: YearPoint[], factor: number) {
  if (points.length === 0) return null;
  const values = points.flatMap((point) => [point.adultRate * factor, point.under18Rate * factor]);
  const step = factor === 1 ? 50 : factor < 1000 ? 10000 : 100000;
  const max = Math.ceil(Math.max(...values) / step) * step + step;
  const x = (index: number) => plot.left + index * (width - plot.left - plot.right) / Math.max(points.length - 1, 1);
  const y = (value: number) => plot.top + (height - plot.top - plot.bottom) * (1 - value / max);
  const path = (key: "adultRate" | "under18Rate") => points.map((point, index) => `${index ? "L" : "M"} ${x(index)} ${y(point[key] * factor)}`).join(" ");
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, index) => index * step);
  return { x, y, adultPath: path("adultRate"), youngPath: path("under18Rate"), ticks, years: points.map((point) => point.year) };
}

function ChartHitPoint({ label, onClose, onOpen, x, y }: { label: string; onClose: () => void; onOpen: () => void; x: number; y: number }) {
  return <circle aria-label={label} cx={x} cy={y} fill="transparent" onBlur={onClose} onClick={onOpen} onFocus={onOpen} onMouseEnter={onOpen} onMouseLeave={onClose} r="18" role="button" style={{ cursor: "pointer", touchAction: "manipulation" }} tabIndex={0} />;
}

function ChartTooltip({ factor, model, point, series, unit }: { factor: number; model: NonNullable<ReturnType<typeof makeChartModel>>; point: YearPoint; series: ActivePoint["series"]; unit: Unit }) {
  const pointIndex = model.years.indexOf(point.year);
  const x = model.x(pointIndex);
  const value = (series === "adult" ? point.adultRate : point.under18Rate) * factor;
  const y = model.y(value);
  const boxWidth = 190;
  const boxHeight = 58;
  const boxX = Math.min(Math.max(x - boxWidth / 2, plot.left), width - plot.right - boxWidth);
  const boxY = Math.max(plot.top + 4, y - boxHeight - 14);
  return <g pointerEvents="none"><rect fill="#19243b" height={boxHeight} rx="8" width={boxWidth} x={boxX} y={boxY} /><path d={`M ${x - 6} ${boxY + boxHeight} L ${x} ${boxY + boxHeight + 7} L ${x + 6} ${boxY + boxHeight} Z`} fill="#19243b" /><text fill="#cfe5d8" fontSize="12" x={boxX + 12} y={boxY + 21}>{series === "adult" ? "Over 18 år" : "Under 18 år"} · {point.year}</text><text fill="white" fontSize="16" fontWeight="700" x={boxX + 12} y={boxY + 44}>{formatValue(value, unit)} / {unit}</text></g>;
}

function formatAxis(value: number) { return value.toLocaleString("nb-NO", { maximumFractionDigits: 0 }); }
function formatValue(value: number, unit: Unit) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: unit === "time" ? 2 : 0, maximumFractionDigits: unit === "time" ? 2 : 0 })} kr`; }
