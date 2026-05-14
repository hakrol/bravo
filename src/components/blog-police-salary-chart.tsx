import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import politiLonn2025Snapshot from "@/content/blog/data/politi-lonn-2025.json";

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

const editorialLabels = ["Politibetjenter mv.", "Brannkonstabler", "Fengselsbetjenter", "Tollere", "Vektere", "Andre sikkerhetsarbeidere"];
const bubbleLabels = ["Politibetjenter mv.", "Vektere", "Brannkonstabler", "Fengselsbetjenter", "Andre sikkerhetsarbeidere"];

function getSnapshot() {
  return politiLonn2025Snapshot as SalarySnapshot;
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
        highlight: row.label === "Politibetjenter mv.",
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
        category: row.label === "Politibetjenter mv." ? "highlight" : undefined,
        note: row.label === "Politibetjenter mv." ? "Nærmeste tilgjengelige SSB-gruppe for politi i dette datagrunnlaget." : undefined,
        showLabel: ["Politibetjenter mv.", "Vektere", "Brannkonstabler"].includes(row.label),
      },
    ];
  });
}

export function PoliceSalaryEditorialChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Politilønn"
      source={snapshot.source}
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for politi og nærliggende sikkerhetsyrker, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 80000]}
      title="Politibetjenter ligger høyt blant sikkerhetsyrkene"
    />
  );
}

export function PoliceSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall personer gjelder 2025K4 fra SSB tabell 11658."
      sort="none"
      source="SSB tabell 11418 og 11658"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall personer i yrkesgruppen."
      title="Politibetjenter har både høyere lønn og stor yrkesgruppe"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
