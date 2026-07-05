import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import carMechanicSnapshot from "@/content/blog/data/bilmekaniker-lonn-2025.json";

type CarMechanicSalarySnapshot = {
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
  "Mekanikere innen flytekniske fag",
  "Presisjonsinstrumentmakere og -reparatører",
  "Anleggsmaskin- og industrimekanikere",
  "Metalldreiere mv.",
  "Bilmekanikere",
  "Montører av mekaniske produkter",
  "Sykkelreparatører mv.",
];

const bubbleLabels = [
  "Anleggsmaskin- og industrimekanikere",
  "Bilmekanikere",
  "Mekanikere innen flytekniske fag",
  "Metalldreiere mv.",
  "Montører av mekaniske produkter",
  "Sykkelreparatører mv.",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  "Anleggsmaskin- og industrimekanikere": { lane: 0.32, labelOffset: { x: 0, y: -34, anchor: "middle" }, radiusBoost: 6 },
  Bilmekanikere: { lane: 0.62, labelOffset: { x: 12, y: 34, anchor: "start" }, radiusBoost: 6 },
  "Mekanikere innen flytekniske fag": { lane: 0.18, labelOffset: { x: 18, y: 8, anchor: "start" }, radiusBoost: 1 },
  "Metalldreiere mv.": { lane: 0.82, labelOffset: { x: 18, y: 8, anchor: "start" } },
  "Montører av mekaniske produkter": { lane: 0.45, labelOffset: { x: 18, y: -18, anchor: "start" } },
  "Sykkelreparatører mv.": { lane: 0.9, labelOffset: { x: 18, y: 8, anchor: "start" }, showLabel: true },
};

function getSnapshot() {
  return carMechanicSnapshot as CarMechanicSalarySnapshot;
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
        highlight: row.label === "Bilmekanikere",
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
        category: row.label === "Bilmekanikere" ? "highlight" : undefined,
        note: row.label === "Bilmekanikere" ? "Nærmeste tilgjengelige SSB-gruppe for bilmekanikere." : undefined,
        ...bubbleLayout[row.label],
      },
    ];
  });
}

export function CarMechanicGenderSalaryCards() {
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

export function CarMechanicSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Bilmekanikerlønn"
      note="Tallene gjelder median månedslønn for alle sektorer, begge kjønn og heltid og deltid samlet."
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for bilmekanikere og utvalgte mekaniker- og verkstedsyrker, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 80000]}
      title="Bilmekanikere ligger midt i feltet blant verkstedsyrkene"
    />
  );
}

export function CarMechanicSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 1. kvartal 2026 fra SSB tabell 11658."
      sort="none"
      source={getSnapshot().source}
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Bilmekanikere er et stort praktisk fag, selv om lønnen ikke er høyest"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
