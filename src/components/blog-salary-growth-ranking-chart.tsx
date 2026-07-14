import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import salaryGrowthRankingSnapshot from "@/content/blog/data/de-10-yrkene-med-storst-lonnsvekst-2024-2025.json";

type SalaryGrowthRankingRow = {
  rank: number;
  label: string;
  href: string;
  value: number;
};

type SalaryGrowthRankingSnapshot = {
  rows: SalaryGrowthRankingRow[];
  allOccupations: {
    growthPercent: number;
  } | null;
};

const snapshot = salaryGrowthRankingSnapshot as SalaryGrowthRankingSnapshot;

export function TopSalaryGrowth2024To2025Chart() {
  const topRows = snapshot.rows.slice(0, 10);
  const chartRows = [
    ...topRows.map((row) => ({
      href: row.href,
      label: `${row.rank}. ${row.label}`,
      value: row.value,
      highlight: row.rank === 1,
    })),
    ...(snapshot.allOccupations
      ? [
          {
            label: "Alle yrker",
            value: snapshot.allOccupations.growthPercent,
          },
        ]
      : []),
  ];

  return (
    <EditorialDivergingBarChart
      data={chartRows}
      format="percent"
      kicker="Lønnsvekst"
      note="Rangeringen bruker median månedslønn i 2024 og 2025 for firesifrede STYRK-08-yrker. Samlegrupper, uoppgitte yrker og manglende verdier er utelatt."
      source="SSB tabell 11418"
      subtitleLabel="Prosentvis vekst"
      subtitleText="i median månedslønn fra 2024 til 2025, begge kjønn, alle sektorer og arbeidstid i alt."
      ticks={[0, 5, 10, 15]}
      title="Teknikere innen luftfartssikkerhet økte mest"
    />
  );
}
