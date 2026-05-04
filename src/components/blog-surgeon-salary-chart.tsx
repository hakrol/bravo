import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";

const surgeonSalaryRows = [
  {
    label: "Legespesialister",
    value: 107160,
    highlight: true,
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
  },
];

const surgeonSalaryBubbleData: BlogChartDatum[] = [
  {
    label: "Legespesialister",
    value: 107160,
    size: 18271,
    sizeLabel: "18 271 lønnstakere",
    category: "highlight",
    note: "Nærmeste tilgjengelige SSB-gruppe for kirurg i dette datagrunnlaget.",
  },
  {
    label: "Allmennpraktiserende leger",
    value: 83080,
    size: 8888,
    sizeLabel: "8 888 lønnstakere",
  },
  {
    label: "Spesialsykepleiere",
    value: 63810,
    size: 30211,
    sizeLabel: "30 211 lønnstakere",
  },
  {
    label: "Sykepleiere",
    value: 57830,
    size: 61314,
    sizeLabel: "61 314 lønnstakere",
  },
];

export function SurgeonSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={surgeonSalaryRows}
      format="currency"
      kicker="Kirurglønn"
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for utvalgte lege- og helseyrker, SSB 2025"
      ticks={[0, 30000, 60000, 90000, 120000]}
      title="Hva tjener kirurger?"
    />
  );
}

export function SurgeonSalaryBubbleChart() {
  return (
    <BlogChart
      data={surgeonSalaryBubbleData}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 2025K4 fra SSB tabell 11658."
      sort="none"
      source="SSB tabell 11418 og 11658"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Legespesialister er høytlønte, men færre enn flere helseyrker"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
