export type SsbLanguage = "no" | "en";

export type SsbOutputFormat =
  | "json-stat2"
  | "csv"
  | "px"
  | "xlsx"
  | "html"
  | "json-px";

export type SsbOutputFormatParam =
  | "UseCodes"
  | "UseTexts"
  | "UseCodesAndTexts"
  | "IncludeTitle"
  | "SeparatorTab"
  | "SeparatorSpace"
  | "SeparatorSemicolon";

export type SsbHttpErrorCode = 400 | 403 | 404 | 429 | 503;

export type SsbScalar = string | number | boolean;

export type SsbQueryValue = SsbScalar | SsbScalar[] | undefined;

export type SsbQueryParams = Record<string, SsbQueryValue>;

export type SsbSelection = {
  variableCode: string;
  valueCodes: string[];
};

export type SsbPostBody = {
  selection: SsbSelection[];
};

export type SsbTableSummary = {
  id: string;
  label: string;
  updated?: string;
  firstPeriod?: string;
  lastPeriod?: string;
  variableNames?: string[];
  path?: string[][];
};

export type JsonStatCategory = {
  index: Record<string, number>;
  label?: Record<string, string>;
  note?: Record<string, string | string[]>;
  unit?: Record<string, { base?: string; decimals?: number }>;
};

export type JsonStatDimension = {
  label?: string;
  category: JsonStatCategory;
  extension?: Record<string, unknown>;
  elimination?: boolean;
};

export type JsonStatRole = {
  time?: string[];
  metric?: string[];
  geo?: string[];
};

export type JsonStat2Dataset = {
  class?: "dataset";
  label?: string;
  id?: string[];
  size?: number[];
  updated?: string;
  source?: string;
  value: Array<number | null>;
  status?: Record<string, string> | Array<string | null>;
  dimension: Record<string, JsonStatDimension>;
  role?: JsonStatRole;
  note?: string | string[];
  extension?: Record<string, unknown>;
};

export type SsbTableInfo = {
  id: string;
  label: string;
  updated?: string;
  firstPeriod?: string;
  lastPeriod?: string;
  variableNames?: string[];
  path?: string[][];
};

export type SsbCodeListReference = {
  id: string;
  type?: string;
  label?: string;
};

export type SsbMetadataDimension = {
  id: string;
  label: string;
  elimination?: boolean;
  category: JsonStatCategory;
  codeLists?: SsbCodeListReference[];
  note?: string | string[];
  extension?: Record<string, unknown>;
};

export type SsbTableMetadata = {
  class?: "dataset";
  label: string;
  id?: string[];
  size?: number[];
  updated?: string;
  dimension: Record<string, SsbMetadataDimension>;
  role?: JsonStatRole;
  note?: string | string[];
  extension?: Record<string, unknown>;
};

export type SalaryTableSnapshot = {
  tableId: string;
  title: string;
  firstPeriod?: string;
  lastPeriod?: string;
  variableNames: string[];
  dimensions: string[];
  valueCount: number;
  sampleValues: Array<number | null>;
  source: "ssb";
};

export type SsbSalaryTableCategory = "core" | "support";

export type SsbSalaryTableKey =
  | "industryMonthly"
  | "industryDetailed"
  | "industryRegion"
  | "industrySectorRegion"
  | "occupationDetailed"
  | "occupationEmployment"
  | "genderAge"
  | "industryGrowth"
  | "industryHiringFlows"
  | "salaryWorkforceFlows"
  | "industryDetailedDemographics";

export type SsbSalaryTableDefinition = {
  key: SsbSalaryTableKey;
  id: string;
  title: string;
  category: SsbSalaryTableCategory;
  description: string;
};

export type SsbSalaryFilterValue = string | string[];

export type SsbSalaryFilters = Record<string, SsbSalaryFilterValue>;

export type SsbObservationDimension = {
  code: string;
  label: string;
};

export type SsbObservation = {
  value: number | null;
  status?: string | null;
  dimensions: Record<string, SsbObservationDimension>;
};

export type SsbNormalizedDataset = {
  tableId: string;
  tableKey?: SsbSalaryTableKey;
  title: string;
  updated?: string;
  source?: string;
  dimensions: string[];
  rows: SsbObservation[];
};

export type OccupationSalaryTimeSeriesPoint = {
  periodCode: string;
  periodLabel: string;
  valueAll?: number;
  valueWomen?: number;
  valueMen?: number;
};

export type OccupationSalaryTimeSeries = {
  occupationCode: string;
  occupationLabel: string;
  measureLabel: string;
  updated?: string;
  points: OccupationSalaryTimeSeriesPoint[];
};

export type OccupationSupplementTimeSeriesPoint = {
  periodCode: string;
  periodLabel: string;
  bonusAll?: number;
  bonusWomen?: number;
  bonusMen?: number;
  overtimeAll?: number;
  overtimeWomen?: number;
  overtimeMen?: number;
  irregularAdditionsAll?: number;
  irregularAdditionsWomen?: number;
  irregularAdditionsMen?: number;
};

export type OccupationSupplementTimeSeries = {
  occupationCode: string;
  occupationLabel: string;
  updated?: string;
  points: OccupationSupplementTimeSeriesPoint[];
};

export type OccupationSalaryDistributionMetrics = {
  p25?: number;
  median?: number;
  p75?: number;
  average?: number;
};

export type OccupationSalaryDistribution = {
  occupationCode: string;
  occupationLabel: string;
  periodLabel?: string;
  updated?: string;
  total?: OccupationSalaryDistributionMetrics;
  women?: OccupationSalaryDistributionMetrics;
  men?: OccupationSalaryDistributionMetrics;
};

export type OccupationEmploymentLatest = {
  occupationCode: string;
  occupationLabel: string;
  periodCode: string;
  periodLabel: string;
  value: number;
  unit: string;
  updated?: string;
};

export type OccupationWorkforceLatest = {
  occupationCode: string;
  occupationLabel: string;
  periodCode: string;
  periodLabel: string;
  employees?: number;
  jobs?: number;
  employeeUnit: string;
  jobUnit: string;
  updated?: string;
};

export type OccupationEmploymentTimeSeriesPoint = {
  periodCode: string;
  periodLabel: string;
  total?: number;
  women?: number;
  men?: number;
};

export type OccupationWorkforceTimeSeriesPoint = {
  periodCode: string;
  periodLabel: string;
  employeesAll?: number;
  employeesWomen?: number;
  employeesMen?: number;
  jobsAll?: number;
  jobsWomen?: number;
  jobsMen?: number;
};

export type OccupationEmploymentGenderBreakdown = {
  periodCode: string;
  periodLabel: string;
  total: number;
  women: number;
  men: number;
  womenShare: number;
  menShare: number;
};

export type OccupationEmploymentGrowth = {
  latestPeriodCode: string;
  latestPeriodLabel: string;
  latestValue: number;
  previousPeriodCode?: string;
  previousPeriodLabel?: string;
  previousValue?: number;
  yearOverYearChange?: number;
  baselinePeriodCode?: string;
  baselinePeriodLabel?: string;
  baselineValue?: number;
  changeSinceBaseline?: number;
};

export type OccupationEmploymentContractType = {
  periodCode: string;
  periodLabel: string;
  total?: number;
  permanent?: number;
  temporary?: number;
  unspecified?: number;
  permanentShare?: number;
  temporaryShare?: number;
  unspecifiedShare?: number;
};

export type OccupationAgeTimeSeriesPoint = {
  periodCode: string;
  periodLabel: string;
  averageAll?: number;
  averageWomen?: number;
  averageMen?: number;
};

export type OccupationAgeLatest = {
  occupationCode: string;
  occupationLabel: string;
  periodCode: string;
  periodLabel: string;
  averageAll?: number;
  averageWomen?: number;
  averageMen?: number;
  updated?: string;
};

export type OccupationLaborMarketStats = {
  occupationCode: string;
  occupationLabel: string;
  updated?: string;
  employeeUnit: string;
  jobUnit: string;
  workforcePoints: OccupationWorkforceTimeSeriesPoint[];
  latest: OccupationWorkforceLatest | null;
  genderBreakdown: OccupationEmploymentGenderBreakdown | null;
  growth: OccupationEmploymentGrowth | null;
  contractType: OccupationEmploymentContractType | null;
  age: OccupationAgeLatest | null;
  ageSeries: OccupationAgeTimeSeriesPoint[];
};

export type InflationQuarterPoint = {
  periodCode: string;
  periodLabel: string;
  averageIndex: number;
  yearOverYearChange?: number;
};

export type OccupationPurchasingPowerRow = {
  rowKey: string;
  occupationCode: string;
  occupationLabel: string;
  latestSalary: number;
  previousSalary: number;
  salaryGrowth: number;
  inflationGrowth: number;
  realGrowth: number;
  purchasingPowerInsight: string;
};

export type OccupationPurchasingPowerOverview = {
  latestPeriodCode: string;
  latestPeriodLabel: string;
  previousPeriodCode: string;
  previousPeriodLabel: string;
  inflationTableId: string;
  salaryTableId: string;
  inflationUpdated?: string;
  salaryUpdated?: string;
  inflationGrowth: number;
  rows: OccupationPurchasingPowerRow[];
};

export type OccupationPurchasingPowerDetail = {
  occupationCode: string;
  occupationLabel: string;
  latestPeriodCode: string;
  latestPeriodLabel: string;
  previousPeriodCode: string;
  previousPeriodLabel: string;
  salaryTableId: string;
  inflationTableId: string;
  salaryUpdated?: string;
  inflationUpdated?: string;
  latestSalary: number;
  previousSalary: number;
  salaryGrowth: number;
  inflationGrowth: number;
  realGrowth: number;
  purchasingPowerInsight: string;
};

export type OccupationPurchasingPowerTimeSeriesPoint = {
  periodCode: string;
  periodLabel: string;
  salaryGrowthAll?: number;
  salaryGrowthWomen?: number;
  salaryGrowthMen?: number;
  inflationGrowth: number;
  realGrowthAll?: number;
  realGrowthWomen?: number;
  realGrowthMen?: number;
};

export type OccupationPurchasingPowerTimeSeries = {
  occupationCode: string;
  occupationLabel: string;
  salaryTableId: string;
  inflationTableId: string;
  salaryUpdated?: string;
  inflationUpdated?: string;
  points: OccupationPurchasingPowerTimeSeriesPoint[];
};

export type OccupationDetailTrendData = {
  series: OccupationSalaryTimeSeries;
  purchasingPower: OccupationPurchasingPowerDetail | null;
  purchasingPowerSeries: OccupationPurchasingPowerTimeSeries;
};
