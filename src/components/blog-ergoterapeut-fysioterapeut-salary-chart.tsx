import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import snapshot from "@/content/blog/data/ergoterapeut-fysioterapeut-lonn-2025.json";

type HealthOccupationSalarySnapshot = {
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
  }[];
  salaryDevelopment: {
    occupationLabel: string;
    points: {
      period: string;
      medianMonthlySalary: number;
    }[];
  }[];
};

const comparisonLabels = [
  "Fysioterapeuter",
  "Ergoterapeuter",
  "Vernepleiere",
  "Sykepleiere",
  "Audiografer og logopeder",
  "Ernæringsfysiologer",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  Fysioterapeuter: { lane: 0.48, labelOffset: { x: 8, y: -34, anchor: "start" }, radiusBoost: 4, showLabel: true },
  Ergoterapeuter: { lane: 0.74, labelOffset: { x: -8, y: 34, anchor: "end" }, radiusBoost: 3, showLabel: true },
  Vernepleiere: { lane: 0.28, labelOffset: { x: 0, y: -38, anchor: "middle" }, radiusBoost: 8, showLabel: true },
  Sykepleiere: { lane: 0.56, labelOffset: { x: 8, y: 34, anchor: "start" }, radiusBoost: 10 },
  "Audiografer og logopeder": { lane: 0.88, labelOffset: { x: 16, y: 10, anchor: "start" } },
  Ernæringsfysiologer: { lane: 0.18, labelOffset: { x: 10, y: -28, anchor: "start" } },
};

function getSnapshot() {
  return snapshot as HealthOccupationSalarySnapshot;
}

function getRow(label: string) {
  return getSnapshot().rows.find((row) => row.label === label);
}

function formatEmployeeCount(value: number) {
  return `${value.toLocaleString("nb-NO")} lønnstakere`;
}

function getEditorialRows() {
  return comparisonLabels.flatMap((label) => {
    const row = getRow(label);

    if (!row || typeof row.value !== "number") {
      return [];
    }

    return [
      {
        href: row.href,
        label: row.label,
        value: row.value,
        highlight: row.label === "Fysioterapeuter",
      },
    ];
  });
}

function getBubbleData(): BlogChartDatum[] {
  return comparisonLabels.flatMap((label) => {
    const row = getRow(label);

    if (!row || typeof row.value !== "number" || typeof row.employees !== "number") {
      return [];
    }

    return [
      {
        label: row.label,
        value: row.value,
        size: row.employees,
        sizeLabel: formatEmployeeCount(row.employees),
        category: row.label === "Fysioterapeuter" || row.label === "Ergoterapeuter" ? "highlight" : undefined,
        ...bubbleLayout[row.label],
      },
    ];
  });
}

function getSalaryDevelopmentSeries(): BlogSalaryDevelopmentSeries[] {
  return getSnapshot().salaryDevelopment.map((series) => ({
    label: series.occupationLabel,
    points: series.points.map((point) => ({
      label: point.period,
      value: point.medianMonthlySalary,
    })),
  }));
}

function getGender(label: "ergoterapeuter" | "fysioterapeuter") {
  const gender = getSnapshot().genderMedian.find((entry) => entry.occupationLabel === label);

  if (!gender) {
    throw new Error(`Missing gender snapshot for ${label}`);
  }

  return gender;
}

export function ErgoterapeutGenderSalaryCards() {
  const gender = getGender("ergoterapeuter");

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

export function FysioterapeutGenderSalaryCards() {
  const gender = getGender("fysioterapeuter");

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

export function ErgoterapeutFysioterapeutSalaryDevelopmentChart() {
  return (
    <BlogSalaryDevelopmentChart
      note="Tallene gjelder median månedslønn for begge kjønn, alle sektorer og heltid og deltid samlet."
      series={getSalaryDevelopmentSeries()}
      source="SSB tabell 11418"
      subtitle="Median månedslønn for ergoterapeuter og fysioterapeuter, 2021 til 2025."
      title="Fysioterapeutlønnen har vokst litt sterkere enn ergoterapeutlønnen"
    />
  );
}

export function ErgoterapeutFysioterapeutSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Helseyrker"
      note="Tallene gjelder median månedslønn i 2025 for alle sektorer, begge kjønn og heltid og deltid samlet."
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for utvalgte helseyrker, SSB 2025"
      ticks={[0, 40000, 50000, 60000, 70000]}
      title="Fysioterapeuter ligger foran ergoterapeuter i dette helseutvalget"
    />
  );
}

export function ErgoterapeutFysioterapeutSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 1. kvartal 2026 fra SSB tabell 11658."
      sort="none"
      source={getSnapshot().source}
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Fysioterapeuter er både flere og høyere lønnet enn ergoterapeuter"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
