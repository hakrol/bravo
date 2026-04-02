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
  const [activeGroupCodes, setActiveGroupCodes] = useState<string[]>([]);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery.trim());
  const availableGroupCodes = new Set(
    rows.map((row) => getTopGroupCode(row.occupationCode)).filter(Boolean),
  );
  const availableGroups = homeOccupationGroups.filter((group) => availableGroupCodes.has(group.code));

  const filteredRows = rows.filter((row) => {
    const matchesGroup =
      activeGroupCodes.length === 0 || activeGroupCodes.includes(getTopGroupCode(row.occupationCode));

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

  const activeGroupLabels = activeGroupCodes
    .map((code) => getOccupationGroupByCode(code)?.shortLabel ?? homeOccupationGroups.find((group) => group.code === code)?.shortLabel)
    .filter((label): label is string => Boolean(label));

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
          Tabellen filtreres fortløpende mens du skriver.
        </p>
      </div>

      {availableGroups.length > 0 ? (
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-2 px-1">
          {availableGroups.map((group) => {
            const active = activeGroupCodes.includes(group.code);

            return (
              <button
                key={group.code}
                aria-pressed={active}
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition",
                  active
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-sm"
                    : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary-strong)]",
                ].join(" ")}
                onClick={() =>
                  setActiveGroupCodes((current) =>
                    current.includes(group.code)
                      ? current.filter((code) => code !== group.code)
                      : [...current, group.code],
                  )
                }
                type="button"
              >
                <span aria-hidden="true" className={active ? "rotate-90 transition" : "transition"}>
                  ▸
                </span>
                {group.shortLabel}
              </button>
            );
          })}
        </div>
      ) : null}

      <OccupationSalaryOverview
        description="Tabellen viser samme lønnsmål fordelt på begge kjønn, kvinner og menn. Søket filtrerer radene fortløpende."
        emptyStateText="Ingen yrker matcher søket ditt akkurat nå."
        lastUpdated={lastUpdated}
        periodLabel={periodLabel}
        rows={filteredRows}
        showLastUpdated={false}
        title={buildTitle(query.trim(), activeGroupLabels)}
      />
    </section>
  );
}

function buildTitle(query: string, activeGroupLabels: string[]) {
  const hasQuery = query.length > 0;
  const hasGroups = activeGroupLabels.length > 0;

  if (hasQuery && hasGroups) {
    return `Treff for "${query}" i ${activeGroupLabels.join(", ")}`;
  }

  if (hasQuery) {
    return `Treff for "${query}"`;
  }

  if (hasGroups) {
    return `Yrker i ${activeGroupLabels.join(", ")}`;
  }

  return "Siste gjennomsnittlige avtalte månedslønn for alle yrker";
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
