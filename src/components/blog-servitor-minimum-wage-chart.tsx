import { RestaurantMinimumWageChart } from "@/components/restaurant-minimum-wage-chart";
import snapshotData from "@/content/blog/data/minstelonn-servitor-2026.json";

type MinimumWageSnapshot = {
  verifiedAt: string;
  adultRateHistory: {
    effectiveFrom: string;
    adultRate: number;
  }[];
};

const snapshot = snapshotData as MinimumWageSnapshot;

export function ServitorMinimumWageDevelopmentChart() {
  return (
    <RestaurantMinimumWageChart points={snapshot.adultRateHistory} today={snapshot.verifiedAt} />
  );
}
