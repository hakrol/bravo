import { BlogChart, type BlogChartDatum } from "@/components/blog-chart";
import lowestPaidOccupationsSnapshot from "@/content/blog/data/lavest-lonnede-yrker-2025.json";

type LowestPaidOccupationsSnapshot = {
  rows: {
    label: string;
    value: number;
    employees: number;
  }[];
};

const snapshot = lowestPaidOccupationsSnapshot as LowestPaidOccupationsSnapshot;

const bubbleLayout: Record<string, Pick<BlogChartDatum, "lane" | "labelOffset" | "showLabel" | "radiusBoost">> = {
  "Hjelpearbeidere i nyttevekstproduksjon": { lane: 0.12, showLabel: false },
  "Hjelpearbeidere i husdyrproduksjon": { lane: 0.26, showLabel: false },
  Intervjuere: { lane: 0.4, labelOffset: { x: -12, y: -22, anchor: "end" } },
  "Hjelpearbeidere i skogbruk": { lane: 0.54, showLabel: false },
  "Mannekenger og modeller": { lane: 0.67, showLabel: false },
  "Sykkelreparatører mv.": { lane: 0.18, labelOffset: { x: -12, y: 30, anchor: "end" } },
  "Gatekjøkken- og kafémedarbeidere mv.": { lane: 0.82, labelOffset: { x: 12, y: -26, anchor: "start" }, radiusBoost: 8 },
  "Hjelpearbeidere i kombinasjonsbruk": { lane: 0.36, showLabel: false },
  "Dyrepassere og -trenere mv.": { lane: 0.58, labelOffset: { x: 12, y: 28, anchor: "start" } },
  "Bingoverter, bookmakere mv.": { lane: 0.72, labelOffset: { x: 12, y: 24, anchor: "start" } },
};

export function LowestPaidOccupationsBubbleChart() {
  const data: BlogChartDatum[] = snapshot.rows.map((row) => ({
    label: row.label,
    value: row.value,
    size: row.employees,
    sizeLabel: `${row.employees.toLocaleString("nb-NO")} lønnstakere`,
    category: row.label === "Gatekjøkken- og kafémedarbeidere mv." ? "highlight" : undefined,
    ...bubbleLayout[row.label],
  }));

  return (
    <BlogChart
      data={data}
      format="currency"
      note="Median månedslønn gjelder 2025. Antall lønnstakere gjelder 1. kvartal 2026. Små yrkesgrupper får en minste synlig boblestørrelse."
      source="SSB tabell 11418 og 11658"
      sort="none"
      subtitle="Plasseringen viser median månedslønn. Boblestørrelsen viser antall lønnstakere."
      title="Én lavlønnsgruppe er langt større enn de andre"
      type="bubble"
      xAxisLabel="Median månedslønn"
    />
  );
}
