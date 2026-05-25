import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { BlogSalaryDevelopmentChart, type BlogSalaryDevelopmentSeries } from "@/components/blog-salary-development-chart";
import vernepleierLonn2025Snapshot from "@/content/blog/data/vernepleier-lonn-2025.json";

type VernepleierSalarySnapshot = {
  source: string;
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
  "Spesialsykepleiere",
  "Sykepleiere",
  "Vernepleiere",
  "Helsefagarbeidere",
  "Ergoterapeuter",
  "Andre pleiemedarbeidere",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  Spesialsykepleiere: { lane: 0.2, labelOffset: { x: 20, y: -18, anchor: "start" } },
  Sykepleiere: { lane: 0.42, labelOffset: { x: 0, y: 36, anchor: "middle" } },
  Vernepleiere: { lane: 0.58, labelOffset: { x: 0, y: -36, anchor: "middle" }, radiusBoost: 5 },
  Helsefagarbeidere: { lane: 0.78, labelOffset: { x: 0, y: 40, anchor: "middle" } },
  Ergoterapeuter: { lane: 0.28, labelOffset: { x: -20, y: -20, anchor: "end" } },
  "Andre pleiemedarbeidere": { lane: 0.5, labelOffset: { x: 20, y: 4, anchor: "start" } },
};

function getSnapshot() {
  return vernepleierLonn2025Snapshot as VernepleierSalarySnapshot;
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
        sizeLabel: `${row.employees.toLocaleString("nb-NO")} lønnstakere`,
        category: row.label === "Vernepleiere" ? "highlight" : undefined,
        note: row.label === "Vernepleiere" ? "Median månedslønn for vernepleiere i 2025." : undefined,
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

export function VernepleierGenderSalaryCards() {
  const snapshot = getSnapshot();
  const gender = snapshot.genderMedian;

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

export function VernepleierSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median samlet månedslønn for begge kjønn, alle sektorer og arbeidstid i alt."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median samlet månedslønn for vernepleiere fra 2021 til 2025."
      title="Vernepleierlønnen økte med 9 530 kroner på fem år"
      yAxisLabel="Median samlet månedslønn"
    />
  );
}

export function VernepleierSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 2025K4 fra SSB tabell 11658."
      source="SSB tabell 11418 og 11658"
      sort="none"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Vernepleiere ligger tett på sykepleiere i lønn"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
