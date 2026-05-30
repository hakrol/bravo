import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { BlogSalaryDevelopmentChart, type BlogSalaryDevelopmentSeries } from "@/components/blog-salary-development-chart";
import bussjaforerTrikkeforereLonn2025Snapshot from "@/content/blog/data/bussjaforer-trikkeforere-lonn-2025.json";

type BussjaforerTrikkeforereSalarySnapshot = {
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
  "Lokomotiv og T-baneførere",
  "Anleggsmaskinførere",
  "Bussjåfører og trikkeførere",
  "Lastebil- og trailersjåfører",
  "Bil-, drosje- og varebilførere",
  "Dekks- og maskinmannskap (skip)",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  "Lokomotiv og T-baneførere": { lane: 0.18, labelOffset: { x: 10, y: -28, anchor: "start" } },
  Anleggsmaskinførere: { lane: 0.34, labelOffset: { x: 12, y: -24, anchor: "start" }, radiusBoost: 4 },
  "Bussjåfører og trikkeførere": { lane: 0.55, labelOffset: { x: 18, y: 22, anchor: "start" }, radiusBoost: 3 },
  "Lastebil- og trailersjåfører": { lane: 0.74, labelOffset: { x: -14, y: 36, anchor: "end" }, radiusBoost: 6 },
  "Bil-, drosje- og varebilførere": { lane: 0.88, labelOffset: { x: 12, y: 24, anchor: "start" }, radiusBoost: 2 },
  "Dekks- og maskinmannskap (skip)": { lane: 0.08, labelOffset: { x: -12, y: -22, anchor: "end" } },
};

function getSnapshot() {
  return bussjaforerTrikkeforereLonn2025Snapshot as BussjaforerTrikkeforereSalarySnapshot;
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
        category: row.label === "Bussjåfører og trikkeførere" ? "highlight" : undefined,
        note: row.label === "Bussjåfører og trikkeførere" ? "Nærmeste tilgjengelige SSB-gruppe for bussjåfører og trikkeførere." : undefined,
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

export function BussjaforerTrikkeforereGenderSalaryCards() {
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

export function BussjaforerTrikkeforereSalaryDevelopmentChart() {
  const snapshot = getSnapshot();

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median samlet månedslønn for begge kjønn, alle sektorer og arbeidstid i alt."
      series={getSalaryDevelopmentSeries()}
      source={snapshot.salaryDevelopment.source}
      subtitle="Median samlet månedslønn for bussjåfører og trikkeførere fra 2021 til 2025."
      title="Lønnen økte med 8 340 kroner på fem år"
      yAxisLabel="Median samlet månedslønn"
    />
  );
}

export function BussjaforerTrikkeforereSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 4. kvartal 2025 fra SSB tabell 11658."
      source="SSB tabell 11418 og 11658"
      sort="none"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrkesgruppen."
      title="Bussjåfører og trikkeførere er en stor transportgruppe"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
