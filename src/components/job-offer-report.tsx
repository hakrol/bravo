"use client";

import { useState } from "react";
import type { JobOfferReport } from "@/lib/job-offer";

type JobOfferReportViewProps = {
  report: JobOfferReport;
  onEdit: () => void;
  onRestart: () => void;
};

const assessmentTone = {
  "clearly-below": "border-rose-200 bg-rose-50 text-rose-800",
  below: "border-amber-200 bg-amber-50 text-amber-800",
  within: "border-emerald-200 bg-emerald-50 text-emerald-800",
  upper: "border-sky-200 bg-sky-50 text-sky-800",
  above: "border-indigo-200 bg-indigo-50 text-indigo-800",
} as const;

export function JobOfferReportView({
  report,
  onEdit,
  onRestart,
}: JobOfferReportViewProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  async function copyNegotiationText() {
    try {
      await navigator.clipboard.writeText(report.negotiationText);
      setCopyStatus("Forslaget er kopiert.");
    } catch {
      setCopyStatus("Kunne ikke kopiere teksten akkurat nå.");
    }
  }

  return (
    <article className="job-offer-report overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.10)]">
      <header className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.14),transparent_34%),linear-gradient(145deg,#f8fafc_0%,#ffffff_58%,#f0fdf4_100%)] px-6 py-9 sm:px-10 sm:py-12">
        <div className="relative mx-auto max-w-4xl text-center">
          <div
            className={`mx-auto w-fit rounded-full border px-4 py-2 text-sm font-bold ${assessmentTone[report.assessment]}`}
          >
            {report.assessmentLabel}
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
            Din vurdering av jobbtilbudet
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {report.headline}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
            {report.summary}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 print:hidden">
            <button
              className="rounded-[8px] bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              onClick={() => window.print()}
              type="button"
            >
              Skriv ut rapporten
            </button>
            <button
              className="rounded-[8px] border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              onClick={onEdit}
              type="button"
            >
              Endre svar
            </button>
          </div>
        </div>
      </header>

      <section className="px-6 py-9 sm:px-10 sm:py-12">
        <SectionHeading eyebrow="Kort fortalt" title="Tilbudet målt mot markedet" />

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <MetricCard
            detail="Fast avtalt årslønn i tilbudet"
            label="Jobbtilbudet"
            value={formatCurrency(report.input.annualSalary)}
          />
          <MetricCard
            detail={`Offisiell statistikk for ${report.official.periodLabel ?? "siste tilgjengelige periode"}`}
            label="SSB-median"
            value={formatOptionalCurrency(report.official.median)}
          />
          <MetricCard
            accent
            detail={`Anslag etter ${report.input.relevantExperienceYears} års erfaring og ansvar`}
            label="Estimert intervall"
            value={`${formatCurrency(report.estimate.lowerSalary)}–${formatCurrency(report.estimate.upperSalary)}`}
          />
        </div>

        <div className="mt-9 rounded-[16px] border border-slate-200 bg-slate-50/80 p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Din plassering</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Det grønne feltet er vårt estimerte sammenligningsområde. Markøren viser tilbudet.
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
              {formatCurrency(report.input.annualSalary)}
            </span>
          </div>
          <OfferRangeBar report={report} />
        </div>

        {report.currentSalaryComparison ? (
          <div className="mt-5 rounded-[12px] border border-indigo-100 bg-indigo-50/70 px-5 py-4 text-sm leading-7 text-indigo-950">
            Tilbudet er{" "}
            <strong>{formatSignedCurrency(report.currentSalaryComparison.difference)}</strong>, eller{" "}
            <strong>{formatSignedPercent(report.currentSalaryComparison.differencePercent)}</strong>, sammenlignet med lønnen du har i dag.
          </div>
        ) : null}
      </section>

      <section className="border-t border-slate-200 bg-slate-50/45 px-6 py-9 sm:px-10 sm:py-12">
        <SectionHeading
          eyebrow="Åpen beregning"
          title="Slik har vi laget anslaget"
          description="SSB-tallene er offisiell statistikk. Justeringen for erfaring og ansvar er Lønnsinnsikts beregningsmodell."
        />

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          <ExplanationCard
            badge="SSB"
            title="Lønnsfordelingen"
            text={buildOfficialText(report)}
          />
          <ExplanationCard
            badge={`P${report.experience.baseLowerPercentile}–P${report.experience.baseUpperPercentile}`}
            title={report.experience.label}
            text={report.experience.explanation}
          />
          <ExplanationCard
            badge={
              report.leadership.percentileShift > 0
                ? `+${report.leadership.percentileShift} prosentilpoeng`
                : "Ingen ekstra justering"
            }
            title={report.leadership.label}
            text={report.leadership.explanation}
          />
        </div>

        <div
          className={`mt-5 rounded-[12px] border px-5 py-4 ${
            report.confidence.level === "medium"
              ? "border-sky-200 bg-sky-50 text-sky-950"
              : "border-amber-200 bg-amber-50 text-amber-950"
          }`}
        >
          <p className="font-semibold">{report.confidence.label}</p>
          <p className="mt-1 text-sm leading-6">{report.confidence.explanation}</p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-emerald-950 px-6 py-9 text-white sm:px-10 sm:py-12">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">
          Forslag til formulering
        </p>
        <blockquote className="mt-4 max-w-4xl text-xl font-medium leading-9 tracking-[-0.02em] sm:text-2xl sm:leading-10">
          «{report.negotiationText}»
        </blockquote>
        <button
          className="mt-6 rounded-[8px] bg-white px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50 print:hidden"
          onClick={() => void copyNegotiationText()}
          type="button"
        >
          Kopier formuleringen
        </button>
        {copyStatus ? (
          <p aria-live="polite" className="mt-2 text-sm text-emerald-100">
            {copyStatus}
          </p>
        ) : null}
      </section>

      <section className="border-t border-slate-200 px-6 py-9 sm:px-10 sm:py-12">
        <SectionHeading
          eyebrow="Før du svarer"
          title="Dette bør du avklare"
          description="Fastlønnen er bare én del av jobbtilbudet."
        />
        <ul className="mt-7 grid gap-3 md:grid-cols-2">
          {report.checklist.map((item) => (
            <li
              className="flex gap-3 rounded-[12px] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"
              key={item}
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800"
              >
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-7 sm:px-10">
        <p className="text-xs leading-6 text-slate-600">
          Vurderingen er veiledende. Offisielle lønnstall kommer fra SSB, mens erfaring og ansvar er beregningsanslag fra Lønnsinnsikt. Faktisk lønn påvirkes også av blant annet sektor, virksomhet, sted, utdanning, resultater og den samlede kompensasjonspakken.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 print:hidden">
          <button
            className="text-sm font-semibold text-emerald-900 underline decoration-emerald-900/30 underline-offset-4"
            onClick={onEdit}
            type="button"
          >
            Endre svarene
          </button>
          <button
            className="text-sm font-semibold text-slate-700 underline decoration-slate-400 underline-offset-4"
            onClick={onRestart}
            type="button"
          >
            Vurder et nytt tilbud
          </button>
        </div>
      </footer>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-800">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[14px] border p-5 ${
        accent
          ? "border-emerald-200 bg-emerald-50/80"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
}

function ExplanationCard({
  badge,
  title,
  text,
}: {
  badge: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[14px] border border-slate-200 bg-white p-5">
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
        {badge}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function OfferRangeBar({ report }: { report: JobOfferReport }) {
  const values = [
    report.official.p25,
    report.estimate.lowerSalary,
    report.input.annualSalary,
    report.estimate.upperSalary,
    report.official.p75,
  ].filter((value): value is number => value !== undefined);
  const min = Math.min(...values) * 0.94;
  const max = Math.max(...values) * 1.06;
  const position = (value: number) =>
    Math.max(2, Math.min(98, ((value - min) / (max - min)) * 100));
  const lowerPosition = position(report.estimate.lowerSalary);
  const upperPosition = position(report.estimate.upperSalary);
  const offerPosition = position(report.input.annualSalary);

  return (
    <div className="mt-10 pb-2 pt-6">
      <div className="relative h-4 rounded-full bg-slate-200">
        <div
          className="absolute top-0 h-4 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-600"
          style={{
            left: `${lowerPosition}%`,
            width: `${Math.max(upperPosition - lowerPosition, 2)}%`,
          }}
        />
        <div
          className="absolute top-1/2 h-8 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-700 shadow-[0_0_0_4px_white]"
          style={{ left: `${offerPosition}%` }}
        >
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-indigo-800">
            Tilbudet
          </span>
        </div>
      </div>
      <div className="mt-3 flex justify-between gap-4 text-xs font-semibold text-slate-600">
        <span>{formatCurrency(report.estimate.lowerSalary)}</span>
        <span>{formatCurrency(report.estimate.upperSalary)}</span>
      </div>
    </div>
  );
}

function buildOfficialText(report: JobOfferReport) {
  if (
    report.official.p25 !== undefined &&
    report.official.median !== undefined &&
    report.official.p75 !== undefined
  ) {
    return `Den midtre halvparten av lønningene ligger mellom ${formatCurrency(report.official.p25)} og ${formatCurrency(report.official.p75)}. Medianen er ${formatCurrency(report.official.median)}.`;
  }

  return `Medianen er ${formatOptionalCurrency(report.official.median)}. SSB har ikke en komplett kvartilfordeling for dette yrket, så intervallet har lavere sikkerhet.`;
}

function formatOptionalCurrency(value?: number) {
  return value === undefined ? "Mangler data" : formatCurrency(value);
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
}

function formatSignedCurrency(value: number) {
  if (value === 0) {
    return "Ingen forskjell";
  }

  return `${value > 0 ? "+" : "−"}${formatCurrency(Math.abs(value))}`;
}

function formatSignedPercent(value: number) {
  const prefix = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${prefix}${Math.abs(value).toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}
