import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GENERATED_DIR = path.join(process.cwd(), "src", "lib", "generated");
const SOURCE_MANIFEST_PATH = path.join(GENERATED_DIR, "manifest.json");
const VIEW_MODEL_DIR = path.join(GENERATED_DIR, "apprenticeship-detail-view-models");
const VIEW_MODEL_INDEX_PATH = path.join(VIEW_MODEL_DIR, "index.json");

type GeneratedSsbDatasetKey =
  | "apprenticeshipLatestMedian"
  | "apprenticeshipPreviousMedian"
  | "apprenticeshipMedianTimeSeries"
  | "apprenticeshipDistributionLatest";

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
  title: string;
  updated?: string;
  source?: string;
  dimensions: string[];
  rows: SsbRow[];
};

type ApprenticeshipDetailPage = {
  occupationCode: string;
  label: string;
  editorialLabel?: string;
  displayLabel?: string;
  slug: string;
  href: string;
  detailHref: string;
  summary: string;
  relatedOccupationCodes: string[];
};

type DynamicApprenticeshipPageEntry = {
  page: ApprenticeshipDetailPage;
  aliasSlugs: Set<string>;
  medianWomen?: number;
  medianMen?: number;
  medianAll?: number;
};

let buildDynamicApprenticeshipDetailPage: (
  occupationCode: string,
  label: string,
) => ApprenticeshipDetailPage;
let buildOccupationSalarySlug: (label: string) => string;
let getOccupationDescription: (occupationCode: string) => {
  occupationCode: string;
  intro: string;
} | null;

export async function syncApprenticeshipDetailViewModels() {
  await loadHelpers();
  const manifest = await readJsonFile<GeneratedManifest>(SOURCE_MANIFEST_PATH);
  const datasets = await readSourceDatasets(manifest);
  const pageEntries = buildDynamicApprenticeshipPageEntries(datasets.apprenticeshipLatestMedian);

  await mkdir(VIEW_MODEL_DIR, { recursive: true });

  const pages: Array<{ slug: string; occupationCode: string; fileName: string }> = [];

  for (const [index, entry] of pageEntries.entries()) {
    const relatedPages = pickRelatedPages(pageEntries, index);
    const comparisonOccupationCodes = [
      entry.page.occupationCode,
      ...relatedPages.map((page) => page.occupationCode),
    ];
    const medianOverview = buildMedianOverview(
      datasets.apprenticeshipDistributionLatest,
      comparisonOccupationCodes,
    );
    const growthOverview = buildMedianGrowthOverview(
      datasets.apprenticeshipLatestMedian,
      datasets.apprenticeshipPreviousMedian,
      comparisonOccupationCodes,
    );
    const fileName = `${entry.page.occupationCode}.json`;

    await writeFile(
      path.join(VIEW_MODEL_DIR, fileName),
      JSON.stringify({
        detailPage: entry.page,
        relatedPages,
        occupationDescription: getOccupationDescription(entry.page.occupationCode),
        data: {
          timeSeries: buildSalaryTimeSeries(
            datasets.apprenticeshipMedianTimeSeries,
            entry.page.occupationCode,
            "Median avtalt månedslønn",
          ),
          distribution: buildDistribution(
            datasets.apprenticeshipDistributionLatest,
            entry.page.occupationCode,
          ),
          medianOverview,
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
    JSON.stringify(
      {
        version: 1,
        generatedAt: new Date().toISOString(),
        sourceGeneratedAt: manifest.generatedAt,
        pages: pages.sort((left, right) => left.slug.localeCompare(right.slug, "nb-NO")),
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Skrev ${pageEntries.length} lærlingmodeller til ${VIEW_MODEL_DIR}.`);
}

async function loadHelpers() {
  const detailPages = await import(
    new URL("./occupation-detail-pages.ts", import.meta.url).href
  );
  const descriptions = await import(
    new URL("./occupation-descriptions.ts", import.meta.url).href
  );

  buildDynamicApprenticeshipDetailPage = (occupationCode, label) => {
    const slug = buildApprenticeshipSalarySlug(detailPages.buildOccupationSalarySlug(label));
    const variants = detailPages.getOccupationLabelVariants(occupationCode);
    const canonicalLabel = detailPages.formatOccupationDisplayLabel(label);
    const occupationPage = detailPages.buildDynamicOccupationDetailPage(occupationCode, label);

    return {
      occupationCode,
      label,
      editorialLabel: variants.editorialLabel,
      displayLabel: variants.displayLabel,
      slug,
      href: `/laerling/${slug}`,
      detailHref: occupationPage.href,
      summary: `${canonicalLabel} er blant yrkene som har egne lærlingtall i SSB, og siden samler lønnsutvikling og lønnsnivå for lærlinger i faget.`,
      relatedOccupationCodes: [],
    };
  };
  buildOccupationSalarySlug = detailPages.buildOccupationSalarySlug;
  getOccupationDescription = descriptions.getOccupationDescription;
}

async function readSourceDatasets(manifest: GeneratedManifest) {
  const keys: GeneratedSsbDatasetKey[] = [
    "apprenticeshipLatestMedian",
    "apprenticeshipPreviousMedian",
    "apprenticeshipMedianTimeSeries",
    "apprenticeshipDistributionLatest",
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

function buildDynamicApprenticeshipPageEntries(
  medianDataset: SsbDataset,
): DynamicApprenticeshipPageEntry[] {
  const rows = buildMedianDatasetRows(medianDataset);

  return rows
    .sort((left, right) => left.occupationLabel.localeCompare(right.occupationLabel, "nb-NO"))
    .map((row) => ({
      page: buildDynamicApprenticeshipDetailPage(row.occupationCode, row.occupationLabel),
      aliasSlugs: new Set([buildApprenticeshipSalarySlug(buildOccupationSalarySlug(row.occupationLabel))]),
      medianAll: row.medianAll,
      medianWomen: row.medianWomen,
      medianMen: row.medianMen,
    }));
}

function buildApprenticeshipSalarySlug(labelOrOccupationSlug: string) {
  const occupationSlug = labelOrOccupationSlug.endsWith("-lonn")
    ? labelOrOccupationSlug
    : labelOrOccupationSlug;

  if (occupationSlug.endsWith("-lonn")) {
    return `${occupationSlug.slice(0, -"-lonn".length)}-laerling-lonn`;
  }

  return `${occupationSlug}-laerling-lonn`;
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
    measureLabel: "Median avtalt månedslønn",
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

function buildMedianDatasetRows(dataset: SsbDataset, selectedCodes?: Set<string>) {
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

    if (
      !occupation ||
      !gender ||
      (selectedCodes && !selectedCodes.has(occupation.code)) ||
      !isFourDigitOccupationCode(occupation.code) ||
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

function buildRelatedRows(options: {
  occupationCode: string;
  relatedPages: ApprenticeshipDetailPage[];
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
        detailHref: page.detailHref,
        medianAll: row?.medianAll,
        medianWomen: row?.medianWomen,
        medianMen: row?.medianMen,
        growthWomen: growthRow?.growthWomen,
        growthMen: growthRow?.growthMen,
        groupCode: page.occupationCode.charAt(0),
      };
    })
    .filter((row) => row.occupationCode !== options.occupationCode)
    .filter(
      (row) =>
        row.medianWomen !== undefined || row.medianMen !== undefined || row.medianAll !== undefined,
    )
    .slice(0, 6);
}

function pickRelatedPages(entries: DynamicApprenticeshipPageEntry[], currentIndex: number) {
  const currentEntry = entries[currentIndex];

  if (!currentEntry) {
    return [];
  }

  const currentCode = currentEntry.page.occupationCode;
  const level3Prefix = currentCode.slice(0, 3);
  const level2Prefix = currentCode.slice(0, 2);
  const level1Prefix = currentCode.charAt(0);
  const selectedCodes = new Set<string>();
  const relatedEntries: DynamicApprenticeshipPageEntry[] = [];
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

function buildRelatedCandidateComparator(currentEntry: DynamicApprenticeshipPageEntry) {
  return (left: DynamicApprenticeshipPageEntry, right: DynamicApprenticeshipPageEntry) => {
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

function getGenderCompletenessScore(entry: DynamicApprenticeshipPageEntry) {
  return Number(entry.medianWomen !== undefined) + Number(entry.medianMen !== undefined);
}

function getSalaryDistance(
  entry: DynamicApprenticeshipPageEntry,
  currentEntry: DynamicApprenticeshipPageEntry,
) {
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

  if (
    comparisons === 0 &&
    entry.medianAll !== undefined &&
    currentEntry.medianAll !== undefined
  ) {
    distance += Math.abs(entry.medianAll - currentEntry.medianAll);
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

function calculateYearOverYearGrowth(current?: number, previous?: number) {
  if (current === undefined || previous === undefined || previous === 0) {
    return undefined;
  }

  return ((current - previous) / previous) * 100;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void syncApprenticeshipDetailViewModels().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
