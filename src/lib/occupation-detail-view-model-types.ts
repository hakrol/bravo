import type { OccupationMedianSalaryRow } from "@/lib/occupation-salary-overview";
import type {
  OccupationDetailTrendData,
  OccupationLaborMarketStats,
  OccupationSalaryDistribution,
  OccupationSectorSalaryTimeSeries,
  OccupationSalaryTimeSeries,
} from "@/lib/ssb";

export type OccupationRelatedSalaryRow = {
  occupationCode: string;
  occupationLabel: string;
  href: string;
  medianAll?: number;
  medianWomen?: number;
  medianMen?: number;
  growthWomen?: number;
  growthMen?: number;
  groupCode: string;
};

export type OccupationSupplementMetrics = {
  bonus?: number;
  overtime?: number;
  irregularAdditions?: number;
};

export type OccupationSupplementSnapshot = {
  occupationCode: string;
  occupationLabel: string;
  periodLabel?: string;
  updated?: string;
  total?: OccupationSupplementMetrics;
  women?: OccupationSupplementMetrics;
  men?: OccupationSupplementMetrics;
};

export type OccupationDetailPageData = {
  trendData: OccupationDetailTrendData;
  distribution: OccupationSalaryDistribution | null;
  contractedDistribution?: OccupationSalaryDistribution | null;
  medianOverview: {
    rows: OccupationMedianSalaryRow[];
    periodLabel?: string;
    measureLabel: string;
  };
  laborMarketStats: OccupationLaborMarketStats | null;
  sectorSalarySeries?: OccupationSectorSalaryTimeSeries | null;
  supplementMedian?: OccupationSupplementSnapshot | null;
  supplementAverage?: OccupationSupplementSnapshot | null;
  medianBasicSalarySeries: OccupationSalaryTimeSeries;
  relatedRows: OccupationRelatedSalaryRow[];
};
