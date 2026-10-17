"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  buildOccupationComparisonScale, occupationComparisonInsight, prepareOccupationComparison,
  salaryDifference, sortOccupationComparison,
  type OccupationComparisonView,
  type OccupationSalaryComparisonDataset, type OccupationSalaryObservation,
} from "@/lib/occupation-salary-comparison";
import { formatRealWagePercent, realWageColors } from "@/lib/real-wage-growth";
import styles from "./occupation-salary-comparison-explorer.module.css";

const number = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const compactNumber = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1 });
const money = (value: number | null) => value === null ? "Mangler data" : `${number.format(value)} kr`;
const signedMoney = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${number.format(Math.abs(value))} kr`;
const growthColor = (value: number | null) => value === null || value === 0 ? realWageColors.neutral : value > 0 ? realWageColors.positive : realWageColors.negative;

type Props = {
  dataset: OccupationSalaryComparisonDataset;
  selectedOccupationCode: string;
  /** Utelatt: alle yrker i datasettet. Referanseyrket inkluderes alltid. */
  comparisonOccupationCodes?: readonly string[];
};

export function OccupationSalaryComparisonExplorer({ dataset, selectedOccupationCode, comparisonOccupationCodes }: Props) {
  const id = useId();
  const points = useMemo(() => prepareOccupationComparison(dataset, comparisonOccupationCodes
    ? [selectedOccupationCode, ...comparisonOccupationCodes] : undefined), [dataset, selectedOccupationCode, comparisonOccupationCodes]);
  const [view, setView] = useState<OccupationComparisonView>("salary");
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const sorted = useMemo(() => sortOccupationComparison(points, "salary-desc"), [points]);
  const reference = points.find((point) => point.occupationCode === selectedOccupationCode);
  const referenceSalary = reference?.medianMonthlySalary ?? null;
  const scale = buildOccupationComparisonScale(points, referenceSalary, view);
  const activeCode = previewCode ?? selectedCode;
  const active = points.find((point) => point.occupationCode === activeCode);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const tooltipRef = useRef<HTMLDivElement>(null);
  const pointerType = useRef<string | null>(null);

  useEffect(() => {
    if (selectedCode === null) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !tooltipRef.current?.contains(event.target)
        && !buttonRefs.current.get(selectedCode!)?.contains(event.target)) {
        setSelectedCode(null);
        setPreviewCode(null);
      }
    }
    document.addEventListener("pointerdown", dismiss, true);
    return () => document.removeEventListener("pointerdown", dismiss, true);
  }, [selectedCode]);

  function clearActive() { setSelectedCode(null); setPreviewCode(null); }
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowDown" || event.key === "ArrowRight" ? Math.min(sorted.length - 1, index + 1)
      : event.key === "ArrowUp" || event.key === "ArrowLeft" ? Math.max(0, index - 1)
      : event.key === "Home" ? 0 : event.key === "End" ? sorted.length - 1 : null;
    if (next !== null) {
      event.preventDefault();
      setSelectedCode(null);
      setPreviewCode(sorted[next].occupationCode);
      buttonRefs.current.get(sorted[next].occupationCode)?.focus();
    }
  }

  return (
    <figure className="not-prose my-10 min-w-0 rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:my-12"
      aria-labelledby={`${id}-title`}
      onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); clearActive(); } }}>
      <header className="px-5 pt-6 sm:px-7 sm:pt-7">
        <p className="mb-3 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#164e63]">Lønnssammenligning</p>
        <h2 id={`${id}-title`} className="m-0 text-balance font-serif text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.025em] text-slate-950 sm:text-[2.15rem]">Slik er lønnen sammenlignet med lignende yrker</h2>
        <p className="mb-0 mt-2 text-xs text-slate-600 sm:text-base">Sammenligning av median månedslønn for {reference?.occupationName.toLocaleLowerCase("nb-NO") ?? "valgt yrke"} og beslektede yrker · {dataset.year}</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Vis verdier:</span>
          <div role="group" aria-label="Vis verdier" className="inline-flex gap-1 rounded-full border border-slate-200 p-1">
            {([{ value: "salary", label: "Månedslønn" }, { value: "difference", label: "Forskjell" }] as const).map((option) => (
              <button key={option.value} type="button" aria-pressed={view === option.value} onClick={() => { clearActive(); setView(option.value); }}
                className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] motion-reduce:transition-none ${view === option.value ? "bg-[#0b376d] text-white" : "text-[#0b376d] hover:bg-slate-50"}`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.chart} px-3 sm:px-5`}>
        <p className="mb-2 mt-0 px-2 text-xs font-semibold text-slate-500">{view === "salary" ? "Median månedslønn (kr)" : `Forskjell fra ${reference?.occupationName.toLocaleLowerCase("nb-NO") ?? "valgt yrke"} (kr)`}</p>
        {!reference ? <p className="px-2 text-sm text-slate-600">Referanseyrket mangler i datagrunnlaget for {dataset.year}.</p> : null}
        {view === "difference" && referenceSalary === null ? <p className="px-2 text-sm text-slate-600">Differanser kan ikke beregnes uten medianlønn for referanseyrket.</p> : null}
        <p className="sr-only" aria-live="polite">Høyest lønn først. Viser {view === "salary" ? "månedslønn" : "forskjell"} for {sorted.length} yrker.</p>
        <ol className="relative m-0 list-none p-0" aria-label="Sammenlign yrker. Bruk piltastene, Home og End for å utforske, og Escape for å lukke detaljer.">
          {sorted.map((point, index) => {
            const isReference = point.occupationCode === selectedOccupationCode;
            const inFocus = active?.occupationCode === point.occupationCode;
            const difference = salaryDifference(point.medianMonthlySalary, referenceSalary);
            const value = view === "salary" ? point.medianMonthlySalary : difference?.amount ?? null;
            const endpoint = value === null ? scale.zero : scale.position(value);
            const start = Math.min(endpoint, scale.zero);
            const color = isReference ? "#0b376d" : view === "salary" ? "#9aafc2" : growthColor(value);
            const label = value === null ? "Mangler data" : view === "salary" ? money(value) : signedMoney(value);
            const labelPosition = Math.max(endpoint, scale.zero);
            return (
              <li key={point.occupationCode} data-occupation-code={point.occupationCode} className={`relative ${inFocus ? "z-10" : ""}`}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") setPreviewCode(point.occupationCode); }}
                onPointerLeave={(event) => { if (event.pointerType === "mouse") setPreviewCode(null); }}>
                <div data-reference={isReference || undefined}
                  className={`${styles.row} transition-[opacity,background-color] duration-150 motion-reduce:transition-none ${isReference ? "bg-[#f0f5fa]" : inFocus ? "bg-slate-50" : "bg-transparent"}`}
                  style={{ opacity: active && !inFocus && !isReference ? 0.45 : 1 }}>
                  {point.href ? <a href={point.href} className={`min-w-0 rounded-sm text-[0.8rem] leading-5 underline decoration-slate-300 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b376d] ${isReference ? "font-bold text-[#0b376d]" : "font-medium text-slate-700"}`}>{point.occupationName}</a>
                    : <span className={`min-w-0 text-[0.8rem] leading-5 ${isReference ? "font-bold text-[#0b376d]" : "font-medium text-slate-700"}`}>{point.occupationName}</span>}
                <button type="button"
                  ref={(element) => { if (element) buttonRefs.current.set(point.occupationCode, element); else buttonRefs.current.delete(point.occupationCode); }}
                  aria-label={`${point.occupationName}${isReference ? ", valgt referanseyrke" : ""}. Median månedslønn: ${money(point.medianMonthlySalary)}.${view === "difference" ? ` Forskjell: ${label}.` : ""}`}
                  aria-expanded={inFocus} aria-describedby={inFocus ? `${id}-tooltip` : undefined}
                  className={`${styles.track} block cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0b376d]`}
                  onPointerDown={(event) => { pointerType.current = event.pointerType; }}
                  onPointerCancel={() => { pointerType.current = null; }}
                  onClick={(event) => {
                    if (pointerType.current === "touch" || pointerType.current === "pen" || event.detail === 0) {
                      setPreviewCode(null);
                      setSelectedCode(selectedCode === point.occupationCode ? null : point.occupationCode);
                    }
                    pointerType.current = null;
                  }}
                  onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setPreviewCode(point.occupationCode); }}
                  onBlur={() => { setPreviewCode(null); setSelectedCode(null); }}
                  onKeyDown={(event) => handleKeyDown(event, index)}>
                  <span aria-hidden="true">
                    {scale.ticks.map((tick) => <span key={tick} className={styles.gridline} style={{ left: `${scale.position(tick)}%`, borderLeft: tick === 0 ? "1px solid #94a3b8" : undefined }} />)}
                    {value !== null ? <span className={styles.bar} style={{ left: `${start}%`, width: `${Math.abs(endpoint - scale.zero)}%`, backgroundColor: color, transformOrigin: value < 0 ? "right" : "left" }} /> : null}
                    {value === 0 ? <span className="absolute top-1 h-6 w-0.5" style={{ left: `${scale.zero}%`, backgroundColor: color }} /> : null}
                    <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-2 text-xs font-bold tabular-nums text-[#0b376d] sm:text-[0.8rem]" style={{ left: `${labelPosition}%` }}>{value === null ? "—" : label}</span>
                  </span>
                </button>
                </div>
                {inFocus ? <div ref={tooltipRef} id={`${id}-tooltip`} role="tooltip"
                  className={`${styles.tooltip} ${index >= sorted.length / 2 ? styles.tooltipAbove : ""} rounded-[6px] border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-[0_12px_32px_rgba(15,23,42,0.12)]`}>
                  <OccupationDetails point={point} reference={reference} />
                </div> : null}
              </li>
            );
          })}
        </ol>
        {sorted.length ? <div aria-hidden="true" className={`${styles.axis} relative mb-7 mt-2 h-5 text-[0.65rem] tabular-nums text-slate-500 sm:text-xs`}>
          {scale.ticks.map((tick, index) => <span key={tick} className={`absolute whitespace-nowrap ${view === "difference" && index > 0 && index < scale.ticks.length - 1 && tick !== 0 ? "hidden sm:block" : ""} ${index === 0 ? "" : index === scale.ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2"}`}
            style={{ left: `${scale.position(tick)}%` }}>{tick < 0 ? "−" : tick > 0 && view === "difference" ? "+" : ""}{compactNumber.format(Math.abs(tick) >= 1000 ? Math.abs(tick) / 1000 : Math.abs(tick))}{Math.abs(tick) >= 1000 ? "k" : ""}</span>)}
        </div> : <p className="px-2 py-8 text-sm text-slate-600">Ingen yrkesdata å vise for {dataset.year}.</p>}
      </div>

      <figcaption className="rounded-b-[6px] border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:px-7 sm:text-base">
        <p className="m-0 font-bold text-slate-700">Kilde: {dataset.source}.</p>
      </figcaption>
    </figure>
  );
}

function OccupationDetails({ point, reference }: { point: OccupationSalaryObservation; reference: OccupationSalaryObservation | undefined }) {
  const difference = salaryDifference(point.medianMonthlySalary, reference?.medianMonthlySalary ?? null);
  return <>
    <p className="m-0 mb-2 text-sm font-extrabold text-[#0b376d]">{point.occupationName} · {point.year}</p>
    <dl className="m-0 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1">
      <dt>Median månedslønn</dt><dd className="m-0 text-right text-sm font-extrabold tabular-nums text-[#0b376d]">{money(point.medianMonthlySalary)}</dd>
      <dt>Årlig lønnsvekst</dt><dd className="m-0 text-right font-bold tabular-nums" style={{ color: growthColor(point.nominalGrowth) }}>{point.nominalGrowth === null ? "Mangler data" : formatRealWagePercent(point.nominalGrowth)}</dd>
      <dt>Årlig reallønnsvekst</dt><dd className="m-0 text-right font-bold tabular-nums" style={{ color: growthColor(point.realGrowth) }}>{point.realGrowth === null ? "Mangler data" : formatRealWagePercent(point.realGrowth)}</dd>
      <dt>Lønnstakere{point.employeesPeriodLabel ? ` (${point.employeesPeriodLabel})` : ""}</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{point.employees === null ? "Mangler data" : number.format(point.employees)}</dd>
    </dl>
    <div className="mt-2 border-t border-slate-100 pt-2">
      <p className="m-0">Forskjell fra {reference?.occupationName.toLocaleLowerCase("nb-NO") ?? "valgt yrke"}</p>
      <p className="m-0 font-bold tabular-nums text-slate-800">{difference === null ? "Mangler data" : `${signedMoney(difference.amount)} (${formatRealWagePercent(difference.percent)})`}</p>
    </div>
    <p className="mb-0 mt-2">{occupationComparisonInsight(point, reference)}</p>
    {point.realGrowth === null ? <p className="mb-0 mt-2">Reallønnsvekst krever både lønnsvekst og prisvekst for samme år.</p> : null}
  </>;
}
