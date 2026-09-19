"use client";

import { useMemo, useState } from "react";

type ChartPoint = {
  effectiveFrom: string;
  effectiveTo: string | null;
  skilledRate: number;
};

type ElectricianMinimumWageChartProps = {
  points: ChartPoint[];
  today: string;
};

const width = 920;
const height = 410;
const plot = { top: 38, right: 26, bottom: 64, left: 72 };

export function ElectricianMinimumWageChart({
  points,
  today,
}: ElectricianMinimumWageChartProps) {
  const [activeIndex, setActiveIndex] = useState(points.length - 1);
  const model = useMemo(() => createChartModel(points, today), [points, today]);
  const active = points[activeIndex] ?? points.at(-1);
  const previous = points[activeIndex - 1];
  const amountChange = active && previous ? active.skilledRate - previous.skilledRate : null;
  const percentChange =
    amountChange !== null && previous ? (amountChange / previous.skilledRate) * 100 : null;

  if (!active || !model) {
    return null;
  }

  return (
    <figure className="overflow-hidden rounded-[5px] border border-black/10 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
            Faglært elektriker · kr/time
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-950">
            {formatRate(active.skilledRate)}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Fra {formatDate(active.effectiveFrom)}
            {amountChange !== null && percentChange !== null
              ? ` · +${formatRate(amountChange)} (+${formatPercent(percentChange)})`
              : " · første dokumenterte punkt"}
          </p>
        </div>
        <p className="text-xs leading-5 text-slate-500">Velg eller hold over et punkt for detaljer.</p>
      </div>

      <div className="mt-5 overflow-x-auto" role="group" aria-label="Utvikling i minstelønn">
        <svg className="min-w-[700px]" role="img" viewBox={`0 0 ${width} ${height}`}>
          <title>Stegdiagram for minstelønn til faglærte elektrikere</title>
          {model.ticks.map((tick) => {
            const y = model.yForRate(tick);
            return (
              <g key={tick}>
                <line x1={plot.left} x2={width - plot.right} y1={y} y2={y} stroke="#e2e8f0" />
                <text fill="#64748b" fontSize="13" textAnchor="end" x={plot.left - 12} y={y + 5}>
                  {tick.toLocaleString("nb-NO")}
                </text>
              </g>
            );
          })}
          {model.yearTicks.map((tick) => (
            <g key={tick.year}>
              <line x1={tick.x} x2={tick.x} y1={plot.top} y2={height - plot.bottom} stroke="#f1f5f9" />
              <text fill="#64748b" fontSize="13" textAnchor="middle" x={tick.x} y={height - 26}>
                {tick.year}
              </text>
            </g>
          ))}
          <path
            d={model.path}
            fill="none"
            stroke="#14532d"
            strokeLinejoin="round"
            strokeWidth="5"
          />
          {points.map((point, index) => {
            const x = model.xForDate(point.effectiveFrom);
            const y = model.yForRate(point.skilledRate);
            const selected = index === activeIndex;
            return (
              <g
                aria-label={`${formatDate(point.effectiveFrom)}: ${formatRate(point.skilledRate)}`}
                key={point.effectiveFrom}
                onBlur={() => undefined}
                onFocus={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                role="button"
                tabIndex={0}
              >
                <circle cx={x} cy={y} fill="transparent" r="18" />
                <circle
                  cx={x}
                  cy={y}
                  fill={selected ? "#14532d" : "#ffffff"}
                  r={selected ? 7 : 5.5}
                  stroke="#14532d"
                  strokeWidth="3"
                />
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
        Stegformen viser at hver sats gjelder uendret frem til neste ikrafttredelsesdato. Kilde:
        Lovdata og Tariffnemnda.
      </figcaption>
    </figure>
  );
}

function createChartModel(points: ChartPoint[], today: string) {
  if (points.length === 0) return null;
  const start = toTimestamp(points[0].effectiveFrom);
  const end = toTimestamp(today);
  const rates = points.map((point) => point.skilledRate);
  const min = Math.floor((Math.min(...rates) - 5) / 10) * 10;
  const max = Math.ceil((Math.max(...rates) + 5) / 10) * 10;
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const xForDate = (date: string) =>
    plot.left + ((toTimestamp(date) - start) / Math.max(end - start, 1)) * plotWidth;
  const yForRate = (rate: number) =>
    plot.top + plotHeight - ((rate - min) / Math.max(max - min, 1)) * plotHeight;
  const pathParts: string[] = [];

  points.forEach((point, index) => {
    const x = xForDate(point.effectiveFrom);
    const y = yForRate(point.skilledRate);
    if (index === 0) pathParts.push(`M ${x} ${y}`);
    else pathParts.push(`H ${x} V ${y}`);
  });
  pathParts.push(`H ${xForDate(today)}`);

  const startYear = new Date(start).getUTCFullYear();
  const endYear = new Date(end).getUTCFullYear();
  const yearTicks = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index)
    .filter((year) => year === startYear || year === endYear || year % 2 === 0)
    .map((year) => ({ year, x: xForDate(`${year}-01-01`) }))
    .filter((tick) => tick.x >= plot.left && tick.x <= width - plot.right);
  const ticks = [min, min + (max - min) / 2, max];

  return { path: pathParts.join(" "), ticks, yearTicks, xForDate, yForRate };
}

function toTimestamp(date: string) {
  return new Date(`${date}T00:00:00Z`).getTime();
}

function formatRate(value: number) {
  return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
}

function formatPercent(value: number) {
  return `${value.toLocaleString("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
