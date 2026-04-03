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
  variant?: "table" | "cards";
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

type OverviewContentProps = {
  emptyStateText: string;
  rows: OccupationMedianGrowthRow[];
  sortDirection: SortDirection;
  sortKey: SortKey;
  onSort: (key: SortKey) => void;
};

const sortOptions: Array<{ key: SortKey; label: string }> = [
  { key: "occupationLabel", label: "Yrke" },
  { key: "medianWomen", label: "Kvinner" },
  { key: "growthWomen", label: "Lønnsvekst kvinner" },
  { key: "medianMen", label: "Menn" },
  { key: "growthMen", label: "Lønnsvekst menn" },
];

export function OccupationSalaryOverview({
  rows,
  lastUpdated,
  showLastUpdated = true,
  periodLabel,
  title = "Månedslønn for alle yrker",
  description = "Trykk på overskriftene for å sortere. Trykk på yrket for å åpne detaljsiden.",
  emptyStateText = "Ingen yrker matcher søket ditt.",
  variant = "table",
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
          {variant === "cards" ? (
            <CardsOverview
              emptyStateText={emptyStateText}
              rows={sortedRows}
              sortDirection={sortDirection}
              sortKey={sortKey}
              onSort={handleSort}
            />
          ) : (
            <TableOverview
              emptyStateText={emptyStateText}
              rows={sortedRows}
              sortDirection={sortDirection}
              sortKey={sortKey}
              onSort={handleSort}
            />
          )}
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

function TableOverview({
  emptyStateText,
  rows,
  sortDirection,
  sortKey,
  onSort,
}: OverviewContentProps) {
  return (
    <table className="min-w-full border-separate border-spacing-0 text-left">
      <thead className="sticky top-0 bg-[#f8f3ea] text-sm text-slate-700">
        <tr>
          <SortableHeader
            activeSortDirection={sortDirection}
            activeSortKey={sortKey}
            align="left"
            columnKey="occupationLabel"
            label="Yrke"
            onSort={onSort}
          />
          <SortableHeader
            activeSortDirection={sortDirection}
            activeSortKey={sortKey}
            align="right"
            columnKey="medianWomen"
            label="Kvinner"
            onSort={onSort}
          />
          <SortableHeader
            activeSortDirection={sortDirection}
            activeSortKey={sortKey}
            align="right"
            columnKey="growthWomen"
            label="Lønnsvekst kvinner"
            onSort={onSort}
          />
          <SortableHeader
            activeSortDirection={sortDirection}
            activeSortKey={sortKey}
            align="right"
            columnKey="medianMen"
            label="Menn"
            onSort={onSort}
          />
          <SortableHeader
            activeSortDirection={sortDirection}
            activeSortKey={sortKey}
            align="right"
            columnKey="growthMen"
            label="Lønnsvekst menn"
            onSort={onSort}
          />
        </tr>
      </thead>
      <tbody className="bg-white/80 text-sm">
        {rows.length === 0 ? (
          <tr>
            <td className="px-6 py-8 text-sm text-[var(--muted)]" colSpan={5}>
              {emptyStateText}
            </td>
          </tr>
        ) : (
          rows.map((row) => {
            const detailHref = getOccupationDetailHref(row.occupationCode, row.occupationLabel);

            return (
              <tr key={row.rowKey} className="odd:bg-white even:bg-[#fcfaf6]">
                <td className="border-b px-6 py-4 text-slate-900">
                  <OccupationLink href={detailHref} label={row.occupationLabel} />
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
  );
}

function CardsOverview({
  emptyStateText,
  rows,
  sortDirection,
  sortKey,
  onSort,
}: OverviewContentProps) {
  return (
    <div className="bg-white/45">
      <div className="sticky top-0 z-10 border-b bg-[#f8f3ea]/95 px-4 py-2 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:hidden">
          {sortOptions.map((option) => {
            const active = sortKey === option.key;

            return (
              <button
                key={option.key}
                aria-pressed={active}
                className={[
                  "inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition",
                  active
                    ? "text-[var(--primary-strong)]"
                    : "text-[var(--muted)] hover:text-[var(--primary-strong)]",
                ].join(" ")}
                onClick={() => onSort(option.key)}
                type="button"
              >
                {option.label}
                <span aria-hidden="true" className="text-[10px]">
                  {getSortIcon(sortKey, sortDirection, option.key)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-1 hidden gap-3 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <SortTitleButton
            active={sortKey === "occupationLabel"}
            label="Yrke"
            onClick={() => onSort("occupationLabel")}
            sortIcon={getSortIcon(sortKey, sortDirection, "occupationLabel")}
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <SortTitleButton
              active={sortKey === "medianWomen"}
              label="Kvinner"
              onClick={() => onSort("medianWomen")}
              sortIcon={getSortIcon(sortKey, sortDirection, "medianWomen")}
            />
            <SortTitleButton
              active={sortKey === "growthWomen"}
              label="Lønnsvekst kvinner"
              onClick={() => onSort("growthWomen")}
              sortIcon={getSortIcon(sortKey, sortDirection, "growthWomen")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <SortTitleButton
              active={sortKey === "medianMen"}
              label="Menn"
              onClick={() => onSort("medianMen")}
              sortIcon={getSortIcon(sortKey, sortDirection, "medianMen")}
            />
            <SortTitleButton
              active={sortKey === "growthMen"}
              label="Lønnsvekst menn"
              onClick={() => onSort("growthMen")}
              sortIcon={getSortIcon(sortKey, sortDirection, "growthMen")}
            />
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="px-6 py-8 text-sm text-[var(--muted)]">{emptyStateText}</div>
      ) : (
        <div className="grid gap-3 px-3 py-3 sm:px-4">
          {rows.map((row) => {
            const detailHref = getOccupationDetailHref(row.occupationCode, row.occupationLabel);

            return (
              <article
                key={row.rowKey}
                className="rounded-md border border-black/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(252,250,246,0.98)_100%)] px-4 py-3 shadow-[0_10px_28px_rgba(27,36,48,0.05)] transition hover:border-[var(--primary)]/20 hover:shadow-[0_14px_34px_rgba(27,36,48,0.08)]"
              >
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
                  <div className="min-w-0">
                    <OccupationLink href={detailHref} label={row.occupationLabel} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <MetricField label="Kvinner" value={formatSalary(row.medianWomen)} />
                    <MetricField
                      label="Lønnsvekst kvinner"
                      tone="accent"
                      value={formatPercentage(row.growthWomen)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <MetricField label="Menn" value={formatSalary(row.medianMen)} />
                    <MetricField
                      label="Lønnsvekst menn"
                      tone="accent"
                      value={formatPercentage(row.growthMen)}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SortTitleButton({
  active,
  label,
  onClick,
  sortIcon,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  sortIcon: string;
}) {
  return (
    <button
      aria-pressed={active}
      className={[
        "inline-flex items-center gap-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] transition",
        active ? "text-[var(--primary-strong)]" : "text-[var(--muted)] hover:text-[var(--primary-strong)]",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <span aria-hidden="true" className="text-[10px]">
        {sortIcon}
      </span>
    </button>
  );
}

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

function OccupationLink({ href, label }: { href?: string; label: string }) {
  if (!href) {
    return <span className="font-semibold text-slate-900">{label}</span>;
  }

  return (
    <Link
      className="group inline-flex items-center gap-2 font-semibold text-[var(--primary-strong)] transition hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
      href={href}
    >
      <span className="truncate">{label}</span>
      <span aria-hidden="true" className="text-base transition-transform group-hover:translate-x-0.5">
        &gt;
      </span>
    </Link>
  );
}

function MetricField({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent";
}) {
  return (
    <div className="min-w-0">
      <p
        className={[
          "text-[11px] font-semibold uppercase tracking-[0.14em] lg:sr-only",
          tone === "accent" ? "text-[var(--primary-strong)]" : "text-[var(--muted)]",
        ].join(" ")}
      >
        {label}
      </p>
      <p className="truncate text-sm font-semibold text-slate-950 sm:text-[15px]">{value}</p>
    </div>
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
