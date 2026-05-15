"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  TopOccupationMetric,
  TopOccupationSpecialData,
  TopOccupationSpecialRow,
} from "@/lib/top-occupations-special";

type SalaryMode = "average" | "median";
type SalaryView = "monthly" | "annual";
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
  { accent: "#f0a202", soft: "#fff3c4", ink: "#3b2600", icon: "KR", motif: "Kapital" },
  { accent: "#0f766e", soft: "#d9fbf4", ink: "#042f2e", icon: "LE", motif: "Ledelse" },
  { accent: "#dc2626", soft: "#fee2e2", ink: "#450a0a", icon: "EN", motif: "Energi" },
  { accent: "#2563eb", soft: "#dbeafe", ink: "#172554", icon: "IT", motif: "Teknologi" },
  { accent: "#7c3aed", soft: "#ede9fe", ink: "#2e1065", icon: "ST", motif: "Strategi" },
  { accent: "#15803d", soft: "#dcfce7", ink: "#052e16", icon: "FO", motif: "Forskning" },
  { accent: "#be123c", soft: "#ffe4e6", ink: "#4c0519", icon: "HE", motif: "Helse" },
  { accent: "#0369a1", soft: "#e0f2fe", ink: "#082f49", icon: "TR", motif: "Transport" },
  { accent: "#a16207", soft: "#fef3c7", ink: "#422006", icon: "AN", motif: "Anlegg" },
  { accent: "#4338ca", soft: "#e0e7ff", ink: "#1e1b4b", icon: "SP", motif: "Spesialist" },
] as const;

export function TopOccupationsSpecial({ data }: TopOccupationsSpecialProps) {
  const [salaryMode, setSalaryMode] = useState<SalaryMode>("average");
  const [salaryView, setSalaryView] = useState<SalaryView>("monthly");
  const [genderView, setGenderView] = useState<GenderView>("all");
  const [selectedCode, setSelectedCode] = useState(data.rows[0]?.occupationCode);
  const selectedRow =
    data.rows.find((row) => row.occupationCode === selectedCode) ?? data.rows[0];
  const rankedRows = useMemo(
    () =>
      [...data.rows].sort(
        (left, right) =>
          getComparableSalary(right, salaryMode, salaryView, genderView) -
          getComparableSalary(left, salaryMode, salaryView, genderView),
      ),
    [data.rows, genderView, salaryMode, salaryView],
  );

  const topRow = rankedRows[0];
  const lastRow = rankedRows[rankedRows.length - 1];
  const averageTopTen =
    rankedRows.reduce(
      (sum, row) => sum + getComparableSalary(row, salaryMode, salaryView, genderView),
      0,
    ) / rankedRows.length;
  const selectedValue = getComparableSalary(selectedRow, salaryMode, salaryView, genderView);
  const selectedRank =
    rankedRows.findIndex((row) => row.occupationCode === selectedRow.occupationCode) + 1;
  const topValue = getComparableSalary(topRow, salaryMode, salaryView, genderView);
  const lastValue = getComparableSalary(lastRow, salaryMode, salaryView, genderView);
  const maxValue = Math.max(...rankedRows.map((row) => getComparableSalary(row, salaryMode, salaryView, genderView)));
  const dataLabel = salaryMode === "average" ? "gjennomsnittlig avtalt månedslønn" : "median månedslønn";

  return (
    <main className="min-h-screen bg-[#f8f4ef] text-[#161616]">
      <section className="relative isolate overflow-visible border-b border-black/10 bg-[#fdf9f0] px-4 py-10 pb-16 sm:px-6 lg:px-8 lg:py-14 lg:pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_17%_18%,rgba(255,209,102,0.48),transparent_25%),radial-gradient(circle_at_68%_26%,rgba(20,83,45,0.22),transparent_34%),radial-gradient(circle_at_84%_48%,rgba(21,21,21,0.76),transparent_34%),linear-gradient(112deg,#fdf4dc_0%,#fbf7ec_51%,rgba(84,61,38,0.42)_66%,#161616_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(106deg,transparent_0%,transparent_50%,rgba(255,255,255,0.08)_56%,rgba(255,255,255,0)_64%)] blur-sm" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 opacity-[0.11] [background-image:radial-gradient(rgba(22,22,22,0.55)_1px,transparent_1px)] [background-size:5px_5px]" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 opacity-[0.13] [background-image:linear-gradient(115deg,rgba(255,255,255,0.72)_0.5px,transparent_0.5px),linear-gradient(0deg,rgba(69,44,19,0.08)_1px,transparent_1px)] [background-size:31px_31px,7px_7px]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-[linear-gradient(180deg,transparent,rgba(248,244,239,0.9))]" />
        <div className="absolute left-[8%] top-16 -z-10 h-64 w-64 border border-black/8 opacity-45 rotate-12" aria-hidden="true" />
        <div className="absolute right-[10%] top-10 -z-10 h-72 w-72 bg-[#f7c948]/16 blur-3xl" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(520px,0.95fr)] lg:items-center">
          <div className="fade-up relative z-20 max-w-[36rem] py-4 lg:pr-16">
            <h1 className="max-w-[8.5ch] text-5xl font-black leading-[0.92] tracking-[-0.035em] text-[#151515] drop-shadow-[0_1px_18px_rgba(255,248,232,0.32)] sm:text-7xl lg:text-8xl">
              Topp 10 yrker med høyest lønn
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#3f3b34] sm:text-xl">
              En interaktiv rangering av yrkene som ligger øverst i SSBs lønnsstatistikk.
              Velg mål, kjønn og yrke for å se hva tallene betyr.
            </p>
            <p className="mt-5 max-w-xl border-l-4 border-[#f0a202] bg-white/56 px-4 py-3 text-base font-black leading-7 text-[#2b2116] shadow-[0_16px_48px_rgba(87,58,20,0.08)] backdrop-blur">
              Forskjellen mellom 1. og 10. plass er <CountUpMoney value={topValue - lastValue} />{" "}
              {salaryView === "monthly" ? "i måneden" : "i året"}.
            </p>
          </div>

          <HeroSalaryLadder
            genderView={genderView}
            maxValue={maxValue}
            rows={rankedRows}
            salaryMode={salaryMode}
            salaryView={salaryView}
            selectedCode={selectedRow.occupationCode}
            topDifference={topValue - lastValue}
            onSelect={setSelectedCode}
          />
        </div>
      </section>

      <section className="border-b border-black/10 bg-white/70 px-4 py-4 backdrop-blur sm:px-6 lg:sticky lg:top-0 lg:z-20 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-2 sm:grid-cols-3">
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
                { label: "Måned", value: "monthly" },
                { label: "År", value: "annual" },
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
          <p className="max-w-xl text-sm leading-6 text-[#5b5143]">
            Sorteringen følger valgt lønnsmål. Der kjønnstall mangler, brukes samlet tall i grafene.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.72fr)]">
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <StatCard label="Høyest lønn" value={formatMoney(topValue)} />
              <StatCard label="Lavest i topp 10" value={formatMoney(lastValue)} />
              <StatCard label="Topp 10-snitt" value={formatMoney(averageTopTen)} />
              <StatCard
                label="Valgt mot snitt"
                value={formatSignedMoney(selectedValue - averageTopTen)}
                tone={selectedValue >= averageTopTen ? "positive" : "negative"}
              />
            </div>

            <div className="grid gap-3">
              {rankedRows.map((row, index) => (
                <RankingRow
                  key={row.occupationCode}
                  index={index}
                  maxValue={maxValue}
                  row={row}
                  salaryMode={salaryMode}
                  salaryView={salaryView}
                  genderView={genderView}
                  selected={row.occupationCode === selectedRow.occupationCode}
                  rows={rankedRows}
                  onSelect={() => setSelectedCode(row.occupationCode)}
                />
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <OccupationDetailPanel
              averageTopTen={averageTopTen}
              dataLabel={dataLabel}
              row={selectedRow}
              selectedRank={selectedRank}
              salaryMode={salaryMode}
              salaryView={salaryView}
              genderView={genderView}
              topValue={topValue}
              lastValue={lastValue}
            />
          </aside>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#12281d] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.75fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f7c948]">
              Sammenligning
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">
              Hvor langt unna toppen ligger valgt yrke?
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <ContrastCard label="Mot nr. 1" value={formatSignedMoney(selectedValue - topValue)} />
            <ContrastCard label="Mot snittet" value={formatSignedMoney(selectedValue - averageTopTen)} />
            <ContrastCard label="Mot nr. 10" value={formatSignedMoney(selectedValue - lastValue)} />
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7c2d12]">
            Om tallene
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#161616]">
            Slik er rangeringen laget
          </h2>
          <div className="mt-4 grid gap-4 text-sm leading-7 text-[#4a443a] sm:grid-cols-2">
            <p>
              Rangeringen bruker SSB-tabell 11658 fra prosjektets frosne snapshots. Standardvisningen
              sorterer etter gjennomsnittlig avtalt månedslønn for begge kjønn i {data.periodLabel}.
            </p>
            <p>
              Årslønn er månedslønn multiplisert med 12. Medianverdiene kommer fra
              {` ${data.medianPeriodLabel}`}. Antall arbeidstakere bruker siste tilgjengelige
              kvartal i arbeidsstyrkesnapshotet
              {data.workforcePeriodLabel ? ` (${data.workforcePeriodLabel})` : ""}.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroSalaryLadder({
  rows,
  maxValue,
  salaryMode,
  salaryView,
  genderView,
  selectedCode,
  topDifference,
  onSelect,
}: {
  rows: TopOccupationSpecialRow[];
  maxValue: number;
  salaryMode: SalaryMode;
  salaryView: SalaryView;
  genderView: GenderView;
  selectedCode: string;
  topDifference: number;
  onSelect: (occupationCode: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fade-up-delay relative z-10 mt-8 min-h-[40rem] overflow-hidden border border-white/20 bg-[#151515] p-5 text-white shadow-[0_48px_130px_rgba(33,22,10,0.42)] sm:p-6 lg:-ml-24 lg:-mr-8 lg:-mb-16 lg:mt-0 lg:min-h-[47rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,225,148,0.28),transparent_23%),radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.14),transparent_19%),radial-gradient(circle_at_82%_14%,rgba(247,201,72,0.32),transparent_24%),radial-gradient(circle_at_76%_62%,rgba(20,83,45,0.45),transparent_32%),linear-gradient(180deg,rgba(80,51,25,0.48)_0%,transparent_26%),linear-gradient(145deg,#1b1711_0%,#24331f_42%,#0d0d0d_100%)]" />
      <div className="absolute inset-0 animate-[salary-glow_13s_ease-in-out_infinite] bg-[radial-gradient(circle_at_68%_18%,rgba(247,201,72,0.18),transparent_24%),radial-gradient(circle_at_34%_78%,rgba(20,83,45,0.18),transparent_27%)]" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:34px_34px]" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.11] [background-image:radial-gradient(rgba(255,255,255,0.4)_0.7px,transparent_0.7px)] [background-size:4px_4px]" aria-hidden="true" />
      <div className="absolute inset-x-8 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent)] blur-xl" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.42)_100%)]" aria-hidden="true" />
      <div className="absolute left-8 top-8 bottom-8 w-px bg-white/18" aria-hidden="true" />
      <div className="absolute left-0 top-16 h-40 w-1 bg-[#f7c948] shadow-[0_0_46px_rgba(247,201,72,0.72)]" aria-hidden="true" />
      <div className="absolute bottom-8 left-4 right-4 h-28 bg-[linear-gradient(180deg,transparent,rgba(247,201,72,0.12))]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-8 top-28 grid justify-items-end text-right" aria-hidden="true">
        <span className="mr-6 border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#f7c948]/60">
          Lønnsgap #1-#10
        </span>
        <span className="text-[7rem] font-black leading-none tracking-[-0.08em] text-white/[0.06] sm:text-[9.5rem]">
          +{moneyFormatter.format(Math.round(topDifference))}
        </span>
      </div>
      <FloatingSalaryParticles />

      <div className="relative z-10 mt-5 grid gap-2.5">
        {rows.map((row, index) => {
          const value = getComparableSalary(row, salaryMode, salaryView, genderView);
          const visual = getOccupationVisual(row, index);
          const width = Math.max(28, (value / maxValue) * 100);
          const selected = row.occupationCode === selectedCode;
          const isLeader = index === 0;

          return (
            <button
              key={row.occupationCode}
              aria-pressed={selected}
              className={[
                "group relative grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-3 border px-2 text-left transition-all duration-700 ease-out sm:grid-cols-[3.25rem_minmax(0,1fr)_8rem]",
                isLeader
                  ? "mb-4 min-h-36 py-6 sm:grid-cols-[5.6rem_minmax(0,1fr)_11rem] sm:px-4"
                  : index === 3
                    ? "mt-3 min-h-12 py-2"
                    : "min-h-12 py-2",
                selected
                  ? "translate-x-0 border-[#f7c948] bg-white text-[#151515] shadow-[0_18px_46px_rgba(0,0,0,0.28)]"
                  : index % 2 === 0
                    ? "border-white/10 bg-white/8 hover:translate-x-1 hover:bg-white/14 hover:shadow-[0_16px_42px_rgba(247,201,72,0.12)]"
                    : "border-white/10 bg-white/6 hover:translate-x-5 hover:bg-white/14 hover:shadow-[0_16px_42px_rgba(247,201,72,0.12)]",
                isLeader && !selected ? "shadow-[0_0_58px_rgba(247,201,72,0.18)] ring-1 ring-[#f7c948]/30" : "",
                mounted ? (index % 2 === 0 ? "translate-x-0 opacity-100" : "translate-x-4 opacity-100") : "translate-x-14 opacity-0",
              ].join(" ")}
              onClick={() => onSelect(row.occupationCode)}
              style={{
                transitionDelay: `${index * 35}ms`,
              }}
              type="button"
            >
              <span
                className={[
                  "grid aspect-square place-items-center font-black transition-all duration-500",
                  isLeader ? "text-4xl shadow-[0_0_48px_rgba(247,201,72,0.44)]" : "text-sm",
                ].join(" ")}
                style={{
                  backgroundColor: selected ? visual.accent : "rgba(255,255,255,0.12)",
                  color: selected ? "#ffffff" : visual.soft,
                }}
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                {isLeader ? (
                  <span className="mb-2 inline-flex border border-[#f7c948]/45 bg-[#f7c948]/18 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#f7c948]">
                    Topplass
                  </span>
                ) : null}
                <span className={isLeader ? "block text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl" : "block truncate text-sm font-black sm:text-base"}>
                  {row.occupationLabel}
                </span>
                <span className={isLeader ? "relative mt-5 block h-6 overflow-hidden bg-black/15 shadow-inner" : "relative mt-1 block h-2.5 overflow-hidden bg-black/10"}>
                  <span
                    className="relative block h-full overflow-hidden transition-all duration-700 ease-out after:absolute after:inset-y-0 after:left-0 after:w-1/2 after:translate-x-[-80%] after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.44),transparent)] after:animate-[bar-shimmer_3.8s_ease-in-out_infinite]"
                    style={{ width: mounted ? `${width}%` : "0%", backgroundColor: visual.accent }}
                  />
                </span>
              </span>
              <span className={isLeader ? "hidden min-w-max whitespace-nowrap text-right text-3xl font-black tracking-[-0.045em] tabular-nums sm:block xl:text-4xl" : "hidden whitespace-nowrap text-right text-sm font-black tabular-nums sm:block"}>
                <CountUpMoney value={value} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FloatingSalaryParticles() {
  const particles = [
    { label: "kr", left: "66%", top: "18%", delay: "0ms" },
    { label: "+", left: "88%", top: "34%", delay: "180ms" },
    { label: "10", left: "58%", top: "70%", delay: "320ms" },
    { label: "SSB", left: "82%", top: "82%", delay: "460ms" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={`${particle.label}-${particle.left}`}
          className="absolute border border-white/10 bg-white/[0.055] px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/35 shadow-[0_0_30px_rgba(247,201,72,0.09)] animate-[salary-float_8s_ease-in-out_infinite]"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
          }}
        >
          {particle.label}
        </span>
      ))}
    </div>
  );
}

function RankingRow({
  row,
  index,
  maxValue,
  salaryMode,
  salaryView,
  genderView,
  selected,
  rows,
  onSelect,
}: {
  row: TopOccupationSpecialRow;
  index: number;
  maxValue: number;
  salaryMode: SalaryMode;
  salaryView: SalaryView;
  genderView: GenderView;
  selected: boolean;
  rows: TopOccupationSpecialRow[];
  onSelect: () => void;
}) {
  const value = getComparableSalary(row, salaryMode, salaryView, genderView);
  const width = Math.max(14, (value / maxValue) * 100);
  const visual = getOccupationVisual(row, index);
  const signal = getOccupationSignal(row, rows, salaryMode, salaryView, genderView);
  const genderGap = getGenderGap(row, salaryMode);

  return (
    <button
      aria-pressed={selected}
      className={[
        "group grid gap-3 border p-4 text-left shadow-sm transition sm:grid-cols-[5rem_minmax(0,1fr)_9rem]",
        selected
          ? "border-[#12281d] bg-[#fff7df] shadow-[0_18px_50px_rgba(90,62,20,0.16)]"
          : "border-black/10 bg-white hover:-translate-y-0.5 hover:border-[#d97706]/35 hover:bg-[#fffaf0]",
      ].join(" ")}
      style={{ borderLeftColor: visual.accent, borderLeftWidth: "6px" }}
      onClick={onSelect}
      type="button"
    >
      <div
        className="grid aspect-square place-items-center shadow-inner"
        style={{ backgroundColor: visual.soft, color: visual.ink }}
      >
        <span className="text-xs font-black uppercase tracking-[0.12em]">{visual.icon}</span>
        <span className="text-2xl font-black leading-none">#{index + 1}</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-black tracking-[-0.025em] text-[#171717]">
            {row.occupationLabel}
          </h3>
          <span
            className="border px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em]"
            style={{ backgroundColor: visual.soft, borderColor: visual.accent, color: visual.ink }}
          >
            {signal}
          </span>
        </div>
        <div className="mt-3 h-4 overflow-hidden bg-[#efe7d9]">
          <div
            className="h-full transition-all"
            style={{ width: `${width}%`, backgroundColor: visual.accent }}
          />
        </div>
        <div className="mt-3 grid gap-2 text-xs font-bold text-[#5b5143] sm:grid-cols-3">
          <span>{visual.motif}</span>
          <span>{row.workforce ? `${numberFormatter.format(row.workforce)} arbeidstakere` : "Ukjent størrelse"}</span>
          <span>{genderGap ? `${formatMoney(Math.abs(genderGap))} kjønnsforskjell` : "Kjønnstall mangler"}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5b5143]">{row.intro}</p>
      </div>
      <div className="grid content-center gap-1 text-left sm:text-right">
        <p className="text-2xl font-black tracking-[-0.03em] text-[#111827]">
          <CountUpMoney value={value} />
        </p>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6b6256]">
          {salaryView === "monthly" ? "per måned" : "estimert år"}
        </p>
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

  return (
    <article className="overflow-hidden border border-black/10 bg-white shadow-[0_24px_80px_rgba(38,30,20,0.12)]">
      <div className="bg-[#f7c948] p-5 text-[#18130c]">
        <p className="text-xs font-black uppercase tracking-[0.16em]">Valgt yrke</p>
        <h2 className="mt-2 text-3xl font-black tracking-[-0.035em]">{row.occupationLabel}</h2>
      </div>
      <div className="grid gap-5 p-5">
        <div className="grid grid-cols-2 gap-3">
          <MiniMetric label="Plass" value={`#${selectedRank}`} />
          <MiniMetric label="Lønn" value={formatMoney(value)} />
          <MiniMetric label="Årslønn" value={formatMoney(getMetricValue(row.averageMonthlySalary, genderView) * 12)} />
          <MiniMetric label="Arbeidstakere" value={row.workforce ? numberFormatter.format(row.workforce) : "Ikke vist"} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7c2d12]">
            Hva yrket går ut på
          </p>
          <p className="mt-2 text-base leading-7 text-[#34302a]">{row.intro}</p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7c2d12]">
            Lønn påvirkes ofte av
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {row.salaryDrivers.map((driver) => (
              <span key={driver} className="bg-[#f0f7ef] px-3 py-1.5 text-sm font-bold text-[#14532d]">
                {driver}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-2 border-t border-black/10 pt-4">
          <ComparisonLine label="Mot topp 10-snitt" value={value} reference={averageTopTen} />
          <ComparisonLine label="Mot førsteplass" value={value} reference={topValue} />
          <ComparisonLine label="Mot tiendeplass" value={value} reference={lastValue} />
        </div>

        <p className="text-xs leading-5 text-[#6b6256]">
          Viser {dataLabel} for {getGenderLabel(genderView).toLowerCase()}.
        </p>

        {row.href ? (
          <Link
            className="inline-flex min-h-11 items-center justify-center bg-[#12281d] px-4 py-3 text-sm font-black text-white transition hover:bg-[#14532d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]"
            href={row.href}
          >
            Gå til full yrkesside
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function ComparisonLine({
  label,
  value,
  reference,
}: {
  label: string;
  value: number;
  reference: number;
}) {
  const difference = value - reference;
  const width = Math.min(100, Math.max(4, (Math.abs(difference) / Math.max(reference, value)) * 100));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm font-bold">
        <span>{label}</span>
        <span className={difference >= 0 ? "text-[#14532d]" : "text-[#9d0208]"}>
          {formatSignedMoney(difference)}
        </span>
      </div>
      <div className="mt-1 h-2 bg-[#efe7d9]">
        <div
          className={difference >= 0 ? "h-full bg-[#14532d]" : "h-full bg-[#d97706]"}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
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
      <p className="mb-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#6b6256]">
        {label}
      </p>
      <div className="inline-grid w-full grid-flow-col overflow-hidden border border-black/10 bg-[#f7f1e8] p-1">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              aria-pressed={active}
              className={[
                "min-h-9 px-3 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]",
                active ? "bg-[#12281d] text-white shadow-sm" : "text-[#51483d] hover:bg-white",
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

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive" ? "text-[#14532d]" : tone === "negative" ? "text-[#9d0208]" : "text-[#111827]";

  return (
    <div className="border border-black/10 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#6b6256]">{label}</p>
      <p className={`mt-2 text-2xl font-black tracking-[-0.03em] ${toneClass}`}>{value}</p>
    </div>
  );
}

function CountUpMoney({ value }: { value: number }) {
  const displayValue = useAnimatedNumber(value);

  return <>{formatMoney(displayValue)}</>;
}

function ContrastCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/15 bg-white/10 p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f7c948]">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-[-0.035em] text-white">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f8f4ef] p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#6b6256]">{label}</p>
      <p className="mt-1 text-lg font-black tracking-[-0.02em] text-[#161616]">{value}</p>
    </div>
  );
}

function DataChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex gap-2 border border-black/10 bg-white/70 px-3 py-2">
      <span className="text-[#7c2d12]">{label}:</span>
      <span>{value}</span>
    </span>
  );
}

function getComparableSalary(
  row: TopOccupationSpecialRow,
  salaryMode: SalaryMode,
  salaryView: SalaryView,
  genderView: GenderView,
) {
  const metric = salaryMode === "average" ? row.averageMonthlySalary : row.medianMonthlySalary;
  const monthlyValue = getMetricValue(metric, genderView);

  return salaryView === "annual" ? monthlyValue * 12 : monthlyValue;
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

  if (normalizedLabel.includes("ikt")) {
    return occupationVisuals[3];
  }

  if (normalizedLabel.includes("olje") || normalizedLabel.includes("gass")) {
    return occupationVisuals[2];
  }

  if (normalizedLabel.includes("finans") || normalizedLabel.includes("økonomi")) {
    return occupationVisuals[0];
  }

  if (normalizedLabel.includes("leder") || normalizedLabel.includes("direktør")) {
    return occupationVisuals[1];
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
  const smallest = [...rows].filter((candidate) => candidate.workforce).sort((left, right) => (left.workforce ?? 0) - (right.workforce ?? 0))[0];
  const largest = [...rows].filter((candidate) => candidate.workforce).sort((left, right) => (right.workforce ?? 0) - (left.workforce ?? 0))[0];
  const biggestGap = [...rows].sort(
    (left, right) => Math.abs(getGenderGap(right, salaryMode) ?? 0) - Math.abs(getGenderGap(left, salaryMode) ?? 0),
  )[0];

  if (row.occupationCode === highest.occupationCode) {
    return "høyest lønn";
  }

  if (smallest && row.occupationCode === smallest.occupationCode) {
    return "færrest ansatte";
  }

  if (largest && row.occupationCode === largest.occupationCode) {
    return "størst yrke";
  }

  if (biggestGap && row.occupationCode === biggestGap.occupationCode) {
    return "størst kjønnsforskjell";
  }

  const value = getComparableSalary(row, salaryMode, salaryView, genderView);
  const average =
    rows.reduce(
      (sum, candidate) => sum + getComparableSalary(candidate, salaryMode, salaryView, genderView),
      0,
    ) / rows.length;

  return value > average ? "over topp 10-snittet" : "tett i toppen";
}

function getGenderGap(row: TopOccupationSpecialRow, salaryMode: SalaryMode) {
  const metric = salaryMode === "average" ? row.averageMonthlySalary : row.medianMonthlySalary;

  if (!metric.men || !metric.women) {
    return undefined;
  }

  return metric.men - metric.women;
}

function formatMoney(value: number) {
  return `${moneyFormatter.format(Math.round(value))} kr`;
}

function formatSignedMoney(value: number) {
  const rounded = Math.round(value);
  const prefix = rounded > 0 ? "+" : "";
  return `${prefix}${moneyFormatter.format(rounded)} kr`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function useAnimatedNumber(value: number) {
  const [displayValue, setDisplayValue] = useState(value);
  const displayValueRef = useRef(value);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      displayValueRef.current = value;
      setDisplayValue(value);
      return;
    }

    let animationFrame = 0;
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
