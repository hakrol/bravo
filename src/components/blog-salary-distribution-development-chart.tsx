"use client";

import { useState } from "react";

export type BlogSalaryDistributionDevelopmentPoint = {
  year: string;
  p25: number;
  median: number;
  p75: number;
};

type DistributionMetric = "p25" | "median" | "p75";

type ActivePoint = {
  metric: DistributionMetric;
  year: string;
  value: number;
  x: number;
  y: number;
  pinned: boolean;
};

const metricContent: Record<DistributionMetric, { label: string; description: string }> = {
  p25: {
    label: "P25",
    description: "25 prosent har lavere lønn enn dette tallet, mens 75 prosent har høyere lønn.",
  },
  median: {
    label: "Median",
    description: "Dette er midtpunktet. Halvparten har lavere lønn, og halvparten har høyere lønn.",
  },
  p75: {
    label: "P75",
    description: "75 prosent har lavere lønn enn dette tallet, mens 25 prosent har høyere lønn.",
  },
};

type BlogSalaryDistributionDevelopmentChartProps = {
  title: string;
  subtitle?: string;
  source: string;
  note?: string;
  points: BlogSalaryDistributionDevelopmentPoint[];
  maxYears?: number;
};

const width = 1120;
const height = 610;
const plot = {
  top: 92,
  right: 58,
  bottom: 82,
  left: 112,
};
const plotWidth = width - plot.left - plot.right;
const plotHeight = height - plot.top - plot.bottom;

export function BlogSalaryDistributionDevelopmentChart({
  title,
  subtitle,
  source,
  note,
  points,
  maxYears = 10,
}: BlogSalaryDistributionDevelopmentChartProps) {
  const [activePoint, setActivePoint] = useState<ActivePoint | null>(null);
  const [openMetricInfo, setOpenMetricInfo] = useState<DistributionMetric | null>(null);
  const safeLimit = Math.min(Math.max(Math.floor(maxYears), 1), 10);
  const normalizedPoints = points
    .filter(isCompletePoint)
    .sort((left, right) => Number(left.year) - Number(right.year))
    .slice(-safeLimit);

  if (normalizedPoints.length === 0) {
    return null;
  }

  const values = normalizedPoints.flatMap((point) => [point.p25, point.median, point.p75]);
  const axis = getAxis(values);
  const titleId = `${slugify(title)}-title`;
  const descriptionId = `${slugify(title)}-description`;
  const xForIndex = (index: number) =>
    plot.left + (index / Math.max(normalizedPoints.length - 1, 1)) * plotWidth;
  const yForValue = (value: number) =>
    plot.top + plotHeight - ((value - axis.min) / Math.max(axis.max - axis.min, 1)) * plotHeight;
  const chartPoints = normalizedPoints.map((point, index) => ({
    ...point,
    x: xForIndex(index),
    p25Y: yForValue(point.p25),
    medianY: yForValue(point.median),
    p75Y: yForValue(point.p75),
  }));
  const p25Path = toLinePath(chartPoints.map((point) => ({ x: point.x, y: point.p25Y })));
  const medianPath = toLinePath(chartPoints.map((point) => ({ x: point.x, y: point.medianY })));
  const p75Path = toLinePath(chartPoints.map((point) => ({ x: point.x, y: point.p75Y })));
  const bandPath = toBandPath(chartPoints);
  const accessibleSummary = chartPoints
    .map(
      (point) =>
        `${point.year}: P25 ${formatCurrency(point.p25)}, median ${formatCurrency(point.median)}, P75 ${formatCurrency(point.p75)}`,
    )
    .join(". ");

  return (
    <figure
      aria-labelledby={titleId}
      className="blog-chart blog-salary-distribution-development-figure"
    >
      <div className="blog-chart-header">
        <div>
          <p className="blog-chart-kicker">Lønnsfordeling utvikling</p>
          <h3 className="blog-chart-title" id={titleId}>
            {title}
          </h3>
          {subtitle ? <p className="blog-chart-subtitle">{subtitle}</p> : null}
        </div>
      </div>

      <div className="blog-salary-distribution-development-legend" aria-label="Tegnforklaring">
        <MetricLegendItem
          active={openMetricInfo === "p25"}
          metric="p25"
          onToggle={() => setOpenMetricInfo((current) => current === "p25" ? null : "p25")}
        />
        <MetricLegendItem
          active={openMetricInfo === "median"}
          metric="median"
          onToggle={() => setOpenMetricInfo((current) => current === "median" ? null : "median")}
        />
        <MetricLegendItem
          active={openMetricInfo === "p75"}
          metric="p75"
          onToggle={() => setOpenMetricInfo((current) => current === "p75" ? null : "p75")}
        />
        <span><i className="is-band" aria-hidden="true" />Midterste 50 prosent</span>
      </div>

      {openMetricInfo ? (
        <div className="blog-salary-distribution-development-info" role="status">
          <div>
            <strong>{metricContent[openMetricInfo].label}</strong>
            <p>{metricContent[openMetricInfo].description}</p>
          </div>
          <button
            aria-label={`Lukk forklaring av ${metricContent[openMetricInfo].label}`}
            onClick={() => setOpenMetricInfo(null)}
            type="button"
          >
            ×
          </button>
        </div>
      ) : null}

      <p className="blog-salary-development-axis-heading">Samlet månedslønn (kroner)</p>

      <div
        className="blog-chart-svg-wrap blog-salary-distribution-development-wrap"
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") {
            setActivePoint(null);
          }
        }}
      >
        <svg
          aria-describedby={descriptionId}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
        >
          <desc id={descriptionId}>{accessibleSummary}</desc>

          {axis.ticks.map((tick) => {
            const y = yForValue(tick);

            return (
              <g key={tick}>
                <line
                  className="blog-salary-distribution-development-gridline"
                  x1={plot.left}
                  x2={width - plot.right}
                  y1={y}
                  y2={y}
                />
                <text
                  className="blog-salary-distribution-development-y-tick"
                  textAnchor="end"
                  x={plot.left - 22}
                  y={y + 7}
                >
                  {formatAxisCurrency(tick)}
                </text>
              </g>
            );
          })}

          {chartPoints.map((point) => (
            <g key={point.year}>
              <line
                className="blog-salary-distribution-development-year-line"
                x1={point.x}
                x2={point.x}
                y1={plot.top}
                y2={plot.top + plotHeight}
              />
              <text
                className="blog-salary-distribution-development-x-tick"
                textAnchor="middle"
                x={point.x}
                y={plot.top + plotHeight + 48}
              >
                {point.year}
              </text>
            </g>
          ))}

          <path className="blog-salary-distribution-development-band" d={bandPath} />
          <path className="blog-salary-distribution-development-line is-p25" d={p25Path} />
          <path className="blog-salary-distribution-development-line is-p75" d={p75Path} />
          <path className="blog-salary-distribution-development-line is-median" d={medianPath} />

          {chartPoints.flatMap((point) =>
            (["p25", "median", "p75"] as const).map((metric) => {
              const y = metric === "p25" ? point.p25Y : metric === "median" ? point.medianY : point.p75Y;
              const value = point[metric];
              const isActive = activePoint?.year === point.year && activePoint.metric === metric;
              const showPoint = (pinned: boolean) => setActivePoint({
                metric,
                pinned,
                value,
                x: point.x,
                y,
                year: point.year,
              });

              return (
                <circle
                  aria-label={`${point.year}, ${metricContent[metric].label}: ${formatCurrency(value)}`}
                  className={`blog-salary-distribution-development-point is-${metric}`}
                  cx={point.x}
                  cy={y}
                  data-active={isActive ? "true" : undefined}
                  key={`${point.year}-${metric}`}
                  onBlur={() => setActivePoint((current) => current?.pinned ? current : null)}
                  onClick={() => showPoint(true)}
                  onFocus={() => showPoint(false)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      showPoint(true);
                    }
                  }}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") {
                      showPoint(false);
                    }
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") {
                      setActivePoint((current) => current?.pinned ? current : null);
                    }
                  }}
                  r={metric === "median" ? 7.5 : 6}
                  role="button"
                  tabIndex={0}
                />
              );
            }),
          )}

          <line
            className="blog-salary-distribution-development-axis"
            x1={plot.left}
            x2={width - plot.right}
            y1={plot.top + plotHeight}
            y2={plot.top + plotHeight}
          />

          {activePoint ? <PointTooltip point={activePoint} onClose={() => setActivePoint(null)} /> : null}
        </svg>
      </div>

      <figcaption className="blog-chart-footer blog-salary-distribution-development-footer">
        <span><strong>Kilde:</strong> {source}</span>
        {note ? <span>{note}</span> : null}
      </figcaption>
    </figure>
  );
}

function MetricLegendItem({
  active,
  metric,
  onToggle,
}: {
  active: boolean;
  metric: DistributionMetric;
  onToggle: () => void;
}) {
  const content = metricContent[metric];

  return (
    <span>
      <i aria-hidden="true" className={`is-${metric}`} />
      {content.label}
      <button
        aria-expanded={active}
        aria-label={`Hva betyr ${content.label}?`}
        className="blog-salary-distribution-development-info-button"
        onClick={onToggle}
        type="button"
      >
        i
      </button>
    </span>
  );
}

function PointTooltip({ point, onClose }: { point: ActivePoint; onClose: () => void }) {
  const tooltipWidth = 286;
  const tooltipHeight = 148;
  const x = clamp(point.x - tooltipWidth / 2, plot.left + 6, width - plot.right - tooltipWidth);
  const y = point.y - tooltipHeight - 20 >= 8 ? point.y - tooltipHeight - 20 : point.y + 20;
  const content = metricContent[point.metric];

  return (
    <foreignObject
      className="blog-salary-distribution-development-tooltip-object"
      height={tooltipHeight}
      width={tooltipWidth}
      x={x}
      y={y}
    >
      <div className="blog-salary-distribution-development-tooltip" role="tooltip">
        <div className="blog-salary-distribution-development-tooltip-heading">
          <span>{point.year} · {content.label}</span>
          <button aria-label="Lukk informasjonsboks" onClick={onClose} type="button">×</button>
        </div>
        <strong>{formatCurrencyShort(point.value)}</strong>
        <p>{content.description}</p>
      </div>
    </foreignObject>
  );
}

function isCompletePoint(point: BlogSalaryDistributionDevelopmentPoint) {
  return (
    /^\d{4}$/.test(point.year) &&
    [point.p25, point.median, point.p75].every(Number.isFinite) &&
    point.p25 <= point.median &&
    point.median <= point.p75
  );
}

function toLinePath(points: { x: number; y: number }[]) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function toBandPath(
  points: { x: number; p25Y: number; p75Y: number }[],
) {
  const upper = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.p75Y}`);
  const lower = [...points].reverse().map((point) => `L ${point.x} ${point.p25Y}`);

  return [...upper, ...lower, "Z"].join(" ");
}

function getAxis(values: number[]) {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const roughStep = (maxValue - minValue) / 5;
  const step = getNiceStep(roughStep);
  const min = Math.max(0, Math.floor(minValue / step) * step);
  const max = Math.ceil(maxValue / step) * step;
  const ticks = [];

  for (let tick = min; tick <= max; tick += step) {
    ticks.push(tick);
  }

  return { min, max, ticks };
}

function getNiceStep(value: number) {
  if (value <= 0) {
    return 5000;
  }

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const multiplier = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;

  return Math.max(1000, multiplier * magnitude);
}

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString("nb-NO")} kroner`;
}

function formatCurrencyShort(value: number) {
  return `${Math.round(value).toLocaleString("nb-NO")} kr`;
}

function formatAxisCurrency(value: number) {
  return Math.round(value).toLocaleString("nb-NO");
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
