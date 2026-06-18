import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import commonOccupationsSnapshot from "@/content/blog/data/norges-vanligste-yrker-2026.json";

type CommonOccupationRow = {
  label: string;
  href: string;
  employees: number;
  salaryGrowth: {
    points: {
      label: string;
      value: number;
    }[];
  };
};

type CommonOccupationsSnapshot = {
  source: string;
  rows: CommonOccupationRow[];
};

const snapshot = commonOccupationsSnapshot as CommonOccupationsSnapshot;
const seriesColors = [
  "#14532d",
  "#b45309",
  "#2563eb",
  "#7c3aed",
  "#0f766e",
  "#9f1239",
  "#4338ca",
  "#a16207",
  "#0369a1",
  "#4d7c0f",
];

const compactLabels: Record<string, string> = {
  "Barnehage- og skolefritidsassistenter mv.": "Barnehage- og SFO-assistenter",
  "Høyere saksbehandlere i offentlig og privat virksomhet": "Høyere saksbehandlere",
};

export function NorwayCommonOccupationsChart() {
  return (
    <EditorialDivergingBarChart
      data={snapshot.rows.map((row, index) => ({
        href: row.href,
        label: compactLabels[row.label] ?? row.label,
        value: row.employees,
        highlight: index === 0,
      }))}
      format="number"
      kicker="Vanligste yrker"
      source={snapshot.source}
      subtitleLabel="Antall lønnstakere"
      subtitleText="i 1. kvartal 2026, sortert fra flest til færrest"
      ticks={[0, 40000, 80000, 120000, 160000, 180000]}
      title="Butikkmedarbeidere er Norges største yrkesgruppe"
    />
  );
}

export function NorwayCommonOccupationsSalaryGrowthChart() {
  const series: BlogSalaryDevelopmentSeries[] = snapshot.rows.map((row, index) => ({
    color: seriesColors[index % seriesColors.length],
    label: compactLabels[row.label] ?? row.label,
    points: row.salaryGrowth.points,
  }));

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser gjennomsnittlig avtalt månedslønn for begge kjønn og alle aldre. Hvert punkt gjelder 1. kvartal."
      series={series}
      source="SSB tabell 11658"
      subtitle="Velg yrke for å se utviklingen fra 1. kvartal 2021 til 1. kvartal 2026."
      title="Lønnen steg med mellom 22 og 27 prosent på fem år"
      yAxisLabel="Gjennomsnittlig avtalt månedslønn"
    />
  );
}
