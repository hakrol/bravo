"use client";

import Link from "next/link";
import { type ReactNode, useDeferredValue, useState } from "react";
import {
  OccupationCardStatsRow,
  type OccupationCardStatKey,
} from "@/components/occupation-card-stats-row";
import { MetricInfoButton } from "@/components/metric-info-button";
import { getOccupationGroupGradient } from "@/lib/occupation-group-colors";

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
  cardStats?: {
    salaryGrowthPercent?: number;
    employeeGrowthPercent?: number;
    averageAge?: number;
    genderPayGapPercent?: number;
  };
  href?: string;
  searchText?: string;
};

type CardStatMetric = OccupationCardStatKey;

type OccupationDirectoryProps = {
  items: OccupationDirectoryItem[];
  valueLabel?: string;
  filterLabel?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  resultNoun?: string;
  resultsAriaLabel?: string;
  salaryFilters?: SalaryFilterOption[];
  colorByOccupationGroup?: boolean;
  filterByOccupationHierarchy?: boolean;
  filterByOccupationFamily?: boolean;
  showSearch?: boolean;
  featuredControls?: boolean;
  cardStatMetrics?: CardStatMetric[];
};

type QuickFilter = "highest-salary" | "salary-growth" | "highest-age" | "employee-growth";

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

export function OccupationDirectory({
  items,
  valueLabel = "Median månedslønn",
  filterLabel = "Filtrer på lønn",
  searchLabel = "Søk etter yrke",
  searchPlaceholder = "Skriv f.eks. flyger",
  resultNoun = "yrker",
  resultsAriaLabel,
  salaryFilters = defaultSalaryFilters,
  colorByOccupationGroup = false,
  filterByOccupationHierarchy = false,
  filterByOccupationFamily = false,
  showSearch = true,
  featuredControls = false,
  cardStatMetrics = ["salaryGrowth", "employeeGrowth", "averageAge", "genderPayGap"],
}: OccupationDirectoryProps) {
  const [query, setQuery] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [occupationGroupFilter, setOccupationGroupFilter] = useState("all");
  const [occupationAreaFilter, setOccupationAreaFilter] = useState("all");
  const [occupationFamilyFilter, setOccupationFamilyFilter] = useState("all");
  const [quickFilter, setQuickFilter] = useState<QuickFilter | null>(null);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery);
  const occupationGroups = buildFilterOptions(items, "groupCode", "groupLabel");
  const occupationAreas = buildFilterOptions(items, "areaCode", "areaLabel");
  const occupationFamilies = buildFilterOptions(items, "familyCode", "familyLabel");

  const filteredItems = items.filter((item) => {
    const searchableText = featuredControls
      ? `${item.title} ${item.occupationCode}`
      : (item.searchText ?? `${item.title} ${item.occupationCode}`);
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
  const displayedItems = sortByQuickFilter(filteredItems, quickFilter);
  const resultListLabel =
    resultsAriaLabel ?? `Alle ${resultNoun} med ${valueLabel.toLocaleLowerCase("nb-NO")}`;
  const handleOccupationGroupChange = (value: string) => {
    setOccupationGroupFilter(value);

    if (value === "all") {
      return;
    }

    if (occupationAreaFilter !== "all" && !occupationAreaFilter.startsWith(value)) {
      setOccupationAreaFilter("all");
      setOccupationFamilyFilter("all");
      return;
    }

    if (occupationFamilyFilter !== "all" && !occupationFamilyFilter.startsWith(value)) {
      setOccupationFamilyFilter("all");
    }
  };
  const handleOccupationAreaChange = (value: string) => {
    setOccupationAreaFilter(value);

    if (value === "all") {
      return;
    }

    if (occupationGroupFilter !== "all" && !value.startsWith(occupationGroupFilter)) {
      setOccupationGroupFilter("all");
    }

    if (occupationFamilyFilter !== "all" && !occupationFamilyFilter.startsWith(value)) {
      setOccupationFamilyFilter("all");
    }
  };
  const handleOccupationFamilyChange = (value: string) => {
    setOccupationFamilyFilter(value);

    if (value === "all") {
      return;
    }

    if (occupationGroupFilter !== "all" && !value.startsWith(occupationGroupFilter)) {
      setOccupationGroupFilter("all");
    }

    if (occupationAreaFilter !== "all" && !value.startsWith(occupationAreaFilter)) {
      setOccupationAreaFilter("all");
    }
  };

  return (
    <section className="grid gap-5">
      {featuredControls ? (
        <div className="rounded-[16px] border border-[rgba(15,45,33,0.08)] bg-white px-4 py-5 shadow-[0_14px_40px_rgba(28,47,39,0.10)] sm:px-6 sm:py-6 lg:px-8">
          {showSearch ? (
            <label className="grid min-w-0 gap-2" htmlFor="occupation-search">
              <span className="text-sm font-semibold text-slate-950">{searchLabel}</span>
              <span className="relative block">
                <span className="pointer-events-none absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#edf6ef] text-[var(--primary-strong)]">
                  <DirectoryIcon name="search" />
                </span>
                <input
                  id="occupation-search"
                  className="min-h-[60px] w-full min-w-0 rounded-[11px] border border-[rgba(45,112,76,0.65)] bg-white py-3 pl-[60px] pr-5 text-base text-slate-950 outline-none transition placeholder:text-slate-500 hover:border-[#2d704c] focus:border-[#2d704c] focus:shadow-[0_0_0_4px_rgba(45,112,76,0.12)]"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  type="search"
                  value={query}
                />
              </span>
            </label>
          ) : null}

          {filterByOccupationHierarchy ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid min-w-0 gap-2">
              <FilterLabel
                description="Yrkesgruppe er det øverste og bredeste nivået i yrkesinndelingen. Den samler yrker med lignende hovedoppgaver, for eksempel ledere eller salgs- og serviceyrker."
                htmlFor="occupation-group-filter"
                label="Yrkesgruppe"
              />
              <span className="relative block min-w-0">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-700">
                  <DirectoryIcon name="people" />
                </span>
                <select
                  id="occupation-group-filter"
                  className="h-12 w-full min-w-0 appearance-none truncate rounded-[10px] border border-slate-300 bg-white py-2 pl-12 pr-11 text-base text-slate-800 outline-none transition hover:border-slate-400 focus:border-[#2d704c] focus:shadow-[0_0_0_4px_rgba(45,112,76,0.12)]"
                  onChange={(event) => handleOccupationGroupChange(event.target.value)}
                  value={occupationGroupFilter}
                >
                  <option value="all">Alle yrkesgrupper</option>
                  {occupationGroups.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-700">
                  <DirectoryIcon name="chevron" />
                </span>
              </span>
            </div>

            <div className="grid min-w-0 gap-2">
              <FilterLabel
                description="Yrkesområde er nivået under yrkesgruppe. Det avgrenser yrkene til et mer spesifikt fag- eller arbeidsområde, men omfatter fortsatt flere yrkesfamilier."
                htmlFor="occupation-area-filter"
                label="Yrkesområde"
              />
              <span className="relative block min-w-0">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-700">
                  <DirectoryIcon name="grid" />
                </span>
                <select
                  id="occupation-area-filter"
                  className="h-12 w-full min-w-0 appearance-none truncate rounded-[10px] border border-slate-300 bg-white py-2 pl-12 pr-11 text-base text-slate-800 outline-none transition hover:border-slate-400 focus:border-[#2d704c] focus:shadow-[0_0_0_4px_rgba(45,112,76,0.12)]"
                  onChange={(event) => handleOccupationAreaChange(event.target.value)}
                  value={occupationAreaFilter}
                >
                  <option value="all">Alle yrkesområder</option>
                  {occupationAreas.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-700">
                  <DirectoryIcon name="chevron" />
                </span>
              </span>
            </div>

            <div className="grid min-w-0 gap-2 md:col-span-2 lg:col-span-1">
              <FilterLabel
                description="Yrkesfamilie er nivået under yrkesområde. Den samler nært beslektede yrker med lignende arbeidsoppgaver, før inndelingen går videre til det enkelte yrket."
                htmlFor="occupation-family-filter"
                label="Yrkesfamilie"
              />
              <span className="relative block min-w-0">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-700">
                  <DirectoryIcon name="folder" />
                </span>
                <select
                  id="occupation-family-filter"
                  className="h-12 w-full min-w-0 appearance-none truncate rounded-[10px] border border-slate-300 bg-white py-2 pl-12 pr-11 text-base text-slate-800 outline-none transition hover:border-slate-400 focus:border-[#2d704c] focus:shadow-[0_0_0_4px_rgba(45,112,76,0.12)]"
                  onChange={(event) => handleOccupationFamilyChange(event.target.value)}
                  value={occupationFamilyFilter}
                >
                  <option value="all">Alle yrkesfamilier</option>
                  {occupationFamilies.map((family) => (
                    <option key={family.value} value={family.value}>
                      {family.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-700">
                  <DirectoryIcon name="chevron" />
                </span>
              </span>
            </div>
            </div>
          ) : filterByOccupationFamily ? (
            <div className="mt-5 max-w-xl">
              <div className="grid min-w-0 gap-2">
                <FilterLabel
                  description="Yrkesfamilie samler nært beslektede yrker med lignende arbeidsoppgaver innenfor denne yrkesgruppen."
                  htmlFor="occupation-family-filter"
                  label="Yrkesfamilie"
                />
                <span className="relative block min-w-0">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-700">
                    <DirectoryIcon name="folder" />
                  </span>
                  <select
                    id="occupation-family-filter"
                    className="h-12 w-full min-w-0 appearance-none truncate rounded-[10px] border border-slate-300 bg-white py-2 pl-12 pr-11 text-base text-slate-800 outline-none transition hover:border-slate-400 focus:border-[#2d704c] focus:shadow-[0_0_0_4px_rgba(45,112,76,0.12)]"
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
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-700">
                    <DirectoryIcon name="chevron" />
                  </span>
                </span>
              </div>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-5">
            <span className="mr-1 text-sm font-medium text-slate-600">Hurtigfilter:</span>
            <QuickFilterButton
              active={quickFilter === "highest-salary"}
              icon="salary"
              label="Høyest lønn"
              onClick={() =>
                setQuickFilter((current) =>
                  current === "highest-salary" ? null : "highest-salary",
                )
              }
            />
            <QuickFilterButton
              active={quickFilter === "salary-growth"}
              icon="trend"
              label="Størst lønnsvekst"
              onClick={() =>
                setQuickFilter((current) =>
                  current === "salary-growth" ? null : "salary-growth",
                )
              }
            />
            <QuickFilterButton
              active={quickFilter === "highest-age"}
              icon="age"
              label="Høyest alder"
              onClick={() =>
                setQuickFilter((current) =>
                  current === "highest-age" ? null : "highest-age",
                )
              }
            />
            <QuickFilterButton
              active={quickFilter === "employee-growth"}
              icon="people"
              label="Størst vekst i arbeidstakere"
              onClick={() =>
                setQuickFilter((current) =>
                  current === "employee-growth" ? null : "employee-growth",
                )
              }
            />
          </div>
        </div>
      ) : (
        <>
      {showSearch ? (
        <div className="rounded-[5px] bg-white px-5 py-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
          <label className="grid min-w-0 gap-2" htmlFor="occupation-search">
            <span className="text-sm font-semibold text-slate-950">{searchLabel}</span>
            <input
              id="occupation-search"
              className="h-11 min-w-0 w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
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
              onChange={(event) => handleOccupationGroupChange(event.target.value)}
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
              className="h-11 min-w-0 w-full max-w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]"
              onChange={(event) => handleOccupationAreaChange(event.target.value)}
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
              className="h-11 min-w-0 w-full max-w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]"
              onChange={(event) => handleOccupationFamilyChange(event.target.value)}
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
        </>
      )}

      <p className="text-sm leading-6 text-slate-500">
        Viser {filteredItems.length.toLocaleString("nb-NO")} av{" "}
        {items.length.toLocaleString("nb-NO")} {resultNoun}.
      </p>

      {filteredItems.length > 0 ? (
        <div
          aria-label={resultListLabel}
          className="grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayedItems.map((item) => {
            const cardStyle = colorByOccupationGroup
              ? { backgroundImage: getOccupationGroupGradient(item.occupationCode) }
              : undefined;
            const content = (
              <>
                <div className="min-w-0">
                  <h2 className="text-balance text-xl font-semibold leading-tight tracking-normal text-slate-950">
                    {item.title}
                  </h2>
                  {item.groupLabel ? (
                    <p className="mt-1 text-sm font-medium leading-5 text-slate-700">
                      {item.groupLabel}
                    </p>
                  ) : null}
                </div>
                <div className="mt-6">
                  <p className="text-sm font-medium leading-5 text-slate-600">{valueLabel}</p>
                  <p className="mt-1 text-3xl font-semibold leading-none tracking-normal text-[var(--primary-strong)]">
                    {formatCurrency(getSalaryValue(item))}
                  </p>
                </div>
                <OccupationCardStatsRow
                  gridClassName="grid-cols-2"
                  metrics={cardStatMetrics}
                  stats={item.cardStats}
                />
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
                prefetch={false}
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
            Ingen {resultNoun} matcher {showSearch ? "søket" : "filteret"}.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {showSearch ? "Prøv et annet søkeord eller velg " : "Velg "}
            {filterByOccupationHierarchy || filterByOccupationFamily
              ? "en annen yrkesinndeling"
              : "et annet lønnsnivå"}
            .
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

function sortByQuickFilter(items: OccupationDirectoryItem[], quickFilter: QuickFilter | null) {
  if (!quickFilter) {
    return items;
  }

  return [...items].sort((left, right) => {
    let difference = 0;

    if (quickFilter === "highest-salary") {
      difference = (getSalaryValue(right) ?? Number.NEGATIVE_INFINITY) -
        (getSalaryValue(left) ?? Number.NEGATIVE_INFINITY);
    }

    if (quickFilter === "salary-growth") {
      difference = (right.cardStats?.salaryGrowthPercent ?? Number.NEGATIVE_INFINITY) -
        (left.cardStats?.salaryGrowthPercent ?? Number.NEGATIVE_INFINITY);
    }

    if (quickFilter === "employee-growth") {
      difference = (right.cardStats?.employeeGrowthPercent ?? Number.NEGATIVE_INFINITY) -
        (left.cardStats?.employeeGrowthPercent ?? Number.NEGATIVE_INFINITY);
    }

    if (quickFilter === "highest-age") {
      difference = (right.cardStats?.averageAge ?? Number.NEGATIVE_INFINITY) -
        (left.cardStats?.averageAge ?? Number.NEGATIVE_INFINITY);
    }

    return difference || left.title.localeCompare(right.title, "nb-NO");
  });
}

function FilterLabel({
  description,
  htmlFor,
  label,
}: {
  description: string;
  htmlFor: string;
  label: string;
}) {
  return (
    <div className="flex min-h-5 items-center gap-1.5">
      <label className="text-sm font-semibold text-slate-950" htmlFor={htmlFor}>
        {label}
      </label>
      <MetricInfoButton description={description} label={label} variant="muted" />
    </div>
  );
}

function QuickFilterButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon?: "age" | "people" | "salary" | "trend";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium outline-none transition focus-visible:border-[#2d704c] focus-visible:shadow-[0_0_0_4px_rgba(45,112,76,0.12)] ${
        active
          ? "border-[#a9cbb2] bg-[#eaf5ec] text-[var(--primary-strong)]"
          : "border-[rgba(15,45,33,0.10)] bg-[#f8faf8] text-slate-700 hover:border-[#a9cbb2] hover:bg-[#f0f7f1] hover:text-[var(--primary-strong)]"
      }`}
      onClick={onClick}
      type="button"
    >
      {icon ? <DirectoryIcon name={icon} /> : null}
      <span>{label}</span>
    </button>
  );
}

type DirectoryIconName =
  | "age"
  | "chevron"
  | "folder"
  | "grid"
  | "people"
  | "salary"
  | "search"
  | "trend";

function DirectoryIcon({ name }: { name: DirectoryIconName }) {
  const paths: Record<DirectoryIconName, ReactNode> = {
    age: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    chevron: <path d="m7 10 5 5 5-5" />,
    folder: (
      <>
        <path d="M3.5 7.5h6l2-2h3l2 2h4v10.25a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75Z" />
        <path d="M3.5 10h17" />
      </>
    ),
    grid: (
      <>
        <rect height="5" rx="1" width="5" x="4" y="4" />
        <rect height="5" rx="1" width="5" x="15" y="4" />
        <rect height="5" rx="1" width="5" x="4" y="15" />
        <rect height="5" rx="1" width="5" x="15" y="15" />
      </>
    ),
    people: (
      <>
        <path d="M15.5 20v-1.5a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4V20" />
        <circle cx="9.5" cy="7.5" r="3.5" />
        <path d="M15 5.2a3.5 3.5 0 0 1 0 6.6M17 14.7a4 4 0 0 1 3.5 3.8V20" />
      </>
    ),
    salary: (
      <>
        <path d="M4 17 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
    trend: (
      <>
        <path d="M4 16 9 11l3 3 7-8" />
        <path d="M14 6h5v5" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
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
