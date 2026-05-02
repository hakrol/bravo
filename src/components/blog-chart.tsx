"use client";

import { useEffect, useMemo, useState } from "react";

export type BlogChartDatum = {
  label: string;
  value: number;
  size?: number;
  sizeLabel?: string;
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
export type BlogChartType = "bar-horizontal" | "bar-vertical" | "line" | "area" | "stacked-bar" | "bubble";

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
  size?: number;
  sizeLabel?: string;
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
    ) : resolvedType === "bubble" ? (
      <BubbleChart
        activePoint={activePoint}
        formatter={formatter}
        highlightColor={highlightColor}
        onActivePointChange={setActivePoint}
        primaryColor={primaryColor}
        series={normalizedSeries}
        xAxisLabel={xAxisLabel}
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
    <figure
      className={`blog-chart${resolvedType === "bubble" ? " blog-chart-bubble-figure" : ""}`}
      aria-labelledby={`${slugify(title)}-title`}
    >
      <div className="blog-chart-header">
        <div>
          {resolvedType === "bubble" ? null : <p className="blog-chart-kicker">Grafikk</p>}
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

function BubbleChart({
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
  const [lockedLabel, setLockedLabel] = useState<string | null>(null);
  const points = series[0].points.filter((point) => typeof point.size === "number" && point.size > 0);

  if (points.length === 0) {
    return null;
  }

  const width = 920;
  const height = 520;
  const padding = { top: 78, right: 118, bottom: 92, left: 118 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const values = points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const ticks = buildBubbleTicks(minValue, maxValue);
  const axisMin = ticks[0];
  const axisMax = ticks[ticks.length - 1];
  const maxSize = Math.max(...points.map((point) => point.size ?? 0), 1);

  const xForValue = (value: number) =>
    padding.left + ((value - axisMin) / Math.max(axisMax - axisMin, 1)) * plotWidth;
  const layoutPoints = points.map((point, index) => {
    const color = getBubbleColor(point, index, primaryColor, highlightColor);
    const radius = getBubbleRadius(point, maxSize);
    const x = xForValue(point.value);
    const y = padding.top + getBubbleLane(point.label, index) * plotHeight;

    return {
      point,
      activePayload: {
        ...point,
        color,
        seriesLabel: series[0].label !== "Verdi" ? series[0].label : undefined,
      },
      color,
      labelOffset: getBubbleLabelOffset(point.label, radius),
      radius,
      x,
      y,
    };
  });
  const activeLayout = activePoint ? layoutPoints.find((entry) => entry.point.label === activePoint.label) : undefined;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLockedLabel(null);
        onActivePointChange(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onActivePointChange]);

  function closeTooltip() {
    setLockedLabel(null);
    onActivePointChange(null);
  }

  function showHoverTooltip(point: ActivePoint) {
    if (!lockedLabel) {
      onActivePointChange(point);
    }
  }

  function hideHoverTooltip() {
    if (!lockedLabel) {
      onActivePointChange(null);
    }
  }

  function toggleLockedTooltip(point: ActivePoint) {
    if (lockedLabel === point.label) {
      closeTooltip();
      return;
    }

    setLockedLabel(point.label);
    onActivePointChange(point);
  }

  return (
    <div className="blog-chart-svg-wrap blog-chart-bubble-wrap" onClick={closeTooltip} onMouseLeave={hideHoverTooltip}>
      <svg onClick={closeTooltip} role="img" viewBox={`0 0 ${width} ${height}`}>
        {xAxisLabel ? <title>{xAxisLabel}</title> : null}
        {ticks.map((tick) => {
          const x = xForValue(tick);

          return (
            <g key={tick}>
              <line className="blog-chart-bubble-gridline" x1={x} x2={x} y1={padding.top + 12} y2={padding.top + plotHeight - 8} />
              <text className="blog-chart-bubble-tick" textAnchor="middle" x={x} y={height - 42}>
                {tick.toLocaleString("nb-NO")}
              </text>
            </g>
          );
        })}
        <line
          className="blog-chart-bubble-axis"
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + plotHeight}
          y2={padding.top + plotHeight}
        />
        {layoutPoints.map(({ activePayload, color, labelOffset, point, radius, x, y }) => {
          const active = activePoint?.label === point.label;
          const hasActivePoint = Boolean(activePoint);
          const labelX = clamp(x + labelOffset.x, padding.left + 70, width - padding.right - 70);
          const labelY = clamp(y + labelOffset.y, padding.top + 22, padding.top + plotHeight - 18);
          const showLabel = shouldShowBubbleLabel(point, radius);
          const sizeText = point.sizeLabel ?? `${(point.size ?? 0).toLocaleString("nb-NO")} lønnstakere`;

          return (
            <g key={point.label}>
              <circle
                aria-label={`${point.label}: ${formatter(point.value)}, ${sizeText}`}
                className="blog-chart-bubble"
                cx={x}
                cy={y}
                fill={color}
                opacity={active ? 0.98 : hasActivePoint ? Math.max(getBubbleOpacity(point) - 0.18, 0.34) : getBubbleOpacity(point)}
                r={active ? radius * 1.06 : radius}
                role="button"
                stroke={active ? "#101820" : "rgba(255, 247, 238, 0.92)"}
                strokeWidth={active ? 2.4 : 1.8}
                tabIndex={0}
                onBlur={hideHoverTooltip}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleLockedTooltip(activePayload);
                }}
                onFocus={() => showHoverTooltip(activePayload)}
                onMouseEnter={() => showHoverTooltip(activePayload)}
              />
              {showLabel ? (
                <text className="blog-chart-bubble-label" textAnchor={labelOffset.anchor} x={labelX} y={labelY}>
                  {point.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {activeLayout ? (
          <BubbleTooltip
            formatter={formatter}
            height={height}
            point={activeLayout.point}
            radius={activeLayout.radius}
            width={width}
            x={activeLayout.x}
            y={activeLayout.y}
          />
        ) : null}
        {xAxisLabel ? (
          <text className="blog-chart-bubble-axis-label" textAnchor="middle" x={padding.left + plotWidth / 2} y={height - 10}>
            {xAxisLabel}
          </text>
        ) : null}
      </svg>
    </div>
  );
}

function BubbleTooltip({
  formatter,
  height,
  point,
  radius,
  width,
  x,
  y,
}: {
  formatter: (value: number) => string;
  height: number;
  point: BlogChartDatum;
  radius: number;
  width: number;
  x: number;
  y: number;
}) {
  const tooltipWidth = 236;
  const tooltipHeight = 132;
  const gap = 18;
  const preferredX = x + radius + gap;
  const preferredY = y - radius - tooltipHeight + 14;
  const tooltipX = preferredX + tooltipWidth > width - 24 ? x - radius - gap - tooltipWidth : preferredX;
  const tooltipY = preferredY < 20 ? y + radius + gap : preferredY;
  const safeX = clamp(tooltipX, 20, width - tooltipWidth - 20);
  const safeY = clamp(tooltipY, 20, height - tooltipHeight - 20);
  const employees = `${(point.size ?? 0).toLocaleString("nb-NO")} lønnstakere`;

  return (
    <g className="blog-chart-bubble-tooltip" onClick={(event) => event.stopPropagation()} role="group">
      <rect className="blog-chart-bubble-tooltip-bg" height={tooltipHeight} rx="8" width={tooltipWidth} x={safeX} y={safeY} />
      <text className="blog-chart-bubble-tooltip-title" x={safeX + 16} y={safeY + 28}>
        {point.label}
      </text>
      <text className="blog-chart-bubble-tooltip-label" x={safeX + 16} y={safeY + 58}>
        Median månedslønn
      </text>
      <text className="blog-chart-bubble-tooltip-value" x={safeX + 16} y={safeY + 76}>
        {formatter(point.value)}
      </text>
      <text className="blog-chart-bubble-tooltip-label" x={safeX + 16} y={safeY + 102}>
        Antall lønnstakere
      </text>
      <text className="blog-chart-bubble-tooltip-emphasis" x={safeX + 16} y={safeY + 120}>
        {employees}
      </text>
    </g>
  );
}

function buildBubbleTicks(minValue: number, maxValue: number) {
  if (minValue >= 40000 && maxValue <= 80000) {
    return [45000, 54000, 63000, 71000, 80000];
  }

  const axisMin = Math.max(0, Math.floor(minValue / 5000) * 5000);
  const axisMax = getNiceAxisMax(maxValue);
  return buildTicks(axisMin, axisMax, 4);
}

function getBubbleColor(point: BlogChartDatum, index: number, primaryColor: string, highlightColor: string) {
  if (point.category === "reference") {
    return "#9ca3af";
  }

  if (point.category === "highlight") {
    return highlightColor;
  }

  if (point.label === "Jordmødre") {
    return "#ff4a2f";
  }

  if (point.label === "Spesialsykepleiere") {
    return "#d8c0ac";
  }

  const backgroundPalette = ["#8a9a8c", "#d8cfc3", "#7c8f82", "#c9b8a7", "#aab0a3"];
  return backgroundPalette[index % backgroundPalette.length] ?? primaryColor;
}

function getBubbleOpacity(point: BlogChartDatum) {
  if (point.category === "highlight") {
    return 0.96;
  }

  if (["Jordmødre", "Spesialsykepleiere"].includes(point.label)) {
    return 0.86;
  }

  return 0.62;
}

function getBubbleRadius(point: BlogChartDatum, maxSize: number) {
  const radius = 13 + Math.sqrt((point.size ?? 0) / maxSize) * 21;

  if (point.category === "highlight") {
    return radius + 5;
  }

  return radius;
}

function getBubbleLane(label: string, index: number) {
  const lanes: Record<string, number> = {
    Sykepleiere: 0.49,
    Helsefagarbeidere: 0.74,
    "Andre pleiemedarbeidere": 0.28,
    Jordmødre: 0.18,
    Spesialsykepleiere: 0.35,
    Farmasøyter: 0.62,
    Ambulansepersonell: 0.84,
    "Radiografer mv.": 0.52,
    Helsesekretærer: 0.88,
  };

  return lanes[label] ?? [0.42, 0.24, 0.7, 0.56][index % 4];
}

function shouldShowBubbleLabel(point: BlogChartDatum, radius: number) {
  return (
    point.category === "highlight" ||
    radius >= 23 ||
    ["Jordmødre", "Spesialsykepleiere", "Helsefagarbeidere"].includes(point.label)
  );
}

function getBubbleLabelOffset(label: string, radius: number): { x: number; y: number; anchor: "start" | "middle" | "end" } {
  const offsets: Record<string, { x: number; y: number; anchor: "start" | "middle" | "end" }> = {
    "Jordmødre": { x: 0, y: -radius - 12, anchor: "middle" },
    "Spesialsykepleiere": { x: radius + 14, y: 4, anchor: "start" },
    Sykepleiere: { x: 0, y: radius + 24, anchor: "middle" },
    Helsefagarbeidere: { x: 0, y: radius + 25, anchor: "middle" },
    "Andre pleiemedarbeidere": { x: radius + 15, y: 4, anchor: "start" },
    Helsesekretærer: { x: radius + 13, y: 4, anchor: "start" },
  };

  return offsets[label] ?? { x: radius + 12, y: 4, anchor: "start" };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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
