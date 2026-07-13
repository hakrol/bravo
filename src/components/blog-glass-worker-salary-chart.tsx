import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import glassWorkerSnapshot from "@/content/blog/data/glassarbeider-lonn-2025.json";

type GlassWorkerSalarySnapshot = {
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
    womenMonthlyMedian: number | string;
    menMonthlyMedian: number | string;
  };
};

const editorialLabels = [
  "Rørleggere og VVS-montører",
  "Betongarbeidere",
  "Taktekkere",
  "Gulv- og flisleggere",
  "Isolatører mv.",
  "Glassarbeidere",
  "Malere og byggtapetserere",
];

const bubbleLabels = [
  "Tømrere og snekkere",
  "Rørleggere og VVS-montører",
  "Betongarbeidere",
  "Gulv- og flisleggere",
  "Isolatører mv.",
  "Taktekkere",
  "Glassarbeidere",
];

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  "Tømrere og snekkere": { lane: 0.82, labelOffset: { x: 0, y: 38, anchor: "middle" }, radiusBoost: 7 },
  "Rørleggere og VVS-montører": { lane: 0.28, labelOffset: { x: 0, y: -36, anchor: "middle" }, radiusBoost: 5 },
  Betongarbeidere: { lane: 0.52, labelOffset: { x: 12, y: 32, anchor: "start" }, radiusBoost: 4 },
  "Gulv- og flisleggere": { lane: 0.22, labelOffset: { x: 16, y: -18, anchor: "start" }, showLabel: true },
  "Isolatører mv.": { lane: 0.66, labelOffset: { x: 18, y: 8, anchor: "start" } },
  Taktekkere: { lane: 0.42, labelOffset: { x: 16, y: -28, anchor: "start" }, showLabel: true },
  Glassarbeidere: { lane: 0.58, labelOffset: { x: 16, y: 26, anchor: "start" }, showLabel: true },
};

function getSnapshot() {
  return glassWorkerSnapshot as GlassWorkerSalarySnapshot;
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
        highlight: row.label === "Glassarbeidere",
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
        category: row.label === "Glassarbeidere" ? "highlight" : undefined,
        note: row.label === "Glassarbeidere" ? "SSB-gruppen glassarbeidere." : undefined,
        ...bubbleLayout[row.label],
      },
    ];
  });
}

export function GlassWorkerGenderSalaryCards() {
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

export function GlassWorkerSalaryEditorialChart() {
  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Glassarbeiderlønn"
      note="Tallene gjelder median månedslønn for alle sektorer, begge kjønn og heltid og deltid samlet."
      source="SSB tabell 11418"
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for glassarbeidere og utvalgte byggyrker, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 70000]}
      title="Glassarbeidere ligger under flere nærliggende byggfag"
    />
  );
}

export function GlassWorkerSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 1. kvartal 2026 fra SSB tabell 11658."
      sort="none"
      source={getSnapshot().source}
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Glassarbeidere er en liten gruppe i byggsammenligningen"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
