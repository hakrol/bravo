"use client";

import Link from "next/link";
import type { OccupationSalaryRow } from "@/components/occupation-salary-overview";
import { getOccupationDetailHref } from "@/lib/occupation-detail-pages";

type HomeOccupationCardsProps = {
  query: string;
  rows: OccupationSalaryRow[];
  sourceRows: OccupationSalaryRow[];
};

const preferredOccupationMatchers = [
  ["politikere", "politiker"],
  ["elektrikere"],
  ["flygere", "flyger"],
  ["legespesialister"],
  ["sykepleiere"],
  ["dommere"],
];

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

export function HomeOccupationCards({ query, rows, sourceRows }: HomeOccupationCardsProps) {
  const trimmedQuery = query.trim();
  const normalizedQuery = normalizeText(trimmedQuery);
  const highlightedRows = normalizedQuery
    ? sortRowsForDisplay(rows, normalizedQuery).slice(0, 6)
    : getPreferredOccupationRows(sourceRows);

  return (
    <div className="mx-auto mt-9 w-full max-w-7xl min-w-0 px-0">
      {highlightedRows.length > 0 ? (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 xl:grid-cols-3">
          {highlightedRows.map((row) => (
            <OccupationHighlightCard key={row.rowKey} row={row} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-black/8 bg-white/86 px-5 py-8 text-sm text-[var(--muted)] shadow-[0_12px_34px_rgba(27,36,48,0.05)]">
          Ingen yrker matcher søket ditt akkurat nå.
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Link
          className="inline-flex h-12 items-center justify-center rounded-md border border-black/10 bg-white px-5 text-sm font-semibold text-[var(--primary-strong)] shadow-[0_10px_24px_rgba(27,36,48,0.06)] transition hover:border-[var(--primary)]/30 hover:bg-[#f7fbf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          href="/yrker"
        >
          Se alle yrker
          <span aria-hidden="true" className="ml-3 text-base">
            &gt;
          </span>
        </Link>
      </div>
    </div>
  );
}

function OccupationHighlightCard({ row }: { row: OccupationSalaryRow }) {
  const detailHref = getOccupationDetailHref(row.occupationCode, row.occupationLabel);
  const content = (
    <article className="min-h-32 w-full min-w-0 max-w-full rounded-md border border-black/8 bg-white/90 p-5 shadow-[0_16px_36px_rgba(27,36,48,0.07)] transition hover:-translate-y-0.5 hover:border-[var(--primary)]/25 hover:shadow-[0_20px_44px_rgba(27,36,48,0.1)]">
      <div className="min-w-0">
        <h3 className="flex min-w-0 items-center gap-2 text-base font-semibold leading-snug text-slate-950">
          <span className="truncate">{row.occupationLabel}</span>
          {detailHref ? (
            <span aria-hidden="true" className="shrink-0 text-[var(--primary-strong)]">
              &gt;
            </span>
          ) : null}
        </h3>
        <dl className="mt-4 grid gap-2 text-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <dt className="text-[var(--muted)]">Kvinner</dt>
            <dd className="font-semibold tabular-nums text-slate-950">{formatSalary(row.medianWomen)}</dd>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <dt className="text-[var(--muted)]">Menn</dt>
            <dd className="font-semibold tabular-nums text-slate-950">{formatSalary(row.medianMen)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );

  if (!detailHref) {
    return content;
  }

  return (
    <Link
      className="block w-full min-w-0 max-w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
      href={detailHref}
    >
      {content}
    </Link>
  );
}

function getPreferredOccupationRows(rows: OccupationSalaryRow[]) {
  const selectedRows: OccupationSalaryRow[] = [];
  const selectedCodes = new Set<string>();

  for (const matchers of preferredOccupationMatchers) {
    const row = rows.find((candidate) => {
      const normalizedLabel = normalizeText(candidate.occupationLabel);
      return (
        !selectedCodes.has(candidate.occupationCode) &&
        matchers.some((matcher) => normalizedLabel.includes(normalizeText(matcher)))
      );
    });

    if (row) {
      selectedRows.push(row);
      selectedCodes.add(row.occupationCode);
    }
  }

  if (selectedRows.length >= 6) {
    return selectedRows.slice(0, 6);
  }

  const fallbackRows = sortRowsForDisplay(rows, "")
    .filter((row) => !selectedCodes.has(row.occupationCode))
    .slice(0, 6 - selectedRows.length);

  return [...selectedRows, ...fallbackRows];
}

function sortRowsForDisplay(rows: OccupationSalaryRow[], normalizedQuery: string) {
  return [...rows].sort((left, right) => {
    if (normalizedQuery) {
      const leftLabel = normalizeText(left.occupationLabel);
      const rightLabel = normalizeText(right.occupationLabel);
      const leftStartsWith = leftLabel.startsWith(normalizedQuery);
      const rightStartsWith = rightLabel.startsWith(normalizedQuery);

      if (leftStartsWith !== rightStartsWith) {
        return leftStartsWith ? -1 : 1;
      }
    }

    return (right.medianMen ?? right.medianAll ?? -1) - (left.medianMen ?? left.medianAll ?? -1);
  });
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}

function formatSalary(value?: number) {
  if (value === undefined) {
    return ":";
  }

  return `${currencyFormatter.format(value)} kr`;
}
