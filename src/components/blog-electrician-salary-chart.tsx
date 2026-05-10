import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import elektrikerLonn2025Snapshot from "@/content/blog/data/elektriker-lonn-2025.json";

type SalarySnapshot = {
  source: string;
  rows: {
    code: string;
    label: string;
    href: string;
    value: number | null;
  }[];
};

type EmployeeSize = {
  size: number;
  sizeLabel: string;
};

const editorialLabels = ["Automatikere", "Energimontører", "Elektrikere", "Serviceelektronikere", "Tele- og IKT-installatører"];
const bubbleLabels = ["Elektrikere", "Automatikere", "Energimontører", "Tele- og IKT-installatører", "Serviceelektronikere"];
const employeesByCode: Record<string, EmployeeSize> = {
  "7411": { size: 34783, sizeLabel: "34 783 personer" },
  "7412": { size: 6479, sizeLabel: "6 479 personer" },
  "7413": { size: 4389, sizeLabel: "4 389 personer" },
  "7421": { size: 1346, sizeLabel: "1 346 personer" },
  "7422": { size: 4090, sizeLabel: "4 090 personer" },
};

function getSnapshot() {
  return elektrikerLonn2025Snapshot as SalarySnapshot;
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
        highlight: row.label === "Elektrikere",
      },
    ];
  });
}

function getBubbleData(): BlogChartDatum[] {
  const snapshot = getSnapshot();

  return bubbleLabels.flatMap((label) => {
    const row = snapshot.rows.find((entry) => entry.label === label);
    const employeeSize = row ? employeesByCode[row.code] : undefined;

    if (!row || typeof row.value !== "number" || !employeeSize) {
      return [];
    }

    return [
      {
        label: row.label,
        value: row.value,
        ...employeeSize,
        category: row.label === "Elektrikere" ? "highlight" : undefined,
        note: row.label === "Elektrikere" ? "Største elektrogruppe i utvalget målt i antall personer." : undefined,
        showLabel: ["Elektrikere", "Automatikere", "Energimontører"].includes(row.label),
      },
    ];
  });
}

export function ElectricianSalaryEditorialChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={getEditorialRows()}
      format="currency"
      kicker="Elektrikerlønn"
      source={snapshot.source}
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for utvalgte elektroyrker, SSB 2025"
      ticks={[0, 20000, 40000, 60000, 70000]}
      title="Hva tjener elektrikere?"
    />
  );
}

export function ElectricianSalaryBubbleChart() {
  return (
    <BlogChart
      data={getBubbleData()}
      format="currency"
      note="Median månedslønn gjelder 2025 fra SSB tabell 11418. Antall personer gjelder 2025K4 fra SSB tabell 11658."
      sort="none"
      source="SSB tabell 11418 og 11658"
      subtitle="Boblens plassering viser median månedslønn. Boblens størrelse viser antall personer i yrkesgruppen."
      title="Elektrikere er størst, men ikke høyest lønnet"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
