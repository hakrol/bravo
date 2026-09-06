import {
  BlogSalaryDistributionDevelopmentChart,
  type BlogSalaryDistributionDevelopmentPoint,
} from "@/components/blog-salary-distribution-development-chart";
import distributionSnapshot from "@/content/blog/data/programvareutviklere-lonnsfordeling-utvikling-2016-2025.json";

type DistributionSnapshot = {
  source: string;
  tableId: string;
  gender: string;
  sector: string;
  workingHours: string;
  rows: BlogSalaryDistributionDevelopmentPoint[];
};

export function ProgramvareutviklereSalaryDistributionDevelopmentChart() {
  const snapshot = distributionSnapshot as DistributionSnapshot;

  return (
    <BlogSalaryDistributionDevelopmentChart
      maxYears={10}
      note={`Tallene viser samlet månedslønn for ${snapshot.gender.toLowerCase()}, ${snapshot.sector.toLowerCase()} og arbeidstid ${snapshot.workingHours.toLowerCase()}. År uten komplette tall for P25, median og P75 vises ikke.`}
      points={snapshot.rows}
      source={`${snapshot.source}`}
      subtitle="Båndet viser den midterste halvdelen av lønningene. Medianlinjen viser lønnen til personen midt i fordelingen."
      title="Lønnsfordelingen for programvareutviklere har flyttet seg opp"
    />
  );
}
