'use client'

import { useDeferredValue, useState } from "react";
import { OccupationSalaryOverview, type OccupationSalaryRow } from "@/components/occupation-salary-overview";
import { getOccupationGroupByCode, listOccupationGroups } from "@/lib/occupation-groups";

type HomeOccupationSalarySearchProps = {
  rows: OccupationSalaryRow[];
  lastUpdated?: string;
  periodLabel?: string;
};

type HomeOccupationGroupFilter = {
  code: string;
  shortLabel: string;
};

const homeOccupationGroups: HomeOccupationGroupFilter[] = [
  ...listOccupationGroups().map((group) => ({ code: group.code, shortLabel: group.shortLabel })),
  { code: "3", shortLabel: "Høgskoleyrker" },
];

export function HomeOccupationSalarySearch({
  rows,
  lastUpdated,
  periodLabel,
}: HomeOccupationSalarySearchProps) {
  const [query, setQuery] = useState("");
  const [activeGroupCode, setActiveGroupCode] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery.trim());
  const availableGroupCodes = new Set(
    rows.map((row) => getTopGroupCode(row.occupationCode)).filter(Boolean),
  );
  const availableGroups = homeOccupationGroups.filter((group) => availableGroupCodes.has(group.code));

  const filteredRows = rows.filter((row) => {
    const matchesGroup = !activeGroupCode || activeGroupCode === getTopGroupCode(row.occupationCode);

    if (!matchesGroup) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const occupationLabel = normalizeText(row.occupationLabel);
    const occupationCode = normalizeText(row.occupationCode);
    return occupationLabel.includes(normalizedQuery) || occupationCode.includes(normalizedQuery);
  });

  const activeGroupLabel =
    getOccupationGroupByCode(activeGroupCode)?.shortLabel ??
    homeOccupationGroups.find((group) => group.code === activeGroupCode)?.shortLabel;

  return (
    <section className="relative z-10 grid gap-4">
      <div className="-mt-18 relative z-10 mx-auto w-full max-w-4xl px-1 sm:-mt-20" id="yrke-sok">
        <label className="grid gap-3" htmlFor="occupation-search">
          <span className="text-center text-sm font-semibold tracking-[-0.01em] text-[var(--primary-strong)]">
            Søk etter yrke
          </span>
          <input
            id="occupation-search"
            className="h-16 rounded-md border border-white/70 bg-white/76 px-6 text-lg text-slate-900 shadow-[0_12px_40px_rgba(22,61,38,0.08)] outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:bg-white"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Skriv f.eks. regnskapsfører"
            type="search"
            value={query}
          />
        </label>
        <p className="mt-3 text-center text-sm text-[var(--muted)]">
          Oversikten filtreres fortløpende mens du skriver.
        </p>
      </div>

      {availableGroups.length > 0 ? (
        <div className="relative z-10 mx-auto w-full max-w-6xl px-1">
          <label className="mx-auto grid max-w-sm gap-2" htmlFor="occupation-group-filter">
            <span className="text-sm font-semibold text-[var(--primary-strong)]">
              Velg yrkesgruppe
            </span>
            <select
              id="occupation-group-filter"
              className="h-12 rounded-md border border-[var(--border)] bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              onChange={(event) => setActiveGroupCode(event.target.value)}
              value={activeGroupCode}
            >
              <option value="">Alle yrkesgrupper</option>
              {availableGroups.map((group) => (
                <option key={group.code} value={group.code}>
                  {group.shortLabel}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <OccupationSalaryOverview
        description="Se månedslønn og vekst fordelt på yrker."
        emptyStateText="Ingen yrker matcher søket ditt akkurat nå."
        lastUpdated={lastUpdated}
        periodLabel={periodLabel}
        rows={filteredRows}
        showLastUpdated={false}
        title={buildTitle(query.trim(), activeGroupLabel)}
        variant="cards"
      />
    </section>
  );
}

function buildTitle(query: string, activeGroupLabel?: string) {
  const hasQuery = query.length > 0;
  const hasGroup = Boolean(activeGroupLabel);

  if (hasQuery && hasGroup) {
    return `Treff for "${query}" i ${activeGroupLabel}`;
  }

  if (hasQuery) {
    return `Treff for "${query}"`;
  }

  if (hasGroup) {
    return `Yrker i ${activeGroupLabel}`;
  }

  return "Månedslønn for alle yrker";
}

function getTopGroupCode(occupationCode: string) {
  return occupationCode.charAt(0);
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}
