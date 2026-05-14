import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import brannmannLonn2025Snapshot from "@/content/blog/data/brannmann-lonn-2025.json";

type SalarySnapshot = {
  source: string;
  rows: {
    code: string;
    label: string;
    href: string;
    value: number | null;
    employees?: number;
  }[];
};

const editorialLabels = [
  "Politibetjenter mv.",
  "Brannkonstabler",
  "Ambulansepersonell",
  "Fengselsbetjenter",
  "Tollere",
  "Vektere",
  "Andre sikkerhetsarbeidere",
];
const bubbleLabels = ["Brannkonstabler", "Politibetjenter mv.", "Ambulansepersonell", "Vektere", "Fengselsbetjenter"];

function getSnapshot() {
  return brannmannLonn2025Snapshot as SalarySnapshot;
}

function formatEmployeeCount(value: number) {
  return `${value.toLocaleString("nb-NO")} personer`;
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
        highlight: row.label === "Brannkonstabler",
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
        category: row.label === "Brannkonstabler" ? "highlight" : undefined,
        note: row.label === "Brannkonstabler" ? "Nærmeste tilgjengelige SSB-gruppe for brannmenn i dette datagrunnlaget." : undefined,
        showLabel: ["Brannkonstabler", "Politibetjenter mv.", "Ambulansepersonell"].includes(row.label),
      },
    ];
  });
}

export function FirefighterSalaryEditorialChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Brannmannlønn"
      source={snapshot.source}
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for brannmenn og nærliggende beredskapsyrker, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 80000]}
      title="Brannkonstabler ligger høyt blant beredskapsyrkene"
    />
  );
}

export function FirefighterSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall personer gjelder 2025K4 fra SSB tabell 11658."
      sort="none"
      source="SSB tabell 11418 og 11658"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall personer i yrkesgruppen."
      title="Brannkonstabler er en mindre gruppe med høyt lønnsnivå"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
