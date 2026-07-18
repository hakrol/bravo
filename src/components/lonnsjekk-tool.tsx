"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { LonnsjekkShareAction } from "@/components/lonnsjekk-share-action";
import { OccupationPurchasingPowerLineChart } from "@/components/occupation-purchasing-power-line-chart";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import {
  buildLonnsjekkReport,
  type LonnsjekkKjonn,
  type LonnsjekkPageData,
} from "@/lib/lonnsjekk";
import type {
  OccupationAgeLatest,
  OccupationEmploymentGrowth,
  OccupationPurchasingPowerTimeSeries,
  OccupationSalaryDistribution,
} from "@/lib/ssb";

type LonnsjekkToolProps = {
  data: LonnsjekkPageData;
};

type FormState = {
  salary: string;
  gender: LonnsjekkKjonn;
  occupationCode: string;
  age: string;
};

type OccupationInsightsResponse = {
  age: OccupationAgeLatest | null;
  employmentGrowth: OccupationEmploymentGrowth | null;
  purchasingPowerSeries: OccupationPurchasingPowerTimeSeries;
};

const initialFormState: FormState = {
  salary: "",
  gender: "kvinne",
  occupationCode: "",
  age: "",
};

const HOURS_PER_YEAR = 1950;
const HOURS_PER_WEEK = 37.5;
const ESTIMATED_TAX_RATE = 30;
const HOLIDAY_PAY_RATE = 12;
const VACATION_WEEKS = 5;
const WORK_DAYS_PER_YEAR = 260;
const VACATION_DAYS = VACATION_WEEKS * 5;
const salaryNegotiationArticles = [
  { href: "/blogg/hvordan-be-om-mer-lonn", title: "Hvordan be om mer lønn" },
  { href: "/blogg/nar-bor-man-be-om-hoyere-lonn", title: "Når bør du be om høyere lønn?" },
  { href: "/blogg/hvor-mye-mer-kan-man-be-om-i-lonn", title: "Hvor mye mer kan du be om?" },
] as const;

export function LonnsjekkTool({ data }: LonnsjekkToolProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitted, setSubmitted] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [occupationQuery, setOccupationQuery] = useState("");
  const [activeOccupationIndex, setActiveOccupationIndex] = useState(0);
  const [isOccupationMenuOpen, setIsOccupationMenuOpen] = useState(false);
  const occupationPickerRef = useRef<HTMLDivElement>(null);
  const reportSectionRef = useRef<HTMLElement>(null);
  const [distribution, setDistribution] = useState<OccupationSalaryDistribution | null>(null);
  const [distributionError, setDistributionError] = useState<string | null>(null);
  const [isDistributionLoading, setIsDistributionLoading] = useState(false);
  const [purchasingPowerSeries, setPurchasingPowerSeries] =
    useState<OccupationPurchasingPowerTimeSeries | null>(null);
  const [ageInsight, setAgeInsight] = useState<OccupationAgeLatest | null>(null);
  const [employmentGrowth, setEmploymentGrowth] = useState<OccupationEmploymentGrowth | null>(null);
  const [purchasingPowerError, setPurchasingPowerError] = useState<string | null>(null);
  const [isPurchasingPowerLoading, setIsPurchasingPowerLoading] = useState(false);
  const reportDate = useMemo(() => new Date(), []);

  const parsedSalary = submitted ? parseSalary(submitted.salary) : undefined;
  const submittedAge = submitted ? parseInteger(submitted.age) : undefined;
  const report =
    submitted && parsedSalary !== undefined
      ? buildLonnsjekkReport({
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

  useEffect(() => {
    if (!isOccupationMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !occupationPickerRef.current?.contains(event.target)
      ) {
        setIsOccupationMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOccupationMenuOpen]);

  useEffect(() => {
    if (!submitted) {
      return;
    }

    reportSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [submitted]);
  const activeDistributionRow = submitted?.gender === "mann" ? "men" : "women";
  const userAgeInsight =
    report && submittedAge !== undefined && ageInsight
      ? buildUserAgeInsight({
          age: submittedAge,
          ageInsight,
          gender: report.gender,
        })
      : null;
  const reportPurchasingPowerSeries = purchasingPowerSeries
    ? getLastTenYearsPurchasingPowerSeries(purchasingPowerSeries)
    : null;
  const latestRealWageGrowth =
    reportPurchasingPowerSeries && submitted
      ? getLatestRealWageGrowth(reportPurchasingPowerSeries, submitted.gender)
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
      setAgeInsight(null);
      setEmploymentGrowth(null);
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
        setEmploymentGrowth(nextInsights.employmentGrowth);
        setPurchasingPowerSeries(nextInsights.purchasingPowerSeries);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setAgeInsight(null);
        setEmploymentGrowth(null);
        setPurchasingPowerSeries(null);
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

    track("Lonnsjekk check salary clicked", {
      page_path: window.location.pathname,
      source: "lonnsjekk_form",
    });

    const salary = parseSalary(form.salary);
    const age = parseOptionalInteger(form.age);

    if (salary === undefined || salary <= 0) {
      setError("Legg inn en gyldig avtalt månedslønn.");
      return;
    }

    if (!form.occupationCode) {
      setError("Velg et yrke før du sjekker lønnen.");
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
      <section className="fade-up relative isolate overflow-visible rounded-[18px] bg-[radial-gradient(circle_at_15%_72%,rgba(218,230,245,0.62),transparent_28%),linear-gradient(135deg,#fbfcfe_0%,#f4f7fb_100%)] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-8">
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(34rem,1.08fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-6">
          <div className="lg:col-start-1 lg:row-start-1">
            <h1 className="text-5xl font-semibold tracking-[-0.065em] text-[#101827] sm:text-6xl lg:text-[4rem]">
              Lønnsjekk
            </h1>
            <p className="mt-4 max-w-[25rem] text-lg leading-8 text-[#38465d]">
              Sammenlign lønnen din med oppdaterte lønnstall fra SSB for yrket ditt.
            </p>

            <div className="mt-7 grid gap-4">
              <BenefitItem
                detail="Vi lagrer eller deler ikke dine opplysninger."
                icon={<ShieldCheckIcon />}
                title="100% anonymt"
              />
              <BenefitItem
                detail="Ferske tall du kan stole på."
                icon={<StatisticsIcon />}
                title="Oppdatert med SSB-data"
              />
              <BenefitItem
                detail="Få resultatet ditt på sekunder."
                icon={<BoltIcon />}
                title="Raskt og enkelt"
              />
            </div>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="rounded-[14px] border border-[#e3e8ef] bg-white px-5 py-6 shadow-[0_20px_55px_rgba(31,51,73,0.10)] sm:px-8 sm:py-7">
              <StepIndicator />

              <form className="mt-7 grid content-start gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-[#101827]" htmlFor="salary">
                      Avtalt månedslønn
                    </label>
                    <FieldInfoIcon label="Den faste avtalte månedslønnen før skatt. Ikke ta med overtid, bonus eller uregelmessige tillegg." />
                  </div>
                  <span className="relative">
                    <input
                      id="salary"
                      className="h-11 w-full rounded-[7px] border border-[#dce3ec] bg-white px-4 pr-12 text-base text-[#101827] outline-none transition placeholder:text-[#91a0b8] hover:border-[#c6d0dd] focus:border-[#17633b] focus:ring-4 focus:ring-[#e7f5ed]"
                      inputMode="numeric"
                      onChange={(event) =>
                        setForm((current) => ({ ...current, salary: event.target.value }))
                      }
                      placeholder="For eksempel 58 000"
                      type="text"
                      value={form.salary}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-[#101827]">
                      kr
                    </span>
                  </span>
                </div>

                <fieldset className="grid gap-2">
                  <legend className="text-sm font-semibold text-[#101827]">Kjønn</legend>
                  <div className="grid grid-cols-2 gap-2">
                    <GenderButton
                      active={form.gender === "kvinne"}
                      icon={<FemaleIcon />}
                      label="Kvinne"
                      onClick={() => setForm((current) => ({ ...current, gender: "kvinne" }))}
                      type="button"
                    />
                    <GenderButton
                      active={form.gender === "mann"}
                      icon={<MaleIcon />}
                      label="Mann"
                      onClick={() => setForm((current) => ({ ...current, gender: "mann" }))}
                      type="button"
                    />
                  </div>
                </fieldset>

                <div className="grid gap-2" ref={occupationPickerRef}>
                  <label className="text-sm font-semibold text-[#101827]" htmlFor="occupation-search">
                    Yrke
                  </label>
                  <div className="relative">
                    <input
                      id="occupation-search"
                      aria-autocomplete="list"
                      aria-controls="occupation-options"
                      aria-activedescendant={
                        isOccupationMenuOpen && filteredOccupationOptions.length > 0
                          ? `occupation-option-${activeOccupationIndex}`
                          : undefined
                      }
                      aria-expanded={isOccupationMenuOpen}
                      autoComplete="off"
                      className="h-11 w-full rounded-[7px] border border-[#dce3ec] bg-white px-4 pr-11 text-base text-[#101827] outline-none transition placeholder:text-[#91a0b8] hover:border-[#c6d0dd] focus:border-[#17633b] focus:ring-4 focus:ring-[#e7f5ed]"
                      onChange={(event) => {
                        setOccupationQuery(event.target.value);
                        setActiveOccupationIndex(0);
                        setIsOccupationMenuOpen(true);
                        setForm((current) => ({ ...current, occupationCode: "" }));
                      }}
                      onFocus={() => setIsOccupationMenuOpen(true)}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          setIsOccupationMenuOpen(true);
                          if (filteredOccupationOptions.length > 0) {
                            setActiveOccupationIndex((current) =>
                              Math.min(current + 1, filteredOccupationOptions.length - 1),
                            );
                          }
                        } else if (event.key === "ArrowUp") {
                          event.preventDefault();
                          setActiveOccupationIndex((current) => Math.max(current - 1, 0));
                        } else if (
                          event.key === "Enter" &&
                          isOccupationMenuOpen &&
                          filteredOccupationOptions[activeOccupationIndex]
                        ) {
                          event.preventDefault();
                          handleOccupationSelect(filteredOccupationOptions[activeOccupationIndex]);
                        } else if (event.key === "Escape") {
                          setIsOccupationMenuOpen(false);
                        }
                      }}
                      placeholder="Skriv f.eks. regnskapsfører eller elektriker"
                      role="combobox"
                      type="search"
                      value={occupationQuery}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#53627a]">
                      <SearchIcon />
                    </span>

                    {isOccupationMenuOpen && filteredOccupationOptions.length > 0 ? (
                      <div className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-30 overflow-hidden rounded-[8px] border border-[#dce3ec] bg-white shadow-[0_18px_40px_rgba(27,36,48,0.12)]">
                        <ul className="max-h-72 overflow-y-auto py-2" id="occupation-options" role="listbox">
                          {filteredOccupationOptions.map((option, index) => (
                            <li key={option.occupationCode}>
                              <button
                                aria-selected={activeOccupationIndex === index}
                                className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-[#f2f8f5] hover:text-slate-950 focus-visible:bg-[#f2f8f5] focus-visible:outline-none aria-selected:bg-[#f2f8f5]"
                                id={`occupation-option-${index}`}
                                onClick={() => handleOccupationSelect(option)}
                                onMouseEnter={() => setActiveOccupationIndex(index)}
                                role="option"
                                type="button"
                              >
                                <span>{option.occupationLabel}</span>
                                <span className="shrink-0 text-xs text-[#53627a]">{option.groupLabel}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                  {occupationQuery.trim().length > 0 && filteredOccupationOptions.length === 0 ? (
                    <p className="text-sm leading-6 text-[#53627a]">Ingen yrker matcher søket ditt akkurat nå.</p>
                  ) : null}
                </div>

                <label className="grid gap-2" htmlFor="age">
                  <span className="text-sm font-semibold text-[#101827]">
                    Alder <span className="font-normal text-[#76859b]">(valgfritt)</span>
                  </span>
                  <input
                    id="age"
                    className="h-11 rounded-[7px] border border-[#dce3ec] bg-white px-4 text-base text-[#101827] outline-none transition placeholder:text-[#91a0b8] hover:border-[#c6d0dd] focus:border-[#17633b] focus:ring-4 focus:ring-[#e7f5ed]"
                    inputMode="numeric"
                    onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                    placeholder="For eksempel 34 år"
                    type="text"
                    value={form.age}
                  />
                </label>

                <button
                  className="mt-1 inline-flex h-11 w-full items-center justify-center gap-5 rounded-[7px] bg-[#0f4a2d] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,74,45,0.16)] transition hover:-translate-y-px hover:bg-[#17633b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17633b]"
                  type="submit"
                >
                  Sjekk lønnen din
                  <ArrowRightIcon />
                </button>

                {error ? (
                  <p className="rounded-[7px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                ) : null}
              </form>
            </div>

          </div>

          <div className="grid gap-5 lg:col-start-1 lg:row-start-2 lg:self-end">
            <div className="hidden justify-center lg:flex lg:justify-start">
              <SalaryCheckIcon />
            </div>
            <div className="flex w-fit max-w-[25rem] items-center gap-3 rounded-[12px] border border-[#e6ebf2] bg-[#eef3fa]/80 px-4 py-3 text-sm leading-6 text-[#38465d]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#667eea]">
                <UsersIcon />
              </span>
              <p>
                Finn ut om du tjener godt nok!
              </p>
            </div>
          </div>
        </div>
      </section>

      {report ? (
        <section
          className="fade-up-delay scroll-mt-24 overflow-hidden rounded-[14px] border border-[#dce3ec] bg-[#fbfcfe] shadow-[0_20px_55px_rgba(31,51,73,0.08)]"
          ref={reportSectionRef}
          style={{
            backgroundImage:
              "linear-gradient(rgba(23,99,59,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(23,99,59,0.035) 1px, transparent 1px), radial-gradient(circle, rgba(23,99,59,0.10) 0.8px, transparent 0.9px)",
            backgroundSize: "32px 32px, 32px 32px, 8px 8px",
          }}
        >
          <header className="px-6 py-8 text-center sm:px-8 sm:py-10">
            <h2 className="text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl">
              Lønnsjekk: {report.occupation.occupationLabel}
            </h2>
            <time
              className="mt-3 block text-sm font-medium text-slate-500"
              dateTime={reportDate.toISOString().slice(0, 10)}
              suppressHydrationWarning
            >
              {formatReportDate(reportDate)}
            </time>

            <nav aria-label="Innhold i rapporten" className="mt-6 flex flex-wrap justify-center gap-2">
              <ReportSectionLink href="#rapport-lonn" icon="salary">Lønn</ReportSectionLink>
              <ReportSectionLink href="#rapport-lonnsestimat" icon="estimate">Lønnsestimat</ReportSectionLink>
              <ReportSectionLink href="#rapport-visste-du-at" icon="insight">Visste du at</ReportSectionLink>
              {submittedAge !== undefined ? (
                <ReportSectionLink href="#rapport-arbeidsmarked" icon="market">Arbeidsmarked</ReportSectionLink>
              ) : null}
            </nav>

            <ReportOverviewGraphic report={report} />
          </header>

          <LonnsjekkShareAction />

          <section className="scroll-mt-24 px-6 py-10 sm:px-8 sm:py-14" id="rapport-lonn">
            <div>
              <ReportSectionHeading icon="salary">Lønn</ReportSectionHeading>
              <ReportHeadline report={report} />
              <p className="mx-auto mt-3 max-w-3xl text-center text-base leading-7 text-slate-700">
                {report.summary}
              </p>
            </div>

            <div className="mt-6 grid divide-y divide-[#e6ebf2] border-y border-[#e6ebf2] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              <ReportCard
                label="Din avtalte månedslønn"
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

            <div className="mx-auto my-14 max-w-5xl text-center sm:my-16">
              <h4 className="text-xl font-semibold text-slate-950 sm:text-2xl">
                Kom i gang med å få bedre lønn
              </h4>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {salaryNegotiationArticles.map((article) => (
                  <Link
                    className="group inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-emerald-50/70 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:border-emerald-900/30 hover:bg-emerald-100/80"
                    href={article.href}
                    key={article.href}
                  >
                    {article.title}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h4 className="text-xl font-semibold text-slate-950 sm:text-2xl">Plassering i lønnsfordelingen</h4>
              <p className="text-sm leading-6 text-slate-600">
                Her ser du om lønnen din ligger i den lave, midtre eller høye delen av det avtalte lønnsnivået i yrket.
              </p>
            </div>

            <div className="mt-5">
              {isDistributionLoading ? (
                <p className="text-center text-sm leading-6 text-slate-600">Henter lønnsfordeling fra SSB ...</p>
              ) : distribution ? (
                <OccupationSalaryDistributionSection
                  distribution={distribution}
                  scaleMode="focusBand"
                  userMarkers={{
                    [activeDistributionRow]: {
                      label: "Du er her",
                      value: report.salary,
                    },
                  }}
                  visibleRows={[activeDistributionRow]}
                />
              ) : distributionError ? (
                <p className="text-center text-sm leading-6 text-slate-600">{distributionError}</p>
              ) : (
                <p className="text-center text-sm leading-6 text-slate-600">
                  Det finnes ikke nok fordelingsdata for å vise plasseringen akkurat nå.
                </p>
              )}
            </div>

            <div className="mt-12">
              {isPurchasingPowerLoading ? (
                <p className="text-center text-sm leading-6 text-slate-600">
                  Henter reallønnsvekst fra SSB ...
                </p>
              ) : reportPurchasingPowerSeries && reportPurchasingPowerSeries.points.length > 0 ? (
                <OccupationPurchasingPowerLineChart
                  initialFilter={report.gender === "mann" ? "realGrowthMen" : "realGrowthWomen"}
                  key={`${report.occupation.occupationCode}-${report.gender}`}
                  series={reportPurchasingPowerSeries}
                />
              ) : purchasingPowerError ? (
                <p className="text-center text-sm leading-6 text-slate-600">{purchasingPowerError}</p>
              ) : (
                <p className="text-center text-sm leading-6 text-slate-600">
                  Det finnes ikke nok historiske data til å vise reallønnsveksten akkurat nå.
                </p>
              )}
            </div>
          </section>

          <EstimateSection report={report} />

          <section className="scroll-mt-24 px-6 py-10 sm:px-8 sm:py-14" id="rapport-visste-du-at">
            <ReportSectionHeading icon="insight">Visste du at</ReportSectionHeading>
            <div className="mx-auto max-w-4xl space-y-4 text-center text-base leading-8 text-slate-700">
              <p>
                <span className="font-semibold text-slate-950">{report.occupation.occupationLabel}</span> er rangert på <span className="font-semibold text-slate-950">{report.occupationPlacement.rank}. plass av {report.occupationPlacement.total}</span> når vi rangerer yrkene fra høyest til lavest median avtalt månedslønn. {report.occupationPlacement.label}
              </p>
              {report.genderGap ? (
                <p>
                  {report.genderGap.label} Forskjellen er{" "}
                  <span className="font-semibold text-slate-950">
                    {formatCurrency(report.genderGap.difference)} ({formatPercent(report.genderGap.differencePercent)})
                  </span>.
                </p>
              ) : null}
              {employmentGrowth?.yearOverYearChange !== undefined &&
              employmentGrowth.previousValue !== undefined ? (
                <p>
                  Antall lønnstakere i yrket endret seg med{" "}
                  <span className="font-semibold text-slate-950">
                    {formatPercent(employmentGrowth.yearOverYearChange)}
                  </span>{" "}
                  fra {formatPeriodLabel(employmentGrowth.previousPeriodLabel)} til{" "}
                  {formatPeriodLabel(employmentGrowth.latestPeriodLabel)}, fra{" "}
                  {formatInteger(employmentGrowth.previousValue)} til {formatInteger(employmentGrowth.latestValue)}.
                </p>
              ) : null}
              {latestRealWageGrowth ? (
                <p>
                  Fra {latestRealWageGrowth.previousYear} til {latestRealWageGrowth.year} var reallønnsveksten for{" "}
                  {report.gender === "mann" ? "menn" : "kvinner"} i yrket{" "}
                  <span className="font-semibold text-slate-950">
                    {formatPercent(latestRealWageGrowth.value)}
                  </span>.
                </p>
              ) : null}
            </div>

          </section>

          {submittedAge !== undefined ? (
            <section className="scroll-mt-24 px-6 py-10 sm:px-8 sm:py-14" id="rapport-arbeidsmarked">
              <div className="text-center">
                <ReportSectionHeading icon="market">Arbeidsmarked</ReportSectionHeading>
                <p className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Din alder sammenlignet med yrket
                </p>
                <p className="mx-auto mt-2 max-w-3xl text-sm leading-7 text-slate-700">
                  Denne sammenligningen bruker siste tilgjengelige snittalder for valgt kjønn i yrket.
                </p>
              </div>

              <div className="mt-5">
                {isPurchasingPowerLoading ? (
                  <p className="text-center text-sm leading-6 text-slate-600">Henter aldersdata fra SSB ...</p>
                ) : userAgeInsight ? (
                  <UserAgeSection insight={userAgeInsight} />
                ) : purchasingPowerError ? (
                  <p className="text-center text-sm leading-6 text-slate-600">{purchasingPowerError}</p>
                ) : (
                  <p className="text-center text-sm leading-6 text-slate-600">
                    Vi har ikke nok aldersdata for valgt kjønn til å sammenligne deg med yrket akkurat nå.
                  </p>
                )}
              </div>
            </section>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

type ReportSectionIconName = "salary" | "estimate" | "insight" | "market";

function ReportSectionLink({
  children,
  href,
  icon,
}: {
  children: ReactNode;
  href: string;
  icon: ReportSectionIconName;
}) {
  return (
    <a
      className="inline-flex items-center gap-2 rounded-full border border-[#dce3ec] bg-white px-4 py-2 text-sm font-semibold text-[#38465d] transition hover:border-[#17633b] hover:bg-[#f2f8f5] hover:text-[#0f4a2d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17633b]"
      href={href}
    >
      <span className="text-[#17633b]">
        <ReportSectionIcon name={icon} />
      </span>
      {children}
    </a>
  );
}

function ReportSectionHeading({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReportSectionIconName;
}) {
  return (
    <div className="mb-8 flex items-center gap-2 sm:gap-7">
      <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,#b9c7d5)]" />
      <h3 className="flex shrink-0 items-center gap-2 text-center text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:gap-3 sm:text-5xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7f5ed] text-[#17633b] sm:h-12 sm:w-12">
          <ReportSectionIcon name={icon} />
        </span>
        {children}
      </h3>
      <span className="h-px flex-1 bg-[linear-gradient(90deg,#b9c7d5,transparent)]" />
    </div>
  );
}

function ReportSectionIcon({ name }: { name: ReportSectionIconName }) {
  if (name === "salary") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 10h18M16 14h2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "estimate") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <rect x="5" y="3" width="14" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 7h8M8 12h1m3 0h1m3 0h1M8 16h1m3 0h1m3 0h1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "insight") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path d="M9 18h6M10 21h4M8.2 14.8A6 6 0 1 1 15.8 14.8C14.7 15.7 14 16.4 14 18h-4c0-1.6-.7-2.3-1.8-3.2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <rect x="3" y="7" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ReportOverviewGraphic({
  report,
}: {
  report: NonNullable<ReturnType<typeof buildLonnsjekkReport>>;
}) {
  const differenceTone = getTone(report.comparisonToMedian.difference);
  const differenceClassName =
    differenceTone === "positive"
      ? "text-emerald-200"
      : differenceTone === "negative"
        ? "text-rose-200"
        : "text-white";

  return (
    <div className="relative mx-auto mt-8 min-h-[17rem] max-w-5xl overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#0b2f20_0%,#0f4a2d_48%,#173f55_100%)] text-left text-white shadow-[0_22px_55px_rgba(15,74,45,0.20)]">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 1000 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="report-line-gradient" x1="80" y1="235" x2="920" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7DD3FC" />
            <stop offset="0.55" stopColor="#6EE7B7" />
            <stop offset="1" stopColor="#C4B5FD" />
          </linearGradient>
          <linearGradient id="report-area-gradient" x1="500" y1="70" x2="500" y2="270" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A7F3D0" stopOpacity="0.24" />
            <stop offset="1" stopColor="#A7F3D0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="850" cy="42" r="185" fill="#93C5FD" opacity="0.08" />
        <circle cx="110" cy="300" r="190" fill="#6EE7B7" opacity="0.08" />
        <path d="M70 239C172 222 221 240 307 194C393 148 462 189 544 142C626 95 700 137 779 94C850 55 890 73 940 45V284H70V239Z" fill="url(#report-area-gradient)" />
        <path d="M70 239C172 222 221 240 307 194C393 148 462 189 544 142C626 95 700 137 779 94C850 55 890 73 940 45" stroke="url(#report-line-gradient)" strokeLinecap="round" strokeWidth="5" />
        <g fill="#D1FAE5" opacity="0.22">
          <rect x="695" y="202" width="38" height="68" rx="8" />
          <rect x="750" y="171" width="38" height="99" rx="8" />
          <rect x="805" y="132" width="38" height="138" rx="8" />
          <rect x="860" y="91" width="38" height="179" rx="8" />
        </g>
      </svg>

      <div className="relative grid min-h-[17rem] items-center gap-8 px-7 py-9 sm:px-10 md:grid-cols-2 md:px-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/80">
            Din avtalte månedslønn
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] tabular-nums sm:text-6xl">
            {formatCurrency(report.salary)}
          </p>
          <p className="mt-3 text-sm text-white/70">
            Årslønn: {formatCurrency(report.annualSalary)}
          </p>
        </div>

        <div className="md:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/80">
            Median avtalt månedslønn
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] tabular-nums sm:text-4xl">
            {formatCurrency(report.comparisonToMedian.value)}
          </p>
          <p className={`mt-3 text-base font-semibold ${differenceClassName}`}>
            {formatDifference(report.comparisonToMedian.difference)} mot medianen
          </p>
        </div>
      </div>
    </div>
  );
}

function StepIndicator() {
  return (
    <div className="mx-auto max-w-[17rem]">
      <div className="flex items-center px-4">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0f4a2d] text-xs font-semibold text-white shadow-[0_5px_12px_rgba(15,74,45,0.2)]">
          1
        </span>
        <span className="mx-3 h-[3px] flex-1 rounded-full bg-[#dce3ec]" />
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0f3f7] text-xs font-semibold text-[#53627a]">
          2
        </span>
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-[#101827]">
        Legg inn lønn og velg yrke
      </p>
    </div>
  );
}

function BenefitItem({ detail, icon, title }: { detail: string; icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7f5ed] text-[#17633b]">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-[#243249]">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#53627a]">{detail}</p>
      </div>
    </div>
  );
}

function FieldInfoIcon({ label }: { label: string }) {
  return (
    <details className="group relative">
      <summary
        aria-label="Vis forklaring av avtalt månedslønn"
        className="flex h-4 w-4 cursor-pointer list-none items-center justify-center rounded-full border border-[#b9c4d2] text-[10px] font-semibold text-[#76859b] transition hover:border-[#17633b] hover:text-[#17633b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17633b] [&::-webkit-details-marker]:hidden"
      >
        i
      </summary>
      <span className="absolute left-1/2 top-[calc(100%+0.5rem)] z-40 w-60 -translate-x-1/2 rounded-[8px] border border-[#dce3ec] bg-white px-3 py-2 text-xs font-normal leading-5 text-[#53627a] shadow-[0_12px_30px_rgba(27,36,48,0.14)] sm:left-0 sm:translate-x-0">
        {label}
      </span>
    </details>
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
      aria-pressed={active}
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-[7px] border px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17633b]",
        active
          ? "border-[#0f4a2d] bg-[#0f4a2d] text-white shadow-[0_8px_20px_rgba(15,74,45,0.16)]"
          : "border-[#dce3ec] bg-white text-[#243249] hover:border-[#aebac8] hover:text-[#0f4a2d]",
      ].join(" ")}
      onClick={onClick}
      type={type}
    >
      <span className={active ? "text-white" : "text-[#53627a]"}>{icon}</span>
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
    <article className="px-6 py-6 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-[-0.04em] tabular-nums ${valueClassName}`}>{value}</p>
      {detail ? <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p> : null}
    </article>
  );
}

function ReportHeadline({
  report,
}: {
  report: NonNullable<ReturnType<typeof buildLonnsjekkReport>>;
}) {
  const markerMatch = report.headline.match(/(?:klart|litt) (?:over|under)/);

  if (!markerMatch || markerMatch.index === undefined) {
    return (
      <p className="text-center text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">
        {report.headline}
      </p>
    );
  }

  const marker = markerMatch[0];
  const markerClassName = marker.includes("over") ? "text-emerald-700" : "text-red-700";
  const beforeMarker = report.headline.slice(0, markerMatch.index);
  const afterMarker = report.headline.slice(markerMatch.index + marker.length);

  return (
    <p className="text-center text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">
      {beforeMarker}
      <span className={`font-bold ${markerClassName}`}>{marker}</span>
      {afterMarker}
    </p>
  );
}

type EstimateSectionProps = {
  report: NonNullable<ReturnType<typeof buildLonnsjekkReport>>;
};

function EstimateSection({ report }: EstimateSectionProps) {
  const medianEstimate = report.comparisonToMedian.value !== undefined
    ? buildEstimate(report.comparisonToMedian.value)
    : null;
  const userEstimate = buildEstimate(report.salary);

  return (
    <section className="scroll-mt-24 px-6 py-10 sm:px-8 sm:py-14" id="rapport-lonnsestimat">
      <div>
        <ReportSectionHeading icon="estimate">Lønnsestimat</ReportSectionHeading>
        <h4 className="text-center text-2xl font-semibold tracking-[-0.03em] text-slate-950">
          Timelønn, feriepenger og netto
        </h4>
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-7 text-slate-700">
          Her ser du et forenklet estimat for yrket basert på median avtalt månedslønn, og et eget
          estimat basert på lønnen du har lagt inn.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-center text-xs leading-6 text-slate-500">
          <span>{formatDecimal(HOURS_PER_WEEK)} t/uke i 100 % stilling</span>
          <span>{HOURS_PER_YEAR.toLocaleString("nb-NO")} t/år</span>
          <span>{ESTIMATED_TAX_RATE} % estimert skatt</span>
          <span>{HOLIDAY_PAY_RATE} % feriepengesats</span>
          <span>{VACATION_WEEKS} uker ferie</span>
        </div>
      </div>

      <div className="mt-6 grid divide-y divide-[#e6ebf2] border-y border-[#e6ebf2] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {medianEstimate ? (
          <EstimateSummaryCard
            description="Median avtalt månedslønn i yrket."
            estimate={medianEstimate}
            salaryLabel="Median avtalt månedslønn"
            title="Basert på median i yrket"
          />
        ) : null}
        <EstimateSummaryCard
          description="Den avtalte månedslønnen før skatt som du har lagt inn."
          estimate={userEstimate}
          salaryLabel="Din avtalte månedslønn"
          title="Basert på din lønn"
        />
      </div>

      <div className="grid divide-y divide-[#e6ebf2] border-b border-[#e6ebf2] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {medianEstimate ? (
          <EstimateHolidayCard
            estimate={medianEstimate}
            title="Feriepenger basert på median i yrket"
          />
        ) : null}
        <EstimateHolidayCard
          estimate={userEstimate}
          title="Feriepenger basert på din lønn"
        />
      </div>
    </section>
  );
}

type EstimateSummaryCardProps = {
  title: string;
  description: string;
  estimate: ReturnType<typeof buildEstimate>;
  salaryLabel: string;
};

function EstimateSummaryCard({
  title,
  description,
  estimate,
  salaryLabel,
}: EstimateSummaryCardProps) {
  return (
    <article className="px-1 py-6 sm:px-5">
      <div className="space-y-4">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="grid gap-3">
          <EstimateRow label={salaryLabel} value={formatCurrency(estimate.monthlySalary)} strong />
          <EstimateRow label="Årslønn" value={formatCurrency(estimate.annualSalary)} />
          <EstimateRow label="Timelønn" value={formatCurrency(estimate.hourlySalary)} />
          <EstimateRow label="Daglønn (7,5 t)" value={formatCurrency(estimate.dailySalary)} />
          <EstimateRow label="Skatt per måned" tone="negative" value={formatCurrency(estimate.monthlyTax)} />
          <EstimateRow label="Netto per måned" tone="positive" value={formatCurrency(estimate.netMonthlySalary)} strong />
        </div>
      </div>
    </article>
  );
}

type EstimateHolidayCardProps = {
  title: string;
  estimate: ReturnType<typeof buildEstimate>;
};

function EstimateHolidayCard({ title, estimate }: EstimateHolidayCardProps) {
  return (
    <article className="px-1 py-6 sm:px-5">
      <div className="space-y-5">
        <div className="space-y-1 text-center">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-sm font-medium text-amber-800">
            {HOLIDAY_PAY_RATE.toLocaleString("nb-NO")} % feriepengesats | {VACATION_WEEKS.toLocaleString("nb-NO")} uker
          </p>
        </div>

        <div className="space-y-3 border-b border-black/10 pb-4">
          <EstimateRow label="Årslønn (brutto)" value={formatCurrency(estimate.annualSalary)} />
          <EstimateRow label="Feriepengegrunnlag" value={formatCurrency(estimate.holidayPayBasis)} strong />
          <EstimateRow label="Ferietrekk" tone="negative" value={formatCurrency(estimate.holidayDeduction)} />
        </div>

        <div className="space-y-3">
          <EstimateRow
            label="Estimerte feriepenger"
            tone="positive"
            value={formatCurrency(estimate.estimatedHolidayPay)}
            strong
          />
          <EstimateRow label="Til utbetaling i juni" value={formatCurrency(estimate.junePayout)} strong />
        </div>

        <p className="text-xs leading-6 text-slate-700">
          Forenklet estimat basert på årslønn i 100 % stilling minus ferietrekk. Faktiske feriepenger
          beregnes ut fra lønn som er opptjent året før.
        </p>
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
      <span className={`${strong ? "text-base" : "text-sm"} font-semibold ${toneClassName}`}>
        {tone === "negative" ? "- " : ""}
        {value}
      </span>
    </div>
  );
}

type UserAgeInsight = {
  userAge: number;
  referenceAge: number;
  difference: number;
  label: string;
  detail: string;
  periodLabel: string;
};

type UserAgeSectionProps = {
  insight: UserAgeInsight;
};

function UserAgeSection({ insight }: UserAgeSectionProps) {
  const tone = insight.difference > 0 ? "negative" : insight.difference < 0 ? "positive" : "default";
  const accentClassName =
    tone === "positive"
      ? "border-emerald-500"
      : tone === "negative"
        ? "border-red-500"
        : "border-slate-300";
  const headlineClassName =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-slate-950";

  return (
    <div className="grid gap-4">
      <div className={`border-x-4 px-5 py-1 text-center ${accentClassName}`}>
        <p className={`text-2xl font-semibold tracking-[-0.03em] ${headlineClassName}`}>
          {insight.label}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{insight.detail}</p>
      </div>

      <div className="grid divide-y divide-[#e6ebf2] border-y border-[#e6ebf2] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <ReportCard
          detail="Alderen du la inn"
          label="Din alder"
          value={`${insight.userAge} år`}
        />
        <ReportCard
          detail={`Siste tilgjengelige periode: ${insight.periodLabel}`}
          label="Snittalder i yrket"
          value={`${insight.referenceAge.toLocaleString("nb-NO", {
            maximumFractionDigits: 0,
          })} år`}
        />
      </div>
    </div>
  );
}

function flattenOccupationOptions(data: LonnsjekkPageData) {
  return [...data.options].sort((left, right) =>
    left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO"),
  );
}

function filterOccupationOptions(
  options: LonnsjekkPageData["options"],
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

function getLastTenYearsPurchasingPowerSeries(
  series: OccupationPurchasingPowerTimeSeries,
): OccupationPurchasingPowerTimeSeries {
  const pointsWithRealGrowth = series.points.filter((point) =>
    [point.realGrowthAll, point.realGrowthWomen, point.realGrowthMen].some((value) =>
      Number.isFinite(value),
    ),
  );
  const pointsWithYears = pointsWithRealGrowth.map((point) => ({
    point,
    year: extractYearFromPeriod(point.periodCode) ?? extractYearFromPeriod(point.periodLabel),
  }));
  const availableYears = pointsWithYears
    .map((entry) => entry.year)
    .filter((year): year is number => year !== null);
  const latestYear = availableYears.length > 0 ? Math.max(...availableYears) : null;

  if (latestYear === null) {
    return {
      ...series,
      points: pointsWithRealGrowth.slice(-40),
    };
  }

  const firstYear = latestYear - 9;

  return {
    ...series,
    points: pointsWithYears
      .filter((entry) => entry.year !== null && entry.year >= firstYear)
      .map((entry) => entry.point),
  };
}

function extractYearFromPeriod(value: string) {
  const match = value.match(/(20\d{2})/);
  return match ? Number(match[1]) : null;
}

function getLatestRealWageGrowth(
  series: OccupationPurchasingPowerTimeSeries,
  gender: LonnsjekkKjonn,
) {
  const points = [...series.points].reverse();

  for (const point of points) {
    const value = gender === "mann"
      ? point.realGrowthMen ?? point.realGrowthAll
      : point.realGrowthWomen ?? point.realGrowthAll;
    const year = extractYearFromPeriod(point.periodCode) ?? extractYearFromPeriod(point.periodLabel);

    if (value !== undefined && year !== null) {
      return { value, year, previousYear: year - 1 };
    }
  }

  return null;
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

function formatInteger(value: number) {
  return value.toLocaleString("nb-NO", { maximumFractionDigits: 0 });
}

function formatReportDate(date: Date) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
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
  const dailySalary = annualSalary / WORK_DAYS_PER_YEAR;
  const annualTax = annualSalary * (ESTIMATED_TAX_RATE / 100);
  const monthlyTax = annualTax / 12;
  const netMonthlySalary = monthlySalary - monthlyTax;
  const holidayDeduction = dailySalary * VACATION_DAYS;
  const holidayPayBasis = annualSalary - holidayDeduction;
  const estimatedHolidayPay = holidayPayBasis * (HOLIDAY_PAY_RATE / 100);
  const junePayout = monthlySalary + estimatedHolidayPay - holidayDeduction;

  return {
    monthlySalary,
    annualSalary,
    hourlySalary,
    dailySalary,
    monthlyTax,
    netMonthlySalary,
    holidayPayBasis,
    holidayDeduction,
    estimatedHolidayPay,
    junePayout,
  };
}

function formatDecimal(value: number) {
  return value.toLocaleString("nb-NO", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 2,
  });
}

function buildUserAgeInsight({
  age,
  ageInsight,
  gender,
}: {
  age: number;
  ageInsight: OccupationAgeLatest;
  gender: LonnsjekkKjonn;
}) {
  const referenceAge =
    gender === "kvinne"
      ? ageInsight.averageWomen
      : ageInsight.averageMen;

  if (referenceAge === undefined) {
    return null;
  }

  const roundedReferenceAge = Math.round(referenceAge);
  const difference = age - roundedReferenceAge;
  const direction =
    difference > 0 ? "eldre enn" : difference < 0 ? "yngre enn" : "på samme nivå som";
  const label =
    difference > 0
      ? `${Math.abs(difference).toLocaleString("nb-NO", {
          maximumFractionDigits: 0,
        })} år eldre`
      : difference < 0
        ? `${Math.abs(difference).toLocaleString("nb-NO", {
            maximumFractionDigits: 0,
          })} år yngre`
        : "På samme nivå";

  return {
    userAge: age,
    referenceAge: roundedReferenceAge,
    difference,
    label,
    detail: `Du er ${direction} snittet for ${gender === "kvinne" ? "kvinner" : "menn"} i yrket.`,
    periodLabel: formatPeriodLabel(ageInsight.periodLabel),
  };
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

function ShieldCheckIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M12 3 19 6v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function StatisticsIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M5 19v-5h3v5M10.5 19V9h3v10M16 19V5h3v14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="m5 10 5-4 4 2 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="m13.5 2-8 12h6L10.5 22l8-12h-6l1-8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19v-1.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <path d="M15 5.5a3 3 0 0 1 0 5.8M17 13.5a4.5 4.5 0 0 1 3.5 4.4V19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function SalaryCheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full max-w-[19rem]"
      fill="none"
      viewBox="0 0 320 210"
    >
      <defs>
        <linearGradient id="salary-card" x1="105" y1="36" x2="245" y2="178" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7F8FF" />
          <stop offset="1" stopColor="#E4E8FF" />
        </linearGradient>
        <linearGradient id="salary-lens" x1="49" y1="79" x2="142" y2="166" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BAC6FF" />
          <stop offset="0.5" stopColor="#7583D5" />
          <stop offset="1" stopColor="#4D568F" />
        </linearGradient>
        <linearGradient id="salary-handle" x1="107" y1="143" x2="166" y2="199" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7D81D9" />
          <stop offset="1" stopColor="#44447F" />
        </linearGradient>
        <filter id="salary-shadow" x="25" y="16" width="272" height="194" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="12" floodColor="#63709D" floodOpacity="0.2" stdDeviation="9" />
        </filter>
      </defs>
      <circle cx="272" cy="47" r="25" fill="#E9EEF5" opacity="0.85" />
      <g filter="url(#salary-shadow)">
        <path d="M113 36h139c10 0 17 8 16 18l-13 111c-1 9-8 15-17 15H99c-10 0-18-9-16-19L96 51c1-9 8-15 17-15Z" fill="url(#salary-card)" />
        <path d="M113 36h139c10 0 17 8 16 18l-13 111c-1 9-8 15-17 15H99c-10 0-18-9-16-19L96 51c1-9 8-15 17-15Z" stroke="#CED5F2" strokeWidth="2" />
        <rect x="119" y="56" width="35" height="7" rx="3.5" fill="#D9DFF6" />
        <rect x="119" y="76" width="49" height="7" rx="3.5" fill="#93DACA" />
        <rect x="122" y="139" width="18" height="24" rx="4" fill="#C9D5FF" />
        <rect x="151" y="124" width="18" height="39" rx="4" fill="#C9D5FF" />
        <rect x="180" y="117" width="18" height="46" rx="4" fill="#C9D5FF" />
        <rect x="209" y="101" width="18" height="62" rx="4" fill="#C9D5FF" />
        <path d="m113 122 26-19 27 11 31-28 29 8 23-25" stroke="#57C69A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
        <circle cx="249" cy="69" r="6" fill="#57C69A" />
      </g>
      <g filter="url(#salary-shadow)">
        <circle cx="91" cy="118" r="47" fill="white" fillOpacity="0.56" stroke="url(#salary-lens)" strokeWidth="9" />
        <circle cx="91" cy="118" r="36" fill="#F8FCFF" fillOpacity="0.58" />
        <path d="m124 153 40 39" stroke="url(#salary-handle)" strokeLinecap="round" strokeWidth="20" />
        <path d="m119 148 13 13" stroke="#646BA8" strokeLinecap="round" strokeWidth="12" />
      </g>
    </svg>
  );
}
