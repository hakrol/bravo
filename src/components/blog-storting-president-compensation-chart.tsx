import { BlogSalaryDevelopmentChart } from "@/components/blog-salary-development-chart";
import compensationData from "@/content/blog/data/stortingspresident-godtgjoring-2001-2026.json";

type CompensationData = {
  source: string;
  note: string;
  chartPoints: {
    label: string;
    value: number;
  }[];
};

export function StortingPresidentCompensationChart() {
  const data = compensationData as CompensationData;

  return (
    <BlogSalaryDevelopmentChart
      note={data.note}
      series={[
        {
          color: "#14532d",
          label: "Stortingspresidenten",
          points: data.chartPoints,
        },
      ]}
      source={data.source}
      subtitle="Utvalgte satser etter datoen de fikk virkning"
      title="Godtgjørelsen har økt nominelt over tid"
      xAxisLabelFormat="two-digit-year"
      yAxisLabel="Årlig godtgjørelse"
    />
  );
}
