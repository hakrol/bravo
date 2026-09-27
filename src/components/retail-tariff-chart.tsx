"use client";

import { useMemo, useState } from "react";
import {
  formatMinimumWageChartYear,
  getMinimumWageChartYearTicks,
  type MinimumWageChartLayout,
  useMinimumWageChartLayout,
} from "@/components/minimum-wage-chart-mobile";

type RateKey = "under16" | "under18" | "step1" | "step2" | "step3" | "step4" | "step5" | "step6";
type Rate = { hourly: number; monthly: number };
type RateSet = { effectiveFrom: string; rates: Record<RateKey, Rate> };
type Unit = "time" | "måned" | "år";

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

export function RetailTariffChart({ rateSets, today }: { rateSets: RateSet[]; today: string }) {
  const [unit, setUnit] = useState<Unit>("time");
  const [rateKey, setRateKey] = useState<RateKey>("step1");
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const layout = useMinimumWageChartLayout(300);
  const model = useMemo(() => makeChartModel(rateSets, today, rateKey, unit, layout), [layout, rateKey, rateSets, today, unit]);
  const active = rateSets.find((point) => point.effectiveFrom === activeDate);
  const latest = rateSets.at(-1);
  const selectedRate = rates.find((rate) => rate.value === rateKey) ?? rates[2];

  if (!model || !latest) return null;

  return (
    <figure className="rounded-[11px] border border-[#dde4ee] bg-white px-5 pb-5 pt-6 shadow-[0_10px_35px_rgba(19,37,64,0.04)] sm:px-7 sm:pb-7 sm:pt-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-[#19243b] sm:text-[2.1rem] sm:leading-[1.1]">Utvikling i tariffsatser for butikkmedarbeidere</h2>
          <p className="mt-2 text-[1.03rem] leading-[1.8] text-[#52627d] sm:text-lg sm:leading-[1.95]">Virke–HK per {unit}. Viser {selectedRate.label.toLowerCase()}, fra {rateSets[0].effectiveFrom.slice(0, 4)}.</p>
        </div>
        <div aria-label="Vis sats per" className="inline-flex rounded-full border border-[#dde4ee] bg-white p-1 shadow-sm" role="group">
          {units.map((item) => <button aria-pressed={unit === item.value} className={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15533d] ${unit === item.value ? "bg-[#15533d] text-white" : "text-[#34415a] hover:bg-slate-100"}`} key={item.value} onClick={() => { setUnit(item.value); setActiveDate(null); }} type="button">{item.label}</button>)}
        </div>
      </div>

      <div aria-label="Velg tariffsats" className="mt-5 flex flex-wrap gap-2" role="group">
        {rates.map((rate) => <button aria-pressed={rateKey === rate.value} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15533d] ${rateKey === rate.value ? "border-[#15533d] bg-[#e8f4eb] text-[#15533d]" : "border-slate-200 bg-white text-slate-600 hover:border-[#93b4a5] hover:text-[#15533d]"}`} key={rate.value} onClick={() => { setRateKey(rate.value); setActiveDate(null); }} type="button">{rate.label}</button>)}
      </div>

      <div className="mt-6 overflow-hidden sm:overflow-x-auto">
        <svg aria-label={`Trappegraf for tariffsatsens utvikling for ${selectedRate.label} fra ${formatDate(rateSets[0].effectiveFrom)} til ${formatDate(today)}.`} className="block w-full" role="img" viewBox={`0 0 ${layout.width} ${layout.height}`}>
          <title>Historisk utvikling i tariffsats for butikkmedarbeidere</title>
          <desc>Grafen viser den valgte satsen som en trappelinje med endring på datoen hver nye sats trådte i kraft.</desc>
          {model.ticks.map((tick) => { const y = model.y(tick); return <g key={tick}><line stroke="#e3e9f2" x1={layout.plot.left} x2={layout.width - layout.plot.right} y1={y} y2={y} /><text fill="#52627d" fontSize={layout.isMobile ? "11" : "13"} textAnchor="end" x={layout.plot.left - 10} y={y + 4}>{formatAxis(tick)}</text></g>; })}
          {getMinimumWageChartYearTicks(model.years, layout.isMobile).map((year) => { const x = model.x(`${year}-01-01`); return <g key={year}><line stroke="#e9edf4" x1={x} x2={x} y1={layout.plot.top} y2={layout.height - layout.plot.bottom} /><text fill="#52627d" fontSize={layout.isMobile ? "11" : "13"} textAnchor="middle" x={x} y={layout.height - 17}>{formatMinimumWageChartYear(year, layout.isMobile)}</text></g>; })}
          <path d={model.path} fill="none" stroke="#15533d" strokeWidth="2.5" />
          {rateSets.map((point) => {
            const value = valueFor(point.rates[rateKey], unit);
            return <g key={`point-${point.effectiveFrom}`}><circle cx={model.x(point.effectiveFrom)} cy={model.y(value)} fill="#15533d" r="4.5" /><HitPoint label={`${selectedRate.label} fra ${formatDate(point.effectiveFrom)}: ${formatValue(value, unit)}`} onClose={() => setActiveDate(null)} onOpen={() => setActiveDate(point.effectiveFrom)} x={model.x(point.effectiveFrom)} y={model.y(value)} /></g>;
          })}
          <text fill="#15533d" fontSize={layout.isMobile ? "11" : "15"} x={layout.width - layout.plot.right + (layout.isMobile ? 7 : 13)} y={model.y(valueFor(latest.rates[rateKey], unit)) + 5}>{formatValue(valueFor(latest.rates[rateKey], unit), unit)}</text>
          {active && <Tooltip label={selectedRate.label} layout={layout} model={model} point={active} rateKey={rateKey} unit={unit} />}
        </svg>
      </div>
      <div className="mt-1 flex items-center justify-center gap-2 text-sm text-[#52627d]"><span className="size-3.5 rounded-full bg-[#15533d]" />{selectedRate.label}</div>
      <figcaption className="mt-4 text-center text-xs leading-5 text-slate-500">Trappelinjen følger de faktiske ikrafttredelsesdatoene. Årslønn er månedslønn × 12. Historisk timelønn er beregnet som månedslønn ÷ 162,5 når Virke ikke har publisert egen timesats.</figcaption>
    </figure>
  );
}

function makeChartModel(points: RateSet[], today: string, rateKey: RateKey, unit: Unit, layout: MinimumWageChartLayout) {
  if (!points.length) return null;
  const { height, plot, width } = layout;
  const start = Date.parse(`${points[0].effectiveFrom}T00:00:00Z`);
  const end = Date.parse(`${today}T00:00:00Z`);
  const x = (date: string) => plot.left + ((Date.parse(`${date}T00:00:00Z`) - start) / Math.max(end - start, 1)) * (width - plot.left - plot.right);
  const values = points.map((point) => valueFor(point.rates[rateKey], unit));
  const step = unit === "time" ? 20 : unit === "måned" ? 5000 : 50000;
  const minimum = Math.max(0, Math.floor(Math.min(...values) / step) * step - step);
  const maximum = Math.ceil(Math.max(...values) / step) * step + step;
  const y = (value: number) => plot.top + (height - plot.top - plot.bottom) * (1 - (value - minimum) / (maximum - minimum));
  const commands = [`M ${x(points[0].effectiveFrom)} ${y(valueFor(points[0].rates[rateKey], unit))}`];
  points.slice(1).forEach((point) => commands.push(`H ${x(point.effectiveFrom)} V ${y(valueFor(point.rates[rateKey], unit))}`));
  commands.push(`H ${x(today)}`);
  const firstYear = Number(points[0].effectiveFrom.slice(0, 4));
  const lastYear = Number(today.slice(0, 4));
  return { x, y, path: commands.join(" "), ticks: Array.from({ length: Math.round((maximum - minimum) / step) + 1 }, (_, index) => minimum + index * step), years: Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index) };
}

function valueFor(rate: Rate, unit: Unit) { return unit === "time" ? rate.hourly : unit === "måned" ? rate.monthly : rate.monthly * 12; }
function HitPoint({ label, onClose, onOpen, x, y }: { label: string; onClose: () => void; onOpen: () => void; x: number; y: number }) { return <circle aria-label={label} cx={x} cy={y} fill="transparent" onBlur={onClose} onClick={onOpen} onFocus={onOpen} onMouseEnter={onOpen} onMouseLeave={onClose} r="18" role="button" style={{ cursor: "pointer", touchAction: "manipulation" }} tabIndex={0} />; }

function Tooltip({ label, layout, model, point, rateKey, unit }: { label: string; layout: MinimumWageChartLayout; model: NonNullable<ReturnType<typeof makeChartModel>>; point: RateSet; rateKey: RateKey; unit: Unit }) {
  const { plot, width } = layout;
  const x = model.x(point.effectiveFrom);
  const value = valueFor(point.rates[rateKey], unit);
  const y = model.y(value);
  const boxWidth = 190;
  const boxHeight = 58;
  const boxX = Math.min(Math.max(x - boxWidth / 2, plot.left), width - plot.right - boxWidth);
  const boxY = Math.max(plot.top + 4, y - boxHeight - 14);
  return <g pointerEvents="none"><rect fill="#19243b" height={boxHeight} rx="8" width={boxWidth} x={boxX} y={boxY} /><path d={`M ${x - 6} ${boxY + boxHeight} L ${x} ${boxY + boxHeight + 7} L ${x + 6} ${boxY + boxHeight} Z`} fill="#19243b" /><text fill="#cfe5d8" fontSize="12" x={boxX + 12} y={boxY + 21}>{label} · {formatDate(point.effectiveFrom)}</text><text fill="white" fontSize="16" fontWeight="700" x={boxX + 12} y={boxY + 44}>{formatValue(value, unit)} / {unit}</text></g>;
}

function formatAxis(value: number) { return value.toLocaleString("nb-NO", { maximumFractionDigits: 0 }); }
function formatValue(value: number, unit: Unit) { return `${value.toLocaleString("nb-NO", { minimumFractionDigits: unit === "time" ? 2 : 0, maximumFractionDigits: unit === "time" ? 2 : 0 })} kr`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
