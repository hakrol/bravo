"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Link from "next/link";
import { InteractiveChartTooltip } from "@/components/interactive-chart-tooltip";
import {
  occupationQuadrant, occupationQuadrants, quadrantAxis, quadrantLogAxis, quadrantMedian,
  type OccupationQuadrantDataset, type OccupationQuadrantGender,
} from "@/lib/occupation-quadrant";
import styles from "./occupation-quadrant-explorer.module.css";
import { groupOverlappingQuadrantPoints, placeOccupationQuadrantLabels, type QuadrantLabelBox } from "@/lib/occupation-quadrant-label-layout";

const number = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1 });
const money = (value: number) => `${number.format(value)} kr`;
type Selection = { code: string; mode: "hover" | "locked" | "keyboard" } | null;
const genders = [{ key: "all", label: "Begge kjønn" }, { key: "men", label: "Menn" }, { key: "women", label: "Kvinner" }] as const;

export function OccupationQuadrantExplorer({ dataset }: { dataset: OccupationQuadrantDataset }) {
  const id = useId();
  const rootRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const touchRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const hoverDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [width, setWidth] = useState(720);
  const [selection, setSelection] = useState<Selection>(null);
  const [gender, setGender] = useState<OccupationQuadrantGender>("all");
  const series = gender === "all" ? dataset : dataset[gender];
  const points = useMemo(() => series?.points ?? [], [series]);
  const genderLabel = genders.find((option) => option.key === gender)!.label;
  const salaryLabel = gender === "all" ? "Samlet median månedslønn" : "Median månedslønn";
  const employeesMedian = quadrantMedian(points.map((point) => point.employees)) ?? 0;
  const salaryMedian = quadrantMedian(points.map((point) => point.salary)) ?? 0;
  const active = points.find((point) => point.code === selection?.code);
  const geometry = useMemo(() => {
    const xAxis = quadrantLogAxis(points.map((point) => point.employees));
    const yAxis = quadrantAxis(points.length ? points.map((point) => point.salary) : [0, 1]);
    const labelFontSize = width < 520 ? 12 : 13;
    const margin = { left: width < 520 ? 68 : 84, right: 22, top: 48, bottom: 72 };
    const right = width - margin.right;
    const x = (value: number) => margin.left + (Math.log10(1 + value) - xAxis.minLog)
      / (xAxis.maxLog - xAxis.minLog) * (right - margin.left);
    const visibleXTicks = xAxis.ticks.filter((tick, i, ticks) => i === 0 || i === ticks.length - 1
      || x(tick) - x(ticks[i - 1]) > 60 && x(ticks.at(-1)!) - x(tick) > 60);
    const columns = Math.max(1, Math.floor((right - margin.left) / 200));
    let height = Math.max(width < 520 ? 590 : 470, Math.ceil(points.length / columns) * 50 + 160);
    // Øk høyden ved plassmangel, slik at alle yrkesnavn får en egen etikett.
    while (true) {
      const bottom = height - margin.bottom;
      const y = (value: number) => bottom - (value - yAxis.min) / (yAxis.max - yAxis.min) * (bottom - margin.top);
      const plotted = points.map((point) => ({ ...point, x: x(point.employees), y: y(point.salary) }));
      const splitX = x(employeesMedian);
      const splitY = y(salaryMedian);
      const obstacles: QuadrantLabelBox[] = occupationQuadrants.flatMap((_, index) => {
        const left = index % 2 === 0 ? margin.left : splitX;
        const quadrantRight = index % 2 === 0 ? splitX : right;
        const top = index < 2 ? margin.top : splitY;
        const quadrantBottom = index < 2 ? splitY : bottom;
        const compact = quadrantRight - left < 125;
        return quadrantRight - left > 84 && quadrantBottom - top > (compact ? 64 : 48) ? [{
          left: left + 6, top: index < 2 ? top + 4 : quadrantBottom - (compact ? 60 : 44),
          width: compact ? 78 : 138, height: compact ? 58 : 42,
        }] : [];
      });
      const labels = placeOccupationQuadrantLabels({ points: plotted,
        bounds: { left: margin.left + 6, right: right - 6, top: margin.top + 6, bottom: bottom - 6 },
        fontSize: labelFontSize, obstacles,
      });
      if (labels.length === points.length) return {
        height, margin, right, bottom, x, y, xTicks: visibleXTicks, yTicks: yAxis.ticks,
        plotted, labels, groups: groupOverlappingQuadrantPoints(plotted), labelFontSize,
      };
      height += Math.max(120, points.length * 12);
    }
  }, [points, width, employeesMedian, salaryMedian]);
  const { plotted } = geometry;
  const activeGroup = geometry.groups.find((group) => group.codes.includes(active?.code ?? ""));
  const splitX = geometry.x(employeesMedian);
  const splitY = geometry.y(salaryMedian);

  function cancelHoverDismissal() {
    if (hoverDismissRef.current !== null) {
      clearTimeout(hoverDismissRef.current);
      hoverDismissRef.current = null;
    }
  }

  useEffect(() => () => cancelHoverDismissal(), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const update = () => setWidth(Math.max(240, root.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selection) return;
    const outside = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setSelection(null);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setSelection(null);
    };
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", escape);
    };
  }, [selection]);

  function nearby(clientX: number, clientY: number) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return [];
    const x = (clientX - rect.left) * width / rect.width;
    const y = (clientY - rect.top) * geometry.height / rect.height;
    const label = geometry.labels.find((label) => x >= label.left && x <= label.left + label.width
      && y >= label.top && y <= label.top + label.height);
    if (label) return [{ point: plotted.find((point) => point.code === label.code)!, distance: 0 }];
    return plotted.map((point) => ({ point, distance: Math.hypot(x - point.x, y - point.y) }))
      .filter((item) => item.distance <= 18).sort((a, b) => a.distance - b.distance || a.point.code.localeCompare(b.point.code));
  }

  function preview(event: PointerEvent<SVGSVGElement>) {
    if (touchRef.current && Math.hypot(event.clientX - touchRef.current.x, event.clientY - touchRef.current.y) > 10) {
      touchRef.current.moved = true;
    }
    if (event.pointerType !== "mouse" || selection?.mode === "locked") return;
    const hit = nearby(event.clientX, event.clientY)[0];
    if (hit) {
      cancelHoverDismissal();
      setSelection({ code: hit.point.code, mode: "hover" });
    } else if (hoverDismissRef.current === null) {
      // Gi pekeren tid til å nå den klikkbare infoboksen.
      hoverDismissRef.current = setTimeout(() => {
        hoverDismissRef.current = null;
        setSelection((current) => current?.mode === "hover" ? null : current);
      }, 200);
    }
  }

  function handleKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    const current = points.findIndex((point) => point.code === active?.code);
    const index = event.key === "Home" ? 0 : event.key === "End" ? points.length - 1
      : event.key === "ArrowRight" || event.key === "ArrowUp" ? (current + 1) % points.length
        : event.key === "ArrowLeft" || event.key === "ArrowDown" ? current <= 0 ? points.length - 1 : current - 1 : null;
    if (index !== null && points[index]) {
      event.preventDefault();
      setSelection({ code: points[index].code, mode: "keyboard" });
    }
  }

  return <figure ref={rootRef} aria-labelledby={`${id}-title`} className={`${styles.chart} not-prose mx-0 my-8 rounded-[6px] border border-slate-200 bg-white`}>
    <header className="px-5 pt-6 sm:px-7 sm:pt-7">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-black">{dataset.testDataNote ? "Fiktive testdata" : "Yrker i Norge"} · {dataset.year ?? "Ingen felles periode"}</p>
      <h2 id={`${id}-title`} className="m-0 text-balance font-serif text-[1.35rem] font-semibold leading-[1.12] tracking-[-0.025em] text-slate-950 sm:text-[2.15rem]">{dataset.title ?? "Interaktivt plottdiagram"}</h2>
      <p className="mb-0 mt-3 text-base leading-6 text-black">{dataset.subtitle ?? "Hvilke yrker kombinerer høy lønn med mange lønnstakere? Hvert punkt viser ett yrke."}</p>
      {dataset.testDataNote ? <p className="mb-0 mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm leading-5 text-black">{dataset.testDataNote}</p> : null}
    </header>

    <div className="px-5 pt-5 sm:px-7">
      <div role="group" aria-label="Velg kjønn" className="inline-flex max-w-full flex-wrap gap-1 rounded-full border border-slate-200 p-1">
        {genders.map((option) => <button key={option.key} type="button" aria-pressed={gender === option.key}
          disabled={option.key !== "all" && !dataset[option.key]}
          onClick={() => { cancelHoverDismissal(); setSelection(null); setGender(option.key); }}
          className={`min-h-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d] disabled:cursor-not-allowed disabled:opacity-40 ${gender === option.key ? "bg-[#0b376d] text-white" : "text-black hover:bg-slate-50"}`}>
          {option.label}
        </button>)}
      </div>
    </div>

    {points.length ? <>
      <div className="relative mt-5" onPointerLeave={() => {
        cancelHoverDismissal();
        setSelection((current) => current?.mode === "hover" ? null : current);
      }} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setSelection((current) => current?.mode === "keyboard" ? null : current);
      }}>
        <svg ref={svgRef} width="100%" height={geometry.height} viewBox={`0 0 ${width} ${geometry.height}`} role="group" tabIndex={0}
          aria-label={`Kvadrantdiagram: antall lønnstakere og median månedslønn · ${genderLabel}. Yrkesnavn har forbindelseslinjer til punktene. Antallsmarkører viser overlappende yrker; trykk flere ganger for å utforske dem.`} aria-describedby={active ? `${id}-tooltip` : undefined}
          className="block touch-auto rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b376d]"
          onKeyDown={handleKeyDown} onPointerMove={preview}
          onFocus={(event) => { if (event.currentTarget.matches(":focus-visible") && !selection) setSelection({ code: points[0].code, mode: "keyboard" }); }}
          onPointerDown={(event) => { touchRef.current = { x: event.clientX, y: event.clientY, moved: false }; }}
          onPointerCancel={() => { touchRef.current = null; }}
          onClick={(event) => {
            if (touchRef.current?.moved) { touchRef.current = null; return; }
            const hits = nearby(event.clientX, event.clientY);
            const previous = selection?.mode === "locked" ? hits.findIndex((hit) => hit.point.code === selection.code) : -1;
            const next = hits[(previous + 1) % hits.length];
            setSelection(next ? { code: next.point.code, mode: "locked" } : null);
            touchRef.current = null;
          }}>
          <g aria-hidden="true" pointerEvents="none">
            {occupationQuadrants.map((quadrant, index) => {
              const left = index % 2 === 0 ? geometry.margin.left : splitX;
              const right = index % 2 === 0 ? splitX : geometry.right;
              const top = index < 2 ? geometry.margin.top : splitY;
              const bottom = index < 2 ? splitY : geometry.bottom;
              const compactLabel = right - left < 125;
              return <g key={quadrant.label}>
                <rect x={left} y={top} width={Math.max(0, right - left)} height={Math.max(0, bottom - top)} fill={quadrant.background} />
                {right - left > 84 && bottom - top > (compactLabel ? 64 : 48) ? <text x={left + 9} y={index < 2 ? top + 19 : bottom - (compactLabel ? 46 : 30)} fill="#000" fontSize={width < 520 ? 12 : 13} fontWeight="500">
                  <tspan x={left + 9}>{index < 2 ? "Høy lønn" : "Lav lønn"}</tspan>
                  <tspan x={left + 9} dy="16">{compactLabel ? index % 2 === 0 ? "Få" : "Mange" : index % 2 === 0 ? "Få lønnstakere" : "Mange lønnstakere"}</tspan>
                  {compactLabel ? <tspan x={left + 9} dy="16">lønnstakere</tspan> : null}
                </text> : null}
              </g>;
            })}
            {geometry.yTicks.map((tick) => <g key={tick}>
              <line x1={geometry.margin.left} x2={geometry.right} y1={geometry.y(tick)} y2={geometry.y(tick)} stroke="#cbd5e1" strokeOpacity="0.55" />
              <text x={geometry.margin.left - 8} y={geometry.y(tick) + 4} textAnchor="end" fill="#000" fontSize="13" fontWeight="500">{number.format(tick)}</text>
            </g>)}
            {geometry.xTicks.map((tick, index) => <g key={tick}>
              <line x1={geometry.x(tick)} x2={geometry.x(tick)} y1={geometry.margin.top} y2={geometry.bottom} stroke="#cbd5e1" strokeOpacity="0.4" />
              <text x={geometry.x(tick)} y={geometry.bottom + 22} textAnchor={index === geometry.xTicks.length - 1 ? "end" : "middle"} fill="#000" fontSize="13" fontWeight="500">{number.format(tick)}</text>
            </g>)}
            <line data-quadrant-boundary="employees" x1={splitX} x2={splitX} y1={geometry.margin.top} y2={geometry.bottom} stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 5" />
            <line data-quadrant-boundary="salary" x1={geometry.margin.left} x2={geometry.right} y1={splitY} y2={splitY} stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 5" />
            <text x={geometry.margin.left} y="19" fill="#000" fontSize="13" fontWeight="600">{salaryLabel} (NOK)</text>
            <text x={(geometry.margin.left + geometry.right) / 2} y={geometry.height - 10} textAnchor="middle" fill="#000" fontSize="13" fontWeight="600">Antall lønnstakere</text>
            {geometry.labels.map((label) => <line key={`connector-${label.code}`} {...label.connector}
              stroke="#000" strokeWidth={active?.code === label.code ? 1.5 : 0.8} strokeOpacity={active?.code === label.code ? 0.85 : 0.4} />)}
            {plotted.map((point) => <circle key={point.code} data-occupation-code={point.code} cx={point.x} cy={point.y} r="4" className={styles.point}
              fill={occupationQuadrants[occupationQuadrant(point, employeesMedian, salaryMedian)].color} fillOpacity={active && active.code !== point.code ? 0.25 : 0.7} stroke="white" strokeWidth="0.8" />)}
            {geometry.groups.map((group) => <g key={group.codes.join("-")} data-overlap-count={group.codes.length}>
              <circle cx={group.x} cy={group.y} r={group.codes.length > 9 ? 14 : 11} fill="white" stroke="#0b376d" strokeWidth="2" />
              <text x={group.x} y={group.y + 4} textAnchor="middle" fill="#000" fontSize="12" fontWeight="700">{group.codes.length}</text>
            </g>)}
            {active ? activeGroup ? <circle cx={activeGroup.x} cy={activeGroup.y} r={activeGroup.codes.length > 9 ? 18 : 15} fill="none" stroke="#0b376d" strokeWidth="2" />
              : <circle cx={geometry.x(active.employees)} cy={geometry.y(active.salary)} r="7" fill={occupationQuadrants[occupationQuadrant(active, employeesMedian, salaryMedian)].color} stroke="white" strokeWidth="2" /> : null}
            {geometry.labels.map((label) => <g key={`label-${label.code}`} data-occupation-label={label.code}>
              <rect x={label.left} y={label.top} width={label.width} height={label.height} rx="3" fill="white" fillOpacity="0.94"
                stroke={active?.code === label.code ? "#0b376d" : "none"} />
              <text x={label.left + 6} y={label.top + 4 + geometry.labelFontSize} fill="#000" fontSize={geometry.labelFontSize} fontWeight={active?.code === label.code ? 700 : 500}>
                {label.lines.map((line, index) => <tspan key={index} x={label.left + 6} dy={index === 0 ? 0 : geometry.labelFontSize + 4}>{line}</tspan>)}
              </text>
            </g>)}
          </g>
        </svg>
        {active ? <InteractiveChartTooltip id={`${id}-tooltip`} className={styles.tooltip} onPointerEnter={cancelHoverDismissal} onFocus={cancelHoverDismissal} style={{
          left: Math.max(12, Math.min(width - 302, geometry.x(active.employees) + (geometry.x(active.employees) < width / 2 ? 18 : -308))),
          top: Math.max(8, Math.min(geometry.height - 220, geometry.y(active.salary) - 70)),
        }}>
          <p className="m-0 mb-1 text-sm text-black">{genderLabel}</p>
          <p className="m-0 mb-2 text-base font-extrabold text-black">{active.href ? <Link href={active.href}
            className="rounded-sm underline decoration-slate-300 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b376d]">{active.name}</Link> : active.name}</p>
          <dl className="m-0 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1">
            <dt>Antall lønnstakere</dt><dd className="m-0 text-right font-bold tabular-nums text-black">{number.format(active.employees)}</dd>
            <dt>{salaryLabel}</dt><dd className="m-0 text-right font-extrabold tabular-nums text-black">{money(active.salary)}</dd>
          </dl>
          <p className="mb-0 mt-2 border-t border-slate-100 pt-2 font-semibold text-black">{occupationQuadrants[occupationQuadrant(active, employeesMedian, salaryMedian)].label}</p>
        </InteractiveChartTooltip> : null}
      </div>
    </> : <p className="px-5 py-10 text-base text-black sm:px-7">Ingen yrker med både lønn og antall lønnstakere er tilgjengelige for {genderLabel.toLocaleLowerCase("nb-NO")}.</p>}
    <p className="sr-only" role="status">Viser {genderLabel.toLocaleLowerCase("nb-NO")}, {points.length} yrker. {active ? `${active.name}: ${number.format(active.employees)} lønnstakere, ${money(active.salary)} i median månedslønn. ${occupationQuadrants[occupationQuadrant(active, employeesMedian, salaryMedian)].label}.` : ""}</p>

    <figcaption className="rounded-b-[6px] border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-sm leading-5 text-black sm:px-7">
      {dataset.source ? <p className="m-0">Kilde: {dataset.source}</p> : <p className="m-0">Kilder: <a href="https://www.ssb.no/statbank/table/11418" className="font-semibold underline decoration-slate-300 underline-offset-2">SSB 11418: median månedslønn</a>{dataset.year ? ` (${dataset.year})` : ""} og <a href="https://www.ssb.no/statbank/table/11658" className="font-semibold underline decoration-slate-300 underline-offset-2">SSB 11658: lønnstakere</a>{dataset.year ? ` (4. kvartal ${dataset.year})` : ""}.</p>}
      {(series?.excludedCount ?? 0) > 0 ? <p className="mb-0 mt-2">{series!.excludedCount} yrker er utelatt fordi lønn eller antall lønnstakere mangler eller ikke er gyldig.</p> : null}
    </figcaption>
  </figure>;
}
