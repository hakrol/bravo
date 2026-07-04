"use client";

import Link from "next/link";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import { MetricInfoButton } from "@/components/metric-info-button";
import { getOccupationGroupGradient } from "@/lib/occupation-group-colors";
import type {
  OccupationSectorSalaryGapHistoryPoint,
  OccupationSectorSalaryGapRanking as OccupationSectorSalaryGapRankingData,
  OccupationSectorSalaryGapRow,
} from "@/lib/occupation-sector-salary-gap-ranking";

type OccupationSectorSalaryGapRankingProps = {
  data: OccupationSectorSalaryGapRankingData;
};

type IconName = "salary" | "gap" | "external" | "chevron" | "growth" | "people" | "age" | "sector";

export function OccupationSectorSalaryGapRanking({
  data,
}: OccupationSectorSalaryGapRankingProps) {
  const [openCode, setOpenCode] = useState<string | null>(data.rows[0]?.occupationCode ?? null);

  const toggleRow = (occupationCode: string) => {
    setOpenCode((current) => (current === occupationCode ? null : occupationCode));
  };

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    occupationCode: string,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    toggleRow(occupationCode);
  };

  return (
    <section className="grid gap-4" aria-label="Lønnsforskjell mellom offentlig og privat sektor etter yrke">
      {data.rows.map((row) => {
        const open = openCode === row.occupationCode;
        const cardGradient = getOccupationGroupGradient(row.occupationCode);
        const detailsId = `sector-salary-gap-details-${row.occupationCode}`;

        return (
          <article
            key={row.occupationCode}
            aria-controls={detailsId}
            aria-expanded={open}
            aria-label={`${open ? "Lukk detaljer for" : "Åpne detaljer for"} ${row.occupationLabel}`}
            className="group cursor-pointer overflow-hidden rounded-[5px] border border-slate-200 bg-white shadow-[0_18px_46px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)]/35 hover:shadow-[0_24px_56px_rgba(15,23,42,0.11)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary-strong)]"
            role="button"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.96) 34%, #ffffff 100%), ${cardGradient}`,
            }}
            tabIndex={0}
            onClick={() => toggleRow(row.occupationCode)}
            onKeyDown={(event) => handleCardKeyDown(event, row.occupationCode)}
          >
            <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,34rem)_2.5rem] lg:items-center">
              <div className="flex min-w-0 items-start gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-slate-950 shadow-sm"
                  style={{ backgroundImage: cardGradient }}
                >
                  {row.rank}
                </span>
                <div className="min-w-0">
                  <h2 className="text-balance text-xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-2xl">
                    {row.occupationLabel}
                  </h2>
                  <Link
                    className="mt-2 inline-flex text-sm font-semibold text-[var(--primary-strong)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
                    href={row.occupationGroupHref}
                    onClick={(event) => event.stopPropagation()}
                  >
                    Yrkesgruppe: {row.occupationGroupLabel}
                  </Link>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {getGapDirectionText(row)}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-left sm:grid-cols-2">
                <span className="sr-only">
                  {open ? "Lukk detaljer for" : "Åpne detaljer for"} {row.occupationLabel}
                </span>
                <Metric
                  icon="gap"
                  label="Største forskjell"
                  value={formatPercent(row.topComparison.gapPercent)}
                  prominent
                />
                <Metric
                  icon="salary"
                  label="Lønnsforskjell"
                  value={formatMoney(row.topComparison.gapAmount)}
                  prominent
                />
              </div>

              <span
                aria-hidden="true"
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition duration-200 group-hover:border-[var(--primary)]/40 group-hover:bg-slate-50 group-hover:text-[var(--primary-strong)]",
                  open ? "rotate-180 bg-white/80" : "bg-white",
                ].join(" ")}
              >
                <Icon name="chevron" />
              </span>
            </div>

            {open ? <ExpandedSectorSalaryGap detailsId={detailsId} row={row} /> : null}
          </article>
        );
      })}
    </section>
  );
}

function ExpandedSectorSalaryGap({
  detailsId,
  row,
}: {
  detailsId: string;
  row: OccupationSectorSalaryGapRow;
}) {
  return (
    <div id={detailsId} className="border-t border-slate-200 bg-white/72 px-5 py-5 sm:px-6">
      <div className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-stretch">
          <SectorSalaryGapHistoryChart
            history={row.topComparison.history}
            publicSectorLabel={row.topComparison.publicSectorLabel}
          />

          <dl className="grid gap-3">
            <DetailMetric
              icon="salary"
              label="Privat median"
              value={formatMoney(row.privateMedianMonthlySalary)}
              supportingText={formatWorkRelationCount(row.privateWorkRelationCount)}
            />
            {row.municipalMedianMonthlySalary !== undefined ? (
              <DetailMetric
                icon="sector"
                label="Kommune median"
                value={formatMoney(row.municipalMedianMonthlySalary)}
                supportingText={formatWorkRelationCount(row.municipalWorkRelationCount)}
              />
            ) : null}
            {row.stateMedianMonthlySalary !== undefined ? (
              <DetailMetric
                icon="sector"
                label="Stat median"
                value={formatMoney(row.stateMedianMonthlySalary)}
                supportingText={formatWorkRelationCount(row.stateWorkRelationCount)}
              />
            ) : null}
            <DetailMetric
              icon="growth"
              label="Lønnsvekst"
              value={formatSignedPercent(row.salaryGrowthPercent)}
            />
            <DetailMetric
              icon="people"
              label="Arbeidstakervekst"
              value={formatSignedPercent(row.employeeGrowthPercent)}
            />
            <DetailMetric icon="age" label="Snittalder" value={formatAge(row.averageAge)} />
          </dl>
        </div>

        {row.comparisons.length > 1 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {row.comparisons.map((comparison) => (
              <div
                key={comparison.publicSectorKey}
                className="rounded-[5px] border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {comparison.publicSectorLabel} mot privat
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {formatPercent(comparison.gapPercent)} / {formatMoney(comparison.gapAmount)}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {getComparisonDirectionText(comparison.publicSectorLabel, comparison.highestPaidSector)}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {row.href ? (
            <Link
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[5px] bg-[var(--primary-strong)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)] sm:w-auto"
              href={row.href}
              onClick={(event) => event.stopPropagation()}
            >
              <Icon name="external" />
              Gå til yrke
            </Link>
          ) : null}
          <span
            className="inline-flex justify-center sm:justify-start"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <MetricInfoButton
              description={<SectorSalaryGapInfoContent />}
              label="Lønnsforskjell"
            />
          </span>
        </div>
      </div>
    </div>
  );
}

function SectorSalaryGapInfoContent() {
  return (
    <div className="space-y-4">
      <p>
        Tallene kommer fra Statistisk sentralbyrå tabell 11418. Vi sammenligner
        median månedslønn i privat sektor og offentlig eide foretak med
        kommuneforvaltningen og statsforvaltningen for samme yrke.
      </p>

      <FormulaBox title="1. Yrket må ha privat lønn">
        <p>Yrket tas bare med hvis SSB har publisert medianlønn for privat sektor.</p>
      </FormulaBox>

      <FormulaBox title="2. Yrket må ha offentlig lønn">
        <p>Yrket må også ha publisert medianlønn for kommune, stat eller begge deler.</p>
        <p className="text-slate-600">Hvis begge finnes, regnes forskjellen på begge nivåer.</p>
      </FormulaBox>

      <FormulaBox title="3. Regn ut forskjellen">
        <p>Offentlig medianlønn minus privat medianlønn.</p>
        <p className="text-slate-600">
          Prosenten viser forskjellen relativt til privat medianlønn.
        </p>
      </FormulaBox>

      <p>
        Rangeringen sorteres etter den største prosentvise forskjellen mellom
        privat sektor og et offentlig nivå i yrket.
      </p>
      <p>
        Arbeidsforhold betyr jobber med lønn. Én person kan ha flere
        arbeidsforhold, så tallet er ikke det samme som unike arbeidstakere.
      </p>
    </div>
  );
}

function FormulaBox({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="rounded-[5px] border border-[#d6e2d7] bg-[#f8fbf8] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary-strong)]">
        {title}
      </p>
      <div className="mt-2 space-y-1 break-words font-semibold leading-6 text-slate-950">
        {children}
      </div>
    </div>
  );
}

function SectorSalaryGapHistoryChart({
  history,
  publicSectorLabel,
}: {
  history: OccupationSectorSalaryGapHistoryPoint[];
  publicSectorLabel: string;
}) {
  const chartHistory = history.filter(
    (point): point is OccupationSectorSalaryGapHistoryPoint & { gapPercent: number } =>
      point.gapPercent !== undefined,
  );

  if (chartHistory.length < 2) {
    return null;
  }

  const chartWidth = 620;
  const chartHeight = 156;
  const paddingLeft = 42;
  const paddingRight = 20;
  const paddingTop = 18;
  const axisY = chartHeight - 28;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = axisY - paddingTop;
  const maxGap = Math.max(...chartHistory.map((point) => point.gapPercent));
  const chartMax = Math.max(5, Math.ceil(maxGap / 5) * 5);
  const coordinates = chartHistory.map((point, index) => {
    const x =
      paddingLeft + (chartHistory.length === 1 ? 0 : (plotWidth / (chartHistory.length - 1)) * index);
    const y = axisY - (point.gapPercent / chartMax) * plotHeight;

    return { ...point, x, y };
  });
  const linePath = coordinates
    .reduce<string[]>((segments, point) => {
      segments.push(`${segments.length === 0 ? "M" : "L"} ${point.x} ${point.y}`);
      return segments;
    }, [])
    .join(" ");

  return (
    <section
      aria-label={`Årlig utvikling i lønnsforskjell mellom privat og ${publicSectorLabel.toLowerCase()}`}
      className="flex h-full flex-col rounded-[5px] bg-slate-50 px-4 py-4"
    >
      <div>
        <h3 className="text-base font-semibold text-slate-950">
          Utvikling mot {publicSectorLabel.toLowerCase()}
        </h3>
      </div>

      <div className="mt-3 flex flex-1 items-center overflow-x-auto">
        <svg
          aria-hidden="true"
          className="min-w-[420px]"
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          <line
            stroke="rgba(15, 23, 42, 0.12)"
            x1={paddingLeft}
            x2={chartWidth - paddingRight}
            y1={axisY}
            y2={axisY}
          />

          <path d={linePath} fill="none" stroke="var(--primary-strong)" strokeWidth="4" />

          {coordinates.map((point) => (
            <g key={point.periodLabel}>
              <circle
                cx={point.x}
                cy={point.y}
                fill="white"
                r="4.5"
                stroke="var(--primary-strong)"
                strokeWidth="2.5"
              />
              <text
                fill="#0f172a"
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
                x={point.x}
                y={Math.max(point.y - 9, 12)}
              >
                {formatPercent(point.gapPercent)}
              </text>
              <text fill="#64748b" fontSize="13" textAnchor="middle" x={point.x} y={chartHeight - 8}>
                {point.periodLabel}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  prominent = false,
  value,
}: {
  icon: IconName;
  label: string;
  prominent?: boolean;
  value: string;
}) {
  return (
    <div
      className={[
        "flex min-w-0 items-center gap-3 rounded-[5px] bg-slate-50",
        prominent ? "px-4 py-4" : "px-3 py-2.5",
      ].join(" ")}
    >
      <span
        className={[
          "flex shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm",
          prominent ? "h-11 w-11" : "h-9 w-9",
        ].join(" ")}
      >
        <Icon name={icon} />
      </span>
      <div className="min-w-0">
        <span className="block truncate text-xs font-medium leading-4 text-slate-500">{label}</span>
        <span
          className={[
            "block font-semibold text-slate-950",
            prominent ? "text-2xl leading-8 sm:text-3xl sm:leading-9" : "text-base leading-6",
          ].join(" ")}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function DetailMetric({
  icon,
  label,
  supportingText,
  value,
}: {
  icon: IconName;
  label: string;
  supportingText?: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-[5px] bg-slate-50 px-4 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
        <Icon name={icon} />
      </span>
      <div className="min-w-0">
        <dt className="truncate text-xs font-medium leading-4 text-slate-500">{label}</dt>
        <dd className="text-lg font-semibold leading-7 text-slate-950">{value}</dd>
        {supportingText ? (
          <dd className="mt-0.5 text-xs font-medium leading-5 text-slate-500">{supportingText}</dd>
        ) : null}
      </div>
    </div>
  );
}

function Icon({ name }: { name: IconName }) {
  const commonProps = {
    "aria-hidden": true,
    className: "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (name === "salary") {
    return (
      <svg {...commonProps}>
        <path d="M4 7h16v10H4z" />
        <path d="M8 12h.01" />
        <path d="M16 12h.01" />
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </svg>
    );
  }

  if (name === "gap") {
    return (
      <svg {...commonProps}>
        <path d="M5 19 19 5" />
        <path d="M7.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M16.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </svg>
    );
  }

  if (name === "growth") {
    return (
      <svg {...commonProps}>
        <path d="M4 17 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </svg>
    );
  }

  if (name === "people") {
    return (
      <svg {...commonProps}>
        <path d="M16 19v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <path d="M9.5 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M21 19v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a3 3 0 0 1 0 5.74" />
      </svg>
    );
  }

  if (name === "age") {
    return (
      <svg {...commonProps}>
        <path d="M12 7v5l3 2" />
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }

  if (name === "sector") {
    return (
      <svg {...commonProps}>
        <path d="M4 21h16" />
        <path d="M6 21V9l6-4 6 4v12" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 11h.01" />
        <path d="M15 11h.01" />
      </svg>
    );
  }

  if (name === "external") {
    return (
      <svg {...commonProps}>
        <path d="M7 17 17 7" />
        <path d="M10 7h7v7" />
        <path d="M17 17H7V7" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function getGapDirectionText(row: OccupationSectorSalaryGapRow) {
  const comparison = row.topComparison;
  const sectorLabel = comparison.publicSectorLabel.toLowerCase();

  if (comparison.highestPaidSector === "public") {
    return `${comparison.publicSectorLabel} ligger ${formatPercent(comparison.gapPercent)} over privat sektor.`;
  }

  return `Privat sektor ligger ${formatPercent(comparison.gapPercent)} over ${sectorLabel}.`;
}

function getComparisonDirectionText(publicSectorLabel: string, highestPaidSector: "private" | "public") {
  if (highestPaidSector === "public") {
    return `${publicSectorLabel} ligger høyere enn privat sektor.`;
  }

  return `Privat sektor ligger høyere enn ${publicSectorLabel.toLowerCase()}.`;
}

function formatMoney(value: number) {
  return `${value.toLocaleString("nb-NO")} kr`;
}

function formatPercent(value: number) {
  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function formatSignedPercent(value?: number) {
  if (value === undefined) {
    return "-";
  }

  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatPercent(value)}`;
}

function formatAge(value?: number) {
  if (value === undefined) {
    return "-";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} år`;
}

function formatWorkRelationCount(value?: number) {
  if (value === undefined) {
    return undefined;
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} arbeidsforhold`;
}
