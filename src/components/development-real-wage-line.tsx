import { RealWageLineExplorer } from "@/components/real-wage-line-explorer";
import { realWageLineTestDataset } from "@/lib/development-real-wage-line-data";

export function DevelopmentRealWageLine() {
  return <RealWageLineExplorer dataset={realWageLineTestDataset} />;
}
