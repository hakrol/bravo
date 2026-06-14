import { BlogSalaryDevelopmentChart, type BlogSalaryDevelopmentSeries } from "@/components/blog-salary-development-chart";
import millionSalarySnapshot from "@/content/blog/data/yrker-over-en-million-2025.json";

type SalaryDevelopmentPoint = {
  label: string;
  value: number;
};

type SalaryDevelopmentSeriesRow = {
  label: string;
  points: SalaryDevelopmentPoint[];
};

type MillionSalarySnapshot = {
  salaryDevelopmentSeries: SalaryDevelopmentSeriesRow[];
};

const seriesColors = ["#14532d", "#b45309", "#2563eb", "#7c3aed", "#0f766e"];

const snapshot = millionSalarySnapshot as MillionSalarySnapshot;
const compactLabels: Record<string, string> = {
  "Prosessoperatører (oppredning)": "Prosessoperatører",
  "Innehavere av kiosk/liten butikk": "Kiosk/liten butikk",
  "Salgskonsulenter innen IKT-produkter": "IKT-salgskonsulenter",
};

function getSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  return snapshot.salaryDevelopmentSeries.map((row, index) => ({
    color: seriesColors[index % seriesColors.length],
    label: compactLabels[row.label] ?? row.label,
    points: row.points,
  }));
}

export function MillionSalaryGrowthChart() {
  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser gjennomsnittlig avtalt månedslønn for begge kjønn og alle aldre. Hvert punkt gjelder 1. kvartal."
      series={getSalaryDevelopmentSeries()}
      source="SSB tabell 11658"
      subtitle="Yrkene med størst prosentvis vekst fra 1. kvartal 2021 til 1. kvartal 2026."
      title="Disse yrkene hadde sterkest femårsvekst i avtalt månedslønn"
      yAxisLabel="Gjennomsnittlig avtalt månedslønn"
    />
  );
}
