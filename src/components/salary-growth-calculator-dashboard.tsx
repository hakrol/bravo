"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import { CalculatorPageVisual } from "@/components/calculator-page-visual";
import {
  calculateSalaryGrowth,
  firstSalaryGrowthYear,
  latestSalaryGrowthYear,
  salaryGrowthSource,
  salaryGrowthYears,
  type SalaryGrowthCalculation,
} from "@/lib/lonnsvekst";

type MetricTone = "default" | "positive" | "negative" | "neutral" | "accent";

type SubmittedInput = {
  startSalary: number;
  currentSalary: number;
  startYear: number;
};

const inputClassName =
  "h-11 w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]";

export function SalaryGrowthCalculatorDashboard() {
  const [startSalaryInput, setStartSalaryInput] = useState("");
  const [currentSalaryInput, setCurrentSalaryInput] = useState("");
  const [startYearInput, setStartYearInput] = useState(String(latestSalaryGrowthYear - 3));
  const [submittedInput, setSubmittedInput] = useState<SubmittedInput | null>(null);
  const [error, setError] = useState("");

  const calculation = useMemo(() => {
    if (!submittedInput) {
      return undefined;
    }

    return calculateSalaryGrowth(submittedInput);
  }, [submittedInput]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const startSalary = parsePositiveNumber(startSalaryInput);
    const currentSalary = parsePositiveNumber(currentSalaryInput);
    const startYear = parseWholeNumber(startYearInput);

    if (!startSalary || !currentSalary || !startYear) {
      setError("Fyll inn startlønn, nåværende lønn og startår.");
      setSubmittedInput(null);
      return;
    }

    if (startYear < firstSalaryGrowthYear || startYear >= latestSalaryGrowthYear) {
      setError(`Velg et startår mellom ${firstSalaryGrowthYear} og ${latestSalaryGrowthYear - 1}.`);
      setSubmittedInput(null);
      return;
    }

    setError("");
    setSubmittedInput({
      startSalary,
      currentSalary,
      startYear,
    });
  }

  return (
    <section className="fade-up grid gap-6 lg:gap-8">
      <div className="relative overflow-hidden rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(14,116,144,0.24),transparent)]" />
        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <CalculatorPageVisual variant="growth" />
            <div className="max-w-4xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                Verktøy
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
                Lønnsvekst
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Beregn nominell lønnsvekst, reallønnsvekst og om lønnen din har gitt bedre
                kjøpekraft etter prisvekst.
              </p>
            </div>
          </div>

          <form className="grid gap-4 border-t border-black/6 pt-5" onSubmit={handleSubmit}>
            <div className="grid gap-3 md:grid-cols-3">
              <FieldRow label="Startlønn">
                <NumericInput
                  autoFocus
                  onChange={setStartSalaryInput}
                  placeholder="For eksempel 520 000"
                  value={startSalaryInput}
                />
              </FieldRow>

              <FieldRow label="Nåværende lønn">
                <NumericInput
                  onChange={setCurrentSalaryInput}
                  placeholder="For eksempel 650 000"
                  value={currentSalaryInput}
                />
              </FieldRow>

              <FieldRow label="Startår">
                <select
                  className={inputClassName}
                  onChange={(event) => setStartYearInput(event.target.value)}
                  value={startYearInput}
                >
                  {salaryGrowthYears
                    .filter((year) => year < latestSalaryGrowthYear)
                    .map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                  ))}
                </select>
              </FieldRow>
            </div>

            <div className="flex justify-end">
              <button
                className="inline-flex h-12 items-center justify-center rounded-[5px] bg-[var(--primary-strong)] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(20,83,45,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
                type="submit"
              >
                Beregn lønnsvekst
              </button>
            </div>

            {error ? (
              <p className="rounded-[5px] bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </p>
            ) : null}
          </form>
        </div>
      </div>

      {calculation ? <SalaryGrowthReport calculation={calculation} /> : <EmptyReportState />}
    </section>
  );
}

function SalaryGrowthReport({ calculation }: { calculation: SalaryGrowthCalculation }) {
  const realTone = calculation.realGrowthPercent >= 0 ? "positive" : "negative";
  const marketTone = calculation.marketDifference >= 0 ? "positive" : "negative";
  const purchasingPowerTone = calculation.hasImprovedPurchasingPower ? "positive" : "negative";

  return (
    <section className="grid gap-5" aria-live="polite">
      <div className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
              Rapport
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
              Lønnsvekst fra {calculation.startYear} til {calculation.endYear}
            </h2>
          </div>
          <ReportBadge positive={calculation.hasImprovedPurchasingPower}>
            {calculation.hasImprovedPurchasingPower
              ? "Bedre kjøpekraft"
              : "Svakere kjøpekraft"}
          </ReportBadge>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
        <HeroMetricCard
          detail="Hvor mye lønnen din har økt i kroner, uten å justere for prisvekst."
          label="Nominell økning"
          prominent
          tone={calculation.nominalChange >= 0 ? "positive" : "negative"}
          value={formatCurrency(calculation.nominalChange)}
        />
        <HeroMetricCard
          detail="Lønnsveksten din etter at KPI-veksten i perioden er trukket fra."
          label="Reallønnsvekst"
          tone={realTone}
          value={formatPercent(calculation.realGrowthPercent)}
        />
        <HeroMetricCard
          detail="Lønnen som omtrent måtte til for å beholde samme kjøpekraft."
          label="Kjøpekraftsterskel"
          tone="accent"
          value={formatCurrency(calculation.purchasingPowerSalary)}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <MetricSection
          description="Dette er din egen lønnsutvikling i kroner og prosent."
          title="Din lønnsvekst"
        >
          <MetricRow label="Startlønn" value={formatCurrency(calculation.startSalary)} />
          <MetricRow label="Nåværende lønn" value={formatCurrency(calculation.currentSalary)} />
          <MetricRow
            label="Samlet lønnsvekst"
            tone={calculation.nominalGrowthPercent >= 0 ? "positive" : "negative"}
            value={formatPercent(calculation.nominalGrowthPercent)}
          />
          <MetricRow
            label="Snitt per år"
            tone={calculation.annualNominalGrowthPercent >= 0 ? "positive" : "negative"}
            value={formatPercent(calculation.annualNominalGrowthPercent)}
          />
        </MetricSection>

        <MetricSection
          description="Kjøpekraft handler om lønn justert for prisvekst."
          title="Kjøpekraft"
        >
          <MetricRow
            label="KPI-vekst i perioden"
            tone="neutral"
            value={formatPercent(calculation.inflationGrowthPercent)}
          />
          <MetricRow
            label="Reallønnsvekst"
            tone={realTone}
            value={formatPercent(calculation.realGrowthPercent)}
          />
          <MetricRow
            label="Kjøpekraft i kroner"
            tone={purchasingPowerTone}
            value={formatCurrency(calculation.purchasingPowerChange)}
          />
          <MetricRow
            label="Vurdering"
            tone={purchasingPowerTone}
            value={calculation.hasImprovedPurchasingPower ? "Bedre" : "Svakere"}
          />
        </MetricSection>

        <MetricSection
          description="Sammenlignet med gjennomsnittlig lønnsvekst i SSB-tallene."
          title="Mot snittet"
        >
          <MetricRow
            label="Snittvekst i markedet"
            tone="neutral"
            value={formatPercent(calculation.marketGrowthPercent)}
          />
          <MetricRow label="Lønn ved snittvekst" value={formatCurrency(calculation.marketSalary)} />
          <MetricRow
            label="Avvik fra snittvekst"
            tone={marketTone}
            value={formatCurrency(calculation.marketDifference)}
          />
          <MetricRow label="Beregnet periode" value={`${calculation.yearsCalculated} år`} />
        </MetricSection>
      </section>

      <section className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] sm:p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
          Kort tolkning
        </h2>
        <p className="mt-3 text-base leading-8 text-slate-600">
          Lønnen din har økt med {formatPercent(calculation.nominalGrowthPercent)} nominelt. Etter
          prisvekst blir reallønnsveksten {formatPercent(calculation.realGrowthPercent)}. Det betyr
          at du {calculation.hasImprovedPurchasingPower ? "har fått bedre" : "ikke har fått bedre"}{" "}
          kjøpekraft i perioden, målt mot KPI.
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Kilde: {salaryGrowthSource.source}. Dataperiode: {salaryGrowthSource.period}. Siste
          tilgjengelige periode: {salaryGrowthSource.latestPeriod}.
        </p>
      </section>
    </section>
  );
}

function EmptyReportState() {
  return (
    <section className="rounded-[5px] border border-dashed border-slate-300 bg-white/70 p-6 text-sm leading-6 text-slate-600">
      Fyll inn tallene og trykk på «Beregn lønnsvekst» for å få rapporten.
    </section>
  );
}

function FieldRow({
  label,
  info,
  children,
}: {
  label: string;
  info?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-slate-950">{label}</label>
        {info ? <InfoTip text={info} /> : null}
      </div>
      {children}
    </div>
  );
}

function NumericInput({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <input
      autoFocus={autoFocus}
      className={inputClassName}
      inputMode="decimal"
      onChange={(event) => onChange(sanitizeNumericInput(event.target.value))}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  );
}

function HeroMetricCard({
  label,
  value,
  detail,
  tone,
  prominent = false,
}: {
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
  prominent?: boolean;
}) {
  return (
    <article className={`rounded-[5px] p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] ${getSurfaceClassName(tone)}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p
        className={`mt-3 font-semibold tracking-[-0.05em] tabular-nums ${getValueClassName(tone)} ${
          prominent ? "text-4xl sm:text-5xl" : "text-3xl"
        }`}
      >
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
    </article>
  );
}

function MetricSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function MetricRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: MetricTone;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[5px] bg-slate-50 px-4 py-3">
      <span className="truncate text-sm text-slate-700">{label}</span>
      <span className={`shrink-0 text-sm font-semibold tabular-nums ${getValueClassName(tone)}`}>
        {value}
      </span>
    </div>
  );
}

function InfoTip({ text }: { text: string }) {
  return (
    <details className="group relative">
      <summary className="flex h-5 w-5 cursor-pointer list-none items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-300 hover:text-slate-950">
        i
      </summary>
      <div className="absolute left-1/2 top-[calc(100%+0.5rem)] z-20 w-64 -translate-x-1/2 rounded-[5px] bg-slate-950 px-3 py-2 text-xs leading-5 text-white shadow-[0_16px_40px_rgba(15,23,42,0.20)]">
        {text}
      </div>
    </details>
  );
}

function ReportBadge({ positive, children }: { positive: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-[5px] px-3 py-1 text-sm font-semibold ${
        positive ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"
      }`}
    >
      {children}
    </span>
  );
}

function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9,.\s-]/g, "").replace(/\./g, ",");
}

function parsePositiveNumber(value: string) {
  const normalized = value.replace(/\s+/g, "").replace(",", ".");

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function parseWholeNumber(value: string) {
  const parsed = parsePositiveNumber(value);

  if (parsed === undefined) {
    return undefined;
  }

  return Math.floor(parsed);
}

function formatCurrency(value: number) {
  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);

  return `${sign}${absoluteValue.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";

  return `${sign}${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function getSurfaceClassName(tone: MetricTone) {
  if (tone === "positive") {
    return "bg-emerald-50";
  }

  if (tone === "negative") {
    return "bg-rose-50";
  }

  if (tone === "neutral") {
    return "bg-sky-50";
  }

  if (tone === "accent") {
    return "bg-amber-50";
  }

  return "bg-white";
}

function getValueClassName(tone: MetricTone) {
  if (tone === "positive") {
    return "text-emerald-800";
  }

  if (tone === "negative") {
    return "text-rose-700";
  }

  if (tone === "neutral") {
    return "text-sky-900";
  }

  if (tone === "accent") {
    return "text-amber-800";
  }

  return "text-slate-950";
}
