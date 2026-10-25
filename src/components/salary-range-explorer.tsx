"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./salary-range-explorer.module.css";
import { SalaryRangeInfoDialog } from "./salary-range-info-dialog";
import {
  buildSalaryRangeGeometry, compareSalaryRange, prepareSalaryRange,
  salaryRangeSeries, salaryRangeSegments, toSalaryRangeMonthly,
  type SalaryRangeDataset, type SalaryRangeGender, type SalaryRangeQuartiles,
} from "@/lib/salary-range";

const money = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 2 });
const ownSalaryColor = "#008c87";
const axis = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 2 });

function formatSalary(value: number) {
  return `${money.format(value * 12)} kr/år`;
}

function GenderIcon({ gender }: { gender: SalaryRangeGender }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {gender === "all" ? <><circle cx="9" cy="7" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 4a3 3 0 0 1 0 6M17 13a5 5 0 0 1 4 5v2" /></> :
      gender === "men" ? <><circle cx="9" cy="15" r="6" /><path d="m13.5 10.5 7-7M15 3h6v6" /></> :
        <><circle cx="12" cy="8" r="6" /><path d="M12 14v8M8 18h8" /></>}
  </svg>;
}

function SalaryComparison({ salary, values }: { salary: number; values: SalaryRangeQuartiles }) {
  const comparison = compareSalaryRange(salary, values);
  return <>
    <p className="m-0 font-semibold text-slate-800">{comparison.position}</p>
    <p className="m-0 mt-1">{comparison.difference === 0 ? "Samme lønn som medianen." :
      `${formatSalary(Math.abs(comparison.difference))} (${percent.format(Math.abs(comparison.percent))} %) ${comparison.difference < 0 ? "under" : "over"} medianen.`}</p>
  </>;
}

export function SalaryRangeExplorer({ dataset }: { dataset: SalaryRangeDataset }) {
  const id = useId();
  const years = useMemo(() => prepareSalaryRange(dataset), [dataset]);
  const [chartWidth, setChartWidth] = useState(766);
  const [selectedGender, setSelectedGender] = useState<SalaryRangeGender>("all");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  // Data og sammenligninger bruker månedslønn; alle synlige beløp vises per år.
  const [salary, setSalary] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const pointRefs = useRef(new Map<string, SVGCircleElement>());
  const pressRef = useRef<{ x: number; y: number; key: string; moved: boolean } | null>(null);
  const geometry = useMemo(() => buildSalaryRangeGeometry(years, chartWidth), [years, chartWidth]);
  const activeKey = previewKey ?? selectedKey;
  const selectedSeries = salaryRangeSeries.find((series) => series.key === selectedGender)!;
  const observations = years.map((point) => ({
    ...selectedSeries, year: point.year, values: point[selectedGender], pointKey: `${point.year}-${selectedGender}`,
  }));
  const active = observations.find((point) => point.pointKey === activeKey);
  const summaryYear = active?.year ?? years.at(-1)?.year;
  const summary = years.find((point) => point.year === summaryYear);
  const sliderStep = 1000;
  const sliderMin = 12000;
  const sliderMax = Math.max(150000, geometry?.max ?? 0) * 12;
  const defaultSalary = (years.at(-1)?.[selectedGender]?.median ?? 50000) * 12;
  const sliderValue = Math.max(sliderMin, Math.min(sliderMax, salary === null ? Math.round(defaultSalary / sliderStep) * sliderStep : salary * 12));
  const sliderProgress = (sliderValue - sliderMin) / (sliderMax - sliderMin) * 100;
  const salaryLabel = `${money.format(sliderValue)} kr/år`;
  const salaryLineY = salary !== null && geometry ? geometry.y(Math.max(geometry.min, Math.min(geometry.max, salary))) : null;
  const shownYearLabels = new Set<number>(years.length ? [years[0].year, years.at(-1)!.year, ...(active ? [active.year] : [])] : []);
  for (const point of years) {
    if (geometry && [...shownYearLabels].every((year) => Math.abs(geometry.x(year) - geometry.x(point.year)) >= 38)) shownYearLabels.add(point.year);
  }

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
    if (activeKey === null) return;
    function dismissOutside(event: globalThis.PointerEvent) {
      if (selectedKey !== null && event.target instanceof Node && !tooltipRef.current?.contains(event.target)) {
        setSelectedKey(null);
        setPreviewKey(null);
      }
    }
    function dismissOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") { setSelectedKey(null); setPreviewKey(null); }
    }
    document.addEventListener("pointerdown", dismissOutside, true);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside, true);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [activeKey, selectedKey]);

  function getHit(event: PointerEvent<SVGSVGElement>) {
    if (!geometry) return null;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * chartWidth;
    const y = (event.clientY - rect.top) / rect.height * geometry.height;
    if (x < geometry.margin.left - 12 || x > chartWidth - geometry.margin.right + 12
      || y < geometry.margin.top || y > geometry.margin.top + geometry.plotHeight) return null;
    const year = years.reduce((closest, point) => Math.abs(geometry.x(point.year) - x) < Math.abs(geometry.x(closest.year) - x) ? point : closest);
    return `${year.year}-${selectedGender}`;
  }

  function handleKeyDown(event: KeyboardEvent<SVGCircleElement>, year: number) {
    const index = years.findIndex((point) => point.year === year);
    const nextYear = event.key === "ArrowRight" ? years[Math.min(years.length - 1, index + 1)].year
      : event.key === "ArrowLeft" ? years[Math.max(0, index - 1)].year
      : event.key === "Home" ? years[0].year : event.key === "End" ? years.at(-1)!.year : year;
    if (["ArrowRight", "ArrowLeft", "Home", "End", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      const key = `${nextYear}-${selectedGender}`;
      setSelectedKey(null);
      setPreviewKey(key);
      pointRefs.current.get(key)?.focus({ preventScroll: true });
    } else if (event.key === "Escape") { setSelectedKey(null); setPreviewKey(null); }
  }

  const tooltipLeft = geometry && active ? Math.max(8, Math.min(chartWidth - 280,
    geometry.x(active.year) + (geometry.x(active.year) + 290 < chartWidth ? 22 : -294))) : 8;

  return <figure className="not-prose relative my-10 overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:my-12" aria-labelledby={`${id}-title`}>
    <div className={styles.diagramContent} data-info-open={isInfoOpen} inert={isInfoOpen} aria-hidden={isInfoOpen || undefined}>
    <header className="relative px-5 pt-6 sm:px-7 sm:pt-7">
      <button ref={infoButtonRef} type="button" className={styles.infoButton} aria-label="Forklaring av lønnsspennet" aria-haspopup="dialog" aria-expanded={isInfoOpen} aria-controls={`${id}-info`}
        onClick={() => { setSelectedKey(null); setPreviewKey(null); pressRef.current = null; setIsInfoOpen(true); }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v6" /><circle cx="12" cy="7.5" r="0.8" fill="currentColor" stroke="none" /></svg>
      </button>
      <p className="mb-3 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#164e63]">Lønnsspenn</p>
      <h2 id={`${id}-title`} className="m-0 text-balance font-serif text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.025em] text-slate-950 sm:text-[2.15rem]">{dataset.title}</h2>
      <p className="mb-0 mt-2 text-xs text-slate-600 sm:text-base">Fast avtalt årslønn{years.length ? years.length === 1 ? ` i ${years[0].year}` : ` fra ${years[0].year} til ${years.at(-1)!.year}` : ""}{dataset.isTestData ? " · testdata" : ""}</p>
    </header>
    <div className={styles.controlsShell}>
      <div className={styles.controls} style={{ "--salary-color": ownSalaryColor, "--salary-progress": `${sliderProgress}%`, "--salary-position": `calc(${sliderProgress}% + ${12 - sliderProgress * 0.24}px)` } as CSSProperties}>
        <div className={styles.genderSection} role="group" aria-labelledby={`${id}-gender-label`}>
          <p id={`${id}-gender-label`} className={styles.controlLabel}>Velg kjønn</p>
          <div className={styles.genderButtons}>
            {salaryRangeSeries.map((option) => <button key={option.key} type="button" aria-pressed={selectedGender === option.key} aria-controls={`${id}-chart`}
              onClick={() => { setSelectedGender(option.key); setSelectedKey(null); setPreviewKey(null); }}
              className={styles.genderButton}>
              <span className={styles.genderIcon} style={{ color: selectedGender === option.key ? "white" : option.key === "all" ? "#0b376d" : option.key === "men" ? "#0067ff" : "#ff1682" }}><GenderIcon gender={option.key} /></span>
              {option.label}
            </button>)}
          </div>
        </div>
        <div className={styles.salarySection}>
          <label htmlFor={`${id}-salary`} className={styles.controlLabel}>Din lønn<span className="sr-only"> · fast brutto årslønn i 100 % stilling</span></label>
          <output htmlFor={`${id}-salary`} className={styles.salaryOutput}>{salaryLabel}</output>
          <div className={styles.sliderWrap}>
            <span className={styles.salaryBubble} aria-hidden="true">{salaryLabel}</span>
            <span className={styles.salaryBubbleArrow} aria-hidden="true" />
            <input id={`${id}-salary`} type="range" min={sliderMin} max={sliderMax} step={sliderStep} value={sliderValue}
              aria-label="Velg din faste brutto årslønn i 100 % stilling"
              aria-valuetext={`${money.format(sliderValue)} kroner per år`}
              onChange={(event) => setSalary(toSalaryRangeMonthly(Number(event.target.value), "year"))}
              className={styles.slider} />
          </div>
        </div>
      </div>
    </div>
    <div ref={containerRef} className="relative w-full">
      {geometry ? <>
        <svg id={`${id}-chart`} height={geometry.height} viewBox={`0 0 ${chartWidth} ${geometry.height}`} className="block w-full touch-pan-y select-none"
          role="group" aria-label={`Lønnsspenn over tid · ${selectedSeries.label}. Bruk høyre og venstre piltast for å bytte år.`}
          onPointerMove={(event) => {
            if (pressRef.current && Math.hypot(event.clientX - pressRef.current.x, event.clientY - pressRef.current.y) > 8) pressRef.current.moved = true;
            if (event.pointerType === "mouse" || event.pointerType === "pen" && event.buttons === 0) { setSelectedKey(null); setPreviewKey(getHit(event)); }
          }}
          onPointerLeave={() => setPreviewKey(null)}
          onPointerDown={(event) => {
            if (event.pointerType === "mouse") { pressRef.current = null; setSelectedKey(null); return; }
            const key = getHit(event);
            pressRef.current = key ? { x: event.clientX, y: event.clientY, key, moved: false } : null;
          }}
          onPointerCancel={() => { pressRef.current = null; setPreviewKey(null); }}
          onClick={() => { const press = pressRef.current; pressRef.current = null; if (press && !press.moved) { setSelectedKey(press.key); setPreviewKey(null); } }}>
          <defs><clipPath id={`${id}-clip`}><rect x={geometry.margin.left - 7} y={geometry.margin.top} width={geometry.plotWidth + 14} height={geometry.plotHeight} /></clipPath></defs>
          <text x={geometry.margin.left} y={24} fill="#64748b" fontSize="12" aria-hidden="true">mill. kr/år</text>
          {geometry.ticks.map((tick) => <g key={tick} aria-hidden="true">
            <line x1={geometry.margin.left} x2={chartWidth - geometry.margin.right} y1={geometry.y(tick)} y2={geometry.y(tick)} stroke="#dbe3e8" strokeDasharray="3 5" />
            <text x={geometry.margin.left - 10} y={geometry.y(tick) + 4} fill="#64748b" fontSize="12" textAnchor="end">{axis.format(tick * 12 / 1000000)}</text>
          </g>)}
          <line x1={geometry.margin.left} x2={geometry.margin.left} y1={geometry.margin.top} y2={geometry.margin.top + geometry.plotHeight} stroke="#94a3b8" aria-hidden="true" />
          {active ? <line x1={geometry.x(active.year)} x2={geometry.x(active.year)} y1={geometry.margin.top} y2={geometry.margin.top + geometry.plotHeight} stroke="#94a3b8" strokeDasharray="3 5" pointerEvents="none" /> : null}
          <g clipPath={`url(#${id}-clip)`} pointerEvents="none" aria-hidden="true">
            {[selectedSeries].map((gender) => <g key={gender.key} data-salary-range-series={gender.key}>
              {salaryRangeSegments(years, gender.key).map((segment) => {
                const upper = segment.map((point) => `${geometry.x(point.year)},${geometry.y(point.values.p75)}`);
                const lower = [...segment].reverse().map((point) => `${geometry.x(point.year)},${geometry.y(point.values.p25)}`);
                return <g key={segment[0].year}>
                  {segment.length === 1 ? <rect x={geometry.x(segment[0].year) - 6} y={geometry.y(segment[0].values.p75)} width={12} height={geometry.y(segment[0].values.p25) - geometry.y(segment[0].values.p75)} fill={gender.color} fillOpacity="0.14" /> :
                    <path d={`M${upper.join(" L")} L${lower.join(" L")} Z`} fill={gender.color} fillOpacity="0.14" />}
                  {(["p25", "p75"] as const).map((key) => <path key={key} d={segment.map((point, index) => `${index === 0 ? "M" : "L"}${geometry.x(point.year)},${geometry.y(point.values[key])}`).join(" ")} stroke={gender.color} strokeWidth="1" strokeOpacity="0.5" fill="none" />)}
                  <path d={segment.map((point, index) => `${index === 0 ? "M" : "L"}${geometry.x(point.year)},${geometry.y(point.values.median)}`).join(" ")} stroke={gender.color} strokeWidth="3" strokeLinejoin="round" fill="none" />
                </g>;
              })}
              {years.map((point) => point[gender.key] ? <circle key={point.year} cx={geometry.x(point.year)} cy={geometry.y(point[gender.key]!.median)} r={activeKey === `${point.year}-${gender.key}` ? 6 : 3.5} fill={gender.color} stroke="white" strokeWidth="1.5" /> :
                <text key={point.year} x={geometry.x(point.year)} y={geometry.y(geometry.min) - 6} fill={gender.color} fontSize="14" textAnchor="middle">×</text>)}
            </g>)}
          </g>
          {salary !== null && salaryLineY !== null ? <g pointerEvents="none" aria-hidden="true" data-salary-range-own={salary}>
            <line x1={geometry.margin.left} x2={chartWidth - geometry.margin.right} y1={salaryLineY} y2={salaryLineY} stroke={ownSalaryColor} strokeWidth="2" strokeDasharray="7 5" />
            <text x={geometry.margin.left + 6} y={salaryLineY < geometry.margin.top + 24 ? salaryLineY + 18 : salaryLineY - 8} fill={ownSalaryColor} fontSize="12" fontWeight="700" stroke="white" strokeWidth="4" paintOrder="stroke">Din lønn · {formatSalary(salary)}</text>
          </g> : null}
          {observations.map((point) => <circle key={point.pointKey} ref={(element) => { if (element) pointRefs.current.set(point.pointKey, element); else pointRefs.current.delete(point.pointKey); }}
            cx={geometry.x(point.year)} cy={geometry.y(point.values?.median ?? geometry.min)} r="20" fill="transparent" pointerEvents="none" role="button" tabIndex={0}
            aria-label={`${point.year}, ${point.label}. ${point.values ? `Nedre kvartil ${formatSalary(point.values.p25)}, median ${formatSalary(point.values.median)}, øvre kvartil ${formatSalary(point.values.p75)}.` : "Mangler kvartiltall."}`}
            aria-describedby={activeKey === point.pointKey ? `${id}-tooltip` : undefined}
            onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) { setSelectedKey(null); setPreviewKey(point.pointKey); } }}
            onBlur={() => setPreviewKey(null)} onKeyDown={(event) => handleKeyDown(event, point.year)}
            className="outline-none focus-visible:stroke-[#0b376d] focus-visible:stroke-1" />)}
          {years.filter((point) => shownYearLabels.has(point.year)).map((point) => <text key={point.year} x={geometry.x(point.year)}
            y={geometry.margin.top + geometry.plotHeight + (active?.year === point.year && years.some((edge) => edge.year !== point.year && (edge === years[0] || edge === years.at(-1)) && Math.abs(geometry.x(edge.year) - geometry.x(point.year)) < 38) ? 44 : 28)}
            fill="#64748b" fontSize="12" textAnchor="middle" aria-hidden="true">{point.year}</text>)}
        </svg>
        {active ? <div ref={tooltipRef} id={`${id}-tooltip`} role="tooltip"
          className={`${selectedKey === null ? "pointer-events-none" : "pointer-events-auto"} z-20 rounded-[6px] border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-[0_12px_32px_rgba(15,23,42,0.12)] ${chartWidth < 440 ? "mx-5 mb-4" : "absolute top-8 w-[272px]"}`}
          style={chartWidth < 440 ? undefined : { left: tooltipLeft }}>
          <p className="m-0 mb-2 text-sm font-extrabold text-[#0b376d]">{active.year} · <span aria-hidden="true" style={{ color: active.color }}>{active.symbol}</span> {active.label}</p>
          {active.values ? <>
            <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
              <dt>Nedre kvartil</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{formatSalary(active.values.p25)}</dd>
              <dt>Median årslønn</dt><dd className="m-0 text-right font-extrabold tabular-nums" style={{ color: active.color }}>{formatSalary(active.values.median)}</dd>
              <dt>Øvre kvartil</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{formatSalary(active.values.p75)}</dd>
              <dt>Spenn · midterste 50 %</dt><dd className="m-0 text-right font-bold tabular-nums text-slate-800">{formatSalary(active.values.p75 - active.values.p25)}</dd>
            </dl>
            {salary !== null ? <div className="mt-3 border-t border-slate-100 pt-2"><p className="m-0 mb-1 font-bold" style={{ color: ownSalaryColor }}>Din lønn · {formatSalary(salary)}</p><SalaryComparison salary={salary} values={active.values} /></div> : null}
          </> : <p className="m-0">Mangler gyldige kvartiltall for dette kjønnet og året.</p>}
        </div> : null}
      </> : <p className="px-5 py-8 text-sm text-slate-600 sm:px-7">Ingen gyldige kvartiltall å vise.</p>}
    </div>
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 px-5 pb-4 text-xs text-slate-600 sm:px-7" aria-label="Tegnforklaring">
      <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-3 w-5 border-y-2" style={{ borderColor: selectedSeries.color, backgroundColor: `${selectedSeries.color}24` }} />{selectedSeries.symbol} {selectedSeries.label}</span>
      <span>Felt: midterste 50 % · linje: median</span>
    </div>
    {salary !== null && summary ? <section aria-live="polite" aria-atomic="true" aria-label="Din lønn sammenlignet med kvinner og menn" className="border-t border-slate-100 px-5 py-5 text-xs leading-5 text-slate-600 sm:px-7">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="m-0 text-sm font-bold text-slate-950">Slik ligger du an i {summary.year}{dataset.isTestData ? " · testdata" : ""}</h3>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{salaryRangeSeries.filter((series) => series.key !== "all").map((gender) => {
        const values = summary[gender.key];
        const comparison = values ? compareSalaryRange(salary, values) : null;
        return <div key={gender.key} className="border-l-2 pl-3" style={{ borderColor: gender.color }}>
          <p className="m-0 mb-1 font-bold" style={{ color: gender.color }}>{gender.symbol} Sammenlignet med {gender.label.toLowerCase()}</p>
          {comparison && values ? <>
            <p className="m-0 text-lg font-bold leading-7 text-slate-950">{comparison.difference === 0 ? "På medianen" : `${percent.format(Math.abs(comparison.percent))} % ${comparison.difference > 0 ? "over" : "under"} medianen`}</p>
            <p className="m-0 mt-1 text-slate-800">{comparison.difference === 0 ? "Du tjener det samme som medianen." : `${formatSalary(Math.abs(comparison.difference))} ${comparison.difference > 0 ? "mer" : "mindre"} enn medianen.`}</p>
            <p className="m-0 mt-1">Median: <span className="font-semibold tabular-nums">{formatSalary(values.median)}</span></p>
            <p className="m-0 mt-2 text-[0.7rem]">{comparison.position}</p>
          </> : <p className="m-0">Mangler kvartiltall for {gender.label.toLowerCase()} i {summary.year}.</p>}
        </div>;
      })}</div>
      <p className="mb-0 mt-4 text-[0.7rem] text-slate-500">Årsbeløp er månedslønn ganget med tolv. Linjen viser samme lønnsbeløp i alle år, uten inflasjonsjustering.</p>
    </section> : null}
    <figcaption className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs leading-relaxed text-slate-600 sm:px-7 sm:text-base"><span className="font-bold text-slate-700">Kilde: {dataset.source}.</span></figcaption>
    </div>
    {isInfoOpen ? <SalaryRangeInfoDialog id={`${id}-info`} onClose={() => setIsInfoOpen(false)} returnFocusRef={infoButtonRef} isTestData={dataset.isTestData} /> : null}
  </figure>;
}
