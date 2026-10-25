"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { salaryGrowthSeriesDefinitions } from "@/lib/salary-growth-series";
import {
  buildWorkforceScale,
  formatWorkforceCount,
  formatWorkforcePercent,
  prepareWorkforceGrowth,
  workforcePercentChange,
  workforceValue,
  type WorkforceFilter,
  type WorkforceGrowthDataset,
} from "@/lib/workforce-growth";
import styles from "./workforce-growth-explorer.module.css";

const menColor = salaryGrowthSeriesDefinitions.find((series) => series.key === "men")!.color;
const womenColor = salaryGrowthSeriesDefinitions.find((series) => series.key === "women")!.color;
const filters = [{ key: "all", label: "Alle" }, { key: "men", label: "Menn" }, { key: "women", label: "Kvinner" }] as const;
type Selection = { year: number; mode: "hover" | "touch" | "keyboard" } | null;

/** Ren visningskomponent. Datasettet kan leveres fra en yrkesside, blogg eller verkstedet. */
export function WorkforceGrowthExplorer({ dataset }: { dataset: WorkforceGrowthDataset }) {
  const id = useId();
  const points = useMemo(() => prepareWorkforceGrowth(dataset), [dataset]);
  const [filter, setFilter] = useState<WorkforceFilter>("all");
  const [selection, setSelection] = useState<Selection>(null);
  const [width, setWidth] = useState(766);
  const rootRef = useRef<HTMLElement>(null);
  const barRefs = useRef<(SVGRectElement | null)[]>([]);
  const touchRef = useRef<{ pointerId: number; x: number; y: number; year: number } | null>(null);
  const scale = useMemo(() => buildWorkforceScale(points, filter), [points, filter]);
  const active = points.find((point) => point.year === selection?.year);
  const latest = points.at(-1);
  const first = points[0];
  const mismatchCount = points.filter((point) => point.totalMismatch).length;
  const missingCount = points.filter((point) => point.total === null).length;
  const margin = { left: Math.max(48, formatWorkforceCount(scale.maximum).length * 7 + 16), right: 20, top: 28, bottom: 38 };
  const chartWidth = Math.max(width, points.length * 22 + margin.left + margin.right);
  const height = width < 480 ? 292 : 332;
  const plotHeight = height - margin.top - margin.bottom;
  const baseline = margin.top + plotHeight;
  const plotWidth = chartWidth - margin.left - margin.right;
  const slot = plotWidth / Math.max(1, points.length);
  const barWidth = Math.min(54, slot * 0.68);
  const y = (value: number) => baseline - value / scale.maximum * plotHeight;
  const activeIndex = points.findIndex((point) => point.year === active?.year);
  const activeX = margin.left + slot * (activeIndex + 0.5);
  const tooltipLeft = Math.max(12, Math.min(width - 284, activeX + (activeX + 300 < width ? 22 : -294)));
  const labelStride = Math.max(1, Math.ceil(44 / slot));
  const updated = dataset.updated ? new Date(dataset.updated) : null;
  const quarterLabel = dataset.quarter ? `${dataset.quarter}. kvartal hvert år` : "Årlige tall";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(() => setWidth(root.clientWidth));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selection === null) return;
    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setSelection(null);
    }
    function dismissEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setSelection(null);
    }
    document.addEventListener("pointerdown", dismissOutside, true);
    document.addEventListener("keydown", dismissEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside, true);
      document.removeEventListener("keydown", dismissEscape);
    };
  }, [selection]);

  function handleKeyDown(event: KeyboardEvent<SVGRectElement>, index: number) {
    const next = event.key === "ArrowRight" ? Math.min(points.length - 1, index + 1)
      : event.key === "ArrowLeft" ? Math.max(0, index - 1)
        : event.key === "Home" ? 0 : event.key === "End" ? points.length - 1 : null;
    if (next !== null) {
      event.preventDefault();
      setSelection({ year: points[next].year, mode: "keyboard" });
      barRefs.current[next]?.focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelection({ year: points[index].year, mode: "keyboard" });
    } else if (event.key === "Escape") setSelection(null);
  }

  return (
    <figure ref={rootRef} aria-labelledby={`${id}-title`} className={`${styles.chart} not-prose mx-0 my-8 rounded-[6px] border border-slate-200 bg-white`}>
      <header className="px-5 pt-6 sm:px-7 sm:pt-7">
        <p className="mb-3 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#164e63]">{dataset.occupationLabel}</p>
        <h2 id={`${id}-title`} className="m-0 text-balance font-serif text-[1.35rem] font-semibold leading-[1.12] tracking-[-0.025em] text-slate-950 sm:text-[2.15rem]">
          Slik har antallet lønnstakere utviklet seg
        </h2>
        <p className="mb-0 mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          Utviklingen i antall lønnstakere i yrket, fordelt på kvinner og menn.
        </p>
        <p className="mb-0 mt-1 text-xs leading-5 text-slate-500">{quarterLabel}{first && latest ? ` · ${first.year}–${latest.year}` : ""}</p>
      </header>

      {first && latest ? <div className="px-5 pt-5 sm:px-7">
        <p className="mb-3 text-xs font-semibold text-slate-500">Siste tilgjengelige år: {latest.year}{dataset.quarter ? ` · ${dataset.quarter}. kvartal` : ""}</p>
        <dl className={`${styles.summaries} m-0`} aria-label={`Nøkkeltall for ${latest.year}`}>
          <div className={styles.summary}>
            <dt className="text-xs leading-5 text-slate-600">Totalt antall lønnstakere</dt>
            <dd className="m-0 mt-1 text-2xl font-bold tracking-tight text-[#0b376d] tabular-nums sm:text-3xl">{formatWorkforceCount(latest.total)}</dd>
            <dd className="m-0 mt-2 text-xs leading-5 text-slate-600">
              {workforcePercentChange(latest.total, first.total) === null ? "Endring kan ikke beregnes" : `${formatWorkforcePercent(workforcePercentChange(latest.total, first.total), true)} siden ${first.year}`}
            </dd>
          </div>
          {([{ key: "women", label: "kvinner", color: womenColor }, { key: "men", label: "menn", color: menColor }] as const).map((gender) => {
            const share = latest[`${gender.key}Share`];
            const startShare = first[`${gender.key}Share`];
            const change = share === null || startShare === null ? null : share - startShare;
            return <div key={gender.key} className={styles.summary}>
              <dt className="text-xs leading-5 text-slate-600">Andel {gender.label}</dt>
              <dd className="m-0 mt-1 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl" style={{ color: gender.color }}>{formatWorkforcePercent(share)}</dd>
              <dd className="m-0 mt-1 text-xs leading-5 text-slate-600">{formatWorkforceCount(latest[gender.key])} lønnstakere</dd>
              <dd className="m-0 mt-1 text-xs leading-5 text-slate-600">{change === null ? "Endring kan ikke beregnes" : `${formatWorkforcePercent(change, true, "pp.")} siden ${first.year}`}</dd>
            </div>;
          })}
        </dl>
      </div> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pb-2 pt-6 sm:px-7">
        <div role="group" aria-label="Vis lønnstakere etter kjønn" className="inline-flex max-w-full gap-1 rounded-full border border-slate-200 p-1">
          {filters.map((option) => <button key={option.key} type="button" aria-pressed={filter === option.key}
            onClick={() => { setFilter(option.key); setSelection(null); }}
            className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] motion-reduce:transition-none ${filter === option.key ? "bg-[#0b376d] text-white" : "text-[#0b376d] hover:bg-slate-50"}`}>
            {option.label}
          </button>)}
        </div>
        <div className="flex gap-4 text-xs text-slate-600" aria-label="Fargeforklaring">
          {([{ key: "men", label: "Menn", color: menColor }, { key: "women", label: "Kvinner", color: womenColor }] as const).filter((gender) => filter === "all" || filter === gender.key).map((gender) => <span key={gender.key} className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ backgroundColor: gender.color }} />{gender.label}
          </span>)}
        </div>
      </div>
      <p id={`${id}-help`} className="mx-5 mb-1 mt-2 text-xs leading-5 text-slate-500 sm:mx-7">
        Hold over eller trykk på en stolpe for detaljer. Bruk piltastene for å bytte år.
      </p>
      <p className="sr-only" role="status">Viser {filters.find((item) => item.key === filter)!.label.toLowerCase()}. Y-aksen går fra 0 til {formatWorkforceCount(scale.maximum)} lønnstakere.</p>

      {points.length ? <div className="relative" onPointerLeave={() => setSelection((current) => current?.mode === "hover" ? null : current)}>
        <div className="overflow-x-auto">
          <svg width={chartWidth} height={height} viewBox={`0 0 ${chartWidth} ${height}`} className="block min-w-full touch-auto"
            role="group" aria-label={`Antall lønnstakere per år: ${filters.find((item) => item.key === filter)!.label}`} aria-describedby={`${id}-help`}>
            <text x={margin.left} y={15} fill="#64748b" fontSize="11" aria-hidden="true">Antall lønnstakere</text>
            {scale.ticks.map((tick) => <g key={tick} aria-hidden="true">
              <line x1={margin.left} x2={chartWidth - margin.right} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? "#cbd5e1" : "#e2e8f0"} strokeDasharray={tick === 0 ? undefined : "3 5"} />
              <text x={margin.left - 10} y={y(tick) + 4} textAnchor="end" fill="#64748b" fontSize="11">{formatWorkforceCount(tick)}</text>
            </g>)}
            {points.map((point, index) => {
              const value = workforceValue(point, filter);
              const x = margin.left + slot * (index + 0.5);
              const barHeight = (value ?? 0) / scale.maximum * plotHeight;
              const menHeight = filter === "women" || value === null ? 0 : (point.men ?? 0) / scale.maximum * plotHeight;
              const womenHeight = filter === "men" || value === null ? 0 : (point.women ?? 0) / scale.maximum * plotHeight;
              const clipId = `${id}-clip-${point.year}`;
              const selected = point.year === active?.year;
              const showYear = index === 0 || index === points.length - 1 || index % labelStride === 0 && (points.length - 1 - index) * slot >= 40;
              return <g key={point.year} data-workforce-year={point.year}>
                <defs><clipPath id={clipId}><rect className={styles.bar} x={x - barWidth / 2} y={y(value ?? 0)} width={barWidth} height={barHeight} rx={Math.min(4, barWidth / 5)} /></clipPath></defs>
                <g aria-hidden="true" pointerEvents="none" opacity={active && !selected ? 0.65 : 1} className={styles.bar}>
                  {selected ? <rect x={x - slot * 0.46} y={margin.top} width={slot * 0.92} height={plotHeight} rx="4" fill="#f1f5f9" /> : null}
                  <g clipPath={`url(#${clipId})`}>
                    <rect data-workforce-segment="men" className={styles.bar} x={x - barWidth / 2} y={baseline - menHeight} width={barWidth} height={menHeight} fill={menColor} />
                    <rect data-workforce-segment="women" className={styles.bar} x={x - barWidth / 2} y={baseline - menHeight - womenHeight} width={barWidth} height={womenHeight} fill={womenColor} />
                  </g>
                  {value === null ? <text x={x} y={baseline - 8} fill="#94a3b8" fontSize="13" textAnchor="middle">—</text> : value === 0 ? <line x1={x - barWidth / 2} x2={x + barWidth / 2} y1={baseline} y2={baseline} stroke={filter === "women" ? womenColor : filter === "men" ? menColor : "#64748b"} strokeWidth="2" /> : null}
                  {showYear ? <text x={x} y={height - 14} fill={selected ? "#0b376d" : "#64748b"} fontSize="11" fontWeight={selected ? 700 : 400} textAnchor="middle">{point.year}</text> : null}
                </g>
                <rect ref={(element) => { barRefs.current[index] = element; }} x={margin.left + slot * index} y={margin.top} width={slot} height={plotHeight + 28}
                  fill="transparent" rx="3" role="button" tabIndex={0} aria-pressed={selected} aria-describedby={selected ? `${id}-tooltip` : undefined}
                  aria-label={`${point.year}. Totalt: ${point.total === null ? "mangler data" : formatWorkforceCount(point.total)}. Menn: ${point.men === null ? "mangler data" : formatWorkforceCount(point.men)}. Kvinner: ${point.women === null ? "mangler data" : formatWorkforceCount(point.women)}.`}
                  onPointerEnter={(event) => { if (event.pointerType === "mouse") setSelection({ year: point.year, mode: "hover" }); }}
                  onPointerDown={(event) => {
                    touchRef.current = event.pointerType === "touch" || event.pointerType === "pen" ? { pointerId: event.pointerId, x: event.clientX, y: event.clientY, year: point.year } : null;
                  }}
                  onPointerMove={(event) => {
                    const touch = touchRef.current;
                    if (touch && Math.hypot(event.clientX - touch.x, event.clientY - touch.y) > 10) touchRef.current = null;
                  }}
                  onPointerCancel={() => { touchRef.current = null; }}
                  onClick={() => {
                    if (touchRef.current?.year === point.year) setSelection((current) => current?.year === point.year && current.mode === "touch" ? null : { year: point.year, mode: "touch" });
                    touchRef.current = null;
                  }}
                  onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setSelection({ year: point.year, mode: "keyboard" }); }}
                  onBlur={() => setSelection((current) => current?.mode === "keyboard" ? null : current)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className="cursor-pointer outline-none focus-visible:stroke-[#0b376d] focus-visible:stroke-2" />
              </g>;
            })}
          </svg>
        </div>
        {active ? <div id={`${id}-tooltip`} role="tooltip" className={`${styles.tooltip} rounded-[6px] border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-[0_12px_32px_rgba(15,23,42,0.12)]`} style={{ left: tooltipLeft }}>
          <p className="m-0 mb-2 text-sm font-extrabold text-[#0b376d]">{active.year}{dataset.quarter ? ` · ${dataset.quarter}. kvartal` : ""}</p>
          <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
            <dt>Totalt antall</dt><dd className="m-0 text-right font-extrabold text-slate-950 tabular-nums">{formatWorkforceCount(active.total)}</dd>
            <dt className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="size-2 rounded-sm" style={{ backgroundColor: menColor }} />Menn</dt><dd className="m-0 text-right font-semibold text-slate-800 tabular-nums">{formatWorkforceCount(active.men)}</dd>
            <dt className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="size-2 rounded-sm" style={{ backgroundColor: womenColor }} />Kvinner</dt><dd className="m-0 text-right font-semibold text-slate-800 tabular-nums">{formatWorkforceCount(active.women)}</dd>
            <dt>Andel menn</dt><dd className="m-0 text-right tabular-nums">{formatWorkforcePercent(active.menShare)}</dd>
            <dt>Andel kvinner</dt><dd className="m-0 text-right tabular-nums">{formatWorkforcePercent(active.womenShare)}</dd>
            <dt>Endring fra {active.year - 1}</dt><dd className="m-0 text-right font-bold text-slate-800 tabular-nums">{formatWorkforcePercent(active.annualChange, true)}</dd>
            {active.totalMismatch || active.total === null && active.reportedTotal !== null ? <><dt>SSBs separate total</dt><dd className="m-0 text-right tabular-nums">{formatWorkforceCount(active.reportedTotal)}</dd></> : null}
          </dl>
          {active.totalMismatch ? <p className="mb-0 mt-2 border-t border-slate-100 pt-2">Total og andeler her bygger på menn + kvinner. Summen avviker fra SSBs separate total.</p> : null}
          {active.total === null ? <p className="mb-0 mt-2 border-t border-slate-100 pt-2">Ett eller begge kjønnstall mangler. Samlet stolpe og andeler kan ikke beregnes.</p> : active.total === 0 ? <p className="mb-0 mt-2">Ingen registrerte lønnstakere. Kjønnsandeler kan ikke beregnes.</p> : null}
          {active.annualChange === null ? <p className="mb-0 mt-2">Årsendring krever tall for foregående år og en tidligere total over null.</p> : null}
        </div> : null}
      </div> : <p className="px-5 py-10 text-sm text-slate-600 sm:px-7">Ingen lønnstakerdata tilgjengelig for dette yrket.</p>}

      <figcaption className="rounded-b-[6px] border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-5 text-slate-600 sm:px-7">
        <a href="https://www.ssb.no/statbank/table/11658" target="_blank" rel="noreferrer" className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-[#0b376d]">Kilde: SSB, tabell 11658</a>.
        {dataset.quarter ? ` Viser personer i midtmåneden i ${dataset.quarter}. kvartal hvert år, med heltid og deltid samlet. Tallene er ikke årsgjennomsnitt.` : " Viser antall personer, med heltid og deltid samlet."}
        {updated && Number.isFinite(updated.getTime()) ? ` Oppdatert ${updated.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Oslo" })}.` : ""}
        {mismatchCount > 0 ? <p className="mb-0 mt-2">SSBs separate total avviker fra menn + kvinner i {mismatchCount} år. Diagrammets total og andeler bruker summen av kjønnstallene; begge totalene vises i detaljene.</p> : null}
        {missingCount > 0 ? <p className="mb-0 mt-2">Manglende kjønnstall gir hull i samlet visning. En strek (—) betyr manglende data. Null personer vises på nullinjen.</p> : null}
        <p className="mb-0 mt-1">Totalen er menn + kvinner. Endring i kjønnsandel oppgis i prosentpoeng (pp.).</p>
      </figcaption>
    </figure>
  );
}
