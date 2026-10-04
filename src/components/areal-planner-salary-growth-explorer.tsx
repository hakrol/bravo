"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import salaryGrowthSnapshot from "@/content/blog/data/arealplanlegger-interaktiv-lonnsutvikling-2025.json";

type SalaryPoint = {
  year: number;
  value: number;
};

type SalaryGrowthSnapshot = {
  title: string;
  subtitle: string;
  source: string;
  note: string;
  points: SalaryPoint[];
};

const snapshot = salaryGrowthSnapshot as SalaryGrowthSnapshot;
const kronerFormatter = new Intl.NumberFormat("nb-NO");

function formatPercent(value: number) {
  const rounded = Math.round(value * 10) / 10;
  const preciseValue = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
  const localizedValue = preciseValue.replace(".", ",");

  if (rounded > 0) return `+${localizedValue} %`;
  if (rounded < 0) return `−${localizedValue.replace("-", "")} %`;
  return "0 %";
}

function percentChange(from: number, to: number) {
  return ((to - from) / from) * 100;
}

function hasHoverPointer(pointerType: string) {
  return pointerType !== "touch" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function ArealPlannerSalaryGrowthExplorer() {
  const points = snapshot.points;
  const firstIndex = 0;
  const latestIndex = points.length - 1;
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(720);
  const [selectedIndex, setSelectedIndex] = useState(firstIndex);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const activeIndex = previewIndex ?? selectedIndex;
  const activePoint = points[activeIndex];
  const latestPoint = points[latestIndex];

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    const updateWidth = () => setChartWidth(Math.max(280, element.clientWidth));
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(() => {
    const height = chartWidth < 440 ? 430 : 450;
    const margin = {
      top: chartWidth < 440 ? 76 : 66,
      right: chartWidth < 440 ? 24 : 28,
      bottom: 54,
      left: chartWidth < 440 ? 72 : 80,
    };
    const plotWidth = chartWidth - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const minValue = Math.floor(Math.min(...points.map((point) => point.value)) / 5000) * 5000;
    const maxValue = Math.ceil(Math.max(...points.map((point) => point.value)) / 5000) * 5000;
    const valueSpan = Math.max(1, maxValue - minValue);
    const x = (index: number) =>
      margin.left + (points.length === 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);
    const y = (value: number) => margin.top + ((maxValue - value) / valueSpan) * plotHeight;
    const ticks = Array.from(
      { length: Math.round(valueSpan / 5000) + 1 },
      (_, index) => minValue + index * 5000,
    );
    const annotationY = y(points[points.length - 1].value);

    return { height, margin, plotWidth, plotHeight, minValue, maxValue, x, y, ticks, annotationY };
  }, [chartWidth, points]);

  const change = percentChange(activePoint.value, latestPoint.value);
  const changeLabel = `${formatPercent(change)} siden ${activePoint.year}`;
  const startX = geometry.x(activeIndex);
  const endX = geometry.x(latestIndex);
  const labelHalfWidth = chartWidth < 440 ? 94 : 108;
  const labelX = Math.min(
    chartWidth - labelHalfWidth,
    Math.max(labelHalfWidth, activeIndex === latestIndex ? endX : (startX + endX) / 2),
  );
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${geometry.x(index)} ${geometry.y(point.value)}`)
    .join(" ");
  const activeLinePath = points
    .slice(activeIndex)
    .map((point, offset) => {
      const index = activeIndex + offset;
      return `${offset === 0 ? "M" : "L"} ${geometry.x(index)} ${geometry.y(point.value)}`;
    })
    .join(" ");

  function showPreview(index: number, pointerType: string) {
    if (hasHoverPointer(pointerType)) setPreviewIndex(index);
  }

  function selectOnTouch(index: number, pointerType: string) {
    if (!hasHoverPointer(pointerType)) {
      setSelectedIndex(index);
      setPreviewIndex(null);
    }
  }

  return (
    <figure
      className="not-prose my-10 overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:my-12"
      aria-labelledby="arealplanner-growth-title"
      aria-describedby="arealplanner-growth-description"
    >
      <header className="border-b border-slate-100 px-5 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-7">
        <p className="mb-2 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#164e63]">
          Lønnsutvikling
        </p>
        <h3
          id="arealplanner-growth-title"
          className="m-0 text-balance font-serif text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.025em] text-slate-950 sm:text-[2.15rem]"
        >
          {snapshot.title}
        </h3>
        <p className="mb-0 mt-2 text-xs text-slate-600 sm:text-base">{snapshot.subtitle}</p>
      </header>

      <div
        ref={chartRef}
        className="relative w-full touch-manipulation select-none"
        onPointerLeave={(event) => {
          if (hasHoverPointer(event.pointerType)) setPreviewIndex(null);
        }}
      >
        <svg
          className="block w-full"
          height={geometry.height}
          viewBox={`0 0 ${chartWidth} ${geometry.height}`}
          role="group"
          aria-label="Interaktiv lønnsutvikling. Velg et år for å sammenligne med siste år."
        >
          <text x={geometry.margin.left} y={geometry.margin.top - 24} fill="#64748b" className="text-xs sm:text-sm">
            Kroner per måned
          </text>

          {geometry.ticks.map((tick) => {
            const tickY = geometry.y(tick);
            return (
              <g key={tick}>
                <line
                  x1={geometry.margin.left}
                  x2={geometry.margin.left + geometry.plotWidth}
                  y1={tickY}
                  y2={tickY}
                  stroke="#dbe3e8"
                  strokeDasharray="3 5"
                />
                <text
                  x={geometry.margin.left - 10}
                  y={tickY + 4}
                  fill="#64748b"
                  className="text-xs sm:text-sm"
                  textAnchor="end"
                >
                  {kronerFormatter.format(tick)}
                </text>
              </g>
            );
          })}

          <line
            x1={geometry.margin.left}
            x2={geometry.margin.left}
            y1={geometry.margin.top}
            y2={geometry.margin.top + geometry.plotHeight}
            stroke="#94a3b8"
          />
          <line
            x1={geometry.margin.left}
            x2={geometry.margin.left + geometry.plotWidth}
            y1={geometry.margin.top + geometry.plotHeight}
            y2={geometry.margin.top + geometry.plotHeight}
            stroke="#94a3b8"
          />

          <path
            d={linePath}
            fill="none"
            stroke="#a8adb3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3.5"
          />
          <path
            d={activeLinePath}
            fill="none"
            stroke="#0b376d"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />

          {activeIndex !== latestIndex ? (
            <g pointerEvents="none" aria-hidden="true" stroke="#0b376d" strokeWidth="2">
              <line x1={startX} x2={endX - 16} y1={geometry.annotationY} y2={geometry.annotationY} />
              <path
                d={`M ${endX - 21} ${geometry.annotationY - 5} L ${endX - 16} ${geometry.annotationY} L ${endX - 21} ${geometry.annotationY + 5}`}
                fill="none"
                strokeLinejoin="round"
              />
            </g>
          ) : null}

          {points.map((point, index) => {
            const pointX = geometry.x(index);
            const pointY = geometry.y(point.value);
            const isActive = index === activeIndex;
            const isLatest = index === latestIndex;
            const accessibleChange = formatPercent(percentChange(point.value, latestPoint.value))
              .replace("+", "pluss ")
              .replace("−", "minus ");

            return (
              <g key={point.year}>
                <line
                  x1={pointX}
                  x2={pointX}
                  y1={geometry.margin.top + geometry.plotHeight}
                  y2={geometry.margin.top + geometry.plotHeight + 6}
                  stroke="#94a3b8"
                />
                <text
                  x={pointX}
                  y={geometry.margin.top + geometry.plotHeight + 25}
                  fill={isActive ? "#0f3d4a" : "#64748b"}
                  className="text-xs sm:text-sm"
                  fontWeight={isActive ? 700 : 500}
                  textAnchor="middle"
                >
                  {point.year}
                </text>

                {isActive && !isLatest ? (
                  <g pointerEvents="none">
                    <rect
                      x={index === 0 ? pointX + 4 : pointX - 122}
                      y={pointY - 74}
                      width="118"
                      height="54"
                      rx="4"
                      fill="white"
                      fillOpacity={0.85}
                    />
                    <text
                      x={index === 0 ? pointX + 10 : pointX - 9}
                      y={pointY - 52}
                      fill="#0b376d"
                      className="text-xs sm:text-sm"
                      fontWeight="600"
                      textAnchor={index === 0 ? "start" : "end"}
                    >
                      {point.year}:
                    </text>
                    <text
                      x={index === 0 ? pointX + 10 : pointX - 9}
                      y={pointY - 30}
                      fill="#0b376d"
                      className="text-xs sm:text-sm"
                      fontWeight="800"
                      textAnchor={index === 0 ? "start" : "end"}
                    >
                      {kronerFormatter.format(point.value)} kr
                    </text>
                  </g>
                ) : null}

                <circle
                  cx={pointX}
                  cy={pointY}
                  r={isActive || isLatest ? 7 : 4.5}
                  fill={index < activeIndex ? "#a8adb3" : "#0b376d"}
                  stroke="white"
                  strokeWidth={isActive || isLatest ? 2 : 1.5}
                  className="transition-[fill,r] duration-[225ms] ease-out motion-reduce:transition-none"
                />

                <circle
                  cx={pointX}
                  cy={pointY}
                  r="22"
                  fill="transparent"
                  role="button"
                  tabIndex={0}
                  aria-label={`${point.year}: ${kronerFormatter.format(point.value)} kroner. Endring til ${latestPoint.year}: ${accessibleChange}.`}
                  onFocus={() => setPreviewIndex(index)}
                  onBlur={() => setPreviewIndex(null)}
                  onPointerEnter={(event) => showPreview(index, event.pointerType)}
                  onPointerDown={(event) => selectOnTouch(index, event.pointerType)}
                  className="cursor-pointer outline-none focus-visible:stroke-[#f59e0b] focus-visible:stroke-2"
                />
              </g>
            );
          })}

          <g pointerEvents="none">
            <rect
              x={endX - 114}
              y={geometry.y(latestPoint.value) + (activeIndex === latestIndex ? -60 : 8)}
              width="118"
              height="54"
              rx="4"
              fill="white"
              fillOpacity={0.85}
            />
            <text
              x={endX - 2}
              y={geometry.y(latestPoint.value) + (activeIndex === latestIndex ? -38 : 30)}
              fill="#0b376d"
              className="text-xs sm:text-sm"
              fontWeight="600"
              textAnchor="end"
            >
              {latestPoint.year}:
            </text>
            <text
              x={endX - 2}
              y={geometry.y(latestPoint.value) + (activeIndex === latestIndex ? -16 : 52)}
              fill="#0b376d"
              className="text-xs sm:text-sm"
              fontWeight="800"
              textAnchor="end"
            >
              {kronerFormatter.format(latestPoint.value)} kr
            </text>
          </g>
        </svg>

        {activeIndex !== latestIndex ? (
          <>
            <div
              className="pointer-events-none absolute z-10 transition-[left,top] duration-[225ms] ease-out motion-reduce:transition-none"
              style={{ left: labelX, top: geometry.annotationY - 7 }}
            >
              <span className="block -translate-x-1/2 -translate-y-full whitespace-nowrap text-xs font-extrabold leading-none text-[#0b376d] sm:text-sm">
                {changeLabel}
              </span>
            </div>
          </>
        ) : null}
      </div>

      <figcaption
        id="arealplanner-growth-description"
        className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:px-7 sm:text-base"
      >
        <span className="font-bold text-slate-700">Kilde: {snapshot.source}.</span>{" "}
        {snapshot.note}
      </figcaption>
    </figure>
  );
}
