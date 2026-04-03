"use client";

import { useState } from "react";
import Link from "next/link";
import { DataInfoModal } from "@/components/data-info-modal";
import { getOccupationDetailHref } from "@/lib/occupation-detail-pages";
import type { OccupationMedianGrowthRow } from "@/lib/occupation-salary-overview";

type OccupationSalaryOverviewProps = {
  rows: OccupationMedianGrowthRow[];
  lastUpdated?: string;
  showLastUpdated?: boolean;
  periodLabel?: string;
  title?: string;
  description?: string;
  emptyStateText?: string;
};

type SortKey =
  | "occupationLabel"
  | "medianWomen"
  | "medianMen"
  | "growthWomen"
  | "growthMen";
type SortDirection = "asc" | "desc";

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

export type { OccupationMedianGrowthRow as OccupationSalaryRow };

export function OccupationSalaryOverview({
  rows,
  lastUpdated,
  showLastUpdated = true,
  periodLabel,
  title = "Månedslønn for alle yrker",
  description = "Trykk på overskriftene for å sortere. Trykk på yrket for å åpne detaljsiden.",
  emptyStateText = "Ingen yrker matcher søket ditt.",
}: OccupationSalaryOverviewProps) {
  const formattedPeriodLabel = formatPeriodLabel(periodLabel);
  const [sortKey, setSortKey] = useState<SortKey>("occupationLabel");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const sortedRows = [...rows].sort((left, right) =>
    compareRows(left, right, sortKey, sortDirection),
  );

  function handleSort(nextSortKey: SortKey) {
    if (nextSortKey === sortKey) {
      setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection(nextSortKey === "occupationLabel" ? "asc" : "desc");
  }

  return (
    <section className="grid gap-6">
      <section className="overflow-hidden rounded-md border bg-[var(--surface)] shadow-sm">
        <div className="flex flex-col gap-2 border-b px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                {title}
              </h2>
              <DataInfoModal description={description} title={title} />
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {formattedPeriodLabel ? (
              <p className="inline-flex rounded-md border border-[#d6e2d7] bg-white/85 px-3 py-1.5 text-sm font-semibold text-[var(--primary-strong)] shadow-sm">
                Periode: {formattedPeriodLabel}
              </p>
            ) : null}
            {showLastUpdated ? (
              <p className="text-sm text-[var(--muted)]">Oppdatert: {lastUpdated ?? "Ukjent"}</p>
            ) : null}
          </div>
        </div>

        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="sticky top-0 bg-[#f8f3ea] text-sm text-slate-700">
              <tr>
                <SortableHeader
                  activeSortDirection={sortDirection}
                  activeSortKey={sortKey}
                  align="left"
                  columnKey="occupationLabel"
                  label="Yrke"
                  onSort={handleSort}
                />
                <SortableHeader
                  activeSortDirection={sortDirection}
                  activeSortKey={sortKey}
                  align="right"
                  columnKey="medianWomen"
                  label="Kvinner"
                  onSort={handleSort}
                />
                <SortableHeader
                  activeSortDirection={sortDirection}
                  activeSortKey={sortKey}
                  align="right"
                  columnKey="growthWomen"
                  label="Lønnsvekst kvinner"
                  onSort={handleSort}
                />
                <SortableHeader
                  activeSortDirection={sortDirection}
                  activeSortKey={sortKey}
                  align="right"
                  columnKey="medianMen"
                  label="Menn"
                  onSort={handleSort}
                />
                <SortableHeader
                  activeSortDirection={sortDirection}
                  activeSortKey={sortKey}
                  align="right"
                  columnKey="growthMen"
                  label="Lønnsvekst menn"
                  onSort={handleSort}
                />
              </tr>
            </thead>
            <tbody className="bg-white/80 text-sm">
              {sortedRows.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-[var(--muted)]" colSpan={5}>
                    {emptyStateText}
                  </td>
                </tr>
              ) : (
                sortedRows.map((row) => {
                  const detailHref = getOccupationDetailHref(
                    row.occupationCode,
                    row.occupationLabel,
                  );

                  return (
                    <tr key={row.rowKey} className="odd:bg-white even:bg-[#fcfaf6]">
                      <td className="border-b px-6 py-4 text-slate-900">
                        {detailHref ? (
                          <Link
                            className="group inline-flex items-center gap-2 font-semibold text-[var(--primary-strong)] transition hover:text-[var(--primary)]"
                            href={detailHref}
                          >
                            <span>{row.occupationLabel}</span>
                            <span
                              aria-hidden="true"
                              className="text-base transition-transform group-hover:translate-x-0.5"
                            >
                              &gt;
                            </span>
                          </Link>
                        ) : (
                          row.occupationLabel
                        )}
                      </td>
                      <td className="border-b px-6 py-4 text-right font-semibold text-slate-950">
                        {formatSalary(row.medianWomen)}
                      </td>
                      <td className="border-b px-6 py-4 text-right font-semibold text-slate-950">
                        {formatPercentage(row.growthWomen)}
                      </td>
                      <td className="border-b px-6 py-4 text-right font-semibold text-slate-950">
                        {formatSalary(row.medianMen)}
                      </td>
                      <td className="border-b px-6 py-4 text-right font-semibold text-slate-950">
                        {formatPercentage(row.growthMen)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

type SortableHeaderProps = {
  activeSortDirection: SortDirection;
  activeSortKey: SortKey;
  align: "left" | "right";
  columnKey: SortKey;
  label: string;
  onSort: (key: SortKey) => void;
};

function SortableHeader({
  activeSortDirection,
  activeSortKey,
  align,
  columnKey,
  label,
  onSort,
}: SortableHeaderProps) {
  const alignmentClassName = align === "right" ? "text-right" : "text-left";
  const buttonClassName =
    align === "right"
      ? "inline-flex w-full items-center justify-end gap-2 text-right transition hover:text-slate-950"
      : "inline-flex items-center gap-2 text-left transition hover:text-slate-950";

  return (
    <th
      aria-sort={getAriaSort(activeSortKey, activeSortDirection, columnKey)}
      className={`border-b px-6 py-3 font-semibold ${alignmentClassName}`}
    >
      <button className={buttonClassName} onClick={() => onSort(columnKey)} type="button">
        <span>{label}</span>
        <span aria-hidden="true" className="text-xs text-[var(--muted)]">
          {getSortIcon(activeSortKey, activeSortDirection, columnKey)}
        </span>
      </button>
    </th>
  );
}

function formatSalary(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${currencyFormatter.format(value)} kr`;
}

function formatPercentage(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${value.toLocaleString("nb-NO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} %`;
}

function formatPeriodLabel(label?: string) {
  if (!label) {
    return undefined;
  }

  const quarterMatch = label.match(/^(\d{4})K([1-4])$/);

  if (quarterMatch) {
    const [, year, quarter] = quarterMatch;
    return `${quarter}. kvartal ${year}`;
  }

  return label;
}

function compareRows(
  left: OccupationMedianGrowthRow,
  right: OccupationMedianGrowthRow,
  sortKey: SortKey,
  sortDirection: SortDirection,
) {
  const direction = sortDirection === "asc" ? 1 : -1;

  if (sortKey === "occupationLabel") {
    return left.occupationLabel.localeCompare(right.occupationLabel, "nb") * direction;
  }

  const leftValue = left[sortKey] ?? Number.NEGATIVE_INFINITY;
  const rightValue = right[sortKey] ?? Number.NEGATIVE_INFINITY;

  if (leftValue === rightValue) {
    return left.occupationLabel.localeCompare(right.occupationLabel, "nb");
  }

  return (leftValue - rightValue) * direction;
}

function getAriaSort(activeKey: SortKey, direction: SortDirection, columnKey: SortKey) {
  if (activeKey !== columnKey) {
    return "none";
  }

  return direction === "asc" ? "ascending" : "descending";
}

function getSortIcon(activeKey: SortKey, direction: SortDirection, columnKey: SortKey) {
  if (activeKey !== columnKey) {
    return "<>";
  }

  return direction === "asc" ? "^" : "v";
}
