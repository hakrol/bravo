"use client";

import { useMemo, useState } from "react";

export type BlogChartDatum = {
  label: string;
  value: number;
  category?: string;
  note?: string;
};

export type BlogChartSeries = {
  label: string;
  color?: string;
  points: BlogChartDatum[];
};

export type BlogChartStackedSegment = {
  label: string;
  value: number;
  color?: string;
  note?: string;
};

export type BlogChartStackedCategory = {
  label: string;
  segments: BlogChartStackedSegment[];
  note?: string;
};

export type BlogChartFormat = "currency" | "number" | "percent";
export type BlogChartType = "bar-horizontal" | "bar-vertical" | "line" | "area" | "stacked-bar";

type BlogChartProps = {
  title: string;
  subtitle?: string;
  source?: string;
  note?: string;
  type?: BlogChartType;
  data?: BlogChartDatum[];
  series?: BlogChartSeries[];
  categories?: BlogChartStackedCategory[];
  sort?: "none" | "ascending" | "descending";
  format?: BlogChartFormat;
  valueSuffix?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  highlightLabel?: string;
  caption?: string;
  primaryColor?: string;
  highlightColor?: string;
  showLegend?: boolean;
  normalizeStacked?: boolean;
};

type ActivePoint = {
  label: string;
  seriesLabel?: string;
  value: number;
  note?: string;
  color: string;
  categoryLabel?: string;
};

const defaultColors = ["#14532d", "#1d4ed8", "#b45309", "#7c3aed"];
const stackedPalette = ["#14532d", "#4d7c5b", "#d98b2b", "#e9c46a", "#cbd5e1"];
const editorialBarColor = "#5f746d";
const editorialHighlightColor = "#14532d";
const axisColor = "rgba(27, 36, 48, 0.38)";
const gridColor = "rgba(27, 36, 48, 0.065)";
const plotTextColor = "#334155";

export function BlogChart({
  title,
  subtitle,
  source = "SSB",
  note,
  type = "bar-horizontal",
  data,
  series,
  categories,
  sort,
  format = "currency",
  valueSuffix,
  xAxisLabel,
  yAxisLabel,
  highlightLabel,
  caption,
  primaryColor = editorialBarColor,
  highlightColor = editorialHighlightColor,
  showLegend = true,
  normalizeStacked = true,
}: BlogChartProps) {
  const resolvedType = categories ? "stacked-bar" : type;
  const resolvedSort = sort ?? (resolvedType === "bar-horizontal" || resolvedType === "bar-vertical" ? "descending" : "none");
  const normalizedSeries = useMemo(
    () => normalizeSeries({ data, series, sort: resolvedSort, highlightLabel }),
    [data, highlightLabel, resolvedSort, series],
  );
  const [activePoint, setActivePoint] = useState<ActivePoint | null>(null);

  const values =
    resolvedType === "stacked-bar"
      ? (categories ?? []).flatMap((category) => category.segments.map((segment) => segment.value))
      : normalizedSeries.flatMap((entry) => entry.points.map((point) => point.value));

  if ((resolvedType !== "stacked-bar" && normalizedSeries.length === 0) || values.length === 0) {
    return null;
  }

  const formatter = (value: number) => formatValue(value, format, valueSuffix);
  const chart =
    resolvedType === "stacked-bar" ? (
      <StackedBarChart
        categories={categories ?? []}
        formatter={formatter}
        normalizeStacked={normalizeStacked}
        onActivePointChange={setActivePoint}
        showLegend={showLegend}
      />
    ) : resolvedType === "bar-horizontal" ? (
      <HorizontalBarChart
        activePoint={activePoint}
        formatter={formatter}
        highlightColor={highlightColor}
        onActivePointChange={setActivePoint}
        primaryColor={primaryColor}
        series={normalizedSeries}
        xAxisLabel={xAxisLabel}
      />
    ) : resolvedType === "bar-vertical" ? (
      <VerticalBarChart
        activePoint={activePoint}
        formatter={formatter}
        onActivePointChange={setActivePoint}
        series={normalizedSeries}
        yAxisLabel={yAxisLabel}
      />
    ) : (
      <LineChart
        activePoint={activePoint}
        formatter={formatter}
        onActivePointChange={setActivePoint}
        series={normalizedSeries}
        type={resolvedType === "area" ? "area" : "line"}
        yAxisLabel={yAxisLabel}
      />
    );

  return (
    <figure className="blog-chart" aria-labelledby={`${slugify(title)}-title`}>
      <div className="blog-chart-header">
        <div>
          <p className="blog-chart-kicker">Grafikk</p>
          <h3 className="blog-chart-title" id={`${slugify(title)}-title`}>
            {title}
          </h3>
          {subtitle ? <p className="blog-chart-subtitle">{subtitle}</p> : null}
        </div>
      </div>

      {chart}

      <figcaption className="blog-chart-footer">
        <span>{source ? `Kilde: ${source}` : "Kilde ikke oppgitt"}</span>
        {note ? <span>{note}</span> : null}
        {caption ? <span>{caption}</span> : null}
      </figcaption>
    </figure>
  );
}

function StackedBarChart({
  categories,
  formatter,
  normalizeStacked,
  onActivePointChange,
  showLegend,
}: {
  categories: BlogChartStackedCategory[];
  formatter: (value: number) => string;
  normalizeStacked: boolean;
  onActivePointChange: (point: ActivePoint | null) => void;
  showLegend: boolean;
}) {
  const legendItems = buildStackedLegend(categories);
  const maxTotal = Math.max(
    ...categories.map((category) => category.segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0)),
    1,
  );
  const axisMax = normalizeStacked ? 100 : getNiceAxisMax(maxTotal);
  const axisTicks = [0, axisMax / 2, axisMax];
  const rows = categories.map((category) => {
    const rawTotal = category.segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0);
    const denominator = normalizeStacked ? rawTotal || 1 : 100;

    return {
      ...category,
      total: rawTotal,
      segments: category.segments.map((segment, index) => {
        const value = Math.max(segment.value, 0);
        const displayValue = normalizeStacked ? (value / denominator) * 100 : value;
        const width = normalizeStacked ? displayValue : (value / axisMax) * 100;

        return {
          ...segment,
          color: segment.color ?? legendItems.find((item) => item.label === segment.label)?.color ?? stackedPalette[index % stackedPalette.length],
          displayValue,
          width,
        };
      }),
    };
  });

  return (
    <div className="blog-chart-stacked" onMouseLeave={() => onActivePointChange(null)}>
      {showLegend ? (
        <div className="blog-chart-legend" aria-label="Forklaring">
          {legendItems.map((item) => (
            <span key={item.label} className="blog-chart-legend-item">
              <span aria-hidden="true" className="blog-chart-legend-swatch" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      ) : null}

      <div className="blog-chart-stacked-axis" aria-hidden="true">
        {axisTicks.map((tick) => (
          <span key={tick}>{formatter(tick)}</span>
        ))}
      </div>

      <div className="blog-chart-stacked-rows">
        {rows.map((category) => (
          <div key={category.label} className="blog-chart-stacked-row">
            <div className="blog-chart-stacked-label">
              <span>{category.label}</span>
              {category.note ? <small>{category.note}</small> : null}
            </div>
            <div className="blog-chart-stacked-track">
              <span aria-hidden="true" className="blog-chart-stacked-reference" />
              {category.segments.map((segment) => {
                const labelFits = segment.width >= 11;
                const activePayload = {
                  categoryLabel: category.label,
                  color: segment.color,
                  label: segment.label,
                  note: segment.note,
                  value: segment.displayValue,
                };

                return (
                  <button
                    key={`${category.label}-${segment.label}`}
                    aria-label={`${category.label}, ${segment.label}: ${formatter(activePayload.value)}`}
                    className="blog-chart-stacked-segment"
                    data-small={labelFits ? undefined : "true"}
                    onBlur={() => onActivePointChange(null)}
                    onClick={() => onActivePointChange(activePayload)}
                    onFocus={() => onActivePointChange(activePayload)}
                    onMouseEnter={() => onActivePointChange(activePayload)}
                    style={{
                      background: segment.color,
                      width: `${Math.max(segment.width, 0)}%`,
                    }}
                    type="button"
                  >
                    {labelFits ? <span>{formatter(segment.displayValue)}</span> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalBarChart({
  activePoint,
  formatter,
  highlightColor,
  onActivePointChange,
  primaryColor,
  series,
  xAxisLabel,
}: {
  activePoint: ActivePoint | null;
  formatter: (value: number) => string;
  highlightColor: string;
  onActivePointChange: (point: ActivePoint | null) => void;
  primaryColor: string;
  series: BlogChartSeries[];
  xAxisLabel?: string;
}) {
  const points = series[0].points;
  const axisMax = getNiceAxisMax(Math.max(...points.map((point) => point.value), 1));
  const ticks = buildTicks(0, axisMax, 4);

  return (
    <div className="blog-chart-bars" onMouseLeave={() => onActivePointChange(null)}>
      <div className="blog-chart-axis blog-chart-axis-horizontal" aria-hidden="true">
        {ticks.map((tick) => (
          <span key={tick} style={{ left: `${(tick / axisMax) * 100}%` }}>
            {formatCompactTick(tick)}
          </span>
        ))}
      </div>
      {points.map((point) => {
        const color = point.category === "highlight" ? highlightColor : primaryColor;
        const active = activePoint?.label === point.label;
        const activePayload = {
          ...point,
          color,
          seriesLabel: series[0].label !== "Verdi" ? series[0].label : undefined,
        };

        return (
          <button
            key={point.label}
            aria-label={`${point.label}: ${formatter(point.value)}`}
            className="blog-chart-bar-row"
            data-active={active ? "true" : undefined}
            data-highlight={point.category === "highlight" ? "true" : undefined}
            onBlur={() => onActivePointChange(null)}
            onClick={() => onActivePointChange(active ? null : activePayload)}
            onFocus={() => onActivePointChange(activePayload)}
            onMouseEnter={() => onActivePointChange(activePayload)}
            type="button"
          >
            <span className="blog-chart-bar-label">{point.label}</span>
            <span className="blog-chart-bar-track">
              {ticks.slice(1).map((tick) => (
                <span
                  key={`${point.label}-${tick}`}
                  aria-hidden="true"
                  className="blog-chart-gridline"
                  style={{ left: `${(tick / axisMax) * 100}%` }}
                />
              ))}
              <span
                className="blog-chart-bar-fill"
                style={{
                  background: color,
                  width: `${Math.max((point.value / axisMax) * 100, 1)}%`,
                }}
              />
            </span>
            <span className="blog-chart-bar-value">{formatter(point.value)}</span>
          </button>
        );
      })}
      {xAxisLabel ? <p className="blog-chart-axis-label">{xAxisLabel}</p> : null}
    </div>
  );
}

function VerticalBarChart({
  activePoint,
  formatter,
  onActivePointChange,
  series,
  yAxisLabel,
}: {
  activePoint: ActivePoint | null;
  formatter: (value: number) => string;
  onActivePointChange: (point: ActivePoint | null) => void;
  series: BlogChartSeries[];
  yAxisLabel?: string;
}) {
  const points = series[0].points;
  const width = 760;
  const height = 320;
  const padding = { top: 18, right: 18, bottom: 58, left: 58 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const ticks = buildTicks(0, maxValue, 4);
  const step = plotWidth / Math.max(points.length, 1);
  const barWidth = Math.min(54, step * 0.58);

  return (
    <div className="blog-chart-svg-wrap" onMouseLeave={() => onActivePointChange(null)}>
      <svg role="img" viewBox={`0 0 ${width} ${height}`}>
        {yAxisLabel ? <title>{yAxisLabel}</title> : null}
        {ticks.map((tick) => {
          const y = padding.top + plotHeight - (tick / maxValue) * plotHeight;
          return (
            <g key={tick}>
              <line stroke={gridColor} x1={padding.left} x2={width - padding.right} y1={y} y2={y} />
              <text fill={axisColor} fontSize="12" textAnchor="end" x={padding.left - 10} y={y + 4}>
                {formatCompactTick(tick)}
              </text>
            </g>
          );
        })}
        {points.map((point, index) => {
          const color = point.category === "highlight" ? "#14532d" : defaultColors[index % defaultColors.length];
          const x = padding.left + step * index + (step - barWidth) / 2;
          const barHeight = (point.value / maxValue) * plotHeight;
          const y = padding.top + plotHeight - barHeight;
          const activePayload = { ...point, color };

          return (
            <g key={point.label}>
              <rect
                aria-label={`${point.label}: ${formatter(point.value)}`}
                fill={color}
                height={barHeight}
                opacity={activePoint?.label === point.label ? 1 : 0.84}
                role="button"
                tabIndex={0}
                width={barWidth}
                x={x}
                y={y}
                onBlur={() => onActivePointChange(null)}
                onFocus={() => onActivePointChange(activePayload)}
                onMouseEnter={() => onActivePointChange(activePayload)}
              />
              <text fill={plotTextColor} fontSize="12" textAnchor="middle" x={x + barWidth / 2} y={height - 24}>
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LineChart({
  activePoint,
  formatter,
  onActivePointChange,
  series,
  type,
  yAxisLabel,
}: {
  activePoint: ActivePoint | null;
  formatter: (value: number) => string;
  onActivePointChange: (point: ActivePoint | null) => void;
  series: BlogChartSeries[];
  type: "line" | "area";
  yAxisLabel?: string;
}) {
  const width = 760;
  const height = 320;
  const padding = { top: 18, right: 24, bottom: 48, left: 58 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const values = series.flatMap((entry) => entry.points.map((point) => point.value));
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(...values, 1);
  const ticks = buildTicks(minValue, maxValue, 4);
  const labels = series[0].points.map((point) => point.label);
  const xStep = plotWidth / Math.max(labels.length - 1, 1);
  const yForValue = (value: number) =>
    padding.top + plotHeight - ((value - minValue) / Math.max(maxValue - minValue, 1)) * plotHeight;

  return (
    <div className="blog-chart-svg-wrap" onMouseLeave={() => onActivePointChange(null)}>
      <svg role="img" viewBox={`0 0 ${width} ${height}`}>
        {yAxisLabel ? <title>{yAxisLabel}</title> : null}
        {ticks.map((tick) => {
          const y = yForValue(tick);
          return (
            <g key={tick}>
              <line stroke={gridColor} x1={padding.left} x2={width - padding.right} y1={y} y2={y} />
              <text fill={axisColor} fontSize="12" textAnchor="end" x={padding.left - 10} y={y + 4}>
                {formatCompactTick(tick)}
              </text>
            </g>
          );
        })}
        {series.map((entry, seriesIndex) => {
          const color = entry.color ?? defaultColors[seriesIndex % defaultColors.length];
          const points = entry.points.map((point, index) => ({
            ...point,
            x: padding.left + xStep * index,
            y: yForValue(point.value),
          }));
          const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
          const areaPath = `${path} L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${
            padding.top + plotHeight
          } Z`;

          return (
            <g key={entry.label}>
              {type === "area" ? <path d={areaPath} fill={color} opacity="0.12" /> : null}
              <path d={path} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              {points.map((point) => {
                const activePayload = {
                  label: point.label,
                  seriesLabel: entry.label,
                  value: point.value,
                  note: point.note,
                  color,
                };

                return (
                  <circle
                    key={`${entry.label}-${point.label}`}
                    aria-label={`${entry.label}, ${point.label}: ${formatter(point.value)}`}
                    cx={point.x}
                    cy={point.y}
                    fill="#ffffff"
                    r={activePoint?.label === point.label && activePoint.seriesLabel === entry.label ? 6 : 4}
                    role="button"
                    stroke={color}
                    strokeWidth="3"
                    tabIndex={0}
                    onBlur={() => onActivePointChange(null)}
                    onFocus={() => onActivePointChange(activePayload)}
                    onMouseEnter={() => onActivePointChange(activePayload)}
                  />
                );
              })}
            </g>
          );
        })}
        {labels.map((label, index) => (
          <text key={label} fill={plotTextColor} fontSize="12" textAnchor="middle" x={padding.left + xStep * index} y={height - 20}>
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function normalizeSeries({
  data,
  highlightLabel,
  series,
  sort,
}: {
  data?: BlogChartDatum[];
  highlightLabel?: string;
  series?: BlogChartSeries[];
  sort: "none" | "ascending" | "descending";
}) {
  const source = series ?? [{ label: "Verdi", points: data ?? [] }];

  return source
    .map((entry, index) => ({
      ...entry,
      color: entry.color ?? defaultColors[index % defaultColors.length],
      points: sortPoints(entry.points, sort).map((point) => ({
        ...point,
        category: point.category ?? (point.label === highlightLabel ? "highlight" : undefined),
      })),
    }))
    .filter((entry) => entry.points.length > 0);
}

function buildStackedLegend(categories: BlogChartStackedCategory[]) {
  const seen = new Map<string, string>();

  categories.forEach((category) => {
    category.segments.forEach((segment) => {
      if (!seen.has(segment.label)) {
        seen.set(segment.label, segment.color ?? stackedPalette[seen.size % stackedPalette.length]);
      }
    });
  });

  return Array.from(seen, ([label, color]) => ({ label, color }));
}

function sortPoints(points: BlogChartDatum[], sort: "none" | "ascending" | "descending") {
  if (sort === "none") {
    return points;
  }

  return [...points].sort((left, right) => (sort === "ascending" ? left.value - right.value : right.value - left.value));
}

function buildTicks(minValue: number, maxValue: number, count: number) {
  const range = Math.max(maxValue - minValue, 1);
  return Array.from({ length: count + 1 }, (_, index) => Math.round(minValue + (range / count) * index));
}

function getNiceAxisMax(maxValue: number) {
  if (maxValue <= 0) {
    return 1;
  }

  const rawStep = maxValue / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const niceMultiplier = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const step = niceMultiplier * magnitude;

  return step * Math.ceil(maxValue / step);
}

function formatValue(value: number, format: BlogChartFormat, valueSuffix?: string) {
  const number = new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: format === "percent" ? 1 : 0,
    minimumFractionDigits: 0,
  }).format(value);

  if (valueSuffix) {
    return `${number} ${valueSuffix}`;
  }

  if (format === "currency") {
    return `${number} kr`;
  }

  if (format === "percent") {
    return `${number} %`;
  }

  return number;
}

function formatCompactTick(value: number) {
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 1000).toLocaleString("nb-NO")}k`;
  }

  return value.toLocaleString("nb-NO");
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
