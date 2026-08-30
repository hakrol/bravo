import { BlogChart } from "@/components/blog-chart";
import royalApanageSnapshot from "@/content/blog/data/kongen-dronningen-apanasje-2017-2026.json";

type RoyalApanageSnapshot = {
  source: string;
  note: string;
  series: {
    year: number;
    kingAndQueen: number;
    crownPrinceCouple: number;
  }[];
};

export function RoyalApanageDevelopmentChart() {
  const snapshot = royalApanageSnapshot as RoyalApanageSnapshot;

  return (
    <BlogChart
      format="currency"
      note={snapshot.note}
      series={[
        {
          label: "Kongen og Dronningen",
          color: "#14532d",
          points: snapshot.series.map((row) => ({ label: String(row.year), value: row.kingAndQueen })),
        },
        {
          label: "Kronprinsen og Kronprinsessen",
          color: "#b45309",
          points: snapshot.series.map((row) => ({ label: String(row.year), value: row.crownPrinceCouple })),
        },
      ]}
      source={snapshot.source}
      subtitle="Årlige nominelle bevilgninger i kroner"
      title="Apanasjene har økt hvert år siden 2017"
      type="line"
      yAxisLabel="Apanasje i kroner"
    />
  );
}
