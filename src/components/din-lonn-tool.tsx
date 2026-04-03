"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OccupationSalaryDistributionSection } from "@/components/occupation-salary-distribution";
import {
  buildDinLonnReport,
  type DinLonnKjonn,
  type DinLonnPageData,
} from "@/lib/din-lonn";
import type { OccupationSalaryDistribution } from "@/lib/ssb";

type DinLonnToolProps = {
  data: DinLonnPageData;
};

type FormState = {
  salary: string;
  gender: DinLonnKjonn;
  occupationCode: string;
};

const initialFormState: FormState = {
  salary: "",
  gender: "kvinne",
  occupationCode: "",
};

export function DinLonnTool({ data }: DinLonnToolProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitted, setSubmitted] = useState<FormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [distribution, setDistribution] = useState<OccupationSalaryDistribution | null>(null);
  const [distributionError, setDistributionError] = useState<string | null>(null);
  const [isDistributionLoading, setIsDistributionLoading] = useState(false);

  const parsedSalary = submitted ? parseSalary(submitted.salary) : undefined;
  const report =
    submitted && parsedSalary !== undefined
      ? buildDinLonnReport({
          salary: parsedSalary,
          gender: submitted.gender,
          occupationCode: submitted.occupationCode,
          data,
        })
      : null;
  const optionsByGroup = groupOptions(data);
  const activeDistributionRow = submitted?.gender === "mann" ? "men" : "women";

  useEffect(() => {
    const submittedOccupationCode = submitted?.occupationCode;

    if (!submittedOccupationCode) {
      setDistribution(null);
      setDistributionError(null);
      setIsDistributionLoading(false);
      return;
    }

    const occupationCode = submittedOccupationCode;

    const controller = new AbortController();

    async function loadDistribution() {
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const salary = parseSalary(form.salary);

    if (salary === undefined || salary <= 0) {
      setError("Legg inn en gyldig brutto månedslønn.");
      return;
    }

    if (!form.occupationCode) {
      setError("Velg et yrke før du sjekker lønnen.");
      return;
    }

    setError(null);
    setSubmitted(form);
  }

  return (
    <div className="grid gap-8">
      <section className="fade-up overflow-hidden rounded-md border border-black/10 bg-white/85 shadow-[0_18px_60px_rgba(27,36,48,0.08)]">
        <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                Ny tjeneste
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Din lønn
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                Skriv inn brutto månedslønn, kjønn og yrke, og få en enkel rapport som viser om
                du ligger over eller under nivået i yrket.
              </p>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <label className="grid gap-2" htmlFor="salary">
                <span className="text-sm font-semibold text-slate-900">Brutto månedslønn</span>
                <input
                  id="salary"
                  className="h-14 rounded-md border border-black/10 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--accent-soft)]"
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
                <p className="text-sm leading-6 text-[var(--muted)]">
                  SSB-tabellene på denne siden er delt inn i kvinner og menn.
                </p>
              </fieldset>

              <label className="grid gap-2" htmlFor="occupationCode">
                <span className="text-sm font-semibold text-slate-900">Yrke</span>
                <select
                  id="occupationCode"
                  className="min-h-14 rounded-md border border-black/10 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      occupationCode: event.target.value,
                    }))
                  }
                  value={form.occupationCode}
                >
                  <option value="">Velg yrke</option>
                  {optionsByGroup.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map((option) => (
                        <option key={option.occupationCode} value={option.occupationCode}>
                          {option.occupationLabel}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--primary)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                >
                  Sjekk lønn
                </button>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  Rapporten bruker siste tilgjengelige SSB-tall for valgt yrke.
                </p>
              </div>

              {error ? (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </form>
          </div>

          <aside className="rounded-md border border-black/8 bg-[linear-gradient(135deg,rgba(244,239,230,0.85)_0%,rgba(230,240,234,0.92)_100%)] p-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
                Hva du får
              </p>
              <ul className="space-y-3 text-sm leading-7 text-slate-700">
                <li>Du sammenlignes mot median avtalt månedslønn og gjennomsnitt i yrket.</li>
                <li>Du ser hvordan lønnen din står seg mot hele arbeidsmarkedet.</li>
                <li>Du får et raskt bilde av hvor høyt yrket ligger på lønnsskalaen.</li>
              </ul>
              <div className="rounded-md border border-white/70 bg-white/70 p-4">
                <p className="text-sm text-slate-700">
                  Tallgrunnlag:
                  {" "}
                  {data.periodLabel ?? "Siste periode"}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Antall yrker i sammenligningen:
                  {" "}
                  {data.totalOccupations.toLocaleString("nb-NO")}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {report ? (
        <section className="fade-up-delay grid gap-6">
          <div className="rounded-md border border-black/10 bg-[var(--surface)] px-6 py-8 shadow-sm sm:px-8">
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
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-[var(--primary)] hover:text-[var(--primary-strong)]"
                  href={report.occupation.href}
                >
                  Se detaljside for {report.occupation.occupationLabel.toLowerCase()}
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

          <section className="rounded-md border border-black/10 bg-white px-6 py-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-950">Plassering i lønnsfordelingen</h3>
              <p className="text-sm leading-6 text-slate-600">
                Her ser du hvor lønnen din ligger sammenlignet med 25-persentilen,
                median avtalt månedslønn og 75-persentilen i yrket.
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

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-md border border-black/10 bg-white px-6 py-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-950">Slik står du i forhold til tallene</h3>
              <div className="mt-5 grid gap-4">
                <InsightRow
                  label="Mot median avtalt månedslønn i yrket"
                  value={formatDifference(report.comparisonToMedian.difference)}
                  detail={formatPercent(report.comparisonToMedian.differencePercent)}
                />
                <InsightRow
                  label="Mot yrkesgjennomsnitt"
                  value={formatDifference(report.comparisonToAverage.difference)}
                  detail={formatPercent(report.comparisonToAverage.differencePercent)}
                />
                <InsightRow
                  label="Mot alle yrker"
                  value={formatDifference(report.comparisonToNationalAverage.difference)}
                  detail={formatPercent(report.comparisonToNationalAverage.differencePercent)}
                />
                <InsightRow
                  label="Plassering for yrket"
                  value={`${report.occupationPlacement.rank}. plass av ${report.occupationPlacement.total}`}
                  detail={report.occupationPlacement.label}
                />
              </div>
            </section>

            <section className="rounded-md border border-black/10 bg-[#fcfaf6] px-6 py-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-950">Interessante fakta</h3>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                <p>
                  <span className="font-semibold text-slate-950">{report.occupation.occupationLabel}</span>
                  {" "}
                  ligger i
                  {" "}
                  {formatTopPercent(report.occupationPlacement.percentile)}
                  {" "}
                  av yrkene når vi rangerer etter gjennomsnittlig avtalt månedslønn.
                </p>
                {report.genderGap ? (
                  <p>
                    {report.genderGap.label}
                    {" "}
                    Forskjellen er
                    {" "}
                    {formatCurrency(report.genderGap.difference)}
                    {" "}
                    (
                    {formatPercent(report.genderGap.differencePercent)}
                    ).
                  </p>
                ) : (
                  <p>Det finnes ikke nok kjønnsdelte tall for median avtalt månedslønn til å vise et tydelig gap i yrket.</p>
                )}
                <p>
                  Datagrunnlaget gjelder
                  {" "}
                  {report.periodLabel?.toLowerCase() ?? "siste tilgjengelige periode"}
                  {" "}
                  og viser brutto månedslønn før skatt.
                </p>
              </div>
            </section>
          </div>
        </section>
      ) : null}
    </div>
  );
}

type GenderButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
  type: "button";
};

function GenderButton({ active, label, onClick, type }: GenderButtonProps) {
  return (
    <button
      className={[
        "inline-flex h-12 items-center justify-center rounded-full border px-4 text-sm font-semibold transition",
        active
          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
          : "border-black/10 bg-white text-slate-800 hover:border-[var(--primary)]/35 hover:text-[var(--primary-strong)]",
      ].join(" ")}
      onClick={onClick}
      type={type}
    >
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
    <article className="rounded-md border border-black/10 bg-white px-6 py-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-[-0.04em] ${valueClassName}`}>{value}</p>
      {detail ? <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p> : null}
    </article>
  );
}

type InsightRowProps = {
  label: string;
  value: string;
  detail?: string;
};

function InsightRow({ label, value, detail }: InsightRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-4 last:border-b-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {detail ? <p className="text-sm leading-6 text-slate-600">{detail}</p> : null}
      </div>
      <p className="shrink-0 text-right text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function groupOptions(data: DinLonnPageData) {
  const groups = data.options.reduce(
    (map, option) => {
      const existing = map.get(option.groupLabel) ?? [];
      existing.push(option);
      map.set(option.groupLabel, existing);
      return map;
    },
    new Map<string, DinLonnPageData["options"]>(),
  );

  return Array.from(groups.entries())
    .map(([label, options]) => ({
      label,
      options,
    }))
    .sort((left, right) => left.label.localeCompare(right.label, "nb-NO"));
}

function parseSalary(value: string) {
  const normalized = value.replace(/\s+/g, "").replace(",", ".");

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
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
