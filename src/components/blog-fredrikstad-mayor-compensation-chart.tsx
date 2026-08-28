import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import fredrikstadMayorCompensationSnapshot from "@/content/blog/data/fredrikstad-ordforer-godtgjoring-2026.json";

type FredrikstadMayorCompensationSnapshot = {
  effectiveFrom: string;
  parliamentRepresentativeAnnual: number;
  source: string;
  rows: {
    label: string;
    annual: number;
  }[];
};

function getSnapshot() {
  return fredrikstadMayorCompensationSnapshot as FredrikstadMayorCompensationSnapshot;
}

export function FredrikstadMayorCompensationChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={snapshot.rows.map((row) => ({
        label: row.label,
        value: row.annual,
        highlight: row.label === "Ordfører",
      }))}
      format="currency"
      kicker="Godtgjøring i Fredrikstad"
      note="Stortingsgodtgjøringen er beregningsgrunnlaget. Varaordførerbeløpet viser 90 prosent frikjøp i perioden 2023–2027."
      source={`${snapshot.source}, satser fra 1. mai 2026`}
      subtitleLabel="Kroner per år"
      subtitleText="fast godtgjøring og beregningsgrunnlag"
      ticks={[0, 400000, 800000, 1200000, 1600000]}
      title="Ordføreren får 120 prosent av stortingsnivået"
    />
  );
}
