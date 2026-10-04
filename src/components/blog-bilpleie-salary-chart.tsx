import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import snapshot from "@/content/blog/data/bilpleie-lonn-2025.json";

export function BilpleieSalaryEditorialChart() {
  const data = snapshot.rows.flatMap((row) =>
    typeof row.value === "number"
      ? [{ label: row.label, href: row.href, value: row.value }]
      : [],
  );

  return (
    <EditorialDivergingBarChart
      data={data}
      format="currency"
      kicker="Faktisk lønn i relevante yrker"
      title="Bilvaskere har lavere medianlønn enn de to faggruppene"
      subtitleLabel="Median månedslønn"
      subtitleText="før skatt i 2025 – ikke lovpålagt minstelønn"
      source={snapshot.source}
      note="Alle sektorer, begge kjønn, heltid og deltid samlet; deltidslønn omregnet til heltid. Andre rengjørere (9129) mangler lønnstall i uttrekket og vises ikke som en nullverdi. Yrkesgruppene avgjør ikke om forskriften gjelder."
      ticks={[0, 10000, 20000, 30000, 40000, 50000, 60000]}
    />
  );
}
