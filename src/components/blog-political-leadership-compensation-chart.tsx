import { EditorialVerticalBarChart } from "@/components/editorial-diverging-bar-chart";
import politicalLeadershipSnapshot from "@/content/blog/data/politisk-ledelse-godtgjoring-1996-2026.json";

type PoliticalLeadershipSnapshot = {
  editorialChartRows: {
    label: string;
    value: number;
  }[];
};

function getSnapshot() {
  return politicalLeadershipSnapshot as PoliticalLeadershipSnapshot;
}

export function PoliticalLeadershipCompensationChart() {
  return (
    <EditorialVerticalBarChart
      axisMax={2400000}
      data={getSnapshot().editorialChartRows.map((row) => ({
        label: row.label,
        value: row.value,
        highlight: row.label === "2026",
      }))}
      format="currency"
      kicker="Godtgjørelse"
      leftPadding={160}
      source="Stortingets offisielle serie, 1996-2026"
      subtitleLabel="Statsministeren"
      subtitleText="årlig godtgjørelse ved utvalgte satser"
      ticks={[0, 500000, 1000000, 1500000, 2000000]}
      title="Økt med nesten 1,6 millioner siden 1996"
    />
  );
}
