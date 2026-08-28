import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import stavangerMayorCompensationSnapshot from "@/content/blog/data/stavanger-ordforer-godtgjoring-2026.json";

type StavangerMayorCompensationSnapshot = {
  effectiveFrom: string;
  source: string;
  rows: {
    label: string;
    annual: number;
  }[];
};

function getSnapshot() {
  return stavangerMayorCompensationSnapshot as StavangerMayorCompensationSnapshot;
}

export function StavangerMayorCompensationChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={snapshot.rows.map((row) => ({
        label: row.label,
        value: row.annual,
        highlight: row.label === "Ordfører",
      }))}
      format="currency"
      kicker="Godtgjøring i Stavanger"
      note="Beregningsgrunnlaget B er en referanseverdi, ikke en utbetaling til et politisk verv. Eksterne honorarer og andre ordninger er ikke inkludert."
      source={`${snapshot.source}, satser fra 1. januar 2026`}
      subtitleLabel="Kroner per år"
      subtitleText="beregningsgrunnlag og fast godtgjøring"
      ticks={[0, 500000, 1000000, 1500000, 2000000]}
      title="Ordføreren får 100 000 kroner mindre enn grunnlaget"
    />
  );
}
