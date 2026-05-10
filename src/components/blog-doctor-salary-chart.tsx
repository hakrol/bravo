import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import legeLonn2025Snapshot from "@/content/blog/data/lege-lonn-2025.json";

type SalarySnapshot = {
  source: string;
  rows: {
    label: string;
    href: string;
    value: number | null;
  }[];
};

const doctorSalaryLabels = ["Legespesialister", "Allmennpraktiserende leger", "Tannleger", "Spesialsykepleiere", "Alle yrker"];

function getDoctorSalaryRows() {
  const snapshot = legeLonn2025Snapshot as SalarySnapshot;

  return doctorSalaryLabels.flatMap((label) => {
    const row = snapshot.rows.find((entry) => entry.label === label);

    if (!row || typeof row.value !== "number") {
      return [];
    }

    return [
      {
        href: row.href,
        label: row.label,
        value: row.value,
        highlight: row.label === "Alle yrker",
      },
    ];
  });
}

export function DoctorSalaryEditorialChart() {
  const snapshot = legeLonn2025Snapshot as SalarySnapshot;

  return (
    <EditorialDivergingBarChart
      data={getDoctorSalaryRows()}
      format="currency"
      kicker="Legelønn"
      source={snapshot.source}
      subtitleLabel="Median månedslønn"
      subtitleText="i kroner for utvalgte helseyrker, SSB 2025"
      ticks={[0, 30000, 60000, 90000, 120000]}
      title="Hva tjener leger?"
    />
  );
}
