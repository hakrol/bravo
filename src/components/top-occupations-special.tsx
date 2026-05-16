"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  TopOccupationMetric,
  TopOccupationSpecialData,
  TopOccupationSpecialRow,
} from "@/lib/top-occupations-special";

type SalaryMode = "average" | "median";
type SalaryView = "monthly" | "annual" | "hourly";
type GenderView = "all" | "women" | "men";

type TopOccupationsSpecialProps = {
  data: TopOccupationSpecialData;
};

const moneyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const occupationVisuals = [
  { accent: "#0f766e", soft: "#e5f7f1", ink: "#063f3b", icon: "◇", motif: "Ledelse" },
  { accent: "#ef6f5e", soft: "#fff0ec", ink: "#6b1f16", icon: "◆", motif: "Energi" },
  { accent: "#f6b73c", soft: "#fff6dd", ink: "#5b3800", icon: "●", motif: "Kapital" },
  { accent: "#4f9bad", soft: "#eaf8fb", ink: "#123f49", icon: "◐", motif: "Transport" },
  { accent: "#9f7aea", soft: "#f2edff", ink: "#3f2468", icon: "✦", motif: "Spesialist" },
  { accent: "#2f8f68", soft: "#eaf8ef", ink: "#103d2c", icon: "↗", motif: "Forskning" },
  { accent: "#e86f8b", soft: "#fff0f4", ink: "#64162a", icon: "▣", motif: "Kompetanse" },
  { accent: "#5e9fe3", soft: "#edf6ff", ink: "#123d68", icon: "◌", motif: "Helse" },
  { accent: "#6fbf8f", soft: "#edf9f1", ink: "#16462a", icon: "□", motif: "Utvikling" },
  { accent: "#a784b7", soft: "#f5eff8", ink: "#3f294b", icon: "△", motif: "Organisasjon" },
] as const;

export function TopOccupationsSpecial({ data }: TopOccupationsSpecialProps) {
  const [salaryMode, setSalaryMode] = useState<SalaryMode>("average");
  const [salaryView, setSalaryView] = useState<SalaryView>("monthly");
  const [genderView, setGenderView] = useState<GenderView>("all");
  const [selectedCode, setSelectedCode] = useState(data.rows[0]?.occupationCode);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const rowRefs = useRef(new Map<string, HTMLButtonElement>());
  const mobileRowRefs = useRef(new Map<string, HTMLButtonElement>());
  const previousRects = useRef(new Map<string, DOMRect>());

  const rankedRows = useMemo(
    () =>
      [...data.rows].sort(
        (left, right) =>
          getComparableSalary(right, salaryMode, salaryView, genderView) -
          getComparableSalary(left, salaryMode, salaryView, genderView),
      ),
    [data.rows, genderView, salaryMode, salaryView],
  );
  const selectedRow =
    rankedRows.find((row) => row.occupationCode === selectedCode) ?? rankedRows[0];
  const selectedRank =
    rankedRows.findIndex((row) => row.occupationCode === selectedRow.occupationCode) + 1;
  const topValue = getComparableSalary(rankedRows[0], salaryMode, salaryView, genderView);
  const lastValue = getComparableSalary(
    rankedRows[rankedRows.length - 1],
    salaryMode,
    salaryView,
    genderView,
  );
  const averageTopTen =
    rankedRows.reduce(
      (sum, row) => sum + getComparableSalary(row, salaryMode, salaryView, genderView),
      0,
    ) / rankedRows.length;
  const maxValue = Math.max(
    ...rankedRows.map((row) => getComparableSalary(row, salaryMode, salaryView, genderView)),
  );
  const dataLabel =
    salaryMode === "average"
      ? "gjennomsnittlig månedslønn"
      : "median månedslønn";

  useEffect(() => {
    const frame = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const closeMobileSheet = useCallback(() => {
    setIsMobileSheetOpen(false);
    window.setTimeout(() => {
      mobileRowRefs.current.get(selectedRow.occupationCode)?.focus();
    }, 0);
  }, [selectedRow.occupationCode]);

  useEffect(() => {
    if (!isMobileSheetOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileSheet();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileSheet, isMobileSheetOpen]);

  useLayoutEffect(() => {
    const nextRects = new Map<string, DOMRect>();

    rowRefs.current.forEach((node, id) => {
      const previousRect = previousRects.current.get(id);
      const nextRect = node.getBoundingClientRect();
      nextRects.set(id, nextRect);

      if (!previousRect) {
        return;
      }

      const deltaY = previousRect.top - nextRect.top;

      if (Math.abs(deltaY) < 1) {
        return;
      }

      node.animate(
        [
          { transform: `translateY(${deltaY}px)` },
          { transform: "translateY(0)" },
        ],
        {
          duration: 520,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        },
      );
    });

    previousRects.current = nextRects;
  }, [rankedRows]);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#fbf8f2] text-[#151515]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_4%_10%,rgba(248,191,77,0.34),transparent_22%),radial-gradient(circle_at_92%_10%,rgba(119,188,159,0.24),transparent_24%),radial-gradient(circle_at_78%_78%,rgba(98,151,180,0.14),transparent_28%),linear-gradient(180deg,#fffdf8_0%,#f8f3ea_100%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.18] [background-image:radial-gradient(rgba(42,35,24,0.45)_0.7px,transparent_0.7px)] [background-size:6px_6px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-28 top-0 -z-10 h-96 w-96 rounded-full bg-[#f5c35d]/28 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#b9ded2]/42 blur-3xl"
        aria-hidden="true"
      />

      <div className="md:hidden">
        <MobileSpecialHero
          data={data}
        />

        <MobileKeyStatsStrip
          averageTopTen={averageTopTen}
          lastValue={lastValue}
          topValue={topValue}
        />

        <MobileFilterBar
          genderView={genderView}
          salaryMode={salaryMode}
          salaryView={salaryView}
          setGenderView={setGenderView}
          setSalaryMode={setSalaryMode}
          setSalaryView={setSalaryView}
        />

        <MobileRankingList
          genderView={genderView}
          loaded={loaded}
          maxValue={maxValue}
          rankedRows={rankedRows}
          rowRefs={mobileRowRefs}
          salaryMode={salaryMode}
          salaryView={salaryView}
          selectedCode={selectedRow.occupationCode}
          onSelect={(row) => {
            setSelectedCode(row.occupationCode);
            setIsMobileSheetOpen(true);
          }}
        />

        <MobileOccupationSheet
          averageTopTen={averageTopTen}
          dataLabel={dataLabel}
          genderView={genderView}
          isOpen={isMobileSheetOpen}
          lastValue={lastValue}
          row={selectedRow}
          salaryMode={salaryMode}
          salaryView={salaryView}
          selectedRank={selectedRank}
          topValue={topValue}
          onClose={closeMobileSheet}
        />
      </div>

      <section className="hidden px-4 pb-7 pt-12 sm:px-6 sm:pt-16 md:block lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.045em] text-[#0f1115] sm:text-7xl lg:text-8xl">
              Topp 10 yrker med høyest lønn
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4c5560] sm:text-xl">
              Se hvilke yrker som ligger øverst i lønnsstatistikken, og hva forskjellene
              faktisk betyr. Tallene bygger på SSB-data og kan filtreres på lønnsmål,
              visning og kjønn.
            </p>
            <p className="mt-4 text-sm font-bold text-[#66717b]">
              Kilde: {data.source}. Periode: {formatPeriodLabel(data.periodLabel)}.
            </p>
            <div className="mt-7 grid max-w-4xl gap-3 md:grid-cols-3">
              <SegmentedControl
                label="Lønnsmål"
                options={[
                  { label: "Gjennomsnitt", value: "average" },
                  { label: "Median", value: "median" },
                ]}
                value={salaryMode}
                onChange={(value) => setSalaryMode(value as SalaryMode)}
              />
              <SegmentedControl
                label="Visning"
                options={[
                  { label: "År", value: "annual" },
                  { label: "Måned", value: "monthly" },
                  { label: "Time", value: "hourly" },
                ]}
                value={salaryView}
                onChange={(value) => setSalaryView(value as SalaryView)}
              />
              <SegmentedControl
                label="Kjønn"
                options={[
                  { label: "Alle", value: "all" },
                  { label: "Kvinner", value: "women" },
                  { label: "Menn", value: "men" },
                ]}
                value={genderView}
                onChange={(value) => setGenderView(value as GenderView)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="hidden px-4 pb-6 sm:px-6 md:block lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)] lg:items-start">
          <section className="rounded-[5px] border border-white/70 bg-white/75 p-4 shadow-[0_30px_90px_rgba(49,38,20,0.10)] backdrop-blur-xl sm:p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
              <div>
                <h2 className="text-lg font-black tracking-[-0.03em] text-[#101418]">
                  Sortert etter {salaryMode === "average" ? "gjennomsnittlig" : "median"} lønn
                </h2>
              </div>
              <p className="rounded-[5px] bg-[#f3ead9] px-3 py-1.5 text-xs font-bold text-[#6c5a39]">
                {getSalaryViewLabel(salaryView)}
              </p>
            </div>

            <div className="grid gap-2.5">
              {rankedRows.map((row, index) => (
                <RankingCard
                  key={row.occupationCode}
                  refCallback={(node) => {
                    if (node) {
                      rowRefs.current.set(row.occupationCode, node);
                    } else {
                      rowRefs.current.delete(row.occupationCode);
                    }
                  }}
                  genderView={genderView}
                  index={index}
                  loaded={loaded}
                  maxValue={maxValue}
                  row={row}
                  salaryMode={salaryMode}
                  salaryView={salaryView}
                  selected={row.occupationCode === selectedRow.occupationCode}
                  signal={getOccupationSignal(row, rankedRows, salaryMode, salaryView, genderView)}
                  onSelect={() => setSelectedCode(row.occupationCode)}
                />
              ))}
            </div>

            <p className="mt-5 px-1 text-xs leading-5 text-[#6c7480]">
              Der kjønnstall mangler, brukes samlet tall i grafene.
            </p>
          </section>

          <OccupationDetailPanel
            averageTopTen={averageTopTen}
            dataLabel={dataLabel}
            genderView={genderView}
            lastValue={lastValue}
            row={selectedRow}
            salaryMode={salaryMode}
            salaryView={salaryView}
            selectedRank={selectedRank}
            topValue={topValue}
          />
        </div>
      </section>

      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-base leading-7 text-[#56616b]">
              Rangeringen henter lønnstall fra SSBs yrkesfordelte lønnsstatistikk.
              Hovedvisningen bruker SSBs mål for månedslønn, både for gjennomsnitt
              og median.
            </p>
          </div>

          <div className="mt-8 divide-y divide-[#e2d6c6] border-y border-[#e2d6c6]">
            <MethodPoint
              title="Månedslønn"
              text="Månedslønnen i topp 10-listen kommer fra SSB-tabell 11418, yrkesfordelt månedslønn etter sektor, kjønn og arbeidstid. Vi bruker raden for alle sektorer og arbeidstid i alt. Månedslønn er et bredere lønnsmål enn avtalt månedslønn alene, og brukes her for både gjennomsnitt og median."
            />
            <MethodPoint
              title="Årslønn"
              text="Estimert årslønn beregnes ved å gange månedslønnen med 12. Det gir et sammenlignbart årstall for yrkene, men er fortsatt et estimat. Faktisk årslønn kan variere med bonusordninger, arbeidstid, turnus, overtid, permisjoner og lokale avtaler."
            />
            <MethodPoint
              title="Timelønn"
              text="Estimert timelønn beregnes som månedslønn delt på 162,5 timer. Det tilsvarer 1 950 timer i året fordelt på 12 måneder, og brukes bare for å gjøre lønnsnivåene enklere å sammenligne på tvers av yrker."
            />
            <MethodPoint
              title="Gjennomsnitt og median"
              text="Gjennomsnitt viser samlet månedslønn delt på antall observasjoner og påvirkes av svært høye eller lave lønninger. Median viser midtpunktet i fordelingen. Begge valgene hentes fra samme SSB-tabell og samme lønnsmål: Månedslønn (kr)."
            />
            <MethodPoint
              title="Lønnsvekst"
              text="Lønnsvekst beregnes fra SSBs kvartalsserie for gjennomsnittlig avtalt månedslønn. Siste kvartal sammenlignes med samme kvartal året før. Veksttallet kan derfor avvike noe fra hovedvisningen, som bruker årlig månedslønn fra tabell 11418."
            />
            <MethodPoint
              title="Reallønnsvekst"
              text="Reallønnsvekst tar lønnsveksten og justerer den for prisvekst med KPI-tall fra SSB. Når reallønnsveksten er positiv, har lønnen økt mer enn prisene i perioden. Når den er negativ, har kjøpekraften falt selv om lønnen kan ha økt nominelt."
            />
          </div>
        </div>
      </section>

    </main>
  );
}

function MobileSpecialHero({
  data,
}: {
  data: TopOccupationSpecialData;
}) {
  return (
    <section className="px-4 pb-2 pt-5">
      <div className="mx-auto max-w-md">
        <p className="inline-flex rounded-[5px] border border-[#ead9bd] bg-white/70 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#b27806] shadow-[0_8px_18px_rgba(49,38,20,0.06)]">
          Spesial
        </p>
        <h1 className="mt-3 text-[2.85rem] font-black leading-[0.9] tracking-[-0.055em] text-[#0f1115]">
          Topp 10 yrker med høyest lønn
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-[#4c5560]">
          Yrker øverst i SSBs lønnsstatistikk, rangert og forklart.
        </p>
        <p className="mt-2 text-[11px] font-bold leading-5 text-[#66717b]">
          Kilde: SSB · Periode: {formatCompactPeriodLabel(data.periodLabel)}
        </p>
      </div>
    </section>
  );
}

function MobileKeyStatsStrip({
  topValue,
  lastValue,
  averageTopTen,
}: {
  topValue: number;
  lastValue: number;
  averageTopTen: number;
}) {
  const stats = [
    { label: "Høyest", value: formatMoney(topValue) },
    { label: "Lavest", value: formatMoney(lastValue) },
    { label: "Snitt", value: formatMoney(averageTopTen) },
  ];

  return (
    <section aria-label="Nøkkeltall" className="px-4 pb-2 pt-1">
      <div className="-mx-4 flex snap-x gap-1.5 overflow-x-auto px-4 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="min-w-[7.85rem] snap-start rounded-[5px] border border-[#eadfce] bg-white/80 px-2.5 py-2 shadow-[0_10px_22px_rgba(49,38,20,0.05)]"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.11em] text-[#7d8790]">
              {stat.label}
            </p>
            <p className="mt-1 whitespace-nowrap text-[15px] font-black tracking-[-0.035em] text-[#101418]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileFilterBar({
  salaryMode,
  salaryView,
  genderView,
  setSalaryMode,
  setSalaryView,
  setGenderView,
}: {
  salaryMode: SalaryMode;
  salaryView: SalaryView;
  genderView: GenderView;
  setSalaryMode: (value: SalaryMode) => void;
  setSalaryView: (value: SalaryView) => void;
  setGenderView: (value: GenderView) => void;
}) {
  return (
    <section className="sticky top-0 z-40 border-y border-[#e6dac8] bg-[#fbf8f2]/90 px-2.5 py-1.5 shadow-[0_10px_24px_rgba(49,38,20,0.075)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-md gap-2">
        <div className="grid grid-cols-3 gap-1.5">
          <MobileSegmentedControl
            ariaLabel="Velg lønnsmål"
            options={[
              { label: "Gj.snitt", value: "average" },
              { label: "Median", value: "median" },
            ]}
            value={salaryMode}
            onChange={(value) => setSalaryMode(value as SalaryMode)}
          />
          <MobileSegmentedControl
            ariaLabel="Velg visning"
            options={[
              { label: "År", value: "annual" },
              { label: "Mnd", value: "monthly" },
              { label: "Time", value: "hourly" },
            ]}
            value={salaryView}
            onChange={(value) => setSalaryView(value as SalaryView)}
          />
          <MobileSegmentedControl
            ariaLabel="Velg kjønn"
            options={[
              { label: "Alle", value: "all" },
              { label: "K", value: "women" },
              { label: "M", value: "men" },
            ]}
            value={genderView}
            onChange={(value) => setGenderView(value as GenderView)}
          />
        </div>
      </div>
    </section>
  );
}

function MobileSegmentedControl({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="grid grid-flow-col overflow-hidden rounded-[5px] border border-[#e1d4c2] bg-white/58 p-px"
      role="group"
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            aria-pressed={active}
            className={[
              "min-h-9 rounded-[5px] px-1 text-[11px] font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]",
              active
                ? "bg-white text-[#0f5f58] shadow-[0_8px_18px_rgba(49,38,20,0.10)]"
                : "text-[#59636d]",
            ].join(" ")}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function MobileRankingList({
  rankedRows,
  selectedCode,
  maxValue,
  salaryMode,
  salaryView,
  genderView,
  loaded,
  rowRefs,
  onSelect,
}: {
  rankedRows: TopOccupationSpecialRow[];
  selectedCode: string;
  maxValue: number;
  salaryMode: SalaryMode;
  salaryView: SalaryView;
  genderView: GenderView;
  loaded: boolean;
  rowRefs: { current: Map<string, HTMLButtonElement> };
  onSelect: (row: TopOccupationSpecialRow) => void;
}) {
  return (
    <section className="px-4 pb-7 pt-3">
      <div className="mx-auto max-w-md">
        <div className="mb-2 flex items-end justify-between gap-3">
          <h2 className="text-lg font-black tracking-[-0.04em] text-[#101418]">
            Rangering
          </h2>
          <p className="text-[11px] font-bold text-[#66717b]">
            Sortert etter {getSalaryViewLabel(salaryView).toLowerCase()}
          </p>
        </div>
        <p className="mb-2 text-[11px] leading-4 text-[#68727d]">
          Trykk på et yrke for detaljer.
        </p>

        <div className="grid gap-2">
          {rankedRows.map((row, index) => (
            <MobileRankingRow
              key={row.occupationCode}
              genderView={genderView}
              index={index}
              loaded={loaded}
              maxValue={maxValue}
              row={row}
              salaryMode={salaryMode}
              salaryView={salaryView}
              selected={row.occupationCode === selectedCode}
              signal={getOccupationSignal(row, rankedRows, salaryMode, salaryView, genderView)}
              refCallback={(node) => {
                if (node) {
                  rowRefs.current.set(row.occupationCode, node);
                } else {
                  rowRefs.current.delete(row.occupationCode);
                }
              }}
              onSelect={() => onSelect(row)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileRankingRow({
  row,
  index,
  maxValue,
  salaryMode,
  salaryView,
  genderView,
  selected,
  loaded,
  signal,
  refCallback,
  onSelect,
}: {
  row: TopOccupationSpecialRow;
  index: number;
  maxValue: number;
  salaryMode: SalaryMode;
  salaryView: SalaryView;
  genderView: GenderView;
  selected: boolean;
  loaded: boolean;
  signal: string;
  refCallback: (node: HTMLButtonElement | null) => void;
  onSelect: () => void;
}) {
  const value = getComparableSalary(row, salaryMode, salaryView, genderView);
  const visual = getOccupationVisual(row, index);
  const width = Math.max(8, (value / maxValue) * 100);

  return (
    <button
      ref={refCallback}
      aria-expanded={selected}
      className={[
        "rounded-[5px] border px-2.5 py-2.5 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]",
        selected
          ? "border-[#f0c25d] bg-[linear-gradient(135deg,#ffffff,#fff7e6)] shadow-[0_16px_34px_rgba(103,76,28,0.13)]"
          : "border-[#e9dece] bg-white/80 shadow-[0_10px_22px_rgba(49,38,20,0.05)] active:scale-[0.99]",
        loaded ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      ].join(" ")}
      onClick={onSelect}
      style={{ transitionDelay: `${index * 28}ms` }}
      type="button"
    >
      <div className="grid grid-cols-[2.1rem_minmax(0,1fr)] gap-2.5">
        <div
          className="grid h-8 w-8 place-items-center rounded-[5px] text-sm font-black"
          style={{ backgroundColor: selected ? visual.accent : visual.soft, color: selected ? "#ffffff" : visual.ink }}
        >
          {index + 1}
        </div>
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="overflow-hidden text-[14px] font-black leading-[1.18] tracking-[-0.025em] text-[#101418] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                {row.occupationLabel}
              </h3>
              {index < 3 ? (
                <span
                  className="mt-1 inline-flex rounded-[5px] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.1em]"
                  style={{ backgroundColor: visual.soft, color: visual.ink }}
                >
                  {signal}
                </span>
              ) : null}
            </div>
            <div className="shrink-0 text-right">
              <p className="whitespace-nowrap text-[15px] font-black tracking-[-0.035em] text-[#101418]">
                <CountUpMoney value={value} />
              </p>
              <p className="mt-0.5 text-[8px] font-black uppercase tracking-[0.11em] text-[#7d8790]">
                {getMobileSalaryUnitLabel(salaryView)}
              </p>
            </div>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-[5px] bg-[#ede7dc]">
            <div
              className="h-full rounded-[5px] transition-all duration-700 ease-out"
              style={{
                width: loaded ? `${width}%` : "0%",
                background: `linear-gradient(90deg, ${visual.accent}, ${mixWithWhite(visual.accent)})`,
                boxShadow: `0 0 14px ${hexToRgba(visual.accent, 0.16)}`,
              }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function MobileOccupationSheet({
  row,
  selectedRank,
  salaryMode,
  salaryView,
  genderView,
  averageTopTen,
  topValue,
  lastValue,
  dataLabel,
  isOpen,
  onClose,
}: {
  row: TopOccupationSpecialRow;
  selectedRank: number;
  salaryMode: SalaryMode;
  salaryView: SalaryView;
  genderView: GenderView;
  averageTopTen: number;
  topValue: number;
  lastValue: number;
  dataLabel: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const value = getComparableSalary(row, salaryMode, salaryView, genderView);
  const visual = getOccupationVisual(row, selectedRank - 1);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        aria-label="Lukk detaljvisning"
        className="absolute inset-0 bg-[#1b2430]/28 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />
      <section
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[18px] border border-white/70 bg-[#fffdf8] shadow-[0_-24px_70px_rgba(27,36,48,0.22)] motion-safe:animate-[mobile-sheet-up_180ms_ease-out]"
        role="dialog"
      >
        <div className="sticky top-0 z-10 border-b border-[#e7dccd] bg-[#fffdf8]/92 px-4 pb-3 pt-2 backdrop-blur">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[#d8c9b5]" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-[5px] text-2xl shadow-inner"
                style={{ backgroundColor: visual.soft, color: visual.accent }}
              >
                {visual.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#0f766e]">
                  #{selectedRank} på topplisten
                </p>
                <h2 className="mt-1 text-2xl font-black leading-[1.02] tracking-[-0.045em] text-[#101418]">
                  {row.occupationLabel}
                </h2>
              </div>
            </div>
            <button
              aria-label="Lukk"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[5px] border border-[#e4d8c8] bg-white text-xl font-black text-[#59636d] shadow-[0_8px_18px_rgba(49,38,20,0.08)]"
              onClick={onClose}
              type="button"
            >
              ×
            </button>
          </div>
        </div>

        <div className="grid gap-5 px-4 pb-7 pt-4">
          <div className="grid grid-cols-2 gap-2.5">
            <MetricCard label={getSalaryViewLabel(salaryView)} value={formatMoney(value)} />
            <MetricCard
              label="Estimert årslønn"
              tone="green"
              value={formatMoney(getMetricValue(row.averageMonthlySalary, genderView) * 12)}
            />
            <MetricCard
              label="Arbeidstakere"
              value={row.workforce ? numberFormatter.format(row.workforce) : "Ikke vist"}
            />
            <MetricCard label="Plassering" value={`#${selectedRank} av 10`} />
            {row.salaryGrowthPercent !== undefined ? (
              <MetricCard
                label="Lønnsvekst"
                tone={isPositive(row.salaryGrowthPercent) ? "green" : "default"}
                value={formatPercentage(row.salaryGrowthPercent)}
              />
            ) : null}
            {row.realSalaryGrowthPercent !== undefined ? (
              <MetricCard
                label="Reallønnsvekst"
                tone={isPositive(row.realSalaryGrowthPercent) ? "green" : "default"}
                value={formatPercentage(row.realSalaryGrowthPercent)}
              />
            ) : null}
          </div>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#29313a]">
              Om yrket
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#4f5964]">{row.intro}</p>
          </section>

          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#29313a]">
              Lønn påvirkes ofte av
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {row.salaryDrivers.map((driver) => (
                <span key={driver} className="rounded-[5px] bg-[#e8f4ed] px-3 py-1.5 text-xs font-bold text-[#0f5f45]">
                  {driver}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-[5px] border border-[#e7dccd] bg-white/70 p-4">
            <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#29313a]">
              Sammenligning
            </h3>
            <div className="mt-3 divide-y divide-[#eadfce]">
              <MobileDifferenceRow label="Mot topp 10-snitt" value={value - averageTopTen} />
              <MobileDifferenceRow label="Mot høyeste lønn" value={value - topValue} />
              <MobileDifferenceRow label="Mot lavest i topp 10" value={value - lastValue} />
            </div>
          </section>

          <p className="text-xs leading-5 text-[#6c7480]">
            Viser {dataLabel} for {getGenderLabel(genderView).toLowerCase()}.
          </p>

          {row.href ? (
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-[5px] bg-[linear-gradient(135deg,#0f766e,#0f5f58)] px-5 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(15,118,110,0.22)]"
              href={row.href}
            >
              Se full yrkesside
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function RankingCard({
  row,
  index,
  maxValue,
  salaryMode,
  salaryView,
  genderView,
  selected,
  loaded,
  signal,
  refCallback,
  onSelect,
}: {
  row: TopOccupationSpecialRow;
  index: number;
  maxValue: number;
  salaryMode: SalaryMode;
  salaryView: SalaryView;
  genderView: GenderView;
  selected: boolean;
  loaded: boolean;
  signal: string;
  refCallback: (node: HTMLButtonElement | null) => void;
  onSelect: () => void;
}) {
  const value = getComparableSalary(row, salaryMode, salaryView, genderView);
  const visual = getOccupationVisual(row, index);
  const width = Math.max(8, (value / maxValue) * 100);

  return (
    <button
      ref={refCallback}
      aria-pressed={selected}
      className={[
        "group rounded-[5px] border p-4 text-left transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]",
        selected
          ? "border-[#f1c469] bg-[linear-gradient(135deg,#ffffff_0%,#fff9ea_100%)] shadow-[0_22px_54px_rgba(103,76,28,0.16)]"
          : "border-[#ece2d4] bg-white/80 shadow-[0_10px_28px_rgba(49,38,20,0.045)] hover:-translate-y-0.5 hover:border-[#d5c3aa] hover:bg-white hover:shadow-[0_18px_42px_rgba(49,38,20,0.09)]",
        loaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      ].join(" ")}
      onClick={onSelect}
      style={{ transitionDelay: `${index * 38}ms` }}
      type="button"
    >
      <div className="grid gap-3 sm:grid-cols-[3.4rem_minmax(0,1fr)_9rem] sm:items-center">
        <div
          className="grid aspect-square place-items-center rounded-[5px] text-xl font-black shadow-inner"
          style={{ backgroundColor: selected ? visual.accent : visual.soft, color: selected ? "#ffffff" : visual.ink }}
        >
          {index + 1}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-black tracking-[-0.025em] text-[#101418] sm:text-lg">
              {row.occupationLabel}
            </h3>
            <span
              className="rounded-[5px] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
              style={{ backgroundColor: visual.soft, color: visual.ink }}
            >
              {signal}
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-[5px] bg-[#ede7dc] shadow-inner">
            <div
              className="relative h-full rounded-[5px] transition-all duration-700 ease-out after:absolute after:inset-y-0 after:left-0 after:w-1/2 after:translate-x-[-80%] after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] after:animate-[bar-shimmer_4.4s_ease-in-out_infinite]"
              style={{
                width: loaded ? `${width}%` : "0%",
                background: `linear-gradient(90deg, ${visual.accent}, ${mixWithWhite(visual.accent)})`,
                boxShadow: `0 0 18px ${hexToRgba(visual.accent, 0.18)}`,
              }}
            />
          </div>
        </div>

        <div className="grid gap-0.5 sm:text-right">
          <p className="whitespace-nowrap text-xl font-black tracking-[-0.035em] text-[#101418]">
            <CountUpMoney value={value} />
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7d8790]">
            {getSalaryViewLabel(salaryView).toLowerCase()}
          </p>
        </div>
      </div>
    </button>
  );
}

function OccupationDetailPanel({
  row,
  selectedRank,
  salaryMode,
  salaryView,
  genderView,
  averageTopTen,
  topValue,
  lastValue,
  dataLabel,
}: {
  row: TopOccupationSpecialRow;
  selectedRank: number;
  salaryMode: SalaryMode;
  salaryView: SalaryView;
  genderView: GenderView;
  averageTopTen: number;
  topValue: number;
  lastValue: number;
  dataLabel: string;
}) {
  const value = getComparableSalary(row, salaryMode, salaryView, genderView);
  const visual = getOccupationVisual(row, selectedRank - 1);

  return (
    <aside className="rounded-[5px] border border-white/70 bg-white/70 shadow-[0_30px_90px_rgba(49,38,20,0.12)] backdrop-blur-xl lg:sticky lg:top-6">
      <div
        className="rounded-t-[5px] border-b border-[#e7dccd] p-6 sm:p-7"
        style={{
          background: `radial-gradient(circle at 18% 24%, ${hexToRgba(visual.accent, 0.16)}, transparent 28%), linear-gradient(135deg, #ffffff 0%, ${visual.soft} 100%)`,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="grid h-20 w-20 shrink-0 place-items-center rounded-[5px] text-4xl shadow-inner"
            style={{ backgroundColor: visual.soft, color: visual.accent }}
          >
            {visual.icon}
          </div>
          <div>
            <h2 className="text-3xl font-black leading-[1.02] tracking-[-0.04em] text-[#101418] sm:text-4xl">
              {row.occupationLabel}
            </h2>
            <p className="mt-3 inline-flex rounded-[5px] bg-white/70 px-3 py-1 text-xs font-black text-[#0f5f58]">
              #{selectedRank} på topplisten
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard label={getSalaryViewLabel(salaryView)} value={formatMoney(value)} />
          <MetricCard
            label="Estimert årslønn"
            tone="green"
            value={formatMoney(getMetricValue(row.averageMonthlySalary, genderView) * 12)}
          />
          <MetricCard
            label="Antall arbeidstakere"
            value={row.workforce ? numberFormatter.format(row.workforce) : "Ikke vist"}
          />
          <MetricCard label="Plassering" value={`#${selectedRank} av 10`} />
          {row.salaryGrowthPercent !== undefined ? (
            <MetricCard
              label="Lønnsvekst siste år"
              tone={isPositive(row.salaryGrowthPercent) ? "green" : "default"}
              value={formatPercentage(row.salaryGrowthPercent)}
            />
          ) : null}
          {row.realSalaryGrowthPercent !== undefined ? (
            <MetricCard
              label="Reallønnsvekst"
              tone={isPositive(row.realSalaryGrowthPercent) ? "green" : "default"}
              value={formatPercentage(row.realSalaryGrowthPercent)}
            />
          ) : null}
        </div>

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#29313a]">
            Om yrket
          </h3>
          <p className="mt-3 text-sm leading-7 text-[#4f5964]">{row.intro}</p>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#29313a]">
            Lønn påvirkes ofte av
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {row.salaryDrivers.map((driver) => (
              <span key={driver} className="rounded-[5px] bg-[#e8f4ed] px-3 py-1.5 text-xs font-bold text-[#0f5f45]">
                {driver}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-[5px] border border-[#e7dccd] bg-white/70 p-4">
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#29313a]">
            Slik skiller yrket seg ut
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <DifferenceCard label="Mot topp 10-snitt" value={value - averageTopTen} />
            <DifferenceCard label="Mot høyeste lønn" value={value - topValue} />
            <DifferenceCard label="Mot lavest i topp 10" value={value - lastValue} />
          </div>
        </section>

        <p className="text-xs leading-5 text-[#6c7480]">
          Viser {dataLabel} for {getGenderLabel(genderView).toLowerCase()}.
        </p>

        {row.href ? (
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-[5px] bg-[linear-gradient(135deg,#0f766e,#0f5f58)] px-5 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(15,118,110,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(15,118,110,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
            href={row.href}
          >
            Se full yrkesside
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

function SegmentedControl({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#7d8790]">
        {label}
      </p>
      <div className="grid grid-flow-col overflow-hidden rounded-[5px] border border-[#e5dac9] bg-[#f7f1e8]/80 p-1">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              aria-pressed={active}
              className={[
                "min-h-9 rounded-[5px] px-3 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]",
                active
                  ? "bg-white text-[#0f5f58] shadow-[0_8px_20px_rgba(49,38,20,0.10)]"
                  : "text-[#555f69] hover:bg-white/70",
              ].join(" ")}
              onClick={() => onChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "green" }) {
  return (
    <div className="rounded-[5px] border border-[#e7dccd] bg-white/75 p-4 shadow-[0_10px_26px_rgba(49,38,20,0.04)]">
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#7d8790]">{label}</p>
      <p className={["mt-2 text-xl font-black tracking-[-0.03em]", tone === "green" ? "text-[#0f766e]" : "text-[#101418]"].join(" ")}>
        {value}
      </p>
    </div>
  );
}

function MethodPoint({ title, text }: { title: string; text: string }) {
  return (
    <section className="grid gap-3 py-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
      <h3 className="text-lg font-black tracking-[-0.03em] text-[#101418]">{title}</h3>
      <p className="text-base leading-8 text-[#56616b]">{text}</p>
    </section>
  );
}

function MobileDifferenceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#7d8790]">{label}</p>
        <p
          className={[
            "mt-1 text-lg font-black tracking-[-0.03em]",
            value >= 0 ? "text-[#0f766e]" : "text-[#b24a3c]",
          ].join(" ")}
        >
          {formatSignedMoney(value)}
        </p>
      </div>
      <MiniLine positive={value >= 0} compact />
    </div>
  );
}

function DifferenceCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#7d8790]">{label}</p>
      <p className={["mt-2 text-base font-black tracking-[-0.02em]", value >= 0 ? "text-[#0f766e]" : "text-[#b24a3c]"].join(" ")}>
        {formatSignedMoney(value)}
      </p>
      <MiniLine positive={value >= 0} />
    </div>
  );
}

function MiniLine({ positive, compact = false }: { positive: boolean; compact?: boolean }) {
  const color = positive ? "#7bc39f" : "#ef9b8c";

  return (
    <svg
      className={compact ? "h-7 w-full" : "mt-3 h-8 w-full"}
      viewBox="0 0 110 32"
      role="img"
      aria-label="Miniutvikling"
    >
      <path
        d="M2 24 C16 21 20 15 31 19 C42 23 44 10 55 14 C67 18 70 7 82 10 C93 13 98 8 108 5"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function CountUpMoney({ value }: { value: number }) {
  const displayValue = useAnimatedNumber(value);

  return <>{formatMoney(displayValue)}</>;
}

function getComparableSalary(
  row: TopOccupationSpecialRow,
  salaryMode: SalaryMode,
  salaryView: SalaryView,
  genderView: GenderView,
) {
  const metric = salaryMode === "average" ? row.averageMonthlySalary : row.medianMonthlySalary;
  const monthlyValue = getMetricValue(metric, genderView);

  if (salaryView === "annual") {
    return monthlyValue * 12;
  }

  if (salaryView === "hourly") {
    return monthlyValue / 162.5;
  }

  return monthlyValue;
}

function getMetricValue(metric: TopOccupationMetric, genderView: GenderView) {
  if (genderView === "women") {
    return metric.women ?? metric.all ?? 0;
  }

  if (genderView === "men") {
    return metric.men ?? metric.all ?? 0;
  }

  return metric.all ?? 0;
}

function getGenderLabel(genderView: GenderView) {
  if (genderView === "women") {
    return "Kvinner";
  }

  if (genderView === "men") {
    return "Menn";
  }

  return "Alle";
}

function getOccupationVisual(row: TopOccupationSpecialRow, index: number) {
  const normalizedLabel = row.occupationLabel.toLowerCase();

  if (normalizedLabel.includes("olje") || normalizedLabel.includes("gass")) {
    return occupationVisuals[1];
  }

  if (normalizedLabel.includes("finans") || normalizedLabel.includes("økonomi")) {
    return occupationVisuals[2];
  }

  if (normalizedLabel.includes("fly")) {
    return occupationVisuals[3];
  }

  if (normalizedLabel.includes("lege")) {
    return occupationVisuals[7];
  }

  if (normalizedLabel.includes("leder") || normalizedLabel.includes("direktør")) {
    return occupationVisuals[0];
  }

  return occupationVisuals[index % occupationVisuals.length];
}

function getOccupationSignal(
  row: TopOccupationSpecialRow,
  rows: TopOccupationSpecialRow[],
  salaryMode: SalaryMode,
  salaryView: SalaryView,
  genderView: GenderView,
) {
  const highest = rows[0];
  const smallest = [...rows]
    .filter((candidate) => candidate.workforce)
    .sort((left, right) => (left.workforce ?? 0) - (right.workforce ?? 0))[0];
  const largest = [...rows]
    .filter((candidate) => candidate.workforce)
    .sort((left, right) => (right.workforce ?? 0) - (left.workforce ?? 0))[0];
  const value = getComparableSalary(row, salaryMode, salaryView, genderView);
  const average =
    rows.reduce(
      (sum, candidate) => sum + getComparableSalary(candidate, salaryMode, salaryView, genderView),
      0,
    ) / rows.length;

  if (row.occupationCode === highest.occupationCode) {
    return "høyest lønn";
  }

  if (smallest && row.occupationCode === smallest.occupationCode) {
    return "færrest ansatte";
  }

  if (largest && row.occupationCode === largest.occupationCode) {
    return "størst yrke";
  }

  return value > average ? "over snittet" : "tett i toppen";
}

function formatMoney(value: number) {
  return `${moneyFormatter.format(Math.round(value))} kr`;
}

function formatPercentage(value?: number) {
  if (value === undefined) {
    return "Ikke beregnet";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function isPositive(value?: number) {
  return value !== undefined && value >= 0;
}

function getSalaryViewLabel(salaryView: SalaryView) {
  if (salaryView === "annual") {
    return "Estimert årslønn";
  }

  if (salaryView === "hourly") {
    return "Estimert timelønn";
  }

  return "Månedslønn";
}

function getMobileSalaryUnitLabel(salaryView: SalaryView) {
  if (salaryView === "annual") {
    return "per år";
  }

  if (salaryView === "hourly") {
    return "per time";
  }

  return "per måned";
}

function formatPeriodLabel(periodLabel?: string) {
  const match = periodLabel?.match(/^(\d{4})K([1-4])$/);

  if (!match) {
    return periodLabel ?? "siste tilgjengelige periode";
  }

  return `${Number(match[2])}. kvartal ${match[1]}`;
}

function formatCompactPeriodLabel(periodLabel?: string) {
  const match = periodLabel?.match(/^(\d{4})K([1-4])$/);

  if (!match) {
    return periodLabel ?? "siste periode";
  }

  return match[1];
}

function formatSignedMoney(value: number) {
  const rounded = Math.round(value);
  const prefix = rounded > 0 ? "+" : "";
  return `${prefix}${moneyFormatter.format(rounded)} kr`;
}

function useAnimatedNumber(value: number) {
  const [displayValue, setDisplayValue] = useState(value);
  const displayValueRef = useRef(value);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    if (mediaQuery.matches) {
      animationFrame = requestAnimationFrame(() => {
        displayValueRef.current = value;
        setDisplayValue(value);
      });

      return () => cancelAnimationFrame(animationFrame);
    }

    const startValue = displayValueRef.current;
    const difference = value - startValue;
    const startTime = performance.now();
    const duration = 620;

    function animate(now: number) {
      const progress = Math.min(1, (now - startTime) / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + difference * easedProgress;

      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return displayValue;
}

function hexToRgba(hex: string, alpha: number) {
  const normalizedHex = hex.replace("#", "");
  const red = parseInt(normalizedHex.slice(0, 2), 16);
  const green = parseInt(normalizedHex.slice(2, 4), 16);
  const blue = parseInt(normalizedHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function mixWithWhite(hex: string) {
  const normalizedHex = hex.replace("#", "");
  const red = Math.round((parseInt(normalizedHex.slice(0, 2), 16) + 255) / 2);
  const green = Math.round((parseInt(normalizedHex.slice(2, 4), 16) + 255) / 2);
  const blue = Math.round((parseInt(normalizedHex.slice(4, 6), 16) + 255) / 2);

  return `rgb(${red}, ${green}, ${blue})`;
}
