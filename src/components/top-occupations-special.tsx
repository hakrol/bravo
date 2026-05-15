"use client";

import { useMemo, useState } from "react";
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

const rankTones = [
  "from-[#f7c948] via-[#f0a202] to-[#a45b12]",
  "from-[#cbd5e1] via-[#94a3b8] to-[#475569]",
  "from-[#f0b98a] via-[#c9773d] to-[#7c3f1d]",
  "from-[#8bd3dd] to-[#006d77]",
  "from-[#ffd166] to-[#ad5d00]",
  "from-[#b8e986] to-[#2f7d32]",
  "from-[#f4978e] to-[#9d0208]",
  "from-[#9d96f5] to-[#4c1d95]",
  "from-[#90dbf4] to-[#0077b6]",
  "from-[#ffcad4] to-[#9f1239]",
];

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
  const topValue = getComparableSalary(topRow, salaryMode, salaryView, genderView);
  const lastValue = getComparableSalary(lastRow, salaryMode, salaryView, genderView);
  const maxValue = Math.max(...rankedRows.map((row) => getComparableSalary(row, salaryMode, salaryView, genderView)));
  const dataLabel = salaryMode === "average" ? "gjennomsnittlig avtalt månedslønn" : "median månedslønn";

  return (
    <main className="min-h-screen bg-[#f8f4ef] text-[#161616]">
      <section className="relative isolate overflow-hidden border-b border-black/10 bg-[#fdf9f0] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(255,209,102,0.46),transparent_27%),radial-gradient(circle_at_82%_16%,rgba(34,197,94,0.20),transparent_28%),linear-gradient(135deg,#fdf4dc_0%,#f7fbf3_48%,#f6efe8_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(460px,1fr)] lg:items-end">
          <div className="fade-up">
            <p className="inline-flex border border-black/10 bg-white/72 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#6b3b00] shadow-sm">
              Spesial
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.035em] text-[#151515] sm:text-7xl lg:text-8xl">
              Topp 10 yrker med høyest lønn
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#3f3b34] sm:text-xl">
              En interaktiv rangering av yrkene som ligger øverst i SSBs lønnsstatistikk.
              Velg mål, kjønn og yrke for å se hva tallene betyr.
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-sm font-bold text-[#2d2a24]">
              <DataChip label="Periode" value={data.periodLabel} />
              <DataChip label="Kilde" value={data.source} />
              <DataChip label="Oppdatert" value={formatDate(data.updated)} />
            </div>
          </div>

          <div className="fade-up-delay grid gap-3">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {rankedRows.slice(0, 3).map((row) => (
                <PodiumCard
                  key={row.occupationCode}
                  row={row}
                  salaryMode={salaryMode}
                  salaryView={salaryView}
                  genderView={genderView}
                  onSelect={() => setSelectedCode(row.occupationCode)}
                  selected={row.occupationCode === selectedRow.occupationCode}
                />
              ))}
            </div>
            <div className="border border-black/10 bg-white/78 p-4 shadow-[0_22px_70px_rgba(78,54,24,0.13)] backdrop-blur">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7c2d12]">
                    Avstand i toppen
                  </p>
                  <p className="mt-1 text-3xl font-black tracking-[-0.03em] text-[#161616]">
                    {formatMoney(topValue - lastValue)}
                  </p>
                </div>
                <div className="text-right text-sm font-bold text-[#5b5143]">
                  <p>1. til 10. plass</p>
                  <p>{salaryView === "monthly" ? "per måned" : "per år"}</p>
                </div>
              </div>
              <div className="mt-4 grid h-20 grid-cols-10 items-end gap-1" aria-hidden="true">
                {rankedRows.map((row, index) => {
                  const value = getComparableSalary(row, salaryMode, salaryView, genderView);
                  return (
                    <button
                      key={row.occupationCode}
                      className={`min-h-3 bg-gradient-to-t ${rankTones[index]} transition hover:translate-y-[-3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d]`}
                      onClick={() => setSelectedCode(row.occupationCode)}
                      style={{ height: `${Math.max(18, (value / maxValue) * 80)}px` }}
                      type="button"
                    />
                  );
                })}
              </div>
            </div>
          </div>
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

function RankingRow({
  row,
  index,
  maxValue,
  salaryMode,
  salaryView,
  genderView,
  selected,
  onSelect,
}: {
  row: TopOccupationSpecialRow;
  index: number;
  maxValue: number;
  salaryMode: SalaryMode;
  salaryView: SalaryView;
  genderView: GenderView;
  selected: boolean;
  onSelect: () => void;
}) {
  const value = getComparableSalary(row, salaryMode, salaryView, genderView);
  const width = Math.max(14, (value / maxValue) * 100);

  return (
    <button
      aria-pressed={selected}
      className={[
        "group grid gap-3 border p-4 text-left shadow-sm transition sm:grid-cols-[4.5rem_minmax(0,1fr)_8.5rem]",
        selected
          ? "border-[#12281d] bg-[#fff7df] shadow-[0_18px_50px_rgba(90,62,20,0.16)]"
          : "border-black/10 bg-white hover:border-[#d97706]/35 hover:bg-[#fffaf0]",
      ].join(" ")}
      onClick={onSelect}
      type="button"
    >
      <div className={`grid aspect-square place-items-center bg-gradient-to-br ${rankTones[index]} text-3xl font-black text-white shadow-inner`}>
        {index + 1}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-black tracking-[-0.025em] text-[#171717]">
            {row.occupationLabel}
          </h3>
          {index < 3 ? (
            <span className="border border-black/10 bg-white px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#7c2d12]">
              Topp 3
            </span>
          ) : null}
        </div>
        <div className="mt-3 h-4 overflow-hidden bg-[#efe7d9]">
          <div
            className={`h-full bg-gradient-to-r ${rankTones[index]} transition-all`}
            style={{ width: `${width}%` }}
          />
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5b5143]">{row.intro}</p>
      </div>
      <div className="grid content-center gap-1 text-left sm:text-right">
        <p className="text-2xl font-black tracking-[-0.03em] text-[#111827]">
          {formatMoney(value)}
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
  salaryMode,
  salaryView,
  genderView,
  averageTopTen,
  topValue,
  lastValue,
  dataLabel,
}: {
  row: TopOccupationSpecialRow;
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
          <MiniMetric label="Plass" value={`#${row.rank}`} />
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

function PodiumCard({
  row,
  salaryMode,
  salaryView,
  genderView,
  selected,
  onSelect,
}: {
  row: TopOccupationSpecialRow;
  salaryMode: SalaryMode;
  salaryView: SalaryView;
  genderView: GenderView;
  selected: boolean;
  onSelect: () => void;
}) {
  const value = getComparableSalary(row, salaryMode, salaryView, genderView);

  return (
    <button
      aria-pressed={selected}
      className={[
        "grid min-h-44 content-between border border-black/10 p-3 text-left shadow-sm transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532d] sm:p-4",
        selected ? "bg-[#12281d] text-white" : "bg-white/80 text-[#161616]",
      ].join(" ")}
      onClick={onSelect}
      type="button"
    >
      <span className="text-4xl font-black tracking-[-0.04em]">#{row.rank}</span>
      <span className="text-sm font-black leading-5">{row.occupationLabel}</span>
      <span className="text-xl font-black tracking-[-0.03em]">{formatMoney(value)}</span>
    </button>
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
