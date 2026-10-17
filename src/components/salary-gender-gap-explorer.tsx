"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { salaryGrowthSeriesDefinitions } from "@/lib/salary-growth-series";
import {
  buildSalaryGenderGapGeometry, formatGenderGapPercent, formatGenderGapSalary,
  placeSalaryGenderGapValues, prepareSalaryGenderGapPoints, type SalaryGenderGapDataset,
} from "@/lib/salary-gender-gap";

const menColor = salaryGrowthSeriesDefinitions.find((series) => series.key === "men")!.color;
const womenColor = salaryGrowthSeriesDefinitions.find((series) => series.key === "women")!.color;
const axisFormatter = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });

export function SalaryGenderGapExplorer({ dataset }: { dataset: SalaryGenderGapDataset }) {
  const id = useId();
  const points = useMemo(() => prepareSalaryGenderGapPoints(dataset.points), [dataset.points]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [previewYear, setPreviewYear] = useState<number | null>(null);
  const [chartWidth, setChartWidth] = useState(960);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(SVGRectElement | null)[]>([]);
  const geometry = useMemo(() => points.length ? buildSalaryGenderGapGeometry(points, chartWidth) : null, [points, chartWidth]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateWidth = () => setChartWidth(Math.max(280, container.clientWidth));
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const active = geometry?.bars.find((bar) => bar.point.year === (previewYear ?? selectedYear)) ?? geometry?.bars.at(-1);
  const activeSummary = active
    ? active.gap.higherGender === "men" ? `Menn tjente mest i ${active.point.year}`
      : active.gap.higherGender === "women" ? `Kvinner tjente mest i ${active.point.year}`
      : `Lik lønn i ${active.point.year}`
    : "";
  const salaryLabels = geometry && active && (previewYear !== null || selectedYear !== null)
    ? placeSalaryGenderGapValues(geometry, active.point.year, { left: scrollLeft, width: chartWidth })
    : null;

  function handleKeyDown(event: KeyboardEvent<SVGRectElement>, index: number) {
    const last = points.length - 1;
    const next = event.key === "ArrowRight" ? Math.min(last, index + 1)
      : event.key === "ArrowLeft" ? Math.max(0, index - 1)
      : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (next !== null) {
      event.preventDefault();
      setSelectedYear(points[next].year);
      barRefs.current[next]?.focus({ preventScroll: true });
      barRefs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedYear(points[index].year);
    } else if (event.key === "Escape") {
      setPreviewYear(null);
      setSelectedYear(null);
    }
  }

  return (
    <figure
      className="not-prose my-10 overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:my-12"
      aria-labelledby={`${id}-title`} aria-describedby={`${id}-explanation`}
    >
      <header className="px-5 pt-6 sm:px-7 sm:pt-7">
        <p className="mb-3 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#164e63]">Lønnsforskjell</p>
        <h2 id={`${id}-title`} className="m-0 text-balance font-serif text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.025em] text-slate-950 sm:text-[2.15rem]">
          {dataset.title}
        </h2>
      </header>

      <div ref={containerRef} className="relative w-full">
        {geometry && active ? (
          <>
            {geometry.width > chartWidth ? <p className="mb-0 mt-2 px-5 text-xs text-slate-500 sm:px-7">Sveip horisontalt for å se alle år. Trykk på en stolpe for detaljer.</p> : null}
            <div className="relative">
              <p id={`${id}-summary`} className="absolute inset-x-0 top-1 z-10 m-0 px-5 text-center text-xs font-extrabold text-[#0b376d] sm:px-7 sm:text-sm">
                {activeSummary}
              </p>
            <div
              className="overflow-x-auto overscroll-x-contain"
              onPointerLeave={() => setPreviewYear(null)}
              onScroll={(event) => setScrollLeft(event.currentTarget.scrollLeft)}
            >
              <svg
                id={`${id}-chart`} width={geometry.width} height={geometry.height}
                viewBox={`0 0 ${geometry.width} ${geometry.height}`} className="block max-w-none"
                role="group" aria-label="Interaktiv lønnsforskjell i median månedslønn. Velg en stolpe for å se begge medianlønninger. Bruk piltastene for å bytte år."
              >
                {geometry.ticks.map((tick) => (
                  <g key={tick} aria-hidden="true">
                    <line x1={geometry.margin.left} x2={geometry.width - geometry.margin.right} y1={geometry.y(tick)} y2={geometry.y(tick)} stroke="#dbe3e8" strokeDasharray="3 5" />
                    <text x={geometry.margin.left - 10} y={geometry.y(tick) + 4} fill="#64748b" fontSize="13" className="text-xs sm:text-sm" textAnchor="end">{axisFormatter.format(tick)}</text>
                  </g>
                ))}
                <g aria-hidden="true" stroke="#94a3b8" fill="none">
                  <line x1={geometry.margin.left} x2={geometry.margin.left} y1={geometry.margin.top} y2={geometry.baseline - (geometry.min > 0 ? 14 : 0)} />
                  {geometry.min > 0 ? <path d={`M ${geometry.margin.left - 4} ${geometry.baseline - 13} l 8 -4 M ${geometry.margin.left - 4} ${geometry.baseline - 6} l 8 -4`} /> : null}
                  <line x1={geometry.margin.left} x2={geometry.width - geometry.margin.right} y1={geometry.baseline} y2={geometry.baseline} />
                </g>
                {geometry.bars.map((bar, index) => {
                  const inFocus = bar.point.year === active.point.year;
                  const highColor = bar.gap.higherGender === "men" ? menColor : bar.gap.higherGender === "women" ? womenColor : "#64748b";
                  const lowColor = bar.gap.higherGender === "men" ? womenColor : bar.gap.higherGender === "women" ? menColor : "#94a3b8";
                  const higherLabel = bar.gap.higherGender === "men" ? "Menn tjener mest" : bar.gap.higherGender === "women" ? "Kvinner tjener mest" : "Lik lønn";
                  return (
                    <g key={bar.point.year} data-gap-year={bar.point.year}>
                      <g pointerEvents="none" opacity={inFocus ? 1 : 0.65} className="transition-opacity duration-150 motion-reduce:transition-none" aria-hidden="true">
                        <rect data-segment="lower" x={bar.x - geometry.barWidth / 2} y={bar.lowY} width={geometry.barWidth} height={bar.baseHeight} fill={lowColor} fillOpacity="0.2" />
                        {bar.gapHeight > 0 ? <rect data-segment="gap" x={bar.x - geometry.barWidth / 2} y={bar.highY} width={geometry.barWidth} height={bar.gapHeight} fill={highColor} /> : null}
                        <line x1={bar.x - geometry.barWidth / 2} x2={bar.x + geometry.barWidth / 2} y1={bar.highY} y2={bar.highY} stroke={highColor} strokeWidth="2" />
                        {bar.gapHeight > 0 ? (
                          <g data-gap-measure="true" stroke={highColor} fill="none" strokeWidth="1" strokeLinejoin="round">
                            <line x1={bar.measureX} x2={bar.measureX} y1={bar.highY} y2={bar.lowY} />
                            <path d={`M ${bar.measureX - bar.arrowSize} ${bar.highY + bar.arrowSize} L ${bar.measureX} ${bar.highY} L ${bar.measureX + bar.arrowSize} ${bar.highY + bar.arrowSize} M ${bar.measureX - bar.arrowSize} ${bar.lowY - bar.arrowSize} L ${bar.measureX} ${bar.lowY} L ${bar.measureX + bar.arrowSize} ${bar.lowY - bar.arrowSize}`} />
                          </g>
                        ) : null}
                        <text x={bar.x + 3} y={bar.percentY} fill={highColor} fontSize="12" className="text-xs sm:text-sm" fontWeight="800" textAnchor="middle">{formatGenderGapPercent(bar.gap.percent)}</text>
                      </g>
                      <line x1={bar.x} x2={bar.x} y1={geometry.baseline} y2={geometry.baseline + 6} stroke="#94a3b8" aria-hidden="true" />
                      <text x={bar.x} y={geometry.baseline + 25} fill={inFocus ? "#0f3d4a" : "#64748b"} fontSize="13" className="text-xs sm:text-sm" fontWeight={inFocus ? 700 : 500} textAnchor="middle" aria-hidden="true">{bar.point.year}</text>
                      <rect
                        ref={(element) => { barRefs.current[index] = element; }}
                        x={bar.x - geometry.slotWidth / 2 + 2} y={geometry.margin.top - 28}
                        width={geometry.slotWidth - 4} height={geometry.plotHeight + 57} rx="4"
                        fill="transparent" role="button" tabIndex={0} aria-pressed={inFocus}
                        aria-label={`${bar.point.year}. Menn: ${formatGenderGapSalary(bar.point.men)}. Kvinner: ${formatGenderGapSalary(bar.point.women)}. Forskjell: ${formatGenderGapSalary(bar.gap.absoluteDifference)}, ${formatGenderGapPercent(bar.gap.percent)} med menns lønn som referanse. ${higherLabel}.`}
                        onPointerEnter={(event) => {
                          if (event.pointerType !== "touch" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setPreviewYear(bar.point.year);
                        }}
                        onClick={() => { setSelectedYear(bar.point.year); setPreviewYear(null); }}
                        onFocus={() => setPreviewYear(bar.point.year)} onBlur={() => setPreviewYear(null)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        className="cursor-pointer outline-none focus-visible:stroke-[#0b376d] focus-visible:stroke-1"
                      />
                    </g>
                  );
                })}
                {salaryLabels ? (
                  <g id={`${id}-values`} aria-hidden="true" pointerEvents="all">
                    <rect x={salaryLabels.left} y={salaryLabels.top} width={salaryLabels.width} height={40} fill="transparent" />
                    <g data-gap-salary-label="men" fill={menColor}>
                      <text x={salaryLabels.left + 3} y={salaryLabels.menY} fontSize="18">♂</text>
                      <text x={salaryLabels.left + 27} y={salaryLabels.menY} fontSize={salaryLabels.fontSize} fontWeight="800">{salaryLabels.menText}</text>
                    </g>
                    <g data-gap-salary-label="women" fill={womenColor}>
                      <text x={salaryLabels.left + 3} y={salaryLabels.womenY} fontSize="18">♀</text>
                      <text x={salaryLabels.left + 27} y={salaryLabels.womenY} fontSize={salaryLabels.fontSize} fontWeight="800">{salaryLabels.womenText}</text>
                    </g>
                  </g>
                ) : null}
              </svg>
            </div>
            </div>
          </>
        ) : <p className="px-5 py-8 text-sm text-slate-600 sm:px-7">Ingen lønnsdata å vise.</p>}
      </div>

      <div id={`${id}-explanation`} className="px-5 pb-5 text-xs leading-relaxed text-slate-500 sm:px-7">
        <div className="mb-2 flex items-center gap-5 font-semibold">
          <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-0.5 w-5 rounded-full" style={{ backgroundColor: menColor }} />Menn</span>
          <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-0.5 w-5 rounded-full" style={{ backgroundColor: womenColor }} />Kvinner</span>
        </div>
      </div>
      <figcaption className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:px-7 sm:text-base">
        <span className="font-bold text-slate-700">Kilde: {dataset.source}.</span>
      </figcaption>
    </figure>
  );
}
