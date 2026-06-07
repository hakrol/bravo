import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import servitorLonn2025Snapshot from "@/content/blog/data/servitor-lonn-2025.json";

type ServitorSalarySnapshot = {
  rows: {
    label: string;
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
    }[];
  };
};

const bubbleLabels = [
  "Kokker",
  "Flyverter, båtverter mv.",
  "Frisører",
  "Bartendere",
  "Servitører",
  "Dyrepassere og - trenere mv.",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  Kokker: { lane: 0.16, labelOffset: { x: 20, y: -20, anchor: "start" }, radiusBoost: 7, showLabel: true },
  "Flyverter, båtverter mv.": { lane: 0.3, labelOffset: { x: 20, y: 20, anchor: "start" }, showLabel: true },
  Frisører: { lane: 0.48, labelOffset: { x: 18, y: -20, anchor: "start" }, radiusBoost: 3, showLabel: true },
  Bartendere: { lane: 0.64, labelOffset: { x: -24, y: -18, anchor: "end" }, radiusBoost: 2, showLabel: true },
  Servitører: { lane: 0.78, labelOffset: { x: 0, y: 42, anchor: "middle" }, radiusBoost: 8, showLabel: true },
  "Dyrepassere og - trenere mv.": { lane: 0.9, labelOffset: { x: -24, y: -18, anchor: "end" }, showLabel: true },
};

const bubbleDisplayLabels: Record<string, string> = {
  "Flyverter, båtverter mv.": "Flyverter,\nbåtverter mv.",
  "Dyrepassere og - trenere mv.": "Dyrepassere\nmv.",
};

function getSnapshot() {
  return servitorLonn2025Snapshot as ServitorSalarySnapshot;
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
        sizeLabel: `${row.employees.toLocaleString("nb-NO")} lønnstakere`,
        category: row.label === "Servitører" ? "highlight" : undefined,
        note: row.label === "Servitører" ? "Median månedslønn for servitører i 2025." : undefined,
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
      label: snapshot.salaryDevelopment.occupationLabel,
      points: snapshot.salaryDevelopment.rows,
    },
  ];
}

export function ServitorGenderSalaryCards() {
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

export function ServitorSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median månedslønn for STYRK-08 5131 Servitører, begge kjønn, alle sektorer og arbeidstid i alt."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median månedslønn for servitører fra 2021 til 2025."
      title="Servitørlønnen økte med 7 150 kroner på fem år"
      yAxisLabel="Median månedslønn"
    />
  );
}

export function ServitorSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 4. kvartal 2025 fra SSB tabell 11658."
      source="SSB tabell 11418 og 11658"
      sort="none"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrkesgruppen."
      title="Servitører er en stor servicegruppe med relativt lav medianlønn"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
