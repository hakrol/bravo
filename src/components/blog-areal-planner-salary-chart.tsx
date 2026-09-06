import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import arealplanleggerLonn2025Snapshot from "@/content/blog/data/arealplanlegger-lonn-2025.json";

type ArealPlannerSalarySnapshot = {
  genderMedian: {
    occupationLabel: string;
    period: string;
    source: string;
    womenMonthlyMedian: number;
    menMonthlyMedian: number;
  };
  salaryDevelopment: {
    occupationLabel: string;
    source: string;
    rows: {
      label: string;
      value: number;
    }[];
  };
};

function getSnapshot() {
  return arealplanleggerLonn2025Snapshot as ArealPlannerSalarySnapshot;
}

export function ArealPlannerGenderSalaryCards() {
  const gender = getSnapshot().genderMedian;

  return (
    <BlogGenderSalaryCards
      occupationLabel={gender.occupationLabel}
      period={gender.period}
      source={gender.source}
      womenMonthlyMedian={gender.womenMonthlyMedian}
      menMonthlyMedian={gender.menMonthlyMedian}
    />
  );
}

export function ArealPlannerSalaryDevelopmentChart() {
  const development = getSnapshot().salaryDevelopment;
  const series: BlogSalaryDevelopmentSeries[] = [
    {
      color: "#14532d",
      label: development.occupationLabel,
      points: development.rows,
    },
  ];

  return (
    <BlogSalaryDevelopmentChart
      note="Tallene gjelder STYRK-08 2164 Arealplanleggere, alle sektorer og arbeidstid i alt. Utviklingen er nominell og ikke justert for prisvekst."
      series={series}
      source={development.source}
      subtitle="Median månedslønn for arealplanleggere fra 2021 til 2025."
      title="Arealplanleggerlønnen økte med 13 110 kroner på fem år"
      yAxisLabel="Median månedslønn"
    />
  );
}
