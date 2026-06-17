import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GENERATED_DIR = path.join(process.cwd(), "src", "lib", "generated");
const SOURCE_MANIFEST_PATH = path.join(GENERATED_DIR, "manifest.json");
const VIEW_MODEL_DIR = path.join(GENERATED_DIR, "occupation-detail-view-models");
const VIEW_MODEL_INDEX_PATH = path.join(VIEW_MODEL_DIR, "index.json");

type GeneratedSsbDatasetKey =
  | "occupationLatestAverage"
  | "occupationLatestMedian"
  | "occupationPreviousMedian"
  | "occupationAverageTimeSeries"
  | "occupationMedianTimeSeries"
  | "occupationDistributionLatest"
  | "occupationSectorSalaryLatest"
  | "occupationContractedDistributionLatest"
  | "occupationWorkforceTimeSeries"
  | "occupationAgeTimeSeries"
  | "occupationContractLatest"
  | "inflationQuarterSeries";

type GeneratedManifest = {
  generatedAt: string;
  datasets: Array<{ key: GeneratedSsbDatasetKey; fileName: string }>;
};

type SsbDimensionValue = {
  code: string;
  label: string;
};

type SsbRow = {
  value: number | null;
  dimensions: Record<string, SsbDimensionValue>;
};

type SsbDataset = {
  tableId: string;
  tableKey?: string;
  title: string;
  updated?: string;
  source?: string;
  dimensions: string[];
  rows: SsbRow[];
};

type OccupationDetailPage = {
  occupationCode: string;
  label: string;
  editorialLabel?: string;
  displayLabel?: string;
  slug: string;
  href: string;
  summary: string;
  relatedOccupationCodes: string[];
};

let buildDynamicOccupationDetailPage: (
  occupationCode: string,
  label: string,
) => OccupationDetailPage;
let buildOccupationSalarySlug: (label: string) => string;
let occupationDetailPages: OccupationDetailPage[] = [];
let getOccupationDescription: (occupationCode: string) => {
  occupationCode: string;
  intro: string;
} | null;

type DynamicOccupationPageEntry = {
  page: OccupationDetailPage;
  aliasSlugs: Set<string>;
  medianWomen?: number;
  medianMen?: number;
};

export async function syncOccupationDetailViewModels() {
  await loadOccupationHelpers();
  const manifest = await readJsonFile<GeneratedManifest>(SOURCE_MANIFEST_PATH);
  const datasets = await readSourceDatasets(manifest);
  const pageEntries = buildDynamicOccupationPageEntries(
    datasets.occupationLatestAverage,
    datasets.occupationLatestMedian,
  );

  await mkdir(VIEW_MODEL_DIR, { recursive: true });

  const pages: Array<{ slug: string; occupationCode: string; fileName: string }> = [];

  for (const [index, entry] of pageEntries.entries()) {
    const relatedPages = pickRelatedPages(pageEntries, index);
    const comparisonOccupationCodes = [
      entry.page.occupationCode,
      ...relatedPages.map((page) => page.occupationCode),
    ];
    const medianOverview = buildMedianOverview(
      datasets.occupationDistributionLatest,
      comparisonOccupationCodes,
    );
    const growthOverview = buildMedianGrowthOverview(
      datasets.occupationLatestMedian,
      datasets.occupationPreviousMedian,
      comparisonOccupationCodes,
    );
    const trendData = buildTrendData({
      salaryDataset: datasets.occupationAverageTimeSeries,
      inflationDataset: datasets.inflationQuarterSeries,
      occupationCode: entry.page.occupationCode,
    });
    const fileName = `${entry.page.occupationCode}.json`;

    await writeFile(
      path.join(VIEW_MODEL_DIR, fileName),
      JSON.stringify({
        detailPage: entry.page,
        relatedPages,
        occupationDescription: getOccupationDescription(entry.page.occupationCode),
        data: {
          trendData,
          distribution: buildDistribution(
            datasets.occupationDistributionLatest,
            entry.page.occupationCode,
          ),
          contractedDistribution: buildDistribution(
            datasets.occupationContractedDistributionLatest,
            entry.page.occupationCode,
          ),
          medianOverview,
          laborMarketStats: buildLaborMarketStats({
            workforceDataset: datasets.occupationWorkforceTimeSeries,
            ageDataset: datasets.occupationAgeTimeSeries,
            occupationCode: entry.page.occupationCode,
          }),
          sectorSalarySeries: buildSectorSalaryTimeSeries(
            datasets.occupationSectorSalaryLatest,
            entry.page.occupationCode,
          ),
          medianBasicSalarySeries: buildSalaryTimeSeries(
            datasets.occupationMedianTimeSeries,
            entry.page.occupationCode,
            "Median månedslønn",
          ),
          relatedRows: buildRelatedRows({
            occupationCode: entry.page.occupationCode,
            relatedPages,
            medianOverview,
            growthOverview,
          }),
        },
      }),
      "utf8",
    );

    for (const slug of entry.aliasSlugs) {
      pages.push({ slug, occupationCode: entry.page.occupationCode, fileName });
    }
  }

  await writeFile(
    VIEW_MODEL_INDEX_PATH,
    JSON.stringify({
      version: 1,
      generatedAt: new Date().toISOString(),
      sourceGeneratedAt: manifest.generatedAt,
      pages: pages.sort((left, right) => left.slug.localeCompare(right.slug, "nb-NO")),
    }, null, 2),
    "utf8",
  );

  console.log(`Skrev ${pageEntries.length} yrkesmodeller til ${VIEW_MODEL_DIR}.`);
}

async function loadOccupationHelpers() {
  const detailPages = await import(
    new URL("./occupation-detail-pages.ts", import.meta.url).href
  );
  const descriptions = await import(
    new URL("./occupation-descriptions.ts", import.meta.url).href
  );

  buildDynamicOccupationDetailPage = detailPages.buildDynamicOccupationDetailPage;
  buildOccupationSalarySlug = detailPages.buildOccupationSalarySlug;
  occupationDetailPages = detailPages.occupationDetailPages;
  getOccupationDescription = descriptions.getOccupationDescription;
}

async function readSourceDatasets(manifest: GeneratedManifest) {
  const keys: GeneratedSsbDatasetKey[] = [
    "occupationLatestAverage",
    "occupationLatestMedian",
    "occupationPreviousMedian",
    "occupationAverageTimeSeries",
    "occupationMedianTimeSeries",
    "occupationDistributionLatest",
    "occupationSectorSalaryLatest",
    "occupationContractedDistributionLatest",
    "occupationWorkforceTimeSeries",
    "occupationAgeTimeSeries",
    "occupationContractLatest",
    "inflationQuarterSeries",
  ];
  const entries = Object.fromEntries(
    manifest.datasets.map((entry) => [entry.key, entry.fileName] as const),
  ) as Partial<Record<GeneratedSsbDatasetKey, string>>;
  const datasets = {} as Record<GeneratedSsbDatasetKey, SsbDataset>;

  for (const key of keys) {
    const fileName = entries[key];

    if (!fileName) {
      throw new Error(`Fant ikke ${key} i generert SSB-manifest.`);
    }

    datasets[key] = await readJsonFile<SsbDataset>(path.join(GENERATED_DIR, fileName));
  }

  return datasets;
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

function buildDynamicOccupationPageEntries(
  averageDataset: SsbDataset,
  medianDataset: SsbDataset,
): DynamicOccupationPageEntry[] {
  const medianRows = buildSalaryOverview(medianDataset);
  const medianRowsByCode = new Map(medianRows.map((row) => [row.occupationCode, row] as const));
  const rowsByCode = new Map<string, { occupationCode: string; labels: Set<string> }>();

  for (const dataset of [averageDataset, medianDataset]) {
    for (const row of buildSalaryOverview(dataset)) {
      const existing = rowsByCode.get(row.occupationCode) ?? {
        occupationCode: row.occupationCode,
        labels: new Set<string>(),
      };

      existing.labels.add(row.occupationLabel);
      rowsByCode.set(row.occupationCode, existing);
    }
  }

  return Array.from(rowsByCode.values())
    .sort((left, right) =>
      Array.from(left.labels)[0].localeCompare(Array.from(right.labels)[0], "nb-NO"),
    )
    .map((row) => {
      const labels = Array.from(row.labels);
      const primaryLabel = labels[0];

      return {
        page: buildDynamicOccupationDetailPage(row.occupationCode, primaryLabel),
        aliasSlugs: new Set([
          ...labels.map((label) => buildOccupationSalarySlug(label)),
          ...getLegacySlugAliases(row.occupationCode),
        ]),
        medianWomen: medianRowsByCode.get(row.occupationCode)?.salaryWomen,
        medianMen: medianRowsByCode.get(row.occupationCode)?.salaryMen,
      };
    });
}

function buildSalaryOverview(dataset: SsbDataset) {
  const rowsByCode = new Map<string, {
    occupationCode: string;
    occupationLabel: string;
    salaryAll?: number;
    salaryWomen?: number;
    salaryMen?: number;
  }>();

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;

    if (!occupation || !gender || !isFourDigitOccupationCode(occupation.code)) {
      continue;
    }

    const existing = rowsByCode.get(occupation.code) ?? {
      occupationCode: occupation.code,
      occupationLabel: occupation.label,
    };

    if (row.value !== null) {
      setGenderValue(existing, gender.code, row.value, "salary");
    }

    rowsByCode.set(occupation.code, existing);
  }

  return Array.from(rowsByCode.values());
}

function buildMedianOverview(dataset: SsbDataset, occupationCodes: string[]) {
  const selectedCodes = new Set(occupationCodes);
  const rowsByCode = new Map<string, {
    rowKey: string;
    occupationCode: string;
    occupationLabel: string;
    medianAll?: number;
    medianWomen?: number;
    medianMen?: number;
  }>();

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const measure = row.dimensions.MaaleMetode;

    if (
      !occupation ||
      !gender ||
      measure?.code !== "01" ||
      !selectedCodes.has(occupation.code) ||
      row.value === null
    ) {
      continue;
    }

    const existing = rowsByCode.get(occupation.code) ?? {
      rowKey: occupation.code,
      occupationCode: occupation.code,
      occupationLabel: occupation.label,
    };

    setGenderValue(existing, gender.code, row.value, "median");
    rowsByCode.set(occupation.code, existing);
  }

  return {
    rows: Array.from(rowsByCode.values()).sort(
      (left, right) => (right.medianAll ?? -1) - (left.medianAll ?? -1),
    ),
    periodLabel: findFirstDimensionLabel(dataset, "Tid"),
    measureLabel: "Median månedslønn",
  };
}

function buildMedianGrowthOverview(
  latestDataset: SsbDataset,
  previousDataset: SsbDataset,
  occupationCodes: string[],
) {
  const selectedCodes = new Set(occupationCodes);
  const latest = buildMedianDatasetRows(latestDataset, selectedCodes);
  const previous = buildMedianDatasetRows(previousDataset, selectedCodes);

  return {
    rows: latest.map((row) => {
      const previousRow = previous.find((candidate) => candidate.occupationCode === row.occupationCode);

      return {
        ...row,
        growthWomen: calculateYearOverYearGrowth(row.medianWomen, previousRow?.medianWomen),
        growthMen: calculateYearOverYearGrowth(row.medianMen, previousRow?.medianMen),
      };
    }),
  };
}

function buildMedianDatasetRows(dataset: SsbDataset, selectedCodes: Set<string>) {
  const rowsByCode = new Map<string, {
    rowKey: string;
    occupationCode: string;
    occupationLabel: string;
    medianAll?: number;
    medianWomen?: number;
    medianMen?: number;
  }>();

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;

    if (!occupation || !gender || !selectedCodes.has(occupation.code) || row.value === null) {
      continue;
    }

    const existing = rowsByCode.get(occupation.code) ?? {
      rowKey: occupation.code,
      occupationCode: occupation.code,
      occupationLabel: occupation.label,
    };

    setGenderValue(existing, gender.code, row.value, "median");
    rowsByCode.set(occupation.code, existing);
  }

  return Array.from(rowsByCode.values());
}

function buildDistribution(dataset: SsbDataset, occupationCode: string) {
  const rowsByGender = new Map<string, {
    p25?: number;
    median?: number;
    p75?: number;
    average?: number;
  }>();
  let occupationLabel = occupationCode;

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const measure = row.dimensions.MaaleMetode;

    if (!occupation || occupation.code !== occupationCode || !gender || !measure || row.value === null) {
      continue;
    }

    occupationLabel = occupation.label;
    const metrics = rowsByGender.get(gender.code) ?? {};

    switch (measure.code) {
      case "051":
        metrics.p25 = row.value;
        break;
      case "01":
        metrics.median = row.value;
        break;
      case "061":
        metrics.p75 = row.value;
        break;
      case "02":
        metrics.average = row.value;
        break;
    }

    rowsByGender.set(gender.code, metrics);
  }

  return {
    occupationCode,
    occupationLabel,
    periodLabel: findFirstDimensionLabel(dataset, "Tid"),
    updated: dataset.updated,
    total: rowsByGender.get("0"),
    women: rowsByGender.get("2"),
    men: rowsByGender.get("1"),
  };
}

function buildTrendData(options: {
  salaryDataset: SsbDataset;
  inflationDataset: SsbDataset;
  occupationCode: string;
}) {
  const series = buildSalaryTimeSeries(
    options.salaryDataset,
    options.occupationCode,
    "Gjennomsnittlig avtalt månedslønn",
  );
  const inflationQuarterSeries = buildInflationQuarterSeries(options.inflationDataset);
  const purchasingPower = buildPurchasingPowerDetail({
    series,
    inflationQuarterSeries,
    occupationCode: options.occupationCode,
    salaryTableId: options.salaryDataset.tableId,
    inflationTableId: options.inflationDataset.tableId,
    salaryUpdated: options.salaryDataset.updated,
    inflationUpdated: options.inflationDataset.updated,
  });

  return {
    series,
    purchasingPower,
    purchasingPowerSeries: {
      occupationCode: options.occupationCode,
      occupationLabel: series.occupationLabel,
      salaryTableId: options.salaryDataset.tableId,
      inflationTableId: options.inflationDataset.tableId,
      salaryUpdated: options.salaryDataset.updated,
      inflationUpdated: options.inflationDataset.updated,
      points: buildPurchasingPowerTimeSeriesPoints(series, inflationQuarterSeries),
    },
  };
}

function buildSalaryTimeSeries(dataset: SsbDataset, occupationCode: string, measureLabel: string) {
  const pointsByPeriod = new Map<string, {
    periodCode: string;
    periodLabel: string;
    valueAll?: number;
    valueWomen?: number;
    valueMen?: number;
  }>();
  let occupationLabel = occupationCode;

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const period = row.dimensions.Tid;

    if (!occupation || occupation.code !== occupationCode || !gender || !period || row.value === null) {
      continue;
    }

    occupationLabel = occupation.label;
    const existing = pointsByPeriod.get(period.code) ?? {
      periodCode: period.code,
      periodLabel: period.label,
    };

    setGenderValue(existing, gender.code, row.value, "value");
    pointsByPeriod.set(period.code, existing);
  }

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

function buildInflationQuarterSeries(dataset: SsbDataset) {
  const quarterlyValues = new Map<string, { periodCode: string; periodLabel: string; values: number[] }>();

  for (const row of dataset.rows) {
    const period = row.dimensions.Tid;
    const quarter = period ? toQuarterFromMonthCode(period.code) : undefined;

    if (!quarter || row.value === null) {
      continue;
    }

    const existing = quarterlyValues.get(quarter.periodCode) ?? { ...quarter, values: [] };
    existing.values.push(row.value);
    quarterlyValues.set(quarter.periodCode, existing);
  }

  const quarterlySeries = Array.from(quarterlyValues.values())
    .filter((entry) => entry.values.length === 3)
    .map((entry) => ({
      periodCode: entry.periodCode,
      periodLabel: entry.periodLabel,
      averageIndex: entry.values.reduce((sum, value) => sum + value, 0) / entry.values.length,
    }))
    .sort((left, right) => left.periodCode.localeCompare(right.periodCode, "nb-NO"));

  return quarterlySeries.map((point) => {
    const previousPoint = quarterlySeries.find(
      (candidate) => candidate.periodCode === getPreviousYearQuarterCode(point.periodCode),
    );

    return {
      ...point,
      yearOverYearChange:
        previousPoint && previousPoint.averageIndex !== 0
          ? ((point.averageIndex - previousPoint.averageIndex) / previousPoint.averageIndex) * 100
          : undefined,
    };
  });
}

function buildPurchasingPowerDetail(options: {
  series: ReturnType<typeof buildSalaryTimeSeries>;
  inflationQuarterSeries: ReturnType<typeof buildInflationQuarterSeries>;
  occupationCode: string;
  salaryTableId: string;
  inflationTableId: string;
  salaryUpdated?: string;
  inflationUpdated?: string;
}) {
  const inflationByPeriod = new Map(
    options.inflationQuarterSeries
      .filter((point) => point.yearOverYearChange !== undefined)
      .map((point) => [point.periodCode, point] as const),
  );
  const latestPeriodCode = options.series.points
    .map((point) => normalizeQuarterPeriodCode(point.periodCode, point.periodLabel))
    .filter((periodCode): periodCode is string => Boolean(periodCode))
    .filter((periodCode) => inflationByPeriod.has(periodCode))
    .sort((left, right) => right.localeCompare(left, "nb-NO"))[0];
  const previousPeriodCode = latestPeriodCode ? getPreviousYearQuarterCode(latestPeriodCode) : undefined;
  const latestSalaryPoint = options.series.points.find(
    (point) => normalizeQuarterPeriodCode(point.periodCode, point.periodLabel) === latestPeriodCode,
  );
  const previousSalaryPoint = options.series.points.find(
    (point) => normalizeQuarterPeriodCode(point.periodCode, point.periodLabel) === previousPeriodCode,
  );
  const inflationPoint = latestPeriodCode ? inflationByPeriod.get(latestPeriodCode) : undefined;

  if (
    !latestPeriodCode ||
    !previousPeriodCode ||
    latestSalaryPoint?.valueAll === undefined ||
    previousSalaryPoint?.valueAll === undefined ||
    previousSalaryPoint.valueAll === 0 ||
    inflationPoint?.yearOverYearChange === undefined
  ) {
    return null;
  }

  const salaryGrowth =
    ((latestSalaryPoint.valueAll - previousSalaryPoint.valueAll) / previousSalaryPoint.valueAll) * 100;
  const inflationGrowth = inflationPoint.yearOverYearChange;
  const realGrowth = calculateRealGrowth(salaryGrowth, inflationGrowth) ?? 0;

  return {
    occupationCode: options.occupationCode,
    occupationLabel: options.series.occupationLabel,
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

function buildPurchasingPowerTimeSeriesPoints(
  series: ReturnType<typeof buildSalaryTimeSeries>,
  inflationQuarterSeries: ReturnType<typeof buildInflationQuarterSeries>,
) {
  const salaryByPeriod = new Map(
    series.points
      .map((point) => [normalizeQuarterPeriodCode(point.periodCode, point.periodLabel), point] as const)
      .filter((entry): entry is [string, (typeof series.points)[number]] => Boolean(entry[0])),
  );
  const inflationByPeriod = new Map(
    inflationQuarterSeries
      .filter((point) => point.yearOverYearChange !== undefined)
      .map((point) => [point.periodCode, point] as const),
  );

  return Array.from(salaryByPeriod.keys())
    .filter((periodCode) => inflationByPeriod.has(periodCode))
    .sort((left, right) => left.localeCompare(right, "nb-NO"))
    .flatMap((periodCode) => {
      const salaryPoint = salaryByPeriod.get(periodCode);
      const inflationPoint = inflationByPeriod.get(periodCode);
      const previousPeriodCode = getPreviousYearQuarterCode(periodCode);
      const previousSalaryPoint = previousPeriodCode ? salaryByPeriod.get(previousPeriodCode) : undefined;

      if (!salaryPoint || !previousSalaryPoint || inflationPoint?.yearOverYearChange === undefined) {
        return [];
      }

      const inflationGrowth = inflationPoint.yearOverYearChange;
      const salaryGrowthAll = calculateYearOverYearGrowth(salaryPoint.valueAll, previousSalaryPoint.valueAll);
      const salaryGrowthWomen = calculateYearOverYearGrowth(salaryPoint.valueWomen, previousSalaryPoint.valueWomen);
      const salaryGrowthMen = calculateYearOverYearGrowth(salaryPoint.valueMen, previousSalaryPoint.valueMen);

      return [{
        periodCode,
        periodLabel: formatQuarterLabel(periodCode),
        salaryGrowthAll,
        salaryGrowthWomen,
        salaryGrowthMen,
        inflationGrowth,
        realGrowthAll: calculateRealGrowth(salaryGrowthAll, inflationGrowth),
        realGrowthWomen: calculateRealGrowth(salaryGrowthWomen, inflationGrowth),
        realGrowthMen: calculateRealGrowth(salaryGrowthMen, inflationGrowth),
      }];
    });
}

function buildLaborMarketStats(options: {
  workforceDataset: SsbDataset;
  ageDataset: SsbDataset;
  occupationCode: string;
}) {
  const workforcePoints = buildWorkforcePoints(options.workforceDataset, options.occupationCode);
  const ageSeries = buildAgeSeries(options.ageDataset, options.occupationCode);
  const latestWorkforce = workforcePoints.at(-1);
  const latestAge = ageSeries.at(-1);
  const occupationLabel =
    latestWorkforce?.occupationLabel ??
    latestAge?.occupationLabel ??
    options.occupationCode;
  const latestTotal = latestWorkforce?.employeesAll;
  const latestWomen = latestWorkforce?.employeesWomen;
  const latestMen = latestWorkforce?.employeesMen;
  const baselinePoint = workforcePoints[0];
  const previousPoint = latestWorkforce
    ? workforcePoints.find(
        (point) => point.periodCode === getPreviousYearQuarterCode(latestWorkforce.periodCode),
      )
    : undefined;

  return {
    occupationCode: options.occupationCode,
    occupationLabel,
    updated: options.workforceDataset.updated ?? options.ageDataset.updated,
    employeeUnit: "personer",
    jobUnit: "arbeidsforhold",
    workforcePoints: workforcePoints.map(removeOccupationLabel),
    latest: latestWorkforce
      ? {
          occupationCode: options.occupationCode,
          occupationLabel,
          periodCode: latestWorkforce.periodCode,
          periodLabel: latestWorkforce.periodLabel,
          employees: latestWorkforce.employeesAll,
          jobs: latestWorkforce.jobsAll,
          employeeUnit: "personer",
          jobUnit: "arbeidsforhold",
          updated: options.workforceDataset.updated,
        }
      : null,
    genderBreakdown:
      latestWorkforce &&
      latestTotal !== undefined &&
      latestWomen !== undefined &&
      latestMen !== undefined &&
      latestTotal > 0
        ? {
            periodCode: latestWorkforce.periodCode,
            periodLabel: latestWorkforce.periodLabel,
            total: latestTotal,
            women: latestWomen,
            men: latestMen,
            womenShare: (latestWomen / latestTotal) * 100,
            menShare: (latestMen / latestTotal) * 100,
          }
        : null,
    growth:
      latestWorkforce && latestTotal !== undefined
        ? {
            latestPeriodCode: latestWorkforce.periodCode,
            latestPeriodLabel: latestWorkforce.periodLabel,
            latestValue: latestTotal,
            previousPeriodCode: previousPoint?.periodCode,
            previousPeriodLabel: previousPoint?.periodLabel,
            previousValue: previousPoint?.employeesAll,
            yearOverYearChange: calculateYearOverYearGrowth(latestTotal, previousPoint?.employeesAll),
            baselinePeriodCode: baselinePoint?.periodCode,
            baselinePeriodLabel: baselinePoint?.periodLabel,
            baselineValue: baselinePoint?.employeesAll,
            changeSinceBaseline: calculateYearOverYearGrowth(latestTotal, baselinePoint?.employeesAll),
          }
        : null,
    contractType: null,
    age: latestAge
      ? {
          occupationCode: options.occupationCode,
          occupationLabel,
          periodCode: latestAge.periodCode,
          periodLabel: latestAge.periodLabel,
          averageAll: latestAge.averageAll,
          averageWomen: latestAge.averageWomen,
          averageMen: latestAge.averageMen,
          updated: options.ageDataset.updated,
        }
      : null,
    ageSeries: ageSeries.map(removeOccupationLabel),
  };
}

function buildWorkforcePoints(dataset: SsbDataset, occupationCode: string) {
  const pointsByPeriod = new Map<string, {
    occupationLabel: string;
    periodCode: string;
    periodLabel: string;
    employeesAll?: number;
    employeesWomen?: number;
    employeesMen?: number;
    jobsAll?: number;
    jobsWomen?: number;
    jobsMen?: number;
  }>();

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const metric = row.dimensions.ContentsCode;
    const period = row.dimensions.Tid;

    if (!occupation || occupation.code !== occupationCode || !gender || !metric || !period || row.value === null) {
      continue;
    }

    const existing = pointsByPeriod.get(period.code) ?? {
      occupationLabel: occupation.label,
      periodCode: period.code,
      periodLabel: period.label,
    };
    const prefix = metric.code === "AntArbForhold" ? "jobs" : "employees";

    setGenderValue(existing, gender.code, row.value, prefix);
    pointsByPeriod.set(period.code, existing);
  }

  return Array.from(pointsByPeriod.values()).sort((left, right) =>
    left.periodCode.localeCompare(right.periodCode, "nb-NO"),
  );
}

function buildAgeSeries(dataset: SsbDataset, occupationCode: string) {
  const pointsByPeriod = new Map<string, {
    occupationLabel: string;
    periodCode: string;
    periodLabel: string;
    averageAll?: number;
    averageWomen?: number;
    averageMen?: number;
  }>();

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const period = row.dimensions.Tid;

    if (!occupation || occupation.code !== occupationCode || !gender || !period || row.value === null) {
      continue;
    }

    const existing = pointsByPeriod.get(period.code) ?? {
      occupationLabel: occupation.label,
      periodCode: period.code,
      periodLabel: period.label,
    };

    setGenderValue(existing, gender.code, row.value, "average");
    pointsByPeriod.set(period.code, existing);
  }

  return Array.from(pointsByPeriod.values()).sort((left, right) =>
    left.periodCode.localeCompare(right.periodCode, "nb-NO"),
  );
}

function buildSectorSalaryTimeSeries(dataset: SsbDataset, occupationCode: string) {
  const pointsByPeriod = new Map<string, {
    occupationLabel: string;
    periodCode: string;
    periodLabel: string;
    privateMedianAll?: number;
    privateMedianWomen?: number;
    privateMedianMen?: number;
    municipalMedianAll?: number;
    municipalMedianWomen?: number;
    municipalMedianMen?: number;
    stateMedianAll?: number;
    stateMedianWomen?: number;
    stateMedianMen?: number;
    privateAverageAll?: number;
    privateAverageWomen?: number;
    privateAverageMen?: number;
    municipalAverageAll?: number;
    municipalAverageWomen?: number;
    municipalAverageMen?: number;
    stateAverageAll?: number;
    stateAverageWomen?: number;
    stateAverageMen?: number;
  }>();

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const sector = row.dimensions.Sektor;
    const gender = row.dimensions.Kjonn;
    const measure = row.dimensions.MaaleMetode;
    const period = row.dimensions.Tid;

    if (
      !occupation ||
      occupation.code !== occupationCode ||
      !sector ||
      !gender ||
      !measure ||
      !period ||
      row.value === null
    ) {
      continue;
    }

    const sectorPrefix = getSectorSalaryPrefix(sector.code);
    const measurePart = measure.code === "02" ? "Average" : measure.code === "01" ? "Median" : null;
    const genderPart = getGenderFieldSuffix(gender.code);

    if (!sectorPrefix || !measurePart || !genderPart) {
      continue;
    }

    const existing = pointsByPeriod.get(period.code) ?? {
      occupationLabel: occupation.label,
      periodCode: period.code,
      periodLabel: period.label,
    };
    const fieldName = `${sectorPrefix}${measurePart}${genderPart}`;

    (existing as Record<string, number | string>)[fieldName] = row.value;
    pointsByPeriod.set(period.code, existing);
  }

  const points = Array.from(pointsByPeriod.values())
    .sort((left, right) => left.periodCode.localeCompare(right.periodCode, "nb-NO"))
    .map(removeOccupationLabel);

  if (points.length === 0) {
    return null;
  }

  return {
    occupationCode,
    occupationLabel: pointsByPeriod.values().next().value?.occupationLabel ?? occupationCode,
    updated: dataset.updated,
    points,
  };
}

function getSectorSalaryPrefix(sectorCode: string) {
  switch (sectorCode) {
    case "A+B+D+E":
      return "private";
    case "6500":
      return "municipal";
    case "6100":
      return "state";
    default:
      return null;
  }
}

function getGenderFieldSuffix(genderCode: string) {
  switch (genderCode) {
    case "0":
      return "All";
    case "2":
      return "Women";
    case "1":
      return "Men";
    default:
      return null;
  }
}

function removeOccupationLabel<T extends { occupationLabel: string }>(row: T): Omit<T, "occupationLabel"> {
  const point = { ...row } as Omit<T, "occupationLabel"> & { occupationLabel?: string };
  delete point.occupationLabel;
  return point;
}

function buildRelatedRows(options: {
  occupationCode: string;
  relatedPages: OccupationDetailPage[];
  medianOverview: ReturnType<typeof buildMedianOverview>;
  growthOverview: ReturnType<typeof buildMedianGrowthOverview>;
}) {
  const medianRowsByCode = new Map(
    options.medianOverview.rows.map((row) => [row.occupationCode, row] as const),
  );
  const growthByOccupationCode = new Map(
    options.growthOverview.rows.map((row) => [row.occupationCode, row] as const),
  );

  return options.relatedPages
    .map((page) => {
      const row = medianRowsByCode.get(page.occupationCode);
      const growthRow = growthByOccupationCode.get(page.occupationCode);

      return {
        occupationCode: page.occupationCode,
        occupationLabel: row?.occupationLabel ?? page.label,
        href: page.href,
        medianAll: row?.medianAll,
        medianWomen: row?.medianWomen,
        medianMen: row?.medianMen,
        growthWomen: growthRow?.growthWomen,
        growthMen: growthRow?.growthMen,
        groupCode: page.occupationCode.charAt(0),
      };
    })
    .filter((row) => row.occupationCode !== options.occupationCode)
    .filter((row) => row.medianWomen !== undefined || row.medianMen !== undefined)
    .slice(0, 6);
}

function pickRelatedPages(entries: DynamicOccupationPageEntry[], currentIndex: number) {
  const currentEntry = entries[currentIndex];

  if (!currentEntry) {
    return [];
  }

  const currentCode = currentEntry.page.occupationCode;
  const level3Prefix = currentCode.slice(0, 3);
  const level2Prefix = currentCode.slice(0, 2);
  const level1Prefix = currentCode.charAt(0);
  const selectedCodes = new Set<string>();
  const relatedEntries: DynamicOccupationPageEntry[] = [];
  const candidates = entries.filter((_, index) => index !== currentIndex);
  const compareCandidates = buildRelatedCandidateComparator(currentEntry);

  function addCandidatesByPrefix(prefix: string) {
    const scopedCandidates = candidates
      .filter((candidate) => !selectedCodes.has(candidate.page.occupationCode))
      .filter((candidate) => candidate.page.occupationCode.startsWith(prefix))
      .sort(compareCandidates);

    for (const candidate of scopedCandidates) {
      selectedCodes.add(candidate.page.occupationCode);
      relatedEntries.push(candidate);
    }
  }

  addCandidatesByPrefix(level3Prefix);
  addCandidatesByPrefix(level2Prefix);
  addCandidatesByPrefix(level1Prefix);

  const remainingCandidates = candidates
    .filter((candidate) => !selectedCodes.has(candidate.page.occupationCode))
    .sort(compareCandidates);

  for (const candidate of remainingCandidates) {
    selectedCodes.add(candidate.page.occupationCode);
    relatedEntries.push(candidate);
  }

  return relatedEntries.slice(0, 12).map((entry) => entry.page);
}

function buildRelatedCandidateComparator(currentEntry: DynamicOccupationPageEntry) {
  return (left: DynamicOccupationPageEntry, right: DynamicOccupationPageEntry) => {
    const completenessDelta = getGenderCompletenessScore(right) - getGenderCompletenessScore(left);

    if (completenessDelta !== 0) {
      return completenessDelta;
    }

    const distanceDelta = getSalaryDistance(left, currentEntry) - getSalaryDistance(right, currentEntry);

    if (distanceDelta !== 0) {
      return distanceDelta;
    }

    return left.page.label.localeCompare(right.page.label, "nb-NO");
  };
}

function getLegacySlugAliases(occupationCode: string) {
  const legacyPage = occupationDetailPages.find((page) => page.occupationCode === occupationCode);

  if (!legacyPage) {
    return [];
  }

  return Array.from(new Set([legacyPage.slug, ...getManualLegacySlugAliases(occupationCode)]));
}

function getManualLegacySlugAliases(occupationCode: string) {
  switch (occupationCode) {
    case "3313":
      return ["regnskapsforere-lonn"];
    default:
      return [];
  }
}

function setGenderValue(target: Record<string, unknown>, genderCode: string, value: number, prefix: string) {
  if (genderCode === "0") {
    target[`${prefix}All`] = value;
  }

  if (genderCode === "2") {
    target[`${prefix}Women`] = value;
  }

  if (genderCode === "1") {
    target[`${prefix}Men`] = value;
  }
}

function getGenderCompletenessScore(entry: DynamicOccupationPageEntry) {
  return Number(entry.medianWomen !== undefined) + Number(entry.medianMen !== undefined);
}

function getSalaryDistance(entry: DynamicOccupationPageEntry, currentEntry: DynamicOccupationPageEntry) {
  let distance = 0;
  let comparisons = 0;

  if (entry.medianWomen !== undefined && currentEntry.medianWomen !== undefined) {
    distance += Math.abs(entry.medianWomen - currentEntry.medianWomen);
    comparisons += 1;
  }

  if (entry.medianMen !== undefined && currentEntry.medianMen !== undefined) {
    distance += Math.abs(entry.medianMen - currentEntry.medianMen);
    comparisons += 1;
  }

  return comparisons === 0 ? Number.MAX_SAFE_INTEGER : distance;
}

function findFirstDimensionLabel(dataset: SsbDataset, dimensionCode: string) {
  return dataset.rows.find((row) => row.dimensions[dimensionCode])?.dimensions[dimensionCode]?.label;
}

function isFourDigitOccupationCode(code?: string) {
  return Boolean(code && /^\d{4}$/.test(code) && code !== "0000");
}

function toQuarterFromMonthCode(periodCode: string) {
  const match = periodCode.match(/^(\d{4})M(0[1-9]|1[0-2])$/);

  if (!match) {
    return undefined;
  }

  const [, year, monthString] = match;
  const quarter = Math.ceil(Number(monthString) / 3);

  return {
    periodCode: `${year}K${quarter}`,
    periodLabel: `${quarter}. kvartal ${year}`,
  };
}

function normalizeQuarterPeriodCode(periodCode?: string, periodLabel?: string) {
  const yearSource = periodCode ?? periodLabel;

  if (yearSource && /^(\d{4})$/.test(yearSource)) {
    return yearSource;
  }

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
  const yearMatch = periodCode.match(/^(\d{4})$/);

  if (yearMatch) {
    return `${Number(yearMatch[1]) - 1}`;
  }

  const match = periodCode.match(/^(\d{4})K([1-4])$/);

  if (!match) {
    return undefined;
  }

  const [, year, quarter] = match;
  return `${Number(year) - 1}K${quarter}`;
}

function formatQuarterLabel(periodCode: string) {
  if (/^\d{4}$/.test(periodCode)) {
    return periodCode;
  }

  const match = periodCode.match(/^(\d{4})K([1-4])$/);

  if (!match) {
    return periodCode;
  }

  const [, year, quarter] = match;
  return `${quarter}. kvartal ${year}`;
}

function calculateYearOverYearGrowth(current?: number, previous?: number) {
  if (current === undefined || previous === undefined || previous === 0) {
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

function getPurchasingPowerInsight(realGrowth: number) {
  if (realGrowth > 0.25) {
    return "Økt kjøpekraft";
  }

  if (realGrowth < -0.25) {
    return "Tapt kjøpekraft";
  }

  return "Omtrent uendret kjøpekraft";
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void syncOccupationDetailViewModels().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
