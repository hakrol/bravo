"use client";

import { useMemo, useState } from "react";
import type { WomenShareSpecialTimeSeries } from "@/lib/women-share-special";

type QuarterlyWomenShareChartProps = {
  series: WomenShareSpecialTimeSeries[];
};

const percentFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const indexFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const colors = [
  "#f2c079",
  "#71c7aa",
  "#d9a15c",
  "#9fd3c4",
  "#e8d5a3",
  "#5fae99",
  "#c68d70",
  "#b7ded2",
  "#f0b36d",
  "#86bcae",
];

export function QuarterlyWomenShareChart({ series }: QuarterlyWomenShareChartProps) {
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const chartSeries = useMemo(
    () =>
      series.slice(0, 10).map((row) => {
        const firstShare = row.points[0]?.share ?? 0;
        const points = row.points.map((point) => ({
          ...point,
          indexValue: firstShare > 0 ? (point.share / firstShare) * 100 : 100,
        }));

        return {
          ...row,
          points,
          startShare: row.points[0]?.share ?? 0,
          endShare: row.points.at(-1)?.share ?? 0,
        };
      }),
    [series],
  );
  const periods = chartSeries[0]?.points.map((point) => point.period) ?? [];
  const maxIndex = Math.max(
    125,
    ...chartSeries.flatMap((row) => row.points.map((point) => point.indexValue)),
  );
  const yMin = 92;
  const yMax = Math.ceil((maxIndex + 8) / 10) * 10;
  const width = 1420;
  const height = 710;
  const left = 78;
  const right = 350;
  const top = 48;
  const bottom = 102;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const ticks = buildTicks(yMax);

  return (
    <svg
      className="h-auto w-full"
      onMouseLeave={() => setActiveCode(null)}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      aria-label="Indeksert kvartalsvis utvikling i kvinneandel for yrkene der kvinneandelen har økt mest"
    >
      <rect fill="#111715" height={height} width={width} />

      {ticks.map((tick) => {
        const y = indexToY(tick, yMin, yMax, top, plotHeight);

        return (
          <g key={tick}>
            <line x1={left} x2={width - right + 8} y1={y} y2={y} stroke="rgba(247,243,235,0.13)" />
            <text fill="rgba(247,243,235,0.54)" fontSize="15" x={left - 18} y={y + 5} textAnchor="end">
              {indexFormatter.format(tick)}
            </text>
          </g>
        );
      })}

      {periods
        .filter((period) => period.endsWith("K4"))
        .map((period) => {
          const index = periods.indexOf(period);
          const x = left + (index / Math.max(1, periods.length - 1)) * plotWidth;

          return (
            <g key={period}>
              <line x1={x} x2={x} y1={top} y2={height - bottom} stroke="rgba(247,243,235,0.08)" />
              <text fill="rgba(247,243,235,0.50)" fontSize="15" x={x} y={height - 42} textAnchor="middle">
                {period.slice(0, 4)}
              </text>
            </g>
          );
        })}

      {chartSeries.map((row, rowIndex) => {
        const color = colors[rowIndex % colors.length];
        const isActive = activeCode === row.occupationCode;
        const isDimmed = activeCode !== null && !isActive;
        const path = row.points
          .map((point, pointIndex) => {
            const x = left + (pointIndex / Math.max(1, row.points.length - 1)) * plotWidth;
            const y = indexToY(point.indexValue, yMin, yMax, top, plotHeight);

            return `${pointIndex === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join(" ");
        const firstPoint = row.points[0];
        const lastPoint = row.points.at(-1);
        const startY = firstPoint
          ? indexToY(firstPoint.indexValue, yMin, yMax, top, plotHeight)
          : top;
        const endY = lastPoint
          ? indexToY(lastPoint.indexValue, yMin, yMax, top, plotHeight)
          : top;

        return (
          <g
            key={row.occupationCode}
            onMouseEnter={() => setActiveCode(row.occupationCode)}
            onFocus={() => setActiveCode(row.occupationCode)}
            tabIndex={0}
            role="listitem"
            aria-label={`${row.occupationLabel}: startet på ${formatPercent(row.startShare)} prosent og er nå ${formatPercent(row.endShare)} prosent.`}
          >
            <path
              d={path}
              fill="none"
              opacity={isDimmed ? 0.16 : rowIndex === 0 || isActive ? 1 : 0.72}
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isActive || rowIndex === 0 ? 5.5 : 3.2}
            />
            <path
              d={path}
              fill="none"
              opacity="0"
              stroke="transparent"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            />
            {firstPoint ? (
              <circle cx={left} cy={startY} fill={color} opacity={isDimmed ? 0.18 : 0.9} r={isActive ? 5.5 : 4} />
            ) : null}
            {lastPoint ? (
              <>
                <circle cx={width - right} cy={endY} fill={color} opacity={isDimmed ? 0.18 : 1} r={isActive ? 7 : rowIndex === 0 ? 6 : 4.5} />
                <text
                  fill={color}
                  fontSize={isActive || rowIndex === 0 ? "17" : "15"}
                  fontWeight={isActive || rowIndex === 0 ? "850" : "650"}
                  opacity={isDimmed ? 0.18 : 1}
                  x={width - right + 18}
                  y={endY - 4}
                >
                  {shortenOccupationLabel(row.occupationLabel)}
                </text>
                <text
                  fill="rgba(247,243,235,0.72)"
                  fontSize="13"
                  fontWeight="650"
                  opacity={isDimmed ? 0.18 : 0.95}
                  x={width - right + 18}
                  y={endY + 16}
                >
                  {formatPercent(row.startShare)} % til {formatPercent(row.endShare)} %
                </text>
              </>
            ) : null}
          </g>
        );
      })}

      <text fill="rgba(247,243,235,0.58)" fontSize="14" x={left} y={height - 14}>
        Indeks: 4. kvartal 2016 = 100. Etikettene viser faktisk kvinneandel ved start og siste kvartal.
      </text>
    </svg>
  );
}

function buildTicks(yMax: number) {
  const ticks = [100, 120, 140, 160, 180];
  return ticks.filter((tick) => tick <= yMax);
}

function indexToY(
  value: number,
  yMin: number,
  yMax: number,
  top: number,
  plotHeight: number,
) {
  const boundedValue = Math.min(yMax, Math.max(yMin, value));

  return top + ((yMax - boundedValue) / (yMax - yMin)) * plotHeight;
}

function formatPercent(value: number) {
  return percentFormatter.format(value);
}

function shortenOccupationLabel(label: string) {
  return label
    .replace("Allmennpraktiserende leger", "Allmennleger")
    .replace("Andre sivilingeniører (unntatt elektroteknologi)", "Andre sivilingeniører")
    .replace("Ledere av utdanning og undervisning", "Utdanningsledere")
    .replace("Reklame- og markedsføringsrådgivere", "Markedsføringsrådgivere");
}
