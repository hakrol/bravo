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
  brandText?: string | null;
  format?: "currency" | "percent";
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
  format?: "currency" | "percent";
  axisMax?: number;
  ticks?: number[];
};

const width = 920;
const height = 820;
const plot = {
  top: 286,
  right: 88,
  bottom: 118,
  left: 332,
};
const plotWidth = width - plot.left - plot.right;
const plotHeight = height - plot.top - plot.bottom;
const rowStep = 58;
const barHeight = 40;
const defaultPercentTicks = [-15, -10, -5, 0, 5, 10, 15];
const sansFont = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const monoFont = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

export function EditorialDivergingBarChart({
  title,
  kicker,
  subtitleLabel,
  subtitleText,
  source,
  brandText = null,
  format = "percent",
  ticks = defaultPercentTicks,
  data,
}: EditorialDivergingBarChartProps) {
  const axisMin = Math.min(...ticks);
  const axisMax = Math.max(...ticks);
  const xForValue = (value: number) => plot.left + ((value - axisMin) / (axisMax - axisMin)) * plotWidth;
  const zeroX = xForValue(0);
  const titleLines = splitTitle(title);
  const ariaTitle = `${title}. ${subtitleLabel}: ${subtitleText}`;

  return (
    <figure className="my-10 w-full" aria-label={ariaTitle}>
      <div className="mx-auto w-full max-w-[920px] overflow-visible">
        <svg
          className="h-auto w-full overflow-visible bg-white"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>{ariaTitle}</title>
          <rect fill="#fff7ee" height={height} width={width} />

          <text
            fill="#111111"
            fontFamily={sansFont}
            fontSize="20"
            fontWeight="760"
            letterSpacing="0.09em"
            textAnchor="middle"
            x={width / 2}
            y="43"
          >
            {kicker.toUpperCase()}
          </text>

          {titleLines.map((line, index) => (
            <text
              key={line}
              fill="#101820"
              fontFamily={sansFont}
              fontSize={titleLines.length > 1 ? 58 : 68}
              fontWeight="760"
              letterSpacing="0"
              textAnchor="middle"
              x={width / 2}
              y={titleLines.length > 1 ? 100 + index * 64 : 118}
            >
              {line}
            </text>
          ))}

          <text
            fill="#111111"
            fontFamily={sansFont}
            fontSize="19"
            textAnchor="middle"
            x={width / 2}
            y={titleLines.length > 1 ? 230 : 206}
          >
            <tspan fontWeight="760">{subtitleLabel}</tspan>
            <tspan dx="12">{subtitleText}</tspan>
          </text>

          <g aria-hidden="true">
            {ticks.map((tick) => {
              const x = xForValue(tick);
              return (
                <g key={tick}>
                  <line
                    stroke={tick === 0 ? "#111111" : "rgba(17, 17, 17, 0.08)"}
                    strokeWidth={tick === 0 ? 2.5 : 1}
                    x1={x}
                    x2={x}
                    y1={plot.top - 8}
                    y2={plot.top + plotHeight + 10}
                  />
                </g>
              );
            })}
            {data.map((row, index) => {
              const y = plot.top + index * rowStep + barHeight / 2;
              return (
                <line
                  key={`${row.label}-grid`}
                  stroke="rgba(17, 17, 17, 0.055)"
                  strokeWidth="1"
                  x1={plot.left - 20}
                  x2={width - plot.right}
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
            const labelWeight = row.highlight ? 760 : 620;
            const fill = row.highlight ? "#d8c0ac" : getBarColor(row.value, axisMin, axisMax);
            const labelLines = splitLabel(row.label);
            const labelText = (
              <text
                fill="#242424"
                fontFamily={sansFont}
                fontSize="19"
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
              <g key={row.label}>
                {row.href ? (
                  <a href={row.href} style={{ cursor: "pointer", textDecoration: "none" }}>
                    {labelText}
                  </a>
                ) : (
                  labelText
                )}
                <rect fill={fill} height={barHeight} width={barWidth} x={barX} y={y} />
                <text
                  fill="#111111"
                  fontFamily={monoFont}
                  fontSize="20"
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
            <text
              fill="#000000"
              fontFamily={sansFont}
              fontSize="33"
              fontWeight="760"
              x="0"
              y={height - 22}
            >
              {brandText}
            </text>
          ) : null}
          <text
            fill="#7a7a7a"
            fontFamily={sansFont}
            fontSize="19"
            textAnchor="end"
            x={width - 2}
            y={height - 25}
          >
            Kilde: {source}
          </text>
        </svg>
      </div>
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
    <figure className="my-10 w-full" aria-label={ariaTitle}>
      <div className="mx-auto w-full max-w-[920px] overflow-visible">
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
    return blendColor("#c9f4e5", "#45e7d7", intensity);
  }

  const intensity = Math.min((value - Math.max(axisMin, 0)) / Math.max(axisMax - Math.max(axisMin, 0), 1), 1);
  return blendColor("#efc0a8", "#ff1d0d", intensity);
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

function formatValue(value: number, format: "currency" | "percent", digits: number) {
  if (format === "currency") {
    return `${Math.round(value).toLocaleString("nb-NO")} kr`;
  }

  return `${value.toFixed(digits)}%`;
}
