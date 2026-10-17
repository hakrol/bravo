"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  buildRealWageGeometry, calculateCumulativeRealWageGrowth, formatRealWageBarPercent, formatRealWagePercent, prepareRealWageGrowth, realWageColors,
  realWageExplanation, realWageGenders, type RealWageDataset, type RealWageGender,
} from "@/lib/real-wage-growth";

const money = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const axis = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1 });

export function RealWageGrowthExplorer({ dataset }: { dataset: RealWageDataset }) {
  const id = useId();
  const allYears = useMemo(() => prepareRealWageGrowth(dataset, { includeHistory: true }), [dataset]);
  const years = useMemo(() => allYears.slice(-10), [allYears]);
  const [chartWidth, setChartWidth] = useState(766);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [highlightedGender, setHighlightedGender] = useState<"all" | RealWageGender>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const pointerTypeRef = useRef<string | null>(null);
  const barRefs = useRef<(SVGRectElement | null)[]>([]);
  const geometry = useMemo(() => years.length ? buildRealWageGeometry(years, chartWidth) : null, [years, chartWidth]);
  const activeKey = previewKey ?? selectedKey;
  const activeBar = geometry?.bars.find((bar) => `${bar.observation.year}-${bar.observation.gender}` === activeKey);
  const active = activeBar?.observation;
  const activeGender = realWageGenders.find((gender) => gender.key === active?.gender);
  const visibleYears = new Set(years.length ? [years[0][0].year, years[years.length - 1][0].year, ...(active ? [active.year] : [])] : []);
  for (const zone of geometry?.yearZones ?? []) {
    if (geometry!.yearZones.every((other) => !visibleYears.has(other.year) || Math.abs(other.centerX - zone.centerX) >= 36)) {
      visibleYears.add(zone.year);
    }
  }
  const summaries = useMemo(() => ([5, 10] as const).map((period) => ({
    period,
    entries: realWageGenders.flatMap((gender) => {
      const growth = calculateCumulativeRealWageGrowth(allYears, gender.key, period);
      return growth ? [{ ...gender, ...growth }] : [];
    }),
  })), [allYears]);
  const visibleSummaries = summaries.map((summary) => ({
    ...summary,
    entries: summary.entries.filter((entry) => highlightedGender === "all" || entry.key === highlightedGender),
  })).filter((summary) => summary.entries.length > 0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateWidth = () => setChartWidth(Math.max(280, container.clientWidth));
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedKey === null) return;
    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !tooltipRef.current?.contains(event.target)) {
        setSelectedKey(null);
        setPreviewKey(null);
      }
    }
    function dismissOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedKey(null);
        setPreviewKey(null);
      }
    }
    document.addEventListener("pointerdown", dismissOutside, true);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside, true);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [selectedKey]);

  function clearSelection() { setPreviewKey(null); setSelectedKey(null); }
  function handleKeyDown(event: KeyboardEvent<SVGRectElement>, index: number) {
    if (!geometry) return;
    pointerTypeRef.current = null;
    const last = geometry.bars.length - 1;
    const next = event.key === "ArrowRight" ? Math.min(last, index + 1)
      : event.key === "ArrowLeft" ? Math.max(0, index - 1)
      : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (next !== null) {
      event.preventDefault();
      const point = geometry.bars[next].observation;
      setSelectedKey(null);
      setPreviewKey(`${point.year}-${point.gender}`);
      barRefs.current[next]?.focus({ preventScroll: true });
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const point = geometry.bars[index].observation;
      setSelectedKey(null);
      setPreviewKey(`${point.year}-${point.gender}`);
    } else if (event.key === "Escape") clearSelection();
  }

  const tooltipLeft = activeBar ? Math.max(8, Math.min(chartWidth - 280,
    activeBar.x + (activeBar.x + 290 < chartWidth ? 22 : -294))) : 8;

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:my-12"
      aria-labelledby={`${id}-title`}>
      <header className="px-5 pt-6 sm:px-7 sm:pt-7">
        <p className="mb-3 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#164e63]">Reallønn</p>
        <h2 id={`${id}-title`} className="m-0 text-balance font-serif text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.025em] text-slate-950 sm:text-[2.15rem]">{dataset.title}</h2>
        <p className="mb-0 mt-2 text-xs text-slate-600 sm:text-base">
          Årlig endring i reallønn{years.length ? years.length === 1 ? ` i ${years[0][0].year}` : ` fra ${years[0][0].year} til ${years.at(-1)![0].year}` : ""}{dataset.isTestData ? " · testdata" : ""}
        </p>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 pt-4 sm:px-7">
        <div role="group" aria-label="Fremhev kjønn" className="inline-flex max-w-full shrink-0 gap-1 rounded-full border border-slate-200 p-1">
          {([{ key: "all", label: "Begge" }, { key: "men", label: "Menn" }, { key: "women", label: "Kvinner" }] as const).map((option) => (
            <button key={option.key} type="button" aria-pressed={highlightedGender === option.key}
              onClick={() => setHighlightedGender(option.key)}
              className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] motion-reduce:transition-none ${highlightedGender === option.key ? "bg-[#0b376d] text-white" : "text-[#0b376d] hover:bg-slate-50"}`}>
              {option.label}
            </button>
          ))}
        </div>
        <div aria-live="polite" aria-atomic="true" className="w-full max-w-full sm:ml-auto sm:w-auto">
          {visibleSummaries.length > 0 ? (
            <div role="group" aria-label="Samlet reallønnsvekst" className="grid gap-y-1">
              {visibleSummaries.map((summary) => (
                <section key={summary.period} aria-label={`Samlet reallønnsvekst siste ${summary.period} år`} className="flex min-w-0 flex-wrap items-baseline justify-start gap-x-3 gap-y-1 sm:justify-end">
                  <h3 className="m-0 w-[4.5rem] shrink-0 whitespace-nowrap text-[0.7rem] font-semibold leading-4 text-slate-600">Siste {summary.period} år</h3>
                  <dl className="m-0 flex flex-wrap items-baseline justify-start gap-x-3 gap-y-1 sm:justify-end">
                    {summary.entries.map((entry) => (
                      <div key={entry.key} className="inline-flex items-baseline gap-1.5">
                        <dt className="text-sm leading-5 text-slate-500"><span aria-hidden="true" style={{ color: entry.color }}>{entry.symbol}</span><span className="sr-only">{entry.label}</span></dt>
                        <dd className="m-0 whitespace-nowrap text-sm font-bold leading-5 tabular-nums"
                          style={{ color: entry.value === 0 ? realWageColors.neutral : entry.value > 0 ? realWageColors.positive : realWageColors.negative }}>
                          {formatRealWagePercent(entry.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div ref={containerRef} className="relative w-full" onPointerLeave={() => setPreviewKey(null)}>
        {geometry ? (
          <>
            <div className="relative w-full touch-manipulation select-none">
              <svg height={geometry.height} viewBox={`0 0 ${geometry.width} ${geometry.height}`} className="block w-full"
                role="group" aria-label="Årlig reallønnsvekst for kvinner og menn. Velg en stolpe. Bruk piltastene for å bytte kjønn og år.">
                {geometry.yearZones.map((zone, index) => <g key={zone.year} data-real-wage-year={zone.year} aria-hidden="true" pointerEvents="none">
                  <rect x={zone.x} y={zone.y} width={zone.width} height={zone.height} fill={index % 2 === 0 ? "#ffffff" : "#f5f8fb"} />
                  {index > 0 ? <line x1={zone.x} x2={zone.x} y1={zone.y} y2={zone.y + zone.height} stroke="#e2e8f0" strokeWidth="0.7" /> : null}
                </g>)}
                {geometry.ticks.map((tick) => <g key={tick} aria-hidden="true">
                  <line x1={geometry.margin.left} x2={geometry.width - geometry.margin.right} y1={geometry.y(tick)} y2={geometry.y(tick)} stroke={tick === 0 ? "#0b376d" : "#dbe3e8"} strokeWidth={tick === 0 ? 1.5 : 1} strokeDasharray={tick === 0 ? undefined : "3 5"} />
                  <text x={geometry.margin.left - 10} y={geometry.y(tick) + 4} fill={tick === 0 ? "#0b376d" : "#64748b"} fontSize="13" fontWeight={tick === 0 ? 700 : 400} textAnchor="end">{axis.format(tick)} %</text>
                </g>)}
                <line x1={geometry.margin.left} x2={geometry.margin.left} y1={geometry.margin.top} y2={geometry.margin.top + geometry.plotHeight} stroke="#94a3b8" aria-hidden="true" />
                {geometry.bars.map((bar, index) => {
                  const point = bar.observation;
                  const gender = realWageGenders.find((item) => item.key === point.gender)!;
                  const key = `${point.year}-${point.gender}`;
                  const color = point.realGrowth === null || point.realGrowth === 0 ? realWageColors.neutral : point.realGrowth > 0 ? realWageColors.positive : realWageColors.negative;
                  const inFocus = key === activeKey;
                  const label = formatRealWageBarPercent(point.realGrowth);
                  const genderInFocus = highlightedGender === "all" || highlightedGender === point.gender;
                  const opacity = !genderInFocus ? 0.22 : highlightedGender === "all" && activeKey !== null && !inFocus ? 0.65 : 1;
                  return <g key={key} data-real-wage-bar={key}>
                    <g pointerEvents="none" aria-hidden="true" opacity={opacity} className="transition-opacity duration-200 motion-reduce:transition-none">
                      {bar.height > 0 ? <rect x={bar.x - geometry.barWidth / 2} y={bar.top} width={geometry.barWidth} height={bar.height} fill={color} />
                        : <line x1={bar.x - geometry.barWidth / 2} x2={bar.x + geometry.barWidth / 2} y1={geometry.zeroY} y2={geometry.zeroY} stroke={color} strokeWidth="3" strokeDasharray={point.realGrowth === null ? "2 2" : undefined} />}
                      {!geometry.compactLabels || inFocus ? <text x={geometry.compactLabels ? Math.max(geometry.margin.left + bar.labelWidth / 2, Math.min(geometry.width - geometry.margin.right - bar.labelWidth / 2, bar.x)) : bar.x} y={bar.labelY} fill={color} fontSize={geometry.fontSize} fontWeight="800" textAnchor="middle">
                        {label.endsWith("%") ? <><tspan>{label.slice(0, -1)}</tspan><tspan fontSize={geometry.fontSize * 0.72}>%</tspan></> : label}
                      </text> : null}
                    </g>
                    <text x={bar.x} y={geometry.margin.top + geometry.plotHeight + 23} fill={gender.color} fontSize={Math.min(18, geometry.slotWidth * 0.4)} textAnchor="middle" aria-hidden="true" pointerEvents="none"
                      opacity={genderInFocus ? 1 : 0.22} className="transition-opacity duration-200 motion-reduce:transition-none">{gender.symbol}</text>
                    <rect ref={(element) => { barRefs.current[index] = element; }}
                      x={bar.centerX + (point.gender === "women" ? -geometry.slotWidth / 2 : 0)} y={8}
                      width={geometry.slotWidth / 2} height={geometry.margin.top + geometry.plotHeight + 22} rx="3"
                      fill="transparent" role="button" tabIndex={0} aria-pressed={inFocus}
                      aria-describedby={inFocus ? `${id}-tooltip` : undefined}
                      aria-label={`${point.year}, ${gender.label}. Reallønnsendring: ${point.realGrowth === null ? "mangler data" : formatRealWagePercent(point.realGrowth)}.`}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse" || event.pointerType === "pen" && event.buttons === 0) {
                          setSelectedKey(null);
                          setPreviewKey(key);
                        }
                      }}
                      onPointerLeave={() => setPreviewKey(null)}
                      onPointerDown={(event) => {
                        pointerTypeRef.current = event.pointerType;
                        if (event.pointerType === "mouse") setSelectedKey(null);
                      }}
                      onPointerCancel={() => { pointerTypeRef.current = null; setPreviewKey(null); }}
                      onClick={() => {
                        if (pointerTypeRef.current === "touch" || pointerTypeRef.current === "pen") {
                          setSelectedKey(key);
                          setPreviewKey(null);
                        }
                        pointerTypeRef.current = null;
                      }}
                      onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setPreviewKey(key); }}
                      onBlur={() => setPreviewKey(null)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      className="cursor-pointer outline-none focus-visible:stroke-[#0b376d] focus-visible:stroke-1" />
                  </g>;
                })}
                {geometry.yearZones.filter((zone) => visibleYears.has(zone.year)).map((zone) => <text key={zone.year} x={zone.centerX} y={geometry.margin.top + geometry.plotHeight + (zone.year === active?.year && geometry.yearZones.some((other) => other !== zone && (other === geometry.yearZones[0] || other === geometry.yearZones.at(-1)) && Math.abs(other.centerX - zone.centerX) < 36) ? 64 : 48)}
                  fill="#64748b" fontSize="13" textAnchor="middle" aria-hidden="true">{zone.year}</text>)}
              </svg>
            </div>
            {active && activeGender ? (
              <div ref={tooltipRef} id={`${id}-tooltip`} role="tooltip" className={`${selectedKey === null ? "pointer-events-none" : "pointer-events-auto"} z-20 rounded-[6px] border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-[0_12px_32px_rgba(15,23,42,0.12)] ${chartWidth < 440 ? "mx-5 mb-4" : "absolute top-8 w-[272px]"}`}
                style={chartWidth < 440 ? undefined : { left: tooltipLeft }}>
                <p className="m-0 mb-2 text-sm font-extrabold text-[#0b376d]">{active.year} · <span aria-hidden="true" style={{ color: activeGender.color }}>{activeGender.symbol}</span> {activeGender.label}</p>
                <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
                  <dt>Reallønnsendring</dt><dd className="m-0 text-right font-extrabold tabular-nums" style={{ color: active.realGrowth === null || active.realGrowth === 0 ? realWageColors.neutral : active.realGrowth > 0 ? realWageColors.positive : realWageColors.negative }}>{formatRealWagePercent(active.realGrowth)}</dd>
                  <dt>Lønnsvekst</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{formatRealWagePercent(active.nominalGrowth)}</dd>
                  <dt>Årlig prisvekst (KPI)</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{formatRealWagePercent(active.inflation)}</dd>
                  <dt>Median månedslønn</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{active.median === null ? "Mangler data" : `${money.format(active.median)} kr`}</dd>
                </dl>
                <p className="mb-0 mt-2">{realWageExplanation(active)}</p>
              </div>
            ) : null}
          </>
        ) : <p className="px-5 py-8 text-sm text-slate-600 sm:px-7">Ingen lønnsdata å vise.</p>}
      </div>
      <figcaption className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:px-7 sm:text-base">
        <span className="font-bold text-slate-700">Kilde: {dataset.source}.</span>
      </figcaption>
    </figure>
  );
}
