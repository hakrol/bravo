"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

export type OccupationDirectoryItem = {
  occupationCode: string;
  title: string;
  groupCode?: string;
  groupLabel?: string;
  areaCode?: string;
  areaLabel?: string;
  familyCode?: string;
  familyLabel?: string;
  monthlySalary?: number;
  salaryValue?: number;
  href?: string;
  searchText?: string;
};

type OccupationDirectoryProps = {
  items: OccupationDirectoryItem[];
  valueLabel?: string;
  filterLabel?: string;
  salaryFilters?: SalaryFilterOption[];
  colorByOccupationGroup?: boolean;
  filterByOccupationHierarchy?: boolean;
  filterByOccupationFamily?: boolean;
  showSearch?: boolean;
};

type SalaryFilterOption = {
  value: string;
  label: string;
  min?: number;
  max?: number;
};

const defaultSalaryFilters: SalaryFilterOption[] = [
  { value: "all", label: "Alle lønnsnivå" },
  { value: "under-40000", label: "Under 40 000 kr", max: 40000 },
  { value: "40000-60000", label: "40 000-60 000 kr", min: 40000, max: 60000 },
  { value: "60000-80000", label: "60 000-80 000 kr", min: 60000, max: 80000 },
  { value: "over-80000", label: "Over 80 000 kr", min: 80000 },
];

const occupationGroupGradients: Record<string, string> = {
  "0": "linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)",
  "1": "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
  "2": "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)",
  "3": "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)",
  "4": "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
  "5": "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)",
  "6": "linear-gradient(135deg, #ECFCCB 0%, #D9F99D 100%)",
  "7": "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
  "8": "linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)",
  "9": "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
};

export function OccupationDirectory({
  items,
  valueLabel = "Samlet månedslønn",
  filterLabel = "Filtrer på lønn",
  salaryFilters = defaultSalaryFilters,
  colorByOccupationGroup = false,
  filterByOccupationHierarchy = false,
  filterByOccupationFamily = false,
  showSearch = true,
}: OccupationDirectoryProps) {
  const [query, setQuery] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [occupationGroupFilter, setOccupationGroupFilter] = useState("all");
  const [occupationAreaFilter, setOccupationAreaFilter] = useState("all");
  const [occupationFamilyFilter, setOccupationFamilyFilter] = useState("all");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery);
  const occupationGroups = buildFilterOptions(items, "groupCode", "groupLabel");
  const occupationAreas = buildFilterOptions(
    items.filter(
      (item) => occupationGroupFilter === "all" || item.groupCode === occupationGroupFilter,
    ),
    "areaCode",
    "areaLabel",
  );
  const occupationFamilies = buildFilterOptions(
    items.filter(
      (item) =>
        (occupationGroupFilter === "all" || item.groupCode === occupationGroupFilter) &&
        (occupationAreaFilter === "all" || item.areaCode === occupationAreaFilter),
    ),
    "familyCode",
    "familyLabel",
  );

  const filteredItems = items.filter((item) => {
    const searchableText = item.searchText ?? `${item.title} ${item.occupationCode}`;
    const matchesQuery =
      normalizedQuery.length === 0 || normalizeText(searchableText).includes(normalizedQuery);
    const matchesSelectedFilter = filterByOccupationHierarchy
      ? (occupationGroupFilter === "all" || item.groupCode === occupationGroupFilter) &&
        (occupationAreaFilter === "all" || item.areaCode === occupationAreaFilter) &&
        (occupationFamilyFilter === "all" || item.familyCode === occupationFamilyFilter)
      : filterByOccupationFamily
        ? occupationFamilyFilter === "all" || item.familyCode === occupationFamilyFilter
        : matchesSalaryFilter(getSalaryValue(item), salaryFilter, salaryFilters);

    return matchesQuery && matchesSelectedFilter;
  });

  return (
    <section className="grid gap-5">
      {showSearch ? (
        <div className="rounded-[5px] bg-white px-5 py-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
          <label className="grid min-w-0 gap-2" htmlFor="occupation-search">
            <span className="text-sm font-semibold text-slate-950">Søk etter yrke</span>
            <input
              id="occupation-search"
              className="h-11 min-w-0 w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Skriv f.eks. flyger"
              type="search"
              value={query}
            />
          </label>
        </div>
      ) : null}

      {filterByOccupationHierarchy ? (
        <div className="grid gap-4 rounded-[5px] bg-white px-5 py-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)] md:grid-cols-3">
          <label className="grid min-w-0 gap-2" htmlFor="occupation-group-filter">
            <span className="text-sm font-semibold text-slate-950">Velg yrkesgruppe</span>
            <select
              id="occupation-group-filter"
              className="h-11 min-w-0 w-full max-w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]"
              onChange={(event) => {
                setOccupationGroupFilter(event.target.value);
                setOccupationAreaFilter("all");
                setOccupationFamilyFilter("all");
              }}
              value={occupationGroupFilter}
            >
              <option value="all">Alle yrkesgrupper</option>
              {occupationGroups.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid min-w-0 gap-2" htmlFor="occupation-area-filter">
            <span className="text-sm font-semibold text-slate-950">Velg yrkesområde</span>
            <select
              id="occupation-area-filter"
              className="h-11 min-w-0 w-full max-w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              disabled={occupationGroupFilter === "all"}
              onChange={(event) => {
                setOccupationAreaFilter(event.target.value);
                setOccupationFamilyFilter("all");
              }}
              value={occupationAreaFilter}
            >
              <option value="all">Alle yrkesområder</option>
              {occupationAreas.map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid min-w-0 gap-2" htmlFor="occupation-family-filter">
            <span className="text-sm font-semibold text-slate-950">Velg yrkesfamilie</span>
            <select
              id="occupation-family-filter"
              className="h-11 min-w-0 w-full max-w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              disabled={occupationAreaFilter === "all"}
              onChange={(event) => setOccupationFamilyFilter(event.target.value)}
              value={occupationFamilyFilter}
            >
              <option value="all">Alle yrkesfamilier</option>
              {occupationFamilies.map((family) => (
                <option key={family.value} value={family.value}>
                  {family.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : filterByOccupationFamily ? (
        <div className="rounded-[5px] bg-white px-5 py-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
          <label className="grid min-w-0 gap-2" htmlFor="occupation-family-filter">
            <span className="text-sm font-semibold text-slate-950">Filtrer på yrkesfamilie</span>
            <select
              id="occupation-family-filter"
              className="h-11 min-w-0 w-full max-w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]"
              onChange={(event) => setOccupationFamilyFilter(event.target.value)}
              value={occupationFamilyFilter}
            >
              <option value="all">Alle yrkesfamilier</option>
              {occupationFamilies.map((family) => (
                <option key={family.value} value={family.value}>
                  {family.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <div className="rounded-[5px] bg-white px-5 py-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
          <label className="grid min-w-0 gap-2" htmlFor="salary-filter">
            <span className="text-sm font-semibold text-slate-950">{filterLabel}</span>
            <select
              id="salary-filter"
              className="h-11 min-w-0 w-full max-w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]"
              onChange={(event) => setSalaryFilter(event.target.value)}
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
      )}

      <p className="text-sm leading-6 text-slate-500">
        Viser {filteredItems.length.toLocaleString("nb-NO")} av {items.length.toLocaleString("nb-NO")} yrker.
      </p>

      {filteredItems.length > 0 ? (
        <div
          aria-label="Alle yrker med median samlet månedslønn"
          className="grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredItems.map((item) => {
            const cardStyle = colorByOccupationGroup
              ? { backgroundImage: getOccupationGroupGradient(item.occupationCode) }
              : undefined;
            const content = (
              <>
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    {item.title}
                  </h2>
                  {item.groupLabel ? (
                    <p className="mt-1 text-xs font-medium text-slate-700">{item.groupLabel}</p>
                  ) : null}
                </div>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  {valueLabel}:{" "}
                  <span className="font-semibold text-[var(--primary-strong)]">
                    {formatCurrency(getSalaryValue(item))}
                  </span>
                </p>
              </>
            );

            if (!item.href) {
              return (
                <article
                  key={item.occupationCode}
                  className="flex h-full min-h-36 flex-col justify-between rounded-[5px] bg-white p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]"
                  style={cardStyle}
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
                style={cardStyle}
              >
                {content}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[5px] bg-white px-5 py-8 text-center shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
          <p className="text-base font-semibold text-slate-950">
            Ingen yrker matcher {showSearch ? "søket" : "filteret"}.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {showSearch ? "Prøv et annet søkeord eller velg en annen " : "Velg en annen "}
            {filterByOccupationHierarchy || filterByOccupationFamily ? "yrkesinndeling" : "lønnsnivå"}.
          </p>
        </div>
      )}
    </section>
  );
}

function matchesSalaryFilter(
  value: number | undefined,
  filter: string,
  salaryFilters: SalaryFilterOption[],
) {
  if (filter === "all") {
    return true;
  }

  if (value === undefined) {
    return false;
  }

  const filterOption = salaryFilters.find((option) => option.value === filter);

  if (!filterOption) {
    return true;
  }

  if (filterOption.min !== undefined && value < filterOption.min) {
    return false;
  }

  if (filterOption.max !== undefined && value >= filterOption.max) {
    return false;
  }

  return true;
}

function getSalaryValue(item: OccupationDirectoryItem) {
  return item.salaryValue ?? item.monthlySalary;
}

function getOccupationGroupGradient(occupationCode: string) {
  return (
    occupationGroupGradients[occupationCode.charAt(0)] ??
    "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)"
  );
}

function buildFilterOptions(
  items: OccupationDirectoryItem[],
  codeKey: "groupCode" | "areaCode" | "familyCode",
  labelKey: "groupLabel" | "areaLabel" | "familyLabel",
) {
  return Array.from(
    new Map(
      items.flatMap((item) => {
        const value = item[codeKey];
        const label = item[labelKey];

        return value && label ? [[value, label] as const] : [];
      }),
    ),
  )
    .map(([value, label]) => ({ value, label }))
    .sort((left, right) => left.label.localeCompare(right.label, "nb-NO"));
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
