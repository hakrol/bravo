"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AllOccupationsSalaryChart } from "@/components/all-occupations-salary-chart";
import { HomeAboutInsightSection } from "@/components/home-about-insight-section";
import { HomeExploreOccupationsSection } from "@/components/home-explore-occupations-section";
import { HomeHeroSearch } from "@/components/home-hero-search";
import { HomeOccupationCards } from "@/components/home-occupation-cards";
import type { OccupationSalaryRow } from "@/components/occupation-salary-overview";
import type { OccupationCardStats } from "@/lib/occupation-card-stats";
import type { OccupationPurchasingPowerTimeSeries, OccupationSalaryTimeSeries } from "@/lib/types";

type HomeOccupationSalarySearchProps = {
  allOccupationsPurchasingPowerSeries: OccupationPurchasingPowerTimeSeries;
  allOccupationsSalarySeries: OccupationSalaryTimeSeries;
  occupationCardStatsByCode: Record<string, OccupationCardStats>;
  rows: OccupationSalaryRow[];
};

export function HomeOccupationSalarySearch({
  allOccupationsPurchasingPowerSeries,
  allOccupationsSalarySeries,
  occupationCardStatsByCode,
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
      <section className="fade-up relative left-1/2 isolate w-screen -translate-x-1/2 overflow-hidden px-5 pt-8 pb-10 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(20,83,45,0.11),transparent_42%),linear-gradient(180deg,#fbfbf8_0%,#fafafa_72%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
          <span className="absolute left-[8%] top-[9%] h-2.5 w-2.5 rounded-full bg-[#dce8df]" />
          <span className="absolute left-[24%] top-[2%] h-3 w-3 rounded-full bg-[#edf4ef]" />
          <span className="absolute right-[17%] top-[5%] h-2 w-2 rounded-full bg-[#d6e4d9]" />
          <span className="absolute right-[11%] top-[23%] h-2.5 w-2.5 rounded-full bg-[#dce8df]" />
          <span className="absolute left-[18%] top-[24%] h-2 w-2 rounded-full bg-[#eef5ef]" />
        </div>

        <HomeHeroSearch query={query} onQueryChange={setQuery} />
        <HomeOccupationCards
          occupationCardStatsByCode={occupationCardStatsByCode}
          query={query}
          rows={filteredRows}
          sourceRows={rows}
        />
      </section>

      <AllOccupationsSalaryChart
        purchasingPowerSeries={allOccupationsPurchasingPowerSeries}
        series={allOccupationsSalarySeries}
      />
      <HomeExploreOccupationsSection />
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
