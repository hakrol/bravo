import {
  getTableData,
  getTableInfo,
  getTableMetadata,
  listTables,
  postTableData,
} from "./client";
import type {
  InflationQuarterPoint,
  OccupationPurchasingPowerDetail,
  OccupationPurchasingPowerOverview,
  OccupationPurchasingPowerTimeSeries,
  OccupationPurchasingPowerTimeSeriesPoint,
  OccupationPurchasingPowerRow,
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

export const ACCOUNTANT_OCCUPATION_CODE = "3313";
export const SSB_INFLATION_TABLE_ID = "14700";

export const SSB_SALARY_TABLES: Record<SsbSalaryTableKey, SsbSalaryTableDefinition> = {
  industryMonthly: {
    key: "industryMonthly",
    id: "13126",
    title: "Månedlig lønn per næring (17 grupper)",
    category: "core",
    description: "Høyfrekvent lønnsutvikling per hovednæring.",
  },
  industryDetailed: {
    key: "industryDetailed",
    id: "12314",
    title: "Lønn og indeks per næring (88 grupper)",
    category: "core",
    description: "Detaljert lønnsnivå og indeks per næring.",
  },
  industryRegion: {
    key: "industryRegion",
    id: "11654",
    title: "Lønn per næring og arbeidssted",
    category: "core",
    description: "Lønn per næring koblet mot arbeidssted og geografi.",
  },
  industrySectorRegion: {
    key: "industrySectorRegion",
    id: "11655",
    title: "Lønn per næring, sektor og arbeidssted",
    category: "core",
    description: "Geografisk lønn med sektorsnitt.",
  },
  occupationDetailed: {
    key: "occupationDetailed",
    id: "11658",
    title: "Lønn per yrke (4-siffer)",
    category: "core",
    description: "Detaljert lønn per yrke.",
  },
  genderAge: {
    key: "genderAge",
    id: "11652",
    title: "Lønn etter kjønn og alder",
    category: "core",
    description: "Demografiske lønnsforskjeller.",
  },
  industryGrowth: {
    key: "industryGrowth",
    id: "12316",
    title: "Jobboppgang og jobbnedgang per næring",
    category: "support",
    description: "Markedsdynamikk per næring.",
  },
  industryHiringFlows: {
    key: "industryHiringFlows",
    id: "12821",
    title: "Nyansettelser og avslutninger per næring",
    category: "support",
    description: "Temperaturmåling for arbeidsmarkedet.",
  },
  salaryWorkforceFlows: {
    key: "salaryWorkforceFlows",
    id: "13876",
    title: "Arbeidskraftsstrømmer og lønn",
    category: "support",
    description: "Kombinerer lønn med mobilitet i arbeidsmarkedet.",
  },
  industryDetailedDemographics: {
    key: "industryDetailedDemographics",
    id: "11656",
    title: "Lønn per detaljert næring, kjønn og alder",
    category: "support",
    description: "Detaljert næring med demografisk segmentering.",
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

export async function getLatestSalaryDataset(
  tableKey: SsbSalaryTableKey,
  filters: SsbSalaryFilters = {},
  lang: SsbLanguage = "no",
): Promise<SsbNormalizedDataset> {
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
}

export async function getLatestSalaryDatasets(
  tableKeys: SsbSalaryTableKey[] = CORE_SALARY_TABLE_KEYS,
  lang: SsbLanguage = "no",
) {
  return Promise.all(tableKeys.map((tableKey) => getLatestSalaryDataset(tableKey, {}, lang)));
}

export async function getOccupationSalaryTimeSeries(
  occupationCode: string,
  filters: SsbSalaryFilters = OCCUPATION_MONTHLY_SALARY_FILTERS,
  lang: SsbLanguage = "no",
): Promise<OccupationSalaryTimeSeries> {
  const table = getSalaryTableDefinition("occupationDetailed");
  const metadata = await getTableMetadata(table.id, lang);
  const query = buildOccupationTimeSeriesQuery(metadata, occupationCode, filters);
  const [info, dataset] = await Promise.all([
    getTableInfo(table.id, lang),
    getTableData(table.id, query, lang),
  ]);

  const normalized = normalizeDataset(dataset, {
    tableId: table.id,
    tableKey: table.key,
    title: info.label,
  });

  return buildOccupationSalaryTimeSeries(normalized, occupationCode);
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
): Promise<OccupationPurchasingPowerDetail> {
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
    throw new Error(`Fant ikke forrige ars periode for ${latestPeriodCode}.`);
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
    occupationLabel: series.occupationLabel,
    latestPeriodCode,
    latestPeriodLabel: formatQuarterLabel(latestPeriodCode),
    previousPeriodCode,
    previousPeriodLabel: formatQuarterLabel(previousPeriodCode),
    salaryTableId: salaryTable.id,
    inflationTableId: SSB_INFLATION_TABLE_ID,
    salaryUpdated: normalizedSalaryDataset.updated,
    inflationUpdated: normalizedInflationDataset.updated,
    latestSalary: latestSalaryPoint.valueAll,
    previousSalary: previousSalaryPoint.valueAll,
    salaryGrowth,
    inflationGrowth,
    realGrowth,
    purchasingPowerInsight: getPurchasingPowerInsight(realGrowth),
  };
}

export async function getOccupationPurchasingPowerTimeSeries(
  occupationCode: string,
  filters: SsbSalaryFilters = OCCUPATION_MONTHLY_SALARY_FILTERS,
  lang: SsbLanguage = "no",
): Promise<OccupationPurchasingPowerTimeSeries> {
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

  const salarySeries = buildOccupationSalaryTimeSeries(normalizedSalaryDataset, occupationCode);
  const inflationQuarterSeries = buildInflationQuarterSeries(normalizedInflationDataset);
  const points = buildOccupationPurchasingPowerTimeSeriesPoints(salarySeries, inflationQuarterSeries);

  return {
    occupationCode,
    occupationLabel: salarySeries.occupationLabel,
    salaryTableId: salaryTable.id,
    inflationTableId: SSB_INFLATION_TABLE_ID,
    salaryUpdated: normalizedSalaryDataset.updated,
    inflationUpdated: normalizedInflationDataset.updated,
    points,
  };
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
    throw new Error(`Fant ingen lonnsdata for yrkeskode ${occupationCode}.`);
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

      if (
        salaryPoint.valueAll === undefined ||
        previousSalaryPoint?.valueAll === undefined ||
        previousSalaryPoint.valueAll === 0
      ) {
        return [];
      }

      const salaryGrowth =
        ((salaryPoint.valueAll - previousSalaryPoint.valueAll) / previousSalaryPoint.valueAll) * 100;
      const inflationGrowth = inflationPoint.yearOverYearChange;
      const realGrowth = (((1 + salaryGrowth / 100) / (1 + inflationGrowth / 100)) - 1) * 100;

      return [
        {
          periodCode,
          periodLabel: formatQuarterLabel(periodCode),
          salaryGrowth,
          inflationGrowth,
          realGrowth,
        },
      ];
    });
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
    throw new Error("Fant ikke forventede dimensjoner for kjopekraftsoversikten.");
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
    throw new Error("Fant ingen sammenlignbar KPI-periode for kjopekraft.");
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
    return "Gjennomsnittlig avtalt manedslonn";
  }

  const normalized = normalizeText(label);

  if (normalized.includes("avtalt") && normalized.includes("manedslonn")) {
    return "Gjennomsnittlig avtalt manedslonn";
  }

  if (normalized.includes("manedslonn")) {
    return "Gjennomsnittlig manedslonn";
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
    return "Okt kjopskraft";
  }

  if (realGrowth < -0.25) {
    return "Tapt kjopskraft";
  }

  return "Omtrent uendret kjopskraft";
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
