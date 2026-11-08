"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { formatRealWagePercent, realWageColors } from "@/lib/real-wage-growth";
import {
  prepareRealWageLine, realWageLineGroups,
  type RealWageLineDataset, type RealWageLineGroup,
} from "@/lib/real-wage-line";

const axisFormat = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1 });

function valueColor(value: number | null) {
  return value === null || value === 0 ? realWageColors.neutral
    : value > 0 ? realWageColors.positive : realWageColors.negative;
}

export function RealWageLineExplorer({ dataset }: { dataset: RealWageLineDataset }) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const pointerTypeRef = useRef<string | null>(null);
  const [width, setWidth] = useState(766);
  const [group, setGroup] = useState<RealWageLineGroup>("both");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [previewYear, setPreviewYear] = useState<number | null>(null);
  const points = useMemo(() => prepareRealWageLine(dataset, group), [dataset, group]);
  const active = points.find((point) => point.year === (previewYear ?? selectedYear));
  const groupLabel = realWageLineGroups.find((option) => option.key === group)!.label;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateWidth = () => setWidth(Math.max(280, container.clientWidth));
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedYear === null) return;
    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !tooltipRef.current?.contains(event.target)) {
        setSelectedYear(null);
        setPreviewYear(null);
      }
    }
    function dismissOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedYear(null);
        setPreviewYear(null);
      }
    }
    document.addEventListener("pointerdown", dismissOutside, true);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside, true);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [selectedYear]);

  const geometry = useMemo(() => {
    const margin = { left: 58, right: 26, top: 32, bottom: 44 };
    const plotHeight = 300;
    const plotWidth = width - margin.left - margin.right;
    const values = points.flatMap((point) => point.realGrowth === null ? [] : [point.realGrowth]);
    const low = Math.min(0, ...values);
    const high = Math.max(0, ...values);
    const rawStep = Math.max(2, high - low) / 5;
    const magnitude = 10 ** Math.floor(Math.log10(rawStep));
    const step = ([1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= rawStep) ?? 10) * magnitude;
    const min = Math.floor((low - step * 0.5) / step) * step;
    const max = Math.ceil((high + step * 0.5) / step) * step;
    const firstYear = points[0]?.year ?? 0;
    const lastYear = points.at(-1)?.year ?? firstYear;
    const slotWidth = plotWidth / (lastYear - firstYear + 1);
    const barWidth = Math.min(38, slotWidth * 0.62);
    const x = (year: number) => margin.left + (year - firstYear + 0.5) * slotWidth;
    const y = (value: number) => margin.top + (max - value) / (max - min) * plotHeight;
    const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, index) => min + index * step);
    // Behold endepunktene og reserver minst 44 px mellom årsetikettene.
    const labeledYears = new Set(points.length ? [firstYear, lastYear] : []);
    for (const point of points) {
      if ([...labeledYears].every((year) => Math.abs(x(year) - x(point.year)) >= 44)) labeledYears.add(point.year);
    }
    return { margin, plotHeight, barWidth, height: margin.top + plotHeight + margin.bottom, x, y, ticks, labeledYears };
  }, [points, width]);

  function pointerYear(event: MouseEvent<SVGSVGElement>, hitPadding: number) {
    if (!points.length) return null;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * width;
    const y = (event.clientY - rect.top) / rect.height * geometry.height;
    const distance = (point: typeof points[number]) => {
      const endY = point.realGrowth === null ? geometry.margin.top + geometry.plotHeight - 8 : geometry.y(point.realGrowth);
      const baselineY = point.realGrowth === null ? endY : geometry.y(0);
      return Math.hypot(Math.max(0, Math.abs(geometry.x(point.year) - x) - geometry.barWidth / 2),
        Math.max(0, Math.min(endY, baselineY) - y, y - Math.max(endY, baselineY)));
    };
    const closest = points.reduce((candidate, point) => distance(point) < distance(candidate) ? point : candidate);
    return distance(closest) <= hitPadding ? closest.year : null;
  }

  function handleKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    if (!points.length) return;
    const index = active ? points.indexOf(active) : points.length - 1;
    const next = event.key === "ArrowRight" ? Math.min(points.length - 1, index + 1)
      : event.key === "ArrowLeft" ? Math.max(0, index - 1)
      : event.key === "Home" ? 0 : event.key === "End" ? points.length - 1 : null;
    if (next !== null) {
      event.preventDefault();
      setSelectedYear(null);
      setPreviewYear(points[next].year);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setPreviewYear(points[index].year);
    } else if (event.key === "Escape") {
      setSelectedYear(null);
      setPreviewYear(null);
    }
  }

  const zeroY = geometry.y(0);
  const bottom = geometry.margin.top + geometry.plotHeight;
  const activeX = active ? geometry.x(active.year) : 0;
  const tooltipLeft = Math.max(8, Math.min(width - 280,
    activeX + (activeX + 290 < width ? 22 : -294)));

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:my-12"
      aria-labelledby={`${id}-title`}>
      <header className="px-5 pt-6 sm:px-7 sm:pt-7">
        <p className="mb-3 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#164e63]">Reallønn</p>
        <h2 id={`${id}-title`} className="m-0 text-balance font-serif text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.025em] text-slate-950 sm:text-[2.15rem]">{dataset.title}</h2>
        <p className="mb-0 mt-2 text-xs text-slate-600 sm:text-base">
          Årlig endring i reallønn{points.length ? ` · ${points[0].year}–${points.at(-1)!.year}` : ""}{dataset.isTestData ? " · testdata" : ""}
        </p>
        <div role="group" aria-label="Velg kjønn" className="mt-4 inline-flex max-w-full gap-1 rounded-full border border-slate-200 p-1">
          {realWageLineGroups.map((option) => (
            <button key={option.key} type="button" aria-pressed={group === option.key} aria-controls={`${id}-chart`}
              onClick={() => { setGroup(option.key); setPreviewYear(null); setSelectedYear(null); }}
              className={`min-h-10 rounded-full px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] sm:px-4 motion-reduce:transition-none ${group === option.key ? "bg-[#0b376d] text-white" : "text-[#0b376d] hover:bg-slate-50"}`}>
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div ref={containerRef} className="relative w-full">
        {points.length ? (
          <svg id={`${id}-chart`} viewBox={`0 0 ${width} ${geometry.height}`} height={geometry.height}
            role="group" tabIndex={0} aria-label={`Stolpediagram for årlig reallønnsvekst. ${groupLabel}. Bruk venstre og høyre piltast for å velge år, Home og End for første og siste år.`}
            aria-describedby={active ? `${id}-tooltip` : undefined} onKeyDown={handleKeyDown}
            onPointerMove={(event) => {
              if (event.pointerType === "mouse" || event.pointerType === "pen" && event.buttons === 0) {
                setSelectedYear(null);
                setPreviewYear(pointerYear(event, 6));
              }
            }}
            onPointerLeave={() => setPreviewYear(null)}
            onPointerDown={(event) => { pointerTypeRef.current = event.pointerType; }}
            onPointerCancel={() => { pointerTypeRef.current = null; setPreviewYear(null); }}
            onClick={(event) => {
              if (pointerTypeRef.current === "touch" || pointerTypeRef.current === "pen") {
                setSelectedYear(pointerYear(event, 14));
                setPreviewYear(null);
              }
              pointerTypeRef.current = null;
            }}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) setPreviewYear(points.at(-1)?.year ?? null);
            }}
            onBlur={() => setPreviewYear(null)}
            className="block w-full touch-pan-y cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0b376d]">
            <g aria-hidden="true" pointerEvents="none">
              {geometry.ticks.map((tick) => <g key={tick}>
                <line x1={geometry.margin.left} x2={width - geometry.margin.right} y1={geometry.y(tick)} y2={geometry.y(tick)}
                  stroke={tick === 0 ? "#0b376d" : "#dbe3e8"} strokeWidth={tick === 0 ? 1.5 : 1} strokeDasharray={tick === 0 ? undefined : "3 5"} />
                <text x={geometry.margin.left - 10} y={geometry.y(tick) + 4} textAnchor="end" fontSize="12"
                  fill={tick === 0 ? "#0b376d" : "#64748b"} fontWeight={tick === 0 ? 700 : 400}>{axisFormat.format(tick)} %</text>
              </g>)}
              <line x1={geometry.margin.left} x2={geometry.margin.left} y1={geometry.margin.top} y2={bottom} stroke="#94a3b8" />
              {active ? <line x1={geometry.x(active.year)} x2={geometry.x(active.year)} y1={geometry.margin.top} y2={bottom} stroke="#94a3b8" strokeDasharray="3 5" /> : null}
              {points.map((point) => <g key={point.year}>
                {point.realGrowth === null ? (
                  <text x={geometry.x(point.year)} y={bottom - 8} textAnchor="middle" fill="#64748b" fontSize="13">—</text>
                ) : point.realGrowth === 0 ? (
                  <line x1={geometry.x(point.year) - geometry.barWidth / 2} x2={geometry.x(point.year) + geometry.barWidth / 2}
                    y1={zeroY} y2={zeroY} stroke={realWageColors.neutral} strokeWidth="3" />
                ) : (
                  <rect data-real-wage-bar={point.year} x={geometry.x(point.year) - geometry.barWidth / 2}
                    y={Math.min(zeroY, geometry.y(point.realGrowth))} width={geometry.barWidth}
                    height={Math.abs(geometry.y(point.realGrowth) - zeroY)}
                    fill={point.realGrowth > 0 ? "#dcfce7" : "#fee2e2"}
                    stroke={valueColor(point.realGrowth)} strokeWidth={point.year === active?.year ? 2.5 : 1.5} />
                )}
                {geometry.labeledYears.has(point.year) ? <text x={geometry.x(point.year)} y={bottom + 26} textAnchor="middle" fontSize="12" fill="#64748b">{point.year}</text> : null}
              </g>)}
            </g>
          </svg>
        ) : <p className="px-5 py-8 text-sm text-slate-600 sm:px-7">Ingen lønnsdata å vise.</p>}
        {active ? <div ref={tooltipRef} id={`${id}-tooltip`} role="tooltip" aria-live="polite" aria-atomic="true"
          className={`${selectedYear === null ? "pointer-events-none" : "pointer-events-auto"} z-20 rounded-[6px] border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-[0_12px_32px_rgba(15,23,42,0.12)] ${width < 440 ? "mx-5 mb-4" : "absolute top-8 w-[272px]"}`}
          style={width < 440 ? undefined : { left: tooltipLeft }}>
          <p className="m-0 mb-2 text-sm font-extrabold text-[#0b376d]">{active.year} · {groupLabel}</p>
          <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
            <dt>Reallønnsendring</dt><dd className="m-0 text-right font-extrabold tabular-nums" style={{ color: valueColor(active.realGrowth) }}>{active.realGrowth === null ? "Mangler data" : formatRealWagePercent(active.realGrowth)}</dd>
            <dt>Lønnsvekst</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{active.nominalGrowth === null ? "Mangler data" : formatRealWagePercent(active.nominalGrowth)}</dd>
            <dt>Årlig prisvekst (KPI)</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{active.inflation === null ? "Mangler data" : formatRealWagePercent(active.inflation)}</dd>
          </dl>
          <p className="mb-0 mt-2">{active.realGrowth === null ? "Mangler sammenlignbare lønns- eller KPI-tall for dette året eller året før."
            : active.realGrowth === 0 ? "Lønnen holdt tritt med prisene. Kjøpekraften var uendret fra året før."
            : active.realGrowth > 0 ? "Lønnen utviklet seg sterkere enn prisene." : "Lønnen utviklet seg svakere enn prisene."}</p>
        </div> : null}
      </div>

      <figcaption className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:px-7">
        <p className="m-0">Lysegrønne stolper over null viser økt kjøpekraft. Lyserøde stolper under null viser redusert kjøpekraft. Hold pekeren over en stolpe eller trykk på den for detaljer.</p>
        <p className="mb-0 mt-2 font-bold text-slate-700">Kilde: {dataset.source}.</p>
      </figcaption>
    </figure>
  );
}
