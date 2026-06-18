"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import advokaterJuristerLonn2025Snapshot from "@/content/blog/data/advokater-jurister-lonn-2025.json";
import bestBetalteYrker2025Snapshot from "@/content/blog/data/best-betalte-yrker-2025.json";
import brannmannLonn2025Snapshot from "@/content/blog/data/brannmann-lonn-2025.json";
import bussjaforerTrikkeforereLonn2025Snapshot from "@/content/blog/data/bussjaforer-trikkeforere-lonn-2025.json";
import butikksjefLonn2025Snapshot from "@/content/blog/data/butikksjef-lonn-2025.json";
import elektrikerLonn2025Snapshot from "@/content/blog/data/elektriker-lonn-2025.json";
import handverkereLonn2025Snapshot from "@/content/blog/data/handverkere-lonn-2025.json";
import intensivsykepleierLonn2025Snapshot from "@/content/blog/data/intensivsykepleier-lonn-2025.json";
import kirurgLonn2025Snapshot from "@/content/blog/data/kirurg-lonn-2025.json";
import konduktorLonn2025Snapshot from "@/content/blog/data/konduktor-lonn-2025.json";
import laerereLonn2025Snapshot from "@/content/blog/data/laerere-lonn-2025.json";
import legeLonn2025Snapshot from "@/content/blog/data/lege-lonn-2025.json";
import malerLonn2025Snapshot from "@/content/blog/data/maler-lonn-2025.json";
import norgesVanligsteYrker2026Snapshot from "@/content/blog/data/norges-vanligste-yrker-2026.json";
import piloterLonn2025Snapshot from "@/content/blog/data/piloter-lonn-2025.json";
import politiLonn2025Snapshot from "@/content/blog/data/politi-lonn-2025.json";
import psykologLonn2025Snapshot from "@/content/blog/data/psykolog-lonn-2025.json";
import rorleggerLonn2025Snapshot from "@/content/blog/data/rorlegger-lonn-2025.json";
import snekkerLonn2025Snapshot from "@/content/blog/data/snekker-lonn-2025.json";
import servitorLonn2025Snapshot from "@/content/blog/data/servitor-lonn-2025.json";
import sykepleiereHelsearbeidereLonn2025Snapshot from "@/content/blog/data/sykepleiere-helsearbeidere-lonn-2025.json";
import vernepleierLonn2025Snapshot from "@/content/blog/data/vernepleier-lonn-2025.json";
import yrkerOverEnMillion2025Snapshot from "@/content/blog/data/yrker-over-en-million-2025.json";

type OccupationSalaryRow = {
  code?: string;
  label: string;
  href: string;
  value: number | null;
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
  "advokater-jurister-lonn-2025": advokaterJuristerLonn2025Snapshot as OccupationSalarySnapshot,
  "best-betalte-yrker-2025": bestBetalteYrker2025Snapshot as OccupationSalarySnapshot,
  "brannmann-lonn-2025": brannmannLonn2025Snapshot as OccupationSalarySnapshot,
  "bussjaforer-trikkeforere-lonn-2025": bussjaforerTrikkeforereLonn2025Snapshot as OccupationSalarySnapshot,
  "butikksjef-lonn-2025": butikksjefLonn2025Snapshot as OccupationSalarySnapshot,
  "elektriker-lonn-2025": elektrikerLonn2025Snapshot as OccupationSalarySnapshot,
  "handverkere-lonn-2025": handverkereLonn2025Snapshot as OccupationSalarySnapshot,
  "intensivsykepleier-lonn-2025": intensivsykepleierLonn2025Snapshot as OccupationSalarySnapshot,
  "kirurg-lonn-2025": kirurgLonn2025Snapshot as OccupationSalarySnapshot,
  "konduktor-lonn-2025": konduktorLonn2025Snapshot as OccupationSalarySnapshot,
  "laerere-lonn-2025": laerereLonn2025Snapshot as OccupationSalarySnapshot,
  "lege-lonn-2025": legeLonn2025Snapshot as OccupationSalarySnapshot,
  "maler-lonn-2025": malerLonn2025Snapshot as OccupationSalarySnapshot,
  "norges-vanligste-yrker-2026": norgesVanligsteYrker2026Snapshot as OccupationSalarySnapshot,
  "piloter-lonn-2025": piloterLonn2025Snapshot as OccupationSalarySnapshot,
  "politi-lonn-2025": politiLonn2025Snapshot as OccupationSalarySnapshot,
  "psykolog-lonn-2025": psykologLonn2025Snapshot as OccupationSalarySnapshot,
  "rorlegger-lonn-2025": rorleggerLonn2025Snapshot as OccupationSalarySnapshot,
  "snekker-lonn-2025": snekkerLonn2025Snapshot as OccupationSalarySnapshot,
  "servitor-lonn-2025": servitorLonn2025Snapshot as OccupationSalarySnapshot,
  "sykepleiere-helsearbeidere-lonn-2025": sykepleiereHelsearbeidereLonn2025Snapshot as OccupationSalarySnapshot,
  "vernepleier-lonn-2025": vernepleierLonn2025Snapshot as OccupationSalarySnapshot,
  "yrker-over-en-million-2025": yrkerOverEnMillion2025Snapshot as OccupationSalarySnapshot,
};

type BlogOccupationSalaryTableProps = {
  snapshotId?: keyof typeof snapshots;
  title?: string;
};

export function BlogOccupationSalaryTable({ snapshotId = "best-betalte-yrker-2025", title }: BlogOccupationSalaryTableProps) {
  const snapshot = snapshots[snapshotId] ?? snapshots["best-betalte-yrker-2025"];
  const isEmployeeCount = snapshot.measure.toLowerCase().includes("lønnstakere");
  const valueLabel = isEmployeeCount
    ? "Lønnstakere"
    : snapshot.measure.toLowerCase().includes("årslønn")
      ? "Årslønn"
      : "Månedslønn";
  const occupationRows = useMemo(
    () => snapshot.rows.filter((row): row is OccupationSalaryRow & { value: number } => typeof row.value === "number"),
    [snapshot],
  );
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
  }, [occupationRows, query]);

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
          <h2 id="occupation-salary-table-title">{title ?? "Dette tjener ansatte i ulike yrker"}</h2>
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
              <th scope="col">{valueLabel}</th>
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
                    {isEmployeeCount ? row.value.toLocaleString("nb-NO") : formatSalary(row.value)}
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
