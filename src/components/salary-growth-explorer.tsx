"use client";

import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from "react";
import { adjustSalaryPointsForInflation } from "@/lib/salary-inflation";
import { placeSalaryGrowthLabels } from "@/lib/salary-growth-label-layout";
import { findClosestSalaryGrowthSeries, salaryGrowthSeriesDefinitions, type SalaryGrowthSeriesKey } from "@/lib/salary-growth-series";
import type { SalaryGrowthSnapshot } from "@/lib/salary-growth-snapshot";
const kronerFormatter = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });

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

export function SalaryGrowthExplorer({ snapshot }: { snapshot: SalaryGrowthSnapshot }) {
  const growthGradientId = useId();
  const titleId = `${growthGradientId}-title`;
  const descriptionId = `${growthGradientId}-description`;
  const chartId = `${growthGradientId}-chart`;
  const referenceYear = snapshot.points[snapshot.points.length - 1].year;
  const availableSeries = useMemo(
    () => salaryGrowthSeriesDefinitions.flatMap((definition) => {
      const seriesPoints = snapshot[definition.field];
      if (!seriesPoints || seriesPoints.length !== snapshot.points.length
        || seriesPoints.some((point, index) => point.year !== snapshot.points[index].year)) return [];
      return [{
        ...definition,
        points: seriesPoints,
        adjustedPoints: adjustSalaryPointsForInflation(seriesPoints, snapshot.inflation.points, referenceYear),
      }];
    }),
    [snapshot, referenceYear],
  );
  const [adjustForInflation, setAdjustForInflation] = useState(false);
  const canAdjustForInflation = availableSeries.every((series) => series.adjustedPoints !== null);
  const useInflation = adjustForInflation && canAdjustForInflation;
  const displaySeries = useMemo(() => availableSeries.map((series) => ({
    ...series,
    points: useInflation && series.adjustedPoints ? series.adjustedPoints : series.points,
  })), [availableSeries, useInflation]);
  const [selectedSeriesKey, setSelectedSeriesKey] = useState<SalaryGrowthSeriesKey>("all");
  const [previewSeriesKey, setPreviewSeriesKey] = useState<SalaryGrowthSeriesKey | null>(null);
  const focusedSeries = displaySeries.find((series) => series.key === (previewSeriesKey ?? selectedSeriesKey)) ?? displaySeries[0];
  const points = focusedSeries.points;
  const pointCount = snapshot.points.length;
  const valueUnit = useInflation ? `i ${referenceYear}-kroner` : "i løpende kroner";
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
    // Plass over plottet til veksttekst.
    const margin = {
      top: 32,
      right: chartWidth < 440 ? 24 : 28,
      bottom: 54,
      left: chartWidth < 440 ? 72 : 80,
    };
    const height = margin.top + (chartWidth < 440 ? 300 : 330) + margin.bottom;
    const plotWidth = chartWidth - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const values = displaySeries.flatMap((series) => series.points.map((point) => point.value));
    const minValue = Math.floor(Math.min(...values) / 5000) * 5000;
    const maxValue = Math.ceil(Math.max(...values) / 5000) * 5000;
    const valueSpan = Math.max(1, maxValue - minValue);
    const x = (index: number) =>
      margin.left + (pointCount === 1 ? plotWidth / 2 : (index / (pointCount - 1)) * plotWidth);
    const y = (value: number) => margin.top + ((maxValue - value) / valueSpan) * plotHeight;
    const ticks = Array.from(
      { length: Math.round(valueSpan / 5000) + 1 },
      (_, index) => minValue + index * 5000,
    );
    const annotationY = margin.top;

    return { height, margin, plotWidth, plotHeight, minValue, maxValue, x, y, ticks, annotationY };
  }, [chartWidth, displaySeries, pointCount]);

  const screenSeries = useMemo(() => displaySeries.map((series) => ({
    ...series,
    points: series.points.map((point, index) => ({
      x: geometry.x(index), y: geometry.y(point.value), text: `${kronerFormatter.format(point.value)} kr`,
    })),
  })), [displaySeries, geometry]);

  const change = percentChange(activePoint.value, latestPoint.value);
  const roundedChange = Math.round(change * 10) / 10;
  const changeColor = roundedChange > 0 ? "#15803d" : roundedChange < 0 ? "#b91c1c" : focusedSeries.color;
  const changeLabel = `${displaySeries.length > 1 ? `${focusedSeries.label} · ` : ""}${formatPercent(change)} siden ${activePoint.year}`;
  const startX = geometry.x(activeIndex);
  const endX = geometry.x(latestIndex);
  const labelHalfWidth = Math.min(chartWidth / 2 - 12, Math.max(chartWidth < 440 ? 94 : 108,
    changeLabel.length * (chartWidth < 440 ? 12 : 14) * 0.32));
  const labelX = Math.min(
    chartWidth - labelHalfWidth,
    Math.max(labelHalfWidth, (startX + endX - 16) / 2),
  );
  const labelFontSize = chartWidth < 440 ? 12 : 14;
  const amountLabels = useMemo(() => placeSalaryGrowthLabels({
    points: points.map((point, index) => ({
      x: geometry.x(index),
      y: geometry.y(point.value),
      text: `${kronerFormatter.format(point.value)} kr`,
    })),
    // Sluttverdien beholder sin plass mens etiketten for valgt år tilpasses.
    indexes: activeIndex === latestIndex ? [latestIndex] : [latestIndex, activeIndex],
    bounds: {
      left: geometry.margin.left + 8,
      right: endX - 8,
      top: geometry.margin.top + 8,
      bottom: geometry.margin.top + geometry.plotHeight - 14,
    },
    fontSize: labelFontSize,
    obstacleCurves: screenSeries.filter((series) => series.key !== focusedSeries.key).map((series) => series.points),
  }), [points, geometry, activeIndex, latestIndex, endX, labelFontSize, screenSeries, focusedSeries.key]);
  const yearLabels = useMemo(() => {
    const minimumSpacing = chartWidth < 440 ? 34 : 40;
    const chosenIndexes = [...new Set([firstIndex, latestIndex, activeIndex])];
    for (let index = 1; index < latestIndex; index += 1) {
      if (chosenIndexes.every((chosen) => Math.abs(geometry.x(index) - geometry.x(chosen)) >= minimumSpacing)) {
        chosenIndexes.push(index);
      }
    }
    return chosenIndexes.sort((first, second) => first - second).map((index) => ({
      index,
      secondRow: index === activeIndex && index !== firstIndex && index !== latestIndex
        && [firstIndex, latestIndex].some((edge) => Math.abs(geometry.x(index) - geometry.x(edge)) < minimumSpacing),
    }));
  }, [chartWidth, geometry, activeIndex, firstIndex, latestIndex]);
  function getPointerHit(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return findClosestSalaryGrowthSeries(screenSeries, {
      x: ((event.clientX - rect.left) / rect.width) * chartWidth,
      y: ((event.clientY - rect.top) / rect.height) * geometry.height,
    }, focusedSeries.key);
  }

  return (
    <figure
      className="not-prose my-10 overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:my-12"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <header className="px-5 pt-6 sm:px-7 sm:pt-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="m-0 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#164e63]">
            Lønnsutvikling
          </p>
          <button
            type="button"
            aria-pressed={adjustForInflation}
            aria-controls={chartId}
            disabled={!canAdjustForInflation}
            onClick={() => {
              setAdjustForInflation((current) => !current);
              setPreviewIndex(null);
            }}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${
              adjustForInflation
                ? "border-[#0b376d] bg-[#0b376d] text-white"
                : "border-slate-200 bg-white text-[#0b376d] hover:border-[#0b376d] hover:bg-slate-50"
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                adjustForInflation ? "border-white bg-white text-[#0b376d]" : "border-slate-400"
              }`}
            >
              {adjustForInflation ? (
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                  <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : null}
            </span>
            Juster for inflasjon
          </button>
        </div>
        <h3
          id={titleId}
          className="m-0 text-balance font-serif text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.025em] text-slate-950 sm:text-[2.15rem]"
        >
          {snapshot.title}
        </h3>
        <p className="mb-0 mt-2 text-xs text-slate-600 sm:text-base">
          {snapshot.subtitle}{adjustForInflation ? ` · i ${referenceYear}-kroner` : ""}
        </p>
      </header>

      <div
        ref={chartRef}
        className="relative w-full touch-manipulation select-none"
        onPointerLeave={(event) => {
          if (hasHoverPointer(event.pointerType)) {
            setPreviewIndex(null);
            setPreviewSeriesKey(null);
          }
        }}
      >
        <svg
          id={chartId}
          className="block w-full"
          height={geometry.height}
          viewBox={`0 0 ${chartWidth} ${geometry.height}`}
          role="group"
          aria-label={`Interaktiv lønnsutvikling ${valueUnit}. ${focusedSeries.label} er i fokus. Velg en linje og et år for å sammenligne med siste år.`}
          onPointerMove={(event) => {
            if (!hasHoverPointer(event.pointerType)) return;
            const hit = getPointerHit(event);
            setPreviewIndex(hit && hit.distance <= 14 ? hit.index : null);
            setPreviewSeriesKey(hit && hit.distance <= 14 ? hit.key : null);
          }}
          onPointerDown={(event) => {
            if (hasHoverPointer(event.pointerType)) return;
            const hit = getPointerHit(event);
            if (!hit || hit.distance > 24) return;
            setSelectedIndex(hit.index);
            setSelectedSeriesKey(hit.key);
            setPreviewIndex(null);
            setPreviewSeriesKey(null);
          }}
        >
          <defs>
            <linearGradient
              id={growthGradientId}
              gradientUnits="userSpaceOnUse"
              x1={startX}
              x2={endX - 16}
              y1={geometry.annotationY}
              y2={geometry.annotationY}
            >
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#0b376d" />
            </linearGradient>
          </defs>

          <rect
            x={geometry.margin.left} y={geometry.margin.top}
            width={geometry.plotWidth} height={geometry.plotHeight}
            fill="transparent" aria-hidden="true"
          />

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

          {/* Tegnes etter rutenettet slik at stiplede hjelpelinjer ikke dekker gradienten. */}
          {activeIndex !== latestIndex ? (
            <g pointerEvents="none" aria-hidden="true">
              <text
                x={labelX}
                y={geometry.annotationY - 12}
                textAnchor="middle"
                fill={focusedSeries.color}
                className="text-xs font-extrabold sm:text-sm"
              >
                {displaySeries.length > 1 ? `${focusedSeries.label} · ` : ""}
                <tspan fill={changeColor}>{formatPercent(change)}</tspan>
                {` siden ${activePoint.year}`}
              </text>
              <line
                x1={startX}
                x2={endX - 16}
                y1={geometry.annotationY}
                y2={geometry.annotationY}
                stroke={`url(#${growthGradientId})`}
                strokeWidth="1"
                strokeLinecap="round"
              />
              <path
                d={`M ${endX - 21} ${geometry.annotationY - 5} L ${endX - 16} ${geometry.annotationY} L ${endX - 21} ${geometry.annotationY + 5}`}
                fill="none"
                stroke="#0b376d"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </g>
          ) : null}

          {[...screenSeries.filter((series) => series.key !== focusedSeries.key),
            screenSeries.find((series) => series.key === focusedSeries.key)!].map((series) => {
            const inFocus = series.key === focusedSeries.key;
            const path = series.points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
            const activePath = series.points.slice(activeIndex)
              .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
            return (
              <g
                key={series.key}
                data-salary-series={series.key}
                opacity={inFocus ? 1 : focusedSeries.key === "all" ? 0.24 : 0.16}
                pointerEvents="none"
                className="transition-opacity duration-150 motion-reduce:transition-none"
              >
                <path
                  d={path} fill="none" stroke={series.color}
                  strokeOpacity={inFocus ? series.key === "all" ? 0.35 : 0.75 : 1}
                  strokeWidth={inFocus ? 3.5 : 2}
                  strokeLinecap="round" strokeLinejoin="round"
                />
                {inFocus ? (
                  <path
                    d={activePath} fill="none" stroke={series.color} strokeWidth="4"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                ) : null}
                {series.points.map((point, index) => (
                  <circle
                    key={index} cx={point.x} cy={point.y}
                    r={inFocus ? index === activeIndex || index === latestIndex ? 7 : 4.5 : 2.5}
                    fill={series.color}
                    fillOpacity={inFocus && index < activeIndex ? 0.35 : 1}
                    stroke={inFocus ? "white" : "none"}
                    strokeWidth={inFocus ? 1.5 : 0}
                  />
                ))}
              </g>
            );
          })}

          {points.map((point, index) => {
            const pointX = geometry.x(index);
            const pointY = geometry.y(point.value);
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
                <circle
                  cx={pointX}
                  cy={pointY}
                  r="22"
                  fill="transparent"
                  role="button"
                  tabIndex={0}
                  pointerEvents="none"
                  aria-label={`${focusedSeries.label}, ${point.year}: ${kronerFormatter.format(point.value)} kroner ${valueUnit}. Endring til ${latestPoint.year}: ${accessibleChange}.`}
                  onFocus={() => setPreviewIndex(index)}
                  onBlur={() => setPreviewIndex(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedIndex(index);
                      setSelectedSeriesKey(focusedSeries.key);
                    }
                  }}
                  className="cursor-pointer outline-none focus-visible:stroke-[#f59e0b] focus-visible:stroke-2"
                />
              </g>
            );
          })}

          {yearLabels.map(({ index, secondRow }) => (
            <text
              key={points[index].year}
              x={geometry.x(index)}
              y={geometry.margin.top + geometry.plotHeight + (secondRow ? 43 : 25)}
              fill={index === activeIndex ? "#0f3d4a" : "#64748b"}
              className="text-xs sm:text-sm"
              fontWeight={index === activeIndex ? 700 : 500}
              textAnchor="middle"
            >
              {points[index].year}
            </text>
          ))}

          {amountLabels.map((label) => (
            <g key={label.index} pointerEvents="none">
              {label.connector ? (
                <line {...label.connector} stroke="#94a3b8" strokeWidth="1" aria-hidden="true" />
              ) : null}
              <text
                x={label.x}
                y={label.y}
                fill={focusedSeries.color}
                fontSize={labelFontSize}
                fontWeight="800"
                textAnchor="middle"
              >
                {label.text}
              </text>
            </g>
          ))}
        </svg>
        {displaySeries.length > 1 ? (
          <div role="group" aria-label="Velg lønnsserie" className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-5 pb-3 sm:px-7">
            {displaySeries.map((series) => (
              <button
                key={series.key}
                type="button"
                aria-pressed={series.key === focusedSeries.key}
                aria-controls={chartId}
                onClick={() => {
                  setSelectedSeriesKey(series.key);
                  setPreviewSeriesKey(null);
                  setPreviewIndex(null);
                }}
                className="inline-flex min-h-9 items-center gap-2 rounded px-1 text-xs font-semibold text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d]"
              >
                <span aria-hidden="true" className="h-0.5 w-5 rounded-full" style={{ backgroundColor: series.color }} />
                {series.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <figcaption
        id={descriptionId}
        aria-live="polite"
        className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:px-7 sm:text-base"
      >
        <span className="font-bold text-slate-700">
          Kilde: {snapshot.source}
          {useInflation ? (
            <>
              {" og "}
              {snapshot.inflation.source}
            </>
          ) : null}.
        </span>
      </figcaption>
    </figure>
  );
}
