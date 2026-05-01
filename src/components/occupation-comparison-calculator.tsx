"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  pickComparisonGenderValue,
  type OccupationComparisonGender,
  type OccupationComparisonInsights,
  type OccupationComparisonOption,
  type OccupationComparisonPageData,
} from "@/lib/occupation-comparison";

const HOURS_PER_YEAR = 1950;

type OccupationComparisonCalculatorProps = {
  data: OccupationComparisonPageData;
};

type SelectorKey = "first" | "second";

const genderOptions = [
  { value: "all", label: "Begge kjønn" },
  { value: "men", label: "Menn" },
  { value: "women", label: "Kvinner" },
] as const;

export function OccupationComparisonCalculator({ data }: OccupationComparisonCalculatorProps) {
  const sortedOptions = useMemo(
    () =>
      [...data.options].sort((left, right) =>
        left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO"),
      ),
    [data.options],
  );
  const initialFirstCode = sortedOptions[0]?.occupationCode ?? "";
  const initialSecondCode =
    sortedOptions.find((option) => option.occupationCode !== initialFirstCode)?.occupationCode ?? "";

  const [gender, setGender] = useState<OccupationComparisonGender>("all");
  const [selectedCodes, setSelectedCodes] = useState({
    first: initialFirstCode,
    second: initialSecondCode,
  });
  const [queries, setQueries] = useState({
    first: getOccupationLabel(sortedOptions, initialFirstCode),
    second: getOccupationLabel(sortedOptions, initialSecondCode),
  });
  const [openSelector, setOpenSelector] = useState<SelectorKey | null>(null);
  const [insightsByCode, setInsightsByCode] = useState<Record<string, OccupationComparisonInsights>>({});
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const firstOccupation = findOption(sortedOptions, selectedCodes.first);
  const secondOccupation = findOption(sortedOptions, selectedCodes.second);
  const firstMetrics = buildOccupationMetrics(firstOccupation, insightsByCode[selectedCodes.first], gender);
  const secondMetrics = buildOccupationMetrics(secondOccupation, insightsByCode[selectedCodes.second], gender);
  const selectedOccupationCodes = useMemo(
    () => [selectedCodes.first, selectedCodes.second].filter(Boolean),
    [selectedCodes.first, selectedCodes.second],
  );

  useEffect(() => {
    const missingCodes = selectedOccupationCodes.filter((code) => !insightsByCode[code]);

    if (missingCodes.length === 0) {
      return;
    }

    const controller = new AbortController();

    async function loadInsights() {
      try {
        setIsLoadingInsights(true);
        setInsightsError(null);

        const response = await fetch(
          `/api/occupation-comparison?occupationCodes=${missingCodes.map(encodeURIComponent).join(",")}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Kunne ikke hente sammenligning akkurat nå.");
        }

        const payload = (await response.json()) as { insights: OccupationComparisonInsights[] };
        setInsightsByCode((current) => ({
          ...current,
          ...Object.fromEntries(payload.insights.map((insight) => [insight.occupationCode, insight])),
        }));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setInsightsError(error instanceof Error ? error.message : "Kunne ikke hente sammenligning akkurat nå.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingInsights(false);
        }
      }
    }

    void loadInsights();

    return () => controller.abort();
  }, [insightsByCode, selectedOccupationCodes]);

  function handleOccupationSelect(selector: SelectorKey, option: OccupationComparisonOption) {
    setSelectedCodes((current) => ({
      ...current,
      [selector]: option.occupationCode,
    }));
    setQueries((current) => ({
      ...current,
      [selector]: option.occupationLabel,
    }));
    setOpenSelector(null);
  }

  return (
    <section className="fade-up grid gap-6 lg:gap-8">
      <div className="relative overflow-visible rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-8 lg:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,83,45,0.22),transparent)]" />
        <div className="relative space-y-5">
          <div className="max-w-4xl space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
              Sammenlign lønn
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Velg to yrker og se lønn, alder, antall i jobb og reallønnsvekst side om side.
            </p>
            <HeroInsight
              firstMetrics={firstMetrics}
              firstOccupation={firstOccupation}
              secondMetrics={secondMetrics}
              secondOccupation={secondOccupation}
            />
            <p className="text-sm leading-6 text-slate-500">
              Siste lønnsdata: {formatPeriodLabel(data.periodLabel)}
            </p>
          </div>

          <div className="grid gap-3">
            <PanelRow>
              <fieldset className="grid gap-2">
                <legend className="text-sm font-semibold text-slate-950">Vis tall for</legend>
                <div className="grid gap-2 rounded-[5px] bg-slate-100 p-1 sm:inline-grid sm:grid-cols-3">
                  {genderOptions.map((option) => (
                    <button
                      aria-pressed={gender === option.value}
                      className={[
                        "h-10 rounded-[5px] px-4 text-sm font-semibold transition",
                        gender === option.value
                          ? "bg-white text-[var(--primary-strong)] shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                          : "text-slate-600 hover:bg-white/70 hover:text-slate-950",
                      ].join(" ")}
                      key={option.value}
                      onClick={() => setGender(option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </PanelRow>

            <PanelRow>
              <div className="grid gap-3 lg:grid-cols-2">
                <OccupationSelector
                  label="Primært yrke"
                  onQueryChange={(value) =>
                    setQueries((current) => ({
                      ...current,
                      first: value,
                    }))
                  }
                  onSelect={(option) => handleOccupationSelect("first", option)}
                  open={openSelector === "first"}
                  options={sortedOptions}
                  query={queries.first}
                  selectedCode={selectedCodes.first}
                  setOpen={(open) => setOpenSelector(open ? "first" : null)}
                />
                <OccupationSelector
                  label="Sammenlignes med"
                  onQueryChange={(value) =>
                    setQueries((current) => ({
                      ...current,
                      second: value,
                    }))
                  }
                  onSelect={(option) => handleOccupationSelect("second", option)}
                  open={openSelector === "second"}
                  options={sortedOptions}
                  query={queries.second}
                  selectedCode={selectedCodes.second}
                  setOpen={(open) => setOpenSelector(open ? "second" : null)}
                />
              </div>
            </PanelRow>
          </div>

          {insightsError ? (
            <p className="rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {insightsError}
            </p>
          ) : null}
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <OccupationSummaryCard
          comparisonMetrics={secondMetrics}
          loading={isLoadingInsights && !insightsByCode[selectedCodes.first]}
          metrics={firstMetrics}
          occupation={firstOccupation}
        />
        <OccupationSummaryCard
          comparisonMetrics={firstMetrics}
          loading={isLoadingInsights && !insightsByCode[selectedCodes.second]}
          metrics={secondMetrics}
          occupation={secondOccupation}
        />
      </section>

      <InsightSummary
        firstMetrics={firstMetrics}
        firstOccupation={firstOccupation}
        secondMetrics={secondMetrics}
        secondOccupation={secondOccupation}
      />

      <section className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            Side om side
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Detaljert dokumentasjon av tallene for valgt kjønn.
          </p>
        </div>
        <div className="grid gap-3">
          <div className="hidden px-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 md:grid md:grid-cols-[1fr_0.75fr_0.75fr_0.7fr]">
            <span />
            <span>Primært</span>
            <span>Sammenlignes</span>
            <span>Diff</span>
          </div>
          {comparisonRows.map((row) => (
            <ComparisonRow
              firstValue={firstMetrics[row.key]}
              firstLabel={firstOccupation?.occupationLabel}
              important={row.important}
              key={row.key}
              label={row.label}
              unit={row.unit}
              valueFormatter={row.valueFormatter}
              differenceFormatter={row.differenceFormatter}
              secondValue={secondMetrics[row.key]}
              secondLabel={secondOccupation?.occupationLabel}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

type OccupationSelectorProps = {
  label: string;
  query: string;
  selectedCode: string;
  open: boolean;
  options: OccupationComparisonOption[];
  onQueryChange: (value: string) => void;
  onSelect: (option: OccupationComparisonOption) => void;
  setOpen: (open: boolean) => void;
};

function OccupationSelector({
  label,
  query,
  selectedCode,
  open,
  options,
  onQueryChange,
  onSelect,
  setOpen,
}: OccupationSelectorProps) {
  const deferredQuery = useDeferredValue(query);
  const filteredOptions = filterOccupationOptions(options, deferredQuery).slice(0, 8);

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold text-slate-950">{label}</span>
      <div className="relative">
        <input
          autoComplete="off"
          className={inputClassName}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && filteredOptions[0]) {
              event.preventDefault();
              onSelect(filteredOptions[0]);
            }
          }}
          placeholder="Søk etter yrke"
          type="search"
          value={query}
        />
        {open && filteredOptions.length > 0 ? (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-[5px] border border-black/10 bg-white shadow-[0_18px_40px_rgba(27,36,48,0.12)]">
            <ul className="max-h-72 overflow-y-auto py-2">
              {filteredOptions.map((option) => (
                <li key={option.occupationCode}>
                  <button
                    className={[
                      "flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm transition hover:bg-[#f8faf8] hover:text-slate-950",
                      option.occupationCode === selectedCode
                        ? "bg-[rgba(20,83,45,0.08)] text-[var(--primary-strong)]"
                        : "text-slate-700",
                    ].join(" ")}
                    onClick={() => onSelect(option)}
                    type="button"
                  >
                    <span>{option.occupationLabel}</span>
                    <span className="shrink-0 text-xs text-[var(--muted)]">
                      {option.groupLabel}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type OccupationMetrics = {
  monthlySalary?: number;
  annualSalary?: number;
  hourlySalary?: number;
  age?: number;
  workforce?: number;
  realGrowth?: number;
};

type OccupationSummaryCardProps = {
  occupation?: OccupationComparisonOption;
  metrics: OccupationMetrics;
  comparisonMetrics: OccupationMetrics;
  loading: boolean;
};

function OccupationSummaryCard({
  occupation,
  metrics,
  comparisonMetrics,
  loading,
}: OccupationSummaryCardProps) {
  return (
    <article className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {loading ? "Henter tall" : "Valgt yrke"}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
        {occupation?.occupationLabel ?? "Velg yrke"}
      </h2>
      <div className="mt-5 grid gap-3">
        <MetricRow
          important
          label="Årslønn"
          tone={getMetricComparisonTone(metrics.annualSalary, comparisonMetrics.annualSalary)}
          value={formatCurrency(metrics.annualSalary)}
        />
        <MetricRow
          important
          label="Månedslønn"
          tone={getMetricComparisonTone(metrics.monthlySalary, comparisonMetrics.monthlySalary)}
          value={formatCurrency(metrics.monthlySalary)}
        />
        <MetricRow
          important
          label="Timelønn"
          tone={getMetricComparisonTone(metrics.hourlySalary, comparisonMetrics.hourlySalary)}
          value={formatCurrency(metrics.hourlySalary)}
        />
        <MetricRow
          label="Hvor mange i jobb"
          tone={getMetricComparisonTone(metrics.workforce, comparisonMetrics.workforce)}
          value={formatPeople(metrics.workforce)}
        />
        <MetricRow
          label="Reallønnsvekst siste året"
          tone={getMetricComparisonTone(metrics.realGrowth, comparisonMetrics.realGrowth)}
          value={formatPercent(metrics.realGrowth)}
        />
        <MetricRow label="Alder" tone="default" value={formatAge(metrics.age)} />
      </div>
      {occupation?.href ? (
        <Link
          className="mt-5 inline-flex items-center justify-center rounded-[5px] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 hover:text-[var(--primary-strong)]"
          href={occupation.href}
        >
          Utforsk yrket
        </Link>
      ) : null}
    </article>
  );
}

type HeroInsightProps = {
  firstOccupation?: OccupationComparisonOption;
  secondOccupation?: OccupationComparisonOption;
  firstMetrics: OccupationMetrics;
  secondMetrics: OccupationMetrics;
};

function HeroInsight({
  firstOccupation,
  secondOccupation,
  firstMetrics,
  secondMetrics,
}: HeroInsightProps) {
  const text = buildHeroInsightText({
    firstLabel: firstOccupation?.occupationLabel,
    firstValue: firstMetrics.monthlySalary,
    secondLabel: secondOccupation?.occupationLabel,
    secondValue: secondMetrics.monthlySalary,
  });

  if (!text) {
    return null;
  }

  return (
    <p className="max-w-4xl text-2xl font-semibold leading-9 tracking-[-0.04em] text-slate-950 sm:text-3xl sm:leading-10">
      {text}
    </p>
  );
}

type InsightSummaryProps = {
  firstOccupation?: OccupationComparisonOption;
  secondOccupation?: OccupationComparisonOption;
  firstMetrics: OccupationMetrics;
  secondMetrics: OccupationMetrics;
};

function InsightSummary({
  firstOccupation,
  secondOccupation,
  firstMetrics,
  secondMetrics,
}: InsightSummaryProps) {
  const insights = buildInsightSummaryItems({
    firstLabel: firstOccupation?.occupationLabel,
    secondLabel: secondOccupation?.occupationLabel,
    firstMetrics,
    secondMetrics,
  });

  if (insights.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Kort fortalt
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
          Dette skiller yrkene mest
        </h2>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {insights.map((insight) => (
          <article
            className="rounded-[5px] bg-slate-50 px-4 py-4 ring-1 ring-slate-100"
            key={insight.label}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {insight.label}
            </p>
            <div className="mt-3">
              <p className="text-base font-semibold leading-6 text-slate-950">
                {insight.text}
              </p>
            </div>
            {insight.bars ? (
              <div className="mt-4 grid gap-2">
                {insight.bars.map((bar) => (
                  <div className="grid gap-1" key={bar.label}>
                    <div className="flex items-center justify-between gap-3 text-xs text-slate-600">
                      <span className="truncate">{bar.label}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-slate-950">
                        {formatCompactNumber(bar.value)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-sky-700"
                        style={{ width: `${bar.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

type ComparisonRowProps = {
  label: string;
  unit: string;
  firstValue?: number;
  secondValue?: number;
  valueFormatter: (value?: number) => string;
  differenceFormatter: (value?: number) => string;
  firstLabel?: string;
  secondLabel?: string;
  important?: boolean;
};

function ComparisonRow({
  label,
  unit,
  firstValue,
  secondValue,
  valueFormatter,
  differenceFormatter,
  important = false,
}: ComparisonRowProps) {
  const difference =
    firstValue !== undefined && secondValue !== undefined ? firstValue - secondValue : undefined;

  return (
    <div
      className={`grid gap-2 rounded-[5px] px-3 py-2.5 md:grid-cols-[1fr_0.75fr_0.75fr_0.7fr] md:items-center ${
        important ? "bg-white ring-1 ring-slate-100" : "bg-slate-50"
      }`}
    >
      <span className="text-sm font-semibold text-slate-950">
        {label}
        <span className="ml-2 text-xs font-medium text-slate-400">{unit}</span>
      </span>
      <span className={`${important ? "font-semibold text-slate-950" : "text-slate-700"} text-sm tabular-nums`}>
        {valueFormatter(firstValue)}
      </span>
      <span className={`${important ? "font-semibold text-slate-950" : "text-slate-700"} text-sm tabular-nums`}>
        {valueFormatter(secondValue)}
      </span>
      <span className={`text-sm font-semibold tabular-nums ${getDifferenceTextClassName(difference)}`}>
        {formatCompactDifference(difference, differenceFormatter)}
      </span>
    </div>
  );
}

type PanelRowProps = {
  children: ReactNode;
};

function PanelRow({ children }: PanelRowProps) {
  return (
    <section className="border-b border-black/6 pb-4 last:border-b-0 last:pb-0">
      {children}
    </section>
  );
}

type MetricRowProps = {
  label: string;
  value: string;
  tone?: "default" | "income" | "serviceability" | "equity" | "warning";
  important?: boolean;
};

function MetricRow({ label, value, tone = "default", important = false }: MetricRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-[5px] px-4 py-3 transition-all duration-300 ${
        getMetricRowSurfaceClassName(important, tone)
      }`}
    >
      <span className="min-w-0 text-sm text-slate-700">{label}</span>
      <span className={`shrink-0 font-semibold tabular-nums ${important ? "text-base" : "text-sm"} ${getValueClassName(tone)}`}>
        {value}
      </span>
    </div>
  );
}

type ComparisonMetricType = "currency" | "age" | "people" | "growth";

const comparisonRows: Array<{
  key: keyof OccupationMetrics;
  label: string;
  unit: string;
  valueFormatter: (value?: number) => string;
  differenceFormatter: (value?: number) => string;
  metricType: ComparisonMetricType;
  important?: boolean;
}> = [
  { key: "annualSalary", label: "Årslønn", unit: "kr/år", valueFormatter: formatPlainNumber, differenceFormatter: formatPlainNumber, metricType: "currency", important: true },
  { key: "monthlySalary", label: "Månedslønn", unit: "kr/mnd", valueFormatter: formatPlainNumber, differenceFormatter: formatPlainNumber, metricType: "currency", important: true },
  { key: "hourlySalary", label: "Timelønn", unit: "kr/time", valueFormatter: formatPlainNumber, differenceFormatter: formatPlainNumber, metricType: "currency", important: true },
  { key: "workforce", label: "Hvor mange i jobb", unit: "personer", valueFormatter: formatPlainNumber, differenceFormatter: formatPlainNumber, metricType: "people" },
  { key: "realGrowth", label: "Reallønnsvekst siste året", unit: "%", valueFormatter: formatPlainPercent, differenceFormatter: formatPlainPercentagePoint, metricType: "growth" },
  { key: "age", label: "Alder", unit: "år", valueFormatter: formatPlainDecimal, differenceFormatter: formatPlainDecimal, metricType: "age" },
];

const inputClassName =
  "h-12 w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]";

function buildOccupationMetrics(
  occupation: OccupationComparisonOption | undefined,
  insights: OccupationComparisonInsights | undefined,
  gender: OccupationComparisonGender,
): OccupationMetrics {
  const monthlySalary = pickSalary(occupation, gender);
  const annualSalary = monthlySalary !== undefined ? monthlySalary * 12 : undefined;

  return {
    monthlySalary,
    annualSalary,
    hourlySalary: annualSalary !== undefined ? annualSalary / HOURS_PER_YEAR : undefined,
    age: pickComparisonGenderValue(insights?.age, gender),
    workforce: pickComparisonGenderValue(insights?.workforce, gender),
    realGrowth: pickComparisonGenderValue(insights?.realGrowth, gender),
  };
}

function pickSalary(
  occupation: OccupationComparisonOption | undefined,
  gender: OccupationComparisonGender,
) {
  if (!occupation) {
    return undefined;
  }

  if (gender === "women") {
    return occupation.medianSalaryWomen ?? occupation.medianSalaryAll;
  }

  if (gender === "men") {
    return occupation.medianSalaryMen ?? occupation.medianSalaryAll;
  }

  return occupation.medianSalaryAll;
}

function findOption(options: OccupationComparisonOption[], occupationCode: string) {
  return options.find((option) => option.occupationCode === occupationCode);
}

function getOccupationLabel(options: OccupationComparisonOption[], occupationCode: string) {
  return findOption(options, occupationCode)?.occupationLabel ?? "";
}

function filterOccupationOptions(options: OccupationComparisonOption[], query: string) {
  const normalizedQuery = normalizeText(query.trim());

  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) => {
    const occupationLabel = normalizeText(option.occupationLabel);
    const occupationCode = normalizeText(option.occupationCode);
    const groupLabel = normalizeText(option.groupLabel);

    return (
      occupationLabel.includes(normalizedQuery) ||
      occupationCode.includes(normalizedQuery) ||
      groupLabel.includes(normalizedQuery)
    );
  });
}

function formatCurrency(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return "Mangler data";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatAge(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return "Mangler data";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
  })} år`;
}

function formatPeople(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return "Mangler data";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} personer`;
}

function formatPercent(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return "Mangler data";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function formatPeriodLabel(periodLabel?: string) {
  if (!periodLabel) {
    return "Siste tilgjengelige periode";
  }

  const match = periodLabel.match(/^(\d{4})K([1-4])$/);

  if (!match) {
    return periodLabel;
  }

  return `${match[2]}. kvartal ${match[1]}`;
}

function getMetricComparisonTone(current?: number, comparison?: number): MetricRowProps["tone"] {
  if (current === undefined || comparison === undefined || current === comparison) {
    return "default";
  }

  return current > comparison ? "income" : "default";
}

function getMetricRowSurfaceClassName(important: boolean, tone: NonNullable<MetricRowProps["tone"]>) {
  if (tone === "income") {
    return "bg-emerald-50 ring-1 ring-emerald-100";
  }

  if (tone === "warning") {
    return "bg-rose-50 ring-1 ring-rose-100";
  }

  return important ? "bg-white ring-1 ring-slate-100" : "bg-slate-50";
}

function getDifferenceTextClassName(value?: number) {
  if (value === undefined || value === 0) {
    return "text-slate-500";
  }

  return value > 0 ? "text-emerald-800" : "text-rose-700";
}

function getValueClassName(tone: NonNullable<MetricRowProps["tone"]>) {
  if (tone === "income") {
    return "text-emerald-800";
  }

  if (tone === "serviceability") {
    return "text-sky-900";
  }

  if (tone === "equity") {
    return "text-amber-800";
  }

  if (tone === "warning") {
    return "text-rose-700";
  }

  return "text-slate-950";
}

function buildInsightSummaryItems({
  firstLabel,
  secondLabel,
  firstMetrics,
  secondMetrics,
}: {
  firstLabel?: string;
  secondLabel?: string;
  firstMetrics: OccupationMetrics;
  secondMetrics: OccupationMetrics;
}) {
  const salary = buildHigherLowerInsight({
    firstLabel,
    firstValue: firstMetrics.monthlySalary,
    secondLabel,
    secondValue: secondMetrics.monthlySalary,
    label: "Lønn",
    metricType: "currency",
    formatter: formatCurrency,
  });
  const people = buildHigherLowerInsight({
    firstLabel,
    firstValue: firstMetrics.workforce,
    secondLabel,
    secondValue: secondMetrics.workforce,
    label: "I jobb",
    metricType: "people",
    formatter: formatPeople,
  });
  const growth = buildHigherLowerInsight({
    firstLabel,
    firstValue: firstMetrics.realGrowth,
    secondLabel,
    secondValue: secondMetrics.realGrowth,
    label: "Lønnsvekst",
    metricType: "growth",
    formatter: formatPercent,
  });
  const items: InsightSummaryItem[] = [];

  for (const item of [salary, people, growth]) {
    if (item) {
      items.push(item);
    }
  }

  return items;
}

type InsightSummaryItem = {
  label: string;
  text: string;
  tone: "positive" | "neutral";
  bars?: Array<{ label: string; value: number; percent: number }>;
};

function buildHeroInsightText({
  firstLabel,
  firstValue,
  secondLabel,
  secondValue,
}: {
  firstLabel?: string;
  firstValue?: number;
  secondLabel?: string;
  secondValue?: number;
}) {
  if (
    !firstLabel ||
    !secondLabel ||
    firstValue === undefined ||
    secondValue === undefined ||
    firstValue === secondValue
  ) {
    return null;
  }

  const higherLabel = firstValue > secondValue ? firstLabel : secondLabel;
  const lowerLabel = firstValue > secondValue ? secondLabel : firstLabel;
  const lowerValue = Math.min(firstValue, secondValue);
  const difference = Math.abs(firstValue - secondValue);
  const percentDifference =
    lowerValue > 0 ? Math.round((difference / lowerValue) * 100) : undefined;

  return percentDifference !== undefined
    ? `${higherLabel} tjener i snitt ${percentDifference.toLocaleString("nb-NO")} % mer enn ${lowerLabel.toLowerCase()}.`
    : `${higherLabel} tjener mer enn ${lowerLabel.toLowerCase()}.`;
}

function buildHigherLowerInsight(input: {
  firstLabel?: string;
  firstValue?: number;
  secondLabel?: string;
  secondValue?: number;
  label: string;
  metricType: ComparisonMetricType;
  formatter: (value?: number) => string;
}) {
  const { firstLabel, firstValue, secondLabel, secondValue, label, metricType, formatter } = input;

  if (
    !firstLabel ||
    !secondLabel ||
    firstValue === undefined ||
    secondValue === undefined ||
    firstValue === secondValue
  ) {
    return null;
  }

  const higherLabel = firstValue > secondValue ? firstLabel : secondLabel;
  const lowerValue = Math.min(firstValue, secondValue);
  const difference = Math.abs(firstValue - secondValue);
  const percentDifference =
    metricType === "currency" && lowerValue > 0
      ? ` (+${formatPercentWithoutSign((difference / lowerValue) * 100)})`
      : "";
  const formattedDifference =
    metricType === "growth"
      ? `${difference.toLocaleString("nb-NO", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })} pp`
      : metricType === "people"
        ? formatPlainNumber(difference)
      : formatter(difference).replace(/^\+/, "");
  const text =
    metricType === "people"
      ? `${higherLabel} er langt vanligere (+${formattedDifference} flere i jobb).`
      : metricType === "growth"
        ? `Lønnsveksten er høyere for ${higherLabel.toLowerCase()} (+${formattedDifference}).`
        : `${higherLabel} tjener i snitt ${formattedDifference} mer per måned${percentDifference}.`;
  const maxValue = Math.max(firstValue ?? 0, secondValue ?? 0);

  return {
    label,
    text,
    tone: metricType === "people" ? "neutral" : "positive",
    bars:
      metricType === "people" && firstLabel && secondLabel && maxValue > 0
        ? [
            {
              label: firstLabel,
              value: firstValue,
              percent: Math.max((firstValue / maxValue) * 100, 3),
            },
            {
              label: secondLabel,
              value: secondValue,
              percent: Math.max((secondValue / maxValue) * 100, 3),
            },
          ]
        : undefined,
  } as const;
}

function formatCompactDifference(
  value: number | undefined,
  formatter: (value?: number) => string,
) {
  if (value === undefined) {
    return "Mangler";
  }

  if (value === 0) {
    return "0";
  }

  const prefix = value > 0 ? "+" : "-";
  return `${prefix}${formatter(Math.abs(value))}`;
}

function formatPlainNumber(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return "Mangler";
  }

  return value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  });
}

function formatPlainDecimal(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return "Mangler";
  }

  return value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
  });
}

function formatPlainPercent(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return "Mangler";
  }

  return value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatPlainPercentagePoint(value?: number) {
  return formatPlainPercent(value);
}

function buildExplainedDifference(input: {
  firstLabel?: string;
  firstValue?: number;
  secondLabel?: string;
  secondValue?: number;
  metricType: ComparisonMetricType;
  formatter: (value?: number) => string;
}) {
  const { firstLabel, firstValue, secondLabel, secondValue, metricType, formatter } = input;

  if (
    !firstLabel ||
    !secondLabel ||
    firstValue === undefined ||
    secondValue === undefined
  ) {
    return { icon: "→", text: "Mangler data" };
  }

  if (firstValue === secondValue) {
    return { icon: "→", text: "Like nivåer" };
  }

  const higherLabel = firstValue > secondValue ? firstLabel : secondLabel;
  const difference = Math.abs(firstValue - secondValue);
  const formattedDifference =
    metricType === "growth"
      ? `${difference.toLocaleString("nb-NO", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })} prosentpoeng`
      : formatter(difference).replace(/^\+/, "");
  const suffix =
    metricType === "people"
      ? "flere i jobb"
      : metricType === "age"
        ? "høyere snittalder"
        : metricType === "growth"
          ? "høyere vekst"
          : "høyere";

  return {
    icon: firstValue > secondValue ? "←" : "→",
    text: `${higherLabel}: ${formattedDifference} ${suffix}`,
  };
}

function formatPercentWithoutSign(value: number) {
  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} %`;
}

function formatCompactNumber(value: number) {
  return value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  });
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}
