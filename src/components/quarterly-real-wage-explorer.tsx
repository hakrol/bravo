"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { formatRealWagePercent, realWageColors } from "@/lib/real-wage-growth";
import {
  calculateFiveYearQuarterlyRealWageGrowth, calculateQuarterlyRealWageSummary, formatRealWageQuarter, quarterIndex, quarterlyRealWageTitle, quarterlyRealWageSalaryLabels,
  type QuarterlyRealWageDataset, type QuarterlyRealWagePeriod,
} from "@/lib/quarterly-real-wage";

const axis = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1 });
const money = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const colorFor = (value: number | null) => value === null || value === 0 ? realWageColors.neutral
  : value > 0 ? realWageColors.positive : realWageColors.negative;

type QuarterlyRealWageExplorerProps = {
  dataset: QuarterlyRealWageDataset;
  variant?: "default" | "national" | "age" | "occupation";
  annotation?: QuarterlyRealWagePeriod;
};

export function QuarterlyRealWageExplorer({ dataset, variant = "default", annotation: suppliedAnnotation }: QuarterlyRealWageExplorerProps) {
  const isNational = variant === "national";
  const isPublic = variant !== "default";
  const hasFixedAge = isNational || variant === "occupation";
  const id = useId();
  const [selectedGenderCode, setGenderCode] = useState("0");
  const [selectedAgeCode, setAgeCode] = useState(() => variant === "age" ? dataset.ages[0]?.code ?? "999D" : "999D");
  const genderCode = isPublic ? "0" : selectedGenderCode;
  const ageCode = hasFixedAge ? "999D" : selectedAgeCode;
  const [previewPeriod, setPreviewPeriod] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(() => isPublic
    ? Math.max(0, (dataset.series.find((series) => series.genderCode === "0" && series.ageCode === ageCode)?.points.length ?? 1) - 1)
    : 0);
  const [viewportWidth, setViewportWidth] = useState(766);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(SVGRectElement | null)[]>([]);
  const pointerTypeRef = useRef<string | null>(null);
  const points = useMemo(() => dataset.series.find((series) => series.genderCode === genderCode && series.ageCode === ageCode)?.points ?? [], [dataset, genderCode, ageCode]);
  const summary = useMemo(() => isPublic ? calculateQuarterlyRealWageSummary(points) : null, [points, isPublic]);
  const annotation = suppliedAnnotation ?? (summary ? {
    startPeriodCode: summary.highlightStartPeriodCode,
    endPeriodCode: summary.fourQuarters.endPeriodCode,
    value: summary.fourQuarters.value,
  } : undefined);
  const fiveYearGrowth = useMemo(() => calculateFiveYearQuarterlyRealWageGrowth(points), [points]);
  const activePeriod = previewPeriod ?? selectedPeriod;
  const active = points.find((point) => point.periodCode === activePeriod);
  const genderLabel = dataset.genders.find((option) => option.code === genderCode)?.label;
  const ageLabel = dataset.ages.find((option) => option.code === ageCode)?.label;
  const occupationLabel = dataset.occupationLabel;
  const salaryLabel = quarterlyRealWageSalaryLabels[dataset.salaryMeasure ?? "GjMdTotal"];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => setViewportWidth(Math.max(280, container.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedPeriod === null && previewPeriod === null) return;
    function dismissOutside(event: PointerEvent) {
      if (selectedPeriod !== null && event.target instanceof Node && !tooltipRef.current?.contains(event.target)) {
        setSelectedPeriod(null);
        setPreviewPeriod(null);
      }
    }
    function dismissOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedPeriod(null);
        setPreviewPeriod(null);
      }
    }
    document.addEventListener("pointerdown", dismissOutside, true);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside, true);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [selectedPeriod, previewPeriod]);

  const geometry = useMemo(() => {
    const margin = { left: 58, right: 24, top: 32, bottom: 68 };
    const plotHeight = isPublic ? (viewportWidth < 520 ? 320 : 440) : 300;
    const firstIndex = points.length ? quarterIndex(points[0].periodCode) : 0;
    const lastIndex = points.length ? quarterIndex(points.at(-1)!.periodCode) : 0;
    const count = lastIndex - firstIndex + 1;
    const width = Math.max(viewportWidth, margin.left + margin.right + count * (viewportWidth < 520 ? 24 : 14));
    const slotWidth = (width - margin.left - margin.right) / count;
    const values = points.flatMap((point) => point.realGrowth === null ? [] : [point.realGrowth]);
    const low = Math.min(0, ...values);
    const high = Math.max(0, ...values);
    const rawStep = Math.max(2, high - low) / 5;
    const magnitude = 10 ** Math.floor(Math.log10(rawStep));
    const step = ([1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= rawStep) ?? 10) * magnitude;
    const min = Math.floor((low - step * 0.5) / step) * step;
    const max = Math.ceil((high + step * 0.5) / step) * step;
    const x = (periodCode: string) => margin.left + (quarterIndex(periodCode) - firstIndex + 0.5) * slotWidth;
    const y = (value: number) => margin.top + (max - value) / (max - min) * plotHeight;
    const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, index) => min + step * index);
    const years = [...new Set(points.map((point) => point.periodCode.slice(0, 4)))].map((year) => {
      const periods = points.filter((point) => point.periodCode.startsWith(year));
      return { year, x: (x(periods[0].periodCode) + x(periods.at(-1)!.periodCode)) / 2 };
    });
    return { width, height: margin.top + plotHeight + margin.bottom, margin, plotHeight, slotWidth,
      barWidth: Math.min(24, slotWidth * 0.65), x, y, ticks, years };
  }, [points, viewportWidth, isPublic]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (isPublic && viewportWidth < 520 && scroller && !hasScrolledRef.current) {
      scroller.scrollLeft = scroller.scrollWidth - scroller.clientWidth;
      hasScrolledRef.current = true;
    }
  }, [isPublic, viewportWidth, geometry.width]);

  function clearSelection() {
    setSelectedPeriod(null);
    setPreviewPeriod(null);
  }

  function handleKeyDown(event: KeyboardEvent<SVGRectElement>, index: number) {
    const next = event.key === "ArrowRight" ? Math.min(points.length - 1, index + 1)
      : event.key === "ArrowLeft" ? Math.max(0, index - 1)
      : event.key === "Home" ? 0 : event.key === "End" ? points.length - 1 : null;
    if (next !== null) {
      event.preventDefault();
      setFocusIndex(next);
      setSelectedPeriod(null);
      setPreviewPeriod(points[next].periodCode);
      barRefs.current[next]?.focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setPreviewPeriod(points[index].periodCode);
    } else if (event.key === "Escape") clearSelection();
  }

  const zeroY = geometry.y(0);
  const bottom = geometry.margin.top + geometry.plotHeight;
  const activeX = active ? geometry.x(active.periodCode) - scrollLeft : 0;
  const tooltipLeft = Math.max(8, Math.min(viewportWidth - 280, activeX + (activeX + 290 < viewportWidth ? 22 : -294)));
  const highlightLeft = annotation ? Math.max(geometry.margin.left, geometry.x(annotation.startPeriodCode) - geometry.slotWidth / 2) : 0;
  const highlightRight = annotation ? Math.min(geometry.width - geometry.margin.right, geometry.x(annotation.endPeriodCode) + geometry.slotWidth / 2) : 0;

  return (
    <figure className={`not-prose overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${isPublic ? "m-0" : "my-10 sm:my-12"}`}
      aria-labelledby={`${id}-title`}>
      <header className={`px-5 pt-6 sm:px-7 sm:pt-7 ${isPublic ? "text-center" : ""}`}>
        <p className="mb-3 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#164e63]">Reallønn</p>
        <h2 id={`${id}-title`} className={`m-0 text-balance font-serif font-semibold leading-[1.08] tracking-[-0.025em] text-slate-950 ${isPublic ? "text-[1.6rem] sm:text-[2.5rem]" : "text-[1.35rem] sm:text-[2.15rem]"}`}>{isNational ? "Utvikling i reallønn hele Norge" : variant === "age" ? "Utvikling i reallønn etter alder" : variant === "occupation" ? `Utvikling i reallønn – ${occupationLabel}` : quarterlyRealWageTitle}</h2>
        {!isPublic ? <>
          <p className="mb-0 mt-2 text-xs text-slate-600 sm:text-base">Hele Norge · Endring fra kvartalet før</p>
          <p className="mb-0 mt-1 text-xs text-slate-500">{points.length ? `${formatRealWageQuarter(points[0].periodCode)}–${formatRealWageQuarter(points.at(-1)!.periodCode)}` : "Ingen kvartalsdata"}</p>
        </> : null}
        {!hasFixedAge ? <div className={`mt-5 flex flex-wrap items-end gap-x-6 gap-y-4 ${isPublic ? "justify-center" : ""}`}>
          {!isPublic ? <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-2 text-xs font-semibold text-slate-600">Kjønn</legend>
            <div className="inline-flex max-w-full gap-1 rounded-full border border-slate-200 p-1">
              {dataset.genders.map((option) => <button key={option.code} type="button" aria-pressed={genderCode === option.code} aria-controls={`${id}-chart`}
                onClick={() => { setGenderCode(option.code); clearSelection(); }}
                className={`min-h-10 rounded-full px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] sm:px-4 motion-reduce:transition-none ${genderCode === option.code ? "bg-[#0b376d] text-white" : "text-[#0b376d] hover:bg-slate-50"}`}>
                {option.label}
              </button>)}
            </div>
          </fieldset> : null}
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-2 text-xs font-semibold text-slate-600">Aldersgruppe</legend>
            <div className="flex flex-wrap gap-2">
              {dataset.ages.map((option) => <button key={option.code} type="button" aria-pressed={ageCode === option.code} aria-controls={`${id}-chart`}
                onClick={() => { setAgeCode(option.code); clearSelection(); }}
                className={`min-h-10 rounded-full border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] sm:px-4 motion-reduce:transition-none ${ageCode === option.code ? "border-[#0b376d] bg-[#0b376d] text-white" : "border-slate-200 bg-white text-[#0b376d] hover:bg-slate-50"}`}>
                {option.label}
              </button>)}
            </div>
          </fieldset>
        </div> : null}
        {!isPublic ? <p className="mb-0 mt-3 text-xs text-slate-500" aria-live="polite">{occupationLabel} · {genderLabel} · {ageLabel}</p> : null}
      </header>

      {annotation ? <div className="mx-5 mt-5 flex justify-end sm:mx-7">
        <div className="max-w-full border-r-4 border-slate-300 bg-slate-100 px-4 py-3 text-right" data-real-wage-annotation>
          <p className="m-0 text-xs font-semibold text-slate-700">Siste fire kvartaler samlet</p>
          <p className="mb-0 mt-1 text-2xl font-bold tabular-nums" style={{ color: colorFor(annotation.value) }}>
            {annotation.value === null ? "Mangler data" : formatRealWagePercent(annotation.value)}
          </p>
          <p className="mb-0 mt-1 text-xs text-slate-600">{formatRealWageQuarter(annotation.startPeriodCode)}–{formatRealWageQuarter(annotation.endPeriodCode)}</p>
        </div>
      </div> : null}

      <div ref={containerRef} className="relative w-full">
        {points.length ? <div ref={scrollerRef} className="w-full overflow-x-auto" onScroll={(event) => {
          setScrollLeft(event.currentTarget.scrollLeft);
          if (!barRefs.current.some((element) => element === document.activeElement)) setPreviewPeriod(null);
        }}>
          <svg id={`${id}-chart`} viewBox={`0 0 ${geometry.width} ${geometry.height}`} width={geometry.width} height={geometry.height}
            className="block max-w-none touch-pan-x touch-pan-y select-none" role="group"
            aria-label={`Kvartalsvis reallønnsvekst, ${occupationLabel}, ${genderLabel}, ${ageLabel}. Bruk piltastene for å bytte kvartal.`}>
            <g aria-hidden="true" pointerEvents="none">
              {annotation && highlightRight > highlightLeft ? <rect data-real-wage-highlight
                data-start-quarter={annotation.startPeriodCode} data-end-quarter={annotation.endPeriodCode}
                x={highlightLeft} y={geometry.margin.top} width={highlightRight - highlightLeft} height={geometry.plotHeight}
                fill="#e2e8f0" /> : null}
              {geometry.ticks.map((tick) => <g key={tick}>
                <line x1={geometry.margin.left} x2={geometry.width - geometry.margin.right} y1={geometry.y(tick)} y2={geometry.y(tick)}
                  stroke={tick === 0 ? "#0b376d" : "#dbe3e8"} strokeWidth={tick === 0 ? 1.5 : 1} strokeDasharray={tick === 0 ? undefined : "3 5"} />
                <text x={geometry.margin.left - 10} y={geometry.y(tick) + 4} textAnchor="end" fontSize="12" fill={tick === 0 ? "#0b376d" : "#64748b"}>{axis.format(tick)} %</text>
              </g>)}
              <line x1={geometry.margin.left} x2={geometry.margin.left} y1={geometry.margin.top} y2={bottom} stroke="#94a3b8" />
              {active ? <line x1={geometry.x(active.periodCode)} x2={geometry.x(active.periodCode)} y1={geometry.margin.top} y2={bottom} stroke="#94a3b8" strokeDasharray="3 5" /> : null}
              {points.map((point) => <g key={point.periodCode}>
                {point.realGrowth === null ? <text x={geometry.x(point.periodCode)} y={zeroY + 4} textAnchor="middle" fill="#64748b" fontSize="12">—</text>
                  : point.realGrowth === 0 ? <line x1={geometry.x(point.periodCode) - geometry.barWidth / 2} x2={geometry.x(point.periodCode) + geometry.barWidth / 2} y1={zeroY} y2={zeroY} stroke={realWageColors.neutral} strokeWidth="3" />
                    : <rect data-quarterly-real-wage-bar={point.periodCode} x={geometry.x(point.periodCode) - geometry.barWidth / 2}
                      y={Math.min(zeroY, geometry.y(point.realGrowth))} width={geometry.barWidth} height={Math.abs(geometry.y(point.realGrowth) - zeroY)} fill={colorFor(point.realGrowth)} />}
                <text x={geometry.x(point.periodCode)} y={bottom + 19} textAnchor="middle" fontSize="10" fill="#64748b">K{point.periodCode.at(-1)}</text>
              </g>)}
              {geometry.years.map((year) => <text key={year.year} x={year.x} y={bottom + 42} textAnchor="middle" fontSize="12" fontWeight="600" fill="#475569">{year.year}</text>)}
            </g>
            {points.map((point, index) => <rect key={point.periodCode} ref={(element) => { barRefs.current[index] = element; }}
              x={geometry.x(point.periodCode) - geometry.slotWidth / 2} y={geometry.margin.top} width={geometry.slotWidth} height={geometry.plotHeight + 24}
              fill="transparent" role="button" tabIndex={focusIndex === index ? 0 : -1} aria-pressed={point.periodCode === activePeriod}
              aria-describedby={point.periodCode === activePeriod ? `${id}-tooltip` : undefined}
              aria-label={`${formatRealWageQuarter(point.periodCode)}, ${occupationLabel}, ${genderLabel}, ${ageLabel}. Reallønnsendring fra kvartalet før: ${point.realGrowth === null ? "mangler data" : formatRealWagePercent(point.realGrowth)}.`}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse" || event.pointerType === "pen" && event.buttons === 0) {
                  setSelectedPeriod(null); setPreviewPeriod(point.periodCode);
                }
              }}
              onPointerLeave={() => setPreviewPeriod(null)}
              onPointerDown={(event) => { pointerTypeRef.current = event.pointerType; }}
              onPointerCancel={() => { pointerTypeRef.current = null; setPreviewPeriod(null); }}
              onClick={() => {
                if (pointerTypeRef.current === "touch" || pointerTypeRef.current === "pen") {
                  setSelectedPeriod(point.periodCode); setPreviewPeriod(null);
                }
                pointerTypeRef.current = null;
              }}
              onFocus={(event) => { setFocusIndex(index); if (event.currentTarget.matches(":focus-visible")) setPreviewPeriod(point.periodCode); }}
              onBlur={() => setPreviewPeriod(null)} onKeyDown={(event) => handleKeyDown(event, index)}
              className="cursor-pointer outline-none focus-visible:stroke-[#0b376d] focus-visible:stroke-1" />)}
          </svg>
        </div> : <p className="px-5 py-8 text-sm text-slate-600 sm:px-7">Ingen kvartalsdata for dette utvalget.</p>}

        {active ? <div ref={tooltipRef} id={`${id}-tooltip`} role="tooltip" aria-live="polite" aria-atomic="true"
          className={`${selectedPeriod === null ? "pointer-events-none" : "pointer-events-auto"} z-20 rounded-[6px] border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-[0_12px_32px_rgba(15,23,42,0.12)] ${viewportWidth < 520 ? "mx-5 mb-4" : "absolute top-8 w-[272px]"}`}
          style={viewportWidth < 520 ? undefined : { left: tooltipLeft }}>
          <p className="m-0 mb-1 text-sm font-extrabold text-[#0b376d]">{formatRealWageQuarter(active.periodCode)}</p>
          <p className="m-0 mb-1 font-semibold text-slate-800">{occupationLabel}</p>
          <p className="m-0 mb-2">{genderLabel} · {ageLabel}</p>
          <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
            <dt>Reallønnsendring</dt><dd className="m-0 text-right font-extrabold tabular-nums" style={{ color: colorFor(active.realGrowth) }}>{active.realGrowth === null ? "Mangler data" : formatRealWagePercent(active.realGrowth)}</dd>
            <dt>Lønnsvekst</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{formatRealWagePercent(active.nominalGrowth)}</dd>
            <dt>Prisvekst (KPI)</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{formatRealWagePercent(active.inflation)}</dd>
            <dt>{salaryLabel}</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{active.salary === null ? "—" : `${money.format(active.salary)} kr`}</dd>
          </dl>
          <p className="mb-0 mt-2">{active.missingReason ?? (active.realGrowth === 0 ? "Kjøpekraften var uendret fra kvartalet før."
            : active.realGrowth! > 0 ? "Lønnen steg mer enn prisene fra kvartalet før." : "Lønnen utviklet seg svakere enn prisene fra kvartalet før.")}</p>
        </div> : null}
      </div>

      {!isPublic ? <section aria-labelledby={`${id}-five-year-title`} aria-live="polite" aria-atomic="true"
        className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-5 py-5 sm:px-7">
        <div>
          <h3 id={`${id}-five-year-title`} className="m-0 text-sm font-semibold text-slate-800">Reallønnsutvikling siste 5 år</h3>
          <p className="mb-0 mt-1 text-xs text-slate-600">{genderLabel} · {ageLabel}</p>
          {fiveYearGrowth ? <p className="mb-0 mt-1 text-xs text-slate-500">{formatRealWageQuarter(fiveYearGrowth.startPeriodCode)}–{formatRealWageQuarter(fiveYearGrowth.endPeriodCode)}</p> : null}
        </div>
        <p className="m-0 text-2xl font-bold tabular-nums sm:text-3xl" style={{ color: colorFor(fiveYearGrowth?.value ?? null) }}>
          {fiveYearGrowth?.value === null || !fiveYearGrowth ? <span className="text-sm font-semibold">Mangler data</span> : formatRealWagePercent(fiveYearGrowth.value)}
        </p>
      </section> : null}

      <figcaption className="grid gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:px-7">
        <p className="m-0 font-bold text-slate-700">Kilde: SSB, tabell <a className="underline underline-offset-2" href={`https://www.ssb.no/statbank/table/${dataset.salaryTableId}/`}>{dataset.salaryTableId}</a> ({salaryLabel.toLocaleLowerCase("nb-NO")}) og <a className="underline underline-offset-2" href={`https://www.ssb.no/statbank/table/${dataset.inflationTableId}/`}>{dataset.inflationTableId}</a> (KPI).</p>
        <p className="m-0 text-slate-500">Lønn oppdatert {dataset.salaryUpdated?.slice(0, 10) ?? "ukjent"} · KPI oppdatert {dataset.inflationUpdated?.slice(0, 10) ?? "ukjent"}</p>
      </figcaption>
    </figure>
  );
}
