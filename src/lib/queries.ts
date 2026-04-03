import { unstable_cache } from "next/cache";
import {
  getTableData,
  getTableInfo,
  getTableMetadata,
  listTables,
  postTableData,
} from "./client";
import { buildOccupationMedianSalaryOverview } from "./occupation-salary-overview";
import type {
  InflationQuarterPoint,
  OccupationAgeLatest,
  OccupationDetailTrendData,
  OccupationAgeTimeSeriesPoint,
  OccupationEmploymentContractType,
  OccupationEmploymentGenderBreakdown,
  OccupationEmploymentLatest,
  OccupationEmploymentGrowth,
  OccupationEmploymentTimeSeriesPoint,
  OccupationLaborMarketStats,
  OccupationWorkforceTimeSeriesPoint,
  OccupationPurchasingPowerDetail,
  OccupationPurchasingPowerOverview,
  OccupationPurchasingPowerTimeSeries,
  OccupationPurchasingPowerTimeSeriesPoint,
  OccupationPurchasingPowerRow,
  OccupationSalaryDistribution,
  OccupationSalaryDistributionMetrics,
  OccupationSupplementTimeSeries,
  OccupationSupplementTimeSeriesPoint,
  OccupationSalaryTimeSeries,
  OccupationSalaryTimeSeriesPoint,
  SsbNormalizedDataset,
  SalaryTableSnapshot,
  SsbSalaryFilters,
  SsbSalaryTableCategory,
  SsbSalaryTableDefinition,
  SsbSalaryTableKey,
  SsbLanguage,
  SsbTableMetadata,
  SsbPostBody,
  SsbQueryParams,
} from "./types";

export const OCCUPATION_MONTHLY_SALARY_FILTERS: SsbSalaryFilters = {
  Alder: "999D",
  ContentsCode: "GjAvtaltMdlonn",
};

export const OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS: SsbSalaryFilters = {
  Alder: "999D",
  ContentsCode: "MedianAvtMndLonn",
};

export const OCCUPATION_AVERAGE_AGE_FILTERS: SsbSalaryFilters = {
  Alder: "999D",
  ContentsCode: "GjsnAlder",
};

export const OCCUPATION_SUPPLEMENT_FILTERS: SsbSalaryFilters = {
  MaaleMetode: "02",
  Sektor: "ALLE",
  Kjonn: ["0", "1", "2"],
  AvtaltVanlig: "0",
  ContentsCode: ["Bonus", "Overtid", "Uregtil"],
};

export const OCCUPATION_WORKFORCE_FILTERS: SsbSalaryFilters = {
  Alder: "999D",
  ContentsCode: ["Lonsstakere", "AntArbForhold"],
};

export const ACCOUNTANT_OCCUPATION_CODE = "3313";
export const SSB_INFLATION_TABLE_ID = "14700";
export const SSB_OCCUPATION_DISTRIBUTION_TABLE_ID = "11418";
export const SSB_OCCUPATION_EMPLOYMENT_TABLE_ID = "09792";
export const SSB_OCCUPATION_CONTRACT_TABLE_ID = "14437";

export const SSB_SALARY_TABLES: Record<SsbSalaryTableKey, SsbSalaryTableDefinition> = {
  industryMonthly: {
    key: "industryMonthly",
    id: "13126",
    title: "MÃ¥nedlig lÃ¸nn per nÃ¦ring (17 grupper)",
    category: "core",
    description: "HÃ¸yfrekvent lÃ¸nnsutvikling per hovednÃ¦ring.",
  },
  industryDetailed: {
    key: "industryDetailed",
    id: "12314",
    title: "LÃ¸nn og indeks per nÃ¦ring (88 grupper)",
    category: "core",
    description: "Detaljert lÃ¸nnsnivÃ¥ og indeks per nÃ¦ring.",
  },
  industryRegion: {
    key: "industryRegion",
    id: "11654",
    title: "LÃ¸nn per nÃ¦ring og arbeidssted",
    category: "core",
    description: "LÃ¸nn per nÃ¦ring koblet mot arbeidssted og geografi.",
  },
  industrySectorRegion: {
    key: "industrySectorRegion",
    id: "11655",
    title: "LÃ¸nn per nÃ¦ring, sektor og arbeidssted",
    category: "core",
    description: "Geografisk lÃ¸nn med sektorsnitt.",
  },
  occupationDetailed: {
    key: "occupationDetailed",
    id: "11658",
    title: "LÃ¸nn per yrke (4-siffer)",
    category: "core",
    description: "Detaljert lÃ¸nn per yrke.",
  },
  occupationEmployment: {
    key: "occupationEmployment",
    id: SSB_OCCUPATION_EMPLOYMENT_TABLE_ID,
    title: "Sysselsatte per yrke (4-siffer)",
    category: "support",
    description: "Antall sysselsatte per yrke i 1 000 personer.",
  },
  genderAge: {
    key: "genderAge",
    id: "11652",
    title: "LÃ¸nn etter kjÃ¸nn og alder",
    category: "core",
    description: "Demografiske lÃ¸nnsforskjeller.",
  },
  industryGrowth: {
    key: "industryGrowth",
    id: "12316",
    title: "Jobboppgang og jobbnedgang per nÃ¦ring",
    category: "support",
    description: "Markedsdynamikk per nÃ¦ring.",
  },
  industryHiringFlows: {
    key: "industryHiringFlows",
    id: "12821",
    title: "Nyansettelser og avslutninger per nÃ¦ring",
    category: "support",
    description: "TemperaturmÃ¥ling for arbeidsmarkedet.",
  },
  salaryWorkforceFlows: {
    key: "salaryWorkforceFlows",
    id: "13876",
    title: "ArbeidskraftsstrÃ¸mmer og lÃ¸nn",
    category: "support",
    description: "Kombinerer lÃ¸nn med mobilitet i arbeidsmarkedet.",
  },
  industryDetailedDemographics: {
    key: "industryDetailedDemographics",
    id: "11656",
    title: "LÃ¸nn per detaljert nÃ¦ring, kjÃ¸nn og alder",
    category: "support",
    description: "Detaljert nÃ¦ring med demografisk segmentering.",
  },
};

export const CORE_SALARY_TABLE_KEYS: SsbSalaryTableKey[] = [
  "industryMonthly",
  "industryDetailed",
  "industryRegion",
  "industrySectorRegion",
  "occupationDetailed",
  "genderAge",
];

export const SUPPORT_SALARY_TABLE_KEYS: SsbSalaryTableKey[] = [
  "occupationEmployment",
  "industryGrowth",
  "industryHiringFlows",
  "salaryWorkforceFlows",
  "industryDetailedDemographics",
];

export const DEFAULT_SALARY_TABLE_ID = SSB_SALARY_TABLES.industryDetailed.id;
export const DEFAULT_SALARY_TABLE_KEY: SsbSalaryTableKey = "industryDetailed";

export async function searchTables(query: string, lang: SsbLanguage = "no") {
  return listTables({ query }, lang);
}

export async function getRecentlyUpdatedTables(
  pastdays: number,
  lang: SsbLanguage = "no",
) {
  return listTables({ pastdays }, lang);
}

export async function getLatestTableData(
  tableId: string,
  extraQuery: SsbQueryParams = {},
  lang: SsbLanguage = "no",
) {
  return getTableData(
    tableId,
    {
      "valueCodes[Tid]": "top(1)",
      ...extraQuery,
    },
    lang,
  );
}

export async function getTableDataFrom(
  tableId: string,
  startValue: string,
  extraQuery: SsbQueryParams = {},
  lang: SsbLanguage = "no",
) {
  return getTableData(
    tableId,
    {
      "valueCodes[Tid]": `from(${startValue})`,
      ...extraQuery,
    },
    lang,
  );
}

export async function runTablePostQuery(
  tableId: string,
  body: SsbPostBody,
  extraQuery: SsbQueryParams = {},
  lang: SsbLanguage = "no",
) {
  return postTableData(
    tableId,
    body,
    {
      outputFormat: "json-stat2",
      ...extraQuery,
    },
    lang,
  );
}

export function getSalaryTableDefinition(key: SsbSalaryTableKey) {
  return SSB_SALARY_TABLES[key];
}

export function listSalaryTableDefinitions(category?: SsbSalaryTableCategory) {
  const tables = Object.values(SSB_SALARY_TABLES);

  if (!category) {
    return tables;
  }

  return tables.filter((table) => table.category === category);
}

export function buildLatestQueryFromMetadata(
  metadata: SsbTableMetadata,
  filters: SsbSalaryFilters = {},
): SsbQueryParams {
  const dimensions = metadata.id ?? Object.keys(metadata.dimension);
  const timeDimensions = new Set(metadata.role?.time ?? []);
  const query: SsbQueryParams = {};

  for (const dimension of dimensions) {
    const filterValue = filters[dimension];

    if (filterValue !== undefined) {
      query[`valueCodes[${dimension}]`] = filterValue;
      continue;
    }

    query[`valueCodes[${dimension}]`] = timeDimensions.has(dimension) ? "top(1)" : "*";
  }

  return query;
}

const getLatestSalaryDatasetCached = unstable_cache(
  async (
    tableKey: SsbSalaryTableKey,
    filters: SsbSalaryFilters = {},
    lang: SsbLanguage = "no",
  ): Promise<SsbNormalizedDataset> => {
    const table = getSalaryTableDefinition(tableKey);
    const metadata = await getTableMetadata(table.id, lang);
    const query = buildLatestQueryFromMetadata(metadata, filters);
    const [info, dataset] = await Promise.all([
      getTableInfo(table.id, lang),
      getTableData(table.id, query, lang),
    ]);

    return normalizeDataset(dataset, {
      tableId: table.id,
      tableKey: table.key,
      title: info.label,
    });
  },
  ["ssb-latest-salary-dataset"],
  { revalidate: 300 },
);

export async function getLatestSalaryDataset(
  tableKey: SsbSalaryTableKey,
  filters: SsbSalaryFilters = {},
  lang: SsbLanguage = "no",
): Promise<SsbNormalizedDataset> {
  return getLatestSalaryDatasetCached(tableKey, filters, lang);
}

const getLatestAndPreviousYearSalaryDatasetsCached = unstable_cache(
  async (
    tableKey: SsbSalaryTableKey,
    filters: SsbSalaryFilters = {},
    lang: SsbLanguage = "no",
  ): Promise<{
    latestDataset: SsbNormalizedDataset;
    previousDataset: SsbNormalizedDataset | null;
    latestPeriodCode?: string;
    previousPeriodCode?: string;
  }> => {
    const table = getSalaryTableDefinition(tableKey);
    const metadata = await getTableMetadata(table.id, lang);
    const timeDimensionCode = metadata.role?.time?.[0];
    const latestQuery = buildLatestQueryFromMetadata(metadata, filters);
    const [info, latestDataset] = await Promise.all([
      getTableInfo(table.id, lang),
      getTableData(table.id, latestQuery, lang),
    ]);

    const normalizedLatestDataset = normalizeDataset(latestDataset, {
      tableId: table.id,
      tableKey: table.key,
      title: info.label,
    });

    const latestPeriod = timeDimensionCode
      ? normalizedLatestDataset.rows[0]?.dimensions[timeDimensionCode]
      : undefined;
    const latestPeriodCode = normalizeQuarterPeriodCode(latestPeriod?.code, latestPeriod?.label);
    const previousPeriodCode = latestPeriodCode
      ? getPreviousYearQuarterCode(latestPeriodCode)
      : undefined;

    if (!timeDimensionCode || !previousPeriodCode) {
      return {
        latestDataset: normalizedLatestDataset,
        previousDataset: null,
        latestPeriodCode,
        previousPeriodCode,
      };
    }

    const previousQuery = {
      ...buildLatestQueryFromMetadata(metadata, filters),
      [`valueCodes[${timeDimensionCode}]`]: previousPeriodCode,
    };
    const previousDataset = await getTableData(table.id, previousQuery, lang);
    const normalizedPreviousDataset = normalizeDataset(previousDataset, {
      tableId: table.id,
      tableKey: table.key,
      title: info.label,
    });

    return {
      latestDataset: normalizedLatestDataset,
      previousDataset: normalizedPreviousDataset,
      latestPeriodCode,
      previousPeriodCode,
    };
  },
  ["ssb-latest-and-previous-year-salary-datasets"],
  { revalidate: 300 },
);

export async function getLatestAndPreviousYearSalaryDatasets(
  tableKey: SsbSalaryTableKey,
  filters: SsbSalaryFilters = {},
  lang: SsbLanguage = "no",
) {
  return getLatestAndPreviousYearSalaryDatasetsCached(tableKey, filters, lang);
}

export async function getLatestSalaryDatasets(
  tableKeys: SsbSalaryTableKey[] = CORE_SALARY_TABLE_KEYS,
  lang: SsbLanguage = "no",
) {
  return Promise.all(tableKeys.map((tableKey) => getLatestSalaryDataset(tableKey, {}, lang)));
}

export async function getOccupationSalaryDistribution(
  occupationCode: string,
  filters: SsbSalaryFilters = OCCUPATION_MONTHLY_SALARY_FILTERS,
  lang: SsbLanguage = "no",
): Promise<OccupationSalaryDistribution | null> {
  const tableId = SSB_OCCUPATION_DISTRIBUTION_TABLE_ID;
  const metadata = await getTableMetadata(tableId, lang);
  const distributionQuery = buildLatestQueryFromMetadata(metadata, {
    ...filters,
    MaaleMetode: ["01", "02", "051", "061"],
    Yrke: occupationCode,
    Sektor: "ALLE",
    Kjonn: ["0", "1", "2"],
    AvtaltVanlig: "0",
    ContentsCode: "AvtaltManedslonn",
  });
  const [info, dataset] = await Promise.all([
    getTableInfo(tableId, lang),
    getTableData(tableId, distributionQuery, lang),
  ]);

  const normalized = normalizeDataset(dataset, {
    tableId,
    title: info.label,
  });

  return buildOccupationSalaryDistribution(normalized, occupationCode);
}

export async function getOccupationMedianSalaryOverview(
  occupationCodes: string[],
  filters: SsbSalaryFilters = OCCUPATION_MONTHLY_SALARY_FILTERS,
  lang: SsbLanguage = "no",
) {
  const uniqueOccupationCodes = Array.from(new Set(occupationCodes)).filter(Boolean);

  if (uniqueOccupationCodes.length === 0) {
    return {
      rows: [],
      periodLabel: undefined,
      measureLabel: "Median avtalt mÃ¥nedslÃ¸nn",
    };
  }

  const tableId = SSB_OCCUPATION_DISTRIBUTION_TABLE_ID;
  const metadata = await getTableMetadata(tableId, lang);
  const distributionQuery = buildLatestQueryFromMetadata(metadata, {
    ...filters,
    MaaleMetode: "01",
    Yrke: uniqueOccupationCodes,
    Sektor: "ALLE",
    Kjonn: ["0", "1", "2"],
    AvtaltVanlig: "0",
    ContentsCode: "AvtaltManedslonn",
  });
  const distributionBody = buildPostBodyFromQueryParams(distributionQuery);
  const [info, dataset] = await Promise.all([
    getTableInfo(tableId, lang),
    postTableData(
      tableId,
      distributionBody,
      {
        outputFormat: "json-stat2",
      },
      lang,
    ),
  ]);

  const normalized = normalizeDataset(dataset, {
    tableId,
    title: info.label,
  });

  return buildOccupationMedianSalaryOverview(normalized, {
    occupationCodes: uniqueOccupationCodes,
  });
}

function buildPostBodyFromQueryParams(query: SsbQueryParams): SsbPostBody {
  const selection = Object.entries(query).flatMap(([key, value]) => {
    const match = key.match(/^valueCodes\[(.+)\]$/);

    if (!match || value === undefined) {
      return [];
    }

    const variableCode = match[1];
    const valueCodes = Array.isArray(value) ? value.map(String) : [String(value)];

    return [
      {
        variableCode,
        valueCodes,
      },
    ];
  });

  return { selection };
}

export async function getOccupationEmploymentLatest(
  occupationCode: string,
  lang: SsbLanguage = "no",
): Promise<OccupationEmploymentLatest | null> {
  const table = getSalaryTableDefinition("occupationEmployment");
  const metadata = await getTableMetadata(table.id, lang);
  const query = buildOccupationEmploymentLatestQuery(metadata, occupationCode);
  const [info, dataset] = await Promise.all([
    getTableInfo(table.id, lang),
    getTableData(table.id, query, lang),
  ]);

  const normalized = normalizeDataset(dataset, {
    tableId: table.id,
    tableKey: table.key,
    title: info.label,
  });

  return buildOccupationEmploymentLatest(normalized, occupationCode, {
    unit: getMetricUnitFromMetadata(metadata) ?? "1 000 personer",
  });
}

const getOccupationLaborMarketStatsCached = unstable_cache(
  async (
    occupationCode: string,
    lang: SsbLanguage = "no",
  ): Promise<OccupationLaborMarketStats | null> => {
    const salaryTable = getSalaryTableDefinition("occupationDetailed");
    const [salaryMetadata, contractMetadata] = await Promise.all([
      getTableMetadata(salaryTable.id, lang),
      getTableMetadata(SSB_OCCUPATION_CONTRACT_TABLE_ID, lang),
    ]);
    const workforceQuery = buildOccupationTimeSeriesQuery(
      salaryMetadata,
      occupationCode,
      {
        ...OCCUPATION_WORKFORCE_FILTERS,
        Kjonn: ["0", "1", "2"],
      },
    );
    const contractQuery = buildOccupationContractTypeQuery(contractMetadata, occupationCode);
    const ageQuery = buildOccupationTimeSeriesQuery(
      salaryMetadata,
      occupationCode,
      OCCUPATION_AVERAGE_AGE_FILTERS,
    );
    const [salaryInfo, contractInfo, workforceDataset, contractDataset, ageDataset] =
      await Promise.all([
        getTableInfo(salaryTable.id, lang),
        getTableInfo(SSB_OCCUPATION_CONTRACT_TABLE_ID, lang),
        getTableData(salaryTable.id, workforceQuery, lang),
        getTableData(SSB_OCCUPATION_CONTRACT_TABLE_ID, contractQuery, lang),
        getTableData(salaryTable.id, ageQuery, lang),
      ]);

    const normalizedWorkforce = normalizeDataset(workforceDataset, {
      tableId: salaryTable.id,
      tableKey: salaryTable.key,
      title: salaryInfo.label,
    });
    const normalizedContract = normalizeDataset(contractDataset, {
      tableId: SSB_OCCUPATION_CONTRACT_TABLE_ID,
      title: contractInfo.label,
    });
    const normalizedAge = normalizeDataset(ageDataset, {
      tableId: salaryTable.id,
      tableKey: salaryTable.key,
      title: salaryInfo.label,
    });

    return buildOccupationLaborMarketStats(
      normalizedWorkforce,
      normalizedContract,
      normalizedAge,
      occupationCode,
      {
        employeeUnit: "personer",
        jobUnit: "arbeidsforhold",
      },
    );
  },
  ["ssb-occupation-labor-market-stats"],
  { revalidate: 300 },
);

export async function getOccupationLaborMarketStats(
  occupationCode: string,
  lang: SsbLanguage = "no",
): Promise<OccupationLaborMarketStats | null> {
  return getOccupationLaborMarketStatsCached(occupationCode, lang);
}

export async function getOccupationPurchasingPowerOverview(
  lang: SsbLanguage = "no",
): Promise<OccupationPurchasingPowerOverview> {
  const salaryTable = getSalaryTableDefinition("occupationDetailed");
  const [salaryMetadata, inflationMetadata] = await Promise.all([
    getTableMetadata(salaryTable.id, lang),
    getTableMetadata(SSB_INFLATION_TABLE_ID, lang),
  ]);

  const salaryQuery = buildOccupationTimeSeriesQuery(
    salaryMetadata,
    "*",
    OCCUPATION_MONTHLY_SALARY_FILTERS,
  );
  const inflationQuery = buildInflationQuarterQuery(inflationMetadata);

  const [salaryInfo, inflationInfo, salaryDataset, inflationDataset] = await Promise.all([
    getTableInfo(salaryTable.id, lang),
    getTableInfo(SSB_INFLATION_TABLE_ID, lang),
    getTableData(salaryTable.id, salaryQuery, lang),
    getTableData(SSB_INFLATION_TABLE_ID, inflationQuery, lang),
  ]);

  const normalizedSalaryDataset = normalizeDataset(salaryDataset, {
    tableId: salaryTable.id,
    tableKey: salaryTable.key,
    title: salaryInfo.label,
  });
  const normalizedInflationDataset = normalizeDataset(inflationDataset, {
    tableId: SSB_INFLATION_TABLE_ID,
    title: inflationInfo.label,
  });

  const inflationQuarterSeries = buildInflationQuarterSeries(normalizedInflationDataset);
  const inflationByPeriod = new Map(
    inflationQuarterSeries
      .filter((point) => point.yearOverYearChange !== undefined)
      .map((point) => [point.periodCode, point]),
  );

  const salaryComparison = buildOccupationPurchasingPowerRows(normalizedSalaryDataset, inflationByPeriod);

  return {
    latestPeriodCode: salaryComparison.latestPeriodCode,
    latestPeriodLabel: salaryComparison.latestPeriodLabel,
    previousPeriodCode: salaryComparison.previousPeriodCode,
    previousPeriodLabel: salaryComparison.previousPeriodLabel,
    inflationTableId: SSB_INFLATION_TABLE_ID,
    salaryTableId: salaryTable.id,
    inflationUpdated: normalizedInflationDataset.updated,
    salaryUpdated: normalizedSalaryDataset.updated,
    inflationGrowth: salaryComparison.inflationGrowth,
    rows: salaryComparison.rows,
  };
}

export async function getOccupationPurchasingPowerDetail(
  occupationCode: string,
  filters: SsbSalaryFilters = OCCUPATION_MONTHLY_SALARY_FILTERS,
  lang: SsbLanguage = "no",
): Promise<OccupationPurchasingPowerDetail | null> {
  const detailData = await getOccupationDetailTrendData(occupationCode, filters, lang);
  return detailData.purchasingPower;
}

export async function getOccupationPurchasingPowerTimeSeries(
  occupationCode: string,
  filters: SsbSalaryFilters = OCCUPATION_MONTHLY_SALARY_FILTERS,
  lang: SsbLanguage = "no",
): Promise<OccupationPurchasingPowerTimeSeries> {
  const detailData = await getOccupationDetailTrendData(occupationCode, filters, lang);
  return detailData.purchasingPowerSeries;
}

const getOccupationDetailTrendDataCached = unstable_cache(
  async (
    occupationCode: string,
    filters: SsbSalaryFilters = OCCUPATION_MONTHLY_SALARY_FILTERS,
    lang: SsbLanguage = "no",
  ): Promise<OccupationDetailTrendData> => {
    const salaryTable = getSalaryTableDefinition("occupationDetailed");
    const [salaryMetadata, inflationMetadata] = await Promise.all([
      getTableMetadata(salaryTable.id, lang),
      getTableMetadata(SSB_INFLATION_TABLE_ID, lang),
    ]);

    const salaryQuery = buildOccupationTimeSeriesQuery(salaryMetadata, occupationCode, filters);
    const inflationQuery = buildInflationQuarterQuery(inflationMetadata);

    const [salaryInfo, inflationInfo, salaryDataset, inflationDataset] = await Promise.all([
      getTableInfo(salaryTable.id, lang),
      getTableInfo(SSB_INFLATION_TABLE_ID, lang),
      getTableData(salaryTable.id, salaryQuery, lang),
      getTableData(SSB_INFLATION_TABLE_ID, inflationQuery, lang),
    ]);

    const normalizedSalaryDataset = normalizeDataset(salaryDataset, {
      tableId: salaryTable.id,
      tableKey: salaryTable.key,
      title: salaryInfo.label,
    });
    const normalizedInflationDataset = normalizeDataset(inflationDataset, {
      tableId: SSB_INFLATION_TABLE_ID,
      title: inflationInfo.label,
    });

    const series = buildOccupationSalaryTimeSeries(normalizedSalaryDataset, occupationCode);
    const inflationQuarterSeries = buildInflationQuarterSeries(normalizedInflationDataset);
    const purchasingPower =
      buildOccupationPurchasingPowerDetailFromSeries(
        series,
        inflationQuarterSeries,
        {
          occupationCode,
          salaryTableId: salaryTable.id,
          inflationTableId: SSB_INFLATION_TABLE_ID,
          salaryUpdated: normalizedSalaryDataset.updated,
          inflationUpdated: normalizedInflationDataset.updated,
        },
      ) ?? null;
    const points = buildOccupationPurchasingPowerTimeSeriesPoints(series, inflationQuarterSeries);

    return {
      series,
      purchasingPower,
      purchasingPowerSeries: {
        occupationCode,
        occupationLabel: series.occupationLabel,
        salaryTableId: salaryTable.id,
        inflationTableId: SSB_INFLATION_TABLE_ID,
        salaryUpdated: normalizedSalaryDataset.updated,
        inflationUpdated: normalizedInflationDataset.updated,
        points,
      },
    };
  },
  ["ssb-occupation-detail-trend-data"],
  { revalidate: 300 },
);

export async function getOccupationDetailTrendData(
  occupationCode: string,
  filters: SsbSalaryFilters = OCCUPATION_MONTHLY_SALARY_FILTERS,
  lang: SsbLanguage = "no",
): Promise<OccupationDetailTrendData> {
  return getOccupationDetailTrendDataCached(occupationCode, filters, lang);
}

export async function getOccupationSalaryTimeSeries(
  occupationCode: string,
  filters: SsbSalaryFilters = OCCUPATION_MONTHLY_SALARY_FILTERS,
  lang: SsbLanguage = "no",
): Promise<OccupationSalaryTimeSeries> {
  const detailData = await getOccupationDetailTrendData(occupationCode, filters, lang);
  return detailData.series;
}

export async function getOccupationSupplementTimeSeries(
  occupationCode: string,
  filters: SsbSalaryFilters = OCCUPATION_SUPPLEMENT_FILTERS,
  lang: SsbLanguage = "no",
): Promise<OccupationSupplementTimeSeries> {
  const tableId = SSB_OCCUPATION_DISTRIBUTION_TABLE_ID;
  const metadata = await getTableMetadata(tableId, lang);
  const supplementQuery = buildOccupationTimeSeriesQuery(metadata, occupationCode, filters);
  const [info, dataset] = await Promise.all([
    getTableInfo(tableId, lang),
    getTableData(tableId, supplementQuery, lang),
  ]);

  const normalized = normalizeDataset(dataset, {
    tableId,
    title: info.label,
  });

  return buildOccupationSupplementTimeSeries(normalized, occupationCode);
}

async function getOccupationPurchasingPowerTimeSeriesOldRemoved(
  occupationCode: string,
  filters: SsbSalaryFilters = OCCUPATION_MONTHLY_SALARY_FILTERS,
  lang: SsbLanguage = "no",
): Promise<OccupationPurchasingPowerTimeSeries> {
  void occupationCode;
  void filters;
  void lang;
  throw new Error("Ubrukt hjelpefunksjon.");
  /* const salaryTable = getSalaryTableDefinition("occupationDetailed");
  const [salaryMetadata, inflationMetadata] = await Promise.all([
    getTableMetadata(salaryTable.id, lang),
    getTableMetadata(SSB_INFLATION_TABLE_ID, lang),
  ]);

  const salaryQuery = buildOccupationTimeSeriesQuery(salaryMetadata, occupationCode, filters);
  const inflationQuery = buildInflationQuarterQuery(inflationMetadata);

  const [salaryInfo, inflationInfo, salaryDataset, inflationDataset] = await Promise.all([
    getTableInfo(salaryTable.id, lang),
    getTableInfo(SSB_INFLATION_TABLE_ID, lang),
    getTableData(salaryTable.id, salaryQuery, lang),
    getTableData(SSB_INFLATION_TABLE_ID, inflationQuery, lang),
  ]);

  const normalizedSalaryDataset = normalizeDataset(salaryDataset, {
    tableId: salaryTable.id,
    tableKey: salaryTable.key,
    title: salaryInfo.label,
  });
  const normalizedInflationDataset = normalizeDataset(inflationDataset, {
    tableId: SSB_INFLATION_TABLE_ID,
    title: inflationInfo.label,
  });

  const salarySeries = buildOccupationSalaryTimeSeries(normalizedSalaryDataset, occupationCode);
  const inflationQuarterSeries = buildInflationQuarterSeries(normalizedInflationDataset);
  const inflationByPeriod = new Map(
    inflationQuarterSeries
      .filter((point) => point.yearOverYearChange !== undefined)
      .map((point) => [point.periodCode, point]),
  );
  const comparablePeriods = series.points
    .map((point) => normalizeQuarterPeriodCode(point.periodCode, point.periodLabel))
    .filter((periodCode): periodCode is string => Boolean(periodCode))
    .filter((periodCode) => inflationByPeriod.has(periodCode))
    .sort((left, right) => right.localeCompare(left, "nb-NO"));

  const latestPeriodCode = comparablePeriods[0];

  if (!latestPeriodCode) {
    throw new Error(`Fant ingen sammenlignbar KPI-periode for yrkeskode ${occupationCode}.`);
  }

  const previousPeriodCode = getPreviousYearQuarterCode(latestPeriodCode);

  if (!previousPeriodCode) {
    throw new Error(`Fant ikke forrige Ã¥rs periode for ${latestPeriodCode}.`);
  }

  const latestSalaryPoint = series.points.find(
    (point) => normalizeQuarterPeriodCode(point.periodCode, point.periodLabel) === latestPeriodCode,
  );
  const previousSalaryPoint = series.points.find(
    (point) => normalizeQuarterPeriodCode(point.periodCode, point.periodLabel) === previousPeriodCode,
  );
  const inflationPoint = inflationByPeriod.get(latestPeriodCode);

  if (
    latestSalaryPoint?.valueAll === undefined ||
    previousSalaryPoint?.valueAll === undefined ||
    inflationPoint?.yearOverYearChange === undefined
  ) {
    throw new Error(`Fant ikke nok sammenligningsdata for yrkeskode ${occupationCode}.`);
  }

  const salaryGrowth =
    ((latestSalaryPoint.valueAll - previousSalaryPoint.valueAll) / previousSalaryPoint.valueAll) * 100;
  const inflationGrowth = inflationPoint.yearOverYearChange;
  const realGrowth = (((1 + salaryGrowth / 100) / (1 + inflationGrowth / 100)) - 1) * 100;

  return {
    occupationCode,
    occupationLabel: salarySeries.occupationLabel,
    salaryTableId: salaryTable.id,
    inflationTableId: SSB_INFLATION_TABLE_ID,
    salaryUpdated: normalizedSalaryDataset.updated,
    inflationUpdated: normalizedInflationDataset.updated,
    points,
  }; */
}

export async function getSalaryTableSnapshot(
  tableId: string = DEFAULT_SALARY_TABLE_ID,
): Promise<SalaryTableSnapshot> {
  const [info, metadata, dataset] = await Promise.all([
    getTableInfo(tableId, "no"),
    getTableMetadata(tableId, "no"),
    getLatestTableData(
      tableId,
      {
        "valueCodes[ContentsCode]": "*",
      },
      "no",
    ),
  ]);

  return {
    tableId,
    title: info.label,
    firstPeriod: info.firstPeriod,
    lastPeriod: info.lastPeriod,
    variableNames: info.variableNames ?? [],
    dimensions: metadata.id ?? Object.keys(metadata.dimension),
    valueCount: dataset.value.length,
    sampleValues: dataset.value.slice(0, 6),
    source: "ssb",
  };
}

function normalizeDataset(
  dataset: Awaited<ReturnType<typeof getTableData>>,
  options: {
    tableId: string;
    title: string;
    tableKey?: SsbSalaryTableKey;
  },
): SsbNormalizedDataset {
  const dimensions = dataset.id ?? Object.keys(dataset.dimension);
  const sizes = dataset.size ?? dimensions.map((dimension) => {
    return Object.keys(dataset.dimension[dimension]?.category.index ?? {}).length;
  });

  const categoriesByDimension = Object.fromEntries(
    dimensions.map((dimension) => {
      const entries = Object.entries(dataset.dimension[dimension].category.index).sort(
        (left, right) => left[1] - right[1],
      );

      return [dimension, entries.map(([code]) => code)];
    }),
  ) as Record<string, string[]>;

  const rows = dataset.value.map((value, index) => {
    const coordinates = decodeCoordinates(index, sizes);
    const dimensionsMap = Object.fromEntries(
      dimensions.map((dimension, dimensionIndex) => {
        const code = categoriesByDimension[dimension][coordinates[dimensionIndex]];
        const label = dataset.dimension[dimension].category.label?.[code] ?? code;

        return [dimension, { code, label }];
      }),
    );

    return {
      value,
      status: readStatus(dataset.status, index),
      dimensions: dimensionsMap,
    };
  });

  return {
    tableId: options.tableId,
    tableKey: options.tableKey,
    title: options.title,
    updated: dataset.updated,
    source: dataset.source,
    dimensions,
    rows,
  };
}

function buildOccupationTimeSeriesQuery(
  metadata: SsbTableMetadata,
  occupationCode: string,
  filters: SsbSalaryFilters,
): SsbQueryParams {
  const dimensions = metadata.id ?? Object.keys(metadata.dimension);
  const timeDimensions = new Set(metadata.role?.time ?? []);
  const occupationDimensionCode = findDimensionCode(
    dimensions,
    metadata.dimension,
    ["yrke", "occupation"],
  );

  if (!occupationDimensionCode) {
    throw new Error("Fant ikke yrkesdimensjon i metadata for tabell 11658.");
  }

  const query: SsbQueryParams = {};

  for (const dimension of dimensions) {
    const filterValue = filters[dimension];

    if (filterValue !== undefined) {
      query[`valueCodes[${dimension}]`] = filterValue;
      continue;
    }

    if (dimension === occupationDimensionCode) {
      query[`valueCodes[${dimension}]`] = occupationCode;
      continue;
    }

    query[`valueCodes[${dimension}]`] = timeDimensions.has(dimension) ? "*" : "*";
  }

  return query;
}

function buildInflationQuarterQuery(metadata: SsbTableMetadata): SsbQueryParams {
  const dimensions = metadata.id ?? Object.keys(metadata.dimension);
  const timeDimensions = new Set(metadata.role?.time ?? []);
  const metricDimensions = new Set(metadata.role?.metric ?? []);
  const query: SsbQueryParams = {};

  for (const dimension of dimensions) {
    const metadataDimension = metadata.dimension[dimension];

    if (timeDimensions.has(dimension)) {
      query[`valueCodes[${dimension}]`] = "*";
      continue;
    }

    if (metricDimensions.has(dimension)) {
      const indexCode = findCategoryCodeByLabel(
        metadataDimension.category.label,
        ["konsumprisindeks", "index"],
        ["manedsendring", "12manedersendring", "vekter", "weights"],
      );

      if (!indexCode) {
        throw new Error(`Fant ikke KPI-indeksvariabel i tabell ${SSB_INFLATION_TABLE_ID}.`);
      }

      query[`valueCodes[${dimension}]`] = indexCode;
      continue;
    }

    const totalIndexCode = findCategoryCodeByLabel(
      metadataDimension.category.label,
      ["totalindeks", "totalindex", "ialt"],
      [],
    );

    if (totalIndexCode) {
      query[`valueCodes[${dimension}]`] = totalIndexCode;
      continue;
    }

    query[`valueCodes[${dimension}]`] = "*";
  }

  return query;
}

function buildOccupationEmploymentLatestQuery(
  metadata: SsbTableMetadata,
  occupationCode: string,
): SsbQueryParams {
  const dimensions = metadata.id ?? Object.keys(metadata.dimension);
  const timeDimensions = new Set(metadata.role?.time ?? []);
  const metricDimensions = new Set(metadata.role?.metric ?? []);
  const occupationDimensionCode = findDimensionCode(
    dimensions,
    metadata.dimension,
    ["yrke", "occupation"],
  );
  const genderDimensionCode = findDimensionCode(
    dimensions,
    metadata.dimension,
    ["kjonn", "kjÃ¸nn", "sex"],
  );

  if (!occupationDimensionCode) {
    throw new Error(`Fant ikke yrkesdimensjon i metadata for tabell ${SSB_OCCUPATION_EMPLOYMENT_TABLE_ID}.`);
  }

  const query: SsbQueryParams = {};

  for (const dimension of dimensions) {
    const metadataDimension = metadata.dimension[dimension];

    if (dimension === occupationDimensionCode) {
      query[`valueCodes[${dimension}]`] = occupationCode;
      continue;
    }

    if (timeDimensions.has(dimension)) {
      query[`valueCodes[${dimension}]`] = "top(1)";
      continue;
    }

    if (genderDimensionCode && dimension === genderDimensionCode) {
      query[`valueCodes[${dimension}]`] =
        findCategoryCodeByLabel(
          metadataDimension.category.label,
          ["begge kjonn", "begge kjÃ¸nn", "begge", "both sexes"],
          [],
        ) ?? "0";
      continue;
    }

    if (metricDimensions.has(dimension)) {
      query[`valueCodes[${dimension}]`] =
        findCategoryCodeByLabel(
          metadataDimension.category.label,
          ["sysselsatte", "employed persons"],
          [],
        ) ?? Object.keys(metadataDimension.category.index)[0];
      continue;
    }

    query[`valueCodes[${dimension}]`] =
      findCategoryCodeByLabel(
        metadataDimension.category.label,
        ["ialt", "i alt", "alle", "all", "total"],
        [],
      ) ?? "*";
  }

  return query;
}

function buildOccupationEmploymentTimeSeriesQuery(
  metadata: SsbTableMetadata,
  occupationCode: string,
): SsbQueryParams {
  const dimensions = metadata.id ?? Object.keys(metadata.dimension);
  const timeDimensions = new Set(metadata.role?.time ?? []);
  const metricDimensions = new Set(metadata.role?.metric ?? []);
  const occupationDimensionCode = findDimensionCode(
    dimensions,
    metadata.dimension,
    ["yrke", "occupation"],
  );
  const genderDimensionCode = findDimensionCode(
    dimensions,
    metadata.dimension,
    ["kjonn", "kjÃ¸nn", "sex"],
  );

  if (!occupationDimensionCode) {
    throw new Error(`Fant ikke yrkesdimensjon i metadata for tabell ${SSB_OCCUPATION_EMPLOYMENT_TABLE_ID}.`);
  }

  const query: SsbQueryParams = {};

  for (const dimension of dimensions) {
    const metadataDimension = metadata.dimension[dimension];

    if (dimension === occupationDimensionCode) {
      query[`valueCodes[${dimension}]`] = occupationCode;
      continue;
    }

    if (timeDimensions.has(dimension)) {
      query[`valueCodes[${dimension}]`] = "*";
      continue;
    }

    if (genderDimensionCode && dimension === genderDimensionCode) {
      query[`valueCodes[${dimension}]`] = ["0", "1", "2"];
      continue;
    }

    if (metricDimensions.has(dimension)) {
      query[`valueCodes[${dimension}]`] =
        findCategoryCodeByLabel(
          metadataDimension.category.label,
          ["sysselsatte", "employed persons"],
          [],
        ) ?? Object.keys(metadataDimension.category.index)[0];
      continue;
    }

    query[`valueCodes[${dimension}]`] = "*";
  }

  return query;
}

function buildOccupationContractTypeQuery(
  metadata: SsbTableMetadata,
  occupationCode: string,
): SsbQueryParams {
  const dimensions = metadata.id ?? Object.keys(metadata.dimension);
  const timeDimensions = new Set(metadata.role?.time ?? []);
  const metricDimensions = new Set(metadata.role?.metric ?? []);
  const geoDimensions = new Set(metadata.role?.geo ?? []);
  const occupationDimensionCode = findDimensionCode(
    dimensions,
    metadata.dimension,
    ["yrke", "occupation"],
  );
  const ageDimensionCode = findDimensionCode(
    dimensions,
    metadata.dimension,
    ["alder", "age"],
  );
  const contractDimensionCode = findDimensionCode(
    dimensions,
    metadata.dimension,
    ["ansettelsesform", "ansettelsesforhold", "employment"],
  );
  const query: SsbQueryParams = {};

  if (!occupationDimensionCode) {
    throw new Error(`Fant ikke yrkesdimensjon i metadata for tabell ${SSB_OCCUPATION_CONTRACT_TABLE_ID}.`);
  }

  for (const dimension of dimensions) {
    const metadataDimension = metadata.dimension[dimension];

    if (dimension === occupationDimensionCode) {
      query[`valueCodes[${dimension}]`] = occupationCode;
      continue;
    }

    if (timeDimensions.has(dimension)) {
      query[`valueCodes[${dimension}]`] = "top(1)";
      continue;
    }

    if (geoDimensions.has(dimension)) {
      query[`valueCodes[${dimension}]`] =
        findCategoryCodeByLabel(
          metadataDimension.category.label,
          ["hele landet"],
          [],
        ) ?? "0";
      continue;
    }

    if (ageDimensionCode && dimension === ageDimensionCode) {
      query[`valueCodes[${dimension}]`] =
        findCategoryCodeByLabel(
          metadataDimension.category.label,
          ["15-74"],
          [],
        ) ?? Object.keys(metadataDimension.category.index)[0];
      continue;
    }

    if (contractDimensionCode && dimension === contractDimensionCode) {
      query[`valueCodes[${dimension}]`] = ["0", "F", "M", "09"];
      continue;
    }

    if (metricDimensions.has(dimension)) {
      query[`valueCodes[${dimension}]`] =
        findCategoryCodeByLabel(
          metadataDimension.category.label,
          ["sysselsatte"],
          [],
        ) ?? Object.keys(metadataDimension.category.index)[0];
      continue;
    }

    query[`valueCodes[${dimension}]`] = "*";
  }

  return query;
}

function buildOccupationSalaryTimeSeries(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
): OccupationSalaryTimeSeries {
  const occupationDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "yrke",
    "occupation",
  ]);
  const genderDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "kjonn",
    "sex",
  ]);
  const measureDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "contentscode",
    "contents",
  ]);
  const periodDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, ["tid", "quarter"]);

  if (!occupationDimensionCode || !genderDimensionCode || !periodDimensionCode) {
    throw new Error("Fant ikke forventede dimensjoner for tidsserie i tabell 11658.");
  }

  const relevantRows = dataset.rows.filter((row) => {
    return row.dimensions[occupationDimensionCode]?.code === occupationCode;
  });

  if (relevantRows.length === 0) {
    throw new Error(`Fant ingen lÃ¸nnsdata for yrkeskode ${occupationCode}.`);
  }

  const pointsByPeriod = relevantRows.reduce((map, row) => {
    const period = row.dimensions[periodDimensionCode];
    const gender = row.dimensions[genderDimensionCode];

    if (!period || !gender) {
      return map;
    }

    const existing = map.get(period.code) ?? {
      periodCode: period.code,
      periodLabel: period.label,
    };

    if (row.value !== null) {
      if (gender.code === "0") {
        existing.valueAll = row.value;
      }

      if (gender.code === "2") {
        existing.valueWomen = row.value;
      }

      if (gender.code === "1") {
        existing.valueMen = row.value;
      }
    }

    map.set(period.code, existing);
    return map;
  }, new Map<string, OccupationSalaryTimeSeriesPoint>());

  const occupationLabel =
    relevantRows[0]?.dimensions[occupationDimensionCode]?.label ?? occupationCode;
  const measureLabel = formatMeasureLabel(
    measureDimensionCode ? relevantRows[0]?.dimensions[measureDimensionCode]?.label : undefined,
  );

  return {
    occupationCode,
    occupationLabel,
    measureLabel,
    updated: dataset.updated,
    points: Array.from(pointsByPeriod.values()).sort((left, right) =>
      left.periodCode.localeCompare(right.periodCode, "nb-NO"),
    ),
  };
}

function buildOccupationSupplementTimeSeries(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
): OccupationSupplementTimeSeries {
  const occupationDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "yrke",
    "occupation",
  ]);
  const genderDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "kjonn",
    "sex",
  ]);
  const measureDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "contentscode",
    "contents",
  ]);
  const periodDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "tid",
    "year",
    "time",
  ]);

  if (!occupationDimensionCode || !genderDimensionCode || !measureDimensionCode || !periodDimensionCode) {
    throw new Error(`Fant ikke forventede dimensjoner for tilleggsserie i tabell ${dataset.tableId}.`);
  }

  const relevantRows = dataset.rows.filter((row) => {
    return row.dimensions[occupationDimensionCode]?.code === occupationCode;
  });

  if (relevantRows.length === 0) {
    return {
      occupationCode,
      occupationLabel: occupationCode,
      updated: dataset.updated,
      points: [],
    };
  }

  const pointsByPeriod = relevantRows.reduce((map, row) => {
    const period = row.dimensions[periodDimensionCode];
    const gender = row.dimensions[genderDimensionCode];
    const measure = row.dimensions[measureDimensionCode];

    if (!period || !gender || !measure) {
      return map;
    }

    const existing = map.get(period.code) ?? {
      periodCode: period.code,
      periodLabel: period.label,
    };

    if (row.value !== null) {
      assignSupplementMetricValue(existing, measure.code, gender.code, row.value);
    }

    map.set(period.code, existing);
    return map;
  }, new Map<string, OccupationSupplementTimeSeriesPoint>());

  return {
    occupationCode,
    occupationLabel: relevantRows[0]?.dimensions[occupationDimensionCode]?.label ?? occupationCode,
    updated: dataset.updated,
    points: Array.from(pointsByPeriod.values()).sort((left, right) =>
      left.periodCode.localeCompare(right.periodCode, "nb-NO"),
    ),
  };
}

function assignSupplementMetricValue(
  point: OccupationSupplementTimeSeriesPoint,
  measureCode: string,
  genderCode: string,
  value: number,
) {
  if (measureCode === "Bonus") {
    if (genderCode === "0") {
      point.bonusAll = value;
    }

    if (genderCode === "2") {
      point.bonusWomen = value;
    }

    if (genderCode === "1") {
      point.bonusMen = value;
    }
  }

  if (measureCode === "Overtid") {
    if (genderCode === "0") {
      point.overtimeAll = value;
    }

    if (genderCode === "2") {
      point.overtimeWomen = value;
    }

    if (genderCode === "1") {
      point.overtimeMen = value;
    }
  }

  if (measureCode === "Uregtil") {
    if (genderCode === "0") {
      point.irregularAdditionsAll = value;
    }

    if (genderCode === "2") {
      point.irregularAdditionsWomen = value;
    }

    if (genderCode === "1") {
      point.irregularAdditionsMen = value;
    }
  }
}

function buildOccupationEmploymentLatest(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
  options: { unit: string },
): OccupationEmploymentLatest | null {
  const occupationDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "yrke",
    "occupation",
  ]);
  const periodDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "tid",
    "year",
    "time",
  ]);

  if (!occupationDimensionCode || !periodDimensionCode) {
    throw new Error(`Fant ikke forventede dimensjoner for sysselsetting i tabell ${dataset.tableId}.`);
  }

  const relevantRows = dataset.rows.filter(
    (row) =>
      row.dimensions[occupationDimensionCode]?.code === occupationCode &&
      row.value !== null,
  );

  if (relevantRows.length === 0) {
    return null;
  }

  const latestRow = relevantRows
    .slice()
    .sort((left, right) =>
      right.dimensions[periodDimensionCode].code.localeCompare(
        left.dimensions[periodDimensionCode].code,
        "nb-NO",
      ),
    )[0];
  const period = latestRow.dimensions[periodDimensionCode];
  const occupation = latestRow.dimensions[occupationDimensionCode];

  return {
    occupationCode,
    occupationLabel: occupation?.label ?? occupationCode,
    periodCode: period.code,
    periodLabel: period.label,
    value: latestRow.value ?? 0,
    unit: options.unit,
    updated: dataset.updated,
  };
}

function buildOccupationLaborMarketStats(
  workforceDataset: SsbNormalizedDataset,
  contractDataset: SsbNormalizedDataset,
  ageDataset: SsbNormalizedDataset,
  occupationCode: string,
  options: { employeeUnit: string; jobUnit: string },
): OccupationLaborMarketStats | null {
  const workforcePoints = buildOccupationWorkforceTimeSeries(workforceDataset, occupationCode);
  const ageSeries = buildOccupationAgeTimeSeries(ageDataset, occupationCode);

  if (workforcePoints.length === 0) {
    return null;
  }

  const latestPoint = workforcePoints.at(-1);
  const occupationLabel = findOccupationLabelFromDataset(workforceDataset, occupationCode) ?? occupationCode;
  const latest =
    latestPoint && (latestPoint.employeesAll !== undefined || latestPoint.jobsAll !== undefined)
      ? {
          occupationCode,
          occupationLabel,
          periodCode: latestPoint.periodCode,
          periodLabel: latestPoint.periodLabel,
          employees: latestPoint.employeesAll,
          jobs: latestPoint.jobsAll,
          employeeUnit: options.employeeUnit,
          jobUnit: options.jobUnit,
          updated: workforceDataset.updated,
        }
      : null;

  return {
    occupationCode,
    occupationLabel,
    updated: workforceDataset.updated,
    employeeUnit: options.employeeUnit,
    jobUnit: options.jobUnit,
    workforcePoints,
    latest,
    genderBreakdown: buildOccupationEmployeeGenderBreakdown(workforcePoints),
    growth: buildOccupationEmployeeGrowth(workforcePoints),
    contractType: buildOccupationEmploymentContractType(contractDataset, occupationCode),
    age: buildOccupationAgeLatest(ageSeries, occupationCode, occupationLabel, ageDataset.updated),
    ageSeries,
  };
}

function buildOccupationWorkforceTimeSeries(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
): OccupationWorkforceTimeSeriesPoint[] {
  const occupationDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "yrke",
    "occupation",
  ]);
  const genderDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "kjonn",
    "kjÃƒÂ¸nn",
    "sex",
  ]);
  const measureDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "contentscode",
    "contents",
  ]);
  const periodDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "tid",
    "quarter",
    "time",
  ]);

  if (!occupationDimensionCode || !genderDimensionCode || !measureDimensionCode || !periodDimensionCode) {
    return [];
  }

  const relevantRows = dataset.rows.filter(
    (row) =>
      row.dimensions[occupationDimensionCode]?.code === occupationCode &&
      row.value !== null,
  );

  const pointsByPeriod = relevantRows.reduce((map, row) => {
    const period = row.dimensions[periodDimensionCode];
    const gender = row.dimensions[genderDimensionCode];
    const measure = row.dimensions[measureDimensionCode];

    if (!period || !gender || !measure) {
      return map;
    }

    const point = map.get(period.code) ?? {
      periodCode: period.code,
      periodLabel: period.label,
    };

    if (measure.code === "Lonsstakere") {
      if (gender.code === "0") {
        point.employeesAll = row.value ?? undefined;
      }

      if (gender.code === "2") {
        point.employeesWomen = row.value ?? undefined;
      }

      if (gender.code === "1") {
        point.employeesMen = row.value ?? undefined;
      }
    }

    if (measure.code === "AntArbForhold") {
      if (gender.code === "0") {
        point.jobsAll = row.value ?? undefined;
      }

      if (gender.code === "2") {
        point.jobsWomen = row.value ?? undefined;
      }

      if (gender.code === "1") {
        point.jobsMen = row.value ?? undefined;
      }
    }

    map.set(period.code, point);
    return map;
  }, new Map<string, OccupationWorkforceTimeSeriesPoint>());

  return Array.from(pointsByPeriod.values()).sort((left, right) =>
    left.periodCode.localeCompare(right.periodCode, "nb-NO"),
  );
}

function buildOccupationAgeTimeSeries(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
): OccupationAgeTimeSeriesPoint[] {
  const occupationDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "yrke",
    "occupation",
  ]);
  const genderDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "kjonn",
    "kjÃƒÂ¸nn",
    "sex",
  ]);
  const periodDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "tid",
    "quarter",
    "time",
  ]);

  if (!occupationDimensionCode || !genderDimensionCode || !periodDimensionCode) {
    return [];
  }

  const relevantRows = dataset.rows.filter(
    (row) =>
      row.dimensions[occupationDimensionCode]?.code === occupationCode &&
      row.value !== null,
  );

  const pointsByPeriod = relevantRows.reduce((map, row) => {
    const period = row.dimensions[periodDimensionCode];
    const gender = row.dimensions[genderDimensionCode];

    if (!period || !gender) {
      return map;
    }

    const point = map.get(period.code) ?? {
      periodCode: period.code,
      periodLabel: period.label,
    };

    if (gender.code === "0") {
      point.averageAll = row.value ?? undefined;
    }

    if (gender.code === "2") {
      point.averageWomen = row.value ?? undefined;
    }

    if (gender.code === "1") {
      point.averageMen = row.value ?? undefined;
    }

    map.set(period.code, point);
    return map;
  }, new Map<string, OccupationAgeTimeSeriesPoint>());

  return Array.from(pointsByPeriod.values()).sort((left, right) =>
    left.periodCode.localeCompare(right.periodCode, "nb-NO"),
  );
}

function buildOccupationAgeLatest(
  points: OccupationAgeTimeSeriesPoint[],
  occupationCode: string,
  occupationLabel: string,
  updated?: string,
): OccupationAgeLatest | null {
  const latestPoint = points
    .filter(
      (point) =>
        point.averageAll !== undefined ||
        point.averageWomen !== undefined ||
        point.averageMen !== undefined,
    )
    .at(-1);

  if (!latestPoint) {
    return null;
  }

  return {
    occupationCode,
    occupationLabel,
    periodCode: latestPoint.periodCode,
    periodLabel: latestPoint.periodLabel,
    averageAll: latestPoint.averageAll,
    averageWomen: latestPoint.averageWomen,
    averageMen: latestPoint.averageMen,
    updated,
  };
}

function buildOccupationEmploymentTimeSeries(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
): OccupationEmploymentTimeSeriesPoint[] {
  const occupationDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "yrke",
    "occupation",
  ]);
  const genderDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "kjonn",
    "kjÃ¸nn",
    "sex",
  ]);
  const periodDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "tid",
    "year",
    "time",
  ]);

  if (!occupationDimensionCode || !genderDimensionCode || !periodDimensionCode) {
    throw new Error(`Fant ikke forventede dimensjoner for sysselsetting i tabell ${dataset.tableId}.`);
  }

  const relevantRows = dataset.rows.filter(
    (row) =>
      row.dimensions[occupationDimensionCode]?.code === occupationCode &&
      row.value !== null,
  );

  const pointsByPeriod = relevantRows.reduce((map, row) => {
    const period = row.dimensions[periodDimensionCode];
    const gender = row.dimensions[genderDimensionCode];

    if (!period || !gender) {
      return map;
    }

    const point = map.get(period.code) ?? {
      periodCode: period.code,
      periodLabel: period.label,
    };

    if (gender.code === "0") {
      point.total = row.value ?? undefined;
    }

    if (gender.code === "2") {
      point.women = row.value ?? undefined;
    }

    if (gender.code === "1") {
      point.men = row.value ?? undefined;
    }

    map.set(period.code, point);
    return map;
  }, new Map<string, OccupationEmploymentTimeSeriesPoint>());

  return Array.from(pointsByPeriod.values()).sort((left, right) =>
    left.periodCode.localeCompare(right.periodCode, "nb-NO"),
  );
}

function buildOccupationEmployeeGenderBreakdown(
  points: OccupationWorkforceTimeSeriesPoint[],
): OccupationEmploymentGenderBreakdown | null {
  const latestPoint = points.at(-1);

  if (
    !latestPoint ||
    latestPoint.employeesAll === undefined ||
    latestPoint.employeesAll === 0 ||
    latestPoint.employeesWomen === undefined ||
    latestPoint.employeesMen === undefined
  ) {
    return null;
  }

  return {
    periodCode: latestPoint.periodCode,
    periodLabel: latestPoint.periodLabel,
    total: latestPoint.employeesAll,
    women: latestPoint.employeesWomen,
    men: latestPoint.employeesMen,
    womenShare: (latestPoint.employeesWomen / latestPoint.employeesAll) * 100,
    menShare: (latestPoint.employeesMen / latestPoint.employeesAll) * 100,
  };
}

function buildOccupationEmployeeGrowth(
  points: OccupationWorkforceTimeSeriesPoint[],
): OccupationEmploymentGrowth | null {
  const totalPoints = points
    .filter((point) => point.employeesAll !== undefined)
    .map((point) => ({
      periodCode: point.periodCode,
      periodLabel: point.periodLabel,
      total: point.employeesAll as number,
    }));
  const latestPoint = totalPoints.at(-1);

  if (!latestPoint || latestPoint.total === undefined) {
    return null;
  }

  const previousYearQuarterCode = getPreviousYearQuarterCode(latestPoint.periodCode);
  const previousPoint =
    totalPoints.find((point) => point.periodCode === previousYearQuarterCode) ?? totalPoints.at(-2);
  const baselinePoint =
    totalPoints.find((point) => point.periodCode.startsWith("2021")) ?? totalPoints[0];

  return {
    latestPeriodCode: latestPoint.periodCode,
    latestPeriodLabel: latestPoint.periodLabel,
    latestValue: latestPoint.total,
    previousPeriodCode: previousPoint?.periodCode,
    previousPeriodLabel: previousPoint?.periodLabel,
    previousValue: previousPoint?.total,
    yearOverYearChange:
      previousPoint?.total && previousPoint.total !== 0
        ? ((latestPoint.total - previousPoint.total) / previousPoint.total) * 100
        : undefined,
    baselinePeriodCode: baselinePoint?.periodCode,
    baselinePeriodLabel: baselinePoint?.periodLabel,
    baselineValue: baselinePoint?.total,
    changeSinceBaseline:
      baselinePoint?.total && baselinePoint.total !== 0
        ? ((latestPoint.total - baselinePoint.total) / baselinePoint.total) * 100
        : undefined,
  };
}

function buildOccupationEmploymentContractType(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
): OccupationEmploymentContractType | null {
  const occupationDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "yrke",
    "occupation",
  ]);
  const contractDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "ansettelsesform",
    "ansettelsesforhold",
    "employment",
  ]);
  const periodDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "tid",
    "year",
    "time",
  ]);

  if (!occupationDimensionCode || !contractDimensionCode || !periodDimensionCode) {
    return null;
  }

  const relevantRows = dataset.rows.filter(
    (row) =>
      row.dimensions[occupationDimensionCode]?.code === occupationCode &&
      row.value !== null,
  );

  if (relevantRows.length === 0) {
    return null;
  }

  const period = relevantRows[0].dimensions[periodDimensionCode];
  const contract = relevantRows.reduce(
    (result, row) => {
      const contractCode = row.dimensions[contractDimensionCode]?.code;

      if (contractCode === "0") {
        result.total = row.value ?? undefined;
      }

      if (contractCode === "F") {
        result.permanent = row.value ?? undefined;
      }

      if (contractCode === "M") {
        result.temporary = row.value ?? undefined;
      }

      if (contractCode === "09") {
        result.unspecified = row.value ?? undefined;
      }

      return result;
    },
    {
      total: undefined as number | undefined,
      permanent: undefined as number | undefined,
      temporary: undefined as number | undefined,
      unspecified: undefined as number | undefined,
    },
  );

  const denominator =
    contract.total ??
    (contract.permanent ?? 0) + (contract.temporary ?? 0) + (contract.unspecified ?? 0);
  const safeDenominator = denominator ?? 0;

  return {
    periodCode: period.code,
    periodLabel: period.label,
    total: contract.total,
    permanent: contract.permanent,
    temporary: contract.temporary,
    unspecified: contract.unspecified,
    permanentShare:
      contract.permanent !== undefined && safeDenominator > 0
        ? (contract.permanent / safeDenominator) * 100
        : undefined,
    temporaryShare:
      contract.temporary !== undefined && safeDenominator > 0
        ? (contract.temporary / safeDenominator) * 100
        : undefined,
    unspecifiedShare:
      contract.unspecified !== undefined && safeDenominator > 0
        ? (contract.unspecified / safeDenominator) * 100
        : undefined,
  };
}

function findOccupationLabelFromDataset(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
) {
  const occupationDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "yrke",
    "occupation",
  ]);

  if (!occupationDimensionCode) {
    return undefined;
  }

  return dataset.rows.find(
    (row) => row.dimensions[occupationDimensionCode]?.code === occupationCode,
  )?.dimensions[occupationDimensionCode]?.label;
}

function buildOccupationSalaryDistribution(
  dataset: SsbNormalizedDataset,
  occupationCode: string,
): OccupationSalaryDistribution | null {
  const occupationDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "yrke",
    "occupation",
  ]);
  const genderDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "kjonn",
    "sex",
  ]);
  const measureDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "maalemetode",
    "statistikkmal",
    "measure",
    "contentscode",
    "contents",
  ]);
  const periodDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "tid",
    "quarter",
  ]);

  if (!occupationDimensionCode || !genderDimensionCode || !measureDimensionCode) {
    throw new Error("Fant ikke forventede dimensjoner for lÃ¸nnsfordeling i tabell 11658.");
  }

  const relevantRows = dataset.rows.filter(
    (row) => row.dimensions[occupationDimensionCode]?.code === occupationCode,
  );

  if (relevantRows.length === 0) {
    return null;
  }

  const rowsByGender = relevantRows.reduce(
    (map, row) => {
      const gender = row.dimensions[genderDimensionCode];
      const measure = row.dimensions[measureDimensionCode];

      if (!gender || !measure || row.value === null) {
        return map;
      }

      const existing = map.get(gender.code) ?? {};

      if (measure.code === "02") {
        existing.average = row.value;
      }

      if (measure.code === "01") {
        existing.median = row.value;
      }

      if (measure.code === "051") {
        existing.p25 = row.value;
      }

      if (measure.code === "061") {
        existing.p75 = row.value;
      }

      map.set(gender.code, existing);
      return map;
    },
    new Map<string, OccupationSalaryDistributionMetrics>(),
  );

  const distribution: OccupationSalaryDistribution = {
    occupationCode,
    occupationLabel: relevantRows[0]?.dimensions[occupationDimensionCode]?.label ?? occupationCode,
    periodLabel: periodDimensionCode
      ? relevantRows[0]?.dimensions[periodDimensionCode]?.label
      : undefined,
    updated: dataset.updated,
    total: rowsByGender.get("0"),
    women: rowsByGender.get("2"),
    men: rowsByGender.get("1"),
  };

  return hasAnyDistributionMetrics(distribution.total) ||
    hasAnyDistributionMetrics(distribution.women) ||
    hasAnyDistributionMetrics(distribution.men)
    ? distribution
    : null;
}

function buildInflationQuarterSeries(dataset: SsbNormalizedDataset): InflationQuarterPoint[] {
  const periodDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "tid",
    "time",
    "month",
  ]);

  if (!periodDimensionCode) {
    throw new Error(`Fant ikke tidsdimensjon i KPI-tabell ${SSB_INFLATION_TABLE_ID}.`);
  }

  const quarterlyValues = dataset.rows.reduce((map, row) => {
    const period = row.dimensions[periodDimensionCode];

    if (!period || row.value === null) {
      return map;
    }

    const quarter = toQuarterFromMonthCode(period.code);

    if (!quarter) {
      return map;
    }

    const existing = map.get(quarter.periodCode) ?? {
      periodCode: quarter.periodCode,
      periodLabel: quarter.periodLabel,
      values: [] as number[],
    };

    existing.values.push(row.value);
    map.set(quarter.periodCode, existing);
    return map;
  }, new Map<string, { periodCode: string; periodLabel: string; values: number[] }>());

  const quarterlySeries = Array.from(quarterlyValues.values())
    .filter((entry) => entry.values.length === 3)
    .map((entry) => ({
      periodCode: entry.periodCode,
      periodLabel: entry.periodLabel,
      averageIndex: entry.values.reduce((sum, value) => sum + value, 0) / entry.values.length,
    }))
    .sort((left, right) => left.periodCode.localeCompare(right.periodCode, "nb-NO"));

  return quarterlySeries.map((point) => {
    const previousPeriodCode = getPreviousYearQuarterCode(point.periodCode);
    const previousPoint = quarterlySeries.find((candidate) => candidate.periodCode === previousPeriodCode);
    const yearOverYearChange =
      previousPoint && previousPoint.averageIndex !== 0
        ? ((point.averageIndex - previousPoint.averageIndex) / previousPoint.averageIndex) * 100
        : undefined;

    return {
      ...point,
      yearOverYearChange,
    };
  });
}

function hasAnyDistributionMetrics(metrics?: OccupationSalaryDistributionMetrics) {
  return Boolean(
    metrics &&
      [metrics.p25, metrics.median, metrics.p75, metrics.average].some((value) =>
        Number.isFinite(value),
      ),
  );
}

function buildOccupationPurchasingPowerDetailFromSeries(
  series: OccupationSalaryTimeSeries,
  inflationQuarterSeries: InflationQuarterPoint[],
  options: {
    occupationCode: string;
    salaryTableId: string;
    inflationTableId: string;
    salaryUpdated?: string;
    inflationUpdated?: string;
  },
): OccupationPurchasingPowerDetail | null {
  const inflationByPeriod = new Map(
    inflationQuarterSeries
      .filter((point) => point.yearOverYearChange !== undefined)
      .map((point) => [point.periodCode, point] as const),
  );
  const comparablePeriods = series.points
    .map((point) => normalizeQuarterPeriodCode(point.periodCode, point.periodLabel))
    .filter((periodCode): periodCode is string => Boolean(periodCode))
    .filter((periodCode) => inflationByPeriod.has(periodCode))
    .sort((left, right) => right.localeCompare(left, "nb-NO"));

  const latestPeriodCode = comparablePeriods[0];

  if (!latestPeriodCode) {
    throw new Error(`Fant ingen sammenlignbar KPI-periode for yrkeskode ${options.occupationCode}.`);
  }

  const previousPeriodCode = getPreviousYearQuarterCode(latestPeriodCode);

  if (!previousPeriodCode) {
    throw new Error(`Fant ikke forrige Ã¥rs periode for ${latestPeriodCode}.`);
  }

  const latestSalaryPoint = series.points.find(
    (point) => normalizeQuarterPeriodCode(point.periodCode, point.periodLabel) === latestPeriodCode,
  );
  const previousSalaryPoint = series.points.find(
    (point) => normalizeQuarterPeriodCode(point.periodCode, point.periodLabel) === previousPeriodCode,
  );
  const inflationPoint = inflationByPeriod.get(latestPeriodCode);

  if (
    latestSalaryPoint?.valueAll === undefined ||
    previousSalaryPoint?.valueAll === undefined ||
    inflationPoint?.yearOverYearChange === undefined
  ) {
    return null;
  }

  const salaryGrowth =
    ((latestSalaryPoint.valueAll - previousSalaryPoint.valueAll) / previousSalaryPoint.valueAll) * 100;
  const inflationGrowth = inflationPoint.yearOverYearChange;
  const realGrowth = (((1 + salaryGrowth / 100) / (1 + inflationGrowth / 100)) - 1) * 100;

  return {
    occupationCode: options.occupationCode,
    occupationLabel: series.occupationLabel,
    latestPeriodCode,
    latestPeriodLabel: formatQuarterLabel(latestPeriodCode),
    previousPeriodCode,
    previousPeriodLabel: formatQuarterLabel(previousPeriodCode),
    salaryTableId: options.salaryTableId,
    inflationTableId: options.inflationTableId,
    salaryUpdated: options.salaryUpdated,
    inflationUpdated: options.inflationUpdated,
    latestSalary: latestSalaryPoint.valueAll,
    previousSalary: previousSalaryPoint.valueAll,
    salaryGrowth,
    inflationGrowth,
    realGrowth,
    purchasingPowerInsight: getPurchasingPowerInsight(realGrowth),
  };
}

function buildOccupationPurchasingPowerTimeSeriesPoints(
  salarySeries: OccupationSalaryTimeSeries,
  inflationQuarterSeries: InflationQuarterPoint[],
): OccupationPurchasingPowerTimeSeriesPoint[] {
  const salaryByPeriod = new Map(
    salarySeries.points
      .map((point) => [normalizeQuarterPeriodCode(point.periodCode, point.periodLabel), point] as const)
      .filter((entry): entry is [string, OccupationSalaryTimeSeriesPoint] => Boolean(entry[0])),
  );
  const inflationByPeriod = new Map(
    inflationQuarterSeries
      .filter((point) => point.yearOverYearChange !== undefined)
      .map((point) => [point.periodCode, point] as const),
  );

  return Array.from(salaryByPeriod.keys())
    .filter((periodCode): periodCode is string => inflationByPeriod.has(periodCode))
    .sort((left, right) => left.localeCompare(right, "nb-NO"))
    .flatMap((periodCode) => {
      const salaryPoint = salaryByPeriod.get(periodCode);
      const inflationPoint = inflationByPeriod.get(periodCode);
      const previousPeriodCode = getPreviousYearQuarterCode(periodCode);

      if (!salaryPoint || inflationPoint?.yearOverYearChange === undefined || !previousPeriodCode) {
        return [];
      }

      const previousSalaryPoint = salaryByPeriod.get(previousPeriodCode);

      if (!previousSalaryPoint) {
        return [];
      }

      const inflationGrowth = inflationPoint.yearOverYearChange;
      const salaryGrowthAll = calculateYearOverYearGrowth(
        salaryPoint.valueAll,
        previousSalaryPoint.valueAll,
      );
      const salaryGrowthWomen = calculateYearOverYearGrowth(
        salaryPoint.valueWomen,
        previousSalaryPoint.valueWomen,
      );
      const salaryGrowthMen = calculateYearOverYearGrowth(
        salaryPoint.valueMen,
        previousSalaryPoint.valueMen,
      );

      return [
        {
          periodCode,
          periodLabel: formatQuarterLabel(periodCode),
          salaryGrowthAll,
          salaryGrowthWomen,
          salaryGrowthMen,
          inflationGrowth,
          realGrowthAll: calculateRealGrowth(salaryGrowthAll, inflationGrowth),
          realGrowthWomen: calculateRealGrowth(salaryGrowthWomen, inflationGrowth),
          realGrowthMen: calculateRealGrowth(salaryGrowthMen, inflationGrowth),
        },
      ];
    });
}

function calculateYearOverYearGrowth(current?: number, previous?: number) {
  if (
    current === undefined ||
    previous === undefined ||
    previous === 0
  ) {
    return undefined;
  }

  return ((current - previous) / previous) * 100;
}

function calculateRealGrowth(salaryGrowth?: number, inflationGrowth?: number) {
  if (salaryGrowth === undefined || inflationGrowth === undefined) {
    return undefined;
  }

  return (((1 + salaryGrowth / 100) / (1 + inflationGrowth / 100)) - 1) * 100;
}

function buildOccupationPurchasingPowerRows(
  dataset: SsbNormalizedDataset,
  inflationByPeriod: Map<string, InflationQuarterPoint>,
) {
  const occupationDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "yrke",
    "occupation",
  ]);
  const genderDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "kjonn",
    "sex",
  ]);
  const periodDimensionCode = findDimensionCodeInRows(dataset.dimensions, dataset.rows, [
    "tid",
    "quarter",
    "time",
  ]);

  if (!occupationDimensionCode || !genderDimensionCode || !periodDimensionCode) {
    throw new Error("Fant ikke forventede dimensjoner for kjÃ¸pekraftsoversikten.");
  }

  const rowsByOccupation = dataset.rows.reduce((map, row) => {
    const occupation = row.dimensions[occupationDimensionCode];
    const gender = row.dimensions[genderDimensionCode];
    const period = row.dimensions[periodDimensionCode];
    const normalizedPeriodCode = normalizeQuarterPeriodCode(period?.code, period?.label);

    if (
      !occupation ||
      !gender ||
      !period ||
      !normalizedPeriodCode ||
      row.value === null ||
      gender.code !== "0" ||
      !isFourDigitOccupationCode(occupation.code)
    ) {
      return map;
    }

    const existing = map.get(occupation.code) ?? {
      occupationCode: occupation.code,
      occupationLabel: occupation.label,
      salariesByPeriod: new Map<string, { periodLabel: string; value: number }>(),
    };

    existing.salariesByPeriod.set(normalizedPeriodCode, {
      periodLabel: period.label,
      value: row.value,
    });
    map.set(occupation.code, existing);
    return map;
  }, new Map<string, {
    occupationCode: string;
    occupationLabel: string;
    salariesByPeriod: Map<string, { periodLabel: string; value: number }>;
  }>());

  const latestPeriodCode = Array.from(inflationByPeriod.keys()).sort((left, right) =>
    right.localeCompare(left, "nb-NO"),
  )[0];

  if (!latestPeriodCode) {
    throw new Error("Fant ingen sammenlignbar KPI-periode for kjÃ¸pekraft.");
  }

  const previousPeriodCode = getPreviousYearQuarterCode(latestPeriodCode);
  const inflationPoint = inflationByPeriod.get(latestPeriodCode);

  if (!previousPeriodCode || inflationPoint?.yearOverYearChange === undefined) {
    throw new Error("Fant ikke nok KPI-data til ar-over-ar-sammenligning.");
  }

  const inflationGrowth = inflationPoint.yearOverYearChange;

  const rows: OccupationPurchasingPowerRow[] = Array.from(rowsByOccupation.values())
    .flatMap((occupation) => {
      const latestSalary = occupation.salariesByPeriod.get(latestPeriodCode);
      const previousSalary = occupation.salariesByPeriod.get(previousPeriodCode);

      if (!latestSalary || !previousSalary || previousSalary.value === 0) {
        return [];
      }

      const salaryGrowth = ((latestSalary.value - previousSalary.value) / previousSalary.value) * 100;
      const realGrowth = (((1 + salaryGrowth / 100) / (1 + inflationGrowth / 100)) - 1) * 100;

      return [
        {
          rowKey: occupation.occupationCode,
          occupationCode: occupation.occupationCode,
          occupationLabel: occupation.occupationLabel,
          latestSalary: latestSalary.value,
          previousSalary: previousSalary.value,
          salaryGrowth,
          inflationGrowth,
          realGrowth,
          purchasingPowerInsight: getPurchasingPowerInsight(realGrowth),
        },
      ];
    })
    .sort((left, right) => right.realGrowth - left.realGrowth);

  return {
    latestPeriodCode,
    latestPeriodLabel: formatQuarterLabel(latestPeriodCode),
    previousPeriodCode,
    previousPeriodLabel: formatQuarterLabel(previousPeriodCode),
    inflationGrowth: inflationPoint.yearOverYearChange,
    rows,
  };
}

function decodeCoordinates(index: number, sizes: number[]) {
  const coordinates = Array.from({ length: sizes.length }, () => 0);
  let remainder = index;

  for (let sizeIndex = sizes.length - 1; sizeIndex >= 0; sizeIndex -= 1) {
    const size = sizes[sizeIndex];
    coordinates[sizeIndex] = remainder % size;
    remainder = Math.floor(remainder / size);
  }

  return coordinates;
}

function readStatus(
  status: Awaited<ReturnType<typeof getTableData>>["status"],
  index: number,
) {
  if (Array.isArray(status)) {
    return status[index] ?? null;
  }

  if (status && typeof status === "object") {
    return status[String(index)] ?? null;
  }

  return null;
}

function findDimensionCode(
  dimensions: string[],
  metadataDimensions: SsbTableMetadata["dimension"],
  candidates: string[],
) {
  const normalizedCandidates = candidates.map(normalizeText);

  return dimensions.find((dimensionCode) => {
    const normalizedDimensionCode = normalizeText(dimensionCode);

    if (normalizedCandidates.some((candidate) => normalizedDimensionCode.includes(candidate))) {
      return true;
    }

    const dimensionLabel = metadataDimensions[dimensionCode]?.label;

    if (!dimensionLabel) {
      return false;
    }

    const normalizedLabel = normalizeText(dimensionLabel);
    return normalizedCandidates.some((candidate) => normalizedLabel.includes(candidate));
  });
}

function findDimensionCodeInRows(
  dimensions: string[],
  rows: SsbNormalizedDataset["rows"],
  candidates: string[],
) {
  const normalizedCandidates = candidates.map(normalizeText);

  return dimensions.find((dimensionCode) => {
    const normalizedDimensionCode = normalizeText(dimensionCode);

    if (normalizedCandidates.some((candidate) => normalizedDimensionCode.includes(candidate))) {
      return true;
    }

    const sampleLabel = rows[0]?.dimensions[dimensionCode]?.label;

    if (!sampleLabel) {
      return false;
    }

    const normalizedLabel = normalizeText(sampleLabel);
    return normalizedCandidates.some((candidate) => normalizedLabel.includes(candidate));
  });
}

function formatMeasureLabel(label?: string) {
  if (!label) {
    return "Gjennomsnittlig avtalt mÃ¥nedslÃ¸nn";
  }

  const normalized = normalizeText(label);

  if (normalized.includes("avtalt") && normalized.includes("manedslonn")) {
    return "Gjennomsnittlig avtalt mÃ¥nedslÃ¸nn";
  }

  if (normalized.includes("manedslonn")) {
    return "Gjennomsnittlig mÃ¥nedslÃ¸nn";
  }

  return label;
}

function findCategoryCodeByLabel(
  labels: Record<string, string> | undefined,
  includeCandidates: string[],
  excludeCandidates: string[],
) {
  if (!labels) {
    return undefined;
  }

  return Object.entries(labels).find(([, label]) => {
    const normalizedLabel = normalizeText(label);
    const matchesInclude = includeCandidates.some((candidate) =>
      normalizedLabel.includes(normalizeText(candidate)),
    );
    const matchesExclude = excludeCandidates.some((candidate) =>
      normalizedLabel.includes(normalizeText(candidate)),
    );

    return matchesInclude && !matchesExclude;
  })?.[0];
}

function getMetricUnitFromMetadata(metadata: SsbTableMetadata) {
  const metricDimensionCode = (metadata.role?.metric ?? []).find((dimensionCode) =>
    Boolean(metadata.dimension[dimensionCode]),
  );

  if (!metricDimensionCode) {
    return undefined;
  }

  const metricDimension = metadata.dimension[metricDimensionCode];
  const firstMetricCode = Object.entries(metricDimension.category.index).sort(
    (left, right) => left[1] - right[1],
  )[0]?.[0];

  if (!firstMetricCode) {
    return undefined;
  }

  return metricDimension.category.unit?.[firstMetricCode]?.base;
}

function toQuarterFromMonthCode(periodCode: string) {
  const match = periodCode.match(/^(\d{4})M(0[1-9]|1[0-2])$/);

  if (!match) {
    return undefined;
  }

  const [, year, monthString] = match;
  const month = Number(monthString);
  const quarter = Math.ceil(month / 3);

  return {
    periodCode: `${year}K${quarter}`,
    periodLabel: `${quarter}. kvartal ${year}`,
  };
}

function normalizeQuarterPeriodCode(periodCode?: string, periodLabel?: string) {
  if (periodCode) {
    const quarterCodeMatch = periodCode.match(/^(\d{4})K0?([1-4])$/);

    if (quarterCodeMatch) {
      const [, year, quarter] = quarterCodeMatch;
      return `${year}K${quarter}`;
    }
  }

  const labelSource = periodLabel ?? periodCode;

  if (!labelSource) {
    return undefined;
  }

  const quarterLabelMatch = labelSource.match(/([1-4])\.\s*kvartal\s*(\d{4})/i);

  if (quarterLabelMatch) {
    const [, quarter, year] = quarterLabelMatch;
    return `${year}K${quarter}`;
  }

  return undefined;
}

function getPreviousYearQuarterCode(periodCode: string) {
  const match = periodCode.match(/^(\d{4})K([1-4])$/);

  if (!match) {
    return undefined;
  }

  const [, year, quarter] = match;
  return `${Number(year) - 1}K${quarter}`;
}

function formatQuarterLabel(periodCode: string) {
  const match = periodCode.match(/^(\d{4})K([1-4])$/);

  if (!match) {
    return periodCode;
  }

  const [, year, quarter] = match;
  return `${quarter}. kvartal ${year}`;
}

function getPurchasingPowerInsight(realGrowth: number) {
  if (realGrowth > 0.25) {
    return "Ã˜kt kjÃ¸pekraft";
  }

  if (realGrowth < -0.25) {
    return "Tapt kjÃ¸pekraft";
  }

  return "Omtrent uendret kjÃ¸pekraft";
}

function isFourDigitOccupationCode(code?: string) {
  return Boolean(code && /^\d{4}$/.test(code) && code !== "0000");
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}

