import {
  EditorialDivergingBarChart,
  EditorialVerticalBarChart,
} from "@/components/editorial-diverging-bar-chart";
import parliamentCompensationSnapshot from "@/content/nyheter/data/stortingsrepresentanter-godtgjoring-2026.json";

type ParliamentCompensationSnapshot = {
  roleCompensation: {
    label: string;
    annual: number;
  }[];
  monthlyComparisons: {
    label: string;
    value: number;
    href?: string;
  }[];
};

function getSnapshot() {
  return parliamentCompensationSnapshot as ParliamentCompensationSnapshot;
}

export function ParliamentRoleCompensationChart() {
  return (
    <EditorialVerticalBarChart
      axisMax={2400000}
      data={getSnapshot().roleCompensation.map((row) => ({
        label: row.label,
        value: row.annual,
        highlight: row.label === "Stortingsrepresentant",
      }))}
      format="currency"
      kicker="Fast godtgjøring"
      leftPadding={170}
      source="Stortinget, Vedtak 1050"
      subtitleLabel="Kroner per år"
      subtitleText="satser med virkning fra 1. mai 2026"
      ticks={[0, 500000, 1000000, 1500000, 2000000]}
      title="Tre politiske satser i 2026"
    />
  );
}

export function ParliamentSalaryComparisonChart() {
  return (
    <EditorialDivergingBarChart
      data={getSnapshot().monthlyComparisons.map((row) => ({
        label: row.label,
        value: row.value,
        href: row.href,
        highlight: row.label === "Stortingsrepresentant",
      }))}
      format="currency"
      kicker="Veiledende sammenligning"
      note="Representanttallet er fast årsgodtgjøring fra 1. mai 2026 delt på 12. De andre tallene er gjennomsnittlig månedslønn i SSBs 2025-statistikk. Periodene og lønnsbegrepene er forskjellige."
      source="Stortinget og SSB/Lønnsinnsikt"
      subtitleLabel="Kroner per måned"
      subtitleText="2026-omregning mot gjennomsnittslønn i 2025"
      ticks={[0, 30000, 60000, 90000, 120000, 150000]}
      title="Representantnivået ligger nær flere høytlønte yrker"
    />
  );
}
