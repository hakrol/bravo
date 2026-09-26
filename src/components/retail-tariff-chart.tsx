"use client";

import { useMemo, useState } from "react";

type RateKey = "under16" | "under18" | "step1" | "step2" | "step3" | "step4" | "step5" | "step6";
type Rate = { hourly: number; monthly: number };
type RateSet = { effectiveFrom: string; rates: Record<RateKey, Rate> };
type Unit = "time" | "måned" | "år";
type YearPoint = RateSet & { year: number };

const width = 920;
const height = 300;
const plot = { left: 88, right: 132, top: 15, bottom: 48 };
const units: { value: Unit; label: string }[] = [
  { value: "time", label: "Time" },
  { value: "måned", label: "Måned" },
  { value: "år", label: "År" },
];
const rates: { value: RateKey; label: string }[] = [
  { value: "under16", label: "Under 16 år" },
  { value: "under18", label: "Under 18 år" },
  { value: "step1", label: "Trinn 1" },
  { value: "step2", label: "Trinn 2" },
  { value: "step3", label: "Trinn 3" },
  { value: "step4", label: "Trinn 4" },
  { value: "step5", label: "Trinn 5" },
  { value: "step6", label: "Trinn 6" },
];

export function RetailTariffChart({ rateSets }: { rateSets: RateSet[] }) {
  const [unit, setUnit] = useState<Unit>("time");
  const [rateKey, setRateKey] = useState<RateKey>("step1");
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const yearPoints = useMemo(() => getYearEndPoints(rateSets), [rateSets]);
  const model = useMemo(() => makeChartModel(yearPoints, rateKey, unit), [rateKey, unit, yearPoints]);
  const active = yearPoints.find((point) => point.year === activeYear);
  const latest = yearPoints.at(-1);
  const selectedRate = rates.find((rate) => rate.value === rateKey) ?? rates[2];

  if (!model || !latest) return null;

  return (
    <figure className="rounded-[11px] border border-[#dde4ee] bg-white px-5 pb-5 pt-6 shadow-[0_10px_35px_rgba(19,37,64,0.04)] sm:px-7 sm:pb-7 sm:pt-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#19243b] sm:text-[2.1rem] sm:leading-[1.1]">Utvikling i tariffsatser for butikkmedarbeidere</h2>
          <p className="mt-2 text-[1.03rem] leading-[1.8] text-[#52627d] sm:text-lg sm:leading-[1.95]">Virke–HK per {unit}. Viser {selectedRate.label.toLowerCase()}. {yearPoints[0].year}–{latest.year}.</p>
        </div>
        <div aria-label="Vis sats per" className="inline-flex rounded-full border border-[#dde4ee] bg-white p-1 shadow-sm" role="group">
          {units.map((item) => <button aria-pressed={unit === item.value} className={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15533d] ${unit === item.value ? "bg-[#15533d] text-white" : "text-[#34415a] hover:bg-slate-100"}`} key={item.value} onClick={() => { setUnit(item.value); setActiveYear(null); }} type="button">{item.label}</button>)}
        </div>
      </div>

      <div aria-label="Velg tariffsats" className="mt-5 flex flex-wrap gap-2" role="group">
        {rates.map((rate) => <button aria-pressed={rateKey === rate.value} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15533d] ${rateKey === rate.value ? "border-[#15533d] bg-[#e8f4eb] text-[#15533d]" : "border-slate-200 bg-white text-slate-600 hover:border-[#93b4a5] hover:text-[#15533d]"}`} key={rate.value} onClick={() => { setRateKey(rate.value); setActiveYear(null); }} type="button">{rate.label}</button>)}
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg aria-label={`Tariffsatsens utvikling for ${selectedRate.label} fra ${yearPoints[0].year} til ${latest.year}.`} className="w-full min-w-[660px]" role="img" viewBox={`0 0 ${width} ${height}`}>
          {model.ticks.map((tick) => { const y = model.y(tick); return <g key={tick}><line stroke="#e3e9f2" x1={plot.left} x2={width - plot.right} y1={y} y2={y} /><text fill="#52627d" fontSize="13" textAnchor="end" x={plot.left - 12} y={y + 5}>{formatAxis(tick)}</text></g>; })}
          {yearPoints.map((point, index) => { const x = model.x(index); return <g key={point.year}><line stroke="#e9edf4" x1={x} x2={x} y1={plot.top} y2={height - plot.bottom} /><text fill="#52627d" fontSize="13" textAnchor="middle" x={x} y={height - 17}>{point.year}</text></g>; })}
          <path d={model.path} fill="none" stroke="#15533d" strokeWidth="2.5" />
          {yearPoints.map((point, index) => {
            const value = valueFor(point.rates[rateKey], unit);
            return <g key={`point-${point.year}`}><circle cx={model.x(index)} cy={model.y(value)} fill="#15533d" r="4.5" /><HitPoint label={`${selectedRate.label} i ${point.year}: ${formatValue(value, unit)}`} onClose={() => setActiveYear(null)} onOpen={() => setActiveYear(point.year)} x={model.x(index)} y={model.y(value)} /></g>;
          })}
          <text fill="#15533d" fontSize="15" x={width - plot.right + 13} y={model.y(valueFor(latest.rates[rateKey], unit)) + 5}>{formatValue(valueFor(latest.rates[rateKey], unit), unit)}</text>
          {active && <Tooltip label={selectedRate.label} model={model} point={active} rateKey={rateKey} unit={unit} />}
        </svg>
      </div>
      <div className="mt-1 flex items-center justify-center gap-2 text-sm text-[#52627d]"><span className="size-3.5 rounded-full bg-[#15533d]" />{selectedRate.label}</div>
      <figcaption className="mt-4 text-center text-xs leading-5 text-slate-500">Punktene viser satsen ved utgangen av hvert år. Årslønn er månedslønn × 12. Historisk timelønn er beregnet som månedslønn ÷ 162,5 når Virke ikke har publisert egen timesats.</figcaption>
    </figure>
  );
}

function getYearEndPoints(rateSets: RateSet[]) {
  if (!rateSets.length) return [];
  const firstYear = Number(rateSets[0].effectiveFrom.slice(0, 4));
  const lastYear = Number(rateSets.at(-1)?.effectiveFrom.slice(0, 4));
  return Array.from({ length: lastYear - firstYear + 1 }, (_, index) => {
    const year = firstYear + index;
    const set = [...rateSets].reverse().find((item) => item.effectiveFrom <= `${year}-12-31`);
    return set ? { ...set, year } : null;
  }).filter((point): point is YearPoint => point !== null);
}

function makeChartModel(points: YearPoint[], rateKey: RateKey, unit: Unit) {
  if (!points.length) return null;
  const values = points.map((point) => valueFor(point.rates[rateKey], unit));
  const step = unit === "time" ? 50 : unit === "måned" ? 10000 : 100000;
  const max = Math.ceil(Math.max(...values) / step) * step + step;
  const x = (index: number) => plot.left + index * (width - plot.left - plot.right) / Math.max(points.length - 1, 1);
  const y = (value: number) => plot.top + (height - plot.top - plot.bottom) * (1 - value / max);
  const path = points.map((point, index) => `${index ? "L" : "M"} ${x(index)} ${y(valueFor(point.rates[rateKey], unit))}`).join(" ");
  return { x, y, path, ticks: Array.from({ length: Math.round(max / step) + 1 }, (_, index) => index * step), years: points.map((point) => point.year) };
}

function valueFor(rate: Rate, unit: Unit) { return unit === "time" ? rate.hourly : unit === "måned" ? rate.monthly : rate.monthly * 12; }
function HitPoint({ label, onClose, onOpen, x, y }: { label: string; onClose: () => void; onOpen: () => void; x: number; y: number }) { return <circle aria-label={label} cx={x} cy={y} fill="transparent" onBlur={onClose} onClick={onOpen} onFocus={onOpen} onMouseEnter={onOpen} onMouseLeave={onClose} r="18" role="button" style={{ cursor: "pointer", touchAction: "manipulation" }} tabIndex={0} />; }

function Tooltip({ label, model, point, rateKey, unit }: { label: string; model: NonNullable<ReturnType<typeof makeChartModel>>; point: YearPoint; rateKey: RateKey; unit: Unit }) {
  const x = model.x(model.years.indexOf(point.year));
  const value = valueFor(point.rates[rateKey], unit);
  const y = model.y(value);
  const boxWidth = 190;
  const boxHeight = 58;
  const boxX = Math.min(Math.max(x - boxWidth / 2, plot.left), width - plot.right - boxWidth);
  const boxY = Math.max(plot.top + 4, y - boxHeight - 14);
  return <g pointerEvents="none"><rect fill="#19243b" height={boxHeight} rx="8" width={boxWidth} x={boxX} y={boxY} /><path d={`M ${x - 6} ${boxY + boxHeight} L ${x} ${boxY + boxHeight + 7} L ${x + 6} ${boxY + boxHeight} Z`} fill="#19243b" /><text fill="#cfe5d8" fontSize="12" x={boxX + 12} y={boxY + 21}>{label} · {point.year}</text><text fill="white" fontSize="16" fontWeight="700" x={boxX + 12} y={boxY + 44}>{formatValue(value, unit)} / {unit}</text></g>;
}

function formatAxis(value: number) { return value.toLocaleString("nb-NO", { maximumFractionDigits: 0 }); }
function formatValue(value: number, unit: Unit) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: unit === "time" ? 2 : 0, maximumFractionDigits: unit === "time" ? 2 : 0 })} kr`; }
