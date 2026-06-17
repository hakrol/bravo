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
  medianBasicSalarySeries: OccupationSalaryTimeSeries;
  relatedRows: OccupationRelatedSalaryRow[];
};
