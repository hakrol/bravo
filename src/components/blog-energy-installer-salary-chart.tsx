import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import energyInstallerSnapshot from "@/content/blog/data/energimontor-lonn-2025.json";

type EnergyInstallerSalarySnapshot = {
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

const comparisonLabels = [
  "Automatikere",
  "Energimontører",
  "Elektrikere",
  "Serviceelektronikere",
  "Tele- og IKT-installatører",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  Automatikere: { lane: 0.25, labelOffset: { x: 8, y: -28, anchor: "start" }, showLabel: true },
  Energimontører: { lane: 0.58, labelOffset: { x: 10, y: 34, anchor: "start" }, radiusBoost: 4, showLabel: true },
  Elektrikere: { lane: 0.42, labelOffset: { x: 0, y: -36, anchor: "middle" }, radiusBoost: 7, showLabel: true },
  Serviceelektronikere: { lane: 0.75, labelOffset: { x: 18, y: 8, anchor: "start" } },
  "Tele- og IKT-installatører": { lane: 0.88, labelOffset: { x: 18, y: 8, anchor: "start" } },
};

function getSnapshot() {
  return energyInstallerSnapshot as EnergyInstallerSalarySnapshot;
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
        highlight: row.label === "Energimontører",
      },
    ];
  });
}

function getBubbleData(): BlogChartDatum[] {
  const snapshot = getSnapshot();

  return comparisonLabels.flatMap((label) => {
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
        category: row.label === "Energimontører" ? "highlight" : undefined,
        note: row.label === "Energimontører" ? "Nærmeste SSB-gruppe for energimontører." : undefined,
        ...bubbleLayout[row.label],
      },
    ];
  });
}

function getSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  return [
    {
      label: "Energimontører",
      points: getSnapshot().salaryDevelopment.map((point) => ({
        label: point.period,
        value: point.medianMonthlySalary,
      })),
    },
  ];
}

export function EnergyInstallerGenderSalaryCards() {
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

export function EnergyInstallerSalaryDevelopmentChart() {
  return (
    <BlogSalaryDevelopmentChart
      note="Tallene gjelder median månedslønn for begge kjønn, alle sektorer og heltid og deltid samlet."
      series={getSalaryDevelopmentSeries()}
      source="SSB tabell 11418"
      subtitle="Median månedslønn for energimontører, 2021 til 2025."
      title="Energimontørlønnen har økt med nesten 10 000 kroner på fem år"
    />
  );
}

export function EnergyInstallerSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={getComparisonRows()}
      format="currency"
      kicker="Energimontørlønn"
      note="Tallene gjelder median månedslønn for alle sektorer, begge kjønn og heltid og deltid samlet."
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for energimontører og utvalgte elektrofag, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 70000]}
      title="Energimontører ligger høyt blant elektrofagene"
    />
  );
}

export function EnergyInstallerSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 1. kvartal 2026 fra SSB tabell 11658."
      sort="none"
      source={getSnapshot().source}
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Energimontører er færre enn elektrikere, men lønnen ligger høyere"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
