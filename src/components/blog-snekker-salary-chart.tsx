import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import snekkerLonn2025Snapshot from "@/content/blog/data/snekker-lonn-2025.json";

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
  "Elektrikere",
  "Rørleggere og VVS-montører",
  "Betongarbeidere",
  "Murere",
  "Tømrere og snekkere",
  "Malere og byggtapetserere",
  "Møbelsnekkere",
];

const bubbleLabels = [
  "Tømrere og snekkere",
  "Elektrikere",
  "Rørleggere og VVS-montører",
  "Betongarbeidere",
  "Malere og byggtapetserere",
  "Møbelsnekkere",
];

function getSnapshot() {
  return snekkerLonn2025Snapshot as SalarySnapshot;
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
        highlight: row.label === "Tømrere og snekkere",
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
        category: row.label === "Tømrere og snekkere" ? "highlight" : undefined,
        note: row.label === "Tømrere og snekkere" ? "Nærmeste tilgjengelige SSB-gruppe for snekkere og tømrere." : undefined,
        showLabel: ["Tømrere og snekkere", "Elektrikere", "Rørleggere og VVS-montører"].includes(row.label),
      },
    ];
  });
}

export function SnekkerSalaryEditorialChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Snekkerlønn"
      source={snapshot.source}
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for snekkere og nærliggende håndverksyrker, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 70000]}
      title="Snekkere ligger lavere enn flere tekniske håndverksfag"
    />
  );
}

export function SnekkerSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall personer gjelder 2025K4 fra SSB tabell 11658."
      sort="none"
      source="SSB tabell 11418 og 11658"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall personer i yrkesgruppen."
      title="Tømrere og snekkere er en stor håndverksgruppe"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
