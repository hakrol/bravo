import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import overtimeRankingSnapshot from "@/content/blog/data/de-10-yrkene-med-mest-overtidsbetaling-2025.json";

type OvertimeRankingRow = {
  rank: number;
  label: string;
  href: string;
  value: number;
};

type OvertimeRankingSnapshot = {
  rows: OvertimeRankingRow[];
  allOccupations: {
    monthlyOvertimePay: number;
  } | null;
};

const snapshot = overtimeRankingSnapshot as OvertimeRankingSnapshot;

export function TopOvertimePay2025Chart() {
  const topRows = snapshot.rows.slice(0, 10);
  const chartRows = [
    ...topRows.map((row) => ({
      href: row.href,
      label: `${row.rank}. ${row.label}`,
      value: row.value,
      highlight: row.rank === 1,
    })),
    ...(snapshot.allOccupations
      ? [
          {
            label: "Alle yrker",
            value: snapshot.allOccupations.monthlyOvertimePay,
          },
        ]
      : []),
  ];

  return (
    <EditorialDivergingBarChart
      data={chartRows}
      format="currency"
      kicker="Overtidsbetaling"
      note="Rangeringen bruker gjennomsnittlig overtidsbetaling per måned for firesifrede STYRK-08-yrker i 2025. Begge kjønn, alle sektorer og arbeidstid i alt er inkludert. Samlegrupper, uoppgitte yrker og manglende verdier er utelatt."
      source="SSB tabell 11418"
      subtitleLabel="Kroner per måned"
      subtitleText="i gjennomsnittlig overtidsbetaling i 2025."
      ticks={[0, 5000, 10000, 15000]}
      title="Arbeidsledere innen bergfag topper overtidslisten"
    />
  );
}
