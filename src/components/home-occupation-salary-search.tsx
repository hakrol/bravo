"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AllOccupationsSalaryChart } from "@/components/all-occupations-salary-chart";
import { HomeAboutInsightSection } from "@/components/home-about-insight-section";
import { HomeExploreOccupationsSection } from "@/components/home-explore-occupations-section";
import {
  HomeHeroSearch,
  HomeOccupationSearchField,
} from "@/components/home-hero-search";
import { HomeOccupationCards } from "@/components/home-occupation-cards";
import { HomeSalaryCheckSection } from "@/components/home-salary-check-section";
import type { OccupationSalaryRow } from "@/components/occupation-salary-overview";
import type { OccupationCardStats } from "@/lib/occupation-card-stats";
import type { OccupationPurchasingPowerTimeSeries, OccupationSalaryTimeSeries } from "@/lib/types";

type HomeOccupationSalarySearchProps = {
  allOccupationsPurchasingPowerSeries: OccupationPurchasingPowerTimeSeries;
  allOccupationsSalarySeries: OccupationSalaryTimeSeries;
  occupationCardStatsByCode: Record<string, OccupationCardStats>;
  periodLabel?: string;
  rows: OccupationSalaryRow[];
};

export function HomeOccupationSalarySearch({
  allOccupationsPurchasingPowerSeries,
  allOccupationsSalarySeries,
  occupationCardStatsByCode,
  periodLabel,
  rows,
}: HomeOccupationSalarySearchProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery.trim());

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (!normalizedQuery) {
          return true;
        }

        const occupationLabel = normalizeText(row.occupationLabel);
        const occupationCode = normalizeText(row.occupationCode);
        return occupationLabel.includes(normalizedQuery) || occupationCode.includes(normalizedQuery);
      }),
    [normalizedQuery, rows],
  );

  return (
    <>
      <HomeHeroSearch
        occupationCardStatsByCode={occupationCardStatsByCode}
        periodLabel={periodLabel}
        rows={rows}
      />

      <section
        className="relative left-1/2 w-screen -translate-x-1/2 bg-[#fafafa] px-5 py-20 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <HomeOccupationSearchField onQueryChange={setQuery} query={query} />
          <HomeOccupationCards
            occupationCardStatsByCode={occupationCardStatsByCode}
            query={query}
            rows={filteredRows}
            sourceRows={rows}
          />
        </div>
      </section>

      <AllOccupationsSalaryChart
        purchasingPowerSeries={allOccupationsPurchasingPowerSeries}
        series={allOccupationsSalarySeries}
      />
      <HomeExploreOccupationsSection />
      <HomeSalaryCheckSection />
      <HomeAboutInsightSection />
    </>
  );
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}
