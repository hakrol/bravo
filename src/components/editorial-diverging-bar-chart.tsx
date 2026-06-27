export type EditorialDivergingBarChartDatum = {
  label: string;
  value: number;
  highlight?: boolean;
  href?: string;
};

type EditorialDivergingBarChartProps = {
  title: string;
  kicker: string;
  subtitleLabel: string;
  subtitleText: string;
  source: string;
  note?: string;
  brandText?: string | null;
  format?: "currency" | "number" | "percent";
  ticks?: number[];
  data: EditorialDivergingBarChartDatum[];
};

type EditorialVerticalBarChartProps = {
  title: string;
  kicker: string;
  subtitleLabel: string;
  subtitleText: string;
  source: string;
  data: EditorialDivergingBarChartDatum[];
  format?: "currency" | "number" | "percent";
  axisMax?: number;
  ticks?: number[];
};

const width = 920;
const plot = {
  top: 44,
  right: 118,
  bottom: 78,
  left: 332,
};
const plotWidth = width - plot.left - plot.right;
const rowStep = 58;
const barHeight = 38;
const defaultPercentTicks = [-15, -10, -5, 0, 5, 10, 15];
const sansFont = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const monoFont = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

export function EditorialDivergingBarChart({
  title,
  kicker,
  subtitleLabel,
  subtitleText,
  source,
  note,
  brandText = null,
  format = "percent",
  ticks = defaultPercentTicks,
  data,
}: EditorialDivergingBarChartProps) {
  const axisMin = Math.min(...ticks);
  const axisMax = Math.max(...ticks);
  const xForValue = (value: number) => plot.left + ((value - axisMin) / (axisMax - axisMin)) * plotWidth;
  const zeroX = xForValue(0);
  const chartHeight = plot.top + Math.max(data.length, 1) * rowStep + plot.bottom + 16;
  const plotHeight = chartHeight - plot.top - plot.bottom;
  const ariaTitle = `${title}. ${subtitleLabel}: ${subtitleText}`;
  const axisLabel = format === "currency" ? `${subtitleLabel} (kroner)` : subtitleLabel;

  return (
    <figure className="blog-chart blog-editorial-chart-figure blog-editorial-bar-figure" aria-label={ariaTitle}>
      <div className="blog-chart-header">
        <div>
          <p className="blog-chart-kicker">{kicker}</p>
          <h3 className="blog-chart-title">{title}</h3>
          <p className="blog-chart-subtitle">
            <strong>{subtitleLabel}</strong> {subtitleText}
          </p>
        </div>
      </div>

      <p className="blog-editorial-bar-axis-heading">{axisLabel}</p>

      <div className="blog-editorial-bar-wrap">
        <svg
          className="blog-editorial-bar-svg"
          role="img"
          viewBox={`0 0 ${width} ${chartHeight}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>{ariaTitle}</title>

          <g aria-hidden="true">
            {ticks.map((tick) => {
              const x = xForValue(tick);
              return (
                <g key={tick}>
                  <line
                    className={tick === 0 ? "blog-editorial-bar-zero-axis" : "blog-editorial-bar-gridline"}
                    x1={x}
                    x2={x}
                    y1={plot.top - 8}
                    y2={plot.top + plotHeight + 14}
                  />
                  <text className="blog-editorial-bar-tick" textAnchor="middle" x={x} y={plot.top + plotHeight + 48}>
                    {formatAxisTick(tick, format)}
                  </text>
                </g>
              );
            })}
            {data.map((row, index) => {
              const y = plot.top + index * rowStep + barHeight / 2;
              return (
                <line
                  key={`${row.label}-grid`}
                  className="blog-editorial-bar-rowline"
                  x1={plot.left - 20}
                  x2={width - plot.right + 8}
                  y1={y + barHeight / 2 + 2}
                  y2={y + barHeight / 2 + 2}
                />
              );
            })}
          </g>

          {data.map((row, index) => {
            const y = plot.top + index * rowStep;
            const valueX = xForValue(row.value);
            const barX = Math.min(zeroX, valueX);
            const barWidth = Math.max(Math.abs(valueX - zeroX), row.value === 0 ? 2 : 0);
            const isPositive = row.value >= 0;
            const valueLabelX = isPositive ? valueX + 16 : valueX - 16;
            const valueAnchor = isPositive ? "start" : "end";
            const isReference = isReferenceRow(row);
            const labelWeight = row.highlight || isReference ? 780 : 640;
            const fill = isReference ? "#d8c7b5" : row.highlight ? "#14532d" : getBarColor(row.value, axisMin, axisMax);
            const labelLines = splitLabel(row.label);
            const labelText = (
              <text
                className="blog-editorial-bar-label"
                data-highlight={row.highlight || isReference ? "true" : undefined}
                fontSize="18"
                fontWeight={labelWeight}
                textAnchor="end"
              >
                {labelLines.map((line, lineIndex) => (
                  <tspan key={line} x={plot.left - 24} y={y + (labelLines.length > 1 ? 17 + lineIndex * 22 : 28)}>
                    {line}
                  </tspan>
                ))}
              </text>
            );

            return (
              <g
                key={row.label}
                className="blog-editorial-bar-row"
                data-highlight={row.highlight ? "true" : undefined}
                data-reference={isReference ? "true" : undefined}
                style={{ animationDelay: `${index * 55}ms` }}
              >
                {isReference ? (
                  <rect
                    className="blog-editorial-bar-reference-bg"
                    fill="rgba(216, 238, 227, 0.45)"
                    height={barHeight + 20}
                    rx="7"
                    stroke="rgba(20, 83, 45, 0.1)"
                    strokeWidth="1"
                    width={width - plot.left - 36}
                    x={plot.left - 12}
                    y={y - 10}
                  />
                ) : null}
                {row.href ? (
                  <a href={row.href} style={{ cursor: "pointer", textDecoration: "none" }}>
                    {labelText}
                  </a>
                ) : (
                  labelText
                )}
                <rect className="blog-editorial-bar-fill" fill={fill} height={barHeight} rx="6" width={barWidth} x={barX} y={y} />
                {isReference ? (
                  <g className="blog-editorial-bar-reference-badge">
                    <rect
                      fill="#eff8ef"
                      height="26"
                      rx="13"
                      stroke="rgba(20, 83, 45, 0.22)"
                      strokeWidth="1"
                      width="92"
                      x={plot.left - 114}
                      y={y + 6}
                    />
                    <text
                      fill="#14532d"
                      fontSize="12"
                      fontWeight="820"
                      letterSpacing="0"
                      textAnchor="middle"
                      x={plot.left - 68}
                      y={y + 24}
                    >
                      Alle yrker
                    </text>
                  </g>
                ) : null}
                <text
                  className="blog-editorial-bar-value"
                  fontFamily={monoFont}
                  fontSize="19"
                  fontWeight={row.highlight ? 760 : 620}
                  textAnchor={valueAnchor}
                  x={valueLabelX}
                  y={y + 28}
                >
                  {formatValue(row.value, format, 1)}
                </text>
              </g>
            );
          })}

          {brandText ? (
            <text className="blog-editorial-bar-brand" fontSize="28" fontWeight="760" x="0" y={chartHeight - 20}>
              {brandText}
            </text>
          ) : null}
        </svg>
      </div>

      <figcaption className="blog-chart-footer blog-editorial-bar-footer">
        <span className="blog-editorial-bar-source">
          <span aria-hidden="true" className="blog-editorial-bar-info">
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

export function EditorialVerticalBarChart({
  title,
  kicker,
  subtitleLabel,
  subtitleText,
  source,
  data,
  format = "currency",
  axisMax = 420,
  ticks = [0, 100, 200, 300, 400],
}: EditorialVerticalBarChartProps) {
  const chartWidth = 920;
  const chartHeight = 760;
  const padding = {
    top: 262,
    right: 58,
    bottom: 150,
    left: 78,
  };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const titleLines = splitTitle(title);
  const step = innerWidth / Math.max(data.length, 1);
  const barWidth = Math.min(82, step * 0.58);
  const yForValue = (value: number) => padding.top + innerHeight - (value / axisMax) * innerHeight;
  const ariaTitle = `${title}. ${subtitleLabel}: ${subtitleText}`;

  return (
    <figure className="blog-editorial-chart-figure my-10 w-full" aria-label={ariaTitle}>
      <div className="mx-auto w-full max-w-[60rem] overflow-visible">
        <svg
          className="h-auto w-full overflow-visible bg-white"
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>{ariaTitle}</title>
          <rect fill="#fff7ee" height={chartHeight} width={chartWidth} />

          <text
            fill="#111111"
            fontFamily={sansFont}
            fontSize="20"
            fontWeight="760"
            letterSpacing="0.09em"
            textAnchor="middle"
            x={chartWidth / 2}
            y="43"
          >
            {kicker.toUpperCase()}
          </text>

          {titleLines.map((line, index) => (
            <text
              key={line}
              fill="#101820"
              fontFamily={sansFont}
              fontSize={titleLines.length > 1 ? 56 : 66}
              fontWeight="760"
              letterSpacing="0"
              textAnchor="middle"
              x={chartWidth / 2}
              y={titleLines.length > 1 ? 100 + index * 62 : 118}
            >
              {line}
            </text>
          ))}

          <text
            fill="#111111"
            fontFamily={sansFont}
            fontSize="18"
            textAnchor="middle"
            x={chartWidth / 2}
            y={titleLines.length > 1 ? 222 : 200}
          >
            <tspan fontWeight="760">{subtitleLabel}</tspan>
            <tspan dx="12">{subtitleText}</tspan>
          </text>

          <g aria-hidden="true">
            {ticks.map((tick) => {
              const y = yForValue(tick);
              return (
                <g key={tick}>
                  <line
                    stroke={tick === 0 ? "#111111" : "rgba(17, 17, 17, 0.08)"}
                    strokeWidth={tick === 0 ? 2 : 1}
                    x1={padding.left}
                    x2={chartWidth - padding.right}
                    y1={y}
                    y2={y}
                  />
                  <text
                    fill="#222222"
                    fontFamily={monoFont}
                    fontSize="16"
                    textAnchor="end"
                    x={padding.left - 14}
                    y={y + 5}
                  >
                    {formatValue(tick, format, 0)}
                  </text>
                </g>
              );
            })}
          </g>

          {data.map((row, index) => {
            const x = padding.left + step * index + (step - barWidth) / 2;
            const y = yForValue(row.value);
            const barFill = row.highlight ? "#d8c0ac" : getBarColor(row.value, 0, axisMax);
            const labelLines = splitLabel(row.label);
            const labelText = (
              <text
                fill="#242424"
                fontFamily={sansFont}
                fontSize="15"
                fontWeight={row.highlight ? 760 : 620}
                textAnchor="middle"
              >
                {labelLines.map((line, lineIndex) => (
                  <tspan key={line} x={x + barWidth / 2} y={padding.top + innerHeight + 34 + lineIndex * 18}>
                    {line}
                  </tspan>
                ))}
              </text>
            );

            return (
              <g key={row.label}>
                <rect fill={barFill} height={padding.top + innerHeight - y} width={barWidth} x={x} y={y} />
                <text
                  fill="#111111"
                  fontFamily={monoFont}
                  fontSize="18"
                  fontWeight={row.highlight ? 760 : 620}
                  textAnchor="middle"
                  x={x + barWidth / 2}
                  y={y - 12}
                >
                  {formatValue(row.value, format, 0)}
                </text>
                {row.href ? (
                  <a href={row.href} style={{ cursor: "pointer", textDecoration: "none" }}>
                    {labelText}
                  </a>
                ) : (
                  labelText
                )}
              </g>
            );
          })}

          <text
            fill="#7a7a7a"
            fontFamily={sansFont}
            fontSize="18"
            textAnchor="end"
            x={chartWidth - 2}
            y={chartHeight - 24}
          >
            Kilde: {source}
          </text>
        </svg>
      </div>
    </figure>
  );
}

function splitTitle(title: string) {
  if (title.length <= 28) {
    return [title];
  }

  const words = title.split(" ");
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function splitLabel(label: string) {
  if (label.length <= 31) {
    return [label];
  }

  const preferredBreaks = ["høyskolelektorer/-lærere", "(videregående skole)"];
  const preferredBreak = preferredBreaks.find((part) => label.includes(part));

  if (preferredBreak) {
    return [label.replace(preferredBreak, "").trim(), preferredBreak];
  }

  const words = label.split(" ");
  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function getBarColor(value: number, axisMin: number, axisMax: number) {
  if (value < 0) {
    const intensity = Math.min(Math.abs(value / Math.min(axisMin, -1)), 1);
    return blendColor("#d8eee3", "#14532d", intensity);
  }

  const intensity = Math.min((value - Math.max(axisMin, 0)) / Math.max(axisMax - Math.max(axisMin, 0), 1), 1);
  return blendColor("#f0b69c", "#ef3b22", intensity);
}

function isReferenceRow(row: EditorialDivergingBarChartDatum) {
  return row.label.trim().toLowerCase() === "alle yrker";
}

function formatAxisTick(value: number, format: "currency" | "number" | "percent") {
  if (format === "currency" || format === "number") {
    return value >= 1000 ? `${Math.round(value / 1000).toLocaleString("nb-NO")}k` : value.toLocaleString("nb-NO");
  }

  return `${value.toLocaleString("nb-NO")}%`;
}

function blendColor(start: string, end: string, amount: number) {
  const startRgb = hexToRgb(start);
  const endRgb = hexToRgb(end);
  const channel = (key: "r" | "g" | "b") => Math.round(startRgb[key] + (endRgb[key] - startRgb[key]) * amount);

  return `rgb(${channel("r")} ${channel("g")} ${channel("b")})`;
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function formatValue(value: number, format: "currency" | "number" | "percent", digits: number) {
  if (format === "currency") {
    return `${Math.round(value).toLocaleString("nb-NO")} kr`;
  }

  if (format === "number") {
    return Math.round(value).toLocaleString("nb-NO");
  }

  return `${value.toFixed(digits)}%`;
}
