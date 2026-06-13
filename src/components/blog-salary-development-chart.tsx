"use client";

import { useState } from "react";

export type BlogSalaryDevelopmentPoint = {
  label: string;
  value: number;
};

export type BlogSalaryDevelopmentSeries = {
  label: string;
  points: BlogSalaryDevelopmentPoint[];
  color?: string;
};

type BlogSalaryDevelopmentChartProps = {
  title: string;
  subtitle?: string;
  source: string;
  note?: string;
  series: BlogSalaryDevelopmentSeries[];
  yAxisLabel?: string;
};

const defaultColors = ["#14532d", "#b45309", "#2563eb", "#7c3aed"];
const width = 1180;
const height = 560;
const plot = {
  top: 52,
  right: 190,
  bottom: 82,
  left: 108,
};
const plotWidth = width - plot.left - plot.right;
const plotHeight = height - plot.top - plot.bottom;
const calloutFill = "#f7fbf4";
const calloutStroke = "#d6e1d2";

export function BlogSalaryDevelopmentChart({
  title,
  subtitle,
  source,
  note,
  series,
  yAxisLabel = "Median månedslønn",
}: BlogSalaryDevelopmentChartProps) {
  const normalizedSeries = series.filter((entry) => entry.points.length > 0);
  const [selectedSeriesLabel, setSelectedSeriesLabel] = useState(normalizedSeries[0]?.label ?? "");

  if (normalizedSeries.length === 0) {
    return null;
  }

  const selectedSeries = normalizedSeries.find((entry) => entry.label === selectedSeriesLabel) ?? normalizedSeries[0];
  const values = normalizedSeries.flatMap((entry) => entry.points.map((point) => point.value));
  const axis = getAxis(values);
  const labels = selectedSeries.points.map((point) => point.label);
  const titleId = `${slugify(title)}-title`;

  const xForIndex = (index: number) => plot.left + (index / Math.max(labels.length - 1, 1)) * plotWidth;
  const yForValue = (value: number) =>
    plot.top + plotHeight - ((value - axis.min) / Math.max(axis.max - axis.min, 1)) * plotHeight;

  return (
    <figure className="blog-chart blog-salary-development-figure" aria-labelledby={titleId}>
      <div className="blog-chart-header">
        <div>
          <h3 className="blog-chart-title" id={titleId} style={{ fontSize: "50px", lineHeight: 1.08 }}>
            {title}
          </h3>
          {subtitle ? <p className="blog-chart-subtitle">{subtitle}</p> : null}
        </div>
      </div>

      {normalizedSeries.length > 1 ? (
        <div className="blog-salary-development-controls" aria-label="Velg kjønn">
          {normalizedSeries.map((entry) => {
            const selected = entry.label === selectedSeries.label;

            return (
              <button
                key={entry.label}
                aria-pressed={selected}
                className="blog-salary-development-toggle"
                data-active={selected ? "true" : undefined}
                onClick={() => setSelectedSeriesLabel(entry.label)}
                type="button"
              >
                {entry.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <p className="blog-salary-development-axis-heading">{yAxisLabel} (kroner)</p>

      <div className="blog-chart-svg-wrap blog-salary-development-wrap" style={{ overflowX: "hidden" }}>
        <svg
          aria-label={`${title}. ${yAxisLabel}.`}
          role="img"
          style={{ maxWidth: "100%", minWidth: 0, width: "100%" }}
          viewBox={`0 0 ${width} ${height}`}
        >
          {axis.ticks.map((tick) => {
            const y = yForValue(tick);

            return (
              <g key={tick}>
                {tick > axis.min ? (
                  <line
                    className="blog-salary-development-gridline"
                    x1={plot.left}
                    x2={width - plot.right}
                    y1={y}
                    y2={y}
                  />
                ) : null}
                <text className="blog-salary-development-y-tick" textAnchor="end" x={plot.left - 28} y={y + 7}>
                  {formatAxisCurrency(tick)}
                </text>
              </g>
            );
          })}

          {labels.map((label, index) => {
            const x = xForIndex(index);

            return (
              <g key={label}>
                <text className="blog-salary-development-x-tick" textAnchor="middle" x={x} y={plot.top + plotHeight + 50}>
                  {label}
                </text>
              </g>
            );
          })}

          <line
            className="blog-salary-development-y-axis"
            x1={plot.left}
            x2={plot.left}
            y1={plot.top}
            y2={plot.top + plotHeight}
          />
          <line
            className="blog-salary-development-x-axis"
            x1={plot.left}
            x2={width - plot.right}
            y1={plot.top + plotHeight}
            y2={plot.top + plotHeight}
          />

          {[selectedSeries].map((entry) => {
            const seriesIndex = normalizedSeries.findIndex((seriesEntry) => seriesEntry.label === entry.label);
            const color = entry.color ?? defaultColors[Math.max(seriesIndex, 0) % defaultColors.length];
            const points = entry.points.map((point, index) => ({
              ...point,
              x: xForIndex(index),
              y: yForValue(point.value),
            }));
            const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
            const firstPoint = points[0];
            const lastPoint = points.at(-1);
            const growthValue = firstPoint && lastPoint ? lastPoint.value - firstPoint.value : 0;
            const growthPercent = firstPoint && lastPoint && firstPoint.value > 0 ? (growthValue / firstPoint.value) * 100 : 0;

            return (
              <g key={entry.label}>
                <path d={path} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.5" />
                {points.map((point, index) => {
                  const isEndpoint = index === 0 || index === points.length - 1;

                  return (
                    <g key={`${entry.label}-${point.label}`}>
                      <circle
                        aria-label={`${entry.label}, ${point.label}: ${formatCurrency(point.value)}`}
                        cx={point.x}
                        cy={point.y}
                        fill="#fffaf5"
                        r={isEndpoint ? 10 : 9}
                        stroke={color}
                        strokeWidth="4"
                      />
                    </g>
                  );
                })}
                {firstPoint && lastPoint ? (
                  <g>
                    <ValueCallout
                      color={color}
                      text={formatCurrency(firstPoint.value)}
                      variant="start"
                      x={firstPoint.x}
                      y={firstPoint.y}
                    />
                    <ValueCallout
                      color={color}
                      text={formatCurrency(lastPoint.value)}
                      variant="end"
                      x={lastPoint.x}
                      y={lastPoint.y}
                    />
                    <GrowthCallout
                      color={color}
                      text={`${formatSignedCurrency(growthValue)}\n(${formatSignedPercent(growthPercent)})`}
                      x={lastPoint.x}
                      y={lastPoint.y}
                    />
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="blog-chart-footer blog-salary-development-footer">
        <span className="blog-salary-development-source">
          <span aria-hidden="true" className="blog-salary-development-info">
            i
          </span>
          <span>
            <strong>Kilde:</strong> {source}
          </span>
        </span>
        {note ? <span>{note}</span> : null}
      </figcaption>
    </figure>
  );
}

function ValueCallout({
  color,
  text,
  variant,
  x,
  y,
}: {
  color: string;
  text: string;
  variant: "start" | "end";
  x: number;
  y: number;
}) {
  const width = getCalloutWidth(text, 24);
  const height = 46;
  const isEnd = variant === "end";
  const boxX = isEnd ? x - width + 112 : x - 18;
  const boxY = isEnd ? y - 86 : y - 88;
  const pointerTipY = y - 8;
  const pointer = isEnd
    ? `${x + 10},${boxY + height - 1} ${x + 10},${pointerTipY} ${x + 28},${boxY + height - 1}`
    : `${x + 7},${boxY + height - 1} ${x + 7},${pointerTipY} ${x + 25},${boxY + height - 1}`;

  return (
    <g className={`blog-salary-development-callout blog-salary-development-callout-${variant}`}>
      <rect
        fill={isEnd ? color : calloutFill}
        height={height}
        rx="5"
        stroke={isEnd ? color : calloutStroke}
        width={width}
        x={boxX}
        y={boxY}
      />
      <polygon fill={isEnd ? color : calloutFill} points={pointer} stroke={isEnd ? color : calloutStroke} />
      <text
        fill={isEnd ? "#ffffff" : color}
        fontSize="22"
        fontWeight="820"
        textAnchor="middle"
        x={boxX + width / 2}
        y={boxY + 30}
      >
        {text}
      </text>
    </g>
  );
}

function GrowthCallout({ color, text, x, y }: { color: string; text: string; x: number; y: number }) {
  const [value, percent] = text.split("\n");
  const width = 138;
  const height = 76;
  const boxX = x + 36;
  const boxY = y - 18;
  const pointer = `${boxX},${boxY + 18} ${boxX - 16},${boxY + 28} ${boxX},${boxY + 38}`;

  return (
    <g className="blog-salary-development-growth">
      <polygon fill={calloutFill} points={pointer} stroke={calloutStroke} />
      <rect fill={calloutFill} height={height} rx="6" stroke={calloutStroke} width={width} x={boxX} y={boxY} />
      <text fill={color} fontSize="22" fontWeight="820" x={boxX + 18} y={boxY + 32}>
        {value}
      </text>
      <text fill={color} fontSize="22" fontWeight="820" x={boxX + 18} y={boxY + 60}>
        {percent}
      </text>
    </g>
  );
}

function getAxis(values: number[]) {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const min = Math.max(0, Math.floor((minValue * 0.94) / 5000) * 5000);
  const max = Math.ceil((maxValue * 1.04) / 5000) * 5000;
  const step = Math.max(5000, Math.ceil((max - min) / 5 / 5000) * 5000);
  const ticks = [];

  for (let tick = min; tick <= max; tick += step) {
    ticks.push(tick);
  }

  if (ticks.at(-1) !== max) {
    ticks.push(max);
  }

  return { min, max, ticks };
}

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString("nb-NO")} kr`;
}

function formatSignedCurrency(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatCurrency(value)}`;
}

function formatSignedPercent(value: number) {
  const prefix = value > 0 ? "+" : "";

  return `${prefix}${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} %`;
}

function formatAxisCurrency(value: number) {
  return Math.round(value).toLocaleString("nb-NO");
}

function getCalloutWidth(text: string, padding: number) {
  return Math.max(108, text.length * 12 + padding);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9æøå\s-]/gi, "")
    .replace(/[æÆ]/g, "ae")
    .replace(/[øØ]/g, "o")
    .replace(/[åÅ]/g, "a")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
