import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { BlogSalaryDevelopmentChart, type BlogSalaryDevelopmentSeries } from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import storeManagerSnapshot from "@/content/blog/data/butikksjef-lonn-2025.json";

type StoreManagerSalarySnapshot = {
  source: string;
  rows: {
    code: string;
    label: string;
    href: string;
    value: number | null;
    employees?: number;
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
    rows: {
      label: string;
      value: number;
      women: number;
      men: number;
    }[];
  };
};

const comparisonLabels = [
  "Salgs- og markedssjefer",
  "Varehandelssjefer",
  "Hotellsjefer",
  "Restaurantsjefer",
  "Butikkavdelingssjefer",
  "Butikkmedarbeidere",
];

const bubbleLabels = [
  "Varehandelssjefer",
  "Butikkavdelingssjefer",
  "Butikkmedarbeidere",
  "Restaurantsjefer",
  "Hotellsjefer",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  Varehandelssjefer: { lane: 0.15, labelOffset: { x: 24, y: -18, anchor: "start" }, radiusBoost: 2, showLabel: true },
  Butikkavdelingssjefer: { lane: 0.38, labelOffset: { x: 24, y: -10, anchor: "start" }, radiusBoost: 6, showLabel: true },
  Butikkmedarbeidere: { lane: 0.75, labelOffset: { x: -34, y: 36, anchor: "end" }, radiusBoost: 10, showLabel: true },
  Restaurantsjefer: { lane: 0.58, labelOffset: { x: 24, y: -10, anchor: "start" }, showLabel: true },
  Hotellsjefer: { lane: 0.88, labelOffset: { x: 20, y: -10, anchor: "start" }, showLabel: true },
};

const bubbleDisplayLabels: Record<string, string> = {
  Butikkavdelingssjefer: "Butikk-\navdelingssjefer",
  Butikkmedarbeidere: "Butikk-\nmedarbeidere",
};

function getSnapshot() {
  return storeManagerSnapshot as StoreManagerSalarySnapshot;
}

function formatEmployeeCount(value: number) {
  return `${value.toLocaleString("nb-NO")} lønnstakere`;
}

function getComparisonRows() {
  const snapshot = getSnapshot();

  return comparisonLabels.flatMap((label) => {
    const row = snapshot.rows.find((entry) => entry.label === label);

    if (!row || typeof row.value !== "number") {
      return [];
    }

    return [
      {
        href: row.href,
        label: row.label,
        value: row.value,
        highlight: row.label === "Butikkavdelingssjefer",
      },
    ];
  });
}

function getBubbleData(): BlogChartDatum[] {
  const snapshot = getSnapshot();

  return bubbleLabels.flatMap((label) => {
    const row = snapshot.rows.find((entry) => entry.label === label);

    if (!row || typeof row.value !== "number" || typeof row.employees !== "number") {
      return [];
    }

    return [
      {
        label: row.label,
        shortLabel: bubbleDisplayLabels[row.label],
        value: row.value,
        size: row.employees,
        sizeLabel: formatEmployeeCount(row.employees),
        category: row.label === "Butikkavdelingssjefer" ? "highlight" : undefined,
        note: row.label === "Butikkavdelingssjefer" ? "Nærmeste SSB-gruppe for butikksjefer." : undefined,
        ...bubbleLayout[row.label],
      },
    ];
  });
}

function getSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  const snapshot = getSnapshot();

  return [
    {
      color: "#14532d",
      label: "Begge kjønn",
      points: snapshot.salaryDevelopment.rows.map((point) => ({
        label: point.label,
        value: point.value,
      })),
    },
    {
      color: "#0284c7",
      label: "Menn",
      points: snapshot.salaryDevelopment.rows.map((point) => ({
        label: point.label,
        value: point.men,
      })),
    },
    {
      color: "#db2777",
      label: "Kvinner",
      points: snapshot.salaryDevelopment.rows.map((point) => ({
        label: point.label,
        value: point.women,
      })),
    },
  ];
}

export function StoreManagerGenderSalaryCards() {
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

export function StoreManagerSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median månedslønn for alle sektorer og arbeidstid i alt. Kjønnsseriene viser publiserte medianer for kvinner og menn."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median månedslønn for butikkavdelingssjefer fra 2021 til 2025."
      title="Butikksjeflønnen økte med 7 730 kroner på fem år"
      yAxisLabel="Median månedslønn"
    />
  );
}

export function StoreManagerSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={getComparisonRows()}
      format="currency"
      kicker="Butikksjeflønn"
      note="Tallene gjelder median månedslønn for alle sektorer, begge kjønn og arbeidstid i alt."
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for butikksjefer og nærliggende leder- og salgsyrker, SSB 2025"
      ticks={[0, 25000, 50000, 75000, 100000]}
      title="Butikksjefer ligger over butikkmedarbeidere, men under flere lederyrker"
    />
  );
}

export function StoreManagerSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 1. kvartal 2026 fra SSB tabell 11658."
      sort="none"
      source="SSB tabell 11418 og 11658"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrkesgruppen."
      title="Butikksjefer er langt færre enn butikkmedarbeidere"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
