"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import {
  buildDinLonnReport,
  type DinLonnKjonn,
  type DinLonnPageData,
} from "@/lib/din-lonn";
import type {
  OccupationAgeLatest,
  OccupationSalaryTimeSeries,
  OccupationPurchasingPowerTimeSeries,
  OccupationSalaryDistribution,
} from "@/lib/ssb";

type DinLonnToolProps = {
  data: DinLonnPageData;
};

type FormState = {
  salary: string;
  gender: DinLonnKjonn;
  occupationCode: string;
  workStartYear: string;
  age: string;
};

type OccupationInsightsResponse = {
  age: OccupationAgeLatest | null;
  purchasingPowerSeries: OccupationPurchasingPowerTimeSeries;
  salarySeries: OccupationSalaryTimeSeries;
};

const initialFormState: FormState = {
  salary: "",
  gender: "kvinne",
  occupationCode: "",
  workStartYear: "",
  age: "",
};

const HOURS_PER_YEAR = 1950;
const ESTIMATED_TAX_RATE = 30;
const HOLIDAY_PAY_RATE = 12;
const VACATION_WEEKS = 5;
const WORK_DAYS_PER_YEAR = 260;
const VACATION_DAYS = VACATION_WEEKS * 5;

export function DinLonnTool({ data }: DinLonnToolProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitted, setSubmitted] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [occupationQuery, setOccupationQuery] = useState("");
  const [isOccupationMenuOpen, setIsOccupationMenuOpen] = useState(false);
  const [distribution, setDistribution] = useState<OccupationSalaryDistribution | null>(null);
  const [distributionError, setDistributionError] = useState<string | null>(null);
  const [isDistributionLoading, setIsDistributionLoading] = useState(false);
  const [purchasingPowerSeries, setPurchasingPowerSeries] =
    useState<OccupationPurchasingPowerTimeSeries | null>(null);
  const [salarySeries, setSalarySeries] = useState<OccupationSalaryTimeSeries | null>(null);
  const [ageInsight, setAgeInsight] = useState<OccupationAgeLatest | null>(null);
  const [purchasingPowerError, setPurchasingPowerError] = useState<string | null>(null);
  const [isPurchasingPowerLoading, setIsPurchasingPowerLoading] = useState(false);

  const parsedSalary = submitted ? parseSalary(submitted.salary) : undefined;
  const submittedStartYear = submitted ? parseInteger(submitted.workStartYear) : undefined;
  const submittedAge = submitted ? parseInteger(submitted.age) : undefined;
  const report =
    submitted && parsedSalary !== undefined
      ? buildDinLonnReport({
          salary: parsedSalary,
          gender: submitted.gender,
          occupationCode: submitted.occupationCode,
          data,
        })
      : null;
  const deferredOccupationQuery = useDeferredValue(occupationQuery);
  const occupationOptions = useMemo(() => flattenOccupationOptions(data), [data]);
  const filteredOccupationOptions = filterOccupationOptions(
    occupationOptions,
    deferredOccupationQuery,
  ).slice(0, 8);
  const activeDistributionRow = submitted?.gender === "mann" ? "men" : "women";
  const userPurchasingPowerInsight =
    report && submittedStartYear !== undefined && salarySeries && purchasingPowerSeries
      ? buildUserPurchasingPowerInsight({
          currentSalary: report.salary,
          gender: report.gender,
          salarySeries,
          purchasingPowerSeries,
          startYear: submittedStartYear,
        })
      : null;
  const userAgeInsight =
    report && submittedAge !== undefined && ageInsight
      ? buildUserAgeInsight({
          age: submittedAge,
          ageInsight,
          gender: report.gender,
        })
      : null;

  useEffect(() => {
    const submittedOccupationCode = submitted?.occupationCode;

    if (!submittedOccupationCode) {
      setDistribution(null);
      setDistributionError(null);
      setIsDistributionLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadDistribution() {
      const occupationCode = submittedOccupationCode;

      if (!occupationCode) {
        return;
      }

      try {
        setIsDistributionLoading(true);
        setDistributionError(null);

        const response = await fetch(
          `/api/occupation-distribution?occupationCode=${encodeURIComponent(occupationCode)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Kunne ikke hente lønnsfordelingen akkurat nå.");
        }

        const nextDistribution = (await response.json()) as OccupationSalaryDistribution | null;
        setDistribution(nextDistribution);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setDistribution(null);
        setDistributionError(
          fetchError instanceof Error
            ? fetchError.message
            : "Kunne ikke hente lønnsfordelingen akkurat nå.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsDistributionLoading(false);
        }
      }
    }

    void loadDistribution();

    return () => controller.abort();
  }, [submitted?.occupationCode]);

  useEffect(() => {
    const submittedOccupationCode = submitted?.occupationCode;

    if (!submittedOccupationCode) {
      setPurchasingPowerSeries(null);
      setSalarySeries(null);
      setAgeInsight(null);
      setPurchasingPowerError(null);
      setIsPurchasingPowerLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadInsights() {
      const occupationCode = submittedOccupationCode;

      if (!occupationCode) {
        return;
      }

      try {
        setIsPurchasingPowerLoading(true);
        setPurchasingPowerError(null);

        const response = await fetch(
          `/api/occupation-insights?occupationCode=${encodeURIComponent(occupationCode)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Kunne ikke hente kjøpekraft akkurat nå.");
        }

        const nextInsights = (await response.json()) as OccupationInsightsResponse;
        setAgeInsight(nextInsights.age);
        setPurchasingPowerSeries(nextInsights.purchasingPowerSeries);
        setSalarySeries(nextInsights.salarySeries);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setAgeInsight(null);
        setPurchasingPowerSeries(null);
        setSalarySeries(null);
        setPurchasingPowerError(
          fetchError instanceof Error ? fetchError.message : "Kunne ikke hente kjøpekraft akkurat nå.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsPurchasingPowerLoading(false);
        }
      }
    }

    void loadInsights();

    return () => controller.abort();
  }, [submitted?.occupationCode]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const salary = parseSalary(form.salary);
    const workStartYear = parseOptionalInteger(form.workStartYear);
    const age = parseOptionalInteger(form.age);

    if (salary === undefined || salary <= 0) {
      setError("Legg inn en gyldig brutto månedslønn.");
      return;
    }

    if (!form.occupationCode) {
      setError("Velg et yrke før du sjekker lønnen.");
      return;
    }

    if (form.workStartYear.trim() && (workStartYear === undefined || workStartYear < 2016 || workStartYear > 2025)) {
      setError("Legg inn arbeidsstart fra 2016 til 2025, eller la feltet stå tomt.");
      return;
    }

    if (form.age.trim() && (age === undefined || age < 16 || age > 100)) {
      setError("Legg inn en gyldig alder mellom 16 og 100 år, eller la feltet stå tomt.");
      return;
    }

    setError(null);
    setSubmitted(form);
  }

  function handleOccupationSelect(option: { occupationCode: string; occupationLabel: string }) {
    setForm((current) => ({
      ...current,
      occupationCode: option.occupationCode,
    }));
    setOccupationQuery(option.occupationLabel);
    setIsOccupationMenuOpen(false);
    setError(null);
  }

  return (
    <div className="grid gap-8">
      <section className="fade-up">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Lønnsjekk
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                Finn ut hvordan lønnen din faktisk står seg. Legg inn brutto månedslønn, kjønn og
                yrke, og få en tydelig sammenligning mot nivået i yrket ditt basert på oppdaterte
                tall fra SSB.
              </p>
              <div className="max-w-2xl rounded-[5px] border border-black/8 bg-[var(--surface)] px-4 py-4 text-sm leading-7 text-slate-700">
                <p>Kilde SSB. Siste data: {formatPeriodLabel(data.periodLabel)}</p>
              </div>
            </div>

            <form
              className="grid gap-5 rounded-[5px] border border-black/8 bg-[linear-gradient(180deg,rgba(248,250,252,0.96)_0%,rgba(255,255,255,0.98)_100%)] p-5 shadow-[0_12px_36px_rgba(27,36,48,0.06)] sm:p-6"
              onSubmit={handleSubmit}
            >
              <label className="grid gap-2.5" htmlFor="salary">
                <span className="text-sm font-semibold text-slate-900">Brutto månedslønn</span>
                <input
                  id="salary"
                  className="h-14 rounded-[5px] border border-black/10 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                  inputMode="numeric"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      salary: event.target.value,
                    }))
                  }
                  placeholder="For eksempel 58 000"
                  type="text"
                  value={form.salary}
                />
              </label>

              <fieldset className="grid gap-3">
                <legend className="text-sm font-semibold text-slate-900">Kjønn</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <GenderButton
                    active={form.gender === "kvinne"}
                    icon={<FemaleIcon />}
                    label="Kvinne"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        gender: "kvinne",
                      }))
                    }
                    type="button"
                  />
                  <GenderButton
                    active={form.gender === "mann"}
                    icon={<MaleIcon />}
                    label="Mann"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        gender: "mann",
                      }))
                    }
                    type="button"
                  />
                </div>
              </fieldset>

              <div className="grid gap-2">
                <span className="text-sm font-semibold text-slate-900">Yrke</span>
                <div className="relative">
                  <input
                    id="occupation-search"
                    autoComplete="off"
                    className="h-14 w-full rounded-[5px] border border-black/10 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setOccupationQuery(nextValue);
                      setIsOccupationMenuOpen(true);
                      setForm((current) => ({
                        ...current,
                        occupationCode: "",
                      }));
                    }}
                    onFocus={() => setIsOccupationMenuOpen(true)}
                    placeholder="Skriv f.eks. regnskapsfører"
                    type="search"
                    value={occupationQuery}
                  />

                  {isOccupationMenuOpen && filteredOccupationOptions.length > 0 ? (
                    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-[5px] border border-black/10 bg-white shadow-[0_18px_40px_rgba(27,36,48,0.12)]">
                      <ul className="max-h-72 overflow-y-auto py-2">
                        {filteredOccupationOptions.map((option) => (
                          <li key={option.occupationCode}>
                            <button
                              className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-[#f8faf8] hover:text-slate-950"
                              onClick={() => handleOccupationSelect(option)}
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

                {occupationQuery.trim().length > 0 && filteredOccupationOptions.length === 0 ? (
                  <p className="text-sm leading-6 text-[var(--muted)]">
                    Ingen yrker matcher søket ditt akkurat nå.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2.5" htmlFor="workStartYear">
                  <span className="text-sm font-semibold text-slate-900">
                    Arbeidsstart
                    <span className="ml-2 font-normal text-[var(--muted)]">(valgfritt)</span>
                  </span>
                  <input
                    id="workStartYear"
                    className="h-14 rounded-[5px] border border-black/10 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                    inputMode="numeric"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        workStartYear: event.target.value,
                      }))
                    }
                    placeholder="For eksempel 2019"
                    type="text"
                    value={form.workStartYear}
                  />
                </label>

                <label className="grid gap-2.5" htmlFor="age">
                  <span className="text-sm font-semibold text-slate-900">
                    Alder
                    <span className="ml-2 font-normal text-[var(--muted)]">(valgfritt)</span>
                  </span>
                  <input
                    id="age"
                    className="h-14 rounded-[5px] border border-black/10 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                    inputMode="numeric"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        age: event.target.value,
                      }))
                    }
                    placeholder="For eksempel 34"
                    type="text"
                    value={form.age}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                >
                  Sjekk lønn
                </button>
              </div>

              {error ? (
                <p className="rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </section>

      {report ? (
        <section className="fade-up-delay grid gap-6">
          <div className="rounded-[5px] border border-black/10 bg-[var(--surface)] px-6 py-8 shadow-sm sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
              Rapport
            </p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  {report.headline}
                </h2>
                <p className="max-w-3xl text-base leading-7 text-slate-700">{report.summary}</p>
              </div>
              {report.occupation.href ? (
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-[var(--primary)] hover:text-[var(--primary-strong)]"
                  href={report.occupation.href}
                >
                  <ExploreIcon />
                  Utforsk lønn til {report.occupation.occupationLabel.toLowerCase()}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ReportCard
              label="Din månedslønn"
              value={formatCurrency(report.salary)}
              detail={`Årslønn: ${formatCurrency(report.annualSalary)}`}
            />
            <ReportCard
              label={report.comparisonToMedian.label}
              value={formatCurrency(report.comparisonToMedian.value)}
              detail={formatDifference(report.comparisonToMedian.difference)}
              tone={getTone(report.comparisonToMedian.difference)}
            />
            <ReportCard
              label={report.comparisonToAverage.label}
              value={formatCurrency(report.comparisonToAverage.value)}
              detail={formatDifference(report.comparisonToAverage.difference)}
              tone={getTone(report.comparisonToAverage.difference)}
            />
          </div>

          <section className="rounded-[5px] border border-black/10 bg-white px-6 py-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-950">Plassering i lønnsfordelingen</h3>
              <p className="text-sm leading-6 text-slate-600">
                Her ser du hvor lønnen din ligger sammenlignet med 25-persentilen, median avtalt
                månedslønn og 75-persentilen i yrket.
              </p>
            </div>

            <div className="mt-5">
              {isDistributionLoading ? (
                <p className="text-sm leading-6 text-slate-600">Henter lønnsfordeling fra SSB ...</p>
              ) : distribution ? (
                <OccupationSalaryDistributionSection
                  distribution={distribution}
                  scaleMode="focusBand"
                  userMarkers={{
                    [activeDistributionRow]: {
                      label: "Din lønn",
                      value: report.salary,
                    },
                  }}
                  visibleRows={[activeDistributionRow]}
                />
              ) : distributionError ? (
                <p className="text-sm leading-6 text-slate-600">{distributionError}</p>
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  Det finnes ikke nok fordelingsdata for å vise plasseringen akkurat nå.
                </p>
              )}
            </div>
          </section>

          <EstimateSection report={report} />

          {submittedStartYear !== undefined ? (
            <section className="rounded-[5px] border border-black/10 bg-white px-6 py-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Kjøpekraft
                </p>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Din kjøpekraft siden {submittedStartYear}
                </h3>
                <p className="text-sm leading-7 text-slate-700">
                  {buildUserPurchasingPowerSectionIntro(submittedStartYear, report.occupation.occupationLabel)}
                </p>
              </div>

              <div className="mt-5">
                {isPurchasingPowerLoading ? (
                  <p className="text-sm leading-6 text-slate-600">Henter kjøpekraft fra SSB ...</p>
                ) : userPurchasingPowerInsight ? (
                  <UserPurchasingPowerSection insight={userPurchasingPowerInsight} />
                ) : purchasingPowerError ? (
                  <p className="text-sm leading-6 text-slate-600">{purchasingPowerError}</p>
                ) : (
                  <p className="text-sm leading-6 text-slate-600">
                    Vi har ikke nok historiske data til å analysere kjøpekraften fra valgt startår.
                  </p>
                )}
              </div>
            </section>
          ) : null}

          {submittedAge !== undefined ? (
            <section className="rounded-[5px] border border-black/10 bg-white px-6 py-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                  Alder
                </p>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Din alder sammenlignet med yrket
                </h3>
                <p className="text-sm leading-7 text-slate-700">
                  Denne sammenligningen bruker siste tilgjengelige snittalder i yrket og matcher valgt kjønn når det finnes tall.
                </p>
              </div>

              <div className="mt-5">
                {isPurchasingPowerLoading ? (
                  <p className="text-sm leading-6 text-slate-600">Henter aldersdata fra SSB ...</p>
                ) : userAgeInsight ? (
                  <UserAgeSection insight={userAgeInsight} />
                ) : purchasingPowerError ? (
                  <p className="text-sm leading-6 text-slate-600">{purchasingPowerError}</p>
                ) : (
                  <p className="text-sm leading-6 text-slate-600">
                    Vi har ikke nok aldersdata til å sammenligne deg med yrket akkurat nå.
                  </p>
                )}
              </div>
            </section>
          ) : null}

          <section className="rounded-[5px] border border-black/10 bg-[#fcfaf6] px-6 py-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950">Interessante fakta</h3>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                <span className="font-semibold text-slate-950">{report.occupation.occupationLabel}</span>{" "}
                ligger i {formatTopPercent(report.occupationPlacement.percentile)} av yrkene når vi
                rangerer etter median avtalt månedslønn.
              </p>
              <p>
                Yrkets plassering er <span className="font-semibold text-slate-950">{report.occupationPlacement.rank}. plass av {report.occupationPlacement.total}</span>. {report.occupationPlacement.label}
              </p>
              {report.genderGap ? (
                <p>
                  {report.genderGap.label} Forskjellen er {formatCurrency(report.genderGap.difference)} (
                  {formatPercent(report.genderGap.differencePercent)}).
                </p>
              ) : (
                <p>
                  Det finnes ikke nok kjønnsdelte tall for median avtalt månedslønn til å vise et
                  tydelig gap i yrket.
                </p>
              )}
            </div>
          </section>
        </section>
      ) : null}
    </div>
  );
}

type GenderButtonProps = {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  type: "button";
};

function GenderButton({ active, icon, label, onClick, type }: GenderButtonProps) {
  return (
    <button
      className={[
        "inline-flex h-12 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
        active
          ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_10px_24px_rgba(20,83,45,0.18)]"
          : "border-black/10 bg-white text-slate-700 hover:border-[var(--primary)]/30 hover:text-[var(--primary-strong)]",
      ].join(" ")}
      onClick={onClick}
      type={type}
    >
      <span className={active ? "text-white" : "text-[var(--primary-strong)]"}>{icon}</span>
      {label}
    </button>
  );
}

type ReportCardProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "positive" | "negative";
};

function ReportCard({ label, value, detail, tone = "default" }: ReportCardProps) {
  const valueClassName =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-slate-950";

  return (
    <article className="rounded-[5px] border border-black/10 bg-white px-6 py-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-[-0.04em] ${valueClassName}`}>{value}</p>
      {detail ? <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p> : null}
    </article>
  );
}

type EstimateSectionProps = {
  report: NonNullable<ReturnType<typeof buildDinLonnReport>>;
};

function EstimateSection({ report }: EstimateSectionProps) {
  const medianEstimate = report.comparisonToMedian.value !== undefined
    ? buildEstimate(report.comparisonToMedian.value)
    : null;
  const userEstimate = buildEstimate(report.salary);

  return (
    <section className="rounded-[5px] border border-black/10 bg-white px-6 py-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
          Lønnsestimat
        </p>
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Timelønn, feriepenger og netto
        </h3>
        <p className="text-sm leading-7 text-slate-700">
          Her ser du et forenklet estimat for yrket basert på median avtalt månedslønn, og et eget
          estimat basert på lønnen du har lagt inn.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {medianEstimate ? (
          <EstimateCard
            description="Forenklet estimat basert på median avtalt månedslønn i yrket."
            estimate={medianEstimate}
            title="Basert på median i yrket"
          />
        ) : null}
        <EstimateCard
          description="Forenklet estimat basert på brutto månedslønnen du har lagt inn."
          estimate={userEstimate}
          title="Basert på din lønn"
        />
      </div>
    </section>
  );
}

type EstimateCardProps = {
  title: string;
  description: string;
  estimate: ReturnType<typeof buildEstimate>;
};

function EstimateCard({ title, description, estimate }: EstimateCardProps) {
  return (
    <article className="rounded-[5px] border border-black/10 bg-[#f8faf8] px-5 py-5">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-strong)]">
            {title}
          </p>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="grid gap-3">
          <EstimateRow label="Månedslønn" value={formatCurrency(estimate.monthlySalary)} strong />
          <EstimateRow label="Årslønn" value={formatCurrency(estimate.annualSalary)} />
          <EstimateRow label="Timelønn" value={formatCurrency(estimate.hourlySalary)} />
          <EstimateRow label="Netto per måned" tone="positive" value={formatCurrency(estimate.netMonthlySalary)} />
          <EstimateRow label="Feriepenger" tone="positive" value={formatCurrency(estimate.estimatedHolidayPay)} />
          <EstimateRow label="Til utbetaling i juni" value={formatCurrency(estimate.junePayout)} strong />
        </div>
      </div>
    </article>
  );
}

type EstimateRowProps = {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
  strong?: boolean;
};

function EstimateRow({ label, value, tone = "default", strong = false }: EstimateRowProps) {
  const toneClassName =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-slate-950";

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-black/6 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-700">{label}</span>
      <span className={`${strong ? "text-base" : "text-sm"} font-semibold ${toneClassName}`}>{value}</span>
    </div>
  );
}

type UserPurchasingPowerInsight = {
  startYear: number;
  quarter: number;
  cumulativeInflationPercent: number;
  inflationAdjustedStartSalary: number;
  differenceFromAdjustedStart: number;
  differencePercent: number;
  startSalaryReference: number;
  latestPeriodLabel: string;
};

type UserAgeInsight = {
  userAge: number;
  referenceAge: number;
  difference: number;
  label: string;
  detail: string;
  periodLabel: string;
};

type UserPurchasingPowerSectionProps = {
  insight: UserPurchasingPowerInsight;
};

function UserPurchasingPowerSection({ insight }: UserPurchasingPowerSectionProps) {
  const cumulativeInflationValue = formatPercent(insight.cumulativeInflationPercent) ?? "Mangler data";
  const differencePercentValue = formatPercent(insight.differencePercent) ?? "Mangler data";
  const trendTone = getTone(insight.differenceFromAdjustedStart);
  const trendValueClassName =
    trendTone === "positive"
      ? "text-emerald-700"
      : trendTone === "negative"
        ? "text-red-700"
        : "text-slate-950";
  const trendSurfaceClassName =
    trendTone === "positive"
      ? "border-emerald-200 bg-emerald-50"
      : trendTone === "negative"
        ? "border-red-200 bg-red-50"
        : "border-black/8 bg-[#f8faf8]";
  const trendHeadline =
    trendTone === "positive"
      ? "Du har fått bedre kjøpekraft"
      : trendTone === "negative"
        ? "Du har fått dårligere kjøpekraft"
        : "Du har omtrent samme kjøpekraft";

  return (
    <div className="grid gap-4">
      <div className={`rounded-[5px] border px-5 py-4 ${trendSurfaceClassName}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary-strong)]">
              Viktigste tall
            </p>
            <p className={`mt-1 text-2xl font-semibold tracking-[-0.03em] ${trendValueClassName}`}>
              {trendHeadline}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Dette viser om månedslønnen din kan kjøpe mer eller mindre enn da du startet, etter at vi har justert for prisvekst.
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-2 text-3xl font-semibold tracking-[-0.04em] ${trendValueClassName}`}
          >
            <TrendArrowIcon direction={trendTone === "negative" ? "down" : "up"} />
            {differencePercentValue}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ReportCard
          detail={`Sammenlignet med ${insight.startYear}`}
          label="Prisvekst siden start"
          value={cumulativeInflationValue}
        />
        <ReportCard
          detail="Inflasjonsjustert startnivå i dagens kroner"
          label="Median ved start"
          value={formatCurrency(insight.inflationAdjustedStartSalary)}
        />
        <ReportCard
          detail={`${formatDifference(insight.differenceFromAdjustedStart)} mot inflasjonsjustert startnivå`}
          label="Endring i kjøpekraft"
          tone={trendTone}
          value={differencePercentValue}
        />
      </div>

      <div className="rounded-[5px] border border-black/8 bg-[#f8faf8] px-5 py-4 text-sm leading-7 text-slate-700">
        <p>
          Hvis vi bruker median avtalt månedslønn i yrket som startnivå i {insight.startYear}, tilsvarer det{" "}
          <span className="font-semibold text-slate-950">{formatCurrency(insight.inflationAdjustedStartSalary)}</span>{" "}
          i {insight.latestPeriodLabel.toLowerCase()} når vi justerer for prisvekst.
        </p>
        <p className="mt-2">
          Med lønnen du har lagt inn ligger du {formatDifferenceTextLong(insight.differenceFromAdjustedStart)} det
          inflasjonsjusterte nivået, som tilsvarer {differencePercentValue}.
        </p>
      </div>
    </div>
  );
}

type UserAgeSectionProps = {
  insight: UserAgeInsight;
};

function UserAgeSection({ insight }: UserAgeSectionProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ReportCard
          detail={insight.label}
          label="Din alder"
          value={`${insight.userAge} år`}
        />
        <ReportCard
          detail={`Siste tilgjengelige periode: ${insight.periodLabel}`}
          label="Snittalder i yrket"
          value={`${insight.referenceAge.toLocaleString("nb-NO", {
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          })} år`}
        />
      </div>

      <div className="rounded-[5px] border border-black/8 bg-[#f8faf8] px-5 py-4 text-sm leading-7 text-slate-700">
        <p>{insight.detail}</p>
      </div>
    </div>
  );
}

function flattenOccupationOptions(data: DinLonnPageData) {
  return [...data.options].sort((left, right) =>
    left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO"),
  );
}

function filterOccupationOptions(
  options: DinLonnPageData["options"],
  query: string,
) {
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

function parseSalary(value: string) {
  const normalized = value.replace(/\s+/g, "").replace(",", ".");

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOptionalInteger(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return undefined;
  }

  return parseInteger(normalized);
}

function parseInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatCurrency(value?: number) {
  if (value === undefined) {
    return "Mangler data";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatDifference(value?: number) {
  if (value === undefined) {
    return "Mangler sammenligning";
  }

  if (value === 0) {
    return "Akkurat på nivå";
  }

  const prefix = value > 0 ? "+" : "-";
  return `${prefix}${Math.abs(value).toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function formatPercent(value?: number) {
  if (value === undefined) {
    return undefined;
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })} %`;
}

function formatTopPercent(percentile: number) {
  const topShare = Math.max(1, Math.round(100 - percentile));
  return `øverste ${topShare} %`;
}

function getTone(value?: number) {
  if (value === undefined || value === 0) {
    return "default";
  }

  return value > 0 ? "positive" : "negative";
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
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

function buildEstimate(monthlySalary: number) {
  const annualSalary = monthlySalary * 12;
  const hourlySalary = annualSalary / HOURS_PER_YEAR;
  const annualTax = annualSalary * (ESTIMATED_TAX_RATE / 100);
  const monthlyTax = annualTax / 12;
  const netMonthlySalary = monthlySalary - monthlyTax;
  const dailySalary = annualSalary / WORK_DAYS_PER_YEAR;
  const holidayDeduction = dailySalary * VACATION_DAYS;
  const holidayPayBasis = annualSalary - holidayDeduction;
  const estimatedHolidayPay = holidayPayBasis * (HOLIDAY_PAY_RATE / 100);
  const junePayout = monthlySalary + estimatedHolidayPay - holidayDeduction;

  return {
    monthlySalary,
    annualSalary,
    hourlySalary,
    monthlyTax,
    netMonthlySalary,
    holidayDeduction,
    estimatedHolidayPay,
    junePayout,
  };
}

function buildUserPurchasingPowerSectionIntro(
  startYear: number,
  occupationLabel: string,
) {
  return `Vi bruker dagens lønn opp mot et inflasjonsjustert startnivå for ${occupationLabel.toLowerCase()} i ${startYear}.`;
}

function buildUserPurchasingPowerInsight({
  currentSalary,
  gender,
  salarySeries,
  purchasingPowerSeries,
  startYear,
}: {
  currentSalary: number;
  gender: DinLonnKjonn;
  salarySeries: OccupationSalaryTimeSeries;
  purchasingPowerSeries: OccupationPurchasingPowerTimeSeries;
  startYear: number;
}) {
  const latestPoint = purchasingPowerSeries.points[purchasingPowerSeries.points.length - 1];

  if (!latestPoint) {
    return null;
  }

  const latestQuarterMatch = latestPoint.periodCode.match(/^(\d{4})K([1-4])$/);

  if (!latestQuarterMatch) {
    return null;
  }

  const latestYear = Number(latestQuarterMatch[1]);
  const latestQuarter = Number(latestQuarterMatch[2]);

  if (startYear >= latestYear) {
    return null;
  }

  const startSalaryPoint = findAnnualPointForYear(salarySeries.points, startYear, latestQuarter);

  if (!startSalaryPoint) {
    return null;
  }

  const startSalaryReference = pickSalaryValue(startSalaryPoint, gender);

  if (startSalaryReference === undefined) {
    return null;
  }

  const annualPurchasingPowerPoints = Array.from(
    new Map(
      purchasingPowerSeries.points
        .filter((point) => {
          const match = point.periodCode.match(/^(\d{4})K([1-4])$/);
          return match ? Number(match[2]) === latestQuarter : false;
        })
        .map((point) => [point.periodCode.slice(0, 4), point] as const),
    ).values(),
  ).sort((left, right) => left.periodCode.localeCompare(right.periodCode, "nb-NO"));

  const relevantPoints = annualPurchasingPowerPoints.filter((point) => {
    const year = Number(point.periodCode.slice(0, 4));
    return year > startYear && year <= latestYear;
  });

  if (relevantPoints.length === 0) {
    return null;
  }

  const cumulativeInflationFactor = relevantPoints.reduce((factor, point) => {
    return factor * (1 + point.inflationGrowth / 100);
  }, 1);

  const inflationAdjustedStartSalary = startSalaryReference * cumulativeInflationFactor;
  const differenceFromAdjustedStart = currentSalary - inflationAdjustedStartSalary;

  return {
    startYear,
    quarter: latestQuarter,
    cumulativeInflationPercent: (cumulativeInflationFactor - 1) * 100,
    inflationAdjustedStartSalary,
    differenceFromAdjustedStart,
    differencePercent: (differenceFromAdjustedStart / inflationAdjustedStartSalary) * 100,
    startSalaryReference,
    latestPeriodLabel: formatPeriodLabel(latestPoint.periodLabel),
  };
}

function buildUserAgeInsight({
  age,
  ageInsight,
  gender,
}: {
  age: number;
  ageInsight: OccupationAgeLatest;
  gender: DinLonnKjonn;
}) {
  const referenceAge =
    gender === "kvinne"
      ? ageInsight.averageWomen ?? ageInsight.averageAll
      : ageInsight.averageMen ?? ageInsight.averageAll;

  if (referenceAge === undefined) {
    return null;
  }

  const difference = age - referenceAge;
  const direction =
    difference > 0 ? "eldre enn" : difference < 0 ? "yngre enn" : "på samme nivå som";
  const label =
    difference > 0
      ? `${Math.abs(difference).toLocaleString("nb-NO", {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
        })} år eldre`
      : difference < 0
        ? `${Math.abs(difference).toLocaleString("nb-NO", {
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          })} år yngre`
        : "På samme nivå";

  return {
    userAge: age,
    referenceAge,
    difference,
    label,
    detail: `Du er ${direction} snittet i yrket. Sammenligningen bruker ${gender === "kvinne" ? "kvinner" : "menn"} når det finnes tall, ellers begge kjønn samlet.`,
    periodLabel: formatPeriodLabel(ageInsight.periodLabel),
  };
}

function findAnnualPointForYear(
  points: Array<{
    periodCode: string;
    periodLabel: string;
    valueAll?: number;
    valueWomen?: number;
    valueMen?: number;
  }>,
  year: number,
  preferredQuarter: number,
) {
  const matchingPoints = points
    .map((point) => {
      const match = point.periodCode.match(/^(\d{4})K([1-4])$/);

      if (!match || Number(match[1]) !== year) {
        return null;
      }

      return {
        point,
        quarter: Number(match[2]),
      };
    })
    .filter((entry): entry is { point: (typeof points)[number]; quarter: number } => Boolean(entry))
    .sort((left, right) => right.quarter - left.quarter);

  return (
    matchingPoints.find((entry) => entry.quarter === preferredQuarter)?.point ??
    matchingPoints[0]?.point ??
    null
  );
}

function pickSalaryValue(
  point: { valueAll?: number; valueWomen?: number; valueMen?: number },
  gender: DinLonnKjonn,
) {
  return gender === "kvinne" ? point.valueWomen ?? point.valueAll : point.valueMen ?? point.valueAll;
}

function formatDifferenceTextLong(value: number) {
  if (value === 0) {
    return "akkurat på nivå med";
  }

  const absoluteValue = Math.abs(value).toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  });

  return value > 0 ? `${absoluteValue} kr over` : `${absoluteValue} kr under`;
}

function TrendArrowIcon({ direction }: { direction: "up" | "down" }) {
  return direction === "down" ? (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 5v14M12 19l-5-5M12 19l5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  ) : (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 19V5M12 5l-5 5M12 5l5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function FemaleIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8v6M5.5 11h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function MaleIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <circle cx="6" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 7.5 13 3M10 3h3v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <path d="M3 13 13 3M13 3H7.5M13 3v5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
