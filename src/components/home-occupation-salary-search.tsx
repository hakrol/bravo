'use client'

import { useDeferredValue, useState } from "react";
import { OccupationSalaryOverview, type OccupationSalaryRow } from "@/components/occupation-salary-overview";

type HomeOccupationSalarySearchProps = {
  rows: OccupationSalaryRow[];
  lastUpdated?: string;
  periodLabel?: string;
};

export function HomeOccupationSalarySearch({
  rows,
  lastUpdated,
  periodLabel,
}: HomeOccupationSalarySearchProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery.trim());

  const filteredRows = normalizedQuery
    ? rows.filter((row) => {
        const occupationLabel = normalizeText(row.occupationLabel);
        const occupationCode = normalizeText(row.occupationCode);
        return occupationLabel.includes(normalizedQuery) || occupationCode.includes(normalizedQuery);
      })
    : rows;

  return (
    <section className="grid gap-4">
      <div className="-mt-18 relative z-10 mx-auto w-full max-w-4xl px-1 sm:-mt-20" id="yrke-sok">
        <label className="grid gap-3" htmlFor="occupation-search">
          <span className="text-center text-sm font-semibold tracking-[-0.01em] text-[var(--primary-strong)]">
            Søk etter yrke
          </span>
          <input
            id="occupation-search"
            className="h-16 rounded-full border border-white/70 bg-white/76 px-6 text-lg text-slate-900 shadow-[0_12px_40px_rgba(22,61,38,0.08)] outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:bg-white"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Skriv f.eks. regnskapsfører"
            type="search"
            value={query}
          />
        </label>
        <p className="mt-3 text-center text-sm text-[var(--muted)]">
          Tabellen filtreres fortløpende mens du skriver.
        </p>
      </div>

      <OccupationSalaryOverview
        description="Tabellen viser samme lønnsmål fordelt på begge kjønn, kvinner og menn. Søket filtrerer radene fortløpende."
        emptyStateText="Ingen yrker matcher søket ditt akkurat nå."
        lastUpdated={lastUpdated}
        periodLabel={periodLabel}
        rows={filteredRows}
        title={
          normalizedQuery
            ? `Treff for "${query.trim()}"`
            : "Siste gjennomsnittlige avtalte månedslønn for alle yrker"
        }
      />
    </section>
  );
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}
