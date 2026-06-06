import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import intensivsykepleierLonn2025Snapshot from "@/content/blog/data/intensivsykepleier-lonn-2025.json";

type IntensivsykepleierSalarySnapshot = {
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
  "Jordmødre",
  "Spesialsykepleiere",
  "Sykepleiere",
  "Ambulansepersonell",
  "Helsefagarbeidere",
  "Radiografer mv.",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  Jordmødre: { lane: 0.16, labelOffset: { x: 18, y: -18, anchor: "start" } },
  Spesialsykepleiere: { lane: 0.32, labelOffset: { x: 0, y: -38, anchor: "middle" }, radiusBoost: 5 },
  Sykepleiere: { lane: 0.54, labelOffset: { x: 0, y: 38, anchor: "middle" } },
  Ambulansepersonell: { lane: 0.72, labelOffset: { x: 20, y: -18, anchor: "start" } },
  Helsefagarbeidere: { lane: 0.86, labelOffset: { x: 0, y: 40, anchor: "middle" } },
  "Radiografer mv.": { lane: 0.46, labelOffset: { x: -22, y: -20, anchor: "end" } },
};

function getSnapshot() {
  return intensivsykepleierLonn2025Snapshot as IntensivsykepleierSalarySnapshot;
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
        category: row.label === "Spesialsykepleiere" ? "highlight" : undefined,
        note:
          row.label === "Spesialsykepleiere"
            ? "Median månedslønn for spesialsykepleiere i 2025. Intensivsykepleiere inngår i denne SSB-gruppen."
            : undefined,
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

export function IntensivsykepleierGenderSalaryCards() {
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

export function IntensivsykepleierSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median samlet månedslønn for STYRK-08 2221 Spesialsykepleiere, der intensivsykepleiere inngår."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median samlet månedslønn for spesialsykepleiere fra 2021 til 2025."
      title="Spesialsykepleierlønnen økte med 10 560 kroner på fem år"
      yAxisLabel="Median samlet månedslønn"
    />
  );
}

export function IntensivsykepleierSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 2025K4 fra SSB tabell 11658."
      source="SSB tabell 11418 og 11658"
      sort="none"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Spesialsykepleiere ligger over sykepleiere i lønn"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
