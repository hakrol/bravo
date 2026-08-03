import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import { EditorialDivergingBarChart } from "@/components/editorial-diverging-bar-chart";
import buildingWorkersSnapshot from "@/content/blog/data/bygningsarbeidere-lonn-2025.json";

type BuildingWorkerFamily = {
  label: string;
  medianAnnualSalary: number;
  salaryDevelopment: {
    label: string;
    value: number;
  }[];
};

type BuildingWorkersSnapshot = {
  families: BuildingWorkerFamily[];
};

const snapshot = buildingWorkersSnapshot as BuildingWorkersSnapshot;

export function BuildingWorkerFamiliesSalaryChart() {
  return (
    <EditorialDivergingBarChart
      data={snapshot.families.map((family) => ({
        label: family.label,
        value: family.medianAnnualSalary,
        highlight: family.label === "Bygningstekniske arbeidere",
      }))}
      format="currency"
      kicker="Årslønn i byggfag"
      source="SSB tabell 11418"
      subtitleLabel="Beregnet median årslønn"
      subtitleText="median månedslønn ganger 12, begge kjønn og alle sektorer i 2025"
      ticks={[0, 200000, 400000, 600000, 700000]}
      title="Bygningstekniske arbeidere hadde høyest medianlønn"
    />
  );
}

export function BuildingWorkerFamiliesSalaryDevelopmentChart() {
  const colors = ["#14532d", "#b45309"];
  const series: BlogSalaryDevelopmentSeries[] = snapshot.families.map(
    (family, index) => ({
      color: colors[index],
      label: family.label,
      points: family.salaryDevelopment,
    }),
  );

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene viser median månedslønn for begge kjønn, alle sektorer og heltid og deltid samlet. Utviklingen er nominell og ikke justert for prisvekst."
      series={series}
      source="SSB tabell 11418"
      subtitle="Median månedslønn fra 2021 til 2025 for de to yrkesgruppene."
      title="Begge gruppene fikk over 20 prosent lønnsvekst på fem år"
      yAxisLabel="Median månedslønn"
    />
  );
}
