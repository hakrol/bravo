import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { BlogSalaryDevelopmentChart, type BlogSalaryDevelopmentSeries } from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import konduktorLonn2025Snapshot from "@/content/blog/data/konduktor-lonn-2025.json";

type KonduktorSalarySnapshot = {
  source: string;
  rows: {
    code: string;
    label: string;
    href: string;
    value: number | null;
  }[];
  genderMedian: {
    occupationLabel: string;
    period: string;
    source: string;
    womenMonthlyMedian: number;
    menMonthlyMedian: number;
  };
  salaryDevelopment: {
    occupationLabel: string;
    source: string;
    note: string;
    rows: {
      label: string;
      value: number;
    }[];
  };
};

const editorialLabels = [
  "Konduktører",
  "Kjøreskolelærere",
  "Begravelsesbyrå- og krematoriearbeidere",
  "Vaktmestre",
  "Renholdsledere i bedrifter",
  "Reiseledere og guider",
  "Flyverter, båtverter mv.",
];

function getSnapshot() {
  return konduktorLonn2025Snapshot as KonduktorSalarySnapshot;
}

function getEditorialRows() {
  const snapshot = getSnapshot();

  return editorialLabels.flatMap((label) => {
    const row = snapshot.rows.find((entry) => entry.label === label);

    if (!row || typeof row.value !== "number") {
      return [];
    }

    return [
      {
        href: row.href,
        label: row.label,
        value: row.value,
        highlight: row.label === "Konduktører",
      },
    ];
  });
}

function getSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  const snapshot = getSnapshot();

  return [
    {
      color: "#14532d",
      label: snapshot.salaryDevelopment.occupationLabel,
      points: snapshot.salaryDevelopment.rows,
    },
  ];
}

export function KonduktorGenderSalaryCards() {
  const gender = getSnapshot().genderMedian;

  return (
    <BlogGenderSalaryCards
      occupationLabel={gender.occupationLabel}
      period={gender.period}
      source={gender.source}
      womenMonthlyMedian={gender.womenMonthlyMedian}
      menMonthlyMedian={gender.menMonthlyMedian}
    />
  );
}

export function KonduktorSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median månedslønn for STYRK-08 5112 Konduktører i privat sektor og offentlige eide foretak. Hovedtallet i artikkelen bruker median månedslønn for yrket samlet i 2025."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median månedslønn for konduktører fra 2021 til 2025."
      title="Konduktørlønnen økte med 11 900 kroner på fem år"
      yAxisLabel="Median månedslønn"
    />
  );
}

export function KonduktorSalaryEditorialChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Konduktørlønn"
      source={snapshot.source}
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for konduktører og utvalgte nærliggende serviceyrker, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 70000]}
      title="Konduktører ligger høyt blant nærliggende serviceyrker"
    />
  );
}
