import { BlogGenderSalaryCards } from "@/components/blog-gender-salary-cards";
import {
  BlogSalaryDevelopmentChart,
  type BlogSalaryDevelopmentSeries,
} from "@/components/blog-salary-development-chart";
import systemarkitektLonn2025Snapshot from "@/content/blog/data/systemarkitekt-lonn-2025.json";

type SystemArchitectSalarySnapshot = {
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
  return systemarkitektLonn2025Snapshot as SystemArchitectSalarySnapshot;
}

export function SystemArchitectGenderSalaryCards() {
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

export function SystemArchitectSalaryDevelopmentChart() {
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
      note="Tallene gjelder STYRK-08 2511 Systemanalytikere/-arkitekter, alle sektorer og arbeidstid i alt. Utviklingen er nominell og ikke justert for prisvekst."
      series={series}
      source={development.source}
      subtitle="Median månedslønn for systemanalytikere/-arkitekter fra 2021 til 2025."
      title="Medianlønnen økte med 12 490 kroner gjennom fem årganger"
      yAxisLabel="Median månedslønn"
    />
  );
}
