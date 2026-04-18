import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  GeneratedSsbDatasetKey,
  GeneratedSsbManifest,
  NorwaySalaryLaborMarketSummary,
  NorwaySalarySummary,
  NorwaySalaryViewModel,
  OccupationSalaryDistribution,
  OccupationSalaryDistributionMetrics,
  OccupationSalaryTimeSeries,
  OccupationSalaryTimeSeriesPoint,
  SsbNormalizedDataset,
} from "./types";

const GENERATED_DIR = path.join(process.cwd(), "src", "lib", "generated");
const SOURCE_MANIFEST_PATH = path.join(GENERATED_DIR, "manifest.json");
const VIEW_MODEL_DIR = path.join(GENERATED_DIR, "norway-salary-view-model");
const VIEW_MODEL_PATH = path.join(VIEW_MODEL_DIR, "index.json");

const NATIONAL_OCCUPATION_CODE = "0-9";
const NATIONAL_OCCUPATION_LABEL = "Alle yrker";
const ROUTE_HREF = "/lonn-i-norge";

type RequiredDatasetKey =
  | "occupationMedianTimeSeries"
  | "occupationDistributionLatest"
  | "occupationWorkforceTimeSeries"
  | "occupationAgeTimeSeries"
  | "occupationContractLatest";

type DimensionValue = {
  code: string;
  label: string;
};

type DatasetRow = SsbNormalizedDataset["rows"][number];

export async function syncNorwaySalaryViewModel() {
  const manifest = await readJsonFile<GeneratedSsbManifest>(SOURCE_MANIFEST_PATH);
  const datasets = await readSourceDatasets(manifest);
  const salarySeries = buildSalarySeries(datasets.occupationMedianTimeSeries);
  const distribution = buildDistribution(datasets.occupationDistributionLatest);
  const laborMarket = buildLaborMarketSummary({
    workforceDataset: datasets.occupationWorkforceTimeSeries,
    contractDataset: datasets.occupationContractLatest,
    ageDataset: datasets.occupationAgeTimeSeries,
  });
  const summary = buildSummary({
    salarySeries,
    distribution,
  });

  const viewModel: NorwaySalaryViewModel = {
    route: {
      slug: "lonn-i-norge",
      href: ROUTE_HREF,
      title: "Lønn i Norge",
      description:
        "Se lønnsnivå, lønnsutvikling, lønnsfordeling og arbeidsmarkedsnøkkeltall for Norge som helhet, basert på aggregatet Alle yrker fra SSB.",
    },
    generatedAt: new Date().toISOString(),
    sourceGeneratedAt: manifest.generatedAt,
    updated: getLatestUpdated([
      salarySeries.updated,
      distribution?.updated,
      laborMarket.workforceUpdated,
      laborMarket.contractUpdated,
      laborMarket.ageUpdated,
    ]),
    summary,
    salarySeries,
    distribution,
    laborMarket,
  };

  await mkdir(VIEW_MODEL_DIR, { recursive: true });
  await writeFile(VIEW_MODEL_PATH, JSON.stringify(viewModel, null, 2), "utf8");

  console.log(`Skrev nasjonal lønnsmodell til ${VIEW_MODEL_PATH}.`);
}

async function readSourceDatasets(manifest: GeneratedSsbManifest) {
  const keys: RequiredDatasetKey[] = [
    "occupationMedianTimeSeries",
    "occupationDistributionLatest",
    "occupationWorkforceTimeSeries",
    "occupationAgeTimeSeries",
    "occupationContractLatest",
  ];
  const entries = Object.fromEntries(
    manifest.datasets.map((entry) => [entry.key, entry.fileName] as const),
  ) as Partial<Record<GeneratedSsbDatasetKey, string>>;
  const datasets = {} as Record<RequiredDatasetKey, SsbNormalizedDataset>;

  for (const key of keys) {
    const fileName = entries[key];

    if (!fileName) {
      throw new Error(`Fant ikke ${key} i generert SSB-manifest.`);
    }

    datasets[key] = await readJsonFile<SsbNormalizedDataset>(path.join(GENERATED_DIR, fileName));
  }

  return datasets;
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

function buildSalarySeries(dataset: SsbNormalizedDataset): OccupationSalaryTimeSeries {
  const pointsByPeriod = new Map<string, OccupationSalaryTimeSeriesPoint>();

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const period = row.dimensions.Tid;

    if (
      row.value === null ||
      occupation?.code !== NATIONAL_OCCUPATION_CODE ||
      !gender ||
      !period
    ) {
      continue;
    }

    const point = pointsByPeriod.get(period.code) ?? {
      periodCode: period.code,
      periodLabel: formatPeriodLabel(period.label),
    };

    setGenderValue(point, gender.code, row.value);
    pointsByPeriod.set(period.code, point);
  }

  return {
    occupationCode: NATIONAL_OCCUPATION_CODE,
    occupationLabel: NATIONAL_OCCUPATION_LABEL,
    measureLabel: "Median avtalt månedslønn",
    updated: dataset.updated,
    points: Array.from(pointsByPeriod.values()).sort((left, right) =>
      left.periodCode.localeCompare(right.periodCode, "nb-NO"),
    ),
  };
}

function buildDistribution(dataset: SsbNormalizedDataset): OccupationSalaryDistribution | null {
  const metricsByGender = new Map<string, OccupationSalaryDistributionMetrics>();
  let periodLabel: string | undefined;

  for (const row of dataset.rows) {
    const occupation = row.dimensions.Yrke;
    const gender = row.dimensions.Kjonn;
    const measure = row.dimensions.MaaleMetode;
    const period = row.dimensions.Tid;

    if (
      row.value === null ||
      occupation?.code !== NATIONAL_OCCUPATION_CODE ||
      !gender ||
      !measure
    ) {
      continue;
    }

    const metrics = metricsByGender.get(gender.code) ?? {};
    setDistributionMetric(metrics, measure.code, row.value);
    metricsByGender.set(gender.code, metrics);

    if (!periodLabel && period) {
      periodLabel = period.label;
    }
  }

  if (metricsByGender.size === 0) {
    return null;
  }

  return {
    occupationCode: NATIONAL_OCCUPATION_CODE,
    occupationLabel: NATIONAL_OCCUPATION_LABEL,
    periodLabel,
    updated: dataset.updated,
    total: metricsByGender.get("0"),
    women: metricsByGender.get("2"),
    men: metricsByGender.get("1"),
  };
}

function buildLaborMarketSummary({
  workforceDataset,
  contractDataset,
  ageDataset,
}: {
  workforceDataset: SsbNormalizedDataset;
  contractDataset: SsbNormalizedDataset;
  ageDataset: SsbNormalizedDataset;
}): NorwaySalaryLaborMarketSummary {
  const latestWorkforcePeriod = getLatestDimensionCode(workforceDataset.rows, "Tid");
  const latestAgePeriod = getLatestDimensionCode(ageDataset.rows, "Tid");
  const latestContractPeriod = getLatestDimensionCode(contractDataset.rows, "Tid");

  const summary: NorwaySalaryLaborMarketSummary = {
    workforceUpdated: workforceDataset.updated,
    contractUpdated: contractDataset.updated,
    ageUpdated: ageDataset.updated,
  };

  if (latestWorkforcePeriod) {
    const workforceRows = workforceDataset.rows.filter((row) => {
      const occupation = row.dimensions.Yrke;
      const period = row.dimensions.Tid;

      return (
        row.value !== null &&
        occupation?.code === NATIONAL_OCCUPATION_CODE &&
        period?.code === latestWorkforcePeriod
      );
    });

    summary.latestWorkforcePeriodLabel = formatPeriodLabel(
      workforceRows[0]?.dimensions.Tid?.label ?? latestWorkforcePeriod,
    );
    summary.employeesAll = getMetricValue(workforceRows, "Lonsstakere", "0");
    summary.jobsAll = getMetricValue(workforceRows, "AntArbForhold", "0");
  }

  if (latestAgePeriod) {
    const ageRows = ageDataset.rows.filter((row) => {
      const occupation = row.dimensions.Yrke;
      const period = row.dimensions.Tid;

      return (
        row.value !== null &&
        occupation?.code === NATIONAL_OCCUPATION_CODE &&
        period?.code === latestAgePeriod
      );
    });

    summary.latestAgePeriodLabel = formatPeriodLabel(
      ageRows[0]?.dimensions.Tid?.label ?? latestAgePeriod,
    );
    summary.averageAgeAll = getMetricValue(ageRows, "GjsnAlder", "0");
    summary.averageAgeWomen = getMetricValue(ageRows, "GjsnAlder", "2");
    summary.averageAgeMen = getMetricValue(ageRows, "GjsnAlder", "1");
  }

  if (latestContractPeriod) {
    const contractRows = contractDataset.rows.filter((row) => {
      const occupation = row.dimensions.Yrke;
      const period = row.dimensions.Tid;
      const age = row.dimensions.Alder;

      return (
        row.value !== null &&
        occupation?.code === NATIONAL_OCCUPATION_CODE &&
        period?.code === latestContractPeriod &&
        age?.code === "20-66"
      );
    });

    summary.contractPeriodLabel = contractRows[0]?.dimensions.Tid?.label ?? latestContractPeriod;
    summary.employedAll = getDimensionValue(contractRows, "0");
    summary.permanentAll = getDimensionValue(contractRows, "F");
    summary.temporaryAll = getDimensionValue(contractRows, "M");
    summary.permanentShareAll = calculateShare(summary.permanentAll, summary.employedAll);
    summary.temporaryShareAll = calculateShare(summary.temporaryAll, summary.employedAll);
  }

  return summary;
}

function buildSummary({
  salarySeries,
  distribution,
}: {
  salarySeries: OccupationSalaryTimeSeries;
  distribution: OccupationSalaryDistribution | null;
}): NorwaySalarySummary {
  const latestPoint = getLatestPoint(salarySeries.points);
  const medianWomen = latestPoint?.valueWomen;
  const medianMen = latestPoint?.valueMen;

  return {
    title: "Lønn i Norge",
    description:
      "Et samlet bilde av lønnsnivå, lønnsfordeling og arbeidsmarked i Norge, basert på aggregatet Alle yrker fra SSB.",
    href: ROUTE_HREF,
    occupationCode: NATIONAL_OCCUPATION_CODE,
    occupationLabel: NATIONAL_OCCUPATION_LABEL,
    latestPeriodLabel: latestPoint?.periodLabel,
    updated: getLatestUpdated([salarySeries.updated, distribution?.updated]),
    medianAll: latestPoint?.valueAll,
    medianWomen,
    medianMen,
    averageAll: distribution?.total?.average,
    p25All: distribution?.total?.p25,
    p75All: distribution?.total?.p75,
    medianGapAmount:
      medianMen !== undefined && medianWomen !== undefined ? medianMen - medianWomen : undefined,
    medianGapPercent:
      medianMen !== undefined && medianWomen !== undefined && medianMen > 0
        ? ((medianMen - medianWomen) / medianMen) * 100
        : undefined,
  };
}

function setGenderValue(target: OccupationSalaryTimeSeriesPoint, genderCode: string, value: number) {
  if (genderCode === "0") {
    target.valueAll = value;
    return;
  }

  if (genderCode === "2") {
    target.valueWomen = value;
    return;
  }

  if (genderCode === "1") {
    target.valueMen = value;
  }
}

function setDistributionMetric(
  target: OccupationSalaryDistributionMetrics,
  measureCode: string,
  value: number,
) {
  if (measureCode === "01") {
    target.median = value;
    return;
  }

  if (measureCode === "02") {
    target.average = value;
    return;
  }

  if (measureCode === "051") {
    target.p25 = value;
    return;
  }

  if (measureCode === "061") {
    target.p75 = value;
  }
}

function getLatestPoint(points: OccupationSalaryTimeSeriesPoint[]) {
  return [...points].sort((left, right) => left.periodCode.localeCompare(right.periodCode, "nb-NO")).at(-1);
}

function getLatestDimensionCode(rows: DatasetRow[], dimensionKey: string) {
  const codes = rows
    .map((row) => row.dimensions[dimensionKey]?.code)
    .filter((code): code is string => Boolean(code))
    .sort((left, right) => left.localeCompare(right, "nb-NO"));

  return codes.at(-1);
}

function getMetricValue(rows: DatasetRow[], contentsCode: string, genderCode: string) {
  return rows.find(
    (row) =>
      row.dimensions.ContentsCode?.code === contentsCode &&
      row.dimensions.Kjonn?.code === genderCode,
  )?.value ?? undefined;
}

function getDimensionValue(rows: DatasetRow[], dimensionCode: string) {
  return rows.find((row) => row.dimensions.Ansettelsesforhold?.code === dimensionCode)?.value ?? undefined;
}

function calculateShare(value?: number, total?: number) {
  if (value === undefined || total === undefined || total <= 0) {
    return undefined;
  }

  return (value / total) * 100;
}

function formatPeriodLabel(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const compactQuarterMatch = normalized.match(/^(\d{4})K([1-4])$/i);

  if (compactQuarterMatch) {
    return `${compactQuarterMatch[2]}. kvartal ${compactQuarterMatch[1]}`;
  }

  return normalized;
}

function getLatestUpdated(values: Array<string | undefined>) {
  const timestamps = values
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value))
    .filter((value) => !Number.isNaN(value.getTime()))
    .map((value) => value.getTime());

  if (timestamps.length === 0) {
    return undefined;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}
