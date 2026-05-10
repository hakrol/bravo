import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import kirurgLonn2025Snapshot from "@/content/blog/data/kirurg-lonn-2025.json";

type SalarySnapshot = {
  source: string;
  rows: {
    label: string;
    href: string;
    value: number | null;
  }[];
};

type EmployeeSize = {
  size: number;
  sizeLabel: string;
};

const surgeonSalaryLabels = ["Legespesialister", "Allmennpraktiserende leger", "Tannleger", "Spesialsykepleiere", "Alle yrker"];
const bubbleLabels = ["Legespesialister", "Allmennpraktiserende leger", "Spesialsykepleiere", "Sykepleiere"];
const employeeSizesByLabel: Record<string, EmployeeSize> = {
  Legespesialister: { size: 18271, sizeLabel: "18 271 lønnstakere" },
  "Allmennpraktiserende leger": { size: 8888, sizeLabel: "8 888 lønnstakere" },
  Spesialsykepleiere: { size: 30211, sizeLabel: "30 211 lønnstakere" },
  Sykepleiere: { size: 61314, sizeLabel: "61 314 lønnstakere" },
};

function getSnapshot() {
  return kirurgLonn2025Snapshot as SalarySnapshot;
}

function getSurgeonSalaryRows() {
  const snapshot = getSnapshot();

  return surgeonSalaryLabels.flatMap((label) => {
    const row = snapshot.rows.find((entry) => entry.label === label);

    if (!row || typeof row.value !== "number") {
      return [];
    }

    return [
      {
        href: row.href,
        label: row.label,
        value: row.value,
        highlight: row.label === "Legespesialister",
      },
    ];
  });
}

function getSurgeonBubbleData(): BlogChartDatum[] {
  const snapshot = getSnapshot();

  return bubbleLabels.flatMap((label) => {
    const row = snapshot.rows.find((entry) => entry.label === label);
    const employeeSize = employeeSizesByLabel[label];

    if (!row || typeof row.value !== "number" || !employeeSize) {
      return [];
    }

    return [
      {
        label: row.label,
        value: row.value,
        ...employeeSize,
        category: row.label === "Legespesialister" ? "highlight" : undefined,
        note: row.label === "Legespesialister" ? "Nærmeste tilgjengelige SSB-gruppe for kirurg i dette datagrunnlaget." : undefined,
      },
    ];
  });
}

export function SurgeonSalaryEditorialChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={getSurgeonSalaryRows()}
      format="currency"
      kicker="Kirurglønn"
      source={snapshot.source}
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for utvalgte lege- og helseyrker, SSB 2025"
      ticks={[0, 30000, 60000, 90000, 120000]}
      title="Hva tjener kirurger?"
    />
  );
}

export function SurgeonSalaryBubbleChart() {
  return (
    <BlogChart
      data={getSurgeonBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall lønnstakere gjelder 2025K4 fra SSB tabell 11658."
      sort="none"
      source="SSB tabell 11418 og 11658"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall lønnstakere i yrket."
      title="Legespesialister er høytlønte, men færre enn flere helseyrker"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
