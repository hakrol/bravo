import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";

const doctorSalaryRows = [
  {
    label: "Legespesialister",
    value: 107160,
  },
  {
    label: "Allmennpraktiserende leger",
    value: 83080,
  },
  {
    label: "Tannleger",
    value: 75000,
  },
  {
    label: "Spesialsykepleiere",
    value: 63810,
  },
  {
    label: "Alle yrker",
    value: 55800,
    highlight: true,
  },
];

export function DoctorSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={doctorSalaryRows}
      format="currency"
      kicker="Legelønn"
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for utvalgte helseyrker, SSB 2025"
      ticks={[0, 30000, 60000, 90000, 120000]}
      title="Hva tjener leger?"
    />
  );
}
