import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import trondheimMayorCompensationSnapshot from "@/content/blog/data/trondheim-ordforer-godtgjoring-2026.json";

type TrondheimMayorCompensationSnapshot = {
  effectiveFrom: string;
  parliamentRepresentativeAnnual: number;
  source: string;
  rows: {
    label: string;
    percentage: number;
    annual: number;
  }[];
};

function getSnapshot() {
  return trondheimMayorCompensationSnapshot as TrondheimMayorCompensationSnapshot;
}

export function TrondheimMayorCompensationChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={snapshot.rows.map((row) => ({
        label: row.label,
        value: row.annual,
        highlight: row.label === "Ordfører",
      }))}
      format="currency"
      kicker="Godtgjøring i Trondheim"
      note="Årsbeløpene er beregnet fra stortingsgodtgjøringen og avrundet til nærmeste krone. Velferdsordninger og utgiftsdekning er ikke inkludert."
      source={`${snapshot.source}, satser fra 1. mai 2026`}
      subtitleLabel="Kroner per år"
      subtitleText="fast godtgjøring for politiske verv"
      ticks={[0, 400000, 800000, 1200000, 1600000]}
      title="Ordfører og byrådsleder ligger på samme nivå"
    />
  );
}
