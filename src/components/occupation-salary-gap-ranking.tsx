"use client";

import Link from "next/link";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import { MetricInfoButton } from "@/components/metric-info-button";
import { getOccupationGroupGradient } from "@/lib/occupation-group-colors";
import type {
  OccupationSalaryGapHistoryPoint,
  OccupationSalaryGapRanking as OccupationSalaryGapRankingData,
  OccupationSalaryGapRow,
} from "@/lib/occupation-salary-gap-ranking";

type OccupationSalaryGapRankingProps = {
  data: OccupationSalaryGapRankingData;
};

type IconName = "salary" | "gap" | "external" | "chevron" | "growth" | "people" | "age";

export function OccupationSalaryGapRanking({ data }: OccupationSalaryGapRankingProps) {
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
    <section className="grid gap-4" aria-label="Lønnsforskjell menn og kvinner etter yrke">
      {data.rows.map((row) => {
        const open = openCode === row.occupationCode;
        const cardGradient = getOccupationGroupGradient(row.occupationCode);
        const detailsId = `salary-gap-details-${row.occupationCode}`;

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
                  label="Forskjell i prosent"
                  value={formatPercent(row.gapPercent)}
                  prominent
                />
                <Metric
                  icon="salary"
                  label="Lønnsforskjell"
                  value={formatMoney(row.gapAmount)}
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

            {open ? <ExpandedSalaryGap detailsId={detailsId} row={row} /> : null}
          </article>
        );
      })}
    </section>
  );
}

function ExpandedSalaryGap({
  detailsId,
  row,
}: {
  detailsId: string;
  row: OccupationSalaryGapRow;
}) {
  return (
    <div id={detailsId} className="border-t border-slate-200 bg-white/72 px-5 py-5 sm:px-6">
      <div className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-stretch">
          <SalaryGapHistoryChart history={row.salaryGapHistory} />

          <dl className="grid gap-3">
            <DetailMetric
              icon="salary"
              label="Median menn"
              value={formatMoney(row.menMedianMonthlySalary)}
            />
            <DetailMetric
              icon="salary"
              label="Median kvinner"
              value={formatMoney(row.womenMedianMonthlySalary)}
            />
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
              description={<SalaryGapInfoContent />}
              label="Lønnsforskjell"
            />
          </span>
        </div>
      </div>
    </div>
  );
}

function SalaryGapInfoContent() {
  return (
    <div className="space-y-4">
      <p>
        Tallene kommer fra Statistisk sentralbyrå tabell 11418. Vi sammenligner
        median månedslønn for menn og kvinner i samme yrke. Median betyr at
        halvparten tjener mer og halvparten tjener mindre.
      </p>

      <FormulaBox title="1. Finn forskjellen i kroner">
        <p>Menns medianlønn minus kvinners medianlønn.</p>
        <p className="text-slate-600">Hvis kvinner tjener mest, snur vi regnestykket.</p>
      </FormulaBox>

      <FormulaBox title="2. Gjør forskjellen om til prosent">
        <p>Forskjellen i kroner deles på menns medianlønn.</p>
        <p className="text-slate-600">Deretter ganger vi med 100 for å få prosent.</p>
      </FormulaBox>

      <FormulaBox title="Eksempel fra flygere">
        <p>120 830 kr - 80 620 kr = 40 210 kr</p>
        <p>40 210 kr delt på 120 830 kr = 0,333</p>
        <p>0,333 × 100 = 33,3 %</p>
      </FormulaBox>

      <p>
        Når kortet sier at menn tjener 33,3 % mer enn kvinner, betyr det altså
        at forskjellen tilsvarer 33,3 % av menns medianlønn i yrket. Diagrammet
        bruker samme beregning per år og viser bare år der SSB har komplette tall
        for både menn og kvinner.
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

function SalaryGapHistoryChart({ history }: { history: OccupationSalaryGapHistoryPoint[] }) {
  const chartHistory = history.filter(
    (point): point is OccupationSalaryGapHistoryPoint & { gapPercent: number } =>
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
      if (point.y === undefined) {
        return segments;
      }

      segments.push(`${segments.length === 0 ? "M" : "L"} ${point.x} ${point.y}`);
      return segments;
    }, [])
    .join(" ");

  return (
    <section
      aria-label="Årlig utvikling i lønnsforskjell mellom kvinner og menn"
      className="flex h-full flex-col rounded-[5px] bg-slate-50 px-4 py-4"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            Utvikling i lønnsforskjell
          </h3>
        </div>
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
              <ChartPoint point={point} />
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

function ChartPoint({
  point,
}: {
  point: OccupationSalaryGapHistoryPoint & {
    x: number;
    y?: number;
  };
}) {
  if (point.y === undefined || point.gapPercent === undefined) {
    return null;
  }

  return (
    <>
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
    </>
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

function DetailMetric({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-[5px] bg-slate-50 px-4 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
        <Icon name={icon} />
      </span>
      <div className="min-w-0">
        <dt className="truncate text-xs font-medium leading-4 text-slate-500">{label}</dt>
        <dd className="text-lg font-semibold leading-7 text-slate-950">{value}</dd>
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

function getGapDirectionText(row: OccupationSalaryGapRow) {
  if (row.highestPaidGender === "men") {
    return `Menn tjener ${formatPercent(row.gapPercent)} mer enn kvinner.`;
  }

  return `Kvinner tjener ${formatPercent(row.gapPercent)} mer enn menn.`;
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
