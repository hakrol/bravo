import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  GeneratedSsbDatasetKey,
  GeneratedSsbManifest,
  JsonStat2Dataset,
  JsonStatDimension,
  SsbNormalizedDataset,
  SsbObservation,
  SsbPostBody,
  SsbQueryParams,
  SsbSalaryFilters,
  SsbSalaryTableKey,
  SsbTableInfo,
  SsbTableMetadata,
} from "./types";

process.env.SSB_DATA_SOURCE = "remote";

const GENERATED_DIR = path.join(process.cwd(), "src", "lib", "generated");
const MANIFEST_PATH = path.join(GENERATED_DIR, "manifest.json");

type DatasetSpec = {
  key: GeneratedSsbDatasetKey;
  fileName: string;
  tableId: string;
  tableKey?: SsbSalaryTableKey;
  buildQuery: (metadata: SsbTableMetadata) => SsbQueryParams | Promise<SsbQueryParams>;
};

async function main() {
  const client = await import(new URL("./client.ts", import.meta.url).href);
  const queries = buildSsbSyncHelpers();

  const specs: DatasetSpec[] = [
    {
      key: "occupationLatestAverage",
      fileName: "occupation-latest-average.json",
      tableId: queries.SSB_SALARY_TABLES.occupationDetailed.id,
      tableKey: "occupationDetailed",
      buildQuery: (metadata) =>
        queries.buildLatestQueryFromMetadata(metadata, queries.OCCUPATION_MONTHLY_SALARY_FILTERS),
    },
    {
      key: "occupationLatestMedian",
      fileName: "occupation-latest-median.json",
      tableId: queries.SSB_SALARY_TABLES.occupationDetailed.id,
      tableKey: "occupationDetailed",
      buildQuery: (metadata) =>
        queries.buildLatestQueryFromMetadata(
          metadata,
          queries.OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
        ),
    },
    {
      key: "occupationPreviousMedian",
      fileName: "occupation-previous-median.json",
      tableId: queries.SSB_SALARY_TABLES.occupationDetailed.id,
      tableKey: "occupationDetailed",
      buildQuery: async (metadata) => {
        const latestQuery = queries.buildLatestQueryFromMetadata(
          metadata,
          queries.OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
        );
        const latestDataset = await client.getTableData(
          queries.SSB_SALARY_TABLES.occupationDetailed.id,
          latestQuery,
          "no",
        );
        const normalizedLatest = queries.normalizeDataset(latestDataset, {
          tableId: queries.SSB_SALARY_TABLES.occupationDetailed.id,
          tableKey: "occupationDetailed",
          title: queries.SSB_SALARY_TABLES.occupationDetailed.title,
        });
        const timeDimensionCode = normalizedLatest.dimensions.find((dimension) =>
          normalizedLatest.rows.some((row) => row.dimensions[dimension]?.code?.startsWith("20")),
        );
        const latestPeriodCode = timeDimensionCode
          ? normalizedLatest.rows[0]?.dimensions[timeDimensionCode]?.code
          : undefined;

        if (!latestPeriodCode) {
          throw new Error("Fant ikke siste periode for median datasett.");
        }

        const previousPeriodCode = latestPeriodCode.replace(
          /^(\d{4})/,
          (value, year) => String(Number(year) - 1),
        );

        return {
          ...latestQuery,
          [`valueCodes[${timeDimensionCode}]`]: previousPeriodCode,
        };
      },
    },
    {
      key: "occupationAverageTimeSeries",
      fileName: "occupation-average-timeseries.json",
      tableId: queries.SSB_SALARY_TABLES.occupationDetailed.id,
      tableKey: "occupationDetailed",
      buildQuery: (metadata) =>
        queries.buildOccupationTimeSeriesQuery(
          metadata,
          "*",
          queries.OCCUPATION_MONTHLY_SALARY_FILTERS,
        ),
    },
    {
      key: "occupationMedianTimeSeries",
      fileName: "occupation-median-timeseries.json",
      tableId: queries.SSB_SALARY_TABLES.occupationDetailed.id,
      tableKey: "occupationDetailed",
      buildQuery: (metadata) =>
        queries.buildOccupationTimeSeriesQuery(
          metadata,
          "*",
          queries.OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
        ),
    },
    {
      key: "occupationDistributionLatest",
      fileName: "occupation-distribution-latest.json",
      tableId: queries.SSB_OCCUPATION_DISTRIBUTION_TABLE_ID,
      buildQuery: (metadata) =>
        queries.buildLatestQueryFromMetadata(metadata, {
          ...queries.OCCUPATION_MONTHLY_SALARY_FILTERS,
          MaaleMetode: ["01", "02", "051", "061"],
          Yrke: "*",
          Sektor: "ALLE",
          Kjonn: ["0", "1", "2"],
          AvtaltVanlig: "0",
          ContentsCode: "AvtaltManedslonn",
        }),
    },
    {
      key: "occupationSupplementTimeSeries",
      fileName: "occupation-supplement-timeseries.json",
      tableId: queries.SSB_OCCUPATION_DISTRIBUTION_TABLE_ID,
      buildQuery: (metadata) =>
        queries.buildOccupationTimeSeriesQuery(
          metadata,
          "*",
          queries.OCCUPATION_SUPPLEMENT_FILTERS,
        ),
    },
    {
      key: "occupationWorkforceTimeSeries",
      fileName: "occupation-workforce-timeseries.json",
      tableId: queries.SSB_SALARY_TABLES.occupationDetailed.id,
      tableKey: "occupationDetailed",
      buildQuery: (metadata) =>
        queries.buildOccupationTimeSeriesQuery(metadata, "*", {
          ...queries.OCCUPATION_WORKFORCE_FILTERS,
          Kjonn: ["0", "1", "2"],
        }),
    },
    {
      key: "occupationAgeTimeSeries",
      fileName: "occupation-age-timeseries.json",
      tableId: queries.SSB_SALARY_TABLES.occupationDetailed.id,
      tableKey: "occupationDetailed",
      buildQuery: (metadata) =>
        queries.buildOccupationTimeSeriesQuery(
          metadata,
          "*",
          queries.OCCUPATION_AVERAGE_AGE_FILTERS,
        ),
    },
    {
      key: "occupationContractLatest",
      fileName: "occupation-contract-latest.json",
      tableId: queries.SSB_OCCUPATION_CONTRACT_TABLE_ID,
      buildQuery: (metadata) => queries.buildOccupationContractTypeQuery(metadata, "*"),
    },
    {
      key: "inflationQuarterSeries",
      fileName: "inflation-quarter-series.json",
      tableId: queries.SSB_INFLATION_TABLE_ID,
      buildQuery: (metadata) => queries.buildInflationQuarterQuery(metadata),
    },
  ];

  await mkdir(GENERATED_DIR, { recursive: true });

  const metadataCache = new Map<string, SsbTableMetadata>();
  const infoCache = new Map<string, SsbTableInfo>();
  const manifestDatasets: GeneratedSsbManifest["datasets"] = [];

  for (const spec of specs) {
    console.log(`Synkroniserer ${spec.key} fra tabell ${spec.tableId} ...`);
    const metadata = await getCachedMetadata(metadataCache, client, spec.tableId);
    const info = await getCachedInfo(infoCache, client, spec.tableId);
    const rawQuery = await spec.buildQuery(metadata);
    const dataset = await fetchNormalizedDataset({
      client,
      queries,
      tableId: spec.tableId,
      tableKey: spec.tableKey,
      title: info.label,
      metadata,
      query: rawQuery,
    });

    await writeFile(
      path.join(GENERATED_DIR, spec.fileName),
      JSON.stringify(dataset),
      "utf8",
    );

    manifestDatasets.push({
      key: spec.key,
      fileName: spec.fileName,
      tableId: spec.tableId,
      tableKey: spec.tableKey,
      title: dataset.title,
      updated: dataset.updated,
      rowCount: dataset.rows.length,
      dimensions: dataset.dimensions,
    });
  }

  const manifest: GeneratedSsbManifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: "ssb",
    datasets: manifestDatasets,
  };

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Ferdig. Skrev ${manifest.datasets.length} datasett til ${GENERATED_DIR}.`);
}

async function getCachedMetadata(
  cache: Map<string, SsbTableMetadata>,
  client: typeof import("./client"),
  tableId: string,
) {
  const cached = cache.get(tableId);

  if (cached) {
    return cached;
  }

  const metadata = await client.getTableMetadata(tableId, "no");
  cache.set(tableId, metadata);
  return metadata;
}

async function getCachedInfo(
  cache: Map<string, SsbTableInfo>,
  client: typeof import("./client"),
  tableId: string,
) {
  const cached = cache.get(tableId);

  if (cached) {
    return cached;
  }

  const info = await client.getTableInfo(tableId, "no");
  cache.set(tableId, info);
  return info;
}

async function fetchNormalizedDataset(options: {
  client: typeof import("./client");
  queries: ReturnType<typeof buildSsbSyncHelpers>;
  tableId: string;
  tableKey?: SsbSalaryTableKey;
  title: string;
  metadata: SsbTableMetadata;
  query: SsbQueryParams;
}): Promise<SsbNormalizedDataset> {
  const estimatedCells = estimateCellCount(options.metadata, options.query);

  if (estimatedCells <= options.client.SSB_MAX_CELLS) {
    const dataset = await options.client.postTableData(
      options.tableId,
      options.queries.buildPostBodyFromQueryParams(options.query),
      { outputFormat: "json-stat2" },
      "no",
    );

    return options.queries.normalizeDataset(dataset, {
      tableId: options.tableId,
      tableKey: options.tableKey,
      title: options.title,
    });
  }

  const splitDimension = pickSplitDimension(options.metadata, options.query);

  if (!splitDimension) {
    throw new Error(
      `Kunne ikke splitte uttrekket for tabell ${options.tableId}. Estimat: ${estimatedCells} celler.`,
    );
  }

  const splitQueries = splitQuery(options.metadata, options.query, splitDimension);
  const chunks: SsbNormalizedDataset[] = [];

  for (const query of splitQueries) {
    chunks.push(
      await fetchNormalizedDataset({
        ...options,
        query,
      }),
    );
  }

  return mergeNormalizedDatasets(chunks, {
    tableId: options.tableId,
    tableKey: options.tableKey,
    title: options.title,
  });
}

function estimateCellCount(metadata: SsbTableMetadata, query: SsbQueryParams) {
  const dimensions = metadata.id ?? Object.keys(metadata.dimension);

  return dimensions.reduce((product, dimension) => {
    return product * getSelectedCodes(metadata, query, dimension).length;
  }, 1);
}

function pickSplitDimension(metadata: SsbTableMetadata, query: SsbQueryParams) {
  const dimensions = metadata.id ?? Object.keys(metadata.dimension);
  const ranked = dimensions
    .map((dimension) => ({
      dimension,
      count: getSelectedCodes(metadata, query, dimension).length,
      priority: getSplitPriority(metadata, dimension),
    }))
    .filter((entry) => entry.count > 1)
    .sort((left, right) => {
      if (left.priority !== right.priority) {
        return left.priority - right.priority;
      }

      return right.count - left.count;
    });

  return ranked[0]?.dimension;
}

function getSplitPriority(metadata: SsbTableMetadata, dimension: string) {
  const label = `${dimension} ${metadata.dimension[dimension]?.label ?? ""}`.toLowerCase();

  if (label.includes("yrke") || label.includes("occupation")) {
    return 0;
  }

  if ((metadata.role?.time ?? []).includes(dimension)) {
    return 1;
  }

  return 2;
}

function splitQuery(metadata: SsbTableMetadata, query: SsbQueryParams, dimension: string) {
  const selectedCodes = getSelectedCodes(metadata, query, dimension);
  const midpoint = Math.ceil(selectedCodes.length / 2);
  const left = selectedCodes.slice(0, midpoint);
  const right = selectedCodes.slice(midpoint);

  return [left, right]
    .filter((codes) => codes.length > 0)
    .map((codes) => ({
      ...query,
      [`valueCodes[${dimension}]`]: codes,
    }));
}

function getSelectedCodes(
  metadata: SsbTableMetadata,
  query: SsbQueryParams,
  dimension: string,
) {
  const selection = query[`valueCodes[${dimension}]`];
  const allCodes = Object.entries(metadata.dimension[dimension].category.index)
    .sort((left, right) => left[1] - right[1])
    .map(([code]) => code);

  if (selection === undefined || selection === "*") {
    return allCodes;
  }

  if (Array.isArray(selection)) {
    return selection.map(String);
  }

  const stringSelection = String(selection);

  if (stringSelection === "*") {
    return allCodes;
  }

  const topMatch = stringSelection.match(/^top\((\d+)\)$/i);

  if (topMatch) {
    return allCodes.slice(-Number(topMatch[1]));
  }

  return [stringSelection];
}

function mergeNormalizedDatasets(
  datasets: SsbNormalizedDataset[],
  options: {
    tableId: string;
    tableKey?: SsbSalaryTableKey;
    title: string;
  },
): SsbNormalizedDataset {
  const [firstDataset] = datasets;

  if (!firstDataset) {
    throw new Error(`Fant ingen datasett å slå sammen for tabell ${options.tableId}.`);
  }

  return {
    tableId: options.tableId,
    tableKey: options.tableKey,
    title: options.title,
    updated: firstDataset.updated,
    source: firstDataset.source,
    dimensions: firstDataset.dimensions,
    rows: datasets.flatMap((dataset) => dataset.rows),
  };
}

function buildSsbSyncHelpers() {
  const OCCUPATION_MONTHLY_SALARY_FILTERS: SsbSalaryFilters = {
    Alder: "999D",
    ContentsCode: "GjAvtaltMdlonn",
  };
  const OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS: SsbSalaryFilters = {
    Alder: "999D",
    ContentsCode: "MedianAvtMndLonn",
  };
  const OCCUPATION_AVERAGE_AGE_FILTERS: SsbSalaryFilters = {
    Alder: "999D",
    ContentsCode: "GjsnAlder",
  };
  const OCCUPATION_SUPPLEMENT_FILTERS: SsbSalaryFilters = {
    MaaleMetode: "02",
    Sektor: "ALLE",
    Kjonn: ["0", "1", "2"],
    AvtaltVanlig: "0",
    ContentsCode: ["Bonus", "Overtid", "Uregtil"],
  };
  const OCCUPATION_WORKFORCE_FILTERS: SsbSalaryFilters = {
    Alder: "999D",
    ContentsCode: ["Lonsstakere", "AntArbForhold"],
  };
  const SSB_INFLATION_TABLE_ID = "14700";
  const SSB_OCCUPATION_DISTRIBUTION_TABLE_ID = "11418";
  const SSB_OCCUPATION_CONTRACT_TABLE_ID = "14437";
  const SSB_SALARY_TABLES = {
    occupationDetailed: {
      id: "11658",
      title: "Lonn per yrke (4-siffer)",
    },
  };

  function buildLatestQueryFromMetadata(
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

  function buildOccupationTimeSeriesQuery(
    metadata: SsbTableMetadata,
    occupationCode: string,
    filters: SsbSalaryFilters,
  ): SsbQueryParams {
    const dimensions = metadata.id ?? Object.keys(metadata.dimension);
    const timeDimensions = new Set(metadata.role?.time ?? []);
    const occupationDimensionCode = findDimensionCode(dimensions, metadata.dimension, [
      "yrke",
      "occupation",
    ]);

    if (!occupationDimensionCode) {
      throw new Error("Fant ikke yrkesdimensjon i metadata.");
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
          throw new Error("Fant ikke KPI-indeksvariabel i tabell 14700.");
        }

        query[`valueCodes[${dimension}]`] = indexCode;
        continue;
      }

      const totalIndexCode = findCategoryCodeByLabel(
        metadataDimension.category.label,
        ["totalindeks", "totalindex", "ialt"],
        [],
      );

      query[`valueCodes[${dimension}]`] = totalIndexCode ?? "*";
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
    const occupationDimensionCode = findDimensionCode(dimensions, metadata.dimension, [
      "yrke",
      "occupation",
    ]);
    const genderDimensionCode = findDimensionCode(dimensions, metadata.dimension, [
      "kjonn",
      "kjønn",
      "sex",
    ]);

    if (!occupationDimensionCode) {
      throw new Error("Fant ikke yrkesdimensjon i metadata for kontrakt.");
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
        query[`valueCodes[${dimension}]`] = ["0", "F", "M", "09"];
        continue;
      }

      if (metricDimensions.has(dimension)) {
        query[`valueCodes[${dimension}]`] =
          findCategoryCodeByLabel(
            metadataDimension.category.label,
            ["arbeidsforhold", "jobber", "jobs", "employment"],
            [],
          ) ?? Object.keys(metadataDimension.category.index)[0];
        continue;
      }

      if (geoDimensions.has(dimension)) {
        query[`valueCodes[${dimension}]`] =
          findCategoryCodeByLabel(metadataDimension.category.label, ["hele landet", "landet"], []) ??
          Object.keys(metadataDimension.category.index)[0];
        continue;
      }

      query[`valueCodes[${dimension}]`] = "*";
    }

    return query;
  }

  function buildPostBodyFromQueryParams(query: SsbQueryParams): SsbPostBody {
    return {
      selection: Object.entries(query).flatMap(([key, value]) => {
        const match = key.match(/^valueCodes\[(.+)\]$/);

        if (!match || value === undefined) {
          return [];
        }

        return [
          {
            variableCode: match[1],
            valueCodes: Array.isArray(value) ? value.map(String) : [String(value)],
          },
        ];
      }),
    };
  }

  function normalizeDataset(
    dataset: JsonStat2Dataset,
    options: {
      tableId: string;
      tableKey?: SsbSalaryTableKey;
      title: string;
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
    const rows: SsbObservation[] = dataset.value.map((value, index) => {
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

  return {
    OCCUPATION_MONTHLY_SALARY_FILTERS,
    OCCUPATION_MEDIAN_BASIC_MONTHLY_EARNINGS_FILTERS,
    OCCUPATION_AVERAGE_AGE_FILTERS,
    OCCUPATION_SUPPLEMENT_FILTERS,
    OCCUPATION_WORKFORCE_FILTERS,
    SSB_INFLATION_TABLE_ID,
    SSB_OCCUPATION_DISTRIBUTION_TABLE_ID,
    SSB_OCCUPATION_CONTRACT_TABLE_ID,
    SSB_SALARY_TABLES,
    buildLatestQueryFromMetadata,
    buildOccupationTimeSeriesQuery,
    buildInflationQuarterQuery,
    buildOccupationContractTypeQuery,
    buildPostBodyFromQueryParams,
    normalizeDataset,
  };
}

function findDimensionCode(
  dimensions: string[],
  metadataDimensions: Record<string, JsonStatDimension>,
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

    return normalizedCandidates.some((candidate) =>
      normalizeText(dimensionLabel).includes(candidate),
    );
  });
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

function readStatus(status: JsonStat2Dataset["status"], index: number) {
  if (Array.isArray(status)) {
    return status[index] ?? null;
  }

  if (status && typeof status === "object") {
    return status[String(index)] ?? null;
  }

  return null;
}

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
