export type {
  JsonStat2Dataset,
  JsonStatDimension,
  JsonStatRole,
  InflationQuarterPoint,
  OccupationPurchasingPowerDetail,
  OccupationPurchasingPowerOverview,
  OccupationPurchasingPowerTimeSeries,
  OccupationPurchasingPowerTimeSeriesPoint,
  OccupationPurchasingPowerRow,
  OccupationSalaryTimeSeries,
  OccupationSalaryTimeSeriesPoint,
  SalaryTableSnapshot,
  SsbNormalizedDataset,
  SsbObservation,
  SsbObservationDimension,
  SsbHttpErrorCode,
  SsbLanguage,
  SsbOutputFormat,
  SsbOutputFormatParam,
  SsbPostBody,
  SsbQueryParams,
  SsbSalaryFilters,
  SsbSalaryTableCategory,
  SsbSalaryTableDefinition,
  SsbSalaryTableKey,
  SsbTableInfo,
  SsbTableMetadata,
  SsbTableSummary,
} from "./types";

export {
  SSB_BASE_URL,
  SSB_MAX_CELLS,
  SSB_MAX_GET_URL_LENGTH,
  SSB_MAX_REQUESTS_PER_MINUTE,
  buildSsbUrl,
  getTableData,
  getTableInfo,
  getTableMetadata,
  listTables,
  postTableData,
  ssbGetJson,
  ssbPostJson,
} from "./client";

export {
  buildLatestQueryFromMetadata,
  ACCOUNTANT_OCCUPATION_CODE,
  CORE_SALARY_TABLE_KEYS,
  DEFAULT_SALARY_TABLE_ID,
  DEFAULT_SALARY_TABLE_KEY,
  getLatestSalaryDataset,
  getLatestSalaryDatasets,
  getOccupationPurchasingPowerDetail,
  getOccupationSalaryTimeSeries,
  getOccupationPurchasingPowerOverview,
  getOccupationPurchasingPowerTimeSeries,
  getLatestTableData,
  OCCUPATION_MONTHLY_SALARY_FILTERS,
  getRecentlyUpdatedTables,
  getSalaryTableDefinition,
  getSalaryTableSnapshot,
  getTableDataFrom,
  listSalaryTableDefinitions,
  runTablePostQuery,
  searchTables,
  SSB_SALARY_TABLES,
  SSB_INFLATION_TABLE_ID,
  SUPPORT_SALARY_TABLE_KEYS,
} from "./queries";

export { SSB_API_NOTES } from "./docs";

export async function getSalaryData() {
  const { getSalaryTableSnapshot } = await import("./queries");
  return getSalaryTableSnapshot();
}

export type SalaryResponse = import("./types").SalaryTableSnapshot;
