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
const width = 920;
const height = 520;
const plot = {
  top: 50,
  right: 278,
  bottom: 80,
  left: 88,
};
const plotWidth = width - plot.left - plot.right;
const plotHeight = height - plot.top - plot.bottom;

export function BlogSalaryDevelopmentChart({
  title,
  subtitle,
  source,
  note,
  series,
  yAxisLabel = "Median månedslønn",
}: BlogSalaryDevelopmentChartProps) {
  const normalizedSeries = series.filter((entry) => entry.points.length > 0);

  if (normalizedSeries.length === 0) {
    return null;
  }

  const primarySeries = normalizedSeries[0];
  const primaryStart = primarySeries.points[0];
  const primaryEnd = primarySeries.points.at(-1);
  const values = normalizedSeries.flatMap((entry) => entry.points.map((point) => point.value));
  const axis = getAxis(values);
  const labels = primarySeries.points.map((point) => point.label);
  const growthValue = primaryStart && primaryEnd ? primaryEnd.value - primaryStart.value : 0;
  const growthPercent = primaryStart && primaryEnd && primaryStart.value > 0 ? (growthValue / primaryStart.value) * 100 : 0;
  const titleId = `${slugify(title)}-title`;

  const xForIndex = (index: number) => plot.left + (index / Math.max(labels.length - 1, 1)) * plotWidth;
  const yForValue = (value: number) =>
    plot.top + plotHeight - ((value - axis.min) / Math.max(axis.max - axis.min, 1)) * plotHeight;

  return (
    <figure className="blog-chart blog-chart-bubble-figure" aria-labelledby={titleId}>
      <div className="blog-chart-header">
        <div>
          <h3 className="blog-chart-title" id={titleId}>
            {title}
          </h3>
          {subtitle ? <p className="blog-chart-subtitle">{subtitle}</p> : null}
        </div>
      </div>

      <div className="blog-chart-svg-wrap blog-chart-bubble-wrap">
        <svg aria-label={`${title}. ${yAxisLabel}.`} role="img" viewBox={`0 0 ${width} ${height}`}>
          {axis.ticks.map((tick) => {
            const y = yForValue(tick);

            return (
              <g key={tick}>
                <line className="blog-chart-bubble-gridline" x1={plot.left} x2={width - plot.right} y1={y} y2={y} />
                <text className="blog-chart-bubble-tick" textAnchor="end" x={plot.left - 14} y={y + 5}>
                  {formatAxisCurrency(tick)}
                </text>
              </g>
            );
          })}

          {labels.map((label, index) => {
            const x = xForIndex(index);

            return (
              <g key={label}>
                <line className="blog-chart-bubble-gridline" x1={x} x2={x} y1={plot.top} y2={plot.top + plotHeight} />
                <text className="blog-chart-bubble-tick" textAnchor="middle" x={x} y={height - 30}>
                  {label}
                </text>
              </g>
            );
          })}

          <line
            className="blog-chart-bubble-axis"
            x1={plot.left}
            x2={width - plot.right}
            y1={plot.top + plotHeight}
            y2={plot.top + plotHeight}
          />

          {normalizedSeries.map((entry, seriesIndex) => {
            const color = entry.color ?? defaultColors[seriesIndex % defaultColors.length];
            const points = entry.points.map((point, index) => ({
              ...point,
              x: xForIndex(index),
              y: yForValue(point.value),
            }));
            const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
            const firstPoint = points[0];
            const lastPoint = points.at(-1);

            return (
              <g key={entry.label}>
                <path d={path} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                {points.map((point, index) => {
                  const isEndpoint = index === 0 || index === points.length - 1;

                  return (
                    <g key={`${entry.label}-${point.label}`}>
                      <circle
                        aria-label={`${entry.label}, ${point.label}: ${formatCurrency(point.value)}`}
                        cx={point.x}
                        cy={point.y}
                        fill="#fff7ee"
                        r={isEndpoint ? 6 : 4}
                        stroke={color}
                        strokeWidth="3"
                      />
                      {isEndpoint ? (
                        <text
                          className="blog-chart-bubble-label"
                          textAnchor={index === 0 ? "start" : "end"}
                          x={point.x + (index === 0 ? 12 : -12)}
                          y={point.y - 12}
                        >
                          {formatCurrency(point.value)}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
                {firstPoint && lastPoint ? (
                  <g>
                    <line
                      className="blog-chart-bubble-gridline"
                      strokeDasharray="4 6"
                      strokeWidth="1.5"
                      x1={firstPoint.x}
                      x2={lastPoint.x}
                      y1={lastPoint.y}
                      y2={lastPoint.y}
                    />
                    <text fill={color} fontSize="17" fontWeight="800" x={lastPoint.x + 18} y={lastPoint.y - 6}>
                      {entry.label}
                    </text>
                    <text fill="#6d6258" fontSize="14" fontWeight="700" x={lastPoint.x + 18} y={lastPoint.y + 16}>
                      {formatSignedCurrency(growthValue)} ({formatSignedPercent(growthPercent)})
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}

          <text className="blog-chart-bubble-axis-label" textAnchor="middle" x={plot.left + plotWidth / 2} y={height - 8}>
            {yAxisLabel}
          </text>
        </svg>
      </div>

      <figcaption className="blog-chart-footer">
        <span>Kilde: {source}</span>
        {note ? <span>{note}</span> : null}
      </figcaption>
    </figure>
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
