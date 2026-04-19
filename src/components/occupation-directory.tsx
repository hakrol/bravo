"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

export type OccupationDirectoryItem = {
  occupationCode: string;
  title: string;
  monthlySalary?: number;
  href?: string;
  searchText?: string;
};

type OccupationDirectoryProps = {
  items: OccupationDirectoryItem[];
};

type SalaryFilter = "all" | "under-40000" | "40000-60000" | "60000-80000" | "over-80000";

const salaryFilters: Array<{ value: SalaryFilter; label: string }> = [
  { value: "all", label: "Alle lønnsnivå" },
  { value: "under-40000", label: "Under 40 000 kr" },
  { value: "40000-60000", label: "40 000-60 000 kr" },
  { value: "60000-80000", label: "60 000-80 000 kr" },
  { value: "over-80000", label: "Over 80 000 kr" },
];

export function OccupationDirectory({ items }: OccupationDirectoryProps) {
  const [query, setQuery] = useState("");
  const [salaryFilter, setSalaryFilter] = useState<SalaryFilter>("all");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery);

  const filteredItems = items.filter((item) => {
    const searchableText = item.searchText ?? `${item.title} ${item.occupationCode}`;
    const matchesQuery =
      normalizedQuery.length === 0 || normalizeText(searchableText).includes(normalizedQuery);
    const matchesSalary = matchesSalaryFilter(item.monthlySalary, salaryFilter);

    return matchesQuery && matchesSalary;
  });

  return (
    <section className="grid gap-5">
      <div className="grid gap-3 rounded-[5px] bg-white px-5 py-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
        <label className="grid gap-2" htmlFor="occupation-search">
          <span className="text-sm font-semibold text-slate-950">Søk etter yrke</span>
          <input
            id="occupation-search"
            className="h-11 rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Skriv f.eks. flyger"
            type="search"
            value={query}
          />
        </label>

        <label className="grid gap-2" htmlFor="salary-filter">
          <span className="text-sm font-semibold text-slate-950">Filtrer på lønn</span>
          <select
            id="salary-filter"
            className="h-11 rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]"
            onChange={(event) => setSalaryFilter(event.target.value as SalaryFilter)}
            value={salaryFilter}
          >
            {salaryFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm leading-6 text-slate-500">
        Viser {filteredItems.length.toLocaleString("nb-NO")} av {items.length.toLocaleString("nb-NO")} yrker.
      </p>

      {filteredItems.length > 0 ? (
        <div
          aria-label="Alle yrker med median samlet månedslønn"
          className="grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredItems.map((item) => {
            const content = (
              <>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  Samlet månedslønn:{" "}
                  <span className="font-semibold text-[var(--primary-strong)]">
                    {formatCurrency(item.monthlySalary)}
                  </span>
                </p>
              </>
            );

            if (!item.href) {
              return (
                <article
                  key={item.occupationCode}
                  className="flex h-full min-h-36 flex-col justify-between rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]"
                >
                  {content}
                </article>
              );
            }

            return (
              <Link
                key={item.occupationCode}
                className="flex h-full min-h-36 flex-col justify-between rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(15,23,42,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-strong)]"
                href={item.href}
              >
                {content}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[5px] bg-white px-5 py-8 text-center shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
          <p className="text-base font-semibold text-slate-950">Ingen yrker matcher søket.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Prøv et annet søkeord eller velg et annet lønnsnivå.
          </p>
        </div>
      )}
    </section>
  );
}

function matchesSalaryFilter(value: number | undefined, filter: SalaryFilter) {
  if (filter === "all") {
    return true;
  }

  if (value === undefined) {
    return false;
  }

  if (filter === "under-40000") {
    return value < 40000;
  }

  if (filter === "40000-60000") {
    return value >= 40000 && value < 60000;
  }

  if (filter === "60000-80000") {
    return value >= 60000 && value < 80000;
  }

  return value >= 80000;
}

function formatCurrency(value?: number) {
  if (value === undefined) {
    return "Mangler data";
  }

  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}
