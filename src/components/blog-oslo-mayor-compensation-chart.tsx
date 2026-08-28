import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import osloMayorCompensationSnapshot from "@/content/blog/data/oslo-ordforer-godtgjoring-2026.json";

type OsloMayorCompensationSnapshot = {
  effectiveFrom: string;
  source: string;
  rows: {
    label: string;
    annual: number;
  }[];
};

function getSnapshot() {
  return osloMayorCompensationSnapshot as OsloMayorCompensationSnapshot;
}

export function OsloMayorCompensationChart() {
  const snapshot = getSnapshot();

  return (
    <EditorialDivergingBarChart
      data={snapshot.rows.map((row) => ({
        label: row.label,
        value: row.annual,
        highlight: row.label === "Ordfører",
      }))}
      format="currency"
      kicker="Godtgjøring i Oslo"
      note="Beløpene er fast årlig godtgjøring for politiske verv, ikke ordinær lønn."
      source={`${snapshot.source}, satser fra 1. mai 2026`}
      subtitleLabel="Kroner per år"
      subtitleText="fast godtgjøring for fire heltidspolitiske verv"
      ticks={[0, 500000, 1000000, 1500000, 2000000]}
      title="Ordfører og byrådsleder får samme godtgjøring"
    />
  );
}
