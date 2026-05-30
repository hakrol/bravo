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
  "Betongarbeidere",
  "Overflatebehandlere og lakkerere",
  "Tømrere og snekkere",
  "Andre bygningsarbeidere",
  "Malere og byggtapetserere",
  "Møbelsnekkere",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  "Rørleggere og VVS-montører": { lane: 0.34, labelOffset: { x: 8, y: -34, anchor: "start" }, radiusBoost: 5 },
  Betongarbeidere: { lane: 0.58, labelOffset: { x: -10, y: 34, anchor: "end" } },
  "Overflatebehandlere og lakkerere": { lane: 0.25, labelOffset: { x: 12, y: -28, anchor: "start" } },
  "Tømrere og snekkere": { lane: 0.75, labelOffset: { x: 0, y: 36, anchor: "middle" }, radiusBoost: 6 },
  "Andre bygningsarbeidere": { lane: 0.45, labelOffset: { x: -16, y: -26, anchor: "end" } },
  "Malere og byggtapetserere": { lane: 0.62, labelOffset: { x: 18, y: 20, anchor: "start" }, radiusBoost: 3 },
  Møbelsnekkere: { lane: 0.15, labelOffset: { x: 16, y: 8, anchor: "start" } },
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
