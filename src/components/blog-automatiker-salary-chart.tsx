import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import automatikerSnapshot from "@/content/blog/data/automatiker-lonn-2025.json";

type AutomatikerSalarySnapshot = {
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
    period: string;
    medianMonthlySalary: number;
  }[];
};

const editorialLabels = [
  "Automatikere",
  "Energimontører",
  "Elektrikere",
  "Rørleggere og VVS-montører",
  "Serviceelektronikere",
  "Anleggsmaskin- og industrimekanikere",
  "Tele- og IKT-installatører",
];

const bubbleLabels = [
  "Elektrikere",
  "Anleggsmaskin- og industrimekanikere",
  "Rørleggere og VVS-montører",
  "Automatikere",
  "Energimontører",
  "Serviceelektronikere",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  Elektrikere: { lane: 0.28, labelOffset: { x: 0, y: -36, anchor: "middle" }, radiusBoost: 8, showLabel: true },
  "Anleggsmaskin- og industrimekanikere": { lane: 0.62, labelOffset: { x: 8, y: 34, anchor: "start" }, radiusBoost: 7 },
  "Rørleggere og VVS-montører": { lane: 0.82, labelOffset: { x: 12, y: 22, anchor: "start" }, radiusBoost: 6 },
  Automatikere: { lane: 0.44, labelOffset: { x: 8, y: -34, anchor: "start" }, radiusBoost: 4, showLabel: true },
  Energimontører: { lane: 0.68, labelOffset: { x: 16, y: -18, anchor: "start" }, showLabel: true },
  Serviceelektronikere: { lane: 0.9, labelOffset: { x: 18, y: 8, anchor: "start" } },
};

function getSnapshot() {
  return automatikerSnapshot as AutomatikerSalarySnapshot;
}

function formatEmployeeCount(value: number) {
  return `${value.toLocaleString("nb-NO")} lønnstakere`;
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
        highlight: row.label === "Automatikere",
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
        value: row.value,
        size: row.employees,
        sizeLabel: formatEmployeeCount(row.employees),
        category: row.label === "Automatikere" ? "highlight" : undefined,
        note: row.label === "Automatikere" ? "Nærmeste SSB-gruppe for automatikere." : undefined,
        ...bubbleLayout[row.label],
      },
    ];
  });
}

function getSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  return [
    {
      label: "Automatikere",
      points: getSnapshot().salaryDevelopment.map((point) => ({
        label: point.period,
        value: point.medianMonthlySalary,
      })),
    },
  ];
}

export function AutomatikerGenderSalaryCards() {
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

export function AutomatikerSalaryDevelopmentChart() {
  return (
    <BlogSalaryDevelopmentChart
      note="Tallene gjelder median månedslønn for begge kjønn, alle sektorer og heltid og deltid samlet."
      series={getSalaryDevelopmentSeries()}
      source="SSB tabell 11418"
      subtitle="Median månedslønn for automatikere, 2021 til 2025."
      title="Automatikerlønnen har økt med over 11 000 kroner på fem år"
    />
  );
}

export function AutomatikerSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Automatikerlønn"
      note="Tallene gjelder median månedslønn for alle sektorer, begge kjønn og heltid og deltid samlet."
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for automatikere og utvalgte tekniske fag, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 70000]}
      title="Automatikere ligger høyest i dette tekniske utvalget"
    />
  );
}

export function AutomatikerSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 1. kvartal 2026 fra SSB tabell 11658."
      sort="none"
      source={getSnapshot().source}
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Automatikere har høy lønn, men er en mindre gruppe enn elektrikere"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
