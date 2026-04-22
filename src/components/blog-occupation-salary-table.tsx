"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import bestBetalteYrker2025Snapshot from "@/content/blog/data/best-betalte-yrker-2025.json";

type OccupationSalaryRow = {
  label: string;
  href: string;
  value: number;
};

type OccupationSalarySnapshot = {
  id: string;
  title: string;
  source: string;
  period: string;
  measure: string;
  note: string;
  rows: OccupationSalaryRow[];
};

const rowsPerPage = 25;

const snapshots = {
  "best-betalte-yrker-2025": bestBetalteYrker2025Snapshot as OccupationSalarySnapshot,
};

type BlogOccupationSalaryTableProps = {
  snapshotId?: keyof typeof snapshots;
};

export function BlogOccupationSalaryTable({ snapshotId = "best-betalte-yrker-2025" }: BlogOccupationSalaryTableProps) {
  const snapshot = snapshots[snapshotId] ?? snapshots["best-betalte-yrker-2025"];
  const occupationRows = snapshot.rows;
  const maxSalary = Math.max(...occupationRows.map((row) => row.value), 1);
  const minSalary = Math.min(...occupationRows.map((row) => row.value), 0);

  const [query, setQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);

  const filteredRows = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return occupationRows;
    }

    return occupationRows.filter((row) => normalizeText(row.label).includes(normalizedQuery));
  }, [query]);

  const pageCount = Math.max(Math.ceil(filteredRows.length / rowsPerPage), 1);
  const currentPageIndex = Math.min(pageIndex, pageCount - 1);
  const visibleRows = filteredRows.slice(currentPageIndex * rowsPerPage, (currentPageIndex + 1) * rowsPerPage);

  function updateQuery(value: string) {
    setQuery(value);
    setPageIndex(0);
  }

  return (
    <section className="blog-occupation-table" aria-labelledby="occupation-salary-table-title">
      <div className="blog-occupation-table-header">
        <div>
          <h2 id="occupation-salary-table-title">Dette tjener ansatte i ulike yrker</h2>
          <p>
            {snapshot.measure} i {occupationRows.length.toLocaleString("nb-NO")} yrker i {snapshot.period}. Du kan søke og bla i
            tabellen.
          </p>
        </div>
        <div className="blog-occupation-table-controls" aria-label="Tabellnavigasjon">
          <label className="blog-occupation-search">
            <span>Søk</span>
            <input
              inputMode="search"
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Søk etter yrke"
              type="search"
              value={query}
            />
          </label>
          <div className="blog-occupation-pagination">
            <span>
              Side {currentPageIndex + 1} av {pageCount}
            </span>
            <button
              aria-label="Forrige side"
              disabled={currentPageIndex === 0}
              onClick={() => setPageIndex((current) => Math.max(current - 1, 0))}
              type="button"
            >
              ‹
            </button>
            <button
              aria-label="Neste side"
              disabled={currentPageIndex >= pageCount - 1}
              onClick={() => setPageIndex((current) => Math.min(current + 1, pageCount - 1))}
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="blog-occupation-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Yrke</th>
              <th scope="col">Månedslønn</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.href}>
                <td>
                  <Link href={row.href}>{row.label}</Link>
                </td>
                <td>
                  <span className="blog-occupation-salary-cell" style={{ background: getSalaryColor(row.value, minSalary, maxSalary) }}>
                    {formatSalary(row.value)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleRows.length === 0 ? <p className="blog-occupation-table-empty">Fant ingen yrker som matcher søket.</p> : null}
      <div className="blog-occupation-table-source" aria-label="Kilde og metode">
        <span>
          <strong>Kilde:</strong> {snapshot.source}
        </span>
        <span>{snapshot.note}</span>
      </div>
    </section>
  );
}

function formatSalary(value: number) {
  return `${value.toLocaleString("nb-NO")} kr`;
}

function getSalaryColor(value: number, minSalary: number, maxSalary: number) {
  const ratio = Math.max(0, Math.min(1, (value - minSalary) / Math.max(maxSalary - minSalary, 1)));
  const hue = 44 + ratio * 100;
  const saturation = 70 - ratio * 18;
  const lightness = 67 - ratio * 44;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9æøå]+/gi, "");
}
