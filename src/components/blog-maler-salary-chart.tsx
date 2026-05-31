import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { BlogSalaryDevelopmentChart, type BlogSalaryDevelopmentSeries } from "@/components/blog-salary-development-chart";
import malerLonn2025Snapshot from "@/content/blog/data/maler-lonn-2025.json";

type MalerSalarySnapshot = {
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
    }[];
  };
};

const bubbleLabels = [
  "Rørleggere og VVS-montører",
  "Elektrikere",
  "Møbelsnekkere",
  "Murere",
  "Malere og byggtapetserere",
  "Tømrere og snekkere",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  "Rørleggere og VVS-montører": { lane: 0.09, labelOffset: { x: 34, y: -8, anchor: "start" }, radiusBoost: 3, showLabel: true },
  Elektrikere: { lane: 0.26, labelOffset: { x: 34, y: 6, anchor: "start" }, radiusBoost: 3, showLabel: true },
  Møbelsnekkere: { lane: 0.43, labelOffset: { x: 42, y: 8, anchor: "start" }, radiusBoost: 4, showLabel: true },
  Murere: { lane: 0.6, labelOffset: { x: 36, y: 8, anchor: "start" }, showLabel: true },
  "Malere og byggtapetserere": { lane: 0.78, labelOffset: { x: 42, y: -10, anchor: "start" }, radiusBoost: 5, showLabel: true },
  "Tømrere og snekkere": { lane: 0.92, labelOffset: { x: 42, y: -10, anchor: "start" }, radiusBoost: 12, showLabel: true },
};

const bubbleDisplayLabels: Record<string, string> = {
  "Rørleggere og VVS-montører": "Rørleggere og\nVVS-montører",
  Møbelsnekkere: "Snekkere",
  "Malere og byggtapetserere": "Malere og\nbyggtapetserere",
  "Tømrere og snekkere": "Tømrere og\nsnekkere",
};

function getSnapshot() {
  return malerLonn2025Snapshot as MalerSalarySnapshot;
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
        category: row.label === "Malere og byggtapetserere" ? "highlight" : undefined,
        note: row.label === "Malere og byggtapetserere" ? "Nærmeste tilgjengelige SSB-gruppe for malere." : undefined,
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

export function MalerGenderSalaryCards() {
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

export function MalerSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median samlet månedslønn for begge kjønn, alle sektorer og arbeidstid i alt."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median samlet månedslønn for malere og byggtapetserere fra 2021 til 2025."
      title="Malerlønnen økte med 7 740 kroner på fem år"
      yAxisLabel="Median samlet månedslønn"
    />
  );
}

export function MalerSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 4. kvartal 2025 fra SSB tabell 11658."
      source="SSB tabell 11418 og 11658"
      sort="none"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrkesgruppen."
      title="Malere er færre enn tømrere, men større enn flere nisjefag"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
