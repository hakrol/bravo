"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { OccupationStatGrid } from "@/components/occupation-card-stats-row";
import { getOccupationGroupGradient } from "@/lib/occupation-group-colors";

type OccupationLinkGridItem = {
  title: string;
  description?: string;
  href: string;
  occupationGroupCode?: string;
  salaryValue?: number;
};

type OccupationLinkGridProps = {
  title: string;
  description?: string;
  items: OccupationLinkGridItem[];
  eyebrow?: string;
  compact?: boolean;
  colorByOccupationGroup?: boolean;
  plainCenteredHeader?: boolean;
  sortBySalary?: boolean;
};

export function OccupationLinkGrid({
  title,
  description,
  items,
  eyebrow,
  compact = false,
  colorByOccupationGroup = false,
  plainCenteredHeader = false,
  sortBySalary = false,
}: OccupationLinkGridProps) {
  const [sortOrder, setSortOrder] = useState("alphabetical");
  const sortedItems = useMemo(() => {
    if (!sortBySalary || sortOrder === "alphabetical") {
      return items;
    }

    return [...items].sort((left, right) => {
      const leftSalary = left.salaryValue ?? -1;
      const rightSalary = right.salaryValue ?? -1;

      return sortOrder === "salary-desc"
        ? rightSalary - leftSalary
        : leftSalary - rightSalary;
    });
  }, [items, sortBySalary, sortOrder]);

  return (
    <div className="min-h-screen px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header
          className={
            plainCenteredHeader
              ? "mx-auto max-w-3xl space-y-4 text-center"
              : "relative overflow-hidden rounded-[5px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,251,0.96))] px-6 py-8 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:px-8 sm:py-10 lg:px-10"
          }
        >
          {!plainCenteredHeader ? (
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,83,45,0.22),transparent)]" />
          ) : null}
          <div className={plainCenteredHeader ? "space-y-4" : "relative max-w-3xl space-y-3"}>
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary-strong)]">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-balance text-slate-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description ? (
              <p
                className={
                  plainCenteredHeader
                    ? "text-base leading-7 text-slate-600 sm:text-lg"
                    : "max-w-3xl text-base leading-7 text-[var(--muted)]"
                }
              >
                {description}
              </p>
            ) : null}
          </div>
        </header>

        {sortBySalary ? (
          <div className="rounded-[5px] bg-white px-5 py-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
            <label className="grid min-w-0 gap-2 sm:max-w-xs" htmlFor="link-grid-sort">
              <span className="text-sm font-semibold text-slate-950">Sorter etter</span>
              <select
                id="link-grid-sort"
                className="h-11 min-w-0 w-full rounded-[5px] border border-black/8 bg-white px-4 text-base text-slate-950 outline-none transition-all duration-200 hover:border-black/14 focus:border-[rgba(20,83,45,0.32)] focus:ring-4 focus:ring-[rgba(20,83,45,0.10)]"
                onChange={(event) => setSortOrder(event.target.value)}
                value={sortOrder}
              >
                <option value="alphabetical">Alfabetisk</option>
                <option value="salary-desc">Høyest lønn først</option>
                <option value="salary-asc">Lavest lønn først</option>
              </select>
            </label>
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sortedItems.map((item) => {
            const cardStyle =
              colorByOccupationGroup && item.occupationGroupCode
                ? { backgroundImage: getOccupationGroupGradient(item.occupationGroupCode) }
                : undefined;

            return (
              <Link
                key={item.href}
                className={[
                  "group rounded-[5px] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.05)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
                  compact
                    ? "px-5 py-4 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
                    : "px-6 py-5 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(15,23,42,0.08)]",
                ].join(" ")}
                href={item.href}
                prefetch={false}
                style={cardStyle}
              >
                <div className={`flex h-full flex-col ${compact ? "gap-2" : "gap-3"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <h2
                      className={[
                        "font-semibold tracking-[-0.03em] text-slate-950",
                        compact ? "text-base leading-6" : "text-lg",
                      ].join(" ")}
                    >
                      {item.title}
                    </h2>
                    <span
                      aria-hidden="true"
                      className="text-base text-[var(--primary-strong)] transition-transform group-hover:translate-x-0.5"
                    >
                      &gt;
                    </span>
                  </div>
                  {!compact && item.description ? (
                    <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                  ) : null}
                  {item.salaryValue !== undefined ? (
                    <OccupationStatGrid
                      className="mt-auto pt-3"
                      gridClassName="grid-cols-1"
                      metrics={[
                        {
                          icon: "salary",
                          label: "Median månedslønn",
                          value: formatCurrency(item.salaryValue),
                          valueClassName: "text-[var(--primary-strong)]",
                        },
                      ]}
                      withTopBorder={false}
                    />
                  ) : null}
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("nb-NO", {
    maximumFractionDigits: 0,
  })} kr`;
}
