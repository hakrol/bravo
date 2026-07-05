import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import concreteWorkerSnapshot from "@/content/blog/data/betongarbeider-lonn-2025.json";

type ConcreteWorkerSalarySnapshot = {
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
};

const editorialLabels = [
  "Rørleggere og VVS-montører",
  "Betongarbeidere",
  "Taktekkere",
  "Murere",
  "Gulv- og flisleggere",
  "Overflatebehandlere og lakkerere",
  "Tømrere og snekkere",
  "Glassarbeidere",
];

const bubbleLabels = [
  "Tømrere og snekkere",
  "Rørleggere og VVS-montører",
  "Betongarbeidere",
  "Murere",
  "Overflatebehandlere og lakkerere",
  "Glassarbeidere",
  "Taktekkere",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  "Tømrere og snekkere": { lane: 0.78, labelOffset: { x: 0, y: 38, anchor: "middle" }, radiusBoost: 7 },
  "Rørleggere og VVS-montører": { lane: 0.33, labelOffset: { x: 0, y: -36, anchor: "middle" }, radiusBoost: 4 },
  Betongarbeidere: { lane: 0.54, labelOffset: { x: 12, y: 34, anchor: "start" }, radiusBoost: 5 },
  Murere: { lane: 0.2, labelOffset: { x: 18, y: 8, anchor: "start" } },
  "Overflatebehandlere og lakkerere": { lane: 0.64, labelOffset: { x: 18, y: -18, anchor: "start" } },
  Glassarbeidere: { lane: 0.42, labelOffset: { x: 18, y: 8, anchor: "start" } },
  Taktekkere: { lane: 0.87, labelOffset: { x: 18, y: 8, anchor: "start" } },
};

function getSnapshot() {
  return concreteWorkerSnapshot as ConcreteWorkerSalarySnapshot;
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
        highlight: row.label === "Betongarbeidere",
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
        category: row.label === "Betongarbeidere" ? "highlight" : undefined,
        note: row.label === "Betongarbeidere" ? "Nærmeste tilgjengelige SSB-gruppe for betongfagarbeidere." : undefined,
        ...bubbleLayout[row.label],
      },
    ];
  });
}

export function ConcreteWorkerGenderSalaryCards() {
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

export function ConcreteWorkerSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Betongarbeiderlønn"
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for betongarbeidere og nærliggende byggyrker, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 70000]}
      title="Betongarbeidere ligger høyt blant nærliggende byggyrker"
    />
  );
}

export function ConcreteWorkerSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 1. kvartal 2026 fra SSB tabell 11658."
      sort="none"
      source={getSnapshot().source}
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Betongarbeidere har høy lønn, men er langt færre enn tømrere og snekkere"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
